// TODO: pass blacklist config form editor Idea is blackListFields being passed per elementType, this config should probably come from builder-utils

const DEFAULT_BLACK_LIST = ['guid', 'elementType', 'locationX', 'locationY', 'rowIndex', 'availableConnections'];

/**
 * Returns true if the input item is hydrated with errors.
 * @param {Object} item to evaluate if its hydrated
 * @return {boolean} returns true if item has error and value property otherwise false
 */
export const isItemHydratedWithErrors = (item) => {
    return item && item.hasOwnProperty('value') && item.hasOwnProperty('error');
};

const doHydrateWithErrors = (element, blackList) => {
    Object.entries(element).filter(([key]) => !blackList.includes(key)).forEach(
        ([key, val]) => {
            if (typeof val === 'string' || val === null || val === undefined) {
                element[key] = { value : val, error: null };
            } else if (typeof val === 'object') {
                doHydrateWithErrors(val, blackList);
            }
        }
    );

    return element;
};

/**
 * Exported function for hydrating element object with errors
 * @param {Object} element element data object
 * @param {string[]} elementBlackListFields List of keys in the element not to be hydrated
 * @param {boolean} useDefaultBlackList - Determines if the default blacklist should be merged with the elementblacklist
 * @return {Object} hydrated element object
 */
export const hydrateWithErrors = (
    element,
    elementBlackListFields = [],
    useDefaultBlackList = true
) => {
    // Merge elementBlacklist and blackList fields
    const allBlacklistFields = useDefaultBlackList ? DEFAULT_BLACK_LIST.concat(elementBlackListFields) : elementBlackListFields;
    return doHydrateWithErrors(element, allBlacklistFields);
};

/**
 * Exported function for dehydrating element object with errors
 * @param {Object} element hydrated element data object
 * @return {Object} dehydrated element object
 */
export const dehydrate = (element) => {
    Object.entries(element).forEach(
        ([key, value]) => {
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        dehydrate(item);
                    });
                } else if (isItemHydratedWithErrors(element[key])) {
                    if (element[key].error !== null) {
                        throw new Error(key + ' should not have any error: ' + element[key].value + ':' + element[key].error);
                    }
                    element[key] = element[key].value;
                } else {
                    dehydrate(value);
                }
            }
        }
    );
    return element;
};

/**
 * Exported function for getting a list of errors from a hydrated element object
 * @param {Object} element hydrated element data object
 * @param {Object[]} errorsList list of errors, empty list by default
 * @returns {Object[]} List of errors
 */
export const getErrorsFromHydratedElement = (element, errorsList = []) => {
    const listOfErrors = errorsList;
    Object.entries(element).forEach(
        ([key, value]) => {
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        getErrorsFromHydratedElement(item, listOfErrors);
                    });
                } else if (isItemHydratedWithErrors(element[key])) {
                    const errorString = element[key].error;
                    if (errorString !== null) {
                        listOfErrors.push({key, errorString});
                    }
                } else {
                    getErrorsFromHydratedElement(value, listOfErrors);
                }
            }
        }
    );
    return listOfErrors;
};

/**
 * Get the value from item if it is hydrated with error.
 * @param {*} item Object hydrated with error or a property
 * @return {*} value property if item is hydrated with error else item
 */
export const getValueFromHydratedItem = (item) => {
    if (typeof item === 'object' && isItemHydratedWithErrors(item)) {
        return item.value;
    }
    return item;
};

/**
 * Get the error from item if it is hydrated with error.
 * @param {*} item Object hydrated with error or a property
 * @return {*} value property if item is hydrated with error else null
 */
export const getErrorFromHydratedItem = (item) => {
    if (typeof item === 'object' && isItemHydratedWithErrors(item)) {
        return item.error;
    }
    return null;
};