import { hydrateWithErrors, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteOrchestrationActionEvent,
    DeleteParameterItemEvent,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { OrchestratedStage } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    deleteParameterItem,
    MERGE_WITH_PARAMETERS,
    REMOVE_UNSET_PARAMETERS
} from 'builder_platform_interaction/calloutEditorLib';
import { InvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    mergeParameters,
    updateParameterItem,
    removeUnsetParameters,
    removeAllUnsetParameters
} from 'builder_platform_interaction/orchestratedStageAndStepReducerUtils';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

const validation = new Validation();

const validateProperty = (state, event) => {
    event.detail.error =
        event.detail.error === null
            ? validation.validateProperty(event.detail.propertyName, event.detail.value, null)
            : event.detail.error;
};

const orchestratedStagePropertyChanged = (state: OrchestratedStage, event: CustomEvent): OrchestratedStage => {
    event.detail.guid = state.guid;

    validateProperty(state, event);

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
 * @param state
 * @param event
 */
const deleteDeterminationAction = (
    state: OrchestratedStage,
    event: DeleteOrchestrationActionEvent
): OrchestratedStage => {
    const src = event.detail.actionCategory;
    if (src === ORCHESTRATED_ACTION_CATEGORY.EXIT) {
        return updateProperties(state, {
            exitAction: null,
            exitActionName: null,
            exitActionType: null,
            exitActionInputParameters: []
        });
    }
    return state;
};

const actionChanged = (
    state: OrchestratedStage,
    event: OrchestrationActionValueChangedEvent<InvocableAction>
): OrchestratedStage => {
    if (event.detail.value) {
        const actionName: string = (<InvocableAction>event.detail.value).actionName;

        const action = hydrateWithErrors({
            elementType: ELEMENT_TYPE.ACTION_CALL,
            actionType: ACTION_TYPE.FLOW,
            actionName
        });

        return updateProperties(state, {
            exitAction: action,
            exitActionName: actionName,
            // Clear all parameters when changing action
            exitActionInputParameters: [],
            exitActionOutputParameters: []
        });
    }

    return state;
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
        case VALIDATE_ALL:
            return validation.validateAll(state, {});
        case MERGE_WITH_PARAMETERS:
            return mergeParameters(state, event.detail.parameters, ORCHESTRATED_ACTION_CATEGORY.EXIT);
        default:
            return state;
    }

    // Remove all "not included" input parameters from state before returning it for the store
    return removeAllUnsetParameters(newState);
};
