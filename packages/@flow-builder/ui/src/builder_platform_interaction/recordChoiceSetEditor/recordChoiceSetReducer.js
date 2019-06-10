import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import {
    recordChoiceSetValidation,
    getRules
} from './recordChoiceSetValidation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import {
    set,
    deleteItem,
    hydrateWithErrors
} from 'builder_platform_interaction/dataMutationLib';
import {
    createFilter,
    createOutputAssignment
} from 'builder_platform_interaction/elementFactory';
import { RECORD_FILTER_CRITERIA } from 'builder_platform_interaction/recordEditorLib';
import {
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';

const addRecordFilter = recordChoice => {
    const path = ['filters', recordChoice.filters.length];
    return set(
        recordChoice,
        path,
        hydrateWithErrors(
            createFilter(
                { rightHandSideDataType: '' },
                recordChoice.object.value
            )
        )
    );
};
const updateRecordFilter = (recordChoice, action) => {
    const path = ['filters', action.payload.index];
    const item = Object.assign(
        {},
        recordChoice.filters[action.payload.index],
        action.payload.value
    );
    return set(recordChoice, path, item);
};
const deleteRecordFilter = (recordChoice, action) => {
    const updatedFiltersList = deleteItem(
        recordChoice.filters,
        action.payload.index
    );
    return set(recordChoice, 'filters', updatedFiltersList);
};

const addRecordRecordFieldAssignment = recordChoice => {
    const path = ['outputAssignments', recordChoice.outputAssignments.length];
    return set(recordChoice, path, hydrateWithErrors(createOutputAssignment()));
};

const deleteRecordRecordFieldAssignment = (recordChoice, action) => {
    const updatedItems = deleteItem(
        recordChoice.outputAssignments,
        action.payload.index
    );
    return set(recordChoice, 'outputAssignments', updatedItems);
};

const updateRecordRecordFieldAssignment = (recordChoice, action) => {
    const path = ['outputAssignments', action.payload.index];
    const item = Object.assign(
        {},
        recordChoice.outputAssignments[action.payload.index],
        action.payload.value
    );
    return set(recordChoice, path, item);
};

const addEmptyOutputAssignment = recordChoice => {
    return Object.assign({}, recordChoice, {
        outputAssignments: [hydrateWithErrors(createOutputAssignment())]
    });
};

const updateOutputAssignmentsBeforeClose = recordChoice => {
    // Filtering out the valid outputAssignments, i.e. the ones that have both LHS and RHS
    const updatedItems = recordChoice.outputAssignments.filter(
        outputAssignment => {
            return (
                outputAssignment.leftHandSide.value &&
                outputAssignment.rightHandSide.value &&
                outputAssignment
            );
        }
    );

    return set(recordChoice, 'outputAssignments', updatedItems);
};

const manageUpdateProperty = (recordChoice, action) => {
    // Handle object property change
    if (action.payload.propertyName === 'object') {
        recordChoice = addEmptyOutputAssignment(recordChoice);
    }

    // Handle filterType property
    if (action.payload.propertyName === 'filterType') {
        if (action.payload.value === RECORD_FILTER_CRITERIA.NONE) {
            recordChoice = Object.assign({}, recordChoice, { filters: [] });
        } else if (
            action.payload.value === RECORD_FILTER_CRITERIA.ALL &&
            recordChoice.filters.length === 0
        ) {
            recordChoice = addRecordFilter(recordChoice, action);
        }
    }

    // Validate
    if (!action.payload.doValidateProperty) {
        action.payload.error = null;
    } else {
        action.payload.error =
            action.payload.error === null
                ? recordChoiceSetValidation.validateProperty(
                      action.payload.propertyName,
                      action.payload.value
                  )
                : action.payload.error;
    }

    return Object.assign({}, recordChoice, {
        [action.payload.propertyName]: {
            error: action.payload.error,
            value: action.payload.value
        }
    });
};

export const recordChoiceSetReducer = (recordChoice, action) => {
    switch (action.type) {
        case PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY:
            return manageUpdateProperty(recordChoice, action);
        case PROPERTY_EDITOR_ACTION.ADD_FILTER_ITEM:
            return addRecordFilter(recordChoice, action);
        case PROPERTY_EDITOR_ACTION.UPDATE_FILTER_ITEM:
            return updateRecordFilter(recordChoice, action);
        case PROPERTY_EDITOR_ACTION.DELETE_FILTER_ITEM:
            return deleteRecordFilter(recordChoice, action);
        case AddRecordFieldAssignmentEvent.EVENT_NAME:
            return addRecordRecordFieldAssignment(recordChoice);
        case DeleteRecordFieldAssignmentEvent.EVENT_NAME:
            return deleteRecordRecordFieldAssignment(recordChoice, action);
        case UpdateRecordFieldAssignmentEvent.EVENT_NAME:
            return updateRecordRecordFieldAssignment(recordChoice, action);
        case PROPERTY_EDITOR_ACTION.ADD_EMPTY_OUTPUT_ASSIGNMENT:
            return addEmptyOutputAssignment(recordChoice);
        case PROPERTY_EDITOR_ACTION.UPDATE_OUTPUT_ASSIGNMENTS_BEFORE_CLOSE:
            return updateOutputAssignmentsBeforeClose(recordChoice);
        case VALIDATE_ALL:
            return recordChoiceSetValidation.validateAll(
                recordChoice,
                getRules(recordChoice, action.showSecondSection)
            );
        default:
            return recordChoice;
    }
};
