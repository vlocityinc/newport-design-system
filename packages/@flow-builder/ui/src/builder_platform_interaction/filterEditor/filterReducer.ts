import {
    CollectionReferenceChangedEvent,
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import { deleteItem, set, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { EXPRESSION_PROPERTY_TYPE, getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { filterValidation, getRules } from './filterValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getVariableOrField } from 'builder_platform_interaction/referenceToVariableUtil';
import { Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { COLLECTION_PROCESSOR_PROPERTIES } from 'builder_platform_interaction/collectionProcessorLib';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE;
const OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR;
const RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const initLHS = (state) => {
    const assignNextValueToReferenceGuidOrDevName =
        state[COLLECTION_PROCESSOR_PROPERTIES.ASSIGN_NEXT_VALUE_TO_REFERENCE].value;
    const currentItem = getResourceByUniqueIdentifier(assignNextValueToReferenceGuidOrDevName, {
        lookupByDevName: true
    });
    const collectionVariable = getVariableOrField(
        state[COLLECTION_PROCESSOR_PROPERTIES.COLLECTION_REFERENCE].value,
        Store.getStore().getCurrentState().elements
    );
    if (
        collectionVariable &&
        currentItem &&
        collectionVariable.dataType !== FLOW_DATA_TYPE.SOBJECT.value &&
        collectionVariable.dataType !== FLOW_DATA_TYPE.APEX.value
    ) {
        return currentItem.guid;
    }
    return '';
};

const initFilterCondition = (state) => {
    return {
        rowIndex: generateGuid(),
        [LHS]: { value: initLHS(state), error: null },
        [OPERATOR]: { value: '', error: null },
        [RHS]: { value: '', error: null },
        [RHS_DATA_TYPE]: { value: '', error: null }
    };
};

const addFilterConditionItem = (state) => {
    const path = [COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS, state[COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS].length];
    return set(state, path, initFilterCondition(state));
};

const deleteFilterConditionItem = (state, event) => {
    const index = event.detail.index;
    const item = deleteItem(state[COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS], index);
    return set(state, COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS, item);
};

const updateFilterConditionItem = (state, event) => {
    const { index, value } = event.detail;
    const path = [COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS, index];
    const item = updateProperties(state[COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS][index], value);
    return set(state, path, item);
};

const updateProperty = (state, event) => {
    const propertyName = event.detail.propertyName;
    if (propertyName) {
        const { value, error } = event.detail;
        const oldValue = state[propertyName];
        state = updateProperties(state, {
            [propertyName]: { value, error }
        });
        if (propertyName === COLLECTION_PROCESSOR_PROPERTIES.CONDITION_LOGIC) {
            // change logic from formula to any condition logic or vice verso will reset conditions and formula
            if (oldValue.value === CONDITION_LOGIC.FORMULA || value === CONDITION_LOGIC.FORMULA) {
                state = resetFormula(state);
                state = set(state, COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS, [initFilterCondition(state)]);
            }
        }
    }
    return state;
};

const updateCollectionReference = (state, event) => {
    const currentStateReferenceValue = state[COLLECTION_PROCESSOR_PROPERTIES.COLLECTION_REFERENCE].value;
    const newValue = event.detail.value;
    const error = event.detail.error
        ? event.detail.error
        : filterValidation.validateProperty(
              COLLECTION_PROCESSOR_PROPERTIES.COLLECTION_REFERENCE,
              newValue,
              getRules(state)
          );
    state = updateProperties(state, {
        [COLLECTION_PROCESSOR_PROPERTIES.COLLECTION_REFERENCE]: { value: event.detail.value, error }
    });
    // reset filter if input collection reference changed and no error
    if (newValue !== currentStateReferenceValue && !error) {
        state = resetFilter(state);
    }
    return state;
};

const resetFilter = (state) => {
    state = resetFilterLogic(state);
    state = resetFormula(state);
    return set(state, COLLECTION_PROCESSOR_PROPERTIES.CONDITIONS, [initFilterCondition(state)]);
};

const resetFilterLogic = (state) => {
    const conditionLogic = { value: CONDITION_LOGIC.AND, error: null };
    return set(state, COLLECTION_PROCESSOR_PROPERTIES.CONDITION_LOGIC, conditionLogic);
};

const resetFormula = (state) => {
    const formula = { value: '', error: null };
    return set(state, COLLECTION_PROCESSOR_PROPERTIES.FORMULA, formula);
};
/**
 *
 * @param {object} state - element / filter editor node
 * @param {object} event - events from filter editor
 * @returns {object} filter condition - updated filter condition
 */
export const filterReducer = (state, event) => {
    switch (event.type) {
        case CollectionReferenceChangedEvent.EVENT_NAME:
            return updateCollectionReference(state, event);
        case AddConditionEvent.EVENT_NAME:
            return addFilterConditionItem(state);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteFilterConditionItem(state, event);
        case UpdateConditionEvent.EVENT_NAME:
            return updateFilterConditionItem(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return updateProperty(state, event);
        case VALIDATE_ALL:
            return filterValidation.validateAll(state, getRules(state));
        default:
            return null;
    }
};
