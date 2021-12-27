import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { rollbackValidation } from './rollbackValidation';

const rollbackPropertyChanged = (state, { propertyName, value, error }) => {
    error = error === null ? rollbackValidation.validateProperty(propertyName, value, null) : error;
    return updateProperties(state, {
        [propertyName]: {
            error,
            value
        }
    });
};

/**
 * Rollback reducer function runs validation rules and returns back the updated element
 *
 * @param state - rollback node
 * @param event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns  rollback - updated rollback
 */
export const rollbackReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return rollbackPropertyChanged(state, event.detail);
        case VALIDATE_ALL: {
            return rollbackValidation.validateAll(state, null);
        }
        default:
            return state;
    }
};
