import { createDynamicChoiceSet, createDynamicChoiceSetMetadataObject } from "./base/dynamicChoiceSet";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseElementsArrayToMap } from "./base/baseElement";

export const createRecordChoiceGroup = (element = {}) => {
    const recordChoiceGroupElement = createDynamicChoiceSet(element);
    const {
        object = null,
        sortField = ''
    } = element;

    Object.assign(recordChoiceGroupElement, {
        elementType: ELEMENT_TYPE.RECORD_CHOICE_GROUP,
        object,
        sortField
    });

    return recordChoiceGroupElement;
};

export const createRecordChoiceGroupForStore = (element) => {
    if (!element) {
        throw new Error('Element is required to create record choice gourp element for store');
    }
    const recordChoiceGroupElement = createRecordChoiceGroup(element);
    return baseElementsArrayToMap([recordChoiceGroupElement]);
};

export const createRecordChoiceGroupMetadataObject = (element) => {
    if (!element) {
        throw new Error('Element is required to create dynamic choice set meta data object');
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(element);
    const {
        object,
        sortField
    } = element;

    Object.assign(baseDynamicChoiceMetadataObject, {
        object,
        sortField
    });

    return baseDynamicChoiceMetadataObject;
};