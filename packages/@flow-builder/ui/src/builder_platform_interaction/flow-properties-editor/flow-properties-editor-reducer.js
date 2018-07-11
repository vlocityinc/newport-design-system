import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent
} from 'builder_platform_interaction-events';

const flowPropertiesPropertyChanged = (state, event) => {
    return updateProperties(state, {
        [event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}
    });
};

/**
 * flow properties reducer function runs validation rules and returns back the updated flow properties object
 * @param {object} state - flow properties object
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} flowProperties - updated flow properties object
 */
export const flowPropertiesEditorReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return flowPropertiesPropertyChanged(state, event);

        default: return state;
    }
};
