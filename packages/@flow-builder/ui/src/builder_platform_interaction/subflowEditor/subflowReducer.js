import { updateProperties } from "builder_platform_interaction/dataMutationLib";
import { subflowValidation } from "./subflowValidation";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { getValueFromHydratedItem, set } from 'builder_platform_interaction/dataMutationLib';
import { UpdateParameterItemEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { mergeSubflowAssignmentsWithInputOutputVariables } from 'builder_platform_interaction/calloutEditorLib';
import { isUndefinedOrNull } from 'builder_platform_interaction/commonUtils';


export const MERGE_WITH_VARIABLES = 'MERGE_WITH_VARIABLES';
export const REMOVE_UNSET_ASSIGNMENTS = 'REMOVE_UNSET_ASSIGNMENTS';

const subflowPropertyChanged = (state, event) => {
    const error = event.detail.error === null ? subflowValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {[event.detail.propertyName]: {error, value: event.detail.value}});
};

const updateParameterItem = (state, event) => {
    // value is null when we unset an assignment
    const {isInput, rowIndex, value, valueDataType, error} = event.detail;
    const propertyName = isInput ? 'inputAssignments' : 'outputAssignments';
    const paramIndex = state[propertyName].findIndex(parameter => getValueFromHydratedItem(parameter.rowIndex) === rowIndex);
    const updatedParam = updateProperties(state[propertyName][paramIndex], {value: {value, error}, valueDataType});
    const path = [[propertyName], paramIndex];
    state = set(state, path, updatedParam);
    return state;
};

const mergeWithInputOutputVariables = (state, event) => {
    const inputOutputVariables = event.detail;
    const { inputs, outputs } = mergeSubflowAssignmentsWithInputOutputVariables(state.inputAssignments, state.outputAssignments, inputOutputVariables);
    state = updateProperties(state, {inputAssignments: inputs, outputAssignments : outputs});
    return state;
};

const removeUnsetAssignments = (state) => {
    const inputAssignments = state.inputAssignments.filter(inputAssignment => !isUndefinedOrNull(getValueFromHydratedItem(inputAssignment.value)));
    const outputAssignments = state.outputAssignments.filter(outputAssignment => !isUndefinedOrNull(getValueFromHydratedItem(outputAssignment.value)));
    state = updateProperties(state, {inputAssignments, outputAssignments });
    return state;
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
            return updateParameterItem(state, event);
        case MERGE_WITH_VARIABLES:
            return mergeWithInputOutputVariables(state, event);
        case REMOVE_UNSET_ASSIGNMENTS:
            return removeUnsetAssignments(state);
        case VALIDATE_ALL:
            return subflowValidation.validateAll(state);
        default: return state;
    }
};