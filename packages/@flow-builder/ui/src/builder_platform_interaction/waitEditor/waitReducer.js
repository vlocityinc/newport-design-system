import {
    addItem,
    deleteItem,
    replaceItem,
    hydrateWithErrors,
    updateProperties} from 'builder_platform_interaction/dataMutationLib';
import {
    createWaitEvent,
    createCondition,
} from "builder_platform_interaction/elementFactory";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { usedByStoreAndElementState, invokeUsedByAlertModal } from "builder_platform_interaction/usedByLib";
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    DeleteWaitEventEvent,
    ReorderListEvent,
    WaitEventPropertyChangedEvent,
} from 'builder_platform_interaction/events';
import {waitValidation, additionalRules} from './waitValidation';

const waitPropertyChanged = (state, event) => {
    event.detail.error = event.detail.error === null ?
        waitValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            value: event.detail.value,
            error: event.detail.error
        }
    });
};

const addWaitEvent = (state) => {
    let newWaitEvent = createWaitEvent();
    newWaitEvent = hydrateWithErrors(newWaitEvent);

    const waitEvents = addItem(state.waitEvents, newWaitEvent);

    return updateProperties(state, {waitEvents});
};

const deleteWaitEvent = (state, event) => {
    const usedElements = usedByStoreAndElementState(event.detail.guid, state.guid, state.waitEvents);

    if (usedElements && usedElements.length > 0) {
        invokeUsedByAlertModal(usedElements, [event.detail.guid], ELEMENT_TYPE.WAIT_EVENT);
    } else {
        const waitEvents = state.waitEvents.filter((waitEvent) => {
            return waitEvent.guid !== event.detail.guid;
        });
        return updateProperties(state, {waitEvents});
    }
    return state;
};

const reorderWaitEvents = (state, event) => {
    let waitEvents = state.waitEvents;
    const destinationIndex = state.waitEvents.findIndex((element) => {
        return element.guid === event.detail.destinationGuid;
    });
    const movedWaitEvent = state.waitEvents.find((waitEvent) => {
        return waitEvent.guid === event.detail.sourceGuid;
    });
    if (destinationIndex >= 0 && movedWaitEvent) {
        waitEvents = state.waitEvents.filter((waitEvent) => {
            return waitEvent.guid !== event.detail.sourceGuid;
        });
        waitEvents.splice(destinationIndex, 0, movedWaitEvent);
    }
    return updateProperties(state, {waitEvents});
};

/**
 * Reducer for updating wait conditions
 * @param {Object} state the entire wait sate
 * @param {Object} event the event with payload information
 * @param {function} conditionOperation the operation we want to perform on the state's conditions
 * @returns {Object} updated state
 */
const waitConditionReducer = (state, event, conditionOperation) => {
    const mapEvents = waitEvent => {
        if (waitEvent.guid === event.detail.parentGUID) {
            const conditions = conditionOperation(waitEvent.conditions, event);
            return Object.assign({}, waitEvent, { conditions });
        }
        return waitEvent;
    };
    const waitEvents = state.waitEvents.map(mapEvents);
    return Object.assign({}, state, { waitEvents });
};


const addWaitCondition = function (conditions) {
    const newCondition = hydrateWithErrors(createCondition());
    return addItem(conditions, newCondition);
};

const deleteWaitCondition = function (conditions, event) {
    return deleteItem(conditions, event.detail.index);
};

const updateWaitCondition = function (conditions, event) {
    const conditionToUpdate = conditions[event.detail.index];
    return replaceItem(conditions, Object.assign({}, conditionToUpdate, event.detail.value), event.detail.index);
};

/**
 * Reducer that handles property changed events for a waitEvent
 * @param {Object} state the entire state of the waitEditor
 * @param {Object} event property changed event
 * @returns {Object} updated waitEditor state
 */
const waitEventPropertyChanged = (state, event) => {
    if (event.detail.error === null) {
        // TODO: W-5454625 validate property changed events from label-description of waitEvent
    }
    const mapEvents = waitEvent => {
        if (waitEvent.guid === event.detail.guid) {
            const updatedProperty = { value: event.detail.value, error: event.detail.error };
            return Object.assign({}, waitEvent, { [event.detail.propertyName] : updatedProperty });
        }
        return waitEvent;
    };

    const waitEvents = state.waitEvents.map(mapEvents);
    return updateProperties(state, { waitEvents });
};

/**
 * Wait reducer function runs validation rules and returns back the updated Wait element
 * @param {Object} state - element / Wait node
 * @param {Event} event - object containing type and payload
 * @returns {Object} Wait - updated Wait
 */
export const waitReducer = (state, event) => {
    switch (event.type) {
        case AddConditionEvent.EVENT_NAME:
            return waitConditionReducer(state, event, addWaitCondition);
        case DeleteConditionEvent.EVENT_NAME:
            return waitConditionReducer(state, event, deleteWaitCondition);
        case UpdateConditionEvent.EVENT_NAME:
            return waitConditionReducer(state, event, updateWaitCondition);
        case PropertyChangedEvent.EVENT_NAME:
            return waitPropertyChanged(state, event);
        case WaitEventPropertyChangedEvent.EVENT_NAME:
            return waitEventPropertyChanged(state, event);
        case VALIDATE_ALL:
            return waitValidation.validateAll(state, additionalRules);
        case PROPERTY_EDITOR_ACTION.ADD_WAIT_EVENT:
            return addWaitEvent(state);
        case ReorderListEvent.EVENT_NAME:
            return reorderWaitEvents(state, event);
        case DeleteWaitEventEvent.EVENT_NAME:
            return deleteWaitEvent(state, event);
        default: return state;
    }
};