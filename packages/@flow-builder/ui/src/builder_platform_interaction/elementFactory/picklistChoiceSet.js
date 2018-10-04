import { createDynamicChoiceSet, createDynamicChoiceSetMetadataObject } from "./base/dynamicChoiceSet";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseElementsArrayToMap } from "./base/baseElement";

/**
 * Picklist choice set factory function
 * @param {Object} element - picklist choice set element
 * @returns {Object} picklistChoiceSet
 */
export const createPicklistChoiceSet = (element = {}) => {
    const picklistChoiceSetElement = createDynamicChoiceSet(element);
    const {
        picklistObject = null,
        picklistField = null
    } = element;
    Object.assign(picklistChoiceSetElement, {
        elementType: ELEMENT_TYPE.PICKLIST_CHOICE_SET,
        picklistObject,
        picklistField
    });
    return picklistChoiceSetElement;
};

/**
 * @param {Object} element - picklistChoiceSet element.
 * @returns {Object} picklistChoiceSet object in a {guid : [choice]} format
 */
export const createPicklistChoiceSetForStore = (element) => {
    if (!element) {
        throw new Error('Element is required to create picklist choice set element for store');
    }
    const picklistChoiceSetElement = createPicklistChoiceSet(element);
    return baseElementsArrayToMap([picklistChoiceSetElement]);
};

/**
 * Factory function for creating picklistChoiceSet element's metadata object
 * @param {Object} element picklistChoiceSet object
 * @returns {Object} picklistChoiceMetadata object
 */
export const createPicklistChoiceSetMetadataObject = (element) => {
    if (!element) {
        throw new Error('Element is required to create dynamic choice set meta data object');
    }
    const baseDynamicChoiceMetadataObject = createDynamicChoiceSetMetadataObject(element);
    const {
        picklistField,
        picklistObject
    } = element;
    const picklistChoiceSetObject = Object.assign(baseDynamicChoiceMetadataObject, {
        picklistField,
        picklistObject
    });
    return picklistChoiceSetObject;
};