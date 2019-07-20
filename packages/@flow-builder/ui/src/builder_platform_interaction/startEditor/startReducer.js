import { startValidation, getRules } from './startValidation';

import {
    deleteItem,
    set,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import {
    FLOW_TRIGGER_TYPE,
    FLOW_TRIGGER_FREQUENCY,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';

const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
    OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR,
    RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;

const PROPS = {
    object: 'object',
    filters: 'filters',
    filterType: 'filterType'
};

const NON_HYDRATABLE_PROPS = new Set([
    ...elementTypeToConfigMap[ELEMENT_TYPE.START_ELEMENT]
        .nonHydratableProperties
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

const addRecordFilter = state => {
    const path = [PROPS.filters, state.filters.length];
    return set(state, path, emptyFilterItem());
};

const updateRecordFilter = (state, event) => {
    const path = [PROPS.filters, event.detail.index];
    const item = updateProperties(
        state.filters[event.detail.index],
        event.detail.value
    );
    return set(state, path, item);
};

const deleteRecordFilter = (state, event) => {
    const updatedItems = deleteItem(state.filters, event.detail.index);
    return set(state, PROPS.filters, updatedItems);
};

const setDefaultScheduledProperties = state => {
    state[START_ELEMENT_FIELDS.FREQUENCY] = {
        value: FLOW_TRIGGER_FREQUENCY.ONCE,
        error: null
    };
};

const clearScheduledProperties = state => {
    delete state[START_ELEMENT_FIELDS.START_DATE];
    delete state[START_ELEMENT_FIELDS.START_TIME];
    delete state[START_ELEMENT_FIELDS.FREQUENCY];
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

const clearAllProperties = state => {
    state[PROPS.object] = { value: '', error: null };
    state[PROPS.filterType] = {};
    clearScheduledProperties(state);
};

/**
 * Reset filterType, filters, outputReference, queriedFields, sort order, sort field, assignment to null, storing options
 * @param {Object} state - current element state
 * @returns {Object} updated state
 */
const resetSubSections = state => {
    // reset filters & filterType
    state = updateProperties(state, {
        [PROPS.filterType]: RECORD_FILTER_CRITERIA.ALL
    });
    return resetFilters(state);
};

const startPropertyChanged = (state, event) => {
    if (!event.detailignoreValidate) {
        event.detail.error =
            event.detail.error === null
                ? startValidation.validateProperty(
                      event.detail.propertyName,
                      event.detail.value,
                      null,
                      state
                  )
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

    if (!event.detail.error) {
        if (event.detail.propertyName === START_ELEMENT_FIELDS.TRIGGER_TYPE) {
            if (event.detail.value === FLOW_TRIGGER_TYPE.SCHEDULED) {
                setDefaultScheduledProperties(state);
            } else {
                // clear all scheduled properties if trigger type is not 'Scheduled'
                state = resetFilters(state);
                clearAllProperties(state);
            }
        } else if (event.detail.propertyName === PROPS.object) {
            state = resetSubSections(state);
        } else if (event.detail.propertyName === PROPS.filterType) {
            state = resetSubSections(state);
            state = updateProperties(state, {
                [event.detail.propertyName]: event.detail.value
            });
            if (event.detail.value === RECORD_FILTER_CRITERIA.NONE) {
                // reset errors in filters if any, and preserve values
                state = resetFilters(state);
            }
        }
    }
    return state;
};

/**
 * Start reducer function
 * @param {object} state - element / start node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const startReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return startPropertyChanged(state, event);
        case AddRecordFilterEvent.EVENT_NAME:
            return addRecordFilter(state, event);
        case UpdateRecordFilterEvent.EVENT_NAME:
            return updateRecordFilter(state, event);
        case DeleteRecordFilterEvent.EVENT_NAME:
            return deleteRecordFilter(state, event);
        case VALIDATE_ALL: {
            return startValidation.validateAll(state, getRules(state, event));
        }
        default:
            return state;
    }
};
