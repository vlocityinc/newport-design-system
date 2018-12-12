import { escapeForRegExp, isReference } from 'builder_platform_interaction/commonUtils';

/**
 * Persist original text/subText else clear highlight if present.
 * @param {Object} groupOrItem - Menu data group or item to clear highlighting.
 */
function clearHighlight(groupOrItem) {
    // a menu data group
    if (groupOrItem.items) {
        groupOrItem.items.forEach(item => {
            clearHighlightForItem(item);
        });
    } else {
        // a menu data item
        clearHighlightForItem(groupOrItem);
    }
}

/**
 * Persist original text/subText else clear highlight if present from the menu data item.
 * @param {Object} item - Menu data item to clear the highlighting from its text/subText.
 */
function clearHighlightForItem(item) {
    if (item.text && !item.textNoHighlight) {
        item.textNoHighlight = item.text;
    } else if (hasHighlight(item.text)) {
        item.text = item.textNoHighlight;
    }

    if (item.subText && !item.subTextNoHighlight) {
        item.subTextNoHighlight = item.subText;
    } else if (hasHighlight(item.subText)) {
        item.subText = item.subTextNoHighlight;
    }
}

/**
 * Checks whether the text is highlighted. If it is an Array it is highlighted.
 * @param {Array} text - The input text
 * @returns {boolean} returns true if the text has highlight otherwise false
 */
function hasHighlight(text) {
    return Array.isArray(text);
}

/**
 * Highlights the text and subText in the item.
 * @param {String} filterText - The value used to filter
 * @param {String} escapedFilterText - The filter text value with regex special char escaped
 * @param {Object} item - One item that has matching values in text and/or subText
 */
function highlightItem(filterText, escapedFilterText, item) {
    if (!isEmpty(filterText)) {
        item.text = highlight(filterText, escapedFilterText, item.text);

        if (item.subText) {
            item.subText = highlight(filterText, escapedFilterText, item.subText);
        }
    }
}

/**
 * Creates an array defining parts of the text to highlight in a format that the combobox uses
 * @param {String} filterText - The value used to filter
 * @param {String} escapedFilterText - The filter text value with regex special char escaped
 * @param {String} targetText - The text that needs to be highlighted
 * @return {Array} The new array with highlighted text
 */
function highlight(filterText, escapedFilterText, targetText) {
    // covers small edge case where target text is not a string caused by empty menu item label
    if (typeof targetText !== 'string') {
        return '';
    }
    // lookbehind works only in V8 engine
    // const regex = new RegExp('(?<=' + filterText + ')|(?=' + filterText + ')', 'i');
    let regex;
    // The reason for the following unsightly code is due to unicode restrictions in JS.
    // The 'u' tag causes opening sequence characters to be invalid so { will cause an issue
    // So we try to account for as much unicode as possible, then try without the 'u' tag, then default to no highlight
    try {
        regex = new RegExp('(' + escapedFilterText + ')', 'ui');
    } catch (error1) {
        try {
            regex = new RegExp('(' + escapedFilterText + ')', 'i');
        } catch (error2) {
            return targetText;
        }
    }

    const targetTextArray = targetText.split(regex).filter(String);
    const formattedText = targetTextArray.map(targetTextFragment => {
        return {
            highlight: (targetTextFragment.toLowerCase() === filterText.toLowerCase()),
            text: targetTextFragment
        };
    });
    return formattedText;
}

/**
 * Gets the index of the searchText within text, and returns -1 if not present
 * @param {String} filterText - The search value
 * @param {String} targetText - The original text value
 * @return {Number} The starting index
 */
function getIndex(filterText, targetText) {
    if (filterText && typeof targetText === 'string') {
        return targetText.toLowerCase().indexOf(filterText.toLowerCase());
    }
    return -1;
}

/**
 * Checks if the input value is undefined, null or empty string.
 * @param {String} value input string to evaluate
 * @returns {boolean} return true for undefined, null or empty string otherwise false
 */
function isEmpty(value) {
    return value === undefined || value === null || value === '';
}

/**
 * Filters the data passed in based on the text in a format that the combobox expects
 * @param {String} filterText The value used to filter. This should just be the final string in an expression.
 * If the full value is '{!MyAccount.FirstN}', filterText should be 'FirstN'. If the full value is '{!MyAcc', filterText should be 'MyAcc'.
 * @param {Array} menuData The menu data that needs to be filtered
 * @param {Boolean} isMergeField Whether only merge fields should be in the menu data
 * @return {Array} The filtered and highlighted menu data
 */
export function filterMatches(filterText, menuData, isMergeField) {
    if (!Array.isArray(menuData)) {
        throw new Error(`Menu data must be an array but was ${menuData}`);
    }

    const matchedGroupsOrItems = [];
    const countGroupsOrItems = menuData.length;

    for (let i = 0; i < countGroupsOrItems; i++) {
        clearHighlight(menuData[i] || {});

        // if items is present, its a grouped menu data
        // if its menu data item convert it into array for matching
        let itemsToMatch = menuData[i].items || [menuData[i]];
        if (isMergeField) {
            itemsToMatch = itemsToMatch.filter(menuItem => {
                return isReference(menuItem.displayText);
            });
        }

        const matchedItems = itemsToMatch.filter(menuItem => {
            return isEmpty(filterText) || getIndex(filterText, menuItem.text) !== -1 || getIndex(filterText, menuItem.subText) !== -1 || getIndex(filterText, menuItem.displayText) !== -1;
        });

        const escapedFilterText = isEmpty(filterText) ? filterText : escapeForRegExp(filterText);
        // Only add group with matched items
        if (matchedItems && matchedItems.length > 0) {
            matchedItems.forEach(menuItem => {
                highlightItem(filterText, escapedFilterText, menuItem);
            });
            // a menu data group
            if (menuData[i].items) {
                matchedGroupsOrItems.push({
                    label: menuData[i].label,
                    items: matchedItems
                });
            } else {
                // a menu data item
                matchedGroupsOrItems.push(matchedItems[0]);
            }
        }
    }
    return matchedGroupsOrItems;
}