import { updateProperties, set, deleteItem, mutateFilterItems, hydrateWithErrors, replaceItem } from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent,
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    ComboboxValueChangedEvent,
    OutputReferenceChangedEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
} from 'builder_platform_interaction-events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

const recordPropertyChanged = (state, event) => {
    return updateProperties(state, {[event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}});
};

const addRecordLookupFilter = (state) => {
    const emptyRecordLookupItem = {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
        rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM),
    };
    const path = ['filters', state.filters.length];
    return set(state, path, emptyRecordLookupItem);
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
    const emptyField = hydrateWithErrors({field: '', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM)});
    const path = ['queriedFields', state.queriedFields.length];
    return set(state, path, emptyField);
};

const deleteQueriedField = (state, event) => {
    const updatedItems = deleteItem(state.queriedFields, event.detail.index);
    return set(state, 'queriedFields', updatedItems);
};

const updateQueriedField = (state, event) => {
    if (!event.detail.error) {
        const newField = hydrateWithErrors({field: event.detail.value, rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM)});
        state = updateProperties(state, {
            queriedFields: replaceItem(state.queriedFields, newField, event.detail.index)
        });
    }
    // TODO: handle error
    return state;
};

const updateOutputReference = (state, value) => {
    return updateProperties(state, {'outputReference': {value, error: null}});
};

const resetQueriedFields = (state) => {
    // reset queriedFields: create one empty filter item + Id
    return set(state, 'queriedFields', hydrateWithErrors([{field: 'Id', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM)}, {field: '', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM)}]));
};

const updateOutputReferenceAndQueriedFields = (state, event) => {
    if (!event.detail.error) {
        // update outputReference
        state = updateOutputReference(state, event.detail.value);
        // reset queriedFields: create one empty filter item + Id
        return resetQueriedFields(state);
    }
    // TODO: handle error
    return state;
};

const resetRecordLookup = (state, event) => {
    // update object type
    state = updateProperties(state, {'object': {error: event.detail.error, value: event.detail.item.value}});
    // reset filters: create one empty filter item
    const emptyFilterItem = hydrateWithErrors(mutateFilterItems([{field: '', operator: '', value: { stringValue: ''}}], event.detail.item.value));
    state = set(state, 'filters', emptyFilterItem);
    // reset outputReference and queried fields
    state = updateOutputReference(state, '', event.detail.error);
    return resetQueriedFields(state);
};

/**
 * decision reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const recordLookupReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return recordPropertyChanged(state, event);
        case AddRecordLookupFilterEvent.EVENT_NAME:
            return addRecordLookupFilter(state, event);
        case UpdateRecordLookupFilterEvent.EVENT_NAME:
            return updateRecordLookupFilter(state, event);
        case DeleteRecordLookupFilterEvent.EVENT_NAME:
            return deleteRecordLookupFilter(state, event);
        case ComboboxValueChangedEvent.EVENT_NAME:
            return resetRecordLookup(state, event);
        case OutputReferenceChangedEvent.EVENT_NAME:
            return updateOutputReferenceAndQueriedFields(state, event);
        case AddRecordLookupFieldEvent.EVENT_NAME:
            return addQueriedField(state, event);
        case UpdateRecordLookupFieldEvent.EVENT_NAME:
            return updateQueriedField(state, event);
        case DeleteRecordLookupFieldEvent.EVENT_NAME:
            return deleteQueriedField(state, event);
        default:
            return state;
    }
};