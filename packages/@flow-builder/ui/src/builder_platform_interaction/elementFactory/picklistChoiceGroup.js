import { createDynamicChoiceSet, createDynamicChoiceSetMetadataObject } from "./base/dynamicChoiceSet";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseElementsArrayToMap } from "./base/baseElement";

export const createPicklistChoiceGroup = (element = {}) => {
    const picklistChoiceGroupElement = createDynamicChoiceSet(element);
    const {
        picklistObject = null,
        picklistField = null
    } = element;
    Object.assign(picklistChoiceGroupElement, {
        elementType: ELEMENT_TYPE.PICKLIST_CHOICE_GROUP,
        picklistObject,
        picklistField
    });
    return picklistChoiceGroupElement;
};

export const createPicklistChoiceGroupForStore = (element) => {
    if (!element) {
        throw new Error('Element is required to create picklist choice gourp element for store');
    }
    const picklistChoiceGroupElement = createPicklistChoiceGroup(element);
    return baseElementsArrayToMap([picklistChoiceGroupElement]);
};

export const createPicklistChoiceGroupMetadataObject = (element) => {
    if (!element) {
        throw new Error('Element is required to create dynamic choice set meta data object');
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(element);
    const {
        picklistField,
        picklistObject
    } = element;
    Object.assign(baseDynamicChoiceMetadataObject, {
        picklistField,
        picklistObject
    });
    return baseDynamicChoiceMetadataObject;
};
