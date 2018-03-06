// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { STATE, ELEMENT_TYPE } from 'builder_platform_interaction-constant';

/**
 * @constant Panel type used for modals.
 * @type {string}
 */
const MODAL = 'modal';

/**
 * @constant Panel type used for popovers.
 * @type {string}
 */
const HOVER_PANEL = 'hoverPanel';

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
            iconName: 'standard:custom',
            maxConnections: 1
        }
    }
};

/**
 * @constant Tracks instances of created hover panels to help with management.
 * @type {object}
 */
const hoverPanels = {};

/**
 * @param {string} nodeType - String value to choose the actual component from the map,
 *  if empty, default element is chosen
 *  @param {string} config - String value to choose the specific config for the given element type
 *  @returns {object} Object containing component config
 */
export function getConfigForElementType(nodeType, config) {
    if (nodeType === null ||
        nodeType === undefined ||
        !elementTypeToConfigMap[nodeType]) {
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

/**
 * Shows a popover/hoverPanel.
 *
 * Sample panelConfig for the left-panel hover:
 * {
 *     flavor: 'default',
 *     'class': 'slds-popover_medium',
 *     referenceElement: event.target,
 *     enableAutoPlacement: false,
 *     direction: 'east',
 *     showCloseButton: false,
 *     showPointer: true,
 *     autoFocus: false,
 *     closeOnClickOut: true,
 *     enableFocusHoverPanelEventHandler: false
 * }
 *
 * @param {string} cmpName Name of the component to be created for the popover body
 * @param {object} attr Attributes values to use when creating an instance of cmpName
 * @param {string} hoverId Identifier to use for the popover
 * @param {object} panelConfig Attributes to use for the ui:createPanel event
 */
export function showHover(cmpName, attr, hoverId, panelConfig) {
    createComponent(cmpName, attr, (newCmp, status) => {
        if (status === STATE.SUCCESS) {
            panelConfig.body = newCmp;

            const config = {
                panelType: HOVER_PANEL,
                visible: true,
                panelConfig,
                onCreate: (hoverPanel) => {
                    if (hoverPanel.isValid()) {
                        hoverPanels[hoverId] = hoverPanel;
                    }
                },
                onDestroy: () => {
                    delete hoverPanels[hoverId];
                }
            };
            dispatchGlobalEvent(UI_CREATE_PANEL, config);
        }
    });
}

/**
 * Hides the popover/hoverPanel with the given hoverId.
 * @param {string} hoverId Identifier of the popover to hide
 */
export function hideHover(hoverId) {
    const hoverPanel = hoverPanels[hoverId];
    if (hoverPanel) {
        hoverPanel.requestClose();
    }
}
