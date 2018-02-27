import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';

export const UPDATE_FLOW = 'UPDATE_FLOW';

export const ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT';
export const UPDATE_CANVAS_ELEMENT = 'UPDATE_CANVAS_ELEMENT';
export const DELETE_CANVAS_ELEMENT = 'DELETE_CANVAS_ELEMENT';

export const ADD_VARIABLE = 'ADD_VARIABLE';
export const UPDATE_VARIABLE = 'UPDATE_VARIABLE';
export const DELETE_VARIABLE = 'DELETE_VARIABLE';

export const UPDATE_PROPERTIES = 'UPDATE_PROPERTIES';

/**
 * Helper function to create actions
 * @param {String} type action type
 * @param {Object} payload data
 * @returns {Object} action new action based on type and payload
 */
export const createAction = (type, payload) => ({type, payload});

/**
 * Action for updating flow information in the store
 * To be used when we get flow metadata from backend or when we create a new flow.
 * @param {Object} payload contains new flow information
 * @returns {Object} action new action based on type and payload
 */
export const updateFlow = (payload) => createAction(UPDATE_FLOW, payload);

/**
 * Action for updating flow properties in the store
 * @param {Object} payload contains new flow information
 * @returns {Object} action new action based on type and payload
 */
export const updateProperties = (payload) => createAction(UPDATE_PROPERTIES, payload);

/**
 * Action for adding a new element in the store
 * @param {Object} payload contains new element value to be added
 * @returns {Object} action new action based on type and payload
 */
export const addElement = (payload) => {
    if (payload) {
        switch (payload.elementType) {
            // For canvas elements
            case ELEMENT_TYPE.ASSIGNMENT: return createAction(ADD_CANVAS_ELEMENT, payload);
            // For variables
            case ELEMENT_TYPE.VARIABLE: return createAction(ADD_VARIABLE, payload);
            default: break;
        }
    }
    return {};
};

/**
 * Action for updating an element in the store
 * @param {Object} payload contains GUID of the element to be updated and new values
 * @returns {Object} action new action based on type and payload
 */
export const updateElement = (payload) => {
    if (payload) {
        switch (payload.elementType) {
            // For canvas elements
            case ELEMENT_TYPE.ASSIGNMENT: return createAction(UPDATE_CANVAS_ELEMENT, payload);
            // For variables
            case ELEMENT_TYPE.VARIABLE: return createAction(UPDATE_VARIABLE, payload);
            default: break;
        }
    }
    return {};
};

/**
 * Action for deleting an element from the store
 * @param {Object} payload contains GUID of the element to be deleted
 * @returns {Object} action new action based on type and payload
 */
export const deleteElement = (payload) => {
    if (payload) {
        switch (payload.elementType) {
            // For canvas elements
            case ELEMENT_TYPE.ASSIGNMENT: return createAction(DELETE_CANVAS_ELEMENT, payload);
            // For variables
            case ELEMENT_TYPE.VARIABLE: return createAction(DELETE_VARIABLE, payload);
            default: break;
        }
    }
    return {};
};
