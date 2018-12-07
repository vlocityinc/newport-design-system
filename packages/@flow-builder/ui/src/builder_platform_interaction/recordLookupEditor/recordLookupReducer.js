import { updateProperties, set, deleteItem, hydrateWithErrors, replaceItem } from "builder_platform_interaction/dataMutationLib";
import { PropertyChangedEvent, AddRecordFilterEvent, UpdateRecordFilterEvent, DeleteRecordFilterEvent, AddRecordLookupFieldEvent, UpdateRecordLookupFieldEvent,
    DeleteRecordLookupFieldEvent, AddRecordFieldAssignmentEvent, DeleteRecordFieldAssignmentEvent, UpdateRecordFieldAssignmentEvent } from "builder_platform_interaction/events";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { recordLookupValidation, getRules } from "./recordLookupValidation";
import { RECORD_FILTER_CRITERIA, SORT_ORDER, NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { elementTypeToConfigMap } from "builder_platform_interaction/elementConfig";

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE, OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR, RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;
const PROPS = {
        object: 'object',
        outputAssignments: 'outputAssignments',
        assignNullValuesIfNoRecordsFound: 'assignNullValuesIfNoRecordsFound',
        filters: 'filters',
        filterType: 'filterType',
        queriedFields: 'queriedFields',
        numberRecordsToStore: 'numberRecordsToStore',
        wayToStoreFields: 'wayToStoreFields',
        sortOrder: 'sortOrder',
        sortField: 'sortField',
        outputReference: 'outputReference'
   };

const NON_HYDRATABLE_PROPS = new Set([...elementTypeToConfigMap[ELEMENT_TYPE.RECORD_LOOKUP].nonHydratableProperties, PROPS.wayToStoreFields]);

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
    const path = [PROPS.filters, state.filters.length];
    return set(state, path, emptyFilterItem());
};

const deleteRecordFilter = (state, event) => {
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, PROPS.filters, updatedItems);
};

