// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';

import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { capitalizeFirstLetter } from 'builder_platform_interaction-data-mutation-lib';

/**
 * @constant state of callback result
 * @type {Object}
 */
const STATE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',
};

/**
 * @constant Panel type  used for modals.
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
 * @constant Tracks instances of created hover panels to help with management.
 * @type {object}
 */
const hoverPanels = {};

// component name used when calling invokePanel
export const PROPERTY_EDITOR = 'builder_platform_interaction:propertyEditor';

export const CRUD = {
    CREATE: 'CREATE',
    READ: 'READ',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
};

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attributes - contains a nodeupadate callback and actual node data
 */
export function invokePanel(cmpName, attributes) {
    let elementType, nodeUpdate, node, descriptorType;

    const titleForModal = capitalizeFirstLetter(attributes.modalTitle);

    if (attributes.modalType === 'CANVAS') {
        elementType = attributes.node.elementType;
        nodeUpdate = attributes.nodeUpdate;
        node = attributes.node;
        descriptorType = getConfigForElementType(elementType).descriptor;

        if (!attributes || !node || !nodeUpdate) {
            throw new Error("attributes passed to invoke panel method are incorrect");
        }
    }

    if (attributes.modalType === 'RESOURCE' && attributes.mode === 'CREATE') {
        descriptorType = 'builder_platform_interaction:resourceEditor';
        elementType = 'VARIABLE';
    }

    const attr = {
        elementType,
        nodeUpdate,
        titleForModal,
        override: {
            body: { descriptor: descriptorType, attr: { node } }
        }
    };

    createComponent(cmpName, attr, (newCmp, status) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig : {
                body: newCmp,
                flavor: getConfigForElementType(attr.elementType).modalSize,
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
