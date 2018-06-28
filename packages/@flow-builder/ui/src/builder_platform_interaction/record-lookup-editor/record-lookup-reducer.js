import { updateProperties, set, deleteItem, hydrateWithErrors, replaceItem } from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent,
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
} from 'builder_platform_interaction-events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { recordLookupValidation } from './record-lookup-validation';
import { SORT_ORDER } from 'builder_platform_interaction-record-editor-lib';

const emptyFilterItem = {
    [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
    [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
    [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
    rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM),
};

const addRecordLookupFilter = (state) => {
    const path = ['filters', state.filters.length];
    return set(state, path, emptyFilterItem);
};

const deleteRecordLookupFilter = (state, event) => {
    // TODO do validation for if we need at least one row
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, 'filters', updatedItems);
};

const updateRecordLookupFilter = (state, event) => {
    const path = ['filters', event.detail.index];
    // TODO check for errors and handle validation accordingly
    const item = updateProperties(event.detail.value);
    return set(state, path, item);
};

const addQueriedField = (state) => {
    const emptyField = hydrateWithErrors({field: '', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)});
    const path = ['queriedFields', state.queriedFields.length];
    return set(state, path, emptyField);
};

const deleteQueriedField = (state, event) => {
    const updatedItems = deleteItem(state.queriedFields, event.detail.index);
    return set(state, 'queriedFields', updatedItems);
};

const updateQueriedField = (state, event) => {
    if (!event.detail.error) {
        const newField = hydrateWithErrors({field: event.detail.value, rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)});
        state = updateProperties(state, {
            queriedFields: replaceItem(state.queriedFields, newField, event.detail.index)
        });
    }
    // TODO: handle error
    return state;
};

const resetQueriedFields = (state) => {
    // reset queriedFields: create one empty filter item + Id
    return set(state, 'queriedFields', hydrateWithErrors([{field: 'Id', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)}, {field: '', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)}]));
};

const updateOutputReferenceAndQueriedFields = (state, value, error) => {
    // update outputReference
    state = updateProperties(state, {'outputReference': {value, error}});
    // reset queriedFields: create one empty query item + Id
    return resetQueriedFields(state);
};

const resetRecordLookup = (state) => {
    // reset filters: create one empty filter item
    state = set(state, 'filters', [emptyFilterItem]);
    // reset sortField
    state = updateProperties(state, hydrateWithErrors({sortField: ''}));
    // reset outputReference and queried fields
    return updateOutputReferenceAndQueriedFields(state, '', null);
};

const managePropertyChanged = (state, event) => {
    const propName = event.detail.propertyName;
    state = updateProperties(state, {[propName]: {error: event.detail.error, value: event.detail.value}});
    if (!event.detail.error) {
        if (propName === 'object') {
            // reset all filterItems, outputReference, queriedFields
            state = resetRecordLookup(state);
        } else if (propName === 'outputReference') {
            // reset queriedFields
            state = resetQueriedFields(state);
        } else if (propName === 'sortOrder' && event.detail.value === SORT_ORDER.NOT_SORTED) {
            state = updateProperties(state, {sortField: {value: '', error: null}});
        }
    }
    return state;
};

/**
 * decision reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const recordLookupReducer = (state, event) => {
    switch (event.type) {
        case AddRecordLookupFilterEvent.EVENT_NAME:
            return addRecordLookupFilter(state, event);
        case UpdateRecordLookupFilterEvent.EVENT_NAME:
            return updateRecordLookupFilter(state, event);
        case DeleteRecordLookupFilterEvent.EVENT_NAME:
            return deleteRecordLookupFilter(state, event);
        case AddRecordLookupFieldEvent.EVENT_NAME:
            return addQueriedField(state, event);
        case UpdateRecordLookupFieldEvent.EVENT_NAME:
            return updateQueriedField(state, event);
        case DeleteRecordLookupFieldEvent.EVENT_NAME:
            return deleteQueriedField(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event);
        case VALIDATE_ALL:
            return recordLookupValidation.validateAll(state);
        default:
            return state;
    }
};