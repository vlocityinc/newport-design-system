import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { subflowValidation } from "./subflowValidation";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { UpdateParameterItemEvent, DeleteParameterItemEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { updateParameterItem, removeUnsetParameters, deleteParameterItem, mergeWithInputOutputVariables } from 'builder_platform_interaction/calloutEditorLib';

export const MERGE_WITH_VARIABLES = 'MERGE_WITH_VARIABLES';
export const REMOVE_UNSET_ASSIGNMENTS = 'REMOVE_UNSET_ASSIGNMENTS';

const subflowPropertyChanged = (state, event) => {
    const error = event.detail.error === null ? subflowValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {[event.detail.propertyName]: {error, value: event.detail.value}});
};

/**
 * Subflow reducer function runs validation rules and returns back the updated variable
 * @param {object} state - element / node state
 * @param {object} event - The event to be handled
 * @returns {object} state - updated state
 */
export const subflowReducer = (state, event) => {
    switch (event.type) {
        case PropertyChangedEvent.EVENT_NAME:
            return subflowPropertyChanged(state, event);
        case UpdateParameterItemEvent.EVENT_NAME:
            return updateParameterItem(state, event.detail);
        case DeleteParameterItemEvent.EVENT_NAME:
            return deleteParameterItem(state, event.detail);
        case MERGE_WITH_VARIABLES:
            return mergeWithInputOutputVariables(state, event.detail);
        case REMOVE_UNSET_ASSIGNMENTS:
            return removeUnsetParameters(state);
        case VALIDATE_ALL:
            return subflowValidation.validateAll(state);
        default: return state;
    }
};