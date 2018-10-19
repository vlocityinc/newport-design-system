import { assignmentValidation } from "./assignmentValidation";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { updateProperties, set, deleteItem } from "builder_platform_interaction/dataMutationLib";
import { EXPRESSION_PROPERTY_TYPE } from "builder_platform_interaction/expressionUtils";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import {
    AddListItemEvent,
    DeleteListItemEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from "builder_platform_interaction/events";

const addAssignmentItem = (state) => {
    // TODO this should come from some assignment item factory like propertyEditorDataMutation that is shared with the translation layer
    const emptyAssignmentItem = {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
        rowIndex: generateGuid(),
    };

    // TODO do validation for if we should not add in case the length is upto certain limit
    const path = ['assignmentItems', state.assignmentItems.length];
    return set(state, path, emptyAssignmentItem);
};

const deleteAssignmentItem = (state, event) => {
    const updatedItems = deleteItem(state.assignmentItems, event.detail.index);
    return set(state, 'assignmentItems', updatedItems);
};

const updateAssignmentItem = (state, event) => {
    const path = ['assignmentItems', event.detail.index];

    const item = updateProperties(state.assignmentItems[event.detail.index], event.detail.value);
    return set(state, path, item);
};

const assignmentPropertyChanged = (state, event) => {
    event.detail.error = event.detail.error === null ?
        assignmentValidation.validateProperty(event.detail.propertyName, event.detail.value) : event.detail.error;
    return updateProperties(state, {
        [event.detail.propertyName]: {error: event.detail.error, value: event.detail.value}
    });
};

/**
 * assignment reducer function runs validation rules and returns back the updated element assignment
 * @param {object} state - element / assignment node
 * @param {object} event - object containing type and payload eg: {type:'xyz', payload: {propertyName: '', value: '' , error: ''}}
 * @returns {object} assignment - updated assignment
 */
export const assignmentReducer = (state, event) => {
    switch (event.type) {
        case AddListItemEvent.EVENT_NAME: {
            return addAssignmentItem(state, event);
        }
        case DeleteListItemEvent.EVENT_NAME: {
            return deleteAssignmentItem(state, event);
        }
        case UpdateListItemEvent.EVENT_NAME: {
            return updateAssignmentItem(state, event);
        }
        case PropertyChangedEvent.EVENT_NAME:
            return assignmentPropertyChanged(state, event);
        case VALIDATE_ALL: {
            return assignmentValidation.validateAll(state);
        }

        default: return state;
    }
};
