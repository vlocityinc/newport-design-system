import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import {PropertyChangedEvent, ComboboxValueChangedEvent} from 'builder_platform_interaction-events';
import {loopValidation} from './loop-validation';
import {updateProperties} from 'builder_platform_interaction-data-mutation-lib';

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

const loopComboboxValueChanged = (state, event) => {
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
        case ComboboxValueChangedEvent.EVENT_NAME:
            return loopComboboxValueChanged(state, event);
        case VALIDATE_ALL: {
            return loopValidation.validateAll(state);
        }
        default: return state;
    }
};