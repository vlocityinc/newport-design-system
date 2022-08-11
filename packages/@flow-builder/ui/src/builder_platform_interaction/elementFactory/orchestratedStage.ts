import { unbox, ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE, FLOW_DATA_TYPE, getFlowType } from 'builder_platform_interaction/dataTypeLib';
import {
    ACTION_TYPE,
    ELEMENT_TYPE,
    EntryCriteria,
    ExitCriteria,
    StageExitCriteria
} from 'builder_platform_interaction/flowMetadata';
import { getParametersForInvocableAction, InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getElementByGuid, getElementsForElementType } from 'builder_platform_interaction/storeUtils';
import { createActionCall } from './actionCall';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    createCondition,
    duplicateCanvasElementWithChildElements
} from './base/baseElement';
import { isParameterListRowItem, ParameterListRowItem } from './base/baseList';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from './base/baseMetadata';
import { createConnectorObjects } from './connector';
import { LABELS } from './elementFactoryLabels';
import { createFEROV, createFEROVMetadataObject, getDataTypeKey } from './ferov';
import { createInputParameter, createInputParameterMetadataObject } from './inputParameter';
import { createOutputParameter } from './outputParameter';

const { format } = commonUtils;
const FLOW_INTERVIEW_STATUS = 'Flow__InterviewStatus';

export const ASSIGNEE_PROPERTY_NAME = 'assignee';
export const ASSIGNEE_DATA_TYPE_PROPERTY_NAME = getDataTypeKey(ASSIGNEE_PROPERTY_NAME);
export enum ASSIGNEE_TYPE {
    User = 'User',
    Group = 'Group',
    Queue = 'Queue'
}

/**
 * These are used only on the frontend for distinguishing selection of hardcoded versus resource values for an assignee type
 */
export enum ASSIGNEE_RESOURCE_TYPE {
    UserResource = 'UserResource',
    GroupResource = 'GroupResource',
    QueueResource = 'QueueResource'
}

// Used to extra related record for display in its own input
export const RELATED_RECORD_INPUT_PARAMETER_NAME = 'ActionInput__RecordId';

// TODO: Move to UIModel.d.ts after action dependencies have been moved there
// https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000095RTIIA2/view
export interface StageStep extends UI.ChildElement {
    parent: UI.Guid;
    stepTypeLabel: string;
    icon: string;
    stepSubtype: UI.StageStepSubtype;

    relatedRecordItem: ParameterListRowItem | UI.HydratedValue;

    assignees: ({ assignee: any; assigneeType: ASSIGNEE_TYPE | ValueWithError; isReference: boolean } | null)[];

    entryConditions?: UI.Condition[];
    entryConditionLogic?: string;
    entryAction: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    // Need a better way to handle error from child component: W-10088192
    entryActionError?: string | ValueWithError;

    entryActionName: string;
    entryActionType: string;
    entryActionInputParameters: ParameterListRowItem[];
    entryCriteria: EntryCriteria | ValueWithError;

    action: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    // Need a better way to handle error from child component: W-10088192
    actionError?: string | ValueWithError;

    // Present when coming from the metadata, but not in the ui StageStep
    actionName?: string;
    actionType?: string;

    inputParameters: ParameterListRowItem[];
    outputParameters: ParameterListRowItem[];

    exitAction: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    // Need a better way to handle error from child component: W-10088192
    exitActionError?: string | ValueWithError;

    exitActionName: string;
    exitActionType: string;
    exitActionInputParameters: ParameterListRowItem[];
    exitCriteria: ExitCriteria | ValueWithError;

    // This has a canvas config for display of error state but this is not actually a base canvas element (i.e. it has no connectors)
    config: UI.CanvasElementConfig;

    requiresAsyncProcessing?: boolean;
}

