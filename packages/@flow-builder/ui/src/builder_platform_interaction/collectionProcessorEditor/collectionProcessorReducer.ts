import { collectionProcessorValidation } from './collectionProcessorValidation';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { PropertyChangedEvent, UpdateCollectionProcessorEvent } from 'builder_platform_interaction/events';

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

const updateCollectionProcessor = (state, event) => {
    const element = event.detail.element;
    for (const prop of Object.keys(element)) {
        state = updateProperties(state, {
            [prop]: element[prop]
        });
    }
    return state;
};

/**
 * Collection processor reducer function runs validation rules and returns back the updated element
 * @param state - collectionsProcessor node
 * @param event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns  collectionProcessor - updated collectionProcessor
 */
export const collectionProcessorReducer = (state: UI.StoreState, event: CustomEvent): UI.StoreState => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return collectionProcessorPropertyChanged(state, event);
        case UpdateCollectionProcessorEvent.EVENT_NAME:
            return updateCollectionProcessor(state, event);
        case VALIDATE_ALL: {
            return collectionProcessorValidation.validateAll(state, null);
        }
        default:
            return state;
    }
};
