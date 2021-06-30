import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    createCondition,
    createPastedCanvasElement,
    duplicateCanvasElementWithChildElements
} from './base/baseElement';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from './base/baseMetadata';
import { getElementByGuid, getElementsForElementType } from 'builder_platform_interaction/storeUtils';
import { createConnectorObjects } from './connector';
import { format, sanitizeDevName } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './elementFactoryLabels';
import { getParametersForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter } from './outputParameter';
import { createActionCall } from './actionCall';
import { isParameterListRowItem, ParameterListRowItem } from './base/baseList';
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE, getFlowType } from 'builder_platform_interaction/dataTypeLib';
import { createFEROV, createFEROVMetadataObject, getDataTypeKey } from './ferov';
import { ValueWithError } from 'builder_platform_interaction/dataMutationLib';

export const ASSIGNEE_PROPERTY_NAME = 'assignee';
export const ASSIGNEE_DATA_TYPE_PROPERTY_NAME = getDataTypeKey(ASSIGNEE_PROPERTY_NAME);
export enum ASSIGNEE_TYPE {
    User = 'User'
}

// Used to extra related record for display in its own input
export const RELATED_RECORD_INPUT_PARAMETER_NAME = 'ActionInput__RecordId';

// TODO: Move to UIModel.d.ts after action dependencies have been moved there
// https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000095RTIIA2/view
export interface StageStep extends UI.ChildElement {
    parent: UI.Guid;
    stepTypeLabel: string;

    relatedRecordItem: ParameterListRowItem | UI.HydratedValue;

    assignees: ({ assignee: any; assigneeType: string } | null)[];

    entryConditions?: UI.Condition[];
    entryConditionLogic?: string;
    entryAction: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    entryActionError?: string | ValueWithError;

    entryActionName: string;
    entryActionType: string;
    entryActionInputParameters: ParameterListRowItem[];

    action: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    actionError?: string | ValueWithError;

    // Present when coming from the metadata, but not in the ui StageStep
    actionName?: string;
    actionType?: string;

    inputParameters: ParameterListRowItem[];
    outputParameters: ParameterListRowItem[];

    exitAction: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    exitActionError?: string | ValueWithError;

    exitActionName: string;
    exitActionType: string;
    exitActionInputParameters: ParameterListRowItem[];
}

// TODO: Move to UIModel.d.ts after action dependencies have been moved there
// https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000095RTIIA2/view
export interface OrchestratedStage extends UI.CanvasElement {
    stageSteps: StageStep[];
    childReferences: UI.ChildReference[];

    exitAction: InvocableAction;
    exitActionName: string;
    exitActionType: string;
    exitActionInputParameters: ParameterListRowItem[];
}

const elementType = ELEMENT_TYPE.ORCHESTRATED_STAGE;

/**
 * For Opening Property editor for a OrchestratedStage
 *
 * @param existingStage OrchestratedStage to transform
 * @returns OrchestratedStage for property editor usage
 */
export function createOrchestratedStageWithItems(existingStage: OrchestratedStage): OrchestratedStage {
    const newStage: OrchestratedStage = baseCanvasElement(existingStage) as OrchestratedStage;
    const { childReferences = [] } = existingStage;

    if (!existingStage.label) {
        const orchestratedStageCount = getElementsForElementType(ELEMENT_TYPE.ORCHESTRATED_STAGE).length;

        newStage.label = format(LABELS.defaultOrchestratedStageName, orchestratedStageCount + 1);
        newStage.name = sanitizeDevName(newStage.label);
    }

    newStage.stageSteps = childReferences.map((childReference: UI.ChildReference) => {
        return createStageStep(getElementByGuid(childReference.childReference) as any);
    });

    // set up Exit Action
    newStage.exitAction = <InvocableAction>(
        createActionCallHelper(existingStage.exitAction, existingStage.exitActionName, existingStage.exitActionType)
    );
    newStage.exitActionInputParameters = existingStage.exitActionInputParameters
        ? existingStage.exitActionInputParameters.map((p) => createInputParameter(p))
        : [];

    newStage.maxConnections = 1;
    newStage.elementType = elementType;
    newStage.dataType = FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value;

    return newStage;
}

