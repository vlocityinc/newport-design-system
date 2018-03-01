export const STATE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};
export const EVENT = {
    CANVAS_MOUSEUP: 'canvasmouseup',
    DRAG_STOP: 'dragnodestop',
    NODE_SELECTED: 'nodeselected',
    CONNECTOR_SELECTED: 'connectorselected',
    NODE_DBLCLICKED: 'nodedblclicked',
    NODE_DELETE: 'nodedelete',
    SAVE_FLOW: 'saveflow',
    SAVE: 'save',
    ADD_CONNECTION: 'addconnection',
};
export const ELEMENT_TYPE = {
    ACTION_CALL: 'ACTION_CALL',
    ASSIGNMENT: 'ASSIGNMENT',
    VARIABLE: 'VARIABLE',
    DECISION: 'DECISION',
    DEFAULT: 'defaultElement'
};
export const EXPRESSION_PROPERTY_TYPE = {
    LEFT_HAND_SIDE: 'leftHandSide',
    RIGHT_HAND_SIDE: 'rightHandSide',
    OPERATOR: 'operator'
};

export const COMBOBOX_ITEM_DISPLAY_TYPE = {
    OPTION_CARD: 'option-card',
    OPTION_INLINE: 'option-inline'
};
export const PROPERTY_EDITOR = 'builder_platform_interaction:propertyEditor';

export const CONNECTOR_OVERLAY = {
    ARROW: '__arrow',
    LABEL: '__label'
};

export const PROPERTY_EDITOR_ACTION = {
    UPDATE_ELEMENT_PROPERTY : 'UPDATE_ELEMENT_PROPERTY',
    ADD_LIST_ITEM : 'ADD_LIST_ITEM',
    UPDATE_LIST_ITEM : 'UPDATE_LIST_ITEM',
    DELETE_LIST_ITEM : 'DELETE_LIST_ITEM'
};
