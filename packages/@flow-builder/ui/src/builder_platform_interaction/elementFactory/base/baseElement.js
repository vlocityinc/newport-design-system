import { generateGuid } from "builder_platform_interaction/storeLib";
import { CONDITION_LOGIC, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { createFEROV } from "../ferov";
import { createListRowItem, rhsDataTypePropertyName, rhsPropertyName } from "./baseList";

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

function createCanvasElementConfig(config = { isSelected: false }) {
    const { isSelected } = config;
    return { isSelected };
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
 * @typedef {Object} Condition
 * @property {String} leftValueReference - lhs reference
 * @property {String} operator - the operator
 * @property {String} rightValue - rhs value
 */

/**
 * Create a new condition for property editor use
 * @param {Condition} condition - condition in store shape
 * @return {module:baseList.ListRowItem} the new condition
 */
export function createCondition(condition = {}) {
    let newCondition = {};

    if (condition.hasOwnProperty('leftValueReference')) {
        const ferov = createFEROV(condition.rightValue, rhsPropertyName, rhsDataTypePropertyName);
        newCondition = Object.assign({}, ferov, {
            leftHandSide : condition.leftValueReference,
            operator : condition.operator
        });

        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }
    newCondition.rowIndex = generateGuid();

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

    let { conditions } = childElement;
    const {
        conditionLogic = CONDITION_LOGIC.AND,
        label = ''
    } = childElement;

    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createCondition(condition));
    } else {
        const newCondition = createCondition();
        conditions = [newCondition];
    }

    return Object.assign(newChildElement, {
        conditions,
        conditionLogic,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value,
        elementType,
        label
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