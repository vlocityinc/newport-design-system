import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import {PropertyChangedEvent} from 'builder_platform_interaction-events';
import {loopValidation} from './loop-validation';
import {updateProperties} from 'builder_platform_interaction-data-mutation-lib';

const loopPropertyChanged = (state, event) => {
    event.error = event.error === null ? loopValidation.validateProperty(event.propertyName, event.value) : event.error;
    return updateProperties(state, {[event.propertyName]: {value: event.value, error: event.error}});
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
        case VALIDATE_ALL: {
            return loopValidation.validateAll(state);
        }
        default: return state;
    }
};