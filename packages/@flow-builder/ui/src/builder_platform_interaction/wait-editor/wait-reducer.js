import {PropertyChangedEvent} from 'builder_platform_interaction-events';
import {waitValidation, additionalRules} from './wait-validation';
import {updateProperties} from 'builder_platform_interaction-data-mutation-lib';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';

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
        case VALIDATE_ALL: {
            return waitValidation.validateAll(state, additionalRules);
        }
        default: return state;
    }
};