/**
 * Function to create the pasted OrchestratedStage element
 *
 * @param dataForPasting - Data required to create the pasted element
 * @param dataForPasting.canvasElementToPaste - The OrchestratedStage to copy
 * @param dataForPasting.newGuid - guid for the new OrchestratedStage
 * @param dataForPasting.newName - name for the new OrchestratedStage
 * @param dataForPasting.canvasElementGuidMap
 * @param dataForPasting.childElementGuidMap
 * @param dataForPasting.childElementNameMap
 * @param dataForPasting.cutOrCopiedChildElements
 * @param dataForPasting.topCutOrCopiedGuid
 * @param dataForPasting.bottomCutOrCopiedGuid
 * @param dataForPasting.prev
 * @param dataForPasting.next
 * @param dataForPasting.parent
 * @param dataForPasting.childIndex
 * @returns An object with the pasted OrchestratorStage and all new children
 */
export function createPastedOrchestratedStage({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}): { pastedCanvasElement: OrchestratedStage; pastedChildElements: Map<UI.Guid, StageStep> } {
    const { duplicatedElement, duplicatedChildElements } = createDuplicateOrchestratedStage(
        canvasElementToPaste,
        newGuid,
        newName,
        childElementGuidMap,
        childElementNameMap,
        cutOrCopiedChildElements
    );

    const pastedCanvasElement = <OrchestratedStage>(
        createPastedCanvasElement(
            duplicatedElement,
            canvasElementGuidMap,
            topCutOrCopiedGuid,
            bottomCutOrCopiedGuid,
            prev,
            next,
            parent,
            childIndex
        )
    );
    pastedCanvasElement.stageSteps = [];
    pastedCanvasElement.exitActionInputParameters = [];

    return {
        pastedCanvasElement,
        pastedChildElements: duplicatedChildElements
    };
}

/**
 * Function to create the duplicate Orchestrated Stage element
 *
 * @param {Object} orchestratedStage - OrchestratedStage element being copied
 * @param {string} newGuid - Guid for the new duplicated element
 * @param {string} newName - Name for the new duplicated element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @returns {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateOrchestratedStage(
    orchestratedStage: OrchestratedStage,
    newGuid: UI.Guid,
    newName: string,
    childElementGuidMap: any,
    childElementNameMap: any,
    cutOrCopiedChildElements: object[]
): {
    duplicatedElement: OrchestratedStage;
    duplicatedChildElements: Map<UI.Guid, StageStep>;
} {
    const {
        duplicatedElement,
        duplicatedChildElements,
        updatedChildReferences,
        availableConnections
    } = duplicateCanvasElementWithChildElements(
        orchestratedStage,
        newGuid,
        newName,
        childElementGuidMap,
        childElementNameMap,
        cutOrCopiedChildElements,
        createStageStep
    );

    const updatedDuplicatedElement = Object.assign(duplicatedElement, {
        stageSteps: [],
        childReferences: updatedChildReferences,
        availableConnections,
        exitAction: orchestratedStage.exitAction,
        exitActionName: orchestratedStage.exitActionName,
        exitActionType: orchestratedStage.exitActionType,
        exitActionInputParameters: [],
        exitActionOutputParameters: []
    });
    return {
        duplicatedElement: updatedDuplicatedElement,
        duplicatedChildElements: <Map<UI.Guid, StageStep>>duplicatedChildElements
    };
}

/**
 * @param originalItems
 * @returns Object with array of StageSteps and childReferences
 */
function createStageStepsWithReferences(
    originalItems: StageStep[]
): {
    items: StageStep[];
    childReferences: UI.ChildReference[];
} {
    let items: StageStep[] = [];
    let childReferences: UI.ChildReference[] = [];

    for (let i = 0; i < originalItems.length; i++) {
        const item: StageStep = createStageStep(originalItems[i]);
        items = [...items, item];
        childReferences = updateItemReferences(childReferences, item);
    }

    return {
        items,
        childReferences
    };
}

