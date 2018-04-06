import {decisionValidation} from './decision-validation';
import {updateProperties, addItem, deleteItem, replaceItem} from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction-events';

// TODO: Refactor with assignment reducer / new CommonReducer for common code?

const addCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        return outcome.guid.value === event.parentGUID ? updateProperties(outcome, {
            conditions: addItem(outcome.conditions, {}),
        }) : outcome;
    });


    return updateProperties(state, {outcomes});
};

const deleteCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        return outcome.guid.value === event.parentGUID ? updateProperties(outcome, {
            conditions: deleteItem(outcome.conditions, event.index)
        }) : outcome;
    });

    return updateProperties(state, {outcomes});
};

const updateCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        if (outcome.guid.value === event.parentGUID) {
            const newCondition = updateProperties(outcome.conditions[event.index], {
                [event.propertyName]: {error: event.error, value: event.value}
            });

            return updateProperties(outcome, {
                conditions: replaceItem(outcome.conditions, newCondition, event.index)
            });
        }

        return outcome;
    });

    return updateProperties(state, {outcomes});
};

const outcomePropertyChanged = (state, event) => {
    event.error = event.error === null ? decisionValidation.validateProperty(event.propertyName, event.value) : event.error;

    const outcomes = state.outcomes.map((outcome) => {
        return event.guid !== outcome.guid.value ? outcome : updateProperties(outcome, {
            [event.propertyName]: {error: event.error, value: event.value}
        });
    });

    return updateProperties(state, {outcomes});
};

const decisionPropertyChanged = (state, event) => {
    event.error = event.error === null ? decisionValidation.validateProperty(event.propertyName, event.value) : event.error;
    return updateProperties(state, {[event.propertyName]: {error: event.error, value: event.value}});
};

/**
 * decision reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const decisionReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            if (event.guid) {
                return outcomePropertyChanged(state, event);
            }

            return decisionPropertyChanged(state, event);
        case AddConditionEvent.EVENT_NAME:
            return addCondition(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteCondition(state, event);
        case UpdateConditionEvent.EVENT_NAME:
            return updateCondition(state, event);
        default:
            return state;
    }
};

