import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { invocableActionValidation } from "./invocableActionValidation";
import { set, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { UpdateParameterItemEvent, PropertyChangedEvent } from "builder_platform_interaction/events";
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';
import { mergeInputOutputParameters } from 'builder_platform_interaction/calloutEditorLib';

export const MERGE_WITH_PARAMETERS = 'MERGE_WITH_PARAMETERS';
export const REMOVE_UNSET_PARAMETERS = 'REMOVE_UNSET_PARAMETERS';

const invocableActionPropertyChanged = (state, event) => {
    const error = event.detail.error === null ? invocableActionValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {[event.detail.propertyName]: {value: event.detail.value, error}});
};

const updateParameterItem = (state, event) => {
    const {isInput, rowIndex, value, valueDataType, error} = event.detail;
    const propertyName = isInput ? 'inputParameters' : 'outputParameters';
    const paramIndex = state[propertyName].findIndex(parameter => getValueFromHydratedItem(parameter.rowIndex) === rowIndex);
    const updatedParam = updateProperties(state[propertyName][paramIndex], {value: {value, error}, valueDataType});
    const path = [[propertyName], paramIndex];
    state = set(state, path, updatedParam);
    return state;
};

const mergeWithInputOutputParameters = (state, event) => {
    const inputOutputParameters = event.detail;
    const { inputs, outputs } = mergeInputOutputParameters(inputOutputParameters, state.inputParameters, state.outputParameters);
    state = updateProperties(state, {inputParameters: inputs, outputParameters : outputs});
    return state;
};

const removeUnsetParameters = (state) => {
    const inputParameters = state.inputParameters.filter(inputParameter => !isUndefinedOrNull(getValueFromHydratedItem(inputParameter.value)));
    const outputParameters = state.outputParameters.filter(outputParameter => !isUndefinedOrNull(getValueFromHydratedItem(outputParameter.value)));
    state = updateProperties(state, {inputParameters, outputParameters });
    return state;
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
            return updateParameterItem(state, event);
        case MERGE_WITH_PARAMETERS:
            return mergeWithInputOutputParameters(state, event);
        case REMOVE_UNSET_PARAMETERS:
            return removeUnsetParameters(state);
        case VALIDATE_ALL:
            return invocableActionValidation.validateAll(state);
        default: return state;
    }
};