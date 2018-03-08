import { ELEMENT_TYPE } from 'builder_platform_interaction-constant';

/**
 * @constant
 * @type {string} MODAL_SIZE large or medium (default)
 */
const MODAL_SIZE = {
    LARGE: 'large', // To be used by screen and decision elementType
    MEDIUM: 'medium'
};

/**
 * @constant nodeTypeToComponentMap - Map of different element types to their
 *           respective components
 * @type {object}
 */
export const elementTypeToConfigMap = {
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: '', // TODO: We probably need some function here to
        // determine the descriptor based on action type
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        },
        modalSize: MODAL_SIZE.MEDIUM,
        propertyEditorFields: [],
        metadataKey: 'actionCalls',
        canvasElement: true
    },
    [ELEMENT_TYPE.ASSIGNMENT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        },
        propertyEditorFields: [
            'guid',
            'elementType',
            'label',
            'name',
            'description',
            'assignmentItems'
        ],
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'assignments',
        canvasElement: true
    },
    [ELEMENT_TYPE.DECISION]: {
        descriptor: 'builder_platform_interaction:decisionEditor',
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        },
        propertyEditorFields: [],
        modalSize: MODAL_SIZE.LARGE,
        metadataKey: 'decisions',
        canvasElement: true
    },
    [ELEMENT_TYPE.VARIABLE]: {
        descriptor: 'builder_platform_interaction:variableEditor',
        propertyEditorFields: [],
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'variables',
        canvasElement: false
    },
    [ELEMENT_TYPE.DEFAULT]: {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:custom',
            maxConnections: 1
        }
    }
};

/**
 * @param {string}
 *            nodeType - String value to choose the actual component from the
 *            map, if empty, default element is chosen
 * @param {string}
 *            config - String value to choose the specific config for the given
 *            element type
 * @returns {object} Object containing component config
 */
export function getConfigForElementType(nodeType, config) {
    if (
        nodeType === null ||
        nodeType === undefined ||
        !elementTypeToConfigMap[nodeType]
    ) {
        nodeType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[nodeType][config];
}
