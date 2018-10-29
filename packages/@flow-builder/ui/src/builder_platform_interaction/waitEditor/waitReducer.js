import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import {
    addItem,
    deleteItem,
    replaceItem,
    hydrateWithErrors,
    omit,
    updateProperties,
} from 'builder_platform_interaction/dataMutationLib';
import {
    createInputParameter,
    createOutputParameter,
    createWaitEvent,
    createCondition,
    createWaitEventInputParameters,
    createWaitEventOutputParameters,
    getParametersPropertyName,
} from "builder_platform_interaction/elementFactory";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { usedByStoreAndElementState, invokeUsedByAlertModal } from "builder_platform_interaction/usedByLib";
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent,
    DeleteWaitEventEvent,
    ReorderListEvent,
    WaitEventPropertyChangedEvent,
    WaitEventParameterChangedEvent,
    WaitEventAddParameterEvent,
    WaitEventDeleteParameterEvent,
    UpdateWaitEventEventTypeEvent,
} from 'builder_platform_interaction/events';
import {waitValidation} from './waitValidation';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';

const validateProperty = (state, event) => {
    event.detail.error = event.detail.error === null ? waitValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    if (event.detail.error === null && event.detail.propertyName === 'name') {
        // Check for duplicate wait event api names
        event.detail.error = waitValidation.validateWaitEventNameUniquenessLocally(state, event.detail.value, event.detail.guid);
    }
};

const waitPropertyChanged = (state, event) => {
    validateProperty(state, event);
    return updateProperties(state, {
        [event.detail.propertyName]: {
            value: event.detail.value,
            error: event.detail.error
        }
    });
};

const addWaitEvent = (state) => {
    let newWaitEvent = createWaitEvent();
    newWaitEvent = hydrateWithErrors(newWaitEvent);

    const waitEvents = addItem(state.waitEvents, newWaitEvent);

    return updateProperties(state, {waitEvents});
};

const deleteWaitEvent = (state, event) => {
    const usedElements = usedByStoreAndElementState(event.detail.guid, state.guid, state.waitEvents);

    if (usedElements && usedElements.length > 0) {
        invokeUsedByAlertModal(usedElements, [event.detail.guid], ELEMENT_TYPE.WAIT_EVENT);
    } else {
        const waitEvents = state.waitEvents.filter((waitEvent) => {
            return waitEvent.guid !== event.detail.guid;
        });
        return updateProperties(state, {waitEvents});
    }
    return state;
};

const reorderWaitEvents = (state, event) => {
    let waitEvents = state.waitEvents;
    const destinationIndex = state.waitEvents.findIndex((element) => {
        return element.guid === event.detail.destinationGuid;
    });
    const movedWaitEvent = state.waitEvents.find((waitEvent) => {
        return waitEvent.guid === event.detail.sourceGuid;
    });
    if (destinationIndex >= 0 && movedWaitEvent) {
        waitEvents = state.waitEvents.filter((waitEvent) => {
            return waitEvent.guid !== event.detail.sourceGuid;
        });
        waitEvents.splice(destinationIndex, 0, movedWaitEvent);
    }
    return updateProperties(state, {waitEvents});
};

/**
 * Reducer for updating wait events
 * @param {Object} state the entire wait state
 * @param {Object} event the event with payload information
 * @param {function} waitEventOperation the operation we want to perform on the state's waitEvents
 * @returns {Object} updated state
 */
const waitEventReducer = (state, event, waitEventOperation) => {
    const mapEvents = waitEvent => {
        if (waitEvent.guid === event.detail.parentGUID) {
            return waitEventOperation(waitEvent, event);
        }
        return waitEvent;
    };
    const waitEvents = state.waitEvents.map(mapEvents);
    return Object.assign({}, state, { waitEvents });
};

/**
 * Curry function that accepts a property on a wait event and an operation we want to perform
 * on that property
 * @property {String} property the property we want to change on a waitEvent
 * @property {Function} operation callback that when invoked will change a waitEvent's property with a given event payload
 * @returns {Function} function that is called by waitEventReducer and passes in the chosen waitEvent and event payload to modify event
 */
const waitEventOperation = (property, operation) => {
    return (waitEvent, event) => {
        const results = operation(waitEvent[property], event);
        return Object.assign({}, waitEvent, { [property]: results });
    };
};

const addWaitCondition = function (state, event) {
    const addCondition = conditions => {
        const newCondition = hydrateWithErrors(createCondition());
        return addItem(conditions, newCondition);
    };
    return waitEventReducer(state, event, waitEventOperation('conditions', addCondition));
};

const deleteWaitCondition = function (state, event) {
    const deleteCondition = conditions => {
        return deleteItem(conditions, event.detail.index);
    };
    return waitEventReducer(state, event, waitEventOperation('conditions', deleteCondition));
};

