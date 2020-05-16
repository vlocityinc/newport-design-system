// @ts-nocheck
import {
    updateProperties,
    set,
    deleteItem,
    hydrateWithErrors,
    replaceItem
} from 'builder_platform_interaction/dataMutationLib';
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
    NumberRecordToStoreChangedEvent,
    UseAdvancedOptionsSelectionChangedEvent,
    RecordStoreOptionChangedEvent,
    VariableAndFieldMappingChangedEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { recordLookupValidation, getRules } from './recordLookupValidation';
import {
    SORT_ORDER,
    WAY_TO_STORE_FIELDS,
    VARIABLE_AND_FIELD_MAPPING_VALUES
} from 'builder_platform_interaction/recordEditorLib';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
    OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR,
    RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const NON_HYDRATABLE_PROPS = new Set([
    ...elementTypeToConfigMap[ELEMENT_TYPE.RECORD_LOOKUP].nonHydratableProperties,
    'wayToStoreFields'
]);

const emptyFilterItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [OPERATOR]: { value: '', error: null },
        [RHS]: { value: '', error: null },
        [RHS_DATA_TYPE]: { value: '', error: null },
        rowIndex: generateGuid()
    };
};

const emptyAssignmentItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [RHS]: { value: '', error: null },
        rowIndex: generateGuid()
    };
};

