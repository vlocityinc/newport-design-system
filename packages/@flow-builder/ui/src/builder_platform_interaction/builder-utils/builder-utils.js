// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';
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
 * @param {string} cmpName component name descriptor
 * @param {object} attr attributes for the component
 * @returns {Promise} which resolves with a successful component creation or rejects with an errorMessage
 */
const createComponentPromise = (cmpName, attr) => {
    return new Promise((resolve, reject) => {
        createComponent(cmpName, attr, (newCmp, status, errorMessage) => {
            if (status === STATE.SUCCESS) {
                resolve(newCmp);
            } else if (status === "ERROR") {
                reject(errorMessage);
            }
        });
    });
};

/**
 * TODO: i18n after W-4693112
 * @param {string} mode based on whether the event is for adding a new element or editing
 * @param {string} elementType eg: Assignment, Decision, etc
 * @returns {string} title for the modal
 */
const getTitleForModalHeader = (mode, elementType) => {
    let titlePrefix;
    if (mode === "editelement") {
        titlePrefix = "Edit";
    } else if (mode === "addelelement") {
        titlePrefix = "New";
    }

    if (!getConfigForElementType(elementType) || !getConfigForElementType(elementType).labels) {
        throw new Error("label is not defined in the element config for the element type: " + elementType);
    }
    const label = getConfigForElementType(elementType).labels.singular;
    return titlePrefix + " " + label;
};

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attributes - contains a nodeupadate callback and actual node data
 */
export function invokePanel(cmpName, attributes) {
    if (!attributes || !attributes.node ||  !attributes.nodeUpdate) {
        throw new Error("attributes passed to invoke panel method are incorrect");
    }

    const mode = attributes.mode;
    const elementType = attributes.node.elementType;
    const nodeUpdate = attributes.nodeUpdate;
    const node = attributes.node;

    const titleForModal = getTitleForModalHeader(mode, elementType);
    const descriptor = getConfigForElementType(elementType).descriptor;

    /**
     * New Resource Work TODO: W-4844731
     * The following will not work and should be removed as part of the above work item.
     * Instead of relying on modalType and mode, one can either pass mode as event.type which will be exclusive in add resource or call a different function altogether (instead of invokePanel)
     */
    //    if (attributes.modalType === 'RESOURCE' && attributes.mode === 'CREATE') {
    //        descriptorType = 'builder_platform_interaction:resourceEditor';
    //        elementType = 'VARIABLE';
    //    }

    const attr = {
        elementType,
        nodeUpdate,
        override: {
            body: {
                descriptor,
                attr: {
                    node
                }
            }
        }
    };

    const propertyEditorBodyPromise = createComponentPromise(cmpName, attr);
    const propertyEditorHeaderPromise = createComponentPromise("builder_platform_interaction:propertyEditorHeader", {titleForModal});
    const propertyEditorFooterPromise = createComponentPromise("builder_platform_interaction:propertyEditorFooter");
    Promise.all([propertyEditorBodyPromise, propertyEditorHeaderPromise, propertyEditorFooterPromise]).then((newComponents) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig : {
                body: newComponents[0],
                flavor: getConfigForElementType(elementType).modalSize,
                bodyClass: getConfigForElementType(elementType).bodyCssClass,
                header: newComponents[1],
                footer: newComponents[2],
            }
        };
        dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
    }).catch(errorMessage => {
        throw new Error("UI panel creation failed: " + errorMessage);
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
