import {
    NodeType,
    ElementMetadata,
    ElementsMetadata,
    BranchHeadNodeModel,
    FlowModel,
    ParentNodeModel
} from 'builder_platform_interaction/autoLayoutCanvas';
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
 * Returns the number of children an element has, or null if it doesn't support children
 * @param element - The element
 * @returns the number of children an element has, or null
 */
export function getChildCount(element: ParentNodeModel | UI.CanvasElement): number | null {
    const { elementType, childReferences } = element;

    const nodeType = getAlcElementType(elementType);
    if (nodeType === NodeType.LOOP) {
        return 1;
    } else if (
        (nodeType === NodeType.BRANCH || nodeType === NodeType.START) &&
        childReferences &&
        childReferences.length > 0
    ) {
        return childReferences.length + 1;
    }

    return null;
}

/**
 * Checks if a canvas element supports children
 *
 * @param element - The canvas element
 * @returns true if it supports children, false otherwise
 */
export function supportsChildren(element: UI.CanvasElement) {
    return getChildCount(element) != null;
}

/**
 * Maps a flow ELEMENT_TYPE to an ALC ElementType
 */
export function getAlcElementType(elementType) {
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
 * Extra properties used by the alc canvas for elements
 */
export const alcExtraProps = [
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
 * Copy Alc extra props from on element to another
 *
 * @param fromElement - The element to copy from
 * @param toElement - The element to copy to
 */
export const copyAlcExtraProps = (fromElement: UI.Element, toElement: UI.Element) => {
    alcExtraProps.forEach((prop) => {
        const value = fromElement[prop];
        if (value != null) {
            toElement[prop] = value;
        }
    });
};

/**
 * Returns the start element description
 * @param triggerType - The trigger type
 * @returns the description
 */
export const startElementDescription = (triggerType: string): string | undefined => {
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
 * Finds the flow's start element
 *
 * @param elements - the flow elements
 * @return the start element
 */
export function findStartElement(elements: UI.Elements | FlowModel): BranchHeadNodeModel {
    return Object.values(elements).find(
        (ele) => getAlcElementType(ele.elementType) === NodeType.START
    ) as BranchHeadNodeModel;
}