/**
 * @param stage
 */
export function createOrchestratedStageWithItemReferences(stage: OrchestratedStage) {
    const newStage = baseCanvasElement(stage);

    const { stageSteps = [], exitActionInputParameters = [], exitActionName, exitActionType } = stage;

    const connectors = createConnectorObjects(stage, newStage.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const { items, childReferences } = createStageStepsWithReferences(stageSteps);

    Object.assign(newStage, {
        childReferences,
        connectorCount,
        maxConnections: 1,
        elementType,
        dataType: FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value,
        exitActionName,
        exitActionType,
        exitActionInputParameters
    });

    return baseCanvasElementsArrayToMap([newStage, ...items], connectors);
}

/**
 * OrchestratedStage from the property editor on close goes to the store
 *
 * @param orchestratedStage
 */
export function createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
    orchestratedStage: OrchestratedStage
) {
    const newOrchestratedStage = baseCanvasElement(orchestratedStage);
    const { stageSteps, exitActionInputParameters, exitAction, exitActionName, exitActionType } = orchestratedStage;

    const exitActionCall = createActionCallHelper(exitAction, exitActionName, exitActionType);

    const { items, childReferences } = createStageStepsWithReferences(stageSteps);

    const { deletedSteps } = getDeletedStepsUsingStore(orchestratedStage, items);

    const deletedStepGuids = deletedSteps.map((step: StageStep) => {
        return step.guid;
    });

    Object.assign(newOrchestratedStage, {
        elementType,
        childReferences,
        dataType: FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value,
        maxConnections: 1,
        exitActionInputParameters,
        exitAction: exitActionCall ? exitActionCall : null,
        exitActionName: exitActionCall.actionName,
        exitActionType: exitActionCall.actionType
    });

    return {
        canvasElement: newOrchestratedStage,
        childElements: items,
        deletedChildElementGuids: deletedStepGuids,
        elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE_WITH_MODIFIED_AND_DELETED_STEPS
    };
}

/**
 * Selector callback used for the orchestratedStageNode to provide data needed
 * for dynamic rendering on the canvas
 *
 * @param guid
 */
export function getSteps(guid: UI.Guid): StageStep[] {
    const orchestratedStage = getElementByGuid<OrchestratedStage>(guid)!;

    return orchestratedStage.childReferences.map(
        (ref: UI.ChildReference): StageStep => {
            return <StageStep>{
                ...getElementByGuid(ref.childReference)!,
                // TODO: W-8051764: This will eventually need to be dynamic based on the step type
                stepTypeLabel: LABELS.workStepLabel
            };
        }
    );
}

/**
 *
 */
export function getOrchestratedStageChildren(): UI.StringKeyedMap<any> {
    return {
        Status: {
            label: LABELS.orchestratedStageStatus,
            name: 'Status',
            apiName: 'Status',
            dataType: FLOW_DATA_TYPE.STRING.value
        }
    };
}

const getActionNameAndType = (action: InvocableAction): { actionName: string; actionType: string } => {
    return {
        actionName: action.actionName,
        actionType: action.actionType
    };
};

/**
 * @param element
 */
