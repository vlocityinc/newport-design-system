import { recordDeleteValidation, getRules } from './recordDeleteValidation';
import { updateProperties, set, deleteItem } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { PropertyChangedEvent, AddRecordFilterEvent, UpdateRecordFilterEvent, DeleteRecordFilterEvent, RecordStoreOptionChangedEvent } from "builder_platform_interaction/events";
import { generateGuid } from "builder_platform_interaction/storeLib";

/**
 * Property names
 */
const PROP_NAMES = { filters : 'filters', inputReference: 'inputReference',
        object : 'object', numberRecordsToStore : 'numberRecordsToStore'};

/**
 * Empty record filter item
 * @returns {object} empty record filter item
 */
const emptyFilterItem = () => ({
      [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
      [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null },
      [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null },
      [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null },
      rowIndex: generateGuid()
});

/**
 * Add record filter item
 * @param {object} state - element / node state
 * @returns {object} updated state
 */
const addRecordFilter = (state) => {
    const path = [PROP_NAMES.filters, state.filters.length];
    return set(state, path, emptyFilterItem());
};

/**
 * Delete record filter item
 * @param {object} state - element / node state
 * @param {object} event detail
 * @param {number} event.detail.index index of the record filter item to delete
 * @returns {object} updated state
 */
const deleteRecordFilter = (state, {index}) => {
    const updatedItems = deleteItem(state.filters, index);
    return set(state, PROP_NAMES.filters, updatedItems);
};

/**
 * Update record filter item
 * @param {object} state - element / node state
 * @param {object} event detail
 * @param {number} event.detail.index index of the record filter item to update
 * @param {string} event.detail.value new value of the record filter item to update
 * @returns {object} updated state
 */
const updateRecordFilter = (state, {index, value}) => {
    const path = [PROP_NAMES.filters, index];
    const item = updateProperties(state.filters[index], value);
    return set(state, path, item);
};

/**
 * Reset filter (with default empty record filter item entry)
 * @param {object} state - element / node state
 * @returns {object} updated state
 */
const resetFilters = (state) => {
    return set(state, PROP_NAMES.filters, [emptyFilterItem()]);
};

/**
 * Reset filters, inputReference and object state's property (last one only if resetObject true)
 * @param {object} state - element / node state
 * @param {boolean} resetObject - if true reset the object property
 * @returns {object} updated state
 */
const resetRecordDelete = (state, resetObject) => {
    state = resetFilters(state);
    if (resetObject) {
        state = set(state, PROP_NAMES.object, {value: '', error: null });
    }
    // reset inputReference
    return set(state, PROP_NAMES.inputReference, {value: '', error: null });
};

/**
 * Update the way the user store the records
 */
const recordStoreOptionAndWayToStoreChanged = (state, {getFirstRecordOnly}) => {
    if (state.getFirstRecordOnly !== getFirstRecordOnly) {
        state = updateProperties(state, {useSobject: getFirstRecordOnly});
        return resetRecordDelete(state, true);
    }
    return state;
};

/**
 * Based on property to be changed operate specific routine
 * @param {object} state - element / node state
 * @param {object} event detail
 * @param {string} event.detail.propertyName property name
 * @param {boolean} event.detail.ignoreValidate if true ignore specific property validation
 * @param {error} event.detail.error error value
 * @param {string} event.detail.value new property value
 * @param {string} event.detail.oldValue current property value
 * @returns {object} updated state
 */
const managePropertyChanged = (state, { propertyName: propName, ignoreValidate, error, value, oldValue }) => {
    if (!ignoreValidate) {
        error = error === null ? recordDeleteValidation.validateProperty(propName, value) : error;
    }
    if (state[propName]) {
        state = updateProperties(state, {[propName]: {value, error}});
    }
    if (!error) {
        if (propName === PROP_NAMES.object && value !== oldValue) {
            state = resetRecordDelete(state);
        } else if (propName === PROP_NAMES.numberRecordsToStore) {
            state = resetRecordDelete(state, true);
        }
    }
    return state;
};

/**
 * Record delete reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const recordDeleteReducer = (state, event) => {
    switch (event.type) {
        case AddRecordFilterEvent.EVENT_NAME:
            return addRecordFilter(state);
        case UpdateRecordFilterEvent.EVENT_NAME:
            return updateRecordFilter(state, event.detail);
        case DeleteRecordFilterEvent.EVENT_NAME:
            return deleteRecordFilter(state, event.detail);
        case RecordStoreOptionChangedEvent.EVENT_NAME:
            return recordStoreOptionAndWayToStoreChanged(state, event.detail);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event.detail);
        case VALIDATE_ALL:
            return recordDeleteValidation.validateAll(state, getRules(state, event));
        default:
            return state;
    }
};