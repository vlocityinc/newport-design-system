// @ts-nocheck
import {
    deleteItem,
    hydrateWithErrors,
    insertItem,
    set,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { createRunAsyncScheduledPath } from 'builder_platform_interaction/elementFactory';
import {
    AddRecordFilterEvent,
    ConfigurationEditorChangeEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction/expressionUtils';
import {
    CONDITION_LOGIC,
    ELEMENT_TYPE,
    SCHEDULED_PATH_TYPE,
    START_ELEMENT_FIELDS
} from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getRules, recordChangeTriggerValidation } from './recordChangeTriggerValidation';

const NON_HYDRATABLE_PROPS = new Set([...elementTypeToConfigMap[ELEMENT_TYPE.START_ELEMENT].nonHydratableProperties]);
const LHS = EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE,
    OPERATOR = EXPRESSION_PROPERTY_TYPE.OPERATOR,
    RHS = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE;
const RHS_DATA_TYPE = EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE;
const PROPS = {
    object: 'object',
    filters: 'filters',
    filterLogic: 'filterLogic',
    recordTriggerType: 'recordTriggerType',
    doesRequireRecordChangedToMeetCriteria: 'doesRequireRecordChangedToMeetCriteria',
    filterFormula: 'filterFormula'
};
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
 * Record change trigger reducer function
 *
 * @param {object} state - element / start node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} start - new start node instance with mutations
 */
export const recordChangeTriggerReducer = (state, event) => {
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
            return recordChangeTriggerValidation.validateAll(state, getRules(state, event));
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

const togglerunAsync = (state, runAsync) => {
    let scheduledPaths;
    if (runAsync) {
        let newScheduledPath = createRunAsyncScheduledPath(<UI.ScheduledPath>{});
        newScheduledPath = hydrateWithErrors(newScheduledPath);
        scheduledPaths = insertItem(state.scheduledPaths, newScheduledPath, 0);
    } else {
        scheduledPaths = state.scheduledPaths.filter((scheduledPath) => {
            return scheduledPath.pathType?.value !== SCHEDULED_PATH_TYPE.RUN_ASYNC;
        });
    }
    return updateProperties(state, { scheduledPaths });
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

const resetfilterFormula = (state) => {
    return set(state, PROPS.filterFormula, null);
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
    if (!event.detail.ignoreValidate) {
        event.detail.error =
            event.detail.error === null
                ? recordChangeTriggerValidation.validateProperty(
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

    if (event.detail.propertyName === PROPS.object) {
        if (!isRecordChangeTriggerType(state.triggerType.value) && (event.detail.error || !event.detail.value)) {
            state = resetSubSections(state);
        }
    } else if (event.detail.propertyName === PROPS.filterLogic) {
        if (event.detail.value === CONDITION_LOGIC.NO_CONDITIONS || event.detail.value === CONDITION_LOGIC.FORMULA) {
            // reset errors in filters if any, and preserve values
            state = resetFilters(state);
        }
        if (event.detail.value !== CONDITION_LOGIC.FORMULA) {
            state = resetfilterFormula(state);
        }
    }

    if (event.detail.propertyName === START_ELEMENT_FIELDS.IS_RUN_ASYNC_PATH_ENABLED) {
        return togglerunAsync(state, event.detail.value);
    }
    return state;
};
