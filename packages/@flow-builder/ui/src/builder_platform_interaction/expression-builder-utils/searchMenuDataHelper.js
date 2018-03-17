import { filterMatches } from 'builder_platform_interaction-data-mutation-lib';
/**
 * Helper that calls search library to filter based on the provided search text and assignment item
 * This would likely be called in the handler for the searchmenudata event
 * @param {String} searchText   the search text (the value of the combobox)
 * @param {String} propertyName      the property name so we know which combobox's menudata to search
 * @param {Object} item              the item we are searching on
 * @returns {Object} newItem         the updated item with filtered menudata
 */
export const searchMenuDataHelper = (searchText, propertyName, item) => {
    const newItem = { ...item };
    // sanity checks
    if (newItem && newItem[propertyName] && newItem[propertyName].menudata) {
        // some more sanity checks
        if (typeof searchText === 'string') {
            const matches = filterMatches(searchText, newItem[propertyName].menudata);
            newItem[propertyName].menudata = matches;
        }
    }
    return newItem;
};