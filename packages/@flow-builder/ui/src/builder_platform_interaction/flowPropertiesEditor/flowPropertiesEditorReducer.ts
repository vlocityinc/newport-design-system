// @ts-nocheck
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { flowPropertiesEditorValidation, getRules } from './flowPropertiesEditorValidation';

const flowPropertiesPropertyChanged = (state, event) => {
    if (event.detail.propertyName === 'environments') {
        return updateProperties(state, {
            [event.detail.propertyName]: event.detail.value
        });
    }
    event.detail.error =
        event.detail.error === null
            ? flowPropertiesEditorValidation.validateProperty(event.detail.propertyName, event.detail.value)
            : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * flow properties reducer function runs validation rules and returns back the updated flow properties object
 *
 * @param {object} state - flow properties object
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} flowProperties - updated flow properties object
 */
export const flowPropertiesEditorReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME: {
            return flowPropertiesPropertyChanged(state, event);
        }
        case VALIDATE_ALL: {
            return flowPropertiesEditorValidation.validateAll(state, getRules(state, event.isSavingExistingFlow));
        }
        default:
            return state;
    }
};
