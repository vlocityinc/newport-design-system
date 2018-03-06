/**
 * Persist original text/subText else clear highlight if present.
 * @param {Array} items - Menu Items to clear the highlighting from its text/subText
 */
function clearHighlight(items) {
    items.forEach(item => {
        if (!item.textNoHighlight) {
            item.textNoHighlight = item.text;
        } else if (hasHighlight(item.text)) {
            item.text = item.textNoHighlight;
        }

        if (!item.subTextNoHighlight) {
            item.subTextNoHighlight = item.subText;
        } else if (hasHighlight(item.subText)) {
            item.subText = item.subTextNoHighlight;
        }
    });
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
 * @param {Object} item - One item that has matching values in text and/or subText
 */
function highlightItem(filterText, item) {
    item.text = highlight(filterText, item.text);
    item.subText = highlight(filterText, item.subText);
}

/**
 * Creates an array defining parts of the text to highlight in a format that the combobox uses
 * @param {String} filterText - The value used to filter
 * @param {String} targetText - The text that needs to be highlighted
 * @return {Array} The new array with highlighted text
 */
function highlight(filterText, targetText) {
    // lookbehind works only in V8 engine
    // const regex = new RegExp('(?<=' + filterText + ')|(?=' + filterText + ')', 'i');
    const regex = new RegExp('(' + filterText + ')', 'i');
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
    if (filterText && targetText) {
        return targetText.toLowerCase().indexOf(filterText.toLowerCase());
    }
    return -1;
}

/**
 * Filters the data passed in based on the text in a format that the combobox expects
 * @param {String} filterText - The value used to filter. This should just be the final string in an expression.
 * If the full value is '{!MyAccount.FirstN}', filterText should be 'FirstN'. If the full value is '{!MyAcc', filterText should be 'MyAcc'.
 * @param {Array} menuData - The menu data that needs to be filtered
 * @return {Array} The filtered and highlighted menu data
 */
export function filterMatches(filterText, menuData) {
    if (!filterText || filterText.length === 0) {
        throw new Error(`Filter text must not be undefined or empty but was ${filterText}`);
    }

    if (!Array.isArray(menuData)) {
        throw new Error(`Menu data must be an array but was ${menuData}`);
    }

    const matchedGroups = [];
    const countGroups = menuData.length;

    for (let i = 0; i < countGroups; i++) {
        clearHighlight(menuData[i].items || []);

        const matchedGroupItems = menuData[i].items.filter(menuItem => {
            return getIndex(filterText, menuItem.text) !== -1 || getIndex(filterText, menuItem.subText) !== -1;
        });

        // Only add group with matched items
        if (matchedGroupItems && matchedGroupItems.length > 0) {
            matchedGroupItems.forEach(menuItem => {
                highlightItem(filterText, menuItem);
            });
            matchedGroups.push({
                label: menuData[i].label,
                items: matchedGroupItems
            });
        }
    }
    return matchedGroups;
}