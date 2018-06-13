// eslint-disable-next-line lwc/no-compat-create, lwc/no-compat-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { getConfigForElementType, MODAL_SIZE } from 'builder_platform_interaction-element-config';
import { AddElementEvent, EditElementEvent, NewResourceEvent, CANVAS_EVENT } from 'builder_platform_interaction-events';
import { LABELS } from './builder-utils-labels';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

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
            } else if (status === STATE.ERROR) {
                reject(errorMessage);
            }
        });
    });
};

/**
 * @param {string} mode based on the event type
 * @param {string} elementType eg: Assignment, Decision, etc
 * @returns {string} title for the modal
 */
const getTitleForModalHeader = (mode, elementType) => {
    const elementConfig = getConfigForElementType(elementType);
    if (!elementConfig || !elementConfig.labels) {
        throw new Error("label is not defined in the element config for the element type: " + elementType);
    }

    let titlePrefix = '',
        label;

    if (mode === EditElementEvent.EVENT_NAME) {
        titlePrefix = LABELS.existingElementHeaderPrefix;
    } else if (mode === AddElementEvent.EVENT_NAME) {
        titlePrefix = LABELS.newElementHeaderPrefix;
    } else if (mode === CANVAS_EVENT.ADD_CONNECTION) {
        if (elementType === ELEMENT_TYPE.LOOP) {
            titlePrefix = LABELS.loopConnectorPickerHeaderPrefix;
        } else {
            titlePrefix = LABELS.connectorPickerHeaderPrefix;
        }
    }

    if (mode === CANVAS_EVENT.ADD_CONNECTION) {
        label = elementConfig.labels.connectorPickerHeaderSuffix;
    } else {
        label = elementConfig.labels.singular;
    }

    return titlePrefix + ' ' + label;
};

let newResourceConfig;

const getNewResourceConfig = (attributes) => {
    if (newResourceConfig) {
        return newResourceConfig;
    }
    const nodeUpdate = attributes.nodeUpdate;
    const descriptor = 'builder_platform_interaction-resource-editor';
    const titleForModal = 'New Resource';

    const attr = {
        nodeUpdate,
        override: {
            descriptor,
            attr: {
                node: {},
            },
        },
    };

    const panelConfig = {
        titleForModal,
        flavor: MODAL_SIZE.MEDIUM,
        bodyClass: undefined,
    };

    newResourceConfig = {
        attr,
        panelConfig,
    };
    return newResourceConfig;
};

/**
 * Callback that executes just before closing any property editor modal
 * @param {Object} panel : panel Instance of status icon
 */
const closeActionCallback = (panel) => {
    const panelFooter = panel.get('v.footer')[0];
    const statusIconCmp = panelFooter.find('statusIcon');
    if (statusIconCmp && statusIconCmp.getPanelInstance()) {
        statusIconCmp.closePanelInstance();
    }
    panel.close();
};

/**
 * Gets the connector picker config
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @return {object} - contains the attr for the editor and panel config
 */
const getConnectorPickerConfig = (mode, attributes) => {
    if (!attributes.nodeUpdate || !attributes.comboboxOptions || !attributes.sourceElementType || !attributes.targetElementLabel) {
        throw new Error("Attributes passed to invoke connector selection panel method are incorrect. Must contain nodeUpdate, comboboxOptions, sourceElementType and targetElementLabel");
    }

    const nodeUpdate = attributes.nodeUpdate,
        comboboxOptions = attributes.comboboxOptions,
        elementType = attributes.sourceElementType,
        elementConfig = getConfigForElementType(elementType),
        bodyText = elementConfig.labels.connectorPickerBodyText,
        comboBoxLabel = elementConfig.labels.comboBoxLabel,
        titleForModal = getTitleForModalHeader(mode, elementType),
        targetElementLabel = attributes.targetElementLabel;

    const attr = {
        nodeUpdate,
        override: {
            body: {
                descriptor: "builder_platform_interaction:connectorPicker",
                attr: {
                    comboboxOptions,
                    bodyText,
                    comboBoxLabel,
                    targetElementLabel
                }
            }
        }
    };

    const panelConfig = {
        titleForModal,
        flavor: MODAL_SIZE.MEDIUM,
        bodyClass: 'slds-p-around_medium'
    };

    return {
        attr,
        panelConfig
    };
};

/**
 * Gets the property editor config
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @return {object} - contains the attr for the editor and panel config
 */
const getPropertyEditorConfig = (mode, attributes) => {
    if (!attributes.node || !attributes.nodeUpdate) {
        throw new Error('Attributes passed to invoke panel method are incorrect. Must contain node and nodeUpdate');
    }

    const nodeUpdate = attributes.nodeUpdate,
        node = attributes.node,
        elementType = attributes.node.elementType,
        elementConfig = getConfigForElementType(elementType),
        titleForModal = getTitleForModalHeader(mode, elementType),
        descriptor = elementConfig.descriptor;

    const attr = {
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

    const panelConfig = {
        titleForModal,
        flavor: elementConfig.modalSize,
        bodyClass: elementConfig.bodyCssClass || ''
    };

    return {
        attr,
        panelConfig
    };
};

/**
 * Gets the editor config based on the mode
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @return {object} - contains the attr for the editor and panel config
 */
const getEditorConfig = (mode, attributes) => {
    if (mode === CANVAS_EVENT.ADD_CONNECTION) {
        return getConnectorPickerConfig(mode, attributes);
    }
    if (mode === NewResourceEvent.EVENT_NAME) {
        return getNewResourceConfig(attributes);
    }

    return getPropertyEditorConfig(mode, attributes);
};

/**
 * Invokes the ui-panel
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attr - contains a callback and actual data
 * @param {object} panelConfig - contains the modal title, flavor and css for the editor
 */
const doInvoke = (cmpName, attr, panelConfig) => {
    const propertyEditorBodyPromise = createComponentPromise(cmpName, attr);
    const propertyEditorHeaderPromise = createComponentPromise("builder_platform_interaction:propertyEditorHeader", {titleForModal: panelConfig.titleForModal});
    const propertyEditorFooterPromise = createComponentPromise("builder_platform_interaction:propertyEditorFooter");
    Promise.all([propertyEditorBodyPromise, propertyEditorHeaderPromise, propertyEditorFooterPromise]).then((newComponents) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig : {
                body: newComponents[0],
                flavor: panelConfig.flavor,
                bodyClass: panelConfig.bodyClass,
                header: newComponents[1],
                footer: newComponents[2],
                closeAction: (panel) => {
                    closeActionCallback(panel);
                }
            },
            onCreate: (panel) => {
                const panelFooter = panel.get('v.footer')[0];
                panelFooter.set('v.panelInstance', panel);
                panelFooter.set('v.closeActionCallback', closeActionCallback);
            }
        };
        dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
    }).catch(errorMessage => {
        throw new Error('UI panel creation failed: ' + errorMessage);
    });
};

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attributes - contains a callback and actual data
 */
export function invokePanel(cmpName, attributes) {
    if (!attributes || !attributes.mode) {
        throw new Error("Attributes passed to invoke connector selection panel method are incorrect. Must contain a mode");
    }

    const mode = attributes.mode;

    const {attr, panelConfig} = getEditorConfig(mode, attributes);

    doInvoke(cmpName, attr, panelConfig);
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
