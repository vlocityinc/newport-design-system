import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';

/**
 * @constant
 * @type {string} MODAL_SIZE large or medium (default)
 */
const MODAL_SIZE = {
    LARGE: 'large', // To be used by screen and decision elementType
    MEDIUM: 'medium'
};

export const ELEMENT_TYPE = {
    ACTION_CALL: 'ACTION_CALL',
    ASSIGNMENT: 'ASSIGNMENT',
    VARIABLE: 'VARIABLE',
    DECISION: 'DECISION',
    APEX_PLUGIN_CALL: 'APEX_PLUGIN_CALLS',
    CHOICE: 'CHOICE',
    CONSTANT: 'CONSTANT',
    DYNAMIC_CHOICE_SET: 'DYNAMIC_CHOICE_SET',
    FORMULA: 'FORMULA',
    STAGE: 'STAGE',
    TEXT_TEMPLATE: 'TEXT_TEMPLATE',
    LOOP: 'LOOP',
    OUTCOME: 'OUTCOME',
    RECORD_CREATE: 'RECORD_CREATE',
    RECORD_DELETE: 'RECORD_DELETE',
    RECORD_LOOKUP: 'RECORD_LOOKUP',
    RECORD_UPDATE: 'RECORD_UPDATE',
    SCREEN: 'SCREEN',
    STEP: 'STEP',
    SUBFLOW: 'SUBFLOW',
    WAIT: 'WAIT',
    DEFAULT: 'defaultElement'
};

/**
 * @constant elementTypeToComponentMap - Map of different element types to their
 *                                       respective components
 * @type {object}
 */
export const elementTypeToConfigMap = {
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: 'builder_platform_interaction:actioncallEditor', // TODO: We probably need some function here to
        // determine the descriptor based on action type
        nodeConfig: {
            iconName: 'standard:investment_account',
            maxConnections: 1
        },
        propertyEditorFields: [
            'guid',
            'elementType',
            'label',
            'name',
            'description'
        ],
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'actionCalls',
        canvasElement: true,
        template: {
            config: { isSelected: false },
            connectorCount: 0,
            elementType: ELEMENT_TYPE.ACTION_CALL,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        descriptor: 'builder_platform_interaction:actioncallEditor', // TODO: We probably need some function here to
        // determine the descriptor based on action type
        nodeConfig: {
            iconName: 'standard:product_item_transaction',
            maxConnections: 1
        },
        propertyEditorFields: [
            'guid',
            'elementType',
            'label',
            'name',
            'description'
        ],
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'apexPluginCalls',
        canvasElement: true,
        template: {
            config: { isSelected: false },
            connectorCount: 0,
            elementType: ELEMENT_TYPE.APEX_PLUGIN_CALL,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.ASSIGNMENT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'assignments',
        canvasElement: true,
        template: {
            assignmentItems: [
                {
                    assignToReference: '',
                    operator: '',
                    value: {
                        stringValue: ''
                    }
                }
            ],
            config: { isSelected: false },
            connectorCount: 0,
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            guid: '',
            isCanvasElement: true,
            label: '',
            locationX: 0,
            locationY: 0,
            name: ''
        }
    },
    [ELEMENT_TYPE.DECISION]: {
        descriptor: 'builder_platform_interaction:decisionEditor',
        nodeConfig: {
            iconName: 'standard:feed',
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: 'decisions',
        canvasElement: true
    },
    [ELEMENT_TYPE.VARIABLE]: {
        descriptor: 'builder_platform_interaction:variableEditor',
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'variables',
        canvasElement: false
    },
    [ELEMENT_TYPE.DEFAULT]: {
        // defaultEditor doesn't exist but should lead here making it easier to debug the issue
        descriptor: 'builder_platform_interaction:defaultEditor',
        nodeConfig: {
            iconName: 'standard:custom',
            maxConnections: 1
        }
    }
};

/**
 * @param {string}
 *            elementType - String value to choose the actual component from the
 *            map, if empty, default element is chosen
 * @returns {object} Object containing component config
 */
export function getConfigForElementType(elementType) {
    if (
        elementType === null ||
        elementType === undefined ||
        !elementTypeToConfigMap[elementType]
    ) {
        elementType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[elementType];
}

/**
 * Checks if the given element type is an element that is visible on the canvas.
 *
 * @param {String}
 *            elementType one of the values defined in ELEMENT_TYPE
 * @returns {boolean} true if the given element type is a canvas element
 */
export function isCanvasElement(elementType) {
    return !!getConfigForElementType(elementType).canvasElement;
}

/**
 * Gets an empty instance of the given element type.
 *
 * @param {String}
 *            elementType an element type such as 'ASSIGNMENT'
 * @returns {Object} an empty element of the given elementType
 */
export function createFlowElement(elementType) {
    const config = elementTypeToConfigMap[elementType];
    if (!config) {
        throw new TypeError();
    } else if (!config.template) {
        throw new Error('Template not defined for given element type');
    }
    const template = deepCopy(config.template);
    template.guid = generateGuid(elementType);
    template.maxConnections = config.nodeConfig.maxConnections;
    return template;
}