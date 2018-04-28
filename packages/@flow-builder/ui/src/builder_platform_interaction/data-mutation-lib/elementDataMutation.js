// TODO: pass blacklist config form editor Idea is blackListFields being passed per elementType, this config should probably come from builder-utils

/**
 * Returns true if the input item is hydrated with errors.
 * @param {Object} item to evaluate if its hydrated
 * @return {boolean} returns true if item has error and value property otherwise false
 */
const isItemHydratedWithErrors = (item) => {
    return item && item.hasOwnProperty('value') && item.hasOwnProperty('error');
};

/**
 * Exported function for hydrating element object with errors
 * @param {Object} element element data object
 * @param {string[]} blackListFields List of key values not to be hydrated
 * @return {Object} hydrated element object
 */
export const hydrateWithErrors = (
    element,
    blackListFields = ['guid', 'elementType', 'locationX', 'locationY', 'rowIndex']
) => {
    Object.entries(element).filter(([key]) => !blackListFields.includes(key)).forEach(
        ([key, val]) => {
            if (typeof val === 'string' || val === null || val === undefined) {
                element[key] = { value : val, error: null };
            } else if (typeof val === 'object') {
                hydrateWithErrors(val, blackListFields);
            }
        }
    );
    return element;
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
            if (typeof value === 'object') {
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