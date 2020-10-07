import { collectionProcessorValidation } from './collectionProcessorValidation';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { StoreState } from 'builder_platform_interaction/flowModel';

const collectionProcessorPropertyChanged = (state, event) => {
    event.detail.error =
        event.detail.error === null
            ? collectionProcessorValidation.validateProperty(event.detail.propertyName, event.detail.value, null)
            : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            error: event.detail.error,
            value: event.detail.value
        }
    });
};

/**
 * Collection processor reducer function runs validation rules and returns back the updated element
 * @param state - collectionsProcessor node
 * @param event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns  collectionProcessor - updated collectionProcessor
 */
export const collectionProcessorReducer = (state: StoreState, event: CustomEvent): StoreState => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return collectionProcessorPropertyChanged(state, event);
        case VALIDATE_ALL: {
            return collectionProcessorValidation.validateAll(state, null);
        }

        default:
            return state;
    }
};
