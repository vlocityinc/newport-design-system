import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';

const flowTestEditorPropertyChanged = (state, event) => {
    event.stopPropagation();
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * Flow Test editor reducer function runs validation rules and returns back the updated element
 *
 * @param state - flow test editor
 * @param event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns  updated flow test editor
 */
export const flowTestEditorReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return flowTestEditorPropertyChanged(state, event);
        default:
            return state;
    }
};