// TODO: Move to UIModel.d.ts after action dependencies have been moved there
// https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000095RTIIA2/view
export interface OrchestratedStage extends UI.CanvasElement {
    parent?: UI.Guid;
    stageSteps: StageStep[];
    childReferences: UI.ChildReference[];

    exitAction: InvocableAction;
    // Used by the UI to keep track of errors on the action between displays
    // of the property editor
    // Need a better way to handle error from child component: W-10088192
    exitActionError?: string | ValueWithError;

    exitActionName: string;
    exitActionType: string;
    exitActionInputParameters: ParameterListRowItem[];
    exitCriteria: StageExitCriteria | ValueWithError;
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
    newStage.exitActionError = existingStage.exitActionError;
    newStage.exitCriteria =
        existingStage.exitCriteria ||
        (newStage.exitAction?.actionName
            ? StageExitCriteria.ON_DETERMINATION_COMPLETE
            : StageExitCriteria.ON_STEP_COMPLETE);

    return newStage;
}

/**
 * Function to create the duplicate Orchestrated Stage element
 *
 * @param orchestratedStage - OrchestratedStage element being copied
 * @param newGuid - Guid for the new duplicated element
 * @param newName - Name for the new duplicated element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameAndLabelMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @returns {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateOrchestratedStage(
    orchestratedStage: OrchestratedStage,
    newGuid: UI.Guid,
    newName: string,
    childElementGuidMap,
    childElementNameAndLabelMap,
    cutOrCopiedChildElements
): {
    duplicatedElement: OrchestratedStage;
    duplicatedChildElements: Map<UI.Guid, StageStep>;
} {
    const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } =
        duplicateCanvasElementWithChildElements(
            orchestratedStage,
            newGuid,
            newName,
            childElementGuidMap,
            childElementNameAndLabelMap,
            cutOrCopiedChildElements,
            createStageStep
        );

    // the parent property is used to create the focus path it is added to the step in freeFormToAutoLayout.ts
    // When we copy the element we need to be sure to modify the parent Guid
    for (const childElement in duplicatedChildElements) {
        if (duplicatedChildElements[childElement].hasOwnProperty('parent')) {
            duplicatedChildElements[childElement].parent = newGuid;
        }
    }

    const updatedDuplicatedElement = Object.assign(duplicatedElement, {
        stageSteps: [],
        childReferences: updatedChildReferences,
        availableConnections,
        exitAction: orchestratedStage.exitAction,
        exitActionName: orchestratedStage.exitActionName,
        exitActionType: orchestratedStage.exitActionType,
        exitActionInputParameters: orchestratedStage.exitActionInputParameters,
        exitActionOutputParameters: [],
        exitCriteria: orchestratedStage.exitCriteria
    });
    return {
        duplicatedElement: updatedDuplicatedElement,
        duplicatedChildElements: <Map<UI.Guid, StageStep>>duplicatedChildElements
    };
}

/**
 * @param originalItems The StageSteps to be processed
 * @param parentStageGuid guide of the stage
 * @returns Object with array of StageSteps and childReferences
 */
function createStageStepsWithReferences(
    originalItems: StageStep[],
    parentStageGuid: UI.Guid
): {
    items: StageStep[];
    childReferences: UI.ChildReference[];
} {
    let items: StageStep[] = [];
    let childReferences: UI.ChildReference[] = [];

    for (let i = 0; i < originalItems.length; i++) {
        const item: StageStep = createStageStep(originalItems[i]);
        item.parent = parentStageGuid;
        items = [...items, item];
        childReferences = updateItemReferences(childReferences, item);
    }

    return {
        items,
        childReferences
    };
}

/**
 * @param stage to be processed
 * @returns Stage with child references
 */
