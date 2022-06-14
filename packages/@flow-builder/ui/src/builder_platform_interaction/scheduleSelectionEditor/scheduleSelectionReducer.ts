import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { scheduleSelectionValidation } from './scheduleSelectionValidation';

const propertyChanged = (state, event) => {
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error:
                event.detail.error === null
                    ? scheduleSelectionValidation.validateProperty(event.detail.propertyName, event.detail.value, null)
                    : event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * Schedule selection reducer function
 *
 * @param {object} state - current node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const scheduleSelectionReducer = (state, event) => {
    return event?.type === PropertyChangedEvent.EVENT_NAME ? propertyChanged(state, event) : state;
};
