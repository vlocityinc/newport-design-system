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