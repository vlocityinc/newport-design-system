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
const nodeTypeToComponentMap = {
    'Assignment' : {
        descriptor: 'builder_platform_interaction:assignmentEditor'
        // attributes this would most probably just be node object but we still need to decide on it
    },
    'defaultElement' : {
        descriptor: 'builder_platform_interaction:assignmentEditor'
    }
};

/**
 * @param {string} nodeType - String value to choose the actual component from the map,
 *  if empty, default element is chosen
 *  @returns {object} Object containing component descriptor and attributes
 */
export function getComponentDefForNodeType(nodeType) {
    if (nodeType === null || nodeType === undefined) {
        nodeType = ELEMENT_TYPE.DEFAULT;
    }
    return nodeTypeToComponentMap[nodeType];
}

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attr - contains a nodeupadate callback and attr object containing the descriptor and attributes for the inner component of property editor
 */
export function invokePanel(cmpName,  attr) {
    createComponent(cmpName, attr, (newCmp, status) => {
        if (status === STATE.SUCCESS) {
            dispatchGlobalEvent(UI_CREATE_PANEL, {panelType: MODAL, visible: true, panelConfig: {
                body: newCmp
            }
            });
        }
    });
}

