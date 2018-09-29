const topLevelBlackList = ['createdById', 'createdDate', 'definitionId', 'lastModifiedById', 'lastModifiedDate', 'manageableState',
    'manageableState', 'masterLabel', 'processType', 'status', 'id'];

/**
 * Returns an object which represents the diff between the two objects provided.
 * @param {object} beforeObj
 * @param {object} afterObj
 * @param {boolean} useBlackList
 * @param {boolean} trimEmptyItems
 *
 * @return {object} object of differences. Anything with '++' indicates a new key in the
 * after object. Anything with '--' indicates a key that was in the old object and is
 * missing in the new object.
 */
export function diffFlow(beforeObj, afterObj, useBlackList, trimEmptyItems) {
    return diffObjects(beforeObj, afterObj, useBlackList, trimEmptyItems, 1);
}

/**
 * Helper function for diffFlow. Used internally so we can add the level parameter.
 * @param {object} beforeObj
 * @param {object} afterObj
 * @param {boolean} useBlackList
 * @param {boolean} trimEmptyItems
 * @param {number} key level in the map. We only want to use the blacklist on top level keys.
 * This parameter is used to figure out if we're at the top of the object or not.
 * @return {object} object of differences. Anything with '++' indicates a new key in the
 * after object. Anything with '--' indicates a key that was in the old object and is
 * missing in the new object.
 */
function diffObjects(beforeObj, afterObj, useBlackList, trimEmptyItems, level) {
    const ret = {};
    for (const item in afterObj) {
        if (!beforeObj.hasOwnProperty(item)) {
            // The thing is only in the after object, not the before.
            // Check for trim mode before adding this as a diff.
            if (trimEmptyItems) {
                if (!((typeof afterObj[item] === 'string' && afterObj[item].length === 0) ||
                     afterObj[item] === undefined ||
                     afterObj[item] === null)) {
                    ret['++' + item] = afterObj[item];
                }
            } else {
                ret['++' + item] = afterObj[item];
            }
        } else if (typeof afterObj[item] !== typeof beforeObj[item]) {
            // both before and after have this thing, but they're not the same type.
            // Don't try to diff it, just log it as a diff.
            ret[item] = {'BEFORE': beforeObj[item], 'AFTER': afterObj[item]};
        } else if (typeof afterObj[item] === 'string' || typeof afterObj[item] === 'number' || typeof afterObj[item] === 'boolean') {
            // both before and after have this thing, and the type of the thing is the same, so keep diffing.
            if (beforeObj[item] !== afterObj[item]) {
                ret[item] = {'BEFORE': beforeObj[item], 'AFTER': afterObj[item]};
            }
        } else {
                // The stuff has more stuff in it. Keep diffing.
                const innerRet = diffObjects(beforeObj[item], afterObj[item], useBlackList, trimEmptyItems, level + 1);
                // something is different
                if (Object.keys(innerRet).length > 0) {
                    ret[item] = innerRet;
                }
        }
    }

    // Add anything that is only in the before object, but not the after.
    for (const item in beforeObj) {
        // Item is on the blacklist
        if (!(useBlackList && topLevelBlackList.includes(item) && level === 1)) {
            if (!afterObj.hasOwnProperty(item)) {
                if (trimEmptyItems) {
                    if (!(beforeObj[item] === undefined || beforeObj[item] === null ||
                          (typeof beforeObj[item] === 'object' && beforeObj[item].length === 0))) {
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
