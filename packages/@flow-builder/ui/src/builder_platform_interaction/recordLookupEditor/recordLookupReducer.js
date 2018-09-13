import { updateProperties, set, deleteItem, hydrateWithErrors, replaceItem } from "builder_platform_interaction/dataMutationLib";
import {
    PropertyChangedEvent,
    AddRecordLookupFilterEvent,
    UpdateRecordLookupFilterEvent,
    DeleteRecordLookupFilterEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
} from "builder_platform_interaction/events";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { SUB_ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { recordLookupValidation, getRules } from "./recordLookupValidation";
import { RECORD_FILTER_CRITERIA, SORT_ORDER } from "builder_platform_interaction/recordEditorLib";
const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const emptyFilterItem = () => {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
        rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM),
    };
};

const addRecordLookupFilter = (state) => {
    const path = ['filters', state.filters.length];
    return set(state, path, emptyFilterItem());
};

const deleteRecordLookupFilter = (state, event) => {
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, 'filters', updatedItems);
};

const updateRecordLookupFilter = (state, event) => {
    const path = ['filters', event.detail.index];
    const item = updateProperties(state.filters[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const addQueriedField = (state) => {
    const emptyField = hydrateWithErrors({field: '', rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)});
    const path = ['queriedFields', state.queriedFields.length];
    return set(state, path, emptyField);
};

const deleteQueriedField = (state, event) => {
    const oldFieldValue = state.queriedFields[event.detail.index].field.value;
    const updatedItems = deleteItem(state.queriedFields, event.detail.index);
    state = set(state, 'queriedFields', updatedItems);
    // reset last empty field's blank error if any
    // 'Id' + one field
    if (state.queriedFields.length === 2 && state.queriedFields[1].field.value === '' && state.queriedFields[1].field.error) {
        state.queriedFields[1].field.error = null;
    }
    // reset error if the fields was duplicate and only one left.
    const duplicates = state.queriedFields.filter(queriedField => queriedField.field.value === oldFieldValue);
    if (duplicates.length === 1) {
        duplicates[0].field.error = null;
    }
    return state;
};

const updateQueriedField = (state, event) => {
    const newField = {field: {value: event.detail.value, error: event.detail.error}, rowIndex: state.queriedFields[event.detail.index].rowIndex};
    state = updateProperties(state, {
        queriedFields: replaceItem(state.queriedFields, newField, event.detail.index)
    });
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
    state = set(state, 'filters', [emptyFilterItem()]);
    // reset sortField
    state = updateProperties(state, hydrateWithErrors({sortField: ''}));
    // reset outputReference and queried fields
    return updateOutputReferenceAndQueriedFields(state, '', null);
};

const resetFilterErrors = (state) => {
    const oldFilters = state.filters;
    state = set(state, "filters", oldFilters.map(filter => {
        filter[LHS].error = null;
        filter[OPERATOR].error = null;
        filter[RHS].error = null;
        return filter;
    }));
    return state;
};

const managePropertyChanged = (state, event) => {
    const propName = event.detail.propertyName;
    if (!event.detail.ignoreValidate) {
        event.detail.error = event.detail.error === null ? recordLookupValidation.validateProperty(propName, event.detail.value) : event.detail.error;
    }
    if (propName === 'assignNullValuesIfNoRecordsFound') {
        state = updateProperties(state, {[propName]: event.detail.value});
    } else {
        state = updateProperties(state, {[propName]: {value: event.detail.value, error: event.detail.error}});
    }
    if (!event.detail.error) {
        if (propName === 'object' && event.detail.value !== event.detail.oldValue) {
            // reset all filterItems, outputReference, queriedFields
            state = resetRecordLookup(state);
        } else if (propName === 'outputReference' && event.detail.value !== event.detail.oldValue) {
            // reset queriedFields
            state = resetQueriedFields(state);
        } else if (propName === 'sortOrder' && event.detail.value === SORT_ORDER.NOT_SORTED) {
            // reset error if any, and preserve value
            state = updateProperties(state, {sortField: {value: state.sortField.value, error: null}});
        } else if (propName === 'filterType' && event.detail.value === RECORD_FILTER_CRITERIA.NONE) {
            // reset errors in filters if any, and preserve values
            state = resetFilterErrors(state);
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
            return recordLookupValidation.validateAll(state, getRules(state));
        default:
            return state;
    }
};