import { generateGuid } from "builder_platform_interaction/storeLib";
import { isDevNameInStore } from "builder_platform_interaction/storeUtils";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
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
        connectorCount: 0,
        maxConnections,
        elementType
    });

    return { duplicatedElement };
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