const updateWaitCondition = function (state, event) {
    const updateCondition = conditions => {
        const conditionToUpdate = conditions[event.detail.index];
        return replaceItem(conditions, Object.assign({}, conditionToUpdate, event.detail.value), event.detail.index);
    };
    return waitEventReducer(state, event, waitEventOperation('conditions', updateCondition));
};

const configureConditionsByLogic = (waitEvent, event) => {
    const newConditions = {
        conditions: waitEvent.conditions
    };
    if (event.detail.value === CONDITION_LOGIC.NO_CONDITIONS) {
        newConditions.conditions = [];
    } else if (waitEvent.conditions.length === 0) {
        newConditions.conditions = [hydrateWithErrors(createCondition())];
    }
    return newConditions;
};

/**
 * If the platform event logic is no conditions then remove all input parameters.  Otherwise (logic must be 'and')
 * ensure there is at least one input parameter
 * @param {WaitEvent} waitEvent initial state of the waitEvent
 * @param {WaitEventPropertyChangedEvent} event
 * @return {WaitEvent} WaitEvent with updated input parameters
 */
const updatePlatformEventInputParametersByLogic = (waitEvent, event) => {
    const inputParameters = [];

    if (event.detail.value !== CONDITION_LOGIC.NO_CONDITIONS && waitEvent.inputParameters.length === 0) {
        // condition logic must be 'and' and we need an input parameter
        const newParameter = hydrateWithErrors(createInputParameter());
        inputParameters.push(newParameter);
    }

    return Object.assign({}, waitEvent, {inputParameters});
};

const verifyParentGuidIsSet = (event) => {
    if (isUndefinedOrNull(event.detail.parentGUID)) {
        throw new Error('The wait event GUID must be set!');
    }
};

/**
 * Reducer that handles property changed events for a waitEvent
 * @param {Object} state the entire state of the waitEditor
 * @param {Object} event property changed event
 * @returns {Object} updated waitEditor state
 */
const waitEventPropertyChanged = (state, event) => {
    verifyParentGuidIsSet(event);
    validateProperty(state, event);
    const mapEvents = waitEvent => {
        if (waitEvent.guid === event.detail.parentGUID) {
            let conditions;
            if (event.detail.propertyName === 'conditionLogic') {
                conditions = configureConditionsByLogic(waitEvent, event);
            } else if (event.detail.propertyName === 'platformEventConditionLogic') {
                return updatePlatformEventInputParametersByLogic(waitEvent, event);
            }
            const updatedProperty = { value: event.detail.value, error: event.detail.error };
            return Object.assign({}, waitEvent, { [event.detail.propertyName] : updatedProperty }, conditions);
        }
        return waitEvent;
    };

    const waitEvents = state.waitEvents.map(mapEvents);
    return updateProperties(state, { waitEvents });
};

const updateWaitEventParameter = (state, event) => {
    verifyParentGuidIsSet(event);
    const updateParameter = parameters => {
        // Only set the params that are actually passed in
        const propsToUpdate = {};
        if (!isUndefinedOrNull(event.detail.name)) {
            propsToUpdate.name = {
                value: event.detail.name,
                error: null
            };
        }
        if (!isUndefinedOrNull(event.detail.value)) {
            propsToUpdate.value = {
                value: event.detail.value,
                error: event.detail.error
            };
        }
        if (!isUndefinedOrNull(event.detail.valueDataType)) {
            propsToUpdate.valueDataType = {
                value: event.detail.valueDataType,
                error: null
            };
        }

        // input parameters is an array
        if (event.detail.isInputParameter) {
            let index = event.detail.index;

            if (index === null && parameters.length > 0) {
                index = parameters.findIndex(param => {
                    return param.name.value === event.detail.name;
                });
            }

            if (index < 0 || index >= parameters.length) {
                throw new Error(`Invalid parameter item index: ${index}`);
            }

            const updatedParam = Object.assign({}, parameters[index], propsToUpdate);
            return replaceItem(parameters, updatedParam, index);
        }

        // Otherwise output parameters is a map
        if (!parameters[event.detail.name]) {
            throw new Error(`Attempting to update non-existent parameter item ${event.detail.name}`);
        }

        const updatedParam = Object.assign({}, parameters[event.detail.name], propsToUpdate);
        return Object.assign({}, parameters, { [event.detail.name]: updatedParam });
    };
    return waitEventReducer(state, event, waitEventOperation(getParametersPropertyName(event.detail.isInputParameter), updateParameter));
};

