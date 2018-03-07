// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { STATE, ELEMENT_TYPE } from 'builder_platform_interaction-constant';
import { hydrateWithErrors } from 'builder_platform_interaction-data-mutation-lib';

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
 * @type {string} MODAL_SIZE large or medium (default)
 */
const MODAL_SIZE = {
    LARGE: 'large', // To be used by screen and decision elementType
    MEDIUM: 'medium'
};

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
        modalSize: MODAL_SIZE.MEDIUM,
        nodeConfig: {
            iconName: 'standard:lead_list',
            maxConnections: 1
        }
    },
    [ELEMENT_TYPE.DEFAULT] : {
        descriptor: 'builder_platform_interaction:assignmentEditor',
        modalSize: MODAL_SIZE.MEDIUM,
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
 * @param {object} attributes - contains a nodeupadate callback and actual node data
 */
export function invokePanel(cmpName, attributes) {
    if (!attributes || !attributes.node || !attributes.nodeUpdate) {
        throw new Error("attributes passed to invoke panel method are incorrect");
    }
    const elementType = attributes.node.elementType;
    const nodeUpdate = attributes.nodeUpdate;
    const attr = {
        elementType,
        nodeUpdate,
        override: {
            body: {
                descriptor: getConfigForElementType(elementType, 'descriptor'),
                attr: {
                    node: hydrateWithErrors(attributes.node)
                }
            }
        }
    };

    createComponent(cmpName, attr, (newCmp, status) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig : {
                body: newCmp,
                flavor: this.getConfigForElementType(attr.elementType, 'modalSize'),
                bodyClass: ''// to remove the extra default padding class
                // TODO: set footer and header component here
            }
        };
        if (status === STATE.SUCCESS) {
            dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
        }
    });
}

/**
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
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
 * NOTE: Please do not use this without contacting Process UI DesignTime first!
 *
 * Hides the popover/hoverPanel with the given hoverId.
 *
 * @param {string} hoverId Identifier of the popover to hide
 */
export function hideHover(hoverId) {
    const hoverPanel = hoverPanels[hoverId];
    if (hoverPanel) {
        hoverPanel.requestClose();
    }
}