export function getStageStepChildren(element: UI.Element): UI.StringKeyedMap<any> {
    // Explicit cast should be safe since we should only call this version
    // with StageSteps
    const step = (element as unknown) as StageStep;
    const comboboxitems: UI.StringKeyedMap<any> = {
        Status: {
            label: LABELS.stageStepStatus,
            name: 'Status',
            apiName: 'Status',
            dataType: FLOW_DATA_TYPE.STRING.value
        }
    };

    const { actionName, actionType } = getActionNameAndType(step.action);

    let outputParameters: ParameterListRowItem[] = [];
    if (step.outputParameters.length > 0) {
        // Use the already loaded output parameters
        outputParameters = step.outputParameters;
    } else if (actionName && actionType) {
        // check for asynchronously loaded output parameters for the associated action
        outputParameters = getParametersForInvocableAction({
            actionName,
            actionType,
            dataTypeMappings: []
        })
            .filter((parameter) => {
                return parameter.isOutput;
            })
            .map((outputParameter) => {
                return createOutputParameter({
                    ...outputParameter,
                    valueDataType: getFlowType(outputParameter.dataType).value,
                    isCollection: outputParameter.maxOccurs > 1
                });
            });
    }

    if (outputParameters && outputParameters.length > 0) {
        comboboxitems.Outputs = {
            label: LABELS.stageStepOutput,
            name: 'Outputs',
            apiName: 'Outputs',
            dataType: FLOW_DATA_TYPE.ACTION_OUTPUT.value,
            // Subtype is added so that menu traversal will recognize outputs
            // for a given action as a different "type" needing a call to getChildrenItems
            subtype: step.action.actionName,
            isSpanningAllowed: true,
            getChildrenItems: () => {
                const children = {};
                outputParameters.forEach(
                    (output: ParameterListRowItem) =>
                        (children[<string>output.name] = {
                            label: output.name,
                            name: output.name,
                            apiName: output.name,
                            dataType: output.valueDataType,
                            subtype: output.subtype,
                            isCollection: output.isCollection
                        })
                );

                return children;
            }
        };
    }

    return comboboxitems;
}

const createActionCallHelper = (
    action: InvocableAction | null,
    actionName: string | undefined,
    actionType: string | undefined
): InvocableAction => {
    let actionCall: InvocableAction | null = null;
    if (action) {
        actionCall = createActionCall(action);
    } else {
        actionCall = createActionCall({
            actionName,
            actionType
        });
    }

    // actionType needs to be null not '' if not present
    actionCall.actionType = actionCall.actionType ? actionCall.actionType : null;

    return actionCall;
};

const setupStepWithLabels = (step: StageStep): StageStep => {
    const baseStep = { ...step };

    // Default label
    // TODO: This is an incomplete version of the logic needed for full property editor
    // in panel support.  for example, this does not currently prevent duplicate guids
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000007Q6YUIA0/view
    if (!baseStep.label && baseStep.parent) {
        const orchestratedStage = getElementByGuid<OrchestratedStage>(baseStep.parent)!;
        baseStep.label = format(
            LABELS.defaultStageStepName,
            orchestratedStage.childReferences.length + 1,
            orchestratedStage.label
        );
        baseStep.name = sanitizeDevName(baseStep.label);
    }

    // Currently, we only have one step type
    if (!baseStep.stepTypeLabel) {
        baseStep.stepTypeLabel = LABELS.workStepLabel;
    }

    return <StageStep>baseChildElement(baseStep, ELEMENT_TYPE.STAGE_STEP);
};

/**
 * Note: When creating StageSteps during initial load, the output parameters are not
 * available.  They are injected asynchronously by preloadLib.loadParametersForStageStepsInFlow
 *
 * @param step
 */
