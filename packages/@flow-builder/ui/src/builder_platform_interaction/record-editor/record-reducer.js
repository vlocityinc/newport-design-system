import {updateProperties} from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent
} from 'builder_platform_interaction-events';

const recordPropertyChanged = (state, event) => {
    return updateProperties(state, {[event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}});
};

/**
 * decision reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const recordReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return recordPropertyChanged(state, event);
        default:
            return state;
    }
};