import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { invocableActionValidation } from "./invocableActionValidation";
import { UpdateParameterItemEvent, PropertyChangedEvent, DeleteParameterItemEvent } from "builder_platform_interaction/events";
import { updateParameterItem, mergeWithInputOutputParameters, removeUnsetParameters, deleteParameterItem,
    MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';

const invocableActionPropertyChanged = (state, event) => {
    const error = event.detail.error === null ? invocableActionValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {[event.detail.propertyName]: {value: event.detail.value, error}});
};

/**
 * Invocable action reducer, performs changes and validation on a invocable action editor
 * @param {object} state  element / action call node
 * @param {object} event  event to process
 * @returns {object}    the updated action call node
 */
export const invocableActionReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return invocableActionPropertyChanged(state, event);
        case UpdateParameterItemEvent.EVENT_NAME:
            return updateParameterItem(state, event.detail);
        case DeleteParameterItemEvent.EVENT_NAME:
            return deleteParameterItem(state, event.detail);
        case MERGE_WITH_PARAMETERS:
            return mergeWithInputOutputParameters(state, event.detail);
        case REMOVE_UNSET_PARAMETERS:
            return removeUnsetParameters(state);
        case VALIDATE_ALL:
            return invocableActionValidation.validateAll(state);
        default: return state;
    }
};