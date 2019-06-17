import {
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    UpdateConditionLogicEvent
} from 'builder_platform_interaction/events';

import { checkExpressionForDeletedElem } from 'builder_platform_interaction/expressionUtils';

import {
    updateProperties,
    addItem,
    deleteItem,
    replaceItem
} from 'builder_platform_interaction/dataMutationLib';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';

/**
 * Updates a condtion in the conditionList
 * @param {*} conditionList - The condition list data
 * @param {*} event - The UpdateConditionEvent
 */
const updateCondition = (conditionList, event, deletedGuids, label) => {
    const newCondition = updateProperties(
        conditionList.conditions[event.detail.index],
        event.detail.value
    );

    checkExpressionForDeletedElem(deletedGuids, newCondition, label);

    return updateProperties(conditionList, {
        conditions: replaceItem(
            conditionList.conditions,
            newCondition,
            event.detail.index
        )
    });
};

/**
 * Deletes a condtion in the conditionList
 * @param {*} conditionList - The condition list data
 * @param {*} event - The DeleteConditionEvent
 */
const deleteCondition = (conditionList, event) => {
    conditionList = updateProperties(conditionList, {
        conditions: deleteItem(conditionList.conditions, event.detail.index)
    });

    if (conditionList.conditions.length === 0) {
        conditionList = updateProperties(conditionList, {
            conditionLogic: { value: CONDITION_LOGIC.NO_CONDITIONS }
        });
    }

    return conditionList;
};

/**
 * Adds a new condition to the conditionList
 * @param {*} conditionList - The condition list data
 * @param {*} event - The AddConditionEvent
 */
const addCondition = conditionList => {
    const newCondition = hydrateWithErrors(createCondition());
    return updateProperties(conditionList, {
        conditions: addItem(conditionList.conditions, newCondition)
    });
};

/**
 * Updates the conditionList's condition logic
 * @param {*} conditionList - The condition list data
 * @param {*} event - The UpdateConditionLogicEvent
 */
const updateConditionLogic = (conditionList, event) => {
    const newConditionLogic = event.detail.value;

    if (
        newConditionLogic !== CONDITION_LOGIC.NO_CONDITIONS &&
        conditionList.conditions.length === 0
    ) {
        conditionList = addCondition(conditionList);
    } else if (newConditionLogic === CONDITION_LOGIC.NO_CONDITIONS) {
        conditionList = updateProperties(conditionList, {
            conditions: []
        });
    }

    return updateProperties(conditionList, {
        conditionLogic: { value: event.detail.value }
    });
};

/**
 * ConditionList reducer performs changes and validation on a conditionList and returns the updated (new) conditionList
 * @param {Object} state - condition list node
 * @param {Event} event - object containing type and payload
 * @returns {Object} the update condition list
 */
export const conditionListReducer = (state, event, deletedGuids, label) => {
    switch (event.type) {
        case AddConditionEvent.EVENT_NAME:
            return addCondition(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteCondition(state, event);
        case UpdateConditionEvent.EVENT_NAME:
            return updateCondition(state, event, deletedGuids, label);
        case UpdateConditionLogicEvent.EVENT_NAME:
            return updateConditionLogic(state, event);
        default:
            return state;
    }
};
