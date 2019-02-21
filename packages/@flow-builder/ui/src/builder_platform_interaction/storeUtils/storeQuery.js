import { Store } from "builder_platform_interaction/storeLib";

/**
 * Fetches the element from the store for the input element guid.
 * NOTE: THIS FUNCTION IS NOT MEANT TO BE USED BY THE COMPONENTS.
 * @param {string} guid for the element
 * @return {*} store element or undefined if the guid does not exists.
 */
export const getElementByGuid = (guid) => {
    return Store.getStore().getCurrentState().elements[guid];
};

/**
 * Fetches the element from the store for the input element devName.
 * Note : this function iterates over all the elements to find one with the given devName. This may have a big performance impact.
 * @param {string} devName for the element
 * @param {boolean} caseSensitive true if name comparison is case sensitive (false by default)
 * @return {*} store element or undefined if the devName does not exists.
 */
export const getElementByDevName = (devName, caseSensitive = false) => {
    // TODO : add a devName => guid mapping in the store to improve perfs
    const elements = Store.getStore().getCurrentState().elements;
    if (!caseSensitive) {
        devName = devName.toLowerCase();
    }
    for (const guid in elements) {
        if (elements.hasOwnProperty(guid)) {
            let elementName = elements[guid].name;
            if (elementName && !caseSensitive) {
                elementName = elementName.toLowerCase();
            }
            if (elementName === devName) {
                return elements[guid];
            }
        }
    }
    return undefined;
};

/**
 * Common function to return duplicate dev name elements
 * @param {Object[]} elements
 * @param {string} nameToBeTested
 * @param {string[]} listOfGuidsToSkip
 * @returns {Object[]} matchingElements Object list
 */
export const getDuplicateDevNameElements = (elements = {}, nameToBeTested, listOfGuidsToSkip = []) => {
    return elements && Object.values(elements).filter(element =>
        !listOfGuidsToSkip.includes(element.guid)
        && nameToBeTested !== '' // no need to run the validation in case of empty string
        && (element.name && element.name.toLowerCase()) === (nameToBeTested && nameToBeTested.toLowerCase()));
};

/**
 * Checks the uniqueness of the devName string amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {string} nameToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {boolean}
 */
export const isDevNameInStore = (nameToBeTested, listOfGuidsToSkip = []) => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = getDuplicateDevNameElements(elements, nameToBeTested, listOfGuidsToSkip) || [];
    return matches.length > 0;
};

/**
 * Checks the uniqueness of the order number amongst the elements present in the store, ignoring the list of guids passed as blacklist to avoid checking against uniqueness.
 * This listOfGuids might be helpful in the future when an element like decision/screen wants to pass a list of outcome guids and checks for uniqueness internally for those guids, since it has the latest data for those guids
 * @param {number} orderNumberToBeTested - for uniqueness in store
 * @param {string[]} listOfGuidsToSkip - for checking against uniqueness
 * @returns {boolean}
 */
export const isOrderNumberInStore = (orderNumberToBeTested, listOfGuidsToSkip = []) => {
    const currentState = Store.getStore().getCurrentState();
    const elements = currentState.elements;
    const matches = Object.values(elements).filter(element =>
        !listOfGuidsToSkip.includes(element.guid) && (element.stageOrder) === orderNumberToBeTested);
    return matches.length > 0;
};