import {PropertyChangedEvent, ReorderListEvent} from "builder_platform_interaction/events";
import {waitValidation, additionalRules} from "./waitValidation";
import {
    addItem,
    hydrateWithErrors,
    updateProperties} from "builder_platform_interaction/dataMutationLib";
import {
    createWaitEvent,
} from "builder_platform_interaction/elementFactory";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';

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
 * Wait reducer function runs validation rules and returns back the updated Wait element
 * @param {Object} state - element / Wait node
 * @param {Event} event - object containing type and payload
 * @returns {Object} Wait - updated Wait
 */
export const waitReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return waitPropertyChanged(state, event);
        case VALIDATE_ALL:
            return waitValidation.validateAll(state, additionalRules);
        case PROPERTY_EDITOR_ACTION.ADD_WAIT_EVENT:
            return addWaitEvent(state);
        case ReorderListEvent.EVENT_NAME:
            return reorderWaitEvents(state, event);
        default: return state;
    }
};