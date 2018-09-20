import { isCanvasElement } from "builder_platform_interaction/elementConfig";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

export const UPDATE_FLOW = 'UPDATE_FLOW';

export const UPDATE_PROPERTIES = 'UPDATE_PROPERTIES';

export const ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT';
export const UPDATE_CANVAS_ELEMENT = 'UPDATE_CANVAS_ELEMENT';

export const DELETE_ELEMENT = 'DELETE_ELEMENT';

export const ADD_RESOURCE = 'ADD_RESOURCE';
export const UPDATE_VARIABLE_CONSTANT = 'UPDATE_VARIABLE_CONSTANT';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';

export const ADD_CONNECTOR = 'ADD_CONNECTOR';

export const SELECT_ON_CANVAS = 'SELECT_ON_CANVAS';
export const TOGGLE_ON_CANVAS = 'TOGGLE_ON_CANVAS';
export const DESELECT_ON_CANVAS = 'DESELECT_ON_CANVAS';

export const ADD_DECISION_WITH_OUTCOMES = 'ADD_DECISION_WITH_OUTCOMES';
export const MODIFY_DECISION_WITH_OUTCOMES = 'MODIFY_DECISION_WITH_OUTCOMES';

export const UPDATE_RECORD_LOOKUP = 'UPDATE_RECORD_LOOKUP';

export const PROPERTY_EDITOR_ACTION = {
    UPDATE_ELEMENT_PROPERTY : 'UPDATE_ELEMENT_PROPERTY',
    ADD_ASSIGNMENT_ITEM: 'ADD_ASSIGNMENT_ITEM',
    DELETE_ASSIGNMENT_ITEM: 'DELETE_ASSIGNMENT_ITEM',
    UPDATE_ASSIGNMENT_ITEM: 'UPDATE_ASSIGNMENT_ITEM',
    CHANGE_ACTION_TYPE: 'CHANGE_ACTION_TYPE',
    ADD_DECISION_OUTCOME: 'ADD_DECISION_OUTCOME',
    ADD_WAIT_EVENT: 'ADD_WAIT_EVENT',
    CHANGE_DATA_TYPE: 'CHANGE_DATA_TYPE',
    UPDATE_ELEMENT_VALUE : 'UPDATE_ELEMENT_VALUE'
};

/**
 * Helper function to create actions.
 *
 * @param {String} type - action type
 * @param {Object} payload - data
 * @returns {Object} action new action based on type and payload
 */
export const createAction = (type, payload = {}) => ({type, payload});

/**
 * Action for updating flow information in the store.
 * To be used when we get flow metadata from backend or when we create a new flow.
 *
 * @param {Object} payload - contains new flow information
 * @returns {Object} action new action based on type and payload
 */
export const updateFlow = (payload) => createAction(UPDATE_FLOW, payload);

/**
 * Action for updating flow properties in the store.
 *
 * @param {Object} payload - contains new flow information
 * @returns {Object} action new action based on type and payload
 */
export const updateProperties = (payload) => createAction(UPDATE_PROPERTIES, payload);

/**
 * Action for adding a new element in the store.
 *
 * @param {Object} payload - contains new element value to be added
 * @returns {Object} action new action based on type and payload
 */
export const addElement = (payload) => {
    if (payload) {
        switch (payload.elementType) {
            case ELEMENT_TYPE.VARIABLE:
            case ELEMENT_TYPE.CONSTANT:
            case ELEMENT_TYPE.FORMULA:
            case ELEMENT_TYPE.TEXT_TEMPLATE:
            case ELEMENT_TYPE.STAGE:
                return createAction(ADD_RESOURCE, payload);
            case ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES:
                return createAction(ADD_DECISION_WITH_OUTCOMES, payload);
            default:
                if (isCanvasElement(payload.elementType)) {
                    return createAction(ADD_CANVAS_ELEMENT, payload);
                }

                // Added to support strategy builder non-canvas elements
                return createAction(ADD_RESOURCE, payload);
        }
    }
    return {};
};

/**
 * Action for updating an element in the store.
 *
 * For variables & constants, all existing data for the element in the store will be overwritten
 *
 * @param {Object} payload - contains GUID of the element to be updated and new values
 * @returns {Object} action new action based on type and payload
 */
export const updateElement = (payload) => {
    if (payload) {
        switch (payload.elementType) {
            case ELEMENT_TYPE.VARIABLE:
            case ELEMENT_TYPE.CONSTANT:
                return createAction(UPDATE_VARIABLE_CONSTANT, payload);
            case ELEMENT_TYPE.TEXT_TEMPLATE:
            case ELEMENT_TYPE.FORMULA:
            case ELEMENT_TYPE.STAGE:
                return createAction(UPDATE_RESOURCE, payload);
            case ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES:
                return createAction(MODIFY_DECISION_WITH_OUTCOMES, payload);
            case ELEMENT_TYPE.RECORD_LOOKUP:
                return createAction(UPDATE_RECORD_LOOKUP, payload);
            default:
                if (isCanvasElement(payload.elementType)) {
                    return createAction(UPDATE_CANVAS_ELEMENT, payload);
                }

                // Added to support strategy builder non-canvas elements
                return createAction(UPDATE_RESOURCE, payload);
        }
    }
    return {};
};

/**
 * Action for deleting an element from the store.
 *
 * @param {Object} payload - contains GUID of the element to be deleted
 * @returns {Object} action new action based on type and payload
 */
export const deleteElement = (payload) => {
    if (!payload) {
        return {};
    }

    let action = createAction(DELETE_ELEMENT, payload);
    switch (payload.elementType) {
        case ELEMENT_TYPE.VARIABLE:
        case ELEMENT_TYPE.CONSTANT:
        case ELEMENT_TYPE.TEXT_TEMPLATE:
        case ELEMENT_TYPE.STAGE:
        case ELEMENT_TYPE.FORMULA: {
            action = createAction(DELETE_RESOURCE, payload);
            break;
        }
        default:
            if (isCanvasElement(payload.elementType)) {
                action = createAction(DELETE_ELEMENT, payload);
            } else {
                // Added to support strategy builder non-canvas elements
                action = createAction(DELETE_RESOURCE, payload);
            }
    }

    return action;
};

/**
 * Action for adding a new connector to the store.
 *
 * @param {Object} payload - contains connectorGUID, source, target, connector label and config
 * @returns {Object} action new action based on type and payload
 */
export const addConnector = (payload) => createAction(ADD_CONNECTOR, payload);

/**
 * Action for selecting a canvas element or connector.
 *
 * @param {Object} payload - contains GUID of the element to be selected
 * @returns {Object} action new action based on type and payload
 */
export const selectOnCanvas = (payload) => createAction(SELECT_ON_CANVAS, payload);

/**
 * Action for toggling the isSelected property of a canvas element or connector.
 *
 * @param {Object} payload - contains GUID of the element to be toggled
 * @returns {Object} action new action based on type and payload
 */
export const toggleOnCanvas = (payload) => createAction(TOGGLE_ON_CANVAS, payload);

/**
 * Action for deselecting all the selected canvas elements and connectors.
 *
 * @returns {Object} action new action based on type and payload
 */
export const deselectOnCanvas = () => createAction(DESELECT_ON_CANVAS);
