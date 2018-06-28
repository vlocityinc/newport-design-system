import { assignmentValidation } from './assignment-validation';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { updateProperties, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-expression-utils';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import {
    AddListItemEvent,
    DeleteListItemEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';

const addAssignmentItem = (state) => {
    // TODO this should come from some assignment item factory like propertyEditorDataMutation that is shared with the translation layer
    const emptyAssignmentItem = {
        [EXPRESSION_PROPERTY_TYPE.LEFT_HAND_SIDE]: { value: '', error: null },
        [EXPRESSION_PROPERTY_TYPE.OPERATOR]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_DATA_TYPE]: { value: '', error: null},
        [EXPRESSION_PROPERTY_TYPE.RIGHT_HAND_SIDE_GUID]: { value: '', error: null},
        rowIndex: generateGuid(SUB_ELEMENT_TYPE.ASSIGNMENT_ITEM),
    };

    // TODO do validation for if we should not add in case the length is upto certain limit
    const path = ['assignmentItems', state.assignmentItems.length];
    return set(state, path, emptyAssignmentItem);
};

const deleteAssignmentItem = (state, event) => {
    // TODO do validation for if we need at least one row
    const updatedItems = deleteItem(state.assignmentItems, event.detail.index);
    return set(state, 'assignmentItems', updatedItems);
};

const updateAssignmentItem = (state, event) => {
    const path = ['assignmentItems', event.detail.index];

    // TODO check for errors and handle validation accordingly
    const item = updateProperties(event.detail.value);
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