const addRecordFilter = state => {
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

const addQueriedField = state => {
    const emptyField = hydrateWithErrors({
        field: '',
        rowIndex: generateGuid()
    });
    const path = ['queriedFields', state.queriedFields.length];
    return set(state, path, emptyField);
};

const deleteQueriedField = (state, event) => {
    const oldFieldValue = state.queriedFields[event.detail.index].field.value;
    const updatedItems = deleteItem(state.queriedFields, event.detail.index);
    state = set(state, 'queriedFields', updatedItems);
    // reset last empty field's blank error if any
    // 'Id' + one field
    if (
        state.queriedFields.length === 2 &&
        state.queriedFields[1].field.value === '' &&
        state.queriedFields[1].field.error
    ) {
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
    const newField = {
        field: { value: event.detail.value, error: event.detail.error },
        rowIndex: state.queriedFields[event.detail.index].rowIndex
    };
    state = updateProperties(state, {
        queriedFields: replaceItem(state.queriedFields, newField, event.detail.index)
    });
    return state;
};

const resetOutputAssignments = state => {
    return set(state, 'outputAssignments', [emptyAssignmentItem()]);
};

const addRecordFieldAssignment = state => {
    const path = ['outputAssignments', state.outputAssignments.length];
    return set(state, path, emptyAssignmentItem());
};

const deleteRecordFieldAssignment = (state, event) => {
    const updatedItems = deleteItem(state.outputAssignments, event.detail.index);
    state = set(state, 'outputAssignments', updatedItems);
    // reset if single empty outputAssignments's its blank error if any
    if (
        state.outputAssignments.length === 1 &&
        state.outputAssignments[0].leftHandSide.value === '' &&
        state.outputAssignments[0].leftHandSide.error
    ) {
        state = resetOutputAssignments(state);
    }
    return state;
};

const updateRecordFieldAssignment = (state, event) => {
    const path = ['outputAssignments', event.detail.index];
    const item = updateProperties(state.outputAssignments[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const resetQueriedFields = state => {
    if (state.variableAndFieldMapping !== VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC) {
        // reset queriedFields: Id query field item and one empty query field item
        return set(
            state,
            'queriedFields',
            hydrateWithErrors([
                { field: 'Id', rowIndex: generateGuid() },
                { field: '', rowIndex: generateGuid() }
            ])
        );
    }
    return set(state, 'queriedFields', null);
};

const updateOutputReferenceAndQueriedFields = (state, value, error) => {
    // update outputReference
    state = updateProperties(state, {
        outputReference: { value, error }
    });
    // reset queriedFields: Id query field item and one empty query field item
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
        sortField: { value: '', error: null }
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
    return set(state, 'filters', [emptyFilterItem()]);
};

/**
 * Reset current element's state numberRecordsToStore, wayToStoreFields and assignNullValuesIfNoRecordsFound properties
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetStoreOptions = state => {
    return updateProperties(state, {
        getFirstRecordOnly: true,
        wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
        assignNullValuesIfNoRecordsFound: false
    });
};

/**
 * Reset current element's state wayToStoreFields and assignNullValuesIfNoRecordsFound properties
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetWayToStoreFields = state => {
    return updateProperties(state, {
        wayToStoreFields: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
        assignNullValuesIfNoRecordsFound: false
    });
};

/**
 * Reset filterLogic, filters, outputReference, queriedFields, sort order, sort field, assignment to null, storing options
 * @param {Object} state - current element state
 * @returns {Object} updated state
 */
const resetSubSections = state => {
    state = resetSordOrderAndSortField(state);
    state = resetOutputAssignmentsOutputReferenceAndQueriedfields(state);
    // reset filters & filterLogic
    state = updateProperties(state, {
        filterLogic: { value: CONDITION_LOGIC.AND, error: null }
    });
    state = resetFilters(state);
    // reset FilterLogic
    state = set(state, 'filterLogic', { value: CONDITION_LOGIC.AND, error: null });
    // reset storing options
    return resetStoreOptions(state);
};

const numberRecordToStoreChanged = (state, { getFirstRecordOnly }) => {
    if (state.getFirstRecordOnly !== getFirstRecordOnly) {
        state = updateProperties(state, {
            getFirstRecordOnly
        });
        state = updateProperties(state, {
            outputReference: { value: '', error: null }
        });
        state = resetWayToStoreFields(state);
    }
    return state;
};

/**
 * Update the property storeOutputAutomatically and reset all others.
 */
const useAdvancedOptionsSelectionChanged = (state, { useAdvancedOptions }) => {
    state = updateProperties(state, {
        storeOutputAutomatically: !useAdvancedOptions,
        outputReference: { value: '', error: null }
    });
    if (useAdvancedOptions) {
        return state;
    }
    state = resetWayToStoreFields(state);
    return resetOutputAssignmentsOutputReferenceAndQueriedfields(state);
};

/**
 * Update the way the user store the records
 */
const recordStoreOptionAndWayToStoreChanged = (
    state,
    { getFirstRecordOnly, assignNullToVariableNoRecord, wayToStoreFields }
) => {
    if (state.getFirstRecordOnly !== getFirstRecordOnly) {
        state = updateProperties(state, {
            getFirstRecordOnly
        });
        state = resetWayToStoreFields(state);
        return resetOutputAssignmentsOutputReferenceAndQueriedfields(state);
    } else if (state.assignNullValuesIfNoRecordsFound !== assignNullToVariableNoRecord) {
        return updateProperties(state, {
            assignNullValuesIfNoRecordsFound: assignNullToVariableNoRecord
        });
    } else if (state.wayToStoreFields !== wayToStoreFields) {
        // reset outputReference and queried fields
        state = updateOutputReferenceAndQueriedFields(state, '', null);
        state = resetOutputAssignments(state);
        return updateProperties(state, {
            wayToStoreFields
        });
    }
    return state;
};

const variableAndFieldMappingChanged = (state, { variableAndFieldMapping }) => {
    if (state.variableAndFieldMapping === variableAndFieldMapping) {
        return state;
    }
    const prevVariableAndFieldMapping = state.variableAndFieldMapping;
    state = updateProperties(state, {
        variableAndFieldMapping
    });
    if (variableAndFieldMapping === VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC) {
        // reset outputReference and delete queried fields
        state = updateOutputReferenceAndQueriedFields(state, '', null);
        state = resetOutputAssignments(state);
        state = updateProperties(state, {
            storeOutputAutomatically: true
        });
        state = resetQueriedFields(state);
    } else if (variableAndFieldMapping === VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS) {
        state = resetOutputAssignments(state);
        state = updateProperties(state, {
            outputReference: { value: '', error: null },
            storeOutputAutomatically: true
        });
    } else {
        state = updateProperties(state, {
            storeOutputAutomatically: false
        });
    }

    if (prevVariableAndFieldMapping === VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC) {
        // If previous value is AUTOMATIC we need to reset the queriedFields otherwise queriedFields are kept
        state = resetQueriedFields(state);
    }

    return state;
};

const managePropertyChanged = (state, { propertyName, ignoreValidate, error, oldValue, value }) => {
    if (!ignoreValidate) {
        error = error === null ? recordLookupValidation.validateProperty(propertyName, value) : error;
    }

    //  filtering out non-hydratable properties
    if (!NON_HYDRATABLE_PROPS.has(propertyName)) {
        state = updateProperties(state, { [propertyName]: { value, error } });
    }

    if (value === oldValue) {
        return state;
    }

    if (!error) {
        if (propertyName === 'object') {
            state = resetSubSections(state);
        } else if (propertyName === 'outputReference') {
            // The first time we don't need to reset the queried fields.
            // It is usefull if the user select multiple fields in automatic and then use Advanced option
            if (oldValue !== '') {
                state = resetQueriedFields(state);
            }
        } else if (propertyName === 'sortOrder') {
            state = updateProperties(state, { [propertyName]: value });
            // if set to no sorting: reset error if any, and preserve value
            if (value === SORT_ORDER.NOT_SORTED) {
                state = updateProperties(state, {
                    sortField: { value: state.sortField.value, error: null }
                });
            }
        } else if (propertyName === 'filterLogic') {
            if (value === CONDITION_LOGIC.NO_CONDITIONS) {
                // reset errors in filters if any, and preserve values
                state = resetFilters(state);
            }
        } else if (propertyName === 'wayToStoreFields') {
            state = updateProperties(state, { [propertyName]: value });
            // reset outputReference and queried fields
            state = updateOutputReferenceAndQueriedFields(state, '', null);
            state = resetOutputAssignments(state);
        } else if (propertyName === 'assignNullValuesIfNoRecordsFound') {
            state = updateProperties(state, { [propertyName]: value });
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
        case NumberRecordToStoreChangedEvent.EVENT_NAME:
            return numberRecordToStoreChanged(state, event.detail);
        case UseAdvancedOptionsSelectionChangedEvent.EVENT_NAME:
            return useAdvancedOptionsSelectionChanged(state, event.detail);
        case RecordStoreOptionChangedEvent.EVENT_NAME:
            return recordStoreOptionAndWayToStoreChanged(state, event.detail);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event.detail);
        case VariableAndFieldMappingChangedEvent.EVENT_NAME:
            return variableAndFieldMappingChanged(state, event.detail);
        case VALIDATE_ALL:
            return recordLookupValidation.validateAll(state, getRules(state, event));
        default:
            return state;
    }
};
