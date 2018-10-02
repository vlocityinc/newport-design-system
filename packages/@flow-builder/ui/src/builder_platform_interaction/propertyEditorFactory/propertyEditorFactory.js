import { getConfigForElementType } from "builder_platform_interaction/elementConfig";
import { Store, deepCopy } from "builder_platform_interaction/storeLib";
import {
    swapUidsForDevNames,
    swapDevNamesToGuids
} from "builder_platform_interaction/translatorLib";
import {
    hydrateWithErrors, dehydrate
} from "builder_platform_interaction/dataMutationLib";

/**
 * This function create element using factory, does UID to devname swapping for template fields and hydrate the element
 * @param {Object} element existing element or just element type to call correct factory
 * @return {Object} newElement in shape required by property editor
 */
export function getElementForPropertyEditor(element = {}) {
    const { elementType } = element;
    if (!elementType) {
        throw new Error('ElementType is not defined for creation of resource element');
    }
    const { factory } = getConfigForElementType(elementType);
    const { propertyEditor } = factory;
    if (!propertyEditor) {
        throw new Error('property editor factory is not defined to create new element');
    }
    const newElement = propertyEditor(element);
    // Find a better way to do this and don't couple store with this library
    const elements = Store.getStore().getCurrentState().elements;
    swapUidsForDevNames(elements, newElement, {enableGuidToDevnameSwappingForReferenceFields: false});
    return getElementAfterHydratingWithError(newElement);
}

/**
 * This function dehydrate the element, create element using factory, does UID to devname swapping
 * @param {Object} element existing element
 * @return {Object} newElement in shape required by store
 */

export function getElementForStore(element) {
    if (!element) {
        throw new Error('Element is not defined');
    }
    const { elementType } = element;
    if (!elementType) {
        throw new Error('ElementType is not defined for creation of resource element');
    }
    // TODO: REMOVE THIS DEEP COPY ASAP
    const elementAfterDehydrateAndUnwrap = dehydrate(deepCopy(element));
    const { factory } = getConfigForElementType(elementType);
    const { propertyEditor, closePropertyEditor } = factory;
    let newElement;
    if (closePropertyEditor) {
        newElement = closePropertyEditor(elementAfterDehydrateAndUnwrap);
    } else if (propertyEditor) {
        newElement = propertyEditor(elementAfterDehydrateAndUnwrap);
    } else {
        throw new Error('property editor factory is not defined to create new element');
    }
    const elements = Store.getStore().getCurrentState().elements;
    swapDevNamesToGuids(elements, newElement);
    return newElement;
}

/**
 * Helper function to get non hydratable properties and hydrate an element with errors
 * @param {Object} element existing element
 * @return {Object} new Element with errors
 */
function getElementAfterHydratingWithError(element) {
    if (!element) {
        throw new Error('element is not defined to be hydrated');
    }
    const { elementType } = element;
    const { nonHydratableProperties } = getConfigForElementType(elementType);
    return hydrateWithErrors(element, nonHydratableProperties || []);
}