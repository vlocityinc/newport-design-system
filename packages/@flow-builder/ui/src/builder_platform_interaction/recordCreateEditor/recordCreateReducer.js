import { recordCreateValidation, getRules } from "./recordCreateValidation";
import { updateProperties, set, deleteItem } from "builder_platform_interaction/dataMutationLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import {
    PropertyChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    RecordStoreOptionChangedEvent
} from "builder_platform_interaction/events";

const INPUTASSIGNMENTS_PROP = 'inputAssignments';
const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;
const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const resetAssignmentErrors = (state) => {
    const oldInputAssignments = state.inputAssignments;
    state = set(state, INPUTASSIGNMENTS_PROP, oldInputAssignments.map(inputAssignment => {
        inputAssignment[LHS].error = null;
        inputAssignment[RHS].error = null;
        return inputAssignment;
    }));
    return state;
};

const emptyAssignmentItem = () => {
    return {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
        rowIndex: generateGuid(),
    };
};

const addRecordRecordFieldAssignment = (state) => {
    const path = [INPUTASSIGNMENTS_PROP, state.inputAssignments.length];
    return set(state, path, emptyAssignmentItem());
};

const deleteRecordRecordFieldAssignment = (state, event) => {
    const updatedItems = deleteItem(state.inputAssignments, event.detail.index);
    return set(state, INPUTASSIGNMENTS_PROP, updatedItems);
};

const hasRhsValueButNoLhs = (assignMentToUpdate, leftHandSide) => {
    return assignMentToUpdate[RHS].value !== '' && leftHandSide && leftHandSide.value === '';
};

const updateRecordRecordFieldAssignment = (state, {index, value}) => {
    const path = [INPUTASSIGNMENTS_PROP, index];
    const assignMentToUpdate = state.inputAssignments[index];
    const item = updateProperties(assignMentToUpdate, hasRhsValueButNoLhs(assignMentToUpdate, value.leftHandSide) ? assignMentToUpdate : value);
    return set(state, path, item);
};

const resetRecordCreate = (state, resetObject) => {
    // reset inputAssignments : create one empty assignment item
    state = set(state, INPUTASSIGNMENTS_PROP, [emptyAssignmentItem()]);
    if (resetObject) {
        state = updateProperties(state, {'object': {value: '', error: null }});
    }
    // reset assignRecordIdToReference
    state = updateProperties(state, {'assignRecordIdToReference': {value: '', error: null }});
    // reset inputReference
    return updateProperties(state, {'inputReference': {value: '', error: null }});
};

/**
 * Update the way the user store the records
 */
const recordStoreOptionAndWayToStoreChanged = (state, {getFirstRecordOnly, wayToStoreFields}) => {
    if (state.getFirstRecordOnly !== getFirstRecordOnly) {
        state = updateProperties(state, {getFirstRecordOnly});
        state = updateProperties(state, {"wayToStoreFields":  WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE});
        return resetRecordCreate(state, true);
    } else if (state.wayToStoreFields !== wayToStoreFields) {
        return updateProperties(state, {wayToStoreFields});
    }
    return state;
};

const managePropertyChanged = (state, {propertyName, ignoreValidate, error,  oldValue, value}) => {
    if (!ignoreValidate) {
        error = error === null ? recordCreateValidation.validateProperty(propertyName, value) : error;
    }
    state = updateProperties(state, {[propertyName]: {value, error}});
    if (!error) {
        if (propertyName === 'object' && value !== oldValue) {
            // reset all filterItems, outputReference, queriedFields
            state = resetRecordCreate(state);
        } else if (propertyName === INPUTASSIGNMENTS_PROP) {
            state = resetAssignmentErrors(state);
        } else if (propertyName === 'assignRecordIdToReference') {
            state = set(state, propertyName, {value, error: null});
        }
    }
    return state;
};

/**
 * Record Create reducer function runs validation rules and returns back the updated element state
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const recordCreateReducer = (state, event) => {
    switch (event.type) {
        case AddRecordFieldAssignmentEvent.EVENT_NAME:
            return addRecordRecordFieldAssignment(state);
        case DeleteRecordFieldAssignmentEvent.EVENT_NAME:
            return deleteRecordRecordFieldAssignment(state, event);
        case UpdateRecordFieldAssignmentEvent.EVENT_NAME:
            return updateRecordRecordFieldAssignment(state, event.detail);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event.detail);
        case RecordStoreOptionChangedEvent.EVENT_NAME:
            return recordStoreOptionAndWayToStoreChanged(state, event.detail);
        case VALIDATE_ALL: {
            return recordCreateValidation.validateAll(state, getRules(state, event.wayToStoreFields));
        }
        default:
            return state;
    }
};