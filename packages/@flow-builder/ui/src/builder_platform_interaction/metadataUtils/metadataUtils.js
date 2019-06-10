const topLevelBlackList = [
    'createdById',
    'createdDate',
    'definitionId',
    'lastModifiedBy',
    'lastModifiedById',
    'lastModifiedDate',
    'manageableState',
    'manageableState',
    'masterLabel',
    'processType',
    'status',
    'id'
];

const dateRegEx = '^.[^T]+';
const dateTimeFormat1 = '^.*[+].*';
const dateTimeFormat2 = '^.*[Z].*';

// Matches dateTimes like this: 2000-12-12T00:00:00.000+0000
const dateTimeFormat1Prefix = '^.[^+]+'; // get everything before the +
const dateTimeFormat1Suffix = '[+].*'; // get everything including and after the +

// Matches dateTimes like this: 1981-07-25T15:32:00.000Z
const dateTimeFormat2Prefix = '^.[^Z]+'; // get everything before the Z

/**
 * Returns an object which represents the diff between the two objects provided.
 * @param {object} beforeObj
 * @param {object} afterObj
 * @param {boolean} useBlackList
 * @param {boolean} trimEmptyItems
 * @param {boolean} ignoreDateTimeFormatDiff - ignore differences in date and dateTime values if it's a
 * formatting issue caused by differences in serialization types but not a difference in actual value.
 *
 * @return {object} object of differences. Anything with '++' indicates a new key in the
 * after object. Anything with '--' indicates a key that was in the old object and is
 * missing in the new object.
 */
export function diffFlow(
    beforeObj,
    afterObj,
    useBlackList,
    trimEmptyItems,
    ignoreDateTimeFormatDiff
) {
    return diffObjects(
        beforeObj,
        afterObj,
        useBlackList,
        trimEmptyItems,
        ignoreDateTimeFormatDiff,
        1
    );
}

/**
 * Helper function for diffFlow. Used internally so we can add the level parameter.
 * @param {object} beforeObj
 * @param {object} afterObj
 * @param {boolean} useBlackList
 * @param {boolean} trimEmptyItems
 * @param {boolean} ignoreDateTimeFormatDiff - ignore differences in date and dateTime values if it's a
 * formatting issue caused by differences in serialization types but not a difference in actual value.
 * @param {number} key level in the map. We only want to use the blacklist on top level keys.
 * This parameter is used to figure out if we're at the top of the object or not.
 * @return {object} object of differences. Anything with '++' indicates a new key in the
 * after object. Anything with '--' indicates a key that was in the old object and is
 * missing in the new object.
 */
function diffObjects(
    beforeObj,
    afterObj,
    useBlackList,
    trimEmptyItems,
    ignoreDateTimeFormatDiff,
    level
) {
    const ret = {};
    for (const item in afterObj) {
        if (!beforeObj.hasOwnProperty(item)) {
            // The thing is only in the after object, not the before.
            // Check for trim mode before adding this as a diff.
            if (trimEmptyItems) {
                if (
                    !(
                        (typeof afterObj[item] === 'string' &&
                            afterObj[item].length === 0) ||
                        afterObj[item] === undefined ||
                        afterObj[item] === null
                    )
                ) {
                    ret['++' + item] = afterObj[item];
                }
            } else {
                ret['++' + item] = afterObj[item];
            }
        } else if (typeof afterObj[item] !== typeof beforeObj[item]) {
            // both before and after have this thing, but they're not the same type.
            // Don't try to diff it, just log it as a diff.
            ret[item] = { BEFORE: beforeObj[item], AFTER: afterObj[item] };
        } else if (
            typeof afterObj[item] === 'string' ||
            typeof afterObj[item] === 'number' ||
            typeof afterObj[item] === 'boolean'
        ) {
            // Both before and after have this item, and the type of the thing is the same, so we'll diff it.
            if (
                !diffLiteral(
                    ignoreDateTimeFormatDiff,
                    item,
                    beforeObj,
                    afterObj
                )
            ) {
                ret[item] = { BEFORE: beforeObj[item], AFTER: afterObj[item] };
            }
        } else {
            // The stuff has more stuff in it. Keep diffing.
            const innerRet = diffObjects(
                beforeObj[item],
                afterObj[item],
                useBlackList,
                trimEmptyItems,
                ignoreDateTimeFormatDiff,
                level + 1
            );
            // something is different
            if (Object.keys(innerRet).length > 0) {
                ret[item] = innerRet;
            }
        }
    }

    // Add anything that is only in the before object, but not the after.
    for (const item in beforeObj) {
        // Item is on the blacklist
        if (
            !(useBlackList && topLevelBlackList.includes(item) && level === 1)
        ) {
            if (!afterObj.hasOwnProperty(item)) {
                if (trimEmptyItems) {
                    if (
                        !(
                            beforeObj[item] === undefined ||
                            beforeObj[item] === null ||
                            (typeof beforeObj[item] === 'object' &&
                                beforeObj[item].length === 0)
                        )
                    ) {
                        ret['--' + item] = beforeObj[item];
                    }
                } else {
                    ret['--' + item] = beforeObj[item];
                }
            }
        }
    }
    return ret;
}

