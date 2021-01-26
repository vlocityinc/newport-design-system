// @ts-nocheck
import { NodeType, ElementMetadata, ElementsMetadata } from 'builder_platform_interaction/autoLayoutCanvas';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { TRIGGER_TYPE_LABELS } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';

const { NONE, SCHEDULED, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;

// TODO: find better solution to share metadata between modules, eg in ElementService
let elementsMetadata: ElementsMetadata = {};

export function setElementsMetadata(metadata: ElementMetadata[]) {
    elementsMetadata = metadata.reduce((acc, elementMetadata) => {
        acc[elementMetadata.elementType] = elementMetadata;
        return acc;
    }, {});
}

export function getElementsMetadata() {
    return elementsMetadata;
}

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
            return NodeType.BRANCH;
        case ELEMENT_TYPE.LOOP:
            return NodeType.LOOP;
        case ELEMENT_TYPE.START_ELEMENT:
            return NodeType.START;
        case ELEMENT_TYPE.END_ELEMENT:
            return NodeType.END;
        case ELEMENT_TYPE.ROOT_ELEMENT:
            return NodeType.ROOT;
        case ELEMENT_TYPE.ORCHESTRATED_STAGE:
            return NodeType.ORCHESTRATED_STAGE;
        default:
            return NodeType.DEFAULT;
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
    'fault',
    'nodeType'
];

/**
 * Copy Flc extra props from on element to another
 *
 * @param fromElement - The element to copy from
 * @param toElement - The element to copy to
 */
export const copyFlcExtraProps = (fromElement, toElement) => {
    flcExtraProps.forEach((prop) => {
        const value = fromElement[prop];
        if (value) {
            toElement[prop] = value;
        }
    });
};

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
