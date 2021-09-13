import {
    NodeType,
    ElementMetadata,
    ElementsMetadata,
    BranchHeadNodeModel,
    FlowModel,
    ParentNodeModel,
    ConnectionSource,
    getValuesFromConnectionSource
} from 'builder_platform_interaction/autoLayoutCanvas';

import { ELEMENT_TYPE, FLOW_TRIGGER_TYPE, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { TRIGGER_TYPE_LABELS, PROCESS_TRIGGER_TYPE_LABELS } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { getProcessTypes } from 'builder_platform_interaction/systemLib';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';

const { NONE, SCHEDULED, PLATFORM_EVENT } = FLOW_TRIGGER_TYPE;

// TODO: find better solution to share metadata between modules, eg in ElementService
let elementsMetadata: ElementsMetadata = {};

/**
 * @param metadata - The Flow metadata
 */
export function setElementsMetadata(metadata: ElementMetadata[]) {
    elementsMetadata = metadata.reduce((acc, elementMetadata) => {
        acc[elementMetadata.elementType] = elementMetadata;
        return acc;
    }, {});
}

/**
 * @returns - The flow metadata
 */
export function getElementsMetadata() {
    return elementsMetadata;
}

/**
 * Returns the number of children an element has, or null if it doesn't support children
 *
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
 *
 * @param elementType - The current element type
 * @returns - The alc Element type
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
 *
 * @param triggerType - The trigger type
 * @returns the description
 */
export const startElementDescription = (triggerType: string): string | undefined => {
    const processType = getProcessType();
    if (isRecordChangeTriggerType(triggerType) || triggerType === SCHEDULED || triggerType === PLATFORM_EVENT) {
        return PROCESS_TRIGGER_TYPE_LABELS[processType + triggerType] || TRIGGER_TYPE_LABELS[triggerType];
    }

    // Grab the label of the current processType flow type
    const processTypes = getProcessTypes();
    if (processTypes) {
        for (const item of processTypes) {
            if (item.name === processType) {
                return PROCESS_TRIGGER_TYPE_LABELS[processType + triggerType] || item.label;
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

// TODO: W-9299993 Remove reliance on hardcoded processType and triggerType for launching merged recordChangeTriggerEditor
export const isRecordTriggeredFlow = (triggerType) => {
    return (
        (getProcessType() === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW ||
            getProcessType() === FLOW_PROCESS_TYPE.ORCHESTRATOR) &&
        isRecordChangeTriggerType(triggerType)
    );
};

/**
 * Finds the flow's start element
 *
 * @param elements - the flow elements
 * @returns the start element
 */
export function findStartElement(elements: UI.Elements | FlowModel): BranchHeadNodeModel {
    return Object.values(elements).find(
        (ele) => getAlcElementType(ele.elementType) === NodeType.START
    ) as BranchHeadNodeModel;
}

/**
 * Base function to create the Pasted Canvas Element
 *
 * @param duplicatedElement - Element object in it's duplicated state
 * @param canvasElementGuidMap - Map containing element guids -> pasted element guids
 * @param topCutOrCopiedGuid - Guid of the top most cut or copied element
 * @param bottomCutOrCopiedGuid - Guid of the bottom most cut or copied element
 * @param source - The connection source where to insert the pasted element
 * @param next - Guid of the element above which the cut/copied block will be pasted. This can be null when pasting at the bottom of a branch
 * @returns pastedCanvasElement
 */
export const createPastedCanvasElement = (
    duplicatedElement: any,
    canvasElementGuidMap: any,
    topCutOrCopiedGuid: any,
    bottomCutOrCopiedGuid: string | null | undefined,
    source: ConnectionSource,
    next: string | null | undefined
) => {
    const { prev, parent, childIndex } = getValuesFromConnectionSource(source);

    const pastedCanvasElement = Object.assign(duplicatedElement, {
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        incomingGoTo: [],
        prev: canvasElementGuidMap[duplicatedElement.prev] || null,
        next: canvasElementGuidMap[duplicatedElement.next] || null
    });

    // If the parent hasn't been cut or copied, and the pasted element is same as topCutOrCopiedElement, then update the prev, parent and childIndex properties.
    if (pastedCanvasElement.guid === canvasElementGuidMap[topCutOrCopiedGuid!]) {
        pastedCanvasElement.prev = prev;

        // If parent and childIndex are defined then update those properties or delete them
        if (parent) {
            pastedCanvasElement.parent = parent;
            pastedCanvasElement.childIndex = childIndex;
        } else {
            delete pastedCanvasElement.parent;
            delete pastedCanvasElement.childIndex;
        }
    } else if (canvasElementGuidMap[pastedCanvasElement.parent]) {
        // If the parent element has also been cut or copied, then update the parent guid
        pastedCanvasElement.parent = canvasElementGuidMap[pastedCanvasElement.parent];
    }

    // If the pasted canvas element is same as the bottomCutOrCopiedElement, then updating the next
    if (pastedCanvasElement.guid === canvasElementGuidMap[bottomCutOrCopiedGuid!]) {
        pastedCanvasElement.next = next;
    }

    // Resetting the children array to include children guids that are being pasted or null for those that aren't
    if (pastedCanvasElement.children) {
        pastedCanvasElement.children = pastedCanvasElement.children.map((childGuid) => {
            return canvasElementGuidMap[childGuid] || null;
        });
    }

    // Updating the pasted element's fault property if it exists
    if (pastedCanvasElement.fault) {
        // If the fault element has been cut or copied, then update the fault reference
        // to the newly pasted element, else delete it
        if (canvasElementGuidMap[pastedCanvasElement.fault]) {
            pastedCanvasElement.fault = canvasElementGuidMap[pastedCanvasElement.fault];
        } else {
            delete pastedCanvasElement.fault;
        }
    }

    // Deleting the isTerminal property from the pastedCanvasElement. We reset it if needed in the reducer
    delete pastedCanvasElement.isTerminal;

    return pastedCanvasElement;
};