export function createStageStep(step: StageStep): StageStep {
    const newStep = setupStepWithLabels(step);
    newStep.dataType = FLOW_DATA_TYPE.STAGE_STEP.value;

    const {
        entryConditions,
        action,
        inputParameters = [],
        outputParameters = [],
        entryAction,
        entryActionInputParameters = [],
        exitAction,
        exitActionInputParameters = [],
        assignees,
        relatedRecordItem
    } = step;

    // set up Step Action
    newStep.action = createActionCallHelper(action, step.actionName, step.actionType)!;
    newStep.inputParameters = inputParameters.map((p) => createInputParameter(p));
    // Make sure valueDataType (expected by the ui) is set
    newStep.outputParameters = outputParameters.map((outputParameter) =>
        createOutputParameter({
            ...outputParameter,
            // If the outputParameter doesn't have a dataType field, it was already transformed and stored with valueDataType instead.
            valueDataType: outputParameter.dataType ? outputParameter.dataType : outputParameter.valueDataType,
            isCollection:
                outputParameter.maxOccurs && outputParameter.maxOccurs > 1 ? true : outputParameter.isCollection
        })
    );

    if (typeof relatedRecordItem !== 'undefined') {
        newStep.relatedRecordItem = { ...relatedRecordItem };
    } else {
        // Coming from metadata.  Get the related record out of the input parameters
        newStep.inputParameters.some((inputParameter) => {
            if (inputParameter.name === RELATED_RECORD_INPUT_PARAMETER_NAME && inputParameter.value) {
                newStep.relatedRecordItem = Object.assign({}, inputParameter);
                return true;
            }
            return false;
        });

        // Nothing in metadata
        if (!newStep.relatedRecordItem) {
            newStep.relatedRecordItem = Object.assign({}, relatedRecordItem);
        }
    }

    // Default to no assignees
    newStep.assignees = [
        {
            assignee: null,
            assigneeType: ASSIGNEE_TYPE.User
        }
    ];

    // Coming from metadata object - convert assignee
    if (
        assignees?.length > 0 &&
        assignees[0]?.assignee &&
        (assignees[0].assignee.stringValue || assignees[0].assignee.referenceValue)
    ) {
        newStep.assignees = assignees.map((assigneeFromMetadata) => {
            return assigneeFromMetadata
                ? {
                      assignee: {
                          ...createFEROV(
                              assigneeFromMetadata.assignee,
                              ASSIGNEE_PROPERTY_NAME,
                              ASSIGNEE_DATA_TYPE_PROPERTY_NAME
                          )
                      }[ASSIGNEE_PROPERTY_NAME],
                      assigneeType: assigneeFromMetadata.assigneeType
                  }
                : null;
        });
    } else if (assignees) {
        // coming from UI
        newStep.assignees = assignees.map((assigneeWithType) => {
            return assigneeWithType?.assignee
                ? {
                      assignee: assigneeWithType.assignee?.elementReference
                          ? { ...assigneeWithType.assignee }
                          : assigneeWithType.assignee,
                      assigneeType: assigneeWithType.assigneeType
                  }
                : {
                      assignee: null,
                      assigneeType: ASSIGNEE_TYPE.User
                  };
        });
    }

    // set up Step's Entry Criteria
    if (entryConditions) {
        newStep.entryConditions = entryConditions.map<UI.Condition>(
            (condition) => <UI.Condition>createCondition(condition)
        );
    }
    newStep.entryAction = createActionCallHelper(entryAction, step.entryActionName, step.entryActionType);
    newStep.entryActionInputParameters = entryActionInputParameters.map((p) => createInputParameter(p));

    // set up Step's Exit Criteria
    newStep.exitAction = createActionCallHelper(exitAction, step.exitActionName, step.exitActionType);
    newStep.exitActionInputParameters = exitActionInputParameters.map((p) => createInputParameter(p));

    return { ...step, ...newStep };
}

/**
 * @param orchestratedStage
 * @param config
 */
