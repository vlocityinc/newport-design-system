import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { SteppedStage } from 'builder_platform_interaction/elementFactory';

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

const steppedStagePropertyChanged = (state: SteppedStage, event: CustomEvent): SteppedStage => {
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
 * steppedStage reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const steppedStageReducer = (state: SteppedStage, event: CustomEvent): SteppedStage => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return steppedStagePropertyChanged(state, event);
        // case VALIDATE_ALL:
        // TODO: validate in future WI
        //     return decisionValidation.validateAll(state);
        default:
            return state;
    }
};
