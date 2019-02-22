import { generateGuid } from "builder_platform_interaction/storeLib";
import { isDevNameInStore, getElementByGuid } from "builder_platform_interaction/storeUtils";
import { ELEMENT_TYPE, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { createFEROV } from "../ferov";
import { createListRowItem, RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from "./baseList";

export const DUPLICATE_ELEMENT_XY_OFFSET = 50;

export function baseResource(resource = {}) {
    const newResource = baseElement(resource);
    const { description = '' } = resource;
    return Object.assign(newResource, {
        description
    });
}

export function createAvailableConnection(availableConnection = {}) {
    const { type } = availableConnection;
    return { type };
}

function createCanvasElementConfig(config = { isSelected: false, isHighlighted: false }) {
    const { isSelected, isHighlighted } = config;
    return { isSelected, isHighlighted };
}

export function baseCanvasElement(canvasElement = {}) {
    const newCanvasElement = baseResource(canvasElement);
    const { label = '', locationX = 0, locationY = 0, connectorCount = 0 } = canvasElement;
    let { config } = canvasElement;
    config = createCanvasElementConfig(config);
    return Object.assign(newCanvasElement, {
        label,
        locationX,
        locationY,
        isCanvasElement: true,
        connectorCount,
        config
    });
}

/**
 * Base function to duplicate canvas elements
 * @param {Object} canvasElement - canvas element to be duplicated
 * @param {string} newGuid - new guid for the duplicate element
 * @returns {Object} duplicated element with a new unique name and guid
 */
export function duplicateCanvasElement(canvasElement, newGuid) {
    const { name, locationX, locationY, maxConnections, elementType } = canvasElement;
    const duplicatedElement =  Object.assign({}, canvasElement, {
        guid: newGuid,
        name: getUniqueDuplicateElementName(name),
        locationX: locationX + DUPLICATE_ELEMENT_XY_OFFSET,
        locationY: locationY + DUPLICATE_ELEMENT_XY_OFFSET,
        config: {isSelected: true, isHighlighted: false},
        connectorCount: 0,
        maxConnections,
        elementType
    });

    return { duplicatedElement };
}

/**
 * Helper function to create duplicated child elements
 *
 * @param {Object} childReference - Object containing the guid of the child element (eg: {outcomeReference: 'outcome1'})
 * @param {Object} childElementGuidMap - Map of child element guids to new guids for the duplicated child elements
 * @param {Function} createChildElement - Function to create the duplicate child element
 * @param {String} childReferenceKey - Key to access the guid for the child element (eg: outcomeReference)
 * @returns {Object} Returns the duplicated child element with the updated guid and name
 * @private
 */
function _createDuplicateChildElement(childReference, childElementGuidMap, createChildElement, childReferenceKey) {
    const duplicatedChildElement = createChildElement(getElementByGuid(childReference[childReferenceKey]));
    return Object.assign(duplicatedChildElement, {
        guid: childElementGuidMap[childReference[childReferenceKey]],
        name: getUniqueDuplicateElementName(duplicatedChildElement.name)
    });
}

/**
 * Base function to create duplicate canvas elements that contain child elements (such as : Decision, Screen and Wait)
 *
 * @param {Object} canvasElement - Canvas element that needs to be duplicated
 * @param {String} newGuid - Guid for the duplicated canvas element
 * @param {Object} childElementGuidMap - Map of child element guids to new guids for the duplicated child elements
 * @param {Function} createChildElement - Function to create the duplicate child element
 * @param {String} childReferencesKey - Key to access the object containing child references (eg: outcomeReferences)
 * @param {String} childReferenceKey - Key to access the guid for the child element (eg: outcomeReference)
 * @param {Object[]} defaultAvailableConnections - Default Available Connections associated with a canvas element
 * @returns {Object} Returns the object containing the duplicated canvas element, duplicated child elements, updated child
 * references and available connections
 */
export function duplicateCanvasElementWithChildElements(canvasElement, newGuid, childElementGuidMap, createChildElement, childReferencesKey, childReferenceKey, defaultAvailableConnections = []) {
    const { duplicatedElement } = duplicateCanvasElement(canvasElement, newGuid);
    const childReferences = canvasElement[childReferencesKey];

    const additionalAvailableConnections = [];
    const duplicatedChildElements = {};

    // Iterating over existing child references to create duplicate child elements and updating available connections.
    // Also using the duplicated guids to create the updated childReferences for the duplicated element
    const updatedChildReferences = childReferences.map(childReference => {
        const duplicatedChildElement = _createDuplicateChildElement(childReference, childElementGuidMap, createChildElement, childReferenceKey);

        duplicatedChildElements[duplicatedChildElement.guid] = duplicatedChildElement;

        additionalAvailableConnections.push({
            type: CONNECTOR_TYPE.REGULAR,
            childReference: duplicatedChildElement.guid
        });

        return {
            [childReferenceKey]: duplicatedChildElement.guid
        };
    });

    const availableConnections = [...defaultAvailableConnections, ...additionalAvailableConnections];
    return { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections };
}

/**
 * Create a new condition for property editor use
 * @param {Condition} condition - condition in store shape
 * @return {module:baseList.ListRowItem} the new condition
 */
export function createCondition(condition = {}) {
    let newCondition = {};
    if (condition.hasOwnProperty('leftValueReference')) {
        const ferov = createFEROV(condition.rightValue, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        newCondition = Object.assign({}, ferov, {
            leftHandSide : condition.leftValueReference,
            operator : condition.operator
        });

        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }

    return newCondition;
}

/**
 * @typedef {Object} ChildElement
 * @property {String} label - element label
 * @property {String} name - element devName
 * @property {String} guid - element guid
 * @property {module:dataTypeLib.FLOW_DATA_TYPE.BOOLEAN} dataType - All child elements are dataType BOOLEAN
 * @property {module:flowMetadata.CONDITION_LOGIC} conditionLogic - element condition logic
 * @property {module:flowMetadata.ELEMENT_TYPE} elementType - Child elements must be ELEMENT_TYPE OUTCOME or WAIT_EVENT
 * @property {module:baseList.ListRowItem[]} conditions - array of conditions
 */

/**
 * Factory class for creating a new child element
 * @param childElement
 * @param {module:flowMetadata.ELEMENT_TYPE} elementType one of the values defined in ELEMENT_TYPE
 * @return {ChildElement}
 */
export function baseChildElement(childElement = {}, elementType) {
    if (elementType !== ELEMENT_TYPE.OUTCOME && elementType !== ELEMENT_TYPE.WAIT_EVENT) {
        throw new Error('baseChildElement should only be used for outcomes and wait events');
    } else if (childElement.dataType && childElement.dataType !== FLOW_DATA_TYPE.BOOLEAN.value) {
        throw new Error(`dataType ${childElement.dataType} is invalid for baseChildElement`);
    }
    const newChildElement = baseElement(childElement);
    const { label = '' } = childElement;
    return Object.assign(newChildElement, {
        label,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
    });
}

export function baseCanvasElementsArrayToMap(elementList = [], connectors = []) {
    const elements = baseElementsArrayToMap(elementList);
    return Object.assign(elements, {
        connectors
    });
}

export function baseElementsArrayToMap(elementList = []) {
    const elements = elementList.reduce((acc, element) => {
        return Object.assign(acc, {[element.guid]: element});
    }, {});
    return {
        elements
    };
}

export function baseElement(element = {}) {
    const { guid = generateGuid(), name = '' } = element;
    return ({
        guid,
        name
    });
}

function getUniqueDuplicateElementName(name) {
    if (!isDevNameInStore(name)) {
        return name;
    }

    return getUniqueDuplicateElementName(name + '_0');
}