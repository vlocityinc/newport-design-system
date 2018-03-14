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
 * @constant elementTypeToComponentMap - Map of different element types to their
 *                                       respective components
 * @type {object}
 */
export const elementTypeToConfigMap = {
    [ELEMENT_TYPE.ACTION_CALL]: {
        descriptor: '', // TODO: We probably need some function here to
        // determine the descriptor based on action type
        nodeConfig: {
            iconName: 'standard:custom',
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
        modalSize: MODAL_SIZE.MEDIUM,
        metadataKey: 'assignments',
        canvasElement: true
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
        propertyEditorFields: [],
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
 * @param {string}
 *            config - String value to choose the specific config for the given
 *            element type
 * @returns {object} Object containing component config
 */
export function getConfigForElementType(elementType, config) {
    if (
        elementType === null ||
        elementType === undefined ||
        !elementTypeToConfigMap[elementType]
    ) {
        elementType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[elementType][config];
}

export function isCanvasElement(elementType) {
    return !!getConfigForElementType(elementType, 'canvasElement');
}
