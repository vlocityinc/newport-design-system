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
export const RULE_TYPES = {
    ASSIGNMENT: 'assignment',
    COMPARISON: 'comparison',
};
// the top level properties in a rule
export const RULE_PROPERTY = {
    RULE_TYPE: 'ruleType',
    LEFT: 'left',
    OPERATOR: 'operator',
    RHS_PARAMS: 'rhsParams',
};
// the inner properties in a rule ( rule.left )
export const RULE_PROPERTY_INFO = {
    PARAM_TYPE: 'paramType',
    PARAM_INDEX: 'paramIndex',
    DATA_TYPE: 'dataType',
    IS_COLLECTION: 'isCollection',
    CAN_BE_FIELD: 'canBeField',
    CAN_BE_SYS_VAR: 'canBeSysVar',
    ELEMENT_TYPE: 'elemType',
};

export const FLOW_DATA_TYPE = {
    CURRENCY: 'Currency',
    DATE: 'Date',
    NUMBER: 'Number',
    STRING: 'String',
    BOOLEAN: 'Boolean',
    SOBJECT: 'SObject',
    DATE_TIME: 'DateTime',
    PICKLIST: 'Picklist',
    MULTI_PICKLIST: 'Multipicklist',
};

export const FLOW_OPERATOR_TYPE = {
    ASSIGNMENT: 'ASSIGNMENT',
    ADD: 'ADD',
};

export const FLOW_ELEMENT_TYPE = {
    STAGE: 'STAGE',
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
