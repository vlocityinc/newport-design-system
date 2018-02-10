import { deepCopy } from 'builder_platform_interaction-store-lib';

/**
 * Filters the data passed in based on the text in a format that the combobox expects
 * @param {String} filterText - The value used to filter. This should just be the final string in an expression.
 * If the full value is '{!MyAccount.FirstN}', filterText should be 'FirstN'. If the full value is '{!MyAcc', filterText should be 'MyAcc'.
 * @param {Array} menuData - The menu data that needs to be filtered
 * @return {Array} The filtered and highlighted menu data
 */
export function filterMatches(filterText, menuData) {
    const matches = menuData.filter(menuItem => {
        if (menuItem.type === 'heading') {
            return false;
        }
        return getIndex(filterText, menuItem.text) !== -1 || getIndex(filterText, menuItem.subtext) !== -1;
    });

    const formattedMatches = matches.map(menuItem => {
        return createHighlightedItem(filterText, menuItem);
    });

    return formattedMatches;
}

/**
 * Creates a copy of the item and adds the correct highlighting to text & subtext
 * @param {String} filterText - The value used to filter
 * @param {Object} item - One item that has matching values in text and/or subtext
 * @return {Object} The updated item with highlighted values
 */
function createHighlightedItem(filterText, item) {
    const formattedItem = deepCopy(item);
    if (getIndex(filterText, formattedItem.text) !== -1) {
        formattedItem.text = highlight(filterText, formattedItem.text);
    }
    if (getIndex(filterText, formattedItem.subText) !== -1) {
        formattedItem.subText = highlight(filterText, formattedItem.subText);
    }
    return formattedItem;
}

/**
 * Creates an array defining parts of the text to highlight in a format that the combobox uses
 * @param {String} filterText - The value used to filter
 * @param {String} targetText - The text that needs to be highlighted
 * @return {Array} The new array with highlighted text
 */
function highlight(filterText, targetText) {
    const regex = new RegExp('(?<=' + filterText + ')|(?=' + filterText + ')', 'i');
    const targetTextArray = targetText.split(regex);
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
    if (filterText && targetText) {
        return targetText.toLowerCase().indexOf(filterText.toLowerCase());
    }
    return -1;
}
