// @ts-nocheck
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { updateProperties } from './objectMutation';
import { replaceItem } from './arrayMutation';

export type ValueWithError = {
    value: string;
    error: string;
};

export type ElementValidationError = {
    key: string;
    errorString: string;
};

const DEFAULT_BLACK_LIST = [
    'guid',
    'elementType',
    'locationX',
    'locationY',
    'rowIndex',
    'availableConnections',
    'children',
    'incomingGoTo'
];

/**
 * Returns true if the input item is hydrated with errors.
 *
 * @param {Object} item to evaluate if its hydrated
 * @returns {boolean} returns true if item has error and value property otherwise false
 */
export const isItemHydratedWithErrors = (item) => {
    return item && item.hasOwnProperty('value') && item.hasOwnProperty('error');
};

const doHydrateWithErrors = (element, blackList) => {
    Object.entries(element)
        .filter(([key]) => !blackList.includes(key))
        .forEach(([key, val]) => {
            if (typeof val === 'string' || val === null) {
                element[key] = { value: val, error: null };
            } else if (typeof val === 'object') {
                doHydrateWithErrors(val, blackList);
            }
        });

    return element;
};

/**
 * Hydrates the value if it isn't already
 *
 * @param {object | null} value - The value to hydrate
 * @returns {object} - The hydrated value
 */
export const hydrateIfNecessary = (value) => {
    if (!isItemHydratedWithErrors(value) && (typeof value === 'string' || value === null)) {
        return { value, error: null };
    }
    return value;
};

/**
 * Exported function for hydrating element object with errors
 *
 * @param {Object} element element data object
 * @param {string[]} elementBlackListFields List of keys in the element not to be hydrated
 * @param {boolean} useDefaultBlackList - Determines if the default blacklist should be merged with the elementblacklist
 * @returns {Object} hydrated element object
 */
export const hydrateWithErrors = (element, elementBlackListFields = [], useDefaultBlackList = true) => {
    // Merge elementBlacklist and blackList fields
    const allBlacklistFields = useDefaultBlackList
        ? DEFAULT_BLACK_LIST.concat(elementBlackListFields)
        : elementBlackListFields;
    return doHydrateWithErrors(element, allBlacklistFields);
};

/**
 * Exported function for dehydrating element object with errors
 *
 * @param {Object} element hydrated element data object
 * @returns {Object} dehydrated element object
 */
export const dehydrate = (element) => {
    if (!isUndefinedOrNull(element)) {
        Object.entries(element).forEach(([key, value]) => {
            if (typeof value === 'object') {
                if (Array.isArray(value)) {
                    value.forEach((item) => {
                        dehydrate(item);
                    });
                } else if (isItemHydratedWithErrors(element[key])) {
                    element[key] = element[key].value;
                } else {
                    dehydrate(value);
                }
            }
        });
    }
    return element;
};

/**
 * Exported function for getting a list of errors from a hydrated element object
 *
 * @param {Object} element hydrated element data object
 * @param {Object[]} errorsList list of errors, empty list by default
 * @returns {Object[]} List of errors
 */
export const getErrorsFromHydratedElement = (element, errorsList: ElementValidationError[] = []) => {
    const listOfErrors = errorsList;
    Object.entries(element).forEach(([key, value]) => {
        if (value && typeof value === 'object') {
            // TODO: ALC find better way
            if (Array.isArray(value) && key !== 'children') {
                value.forEach((item) => {
                    getErrorsFromHydratedElement(item, listOfErrors);
                });
            } else if (isItemHydratedWithErrors(element[key])) {
                const errorString = element[key].error;
                if (errorString !== null) {
                    listOfErrors.push({ key, errorString });
                }
            } else {
                getErrorsFromHydratedElement(value, listOfErrors);
            }
        }
    });
    return listOfErrors;
};

/**
 * Walks all attributes of the element recursively and remove errors not presented in the source element
 *
 * @param element - source for values
 * @param sourceElement - source element that is not validated
 * @param elementBlackListFields optional List of keys in the element not to be checked
 * @param errorState - internal parameter used during recursion, to store whether element
 * and/or element's children has an error or not
 * @returns The existing object if sourceElement is undefined. Otherwise a new object removing errors
 * not presented in the sourceElement
 */
export const removeErrorsForUnchangedSourceWithNoError = (
    element,
    sourceElement,
    elementBlackListFields = [],
    errorState = { hasError: false }
) => {
    if (!sourceElement) {
        return element;
    }

    const dehydratedElement = Object.assign({}, element);
    Object.entries(element)
        .filter(([key]) => !elementBlackListFields.includes(key))
        .forEach(([key, value]) => {
            if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                    if (sourceElement[key]) {
                        value.forEach((item, index) => {
                            dehydratedElement[key] = replaceItem(
                                dehydratedElement[key],
                                // Wrap the key value pair in an "item" so it can be processed by dehydrateElementFromSourceElement
                                removeErrorsForUnchangedSourceWithNoError(
                                    { item },
                                    { item: sourceElement[key][index] },
                                    elementBlackListFields,
                                    errorState
                                ).item,
                                index
                            );
                        });
                    }
                } else if (isItemHydratedWithErrors(value)) {
                    if (value.error != null) {
                        if (
                            isUndefinedOrNull(sourceElement[key].error) &&
                            (!sourceElement[key].value || sourceElement[key].value === '')
                        ) {
                            // user did not touch the field, revert the error message
                            dehydratedElement[key] = updateProperties(dehydratedElement[key], { error: null });
                        } else {
                            errorState.hasError = true;
                        }
                    }
                } else if (sourceElement[key]) {
                    dehydratedElement[key] = removeErrorsForUnchangedSourceWithNoError(
                        value,
                        sourceElement[key],
                        elementBlackListFields,
                        errorState
                    );
                }
            }
        });

    if (dehydratedElement.config) {
        dehydratedElement.config = updateProperties(dehydratedElement.config, { hasError: errorState.hasError });
    }

    return dehydratedElement;
};

/**
 * Get the value from item if it is hydrated with error.
 *
 * @param {*} item Object hydrated with error or a property
 * @returns {*} value property if item is hydrated with error else item
 */
export const getValueFromHydratedItem = (item) => {
    if (typeof item === 'object' && isItemHydratedWithErrors(item)) {
        return item.value;
    }
    return item;
};

/**
 * Get the error from item if it is hydrated with error.
 *
 * @param {*} item Object hydrated with error or a property
 * @returns {*} value property if item is hydrated with error else null
 */
export const getErrorFromHydratedItem = (item) => {
    if (typeof item === 'object' && isItemHydratedWithErrors(item)) {
        return item.error;
    }
    return null;
};
