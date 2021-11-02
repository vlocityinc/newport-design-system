import { hydrateWithErrors, updateProperties, ValueWithError } from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteOrchestrationActionEvent,
    DeleteParameterItemEvent,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateEntryExitCriteriaEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { OrchestratedStage } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS,
    validateParameter
} from 'builder_platform_interaction/calloutEditorLib';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ELEMENT_TYPE, StageExitCriteria } from 'builder_platform_interaction/flowMetadata';
import {
    mergeParameters,
    updateParameterItem,
    deleteParameterItem,
    removeUnsetParameters,
    removeAllUnsetParameters,
    mergeActionErrorToActionName,
    validateProperty
} from 'builder_platform_interaction/orchestratedStageAndStepReducerUtils';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';
import * as ValidationRules from 'builder_platform_interaction/validationRules';

const validationRules = {
    label: [ValidationRules.shouldNotBeNullOrUndefined],
    name: [ValidationRules.shouldNotBeNullOrUndefined],
    exitActionInputParameters: validateParameter()
};

const validation = new Validation(validationRules);

/**
 * Get finalized rules for validation
 *
 * @param state
 * @returns overriddenRules - the overridden rules
 */
export const getRules = (state: OrchestratedStage) => {
    const overriddenRules = Object.assign({}, validation.finalizedRules);
    if ((state.exitCriteria as ValueWithError)?.value === StageExitCriteria.ON_DETERMINATION_COMPLETE) {
        overriddenRules.exitAction = {
            actionName: [ValidationRules.shouldNotBeNullOrUndefined, ValidationRules.shouldNotBeBlank]
        };
    }
    return overriddenRules;
};

/**
 * Update a property (zpi name/label)
 *
 * @param state Element state
 * @param event the event to be handled
 * @returns New element state
 */
const orchestratedStagePropertyChanged = (state: OrchestratedStage, event: CustomEvent): OrchestratedStage => {
    event.detail.guid = state.guid;

    validateProperty(event, validation);

    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * delete an entry/exit determination action
 *
 * @param state Element state
 * @param event the delete event to be handled
 * @returns New element state
 */
const deleteDeterminationAction = (
    state: OrchestratedStage,
    event: DeleteOrchestrationActionEvent
): OrchestratedStage => {
    const src = event.detail.actionCategory;
    if (src === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
        return updateProperties(state, {
            exitAction: null,
            exitActionError: null,
            exitActionName: null,
            exitActionType: null,
            exitActionInputParameters: []
        });
    }
    return state;
};

/**
 * Change for any of the actions
 *
 * @param state Element state
 * @param event the change event to be handled
 * @returns New element state
 */
const actionChanged = (
    state: OrchestratedStage,
    event: OrchestrationActionValueChangedEvent<InvocableAction>
): OrchestratedStage => {
    if (event.detail.value) {
        const actionName: string = (<InvocableAction>event.detail.value).actionName;

        let action = hydrateWithErrors({
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionType: event.detail.value?.actionType,
            actionName
        });

        if (event.detail.error) {
            action = {
                ...action,
                actionName: {
                    value: event.detail.value?.displayText,
                    error: event.detail.error
                }
            };
        }

        return updateProperties(state, {
            exitAction: action,
            exitActionError: event.detail.error,
            // Clear all parameters when changing action
            exitActionInputParameters: [],
            exitActionOutputParameters: []
        });
    }

    return state;
};

/**
 * Update the exitCriteria field on the flow model
 *
 * @param state The flow model
 * @param event The event
 * @returns new object with updated properties
 */
const updateExitCriteria = (state: OrchestratedStage, event: UpdateEntryExitCriteriaEvent) => {
    return updateProperties(state, {
        exitCriteria: {
            value: event.detail.criteria,
            error: null
        }
    });
};

/**
 * orchestratedStage reducer function runs validation rules and returns back the updated element state
 *
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const orchestratedStageReducer = (state: OrchestratedStage, event: CustomEvent): OrchestratedStage => {
    let newState: OrchestratedStage = state;

    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            newState = orchestratedStagePropertyChanged(state, event);
            break;
        case REMOVE_UNSET_PARAMETERS:
            newState = removeUnsetParameters(state, event.detail.rowIndex);
            break;
        case DeleteOrchestrationActionEvent.EVENT_NAME:
            newState = deleteDeterminationAction(state, event);
            break;
        case OrchestrationActionValueChangedEvent.EVENT_NAME:
            newState = actionChanged(state, event);
            break;
        case UpdateParameterItemEvent.EVENT_NAME:
            newState = updateParameterItem(state, event.detail);
            break;
        case DeleteParameterItemEvent.EVENT_NAME:
            newState = deleteParameterItem(state, event.detail);
            break;
        case UpdateEntryExitCriteriaEvent.EVENT_NAME:
            newState = updateExitCriteria(state, event);
            break;
        case VALIDATE_ALL:
            state = updateProperties(state, {
                exitAction: mergeActionErrorToActionName(state.exitAction, state.exitActionError)
            });
            return validation.validateAll(state, getRules(state));
        case MERGE_WITH_PARAMETERS:
            return mergeParameters(state, event.detail.parameters, ORCHESTRATED_ACTION_CATEGORY.EXIT);
        default:
            return state;
    }

    // Remove all "not included" input parameters from state before returning it for the store
    return removeAllUnsetParameters(newState);
};
