import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import {PropertyChangedEvent, ComboboxStateChangedEvent} from 'builder_platform_interaction-events';
import {loopValidation} from './loop-validation';
import {updateProperties} from 'builder_platform_interaction-data-mutation-lib';

const LIGHTNING_RADIO_GROUP_CHANGED = 'change';

const loopPropertyChanged = (state, event) => {
    event.detail.error = event.detail.error === null ?
        loopValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            value: event.detail.value,
            error: event.detail.error
        }
    });
};

const loopComboboxStateChanged = (state, event) => {
    const newValue = event.detail.item ? event.detail.item.value : null;
    event.detail.error = event.detail.error === null ?
        loopValidation.validateProperty(event.detail.propertyName, newValue) : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            value: newValue,
            error: event.detail.error
        }
    });
};

const loopIterationOrderChanged = (state, event) => {
    return updateProperties(state, {
        iterationOrder: {
            value: event.detail.value,
            error: null
        }
    });
};

/**
 * @typedef {type:String, payload: {propertyName: String, value: String, error: String} Event
 */

/**
 * Loop reducer function runs validation rules and returns back the updated element Loop
 * @param {Object} state - element / Loop node
 * @param {Event} event - object containing type and payload
 * @returns {Object} Loop - updated Loop
 */
export const loopReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return loopPropertyChanged(state, event);
        case ComboboxStateChangedEvent.EVENT_NAME:
            return loopComboboxStateChanged(state, event);
        case LIGHTNING_RADIO_GROUP_CHANGED:
            return loopIterationOrderChanged(state, event);
        case VALIDATE_ALL: {
            return loopValidation.validateAll(state);
        }
        default: return state;
    }
};