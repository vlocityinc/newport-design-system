// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { STATE, ELEMENT_TYPE } from 'builder_platform_interaction-constant';

/**
 * @constant
 * @type {string}
 */
const MODAL = 'modal';

/**
 * @constant
 * @type {string}
 */
const UI_CREATE_PANEL = 'ui:createPanel';

/**
 * @constant nodeTypeToComponentMap - Map of different element types to their respective components
 * @type {object}
 */
const elementTypeToConfigMap = {
    [ELEMENT_TYPE.ASSIGNMENT] : {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        }
    },
    [ELEMENT_TYPE.DEFAULT] : {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        }
    }
};

/**
 * @param {string} nodeType - String value to choose the actual component from the map,
 *  if empty, default element is chosen
 *  @param {string} config - String value to choose the specific config for the given element type
 *  @returns {object} Object containing component config
 */
export function getConfigForElementType(nodeType, config) {
    if (nodeType === null || nodeType === undefined) {
        nodeType = ELEMENT_TYPE.DEFAULT;
    }
    return elementTypeToConfigMap[nodeType][config];
}

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attr - contains a nodeupadate callback and attr object containing the descriptor and attributes for the inner component of property editor
 */
export function invokePanel(cmpName,  attr) {
    createComponent(cmpName, attr, (newCmp, status) => {
        if (status === STATE.SUCCESS) {
            dispatchGlobalEvent(UI_CREATE_PANEL, {
                panelType: MODAL,
                visible: true,
                panelConfig: {
                    body: newCmp,
                    bodyClass: "" // to remove the extra default padding class
                    // TODO: set footer and header component here
                }
            });
        }
    });
}