export function createOrchestratedStageWithItemReferences(stage: OrchestratedStage) {
    const newStage = baseCanvasElement(stage);

    const {
        stageSteps = [],
        exitActionInputParameters = [],
        exitAction,
        exitActionName,
        exitActionType,
        exitCriteria
    } = stage;
    const exitActionCall = createActionCallHelper(exitAction, exitActionName, exitActionType);

    const connectors = createConnectorObjects(stage, newStage.guid, null);
    const connectorCount = connectors ? connectors.length : 0;

    const { items, childReferences } = createStageStepsWithReferences(stageSteps, newStage.guid);

    const exitActionInputParametersUiObject = exitActionInputParameters.map((p) => createInputParameter(p));

    Object.assign(newStage, {
        childReferences,
        connectorCount,
        maxConnections: 1,
        elementType,
        dataType: FLOW_DATA_TYPE.ORCHESTRATED_STAGE.value,
        exitAction: exitActionCall,
        exitActionName,
        exitActionType,
        exitActionInputParameters: exitActionInputParametersUiObject,
        exitCriteria
    });

    return baseCanvasElementsArrayToMap([newStage, ...items], connectors);
}

/**
 * OrchestratedStage from the property editor on close goes to the store
 *
 * @param orchestratedStage to be processed
 * @returns The stage with child references
 */
