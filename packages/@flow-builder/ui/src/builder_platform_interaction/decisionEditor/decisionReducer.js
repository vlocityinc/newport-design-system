import { decisionValidation } from "./decisionValidation";
import {
    updateProperties,
    addItem,
    deleteItem,
    replaceItem,
    hydrateWithErrors,
} from "builder_platform_interaction/dataMutationLib";
import {
    PropertyChangedEvent,
    DeleteOutcomeEvent,
    ReorderListEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from "builder_platform_interaction/events";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { createOutcome } from "builder_platform_interaction/elementFactory";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { usedByStoreAndElementState, invokeUsedByAlertModal } from "builder_platform_interaction/usedByLib";

const addOutcome = (state) => {
    let newOutcome = createOutcome();
    newOutcome = hydrateWithErrors(newOutcome);

    const outcomes = addItem(state.outcomes, newOutcome);

    return updateProperties(state, {outcomes});
};

const deleteOutcome = (state, event) => {
    const usedElements = usedByStoreAndElementState(event.detail.guid, state.guid, state.outcomes);
    if (usedElements && usedElements.length > 0) {
        invokeUsedByAlertModal(usedElements, [event.detail.guid], ELEMENT_TYPE.OUTCOME);
    } else {
        const outcomes = state.outcomes.filter((outcome) => {
            return outcome.guid !== event.detail.guid;
        });
        return updateProperties(state, {outcomes});
    }
    return state;
};

const reorderOutcomes = (state, event) => {
    let outcomes = state.outcomes;
    const destinationIndex = state.outcomes.findIndex((element) => {
        return element.guid === event.detail.destinationGuid;
    });
    const movedOutcome = state.outcomes.find((outcome) => {
        return outcome.guid === event.detail.sourceGuid;
    });
    if (destinationIndex >= 0 && movedOutcome) {
        outcomes = state.outcomes.filter((outcome) => {
            return outcome.guid !== event.detail.sourceGuid;
        });
        outcomes.splice(destinationIndex, 0, movedOutcome);
    }
    return updateProperties(state, {outcomes});
};

const addCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        const newCondition = {
            [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
            [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
            [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
            rowIndex: generateGuid(),
        };
        return outcome.guid === event.detail.parentGUID ? updateProperties(outcome, {
            conditions: addItem(outcome.conditions, newCondition),
        }) : outcome;
    });


    return updateProperties(state, {outcomes});
};

const deleteCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        return outcome.guid === event.detail.parentGUID ? updateProperties(outcome, {
            conditions: deleteItem(outcome.conditions, event.detail.index)
        }) : outcome;
    });

    return updateProperties(state, {outcomes});
};

const updateCondition = (state, event) => {
    const outcomes = state.outcomes.map((outcome) => {
        if (outcome.guid === event.detail.parentGUID) {
            const newCondition = updateProperties(outcome.conditions[event.detail.index], event.detail.value);

            return updateProperties(outcome, {
                conditions: replaceItem(outcome.conditions, newCondition, event.detail.index)
            });
        }

        return outcome;
    });

    return updateProperties(state, {outcomes});
};

const outcomePropertyChanged = (state, event) => {
    if (event.detail.error === null) {
        event.detail.error = decisionValidation.validateProperty(event.detail.propertyName, event.detail.value);
        if (event.detail.property === 'name') {
            // we need to run the outcome api name uniqueness validation within the current session of property editor
            decisionValidation.validateOutcomeNameUniquenessLocally(state.outcomes, event.detail.value, event.detail.guid);
        }
    }
    const outcomes = state.outcomes.map((outcome) => {
        return event.detail.guid !== outcome.guid ? outcome : updateProperties(outcome, {
            [event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}
        });
    });

    return updateProperties(state, {outcomes});
};

const decisionPropertyChanged = (state, event) => {
    event.detail.error = event.detail.error === null ?
        decisionValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {[event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}});
};

/**
 * decision reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const decisionReducer = (state, event) => {
    switch (event.type) {
        case PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME:
            return addOutcome(state);
        case PropertyChangedEvent.EVENT_NAME:
            if (event.detail.guid) {
                return outcomePropertyChanged(state, event);
            }

            return decisionPropertyChanged(state, event);
        case DeleteOutcomeEvent.EVENT_NAME:
            return deleteOutcome(state, event);
        case ReorderListEvent.EVENT_NAME:
            return reorderOutcomes(state, event);
        case AddConditionEvent.EVENT_NAME:
            return addCondition(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteCondition(state, event);
        case UpdateConditionEvent.EVENT_NAME:
            return updateCondition(state, event);
        case VALIDATE_ALL:
            return decisionValidation.validateAll(state);
        default:
            return state;
    }
};