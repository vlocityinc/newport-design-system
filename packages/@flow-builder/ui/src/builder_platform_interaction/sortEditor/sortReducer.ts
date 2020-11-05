import { updateProperties, set, deleteItem } from 'builder_platform_interaction/dataMutationLib';
import {
    CollectionReferenceChangedEvent,
    AddSortOptionItemEvent,
    DeleteSortOptionItemEvent,
    UpdateSortOptionItemEvent,
    UpdateSortCollectionOutputEvent
} from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { sortValidation, getRules } from './sortValidation';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { SORT_ORDER, SORT_OUTPUT_OPTION } from 'builder_platform_interaction/sortEditorLib';

export const SORT_PROPERTIES = {
    COLLECTION_REFERENCE: 'collectionReference',
    SORT_OPTIONS: 'sortOptions',
    LIMIT: 'limit'
};

const emptyOptionItem = () => {
    return {
        sortField: { value: null, error: null },
        sortOrder: { value: SORT_ORDER.ASC, error: null },
        nullsLast: true,
        rowIndex: generateGuid()
    };
};

const emptyLimit = () => {
    return { value: null, error: null };
};

const resetSortOptionsAndOutput = (state, resetOutput = false) => {
    // reset sort options
    state = set(state, SORT_PROPERTIES.SORT_OPTIONS, [emptyOptionItem()]);
    // reset sort output
    if (resetOutput) {
        state = updateProperties(state, { [SORT_PROPERTIES.LIMIT]: emptyLimit() });
    }
    return state;
};

const updateCollectionReference = (state, event) => {
    const oldCollectionValue = state[SORT_PROPERTIES.COLLECTION_REFERENCE].value;
    const newCollectionValue = event.detail.value ? event.detail.value : null;
    let newCollectionError = event.detail.error;
    if (!event.detail.error) {
        newCollectionError = sortValidation.validateProperty(
            SORT_PROPERTIES.COLLECTION_REFERENCE,
            newCollectionValue,
            null
        );
    }
    state = updateProperties(state, {
        [SORT_PROPERTIES.COLLECTION_REFERENCE]: {
            value: newCollectionValue,
            error: newCollectionError ? newCollectionError : null
        }
    });
    // update the sort options and sort output
    if (oldCollectionValue !== newCollectionValue) {
        state = resetSortOptionsAndOutput(state);
    }
    return state;
};

const addSortOptionItem = (state) => {
    const path = [SORT_PROPERTIES.SORT_OPTIONS, state[SORT_PROPERTIES.SORT_OPTIONS].length];
    return set(state, path, emptyOptionItem());
};

const deleteSortOptionItem = (state, event) => {
    const updatedItems = deleteItem(state[SORT_PROPERTIES.SORT_OPTIONS], event.detail.index);
    return set(state, SORT_PROPERTIES.SORT_OPTIONS, updatedItems);
};

const updateSortOptionItem = (state, event) => {
    const { propertyName, optionIndex, value, error } = event.detail;
    const path = [SORT_PROPERTIES.SORT_OPTIONS, optionIndex];
    const sortOptionItemToUpdate = state[SORT_PROPERTIES.SORT_OPTIONS][optionIndex];
    let item;
    if (propertyName !== 'nullsLast') {
        item = updateProperties(sortOptionItemToUpdate, { [propertyName]: { value, error: error ? error : null } });
    } else {
        item = updateProperties(sortOptionItemToUpdate, { [propertyName]: value });
    }
    return set(state, path, item);
};

const updateSortOutput = (state, event) => {
    const { selectedOutput, limit } = event.detail;
    if (selectedOutput === SORT_OUTPUT_OPTION.ALL) {
        state = updateProperties(state, { [SORT_PROPERTIES.LIMIT]: emptyLimit() });
    } else if (selectedOutput === SORT_OUTPUT_OPTION.CUSTOM) {
        const limitError = sortValidation.validateProperty(SORT_PROPERTIES.LIMIT, limit, null);
        state = updateProperties(state, {
            [SORT_PROPERTIES.LIMIT]: { value: limit, error: limitError ? limitError : null }
        });
    }
    return state;
};

/**
 * filter reducer function runs validation rules and returns back the updated element filter
 * @param {object} state - element / sort editor node
 * @param {object} event - the event from sort editor
 *
 * @returns {object} filter - updated filter
 */
export const sortReducer = (state, event) => {
    switch (event.type) {
        case CollectionReferenceChangedEvent.EVENT_NAME:
            return updateCollectionReference(state, event);
        case AddSortOptionItemEvent.EVENT_NAME:
            return addSortOptionItem(state);
        case DeleteSortOptionItemEvent.EVENT_NAME:
            return deleteSortOptionItem(state, event);
        case UpdateSortOptionItemEvent.EVENT_NAME:
            return updateSortOptionItem(state, event);
        case UpdateSortCollectionOutputEvent.EVENT_NAME:
            return updateSortOutput(state, event);
        case VALIDATE_ALL:
            return sortValidation.validateAll(state, getRules(event));
        default:
            return null;
    }
};
