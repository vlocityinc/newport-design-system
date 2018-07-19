import { Store } from 'builder_platform_interaction-store-lib';

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