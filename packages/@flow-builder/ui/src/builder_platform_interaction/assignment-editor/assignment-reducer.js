import { assignmentValidation } from './assignment-validation';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { updateProperties, set, deleteItem } from 'builder_platform_interaction-data-mutation-lib';

import {
    AddListItemEvent,
    DeleteListItemEvent,
    UpdateListItemEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction-events';

const addAssignmentItem = (state) => {
    // TODO this should come from some assignment item factory like propertyEditorDataMutation that is shared with the translation layer
    const emptyAssignmentItem = {rowIndex: generateGuid(SUB_ELEMENT_TYPE.ASSIGNMENT_ITEM) };

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
    const path = `assignmentItems[${event.detail.index}].${event.detail.propertyName}`;

    // TODO check for errors and handle validation accordingly
    const item = {value: event.detail.value, error: event.detail.error};
    return set(state, path, item);
};

const assignmentPropertyChanged = (state, event) => {
    event.error = event.error === null ? assignmentValidation.validateProperty(event.propertyName, event.value) : event.error;
    return updateProperties(state, {[event.propertyName]: {error: event.error, value: event.value}});
};

/**
 * assignment reducer function runs validation rules and returns back the updated element assignment
 * @param {object} state - element / assignment node
 * @param {object} event - object containing type and payload eg: {type:"xyz", payload: {propertyName: '', value: '' , error: ''}}
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

        default: return state;
    }
};