const addWaitEventParameter = (state, event) => {
    verifyParentGuidIsSet(event);
    const addParameter = parameters => {
        // input parameters is an array
        if (event.detail.isInputParameter) {
            const newParameter = hydrateWithErrors(createInputParameter());
            return addItem(parameters, newParameter);
        }

        // output parameters is a Map
        if (event.detail.name) {
            const name = hydrateWithErrors(event.detail.name);
            const newParameter = hydrateWithErrors(createOutputParameter({ name }));
            return Object.assign({}, parameters, { [event.detail.name]: newParameter });
        }
        // output param without name
        throw new Error(`Attempting to add output event parameter with no name ${event.detail.name}`);
    };
    return waitEventReducer(state, event, waitEventOperation(getParametersPropertyName(event.detail.isInputParameter), addParameter));
};

const deleteWaitEventParameter = (state, event) => {
    verifyParentGuidIsSet(event);
    const deleteParameter = parameters => {
        // input parameters is an array
        if (event.detail.isInputParameter) {
            return deleteItem(parameters, event.detail.index);
        }

        // Otherwise output parameters is a Map
        return omit(parameters, [event.detail.name]);
    };
    return waitEventReducer(state, event, waitEventOperation(getParametersPropertyName(event.detail.isInputParameter), deleteParameter));
};

const deleteAllWaitEventParameters = (state, event) => {
    verifyParentGuidIsSet(event);
    const inputParamsRemovedState = waitEventReducer(state, event,
        waitEventOperation(getParametersPropertyName(true), () => {
            return [];
        })
    );
    return waitEventReducer(inputParamsRemovedState, event,
        waitEventOperation(getParametersPropertyName(false), () => {
            return {};
        })
    );
};

/**
 * Updates the event type for a wait event and do the parameters cleanup and add parameters with empty values.
 * The operations performed are
 * 1. Verify parentGuid is set and do update only if the current and old eventType name is different
 * 2. Update the eventType for the wait event (parentGuid)
 * 3. Clear all the input and output parameters for the wait event
 * 4. Add input and output parameters for the wait event with empty values
 * @param {Object} state the entire wait state
 * @param {Object} event the event with payload information
 */
const updateWaitEventEventType = (state, event) => {
    verifyParentGuidIsSet(event);
    const { value, oldValue, error } = event.detail;

    // noop when old and new eventType is same and there is no error
    if (!error && value === oldValue) {
        return state;
    }

    // update wait event
    const eventTypeUpdatedState = waitEventPropertyChanged(state, event);

    // if there is error, do not clear the parameters
    if (!isUndefinedOrNull(error)) {
        return eventTypeUpdatedState;
    }

    // remove all the parameters for the wait event
    const parametersRemovedState = deleteAllWaitEventParameters(eventTypeUpdatedState, event);

    // initialize the input and output parameters for the new event type
    const inputParameters = hydrateWithErrors(createWaitEventInputParameters(value));
    const outputParameters = hydrateWithErrors(createWaitEventOutputParameters(value));

    // update the state with new input parameters
    const inputParamsAddedState = waitEventReducer(parametersRemovedState, event,
        waitEventOperation(getParametersPropertyName(true), () => {
            return inputParameters;
        })
    );

    // update the state with new output parameters
    return waitEventReducer(inputParamsAddedState, event,
        waitEventOperation(getParametersPropertyName(false), () => {
            return outputParameters;
        })
    );
};

/**
 * Wait reducer function runs validation rules and returns back the updated Wait element
 * @param {Object} state - element / Wait node
 * @param {Event} event - object containing type and payload
 * @returns {Object} Wait - updated Wait
 */
export const waitReducer = (state, event) => {
    switch (event.type) {
        case AddConditionEvent.EVENT_NAME:
            return addWaitCondition(state, event);
        case DeleteConditionEvent.EVENT_NAME:
            return deleteWaitCondition(state, event);
        case UpdateConditionEvent.EVENT_NAME:
            return updateWaitCondition(state, event);
        case PropertyChangedEvent.EVENT_NAME:
            return waitPropertyChanged(state, event);
        case WaitEventPropertyChangedEvent.EVENT_NAME:
            return waitEventPropertyChanged(state, event);
        case WaitEventParameterChangedEvent.EVENT_NAME:
            return updateWaitEventParameter(state, event);
        case WaitEventAddParameterEvent.EVENT_NAME:
            return addWaitEventParameter(state, event);
        case WaitEventDeleteParameterEvent.EVENT_NAME:
            return deleteWaitEventParameter(state, event);
        case UpdateWaitEventEventTypeEvent.EVENT_NAME:
            return updateWaitEventEventType(state, event);
        case VALIDATE_ALL:
            return waitValidation.validateAll(state);
        case PROPERTY_EDITOR_ACTION.ADD_WAIT_EVENT:
            return addWaitEvent(state);
        case ReorderListEvent.EVENT_NAME:
            return reorderWaitEvents(state, event);
        case DeleteWaitEventEvent.EVENT_NAME:
            return deleteWaitEvent(state, event);
        default: return state;
    }
};
