import { updateProperties, set, deleteItem, hydrateWithErrors, replaceItem } from "builder_platform_interaction/dataMutationLib";
import {
    PropertyChangedEvent,
    AddRecordFilterEvent,
    UpdateRecordFilterEvent,
    DeleteRecordFilterEvent,
    AddRecordLookupFieldEvent,
    UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
} from "builder_platform_interaction/events";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { recordLookupValidation, getRules } from "./recordLookupValidation";
import { RECORD_FILTER_CRITERIA, SORT_ORDER } from "builder_platform_interaction/recordEditorLib";
const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;

const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;

const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const OUTPUTASSIGNMENTS_PROP = 'outputAssignments';

const emptyFilterItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [OPERATOR]: { value: '', error: null},
        [RHS]: { value: '', error: null},
        [RHS_DATA_TYPE]: { value: '', error: null},
        rowIndex: generateGuid(),
    };
};

const emptyAssignmentItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [RHS]: { value: '', error: null},
        rowIndex: generateGuid(),
    };
};

const addRecordFilter = (state) => {
    const path = ['filters', state.filters.length];
    return set(state, path, emptyFilterItem());
};

const deleteRecordFilter = (state, event) => {
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, 'filters', updatedItems);
};

const updateRecordFilter = (state, event) => {
    const path = ['filters', event.detail.index];
    const item = updateProperties(state.filters[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const addQueriedField = (state) => {
    const emptyField = hydrateWithErrors({field: '', rowIndex: generateGuid()});
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

const addRecordFieldAssignment = (state) => {
    const path = [OUTPUTASSIGNMENTS_PROP, state.outputAssignments.length];
    return set(state, path, emptyAssignmentItem());
};

const deleteRecordFieldAssignment = (state, event) => {
    const updatedItems = deleteItem(state.outputAssignments, event.detail.index);
    return set(state, OUTPUTASSIGNMENTS_PROP, updatedItems);
};

const updateRecordFieldAssignment = (state, event) => {
    const path = [OUTPUTASSIGNMENTS_PROP, event.detail.index];
    const item = updateProperties(state.outputAssignments[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const resetOutputAssignments = (state) => {
    // reset outputAssignments
    return set(state, OUTPUTASSIGNMENTS_PROP, [emptyAssignmentItem()]);
};

const resetQueriedFields = (state) => {
    // reset queriedFields: create one empty query field item + Id
    return set(state, 'queriedFields', hydrateWithErrors([{field: 'Id', rowIndex: generateGuid()}, {field: '', rowIndex: generateGuid()}]));
};

const resetFilterErrors = (state) => {
    // reset filters: create one empty filter item
    return set(state, 'filters', [emptyFilterItem()]);
};

const updateOutputReferenceAndQueriedFields = (state, value, error) => {
    // update outputReference
    state = updateProperties(state, {'outputReference': {value, error}});
    // reset queriedFields: create one empty query item + Id
    return resetQueriedFields(state);
};

const resetRecordLookup = (state) => {
    // reset filters: create one empty filter item
    state = resetFilterErrors(state);
    // reset sortField & sortOrder
    state = updateProperties(state, {sortOrder: { value: SORT_ORDER.NOT_SORTED, error: null}});
    state = updateProperties(state, {sortField: { value: '', error: null}});
    state = resetOutputAssignments(state);
    // reset outputReference and queried fields
    return updateOutputReferenceAndQueriedFields(state, '', null);
};

const managePropertyChanged = (state, {propertyName, ignoreValidate, error,  oldValue, value}) => {
    if (propertyName === 'wayToStoreFields') {
        return resetOutputAssignments(state);
    }
    if (!ignoreValidate) {
        error = error === null ? recordLookupValidation.validateProperty(propertyName, value) : error;
    }

    if (propertyName !== 'assignNullValuesIfNoRecordsFound' && propertyName !== 'assignNullValuesIfNoRecordsFound') {
        state = updateProperties(state, {[propertyName]: {value, error}});
    }

    if (!error) {
        if (propertyName === 'object' && value !== oldValue) {
            // reset all filterItems, outputReference, queriedFields
            state = resetRecordLookup(state);
        } else if (propertyName === 'outputReference' && value !== oldValue) {
            state = resetQueriedFields(state);
        } else if (propertyName === 'numberRecordsToStore' && value !== oldValue) {
            state = updateProperties(state, {[propertyName]: value});
            state = resetRecordLookup(state);
        } else if (propertyName === 'sortOrder' && value === SORT_ORDER.NOT_SORTED) {
            // reset error if any, and preserve value
            state = updateProperties(state, {sortField: {value: state.sortField.value, error: null}});
        } else if (propertyName === 'filterType' && value === RECORD_FILTER_CRITERIA.NONE) {
            // reset errors in filters if any, and preserve values
            state = resetFilterErrors(state);
        } else if (propertyName === 'assignNullValuesIfNoRecordsFound') {
            state = updateProperties(state, {[propertyName]: value});
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
        case AddRecordFilterEvent.EVENT_NAME:
            return addRecordFilter(state, event);
        case UpdateRecordFilterEvent.EVENT_NAME:
            return updateRecordFilter(state, event);
        case DeleteRecordFilterEvent.EVENT_NAME:
            return deleteRecordFilter(state, event);
        case AddRecordLookupFieldEvent.EVENT_NAME:
            return addQueriedField(state, event);
        case UpdateRecordLookupFieldEvent.EVENT_NAME:
            return updateQueriedField(state, event);
        case DeleteRecordLookupFieldEvent.EVENT_NAME:
            return deleteQueriedField(state, event);
        case AddRecordFieldAssignmentEvent.EVENT_NAME:
            return addRecordFieldAssignment(state);
        case DeleteRecordFieldAssignmentEvent.EVENT_NAME:
            return deleteRecordFieldAssignment(state, event);
        case UpdateRecordFieldAssignmentEvent.EVENT_NAME:
            return updateRecordFieldAssignment(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event.detail);
        case VALIDATE_ALL:
            return recordLookupValidation.validateAll(state, getRules(state));
        default:
            return state;
    }
};