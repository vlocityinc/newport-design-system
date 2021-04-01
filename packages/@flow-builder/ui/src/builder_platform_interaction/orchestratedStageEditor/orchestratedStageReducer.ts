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

//
// const deleteOutcome = (state, event) => {
//     const usedElements = usedByStoreAndElementState(event.detail.guid, state.guid, state.outcomes);
//     if (usedElements && usedElements.length > 0) {
//         invokeUsedByAlertModal(usedElements, [event.detail.guid], ELEMENT_TYPE.OUTCOME);
//     } else {
//         const outcomes = state.outcomes.filter(outcome => {
//             return outcome.guid !== event.detail.guid;
//         });
//
//         // store guids that have been removed
//         // TODO: W-5507691 handle addition/removal of store elements inside editors more cleanly
//         deletedOutcomeGuids.set(event.detail.guid, true);
//
//         return updateProperties(state, { outcomes });
//     }
//     return state;
// };
//

// const validateProperty = (state, event) => {
//     event.detail.error =
//         event.detail.error === null
//             ? decisionValidation.validateProperty(event.detail.propertyName, event.detail.value)
//             : event.detail.error;
//     if (event.detail.error === null && event.detail.propertyName === 'name') {
//         // we need to run the outcome api name uniqueness validation within the current session of property editor
//         event.detail.error = decisionValidation.validateOutcomeNameUniquenessLocally(
//             state,
//             event.detail.value,
//             event.detail.guid
//         );
//     }
// };
//

const orchestratedStagePropertyChanged = (state: OrchestratedStage, event: CustomEvent): OrchestratedStage => {
    event.detail.guid = state.guid;

    // TODO: validate in future WI
    // validateProperty(state, event);

    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * delete an entry/exit determination action
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
        // case VALIDATE_ALL:
        // TODO: validate in future WI
        //     return decisionValidation.validateAll(state);
        case MERGE_WITH_PARAMETERS:
            return mergeParameters(state, event.detail.parameters, ORCHESTRATED_ACTION_CATEGORY.EXIT);
        default:
            return state;
    }

    // Remove all "not included" input parameters from state before returning it for the store
    return removeAllUnsetParameters(newState);
};
