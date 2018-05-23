import { updateProperties, set, deleteItem, mutateFilterItems, hydrateWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import {
    PropertyChangedEvent,
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    ComboboxValueChangedEvent
} from 'builder_platform_interaction-events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

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

const resetRecordLookupFilterItems = (state, event) => {
    // update object type
    state = updateProperties(state, {'object': {error: event.detail.error, value: event.detail.item.value}});
    // reset filters: create one empty filter item
    const emptyFilterItem = hydrateWithErrors(mutateFilterItems([{field: '', operator: '', value: { stringValue: ''}}], event.detail.item.value));
    return set(state, 'filters', emptyFilterItem);
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
            return resetRecordLookupFilterItems(state, event);
        default:
            return state;
    }
};