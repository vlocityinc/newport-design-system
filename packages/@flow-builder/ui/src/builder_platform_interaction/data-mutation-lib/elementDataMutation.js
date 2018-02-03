// TODO: pass blacklist config form editor Idea is blackListFields being passed per elementType, this config should probably come from builder-utils
/**
 * Exported function for hydrating element object with errors
 * @param {Object} element element data object
 * @param {string[]} blackListFields List of key values not to be hydrated
 * @return {Object} hydrated element object
 */
export const hydrateWithErrors = (element, blackListFields = ['guid']) => {
    Object.entries(element).filter(([key]) => !blackListFields.includes(key)).forEach(
        ([key, val]) => {
            if (typeof val === 'string' || val === null || val === undefined) {
                element[key] = { value : val, error: null };
            } else if (typeof val === 'object') {
                hydrateWithErrors(val, []);
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
                } else if (element[key] && element[key].hasOwnProperty('value') && element[key].hasOwnProperty('error')) {
                    if (element[key].error != null) {
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
// TODO: add function to check if errors are present in the element.