import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { timeTriggersValidation, additionalRules } from './timeTriggersValidation';
import { addItem, hydrateWithErrors, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { StoreState, TimeTrigger } from 'builder_platform_interaction/flowModel';
import { createTimeTrigger } from 'builder_platform_interaction/elementFactory';

const addTimeTrigger = (state) => {
    let newTimeTrigger = createTimeTrigger(<TimeTrigger>{});
    newTimeTrigger = hydrateWithErrors(newTimeTrigger);
    const timeTriggers = addItem(state.timeTriggers, newTimeTrigger);

    return updateProperties(state, { timeTriggers });
};

const deleteTimeTrigger = (state, event) => {
    const timeTriggers = state.timeTriggers.filter((timeTrigger) => {
        return timeTrigger.guid !== event.detail.guid;
    });

    return updateProperties(state, { timeTriggers });
};

const validateProperty = (state, event) => {
    event.detail.error =
        event.detail.error === null
            ? timeTriggersValidation.validateProperty(event.detail.propertyName, event.detail.value, undefined)
            : event.detail.error;
    if (event.detail.error === null && event.detail.propertyName === 'name') {
        // we need to run the outcome api name uniqueness validation within the current session of property editor
        event.detail.error = timeTriggersValidation.validateTimeTriggerNameUniquenessLocally(
            state,
            event.detail.value,
            event.detail.guid
        );
    }
};

const timeTriggerPropertyChanged = (state, event) => {
    validateProperty(state, event);
    const timeTriggers = state.timeTriggers.map((timeTrigger) => {
        return event.detail.guid !== timeTrigger.guid
            ? timeTrigger
            : updateProperties(timeTrigger, {
                  [event.detail.propertyName]: {
                      error: event.detail.error,
                      value: event.detail.value
                  }
              });
    });

    return updateProperties(state, { timeTriggers });
};

/**
 * TiimeTrigger reducer function runs validation rules and returns back the updated variable
 * @param state - element / node state
 * @param event - object containing type and payload eg: {guid:"xyz", detail: {propertyName: '', value: '' , error: ''}}
 * @returns TimeTrigger - updated state
 */
export const timeTriggersReducer = (state: StoreState, event: CustomEvent): StoreState => {
    switch (event.type) {
        case PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_TIME_TRIGGER:
            return addTimeTrigger(state);
        case PropertyChangedEvent.EVENT_NAME:
            return timeTriggerPropertyChanged(state, event);
        case PROPERTY_EDITOR_ACTION.DELETE_START_ELEMENT_TIME_TRIGGER:
            return deleteTimeTrigger(state, event);
        case PROPERTY_EDITOR_ACTION.UPDATE_START_ELEMENT_TIME_TRIGGER:
            return state;
        case VALIDATE_ALL:
            return timeTriggersValidation.validateAll(state, additionalRules);
        default:
            return state;
    }
};
