// @ts-nocheck
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { PropertyChangedEvent, LoopCollectionChangedEvent } from 'builder_platform_interaction/events';
import { validate, loopValidation } from './loopValidation';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';

const LOOP_PROPERTIES = {
    COLLECTION_VARIABLE: 'collectionReference',
    LOOP_VARIABLE: 'assignNextValueToReference'
};

const loopPropertyChanged = (state, event, elements) => {
    event.detail.error =
        event.detail.error === null
            ? loopValidation(elements).validateProperty(event.detail.propertyName, event.detail.value)
            : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {
            value: event.detail.value,
            error: event.detail.error
        }
    });
};

const loopCollectionChangedEvent = (state, event, elements) => {
    const newCollectionValue = event.detail.collectionValue ? event.detail.collectionValue : null;
    const newLoopVariableValue = event.detail.loopVariableValue ? event.detail.loopVariableValue : null;
    const newCollectionError =
        event.detail.collectionError === null
            ? loopValidation(elements).validateProperty(LOOP_PROPERTIES.COLLECTION_VARIABLE, newCollectionValue)
            : event.detail.collectionError;
    const newLoopVariableError = event.detail.loopVariableErrorMessage ? event.detail.loopVariableErrorMessage : null;

    return updateProperties(state, {
        [LOOP_PROPERTIES.COLLECTION_VARIABLE]: {
            value: newCollectionValue,
            error: newCollectionError
        },
        [LOOP_PROPERTIES.LOOP_VARIABLE]: {
            value: newLoopVariableValue,
            error: newLoopVariableError
        }
    });
};

/**
 * @typedef {type:String, payload: {propertyName: String, value: String, error: String} Event
 */

/**
 * Loop reducer function runs validation rules and returns back the updated element Loop
 *
 * @param {Object} state - element / Loop node
 * @param {Event} event - object containing type and payload
 * @param elements
 * @returns {Object} Loop - updated Loop
 */
export const loopReducer = (state, event, elements) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return loopPropertyChanged(state, event);
        case LoopCollectionChangedEvent.EVENT_NAME:
            return loopCollectionChangedEvent(state, event, elements);
        case VALIDATE_ALL: {
            return validate(state, elements);
        }
        default:
            return state;
    }
};
