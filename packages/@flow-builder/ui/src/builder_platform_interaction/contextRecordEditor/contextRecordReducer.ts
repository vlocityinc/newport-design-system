// @ts-nocheck
import { contextValidation, getRules } from './contextRecordValidation';
import {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    UpdateRecordFilterEvent,
    ConfigurationEditorChangeEvent
} from 'builder_platform_interaction/events';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { deleteItem, set, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
    OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR,
    RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const PROPS = {
    object: 'object',
    filters: 'filters',
    filterLogic: 'filterLogic',
    recordTriggerType: 'recordTriggerType',
    doesRequireRecordChangedToMeetCriteria: 'doesRequireRecordChangedToMeetCriteria'
};

const NON_HYDRATABLE_PROPS = new Set([...elementTypeToConfigMap[ELEMENT_TYPE.START_ELEMENT].nonHydratableProperties]);

const emptyFilterItem = () => {
    return {
        [LHS]: { value: '', error: null },
        [OPERATOR]: { value: '', error: null },
        [RHS]: { value: '', error: null },
        [RHS_DATA_TYPE]: { value: '', error: null },
        rowIndex: generateGuid()
    };
};

/**
 * Reset current element's state filters property
 *
 * @param {Object} state - current element's state
 * @returns {Object} updated state
 */
const resetFilters = (state) => {
    // reset filters: create one empty filter item
    return set(state, PROPS.filters, [emptyFilterItem()]);
};

/**
 * Reset filterLogic, filters, outputReference, queriedFields, sort order, sort field, assignment to null, storing options
 *
 * @param {Object} state - current element state
 * @returns {Object} updated state
 */
const resetSubSections = (state) => {
    // reset filters & filterLogic
    state = updateProperties(state, {
        [PROPS.filterLogic]: { value: CONDITION_LOGIC.AND, error: null }
    });
    return resetFilters(state);
};

const addRecordFilter = (state) => {
    const path = [PROPS.filters, state.filters.length];
    return set(state, path, emptyFilterItem());
};

const updateRecordFilter = (state, event) => {
    const path = [PROPS.filters, event.detail.index];
    const item = updateProperties(state.filters[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const deleteRecordFilter = (state, event) => {
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, PROPS.filters, updatedItems);
};

const propertyChanged = (state, event) => {
    if (!event.detailignoreValidate) {
        event.detail.error =
            event.detail.error === null
                ? contextValidation.validateProperty(event.detail.propertyName, event.detail.value, null, state)
                : event.detail.error;
    }

    //  filtering out non-hydratable properties
    if (!NON_HYDRATABLE_PROPS.has(event.detail.propertyName)) {
        state = updateProperties(state, {
            [event.detail.propertyName]: {
                error: event.detail.error,
                value: event.detail.value
            }
        });
    }

    if (event.detail.value === event.detail.oldValue) {
        return state;
    }

    if (event.detail.propertyName === PROPS.object) {
        if (!isRecordChangeTriggerType(state.triggerType.value) && (event.detail.error || !event.detail.value)) {
            state = resetSubSections(state);
        }
    } else if (event.detail.propertyName === PROPS.filterLogic) {
        if (event.detail.value === CONDITION_LOGIC.NO_CONDITIONS) {
            // reset errors in filters if any, and preserve values
            state = resetFilters(state);
        }
    }

    return state;
};

/**
 * Start reducer function
 *
 * @param {object} state - element / start node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const contextReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return propertyChanged(state, event);
        case AddRecordFilterEvent.EVENT_NAME:
            return addRecordFilter(state, event);
        case UpdateRecordFilterEvent.EVENT_NAME:
            return updateRecordFilter(state, event);
        case DeleteRecordFilterEvent.EVENT_NAME:
            return deleteRecordFilter(state, event);
        case VALIDATE_ALL: {
            return contextValidation.validateAll(state, getRules(state, event));
        }
        case ConfigurationEditorChangeEvent.EVENT_NAME:
            return updateProperties(state, {
                [event.detail.name]: {
                    error: null,
                    value: event.detail.newValue
                }
            });
        default:
            return state;
    }
};
