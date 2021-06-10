import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { CollectionReferenceChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { mapValidation, getRules } from './mapValidation';

export const MAP_PROPERTIES = {
    COLLECTION_REFERENCE: 'collectionReference',
    ASSIGNMENT_ITEMS: 'assignmentItems'
};

const updateCollectionReference = (state, event) => {
    const newCollectionValue = event.detail.value ? event.detail.value : null;
    const newCollectionError = event.detail.error ? event.detail.error : null;
    state = updateProperties(state, {
        [MAP_PROPERTIES.COLLECTION_REFERENCE]: {
            value: newCollectionValue,
            error: newCollectionError ? newCollectionError : null
        }
    });
    return state;
};

/**
 * filter reducer function runs validation rules and returns back the updated element filter
 *
 * @param {object} state - element / sort editor node
 * @param {object} event - the event from sort editor
 * @returns {object} filter - updated filter
 */
export const mapReducer = (state, event) => {
    switch (event.type) {
        case CollectionReferenceChangedEvent.EVENT_NAME:
            return updateCollectionReference(state, event);
        case VALIDATE_ALL:
            return mapValidation.validateAll(state, getRules());
        default:
            return null;
    }
};
