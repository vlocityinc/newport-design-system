// @ts-nocheck
import { deleteItem, set, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import {
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    ManuallyAssignVariablesChangedEvent,
    PropertyChangedEvent,
    RecordStoreOptionChangedEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getRules, recordCreateValidation } from './recordCreateValidation';

const PROP_NAMES = {
    inputAssignments: 'inputAssignments',
    inputReference: 'inputReference',
    object: 'object',
    assignRecordIdToReference: 'assignRecordIdToReference',
    wayToStoreFields: 'wayToStoreFields',
    getFirstRecordOnly: 'getFirstRecordOnly',
    storeOutputAutomatically: 'storeOutputAutomatically'
};
const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;
const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;

const emptyAssignmentItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [RHS]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: {
            value: '',
            error: null
        },
        rowIndex: generateGuid()
    };
};

const addRecordRecordFieldAssignment = (state) => {
    const path = [PROP_NAMES.inputAssignments, state[PROP_NAMES.inputAssignments].length];
    return set(state, path, emptyAssignmentItem());
};

const deleteRecordRecordFieldAssignment = (state, event) => {
    const updatedItems = deleteItem(state[PROP_NAMES.inputAssignments], event.detail.index);
    return set(state, PROP_NAMES.inputAssignments, updatedItems);
};

const hasRhsValueButNoLhs = (assignmentToUpdate, leftHandSide) => {
    return assignmentToUpdate[RHS].value !== '' && leftHandSide && leftHandSide.value === '';
};

/**
 * Update input assignments
 *
 * @param {Object} state - current state
 * @param {Ojbect} args
 * @param {number} args.index - input assignment index
 * @param {Object} args.value - input assignment value
 * @returns {Object} updated state
 */
const updateRecordRecordFieldAssignment = (state, { index, value }) => {
    const path = [PROP_NAMES.inputAssignments, index];
    const assignmentToUpdate = state[PROP_NAMES.inputAssignments][index];
    const item = updateProperties(
        assignmentToUpdate,
        hasRhsValueButNoLhs(assignmentToUpdate, value.leftHandSide) ? assignmentToUpdate : value
    );
    return set(state, path, item);
};

/**
 * Reset inputAssignments, inputReference, assignRecordIdToReference and possibly Object fields
 *
 * @param {Object} state - current state
 * @param {boolean} resetObject - true if we want to reset the Object field (defaulted to true)
 * @returns {Object} - updated state
 */
const resetRecordCreate = (state, resetObject = true) => {
    // reset inputAssignments: create one empty assignment item
    state = set(state, PROP_NAMES.inputAssignments, [emptyAssignmentItem()]);
    if (resetObject) {
        state = updateProperties(state, { [PROP_NAMES.object]: { value: '', error: null } });
    }
    // reset assignRecordIdToReference / inputReference
    return updateProperties(state, {
        [PROP_NAMES.assignRecordIdToReference]: { value: '', error: null },
        [PROP_NAMES.inputReference]: { value: '', error: null }
    });
};

/**
 * Update the way the user store the records
 *
 * @param state
 * @param root0
 * @param root0.getFirstRecordOnly
 * @param root0.wayToStoreFields
 */
const recordStoreOptionAndWayToStoreChanged = (state, { getFirstRecordOnly, wayToStoreFields }) => {
    if (state.getFirstRecordOnly !== getFirstRecordOnly) {
        state = updateProperties(state, {
            [PROP_NAMES.getFirstRecordOnly]: getFirstRecordOnly,
            [PROP_NAMES.wayToStoreFields]: WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
        });
        return resetRecordCreate(state);
    } else if (state[PROP_NAMES.wayToStoreFields] !== wayToStoreFields) {
        state = updateProperties(state, { [PROP_NAMES.wayToStoreFields]: wayToStoreFields });
        return resetRecordCreate(state);
    }
    return state;
};

/**
 * Handle specific property change
 *
 * @param {Object} state - current element state
 * @param {Object} args
 * @param {string} args.propertyName - property to be updated
 * @param {boolean} args.ignoreValidate - true to bypass validation
 * @param {string} args.error - null if none
 * @param {string} args.oldValue - current value
 * @param {string} args.value - new value
 * @param {boolean} isAutomaticOutputHandlingSupported - true if current process supports automatic output false otherwise
 * @returns {Object} updated element state
 */
const managePropertyChanged = (
    state,
    { propertyName, ignoreValidate, error, oldValue, value },
    isAutomaticOutputHandlingSupported
) => {
    if (!ignoreValidate) {
        error = error === null ? recordCreateValidation.validateProperty(propertyName, value) : error;
    }
    state = updateProperties(state, { [propertyName]: { value, error } });
    if (!error) {
        if (propertyName === PROP_NAMES.object && value !== oldValue) {
            state = updateProperties(state, {
                [PROP_NAMES.storeOutputAutomatically]: isAutomaticOutputHandlingSupported
            });
            // reset inputAssignments, assignRecordIdToReference, inputReference
            state = resetRecordCreate(state, false);
        } else if (propertyName === PROP_NAMES.assignRecordIdToReference) {
            state = set(state, propertyName, { value, error: null });
        } else if (propertyName === PROP_NAMES.inputReference && value !== oldValue) {
            state = updateProperties(state, {
                [PROP_NAMES.storeOutputAutomatically]: false
            });
        }
    }
    return state;
};

/**
 * Update the property storeOutputAutomatically and reset assignRecordIdToReference.
 *
 * @param state
 * @param root0
 * @param root0.useAdvancedOptions
 */
const useAdvancedOptionsSelectionChanged = (state, { useAdvancedOptions }) => {
    return updateProperties(state, {
        [PROP_NAMES.storeOutputAutomatically]: !useAdvancedOptions,
        [PROP_NAMES.assignRecordIdToReference]: { value: '', error: null }
    });
};

/**
 * Reducer functions to update element state
 *
 * @param {Object} state - element / node state
 * @param {Object} event - The event to be handled
 * @param {boolean} isAutomaticOutputHandlingSupported - true if current process supports automatic output mode false otherwise
 * @returns {Object} state - updated state
 */
export const recordCreateReducer = (state, event, isAutomaticOutputHandlingSupported = false) => {
    switch (event.type) {
        case AddRecordFieldAssignmentEvent.EVENT_NAME:
            return addRecordRecordFieldAssignment(state);
        case DeleteRecordFieldAssignmentEvent.EVENT_NAME:
            return deleteRecordRecordFieldAssignment(state, event);
        case UpdateRecordFieldAssignmentEvent.EVENT_NAME:
            return updateRecordRecordFieldAssignment(state, event.detail);
        case PropertyChangedEvent.EVENT_NAME:
            return managePropertyChanged(state, event.detail, isAutomaticOutputHandlingSupported);
        case ManuallyAssignVariablesChangedEvent.EVENT_NAME:
            return useAdvancedOptionsSelectionChanged(state, event.detail);
        case RecordStoreOptionChangedEvent.EVENT_NAME:
            return recordStoreOptionAndWayToStoreChanged(state, event.detail);
        case VALIDATE_ALL: {
            return recordCreateValidation.validateAll(state, getRules(state, state.wayToStoreFields));
        }
        default:
            return state;
    }
};
