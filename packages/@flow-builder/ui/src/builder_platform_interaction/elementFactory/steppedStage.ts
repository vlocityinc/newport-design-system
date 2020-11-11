import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseCanvasElement, baseCanvasElementsArrayToMap, baseChildElement, createCondition } from './base/baseElement';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from './base/baseMetadata';
import { getElementByGuid, getElementsForElementType } from 'builder_platform_interaction/storeUtils';
import { ChildElement, CanvasElement, ChildReference, Guid, Condition } from 'builder_platform_interaction/flowModel';
import { createConnectorObjects } from './connector';
import { format, sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementFactoryLabels';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter } from './outputParameter';
import { createActionCall } from './actionCall';
import { ParameterListRowItem } from './base/baseList';

// TODO: should extend the same base class as other non-canvas elements
export interface SteppedStageItem extends ChildElement {
    parent: Guid;
    stepTypeLabel: string;
    entryCriteria: Condition[];
    entryCriteriaLogic?: string;
    action?: InvocableAction;
    actionName?: string;
    actionType?: string;
    inputParameters: ParameterListRowItem[];
    outputParameters: ParameterListRowItem[];
}

export interface SteppedStage extends CanvasElement {
    steps: SteppedStageItem[];
    childReferences: ChildReference[];
}

const elementType = ELEMENT_TYPE.STEPPED_STAGE;

// For Opening Property editor for a SteppedStage
export function createSteppedStageWithItems(existingStage: SteppedStage): SteppedStage {
    const newStage: SteppedStage = baseCanvasElement(existingStage) as SteppedStage;
    const { childReferences = [] } = existingStage;

    if (!existingStage.label) {
        const steppedStageCount = getElementsForElementType(ELEMENT_TYPE.STEPPED_STAGE).length;

        newStage.label = format(LABELS.defaultSteppedStageName, steppedStageCount + 1);
        newStage.name = sanitizeDevName(newStage.label);
    }

    newStage.steps = childReferences.map((childReference: ChildReference) => {
        return createSteppedStageItem(getElementByGuid(childReference.childReference) as any);
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

/**
 * Selector callback used for the steppedStageNode to provide data needed
 * for dynamic rendering on the canvas
 * @param guid
 */
export function getSteps(guid: Guid): SteppedStageItem[] {
    const steppedStage = getElementByGuid<SteppedStage>(guid)!;

    return steppedStage.childReferences.map(
        (ref: ChildReference): SteppedStageItem => {
            return {
                ...getElementByGuid(ref.childReference)!,
                // TODO: W-8051764: This will eventually need to be dynamic based on the step type
                stepTypeLabel: LABELS.workStepLabel
            } as SteppedStageItem;
        }
    );
}

export function createSteppedStageItem(step: SteppedStageItem): SteppedStageItem {
    const baseStep = { ...step };

    // Default label
    // TODO: This is an incomplete version of the logic needed for full property editor
    // in panel support.  for example, this does not currently prevent duplicate guids
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000007Q6YUIA0/view
    if (!baseStep.label && baseStep.parent) {
        const steppedStage = getElementByGuid<SteppedStage>(baseStep.parent)!;
        baseStep.label = format(
            LABELS.defaultSteppedStageItemName,
            steppedStage.childReferences.length + 1,
            steppedStage.label
        );
        baseStep.name = sanitizeDevName(baseStep.label);
    }

    // Currently, we only have one step type
    if (!baseStep.stepTypeLabel) {
        baseStep.stepTypeLabel = LABELS.workStepLabel;
    }

    const newStep = <SteppedStageItem>baseChildElement(baseStep, ELEMENT_TYPE.STEPPED_STAGE_ITEM);

    const { entryCriteria = [], action, inputParameters = [], outputParameters = [] } = step;

    if (action) {
        newStep.action = createActionCall(action);
    } else {
        newStep.action = createActionCall({
            actionName: step.actionName,
            actionType: step.actionType
        });
    }

    newStep.entryCriteria = entryCriteria.map<Condition>((condition) => <Condition>createCondition(condition));

    newStep.inputParameters = inputParameters.map((inputParameter) => createInputParameter(inputParameter));
    newStep.outputParameters = outputParameters.map((outputParameter) => createOutputParameter(outputParameter));

    return { ...step, ...newStep };
}

export function createSteppedStageMetadataObject(steppedStage: SteppedStage, config = {}): SteppedStage {
    const { childReferences } = steppedStage;

    const steps = childReferences.map(({ childReference }) => {
        const step: SteppedStageItem = <SteppedStageItem>getElementByGuid(childReference);

        const entryCriteriaMetadata = step.entryCriteria.map((condition) => createConditionMetadataObject(condition));
        const inputParametersMetadata = step.inputParameters.map((p) => createInputParameterMetadataObject(p));

        return {
            ...baseChildElementMetadataObject(step, config),
            entryCriteria: entryCriteriaMetadata,
            actionName: step.action ? step.action.actionName : null,
            actionType: step.action ? step.action.actionType : null,
            inputParameters: inputParametersMetadata
        };
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
    const steppedStageFromStore = getElementByGuid<SteppedStage>(guid);
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

/**
 * Returns all items in the parent SteppedStage *other* than the item passed in.
 * If no parent steppedStage is found, an Error is thrown
 * @param guid
 */
export function getOtherItemsInSteppedStage(guid: Guid): SteppedStageItem[] {
    const parent: SteppedStage | null = <SteppedStage>getElementsForElementType(ELEMENT_TYPE.STEPPED_STAGE).find(
        (steppedStage) => {
            return (steppedStage as SteppedStage).childReferences.find((ref) => ref.childReference === guid);
        }
    );

    if (!parent) {
        throw Error('No parent SteppedStage found for SteppedStageItem ' + guid);
    }

    const siblingItems: SteppedStageItem[] = [];

    parent.childReferences.forEach((ref) => {
        if (ref.childReference !== guid) {
            siblingItems.push(getElementByGuid<SteppedStageItem>(ref.childReference)!);
        }
    });

    return siblingItems;
}
