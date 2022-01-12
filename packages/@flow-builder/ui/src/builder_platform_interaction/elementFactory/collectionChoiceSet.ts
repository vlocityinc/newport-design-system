import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { generateGuid, Store } from 'builder_platform_interaction/storeLib';
import { baseElementsArrayToMap } from './base/baseElement';
import { createDynamicChoiceSet, createDynamicChoiceSetMetadataObject } from './base/dynamicChoiceSet';
/**
 * Collection choice set factory function
 *
 * @param element - collectionChoiceSet element
 * @returns collectionChoiceSet
 */
export const createCollectionChoiceSet = (
    element: UI.CollectionChoiceSetElement = { guid: generateGuid() }
): UI.CollectionChoiceSetElement => {
    const collectionChoiceSetElement = createDynamicChoiceSet(element);
    const {
        collectionReference = null,
        displayFieldIndex = generateGuid(),
        valueFieldIndex = generateGuid()
    } = element;
    const collectionReferenceIndex = generateGuid();

    Object.assign(collectionChoiceSetElement, {
        elementType: ELEMENT_TYPE.COLLECTION_CHOICE_SET,
        collectionReferenceIndex,
        collectionReference,
        displayFieldIndex,
        valueFieldIndex
    });

    return collectionChoiceSetElement;
};

/**
 * @param element - collectionChoiceSet element.
 * @returns collectionChoiceSet object in a {guid : [collection choice set]} format
 */
export const createCollectionChoiceSetForStore = (element: UI.CollectionChoiceSetElement) => {
    if (!element) {
        throw new Error('Element is required to create collection choice set element for store');
    }
    const collectionChoiceSetElement = createCollectionChoiceSet(element);
    return baseElementsArrayToMap([collectionChoiceSetElement]);
};

/**
 * Factory function for creating collectionChoiceSet element's metadata object
 *
 * @param element collectionChoiceSet object
 * @returns collectionChoiceMetadata object
 */
export const createCollectionChoiceSetMetadataObject = (
    element: UI.CollectionChoiceSetElement
): Metadata.CollectionChoiceSetMetadata => {
    if (!element) {
        throw new Error('Element is required to create dynamic choice set meta data object');
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(element);
    const { collectionReference } = element;
    const collectionObj = collectionReference
        ? getVariableOrField(collectionReference, Store.getStore().getCurrentState().elements)
        : null;
    const object = collectionObj ? collectionObj?.subtype : null;

    return Object.assign(baseDynamicChoiceMetadataObject, {
        collectionReference,
        object
    });
};