/**
 * Diffs the given items, which should be scalars.
 *
 * @param ignoreDateTimeFormatDiff {boolean}
 * @param item {string} name of item to be differed
 * @param beforeObj {object} before data
 * @param afterObj {object} after data
 * @returns {boolean}
 */
function diffLiteral(ignoreDateTimeFormatDiff, item, beforeObj, afterObj) {
    // date and dateTime values both require special handling if we're told to ignore formatting diffs.
    if (item === 'dateValue' && ignoreDateTimeFormatDiff) {
        return conditionalDateCheck(beforeObj[item], afterObj[item]);
    } else if (item === 'dateTimeValue' && ignoreDateTimeFormatDiff) {
        return conditionalDateTimeCheck(beforeObj[item], afterObj[item]);
    }
    return beforeObj[item] === afterObj[item];
}

function conditionalDateCheck(before, after) {
    const beforeDate = getDateForCompare(before);
    const afterDate = getDateForCompare(after);
    return beforeDate === afterDate;
}

function conditionalDateTimeCheck(before, after) {
    const beforeDate = getDateTimeForCompare(before);
    const afterDate = getDateTimeForCompare(after);
    const suffixEqual = checkDateTimeSuffix(before, after);
    return suffixEqual && beforeDate === afterDate;
}

function getDateForCompare(val) {
    // Figure out which format this date is in and only get the part
    // we care about. If it doesn't match the known pattern, return
    // the original;
    if (val.match(dateRegEx)) {
        return val.match(dateRegEx)[0];
    }
    return val;
}

function getDateTimeForCompare(val) {
    // Figure out which format this dateTime is in and only get the part
    // we care about. If it doesn't match any of the known patterns, return
    // the original;
    if (val.match(dateTimeFormat1)) {
        return val.match(dateTimeFormat1Prefix)[0];
    } else if (val.match(dateTimeFormat2)) {
        return val.match(dateTimeFormat2Prefix)[0];
    }
    return val;
}

// If one dateTime is in format 1 and the other is in format2,
// make sure the one in format1 does have +0000 as its suffix.
//  "1981-07-25T15:32:00.000+0000" === "1981-07-25T15:32:00.000Z"
// But "1981-07-25T15:32:00.000+0300" !== "1981-07-25T15:32:00.000Z"
// So make sure to check the suffix too.
function checkDateTimeSuffix(before, after) {
    if (before.match(dateTimeFormat1) && after.match(dateTimeFormat2)) {
        return verifySuffixIsZeros(before);
    } else if (before.match(dateTimeFormat2) && after.match(dateTimeFormat1)) {
        return verifySuffixIsZeros(after);
    }
    return true;
}

// DateTime is in 2000-12-12T00:00:00.000+0000 format.
// Make sure the end part (everything after +) is 0000.
function verifySuffixIsZeros(value) {
    if (value.match(dateTimeFormat1Suffix)) {
        const suffix = value.match(dateTimeFormat1Suffix)[0];
        return suffix === '+0000';
    }
    return false;
}
