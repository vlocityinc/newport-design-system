import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { addItem, hydrateWithErrors, updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { createScheduledPath } from 'builder_platform_interaction/elementFactory';
import { DeleteScheduledPathEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { additionalRules, scheduledPathsValidation } from './scheduledPathsValidation';

const addScheduledPath = (state) => {
    let newScheduledPath = createScheduledPath(<UI.ScheduledPath>{});
    newScheduledPath = hydrateWithErrors(newScheduledPath);
    const scheduledPaths = addItem(state.scheduledPaths, newScheduledPath);

    return updateProperties(state, { scheduledPaths });
};

const deleteScheduledPath = (state, event) => {
    const scheduledPaths = state.scheduledPaths.filter((scheduledPath) => {
        return scheduledPath.guid !== event.detail.guid;
    });

    return updateProperties(state, { scheduledPaths });
};

const validateProperty = (state, event) => {
    event.detail.error =
        event.detail.error === null
            ? scheduledPathsValidation.validateProperty(event.detail.propertyName, event.detail.value, undefined)
            : event.detail.error;
    if (event.detail.error === null && event.detail.propertyName === 'name') {
        // we need to run the outcome api name uniqueness validation within the current session of property editor
        event.detail.error = scheduledPathsValidation.validateScheduledPathNameUniquenessLocally(
            state,
            event.detail.value,
            event.detail.guid
        );
    }
};

const scheduledPathPropertyChanged = (state, event) => {
    validateProperty(state, event);
    const scheduledPaths = state.scheduledPaths.map((scheduledPath) => {
        return event.detail.guid !== scheduledPath.guid
            ? scheduledPath
            : updateProperties(scheduledPath, {
                  [event.detail.propertyName]: {
                      error: event.detail.error,
                      value: event.detail.value
                  }
              });
    });

    return updateProperties(state, { scheduledPaths });
};

/**
 * TiimeTrigger reducer function runs validation rules and returns back the updated variable
 *
 * @param state - element / node state
 * @param event - object containing type and payload eg: {guid:"xyz", detail: {propertyName: '', value: '' , error: ''}}
 * @returns ScheduledPath - updated state
 */
export const scheduledPathsReducer = (state: UI.StoreState, event: CustomEvent): UI.StoreState => {
    switch (event.type) {
        case PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_SCHEDULED_PATH:
            return addScheduledPath(state);
        case PropertyChangedEvent.EVENT_NAME:
            return scheduledPathPropertyChanged(state, event);
        case DeleteScheduledPathEvent.EVENT_NAME:
            return deleteScheduledPath(state, event);
        case PROPERTY_EDITOR_ACTION.UPDATE_START_ELEMENT_SCHEDULED_PATH:
            return state;
        case VALIDATE_ALL:
            return scheduledPathsValidation.validateAll(state, additionalRules);
        default:
            return state;
    }
};