const updateRecordFilter = (state, event) => {
    const path = [PROPS.filters, event.detail.index];
    const item = updateProperties(state.filters[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const addQueriedField = (state) => {
    const emptyField = hydrateWithErrors({field: '', rowIndex: generateGuid()});
    const path = [PROPS.queriedFields, state.queriedFields.length];
    return set(state, path, emptyField);
};

const deleteQueriedField = (state, event) => {
    const oldFieldValue = state.queriedFields[event.detail.index].field.value;
    const updatedItems = deleteItem(state.queriedFields, event.detail.index);
    state = set(state, PROPS.queriedFields, updatedItems);
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

const resetOutputAssignments = (state) => {
    return set(state, PROPS.outputAssignments, [emptyAssignmentItem()]);
};

const addRecordFieldAssignment = (state) => {
    const path = [PROPS.outputAssignments, state.outputAssignments.length];
    return set(state, path, emptyAssignmentItem());
};

const deleteRecordFieldAssignment = (state, event) => {
    const updatedItems = deleteItem(state.outputAssignments, event.detail.index);
    state = set(state, PROPS.outputAssignments, updatedItems);
    // reset if single empty outputAssignments's its blank error if any
    if (state.outputAssignments.length === 1 && state.outputAssignments[0].leftHandSide.value === '' && state.outputAssignments[0].leftHandSide.error) {
        state = resetOutputAssignments(state);
    }
    return state;
};

const updateRecordFieldAssignment = (state, event) => {
    const path = [PROPS.outputAssignments, event.detail.index];
    const item = updateProperties(state.outputAssignments[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const resetQueriedFields = (state) => {
    // reset queriedFields: create one empty query field item + Id
    return set(state, PROPS.queriedFields, hydrateWithErrors([{field: 'Id', rowIndex: generateGuid()}, {field: '', rowIndex: generateGuid()}]));
};

const updateOutputReferenceAndQueriedFields = (state, value, error) => {
    // update outputReference
    state = updateProperties(state, {[PROPS.outputReference]: {value, error}});
    // reset queriedFields: create one empty query item + Id
    return resetQueriedFields(state);
};

/**
 * Reset current element state's sortOrder and sortField properties
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetSordOrderAndSortField = state => {
    return updateProperties(state, {
        sortOrder: SORT_ORDER.NOT_SORTED,
        sortField: { value: '', error: null}
    });
};

/**
 * Reset current element state's outputAssignments, outputReference and queriedFields properties
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetOutputAssignmentsOutputReferenceAndQueriedfields = state => {
    state = resetOutputAssignments(state);
    // reset outputReference and queried fields
    return updateOutputReferenceAndQueriedFields(state, '', null);
};

/**
 * Reset current element's state filters property
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetFilters = state => {
    // reset filters: create one empty filter item
    return set(state, PROPS.filters, [emptyFilterItem()]);
};

/**
 * Reset current element's state numberRecordsToStore, wayToStoreFields and assignNullValuesIfNoRecordsFound properties
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetStoreOptions = state => {
    return updateProperties(state, {
        [PROPS.numberRecordsToStore]: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
        [PROPS.wayToStoreFields]: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
        [PROPS.assignNullValuesIfNoRecordsFound]: false
    });
};

/**
 * Reset filterType, filters, outputReference, queriedFields, sort order, sort field, assignment to null, storing options
 * @param {Object} state - current element state
 * @returns {Object} updated state
 */
const resetSubSections = state => {
    state = resetSordOrderAndSortField(state);
    state = resetOutputAssignmentsOutputReferenceAndQueriedfields(state);
    // reset filters & filterType
    state = updateProperties(state, {[PROPS.filterType]: RECORD_FILTER_CRITERIA.NONE});
    state = resetFilters(state);
    // reset storing options
    return resetStoreOptions(state);
};

const managePropertyChanged = (state, {propertyName, ignoreValidate, error,  oldValue, value}) => {
    if (value === oldValue) {
        return state;
    }

    if (!ignoreValidate) {
        error = error === null ? recordLookupValidation.validateProperty(propertyName, value) : error;
    }

    //  filtering out non-hydratable properties
    if (!NON_HYDRATABLE_PROPS.has(propertyName)) {
        state = updateProperties(state, {[propertyName]: {value, error}});
    }

    if (!error) {
        if (propertyName === PROPS.object) {
            state = resetSubSections(state);
        } else if (propertyName === PROPS.outputReference) {
            state = resetQueriedFields(state);
        } else if (propertyName === PROPS.numberRecordsToStore) {
            state = updateProperties(state, {[propertyName]: value});
            state = resetOutputAssignmentsOutputReferenceAndQueriedfields(state);
        } else if (propertyName === PROPS.sortOrder) {
            state = updateProperties(state,  {[propertyName]: value});
            // if set to no sorting: reset error if any, and preserve value
            if (value === SORT_ORDER.NOT_SORTED) {
               state = updateProperties(state, {sortField: {value: state.sortField.value, error: null}});
            }
        } else if (propertyName === PROPS.filterType) {
            state = updateProperties(state, {[propertyName]: value});
            if (value === RECORD_FILTER_CRITERIA.NONE) {
                // reset errors in filters if any, and preserve values
                state = resetFilters(state);
            }
        } else if (propertyName === PROPS.wayToStoreFields) {
            state = updateProperties(state, {[propertyName]: value});
            // reset outputReference and queried fields
            state = updateOutputReferenceAndQueriedFields(state, '', null);
            state = resetOutputAssignments(state);
        } else if (propertyName === PROPS.assignNullValuesIfNoRecordsFound) {
            state = updateProperties(state, {[propertyName]: value});
        }
    }
    return state;
};

/**
 * Element reducer function: runs validation rules and returns back the updated element state
 * @param {Object} state - element's state
 * @param {Object} event - The event to be handled
 * @returns {object} updated state
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
            return recordLookupValidation.validateAll(state, getRules(state, event));
        default:
            return state;
    }
};