export function createOrchestratedStageWithItemReferencesWhenUpdatingFromPropertyEditor(
    orchestratedStage: OrchestratedStage
) {
    const newOrchestratedStage = baseCanvasElement(orchestratedStage);
    const {
        stageSteps,
        exitActionInputParameters,
        exitAction,
        exitActionError,
        exitActionName,
        exitActionType,
        exitCriteria
    } = orchestratedStage;

    const exitActionCall = createActionCallHelper(exitAction, exitActionName, exitActionType);

    const { items, childReferences } = createStageStepsWithReferences(stageSteps, orchestratedStage.guid);

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
        exitActionError,
        exitActionName: exitActionCall.actionName,
        exitActionType: exitActionCall.actionType,
        exitCriteria
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
 * @param guid of the stage
 * @returns The stage with type label
 */
export function getSteps(guid: UI.Guid): StageStep[] {
    const orchestratedStage = getElementByGuid<OrchestratedStage>(guid)!;

    return orchestratedStage.childReferences.map((ref: UI.ChildReference): StageStep => {
        const stageStep = getElementByGuid<StageStep>(ref.childReference)!;
        const stepTypeLabel = resolveStepTypeLabel(stageStep.actionType!);

        return <StageStep>{
            ...stageStep,
            stepTypeLabel
        };
    });
}

/**
 * Resolve the step label using the action type.
 * If no action type is present, i.e. user had not set flow details
 * on the step, choose no action type is set, return the default step type - interactive step.
 *
 * @param actionType of the step
 * @returns The label to be used based on the step type
 */
const resolveStepTypeLabel = (actionType: string) => {
    if (actionType === ACTION_TYPE.STEP_BACKGROUND) {
        return LABELS.backgroundStepLabel;
    } else if (actionType === ACTION_TYPE.STEP_INTERACTIVE) {
        return LABELS.interactiveStepLabel;
    }

    // User will be blocked to save an orchestration without
    // action. i.e. without choosing the flow to be run.
    // So, ideally, action should always be populated in the step.
    // return null if action is not present.
    return null;
};
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
    const step = element as unknown as StageStep;
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
    const blockList: string[] = [FLOW_INTERVIEW_STATUS];
    if (step.outputParameters.length > 0) {
        // Use the already loaded output parameters
        outputParameters = step.outputParameters.filter((parameter) => {
            return !blockList.includes(unbox(parameter.name, 'value'));
        });
    } else if (actionName && actionType) {
        // check for asynchronously loaded output parameters for the associated action
        outputParameters = getParametersForInvocableAction({
            actionName,
            actionType,
            dataTypeMappings: []
        })
            .filter((parameter) => {
                return parameter.isOutput && !blockList.includes(unbox(parameter.name, 'value'));
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

    // Determine the step type label using the action type.
    baseStep.stepTypeLabel = resolveStepTypeLabel(baseStep.actionType!);
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
        relatedRecordItem,
        entryCriteria,
        exitCriteria,
        stepSubtype,
        elementSubtype
    } = step;

    if (!stepSubtype && elementSubtype) {
        // this is needed because when steps are created the AddElementEvent will use
        // the property name 'elementSubtype' whereas our StageStep expects/stores stepSubtype
        // in the db
        newStep.stepSubtype = elementSubtype as UI.StageStepSubtype;
    }
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

    // Only create and add an entry to the assignees array if it is an interactive step, which will save us from validation errors.
    // Default to no assignees
    newStep.assignees = [];
    if (step.actionType === ACTION_TYPE.STEP_INTERACTIVE) {
        newStep.assignees.push({
            assignee: null,
            assigneeType: ASSIGNEE_TYPE.User,
            isReference: false
        });
    }

    // Coming from metadata object - convert assignee
    if (
        assignees?.length > 0 &&
        assignees[0]?.assignee &&
        (assignees[0].assignee.stringValue || assignees[0]?.assignee.elementReference)
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
                      assigneeType: assigneeFromMetadata.assigneeType,
                      isReference: assigneeFromMetadata.isReference || !!assigneeFromMetadata.assignee.elementReference
                  }
                : null;
        });
    } else if (assignees?.length > 0) {
        // coming from UI
        newStep.assignees = assignees.map((assigneeWithType) => {
            return assigneeWithType?.assignee
                ? {
                      assignee: assigneeWithType.assignee?.elementReference
                          ? { ...assigneeWithType.assignee }
                          : assigneeWithType.assignee,
                      assigneeType: assigneeWithType.assigneeType,
                      isReference: assigneeWithType.isReference
                  }
                : {
                      assignee: null,
                      assigneeType: assigneeWithType ? assigneeWithType.assigneeType : ASSIGNEE_TYPE.User,
                      isReference: assigneeWithType ? assigneeWithType.isReference : false
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

    // infer entryCriteria if not present
    if (entryCriteria) {
        newStep.entryCriteria = entryCriteria;
    } else if (newStep.entryAction.actionName) {
        // entryAction exists and has populated data
        newStep.entryCriteria = EntryCriteria.ON_DETERMINATION_COMPLETE;
    } else if (newStep.entryConditions && newStep.entryConditions.length > 0) {
        newStep.entryCriteria = EntryCriteria.ON_STEP_COMPLETE;
    } else {
        newStep.entryCriteria = EntryCriteria.ON_STAGE_START;
    }

    // set up Step's Exit Criteria
    newStep.exitAction = createActionCallHelper(exitAction, step.exitActionName, step.exitActionType);
    newStep.exitActionInputParameters = exitActionInputParameters.map((p) => createInputParameter(p));

    // infer exitCriteria if not present
    newStep.exitCriteria =
        exitCriteria ||
        (newStep.exitAction.actionName ? ExitCriteria.ON_DETERMINATION_COMPLETE : ExitCriteria.ON_STEP_COMPLETE);

    // check if there's an existing config
    if (!step.config) {
        newStep.config = { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false };
    }

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
            stepSubtype: step.stepSubtype,
            // Filter out any assignees on the UI side who don't actually have an assignee set
            assignees: step.assignees
                .filter((assigneeUI) => assigneeUI?.assignee)
                .map((assigneeUI) => {
                    const isReference = assigneeUI!.isReference;

                    let assigneeForMetadata = assigneeUI!.assignee;

                    const ferovDataType: string | null = isReference
                        ? FEROV_DATA_TYPE.REFERENCE
                        : FEROV_DATA_TYPE.STRING;
                    if (assigneeForMetadata && assigneeForMetadata.elementReference) {
                        assigneeForMetadata = assigneeForMetadata.elementReference;
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
            exitActionInputParameters: exitActionInputParametersMetadata,
            requiresAsyncProcessing: step.requiresAsyncProcessing
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
