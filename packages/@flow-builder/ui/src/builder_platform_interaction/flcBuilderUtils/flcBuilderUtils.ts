// @ts-nocheck
import { ElementType } from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { TRIGGER_TYPE_LABELS } from 'builder_platform_interaction/processTypeLib';
import { getProcessType, shouldUseAutoLayoutCanvas } from 'builder_platform_interaction/storeUtils';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';

const { NONE, SCHEDULED, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;

/**
 * @return true iff an element can have children
 */
export function supportsChildren(element: UI.Element) {
    const { elementType } = element;
    return (
        elementType === ELEMENT_TYPE.DECISION || elementType === ELEMENT_TYPE.WAIT || elementType === ELEMENT_TYPE.LOOP
    );
}

/**
 * Maps a flow ELEMENT_TYPE to an FLC ElementType
 */
export function getFlcElementType(elementType) {
    switch (elementType) {
        case ELEMENT_TYPE.DECISION:
        case ELEMENT_TYPE.WAIT:
            return ElementType.BRANCH;
        case ELEMENT_TYPE.LOOP:
            return ElementType.LOOP;
        case ELEMENT_TYPE.START_ELEMENT:
            return ElementType.START;
        case ELEMENT_TYPE.END_ELEMENT:
            return ElementType.END;
        case ELEMENT_TYPE.ROOT_ELEMENT:
            return ElementType.ROOT;
        case ELEMENT_TYPE.ORCHESTRATED_STAGE:
            return ElementType.ORCHESTRATED_STAGE;
        default:
            return ElementType.DEFAULT;
    }
}

/**
 * Extra properties used by the flc canvas for elements
 */
export const flcExtraProps = [
    'next',
    'prev',
    'incomingGoTo',
    'children',
    'parent',
    'childIndex',
    'isTerminal',
    'fault'
];

/**
 * Adds flc props that are not undefined to an object
 * @param {*} object Object to add flc props to
 * @param {*} flcProperties Object containing flc props
 */
export function addFlcProperties(object, flcProperties) {
    if (shouldUseAutoLayoutCanvas()) {
        flcExtraProps.forEach((propName) => {
            const propValue = flcProperties[propName];
            if (propValue !== undefined) {
                object[propName] = propValue;
            }
        });
    }

    return object;
}

export const startElementDescription = (triggerType) => {
    if (isRecordChangeTriggerType(triggerType) || triggerType === SCHEDULED || triggerType === PLATFORM_EVENT) {
        return TRIGGER_TYPE_LABELS[triggerType];
    }
    const processType = getProcessType();
    // Grab the label of the current processType flow type
    const processTypes = getProcessTypes();
    if (processTypes) {
        for (const item of processTypes) {
            if (item.name === processType) {
                return item.label;
            }
        }
    }

    return undefined;
};

export const hasTrigger = (triggerType) => {
    switch (triggerType) {
        case NONE:
            return false;
        default:
            return true;
    }
};

export const hasContext = (triggerType) => {
    switch (triggerType) {
        case NONE:
        case PLATFORM_EVENT:
            return false;
        default:
            return true;
    }
};

/**
 * Find the start element
 *
 * @param elements - the guid to element map
 * @return the start element
 */
export function findStartElement(elements: UI.Elements): UI.Start | BranchHeadNodeModel {
    return Object.values(elements).find((ele) => ele.elementType === ELEMENT_TYPE.START_ELEMENT)!;
}

function createElementHelper(elementType: string, guid: UI.Guid) {
    return {
        elementType,
        guid,
        label: elementType,
        value: elementType,
        text: elementType,
        name: elementType,
        prev: null,
        next: null,
        incomingGoTo: []
    };
}

/**
 * Creates a root element and links it with the start element
 *
 * @param startElementGuid - The start element
 */
export const createRootElement = () => {
    return {
        ...createElementHelper(ELEMENT_TYPE.ROOT_ELEMENT, ElementType.ROOT),
        children: []
    };
};