export function createOrchestratedStageMetadataObject(
    orchestratedStage: OrchestratedStage,
    config = {}
): OrchestratedStage {
    const { childReferences } = orchestratedStage;

    const stageSteps = childReferences.map(({ childReference }) => {
        const step: StageStep = <StageStep>getElementByGuid(childReference);

        const entryConditionsMetadata = step.entryConditions
            ? step.entryConditions.map((condition) => createConditionMetadataObject(condition))
            : null;

        // Inject related record item input param
        const inputParametersWithRelatedRecord: ParameterListRowItem[] = step.inputParameters.map((p) => {
            if (p.name === RELATED_RECORD_INPUT_PARAMETER_NAME && isParameterListRowItem(step.relatedRecordItem)) {
                return step.relatedRecordItem;
            }

            return p;
        });

        const inputParametersMetadata = inputParametersWithRelatedRecord.map((p) =>
            createInputParameterMetadataObject(p)
        );
        const entryActionInputParametersMetadata = step.entryActionInputParameters.map((p) =>
            createInputParameterMetadataObject(p)
        );
        const exitActionInputParametersMetadata = step.exitActionInputParameters.map((p) =>
            createInputParameterMetadataObject(p)
        );

        return {
            ...baseChildElementMetadataObject(step, config),
            entryConditions: entryConditionsMetadata,
            actionName: step.action.actionName,
            actionType: step.action.actionType,
            inputParameters: inputParametersMetadata,
            description: step.description,
            // Filter out any assignees on the UI side who don't actually have an assignee set
            assignees: step.assignees
                .filter((assigneeUI) => assigneeUI?.assignee)
                .map((assigneeUI) => {
                    let assigneeForMetadata = assigneeUI!.assignee;

                    let ferovDataType: string | null = FEROV_DATA_TYPE.STRING;
                    if (assigneeForMetadata && assigneeForMetadata.elementReference) {
                        assigneeForMetadata = assigneeForMetadata.elementReference;
                        ferovDataType = FEROV_DATA_TYPE.REFERENCE;
                    }

                    return assigneeUI
                        ? {
                              assignee: createFEROVMetadataObject(
                                  {
                                      assignee: assigneeForMetadata,
                                      assigneeDataType: ferovDataType
                                  },
                                  ASSIGNEE_PROPERTY_NAME,
                                  ASSIGNEE_DATA_TYPE_PROPERTY_NAME
                              ),
                              assigneeType: assigneeUI.assigneeType
                          }
                        : null;
                }),
            entryActionName: step.entryAction.actionName ? step.entryAction.actionName : null,
            entryActionType: step.entryAction.actionType,
            entryActionInputParameters: entryActionInputParametersMetadata,
            exitActionName: step.exitAction.actionName ? step.exitAction.actionName : null,
            exitActionType: step.exitAction.actionType,
            exitActionInputParameters: exitActionInputParametersMetadata
        };
    });

    const stageExitActionInputParametersMetadata = orchestratedStage.exitActionInputParameters.map((p) =>
        createInputParameterMetadataObject(p)
    );

    const newOrchestratedStage: OrchestratedStage = Object.assign(
        baseCanvasElementMetadataObject(orchestratedStage, config),
        {
            stageSteps,
            exitActionName: orchestratedStage.exitAction?.actionName,
            exitActionType: orchestratedStage.exitAction?.actionType,
            exitActionInputParameters: stageExitActionInputParametersMetadata
        }
    );

    return newOrchestratedStage;
}

/**
 * @param childReferences
 * @param step
 */
function updateItemReferences(childReferences: any[], step: StageStep): UI.ChildReference[] {
    return [
        ...childReferences,
        {
            childReference: step.guid
        }
    ];
}

// TODO: Refactor with Decision and Wait functions here to use common code path
/**
 * @param originalOrchestratedStage
 * @param newSteps
 */
function getDeletedStepsUsingStore(originalOrchestratedStage: OrchestratedStage, newSteps: StageStep[] = []) {
    if (!originalOrchestratedStage) {
        throw new Error('Stepped stage is not defined');
    }
    const { guid } = originalOrchestratedStage;
    const orchestratedStageFromStore = getElementByGuid<OrchestratedStage>(guid);
    let stepReferencesFromStore;
    if (orchestratedStageFromStore) {
        stepReferencesFromStore = orchestratedStageFromStore.childReferences.map((ref) => ref.childReference);
    }

    const newStepGuids = newSteps.map((newStep: StageStep) => newStep.guid);

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
 * Returns all items in the parent OrchestratedStage *other* than the item passed in.
 * If no parent orchestratedStage is found, an Error is thrown
 *
 * @param guid of the OrchestratedStage
 * @returns Array of StageSteps contained in the OrchestratedStage
 */
export function getOtherItemsInOrchestratedStage(guid: UI.Guid): StageStep[] {
    const parent: OrchestratedStage | null = <OrchestratedStage>getElementsForElementType(
        ELEMENT_TYPE.ORCHESTRATED_STAGE
    ).find((orchestratedStage) => {
        return (orchestratedStage as OrchestratedStage).childReferences.find((ref) => ref.childReference === guid);
    });

    if (!parent) {
        throw Error('No parent OrchestratedStage found for StageStep ' + guid);
    }

    const siblingItems: StageStep[] = [];

    parent.childReferences.forEach((ref) => {
        if (ref.childReference !== guid) {
            siblingItems.push(getElementByGuid<StageStep>(ref.childReference)!);
        }
    });

    return siblingItems;
}
