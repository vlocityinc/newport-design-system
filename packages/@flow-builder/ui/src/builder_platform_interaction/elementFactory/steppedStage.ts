import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, baseCanvasElementsArrayToMap, baseChildElement } from './base/baseElement';
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from './base/baseMetadata';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { ChildElement, CanvasElement, ChildReference, Guid } from 'builder_platform_interaction/flowModel';
import { createConnectorObjects } from './connector';
import { format, sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementFactoryLabels';

// TODO: should extend the same base class as other non-canvas elements
export type SteppedStageItem = ChildElement;

export interface SteppedStage extends CanvasElement {
    steps: SteppedStageItem[];
    childReferences: ChildReference[];
}

const elementType = ELEMENT_TYPE.STEPPED_STAGE;

// For Opening Property editor for a SteppedStage
export function createSteppedStageWithItems(existingStage: SteppedStage): SteppedStage {
    const newStage: SteppedStage = baseCanvasElement(existingStage) as SteppedStage;
    const { childReferences = [] } = existingStage;

    newStage.steps = childReferences.map((childReference: ChildReference) => {
        return createSteppedStageItem(getElementByGuid(childReference.childReference));
    });

    newStage.maxConnections = 1;
    newStage.elementType = elementType;

    return newStage;
}

/**
 * Function to create the pasted SteppedStage element
 *
 * @param dataForPasting - Data required to create the pasted element
 */
// export function createPastedSteppedStage({
//     canvasElementToPaste: SteppedStage,
//     // newGuid,
//     // newName,
//     // canvasElementGuidMap,
//     // childElementGuidMap,
//     // childElementNameMap,
//     // cutOrCopiedChildElements,
//     // topCutOrCopiedGuid,
//     // bottomCutOrCopiedGuid,
//     // prev,
//     // next,
//     // parent,
//     // childIndex
// }): {pastedCanvasElement: SteppedStage, pastedChildElements: object[]} {
//     throw new Error('Not yet implemented');
// }

/**
 * Function to create the duplicate Decision element
 *
 * @param {Object} decision - Decision element being copied
 * @param {String} newGuid - Guid for the new duplicated decision element
 * @param {String} newName - Name for the new duplicated decision element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @return {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
// export function createDuplicateSteppedStage(
//     steppedStage: SteppedStage,
//     newGuid: Guid,
//     newName: string,
//     childElementGuidMap: any,
//     childElementNameMap: any,
//     cutOrCopiedChildElements: object[]
// ): {
//     duplicatedElement: SteppedStage
//     duplicatedChildElements: object[]
// } {
//     throw new Error('Not yet implemented');
// }

// export function createSteppedStageWithStageStepsReferencesWhenUpdatingFromPropertyEditor(steppedStage: SteppedStage) {
//     throw new Error('Not yet implemented');
//
//     // return {
//     //     canvasElement: newDecision,
//     //     deletedChildElementGuids: deletedOutcomeGuids,
//     //     childElements: newOutcomes,
//     //     deletedBranchHeadGuids,
//     //     elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES
//     // };
// }

function createSteppedStageItemsWithReferences(
    originalItems: SteppedStageItem[]
): {
    items: SteppedStageItem[];
    childReferences: ChildReference[];
} {
    let items: SteppedStageItem[] = [];
    let childReferences: ChildReference[] = [];

    for (let i = 0; i < originalItems.length; i++) {
        const item: SteppedStageItem = createSteppedStageItem(originalItems[i]);
        items = [...items, item];
        childReferences = updateItemReferences(childReferences, item);
    }

    return {
        items,
        childReferences
    };
}

export function createSteppedStageWithItemReferences(stage: SteppedStage) {
    const newStage = baseCanvasElement(stage);

    const { steps = [] } = stage;

    const connectors = createConnectorObjects(stage, newStage.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const { items, childReferences } = createSteppedStageItemsWithReferences(steps);

    Object.assign(newStage, {
        childReferences,
        connectorCount,
        elementType
    });

    return baseCanvasElementsArrayToMap([newStage, ...items], connectors);
}

/**
 * SteppedStage from the property editor on close goes to the store
 * @param steppedStage
 */
export function createSteppedStageWithItemReferencesWhenUpdatingFromPropertyEditor(steppedStage: SteppedStage) {
    const newSteppedStage = baseCanvasElement(steppedStage);
    const { steps } = steppedStage;

    const { items, childReferences } = createSteppedStageItemsWithReferences(steps);

    const { deletedSteps } = getDeletedStepsUsingStore(steppedStage, items);

    const deletedStepGuids = deletedSteps.map((step: SteppedStageItem) => {
        return step.guid;
    });

    Object.assign(newSteppedStage, {
        elementType,
        childReferences
    });

    return {
        canvasElement: newSteppedStage,
        childElements: items,
        deletedChildElementGuids: deletedStepGuids,
        elementType: ELEMENT_TYPE.STEPPED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS
    };
}

type SteppedStageNodeData = {
    steps: SteppedStageItem[];
};

/**
 * Selector callback used for the steppedStageNode to provide data needed
 * for dynamic rendering on the canvas
 * @param guid
 */
export function getSteppedStageNodeData(guid: Guid): SteppedStageNodeData {
    const steppedStage: SteppedStage = getElementByGuid(guid);

    return {
        steps: steppedStage.childReferences.map(
            (ref: ChildReference): SteppedStageItem => {
                return getElementByGuid(ref.childReference);
            }
        )
    };
}

export function createSteppedStageItem(step: {
    label?: string;
    name?: string;
    guid?: Guid;
    parent?: Guid;
}): SteppedStageItem {
    // Default label
    if (!step.label && step.parent) {
        const steppedStage: SteppedStage = getElementByGuid(step.parent);
        step.label = format(LABELS.defaultSteppedStageItemName, steppedStage.childReferences.length + 1);
        step.name = sanitizeDevName(step.label);
    }
    const childElement = baseChildElement(step, ELEMENT_TYPE.STEPPED_STAGE_ITEM);

    return childElement;
}

export function createSteppedStageMetadataObject(steppedStage: SteppedStage, config = {}): SteppedStage {
    const { childReferences } = steppedStage;

    const steps = childReferences.map(({ childReference }) => {
        const step = getElementByGuid(childReference);
        return baseChildElementMetadataObject(step, config);
    });

    const newSteppedStage: SteppedStage = Object.assign(baseCanvasElementMetadataObject(steppedStage, config), {
        steps
    });

    return newSteppedStage;
}

function updateItemReferences(childReferences: any[], step: SteppedStageItem): ChildReference[] {
    return [
        ...childReferences,
        {
            childReference: step.guid
        }
    ];
}

// TODO: Refactor with Decision and Wait functions here to use common code path
function getDeletedStepsUsingStore(originalSteppedStage: SteppedStage, newSteps: SteppedStageItem[] = []) {
    if (!originalSteppedStage) {
        throw new Error('Stepped stage is not defined');
    }
    const { guid } = originalSteppedStage;
    const steppedStageFromStore = getElementByGuid(guid);
    let stepReferencesFromStore;
    if (steppedStageFromStore) {
        stepReferencesFromStore = steppedStageFromStore.childReferences.map((ref) => ref.childReference);
    }

    const newStepGuids = newSteps.map((newStep: SteppedStageItem) => newStep.guid);

    let deletedSteps = [];

    if (stepReferencesFromStore) {
        deletedSteps = stepReferencesFromStore
            .filter((stepReferenceGuid) => {
                return !newStepGuids.includes(stepReferenceGuid);
            })
            .map((stepReference) => getElementByGuid(stepReference));
    }
    return { deletedSteps };
}
