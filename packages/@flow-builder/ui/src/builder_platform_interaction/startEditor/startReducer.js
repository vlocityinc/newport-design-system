import { startValidation } from './startValidation';

import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import {
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';

const setDefaultScheduledProperties = state => {
    state[START_ELEMENT_FIELDS.FREQUENCY] = {
        value: FLOW_TRIGGER_FREQUENCY.ONCE,
        error: null
    };
};

const clearScheduledProperties = state => {
    delete state[START_ELEMENT_FIELDS.START_DATE];
    delete state[START_ELEMENT_FIELDS.START_TIME];
    delete state[START_ELEMENT_FIELDS.FREQUENCY];
};

const startPropertyChanged = (state, event) => {
    event.detail.error =
        event.detail.error === null
            ? startValidation.validateProperty(
                  event.detail.propertyName,
                  event.detail.value,
                  null,
                  state
              )
            : event.detail.error;

    const newState = updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });

    if (event.detail.propertyName === START_ELEMENT_FIELDS.TRIGGER_TYPE) {
        if (event.detail.value === FLOW_TRIGGER_TYPE.SCHEDULED) {
            setDefaultScheduledProperties(newState);
        } else {
            // clear all scheduled properties if trigger type is not 'Scheduled'
            clearScheduledProperties(newState);
        }
    }

    return newState;
};

/**
 * Start reducer function
 * @param {object} state - element / start node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const startReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return startPropertyChanged(state, event);
        case VALIDATE_ALL: {
            return startValidation.validateAll(state);
        }
        default:
            return state;
    }
};
