// eslint-disable-next-line lwc-core/no-interop-create, lwc-core/no-interop-dispatch
import { createComponent, dispatchGlobalEvent } from 'aura';
import { getConfigForElementType, MODAL_SIZE } from 'builder_platform_interaction/elementConfig';
import { AddElementEvent, AddNonCanvasElementEvent, EditElementEvent, NewResourceEvent, AddConnectionEvent, SaveFlowEvent } from 'builder_platform_interaction/events';
import { LABELS } from './builderUtilsLabels';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { clearExpressions } from 'builder_platform_interaction/expressionValidator';

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
const PANEL = 'panel';

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

/**
 * @constant tracks the popover singleton's state
 * @type {object}
 */
let popoverState = null;

// component name used when calling invokePropertyEditor
export const PROPERTY_EDITOR = 'builder_platform_interaction:propertyEditor';
const RESOURCE_EDITOR = 'builder_platform_interaction:resourceEditor';

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

    switch (mode) {
        case SaveFlowEvent.Type.SAVE:
            label = LABELS.createFlowTitle;
            break;
        case SaveFlowEvent.Type.SAVE_AS:
            label = LABELS.saveFlowAsTitle;
            break;
        case EditElementEvent.EVENT_NAME:
            label = elementConfig.labels.editModal;
            break;
        case AddElementEvent.EVENT_NAME:
            label = elementConfig.labels.newModal;
            break;
        case AddNonCanvasElementEvent.EVENT_NAME:
            titlePrefix = LABELS.newElementHeaderPrefix;
            label = elementConfig.labels.singular;
            break;
        case AddConnectionEvent.EVENT_NAME:
            label = elementConfig.labels.connectorPickerHeader;
            break;
        default:
            label = elementConfig.labels.singular;
            break;
    }

    // TODO: There may be languages where the concatenation of titlePrefix and label actually
    // doesn't make sense. We should revisit the way we are constructing the title.
    return titlePrefix ? titlePrefix + ' ' + label : label;
};

const getLabelForOkButton = (mode) => {
    let label;
    if (mode === SaveFlowEvent.Type.SAVE || mode === SaveFlowEvent.Type.SAVE_AS) {
        label = LABELS.saveButtonLabel;
    }
    return label;
};

let newResourceConfig;

const getNewResourceConfig = (attributes) => {
    if (newResourceConfig) {
        return newResourceConfig;
    }
    const nodeUpdate = attributes.nodeUpdate;
    const desc = 'builder_platform_interaction:resourceEditor';
    const titleForModal = LABELS.newResourceEditorTitle;

    const attr = {
        nodeUpdate,
        bodyComponent: {
            desc,
            attr: {
                node: {},
            },
        },
    };

    const panelConfig = {
        titleForModal,
        flavor: MODAL_SIZE.MEDIUM,
        bodyClass: 'slds-p-around_none',
    };

    newResourceConfig = {
        attr,
        panelConfig,
    };
    return newResourceConfig;
};

const clearExpressionValidator = (panel) => {
    const panelBody = panel.get('v.body')[0];
    if (panelBody && panelBody.get('v.bodyComponent') && panelBody.get('v.bodyComponent').desc !== RESOURCE_EDITOR) {
        clearExpressions();
    }
};

/**
 * Callback that executes just before closing any property editor modal
 * @param {Object} panel : panel Instance of status icon
 */
const closeActionCallback = (panel) => {
    hidePopover();
    clearExpressionValidator(panel);
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
        bodyComponent: {
            desc: "builder_platform_interaction:connectorPicker",
            attr: {
                comboboxOptions,
                bodyText,
                comboBoxLabel,
                targetElementLabel
            }
        }
    };

    const panelConfig = {
        titleForModal,
        flavor: MODAL_SIZE.SMALL,
        bodyClass: 'slds-p-around_medium'
    };

    return {
        attr,
        panelConfig
    };
};

/**
 * Gets the property editor descriptor
 * @param {string} mode the event name(addelement, editelement)
 * @param {object} elementConfig - the element config
 * @return {string|undefined} - the element config descriptor
 */
const getPropertyEditorDescriptor = (mode, elementConfig) => {
    const desc = elementConfig.descriptor;
    if (!isObject(desc)) {
        return desc;
    }
    return desc[mode];
};

/**
 * Gets the property editor config
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @return {object} - contains the attr for the editor and panel config
 */
export const getPropertyEditorConfig = (mode, attributes) => {
    if (!attributes.node || !attributes.nodeUpdate) {
        throw new Error('Attributes passed to invoke panel method are incorrect. Must contain node and nodeUpdate');
    }

    const nodeUpdate = attributes.nodeUpdate,
        newResourceCallback = attributes.newResourceCallback,
        node = attributes.node,
        elementType = attributes.node.elementType,
        elementConfig = getConfigForElementType(elementType),
        titleForModal = getTitleForModalHeader(mode, elementType),
        labelForOkButton = getLabelForOkButton(mode),
        desc = getPropertyEditorDescriptor(mode, elementConfig),
        processType = attributes.processType;
    if (!desc) {
        throw new Error('descriptor is not defined in the element config for the element type: ' + elementType);
    }

    const attr = {
        nodeUpdate,
        newResourceCallback,
        bodyComponent: {
            desc,
            attr: {
                node,
                processType,
                mode,
            }
        }
    };

    const panelConfig = {
        titleForModal,
        labelForOkButton,
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
    if (mode === AddConnectionEvent.EVENT_NAME) {
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
    const propertyEditorHeaderPromise = createComponentPromise("builder_platform_interaction:propertyEditorHeader", { titleForModal: panelConfig.titleForModal });
    let propertyEditorFooterPromise;
    if (panelConfig.labelForOkButton) {
        propertyEditorFooterPromise = createComponentPromise("builder_platform_interaction:propertyEditorFooter", { labelForOkButton: panelConfig.labelForOkButton });
    } else {
        propertyEditorFooterPromise = createComponentPromise("builder_platform_interaction:propertyEditorFooter");
    }
    Promise.all([propertyEditorBodyPromise, propertyEditorHeaderPromise, propertyEditorFooterPromise]).then((newComponents) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig: {
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
                const panelBody = panel.get('v.body')[0];
                panelBody.set('v.panelInstance', panel);
                panelBody.set('v.closeActionCallback', closeActionCallback);
            }
        };
        dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
    }).catch(errorMessage => {
        throw new Error('UI panel creation failed: ' + errorMessage);
    });
};

/**
 * Callback invoked when the popover is created
 * @param {Object} panelInstance - the panel instance
 */
function onCreatePopover(panelInstance) {
    popoverState.panelInstance = panelInstance;
}

/**
 * Callback invoked when the popover is destroyed
 */
function onDestroyPopover() {
    if (popoverState) {
        const { panelInstance, onClose } = popoverState;

        if (onClose) {
            onClose();
        }

        panelInstance.close();
        popoverState = null;
    }
}

/**
 * Invokes the panel and creates property editor inside it
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attributes - contains a callback and actual data
 */
export function invokePropertyEditor(cmpName, attributes) {
    if (!attributes || !attributes.mode) {
        throw new Error("Attributes passed to invoke connector selection panel method are incorrect. Must contain a mode");
    }

    const mode = attributes.mode;

    const { attr, panelConfig } = getEditorConfig(mode, attributes);

    doInvoke(cmpName, attr, panelConfig);
}

/**
 * Invokes modals with the specified header, body, and footer promises.
 * @param data - contains data for modal header/body/footer
 * @param modalHeaderPromise - the promise for the header.
 * @param modalBodyPromise - the promise for the body.
 * @param modalFooterPromise - the promise for footer.
 */
export const invokeModalWithComponents = (data, modalHeaderPromise, modalBodyPromise, modalFooterPromise) => {
    Promise.all([modalHeaderPromise, modalBodyPromise, modalFooterPromise]).then((newComponents) => {
        const createPanelEventAttributes = {
            panelType: MODAL,
            visible: true,
            panelConfig: {
                header: newComponents[0],
                body: newComponents[1],
                footer: newComponents[2],
                bodyClass: data.bodyClass || '',
                flavor: data.flavor || '',
                closeAction: (modal) => {
                    let skipCloseAction = false;
                    if (data.closeCallback) {
                        skipCloseAction = data.closeCallback();
                    }
                    if (!skipCloseAction) {
                        modal.close();
                    }
                }
            },
            onCreate: (modal) => {
                const modalFooter = modal.get('v.footer')[0];
                if (data.closeModalCallback) {
                    modalFooter.set('v.closeModalCallback', () => {
                        data.closeModalCallback(modal);
                    });
                } else {
                    modalFooter.set('v.closeModalCallback', modal.close);
                }
                const panelBody = modal.get('v.body')[0];
                panelBody.set('v.footer', modalFooter);
            },
        };
        dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
    }).catch(errorMessage => {
        throw new Error('Modal creation failed : ' + errorMessage);
    });
};

/**
 * Invokes the modal and creates the alert/confirmation modal inside it
 * @param {object} data - contains data for modal header/body/footer
 */
export const invokeModal = (data) => {
    const modalHeaderPromise = createComponentPromise("builder_platform_interaction:modalHeader", { headerTitle: data.headerData.headerTitle });
    const modalBodyPromise = createComponentPromise("builder_platform_interaction:modalBody",
        {
            bodyTextOne: data.bodyData.bodyTextOne,
            bodyTextTwo: data.bodyData.bodyTextTwo,
            listSectionHeader: data.bodyData.listSectionHeader,
            listSectionItems: data.bodyData.listSectionItems
        }
    );
    const modalFooterPromise = createComponentPromise("builder_platform_interaction:modalFooter", { buttons: data.footerData });

    invokeModalWithComponents(data, modalHeaderPromise, modalBodyPromise, modalFooterPromise);
};


/**
 * Invokes the internal data modal and creates the alert/confirmation modal inside it.
 * This should only be used when displaying internal only data.
 * @param data
 */
export const invokeModalInternalData = (data) => {
    const modalHeaderPromise = createComponentPromise("builder_platform_interaction:modalHeader", { headerTitle: data.headerData.headerTitle });
    const modalBodyPromise = createComponentPromise("builder_platform_interaction:modalBodyInternalData",
        {
            bodyTextOne: data.bodyData.bodyTextOne,
            bodyTextTwo: data.bodyData.bodyTextTwo,
            listSectionHeader: data.bodyData.listSectionHeader,
            listSectionItems: data.bodyData.listSectionItems
        }
    );
    const modalFooterPromise = createComponentPromise("builder_platform_interaction:modalFooter", { buttons: data.footerData });

    invokeModalWithComponents(data, modalHeaderPromise, modalBodyPromise, modalFooterPromise);
};


/**
 * @typedef {Object} NewFlowModalProperties
 *
 * @property {String} bodyClass
 * @property {String} flavor
 */
/**
 * Invokes the new flow modal.
 * @param {NewFlowModalProperties} modalProperties
 * @param {Function} closeFlowModalAction the callback to execute when clicking the exit icon
 * @param {Function} createFlowFromTemplateCallback the callback to execute when clicking the create button
 */
export const invokeNewFlowModal = (closeFlowModalAction, createFlowFromTemplateCallback) => {
    const modalHeaderPromise = createComponentPromise("builder_platform_interaction:modalHeader",
        {
            headerTitle: LABELS.headerTitle
        }
    );
    const modalBodyPromise = createComponentPromise("builder_platform_interaction:newFlowModalBody");
    const modalFooterPromise = createComponentPromise("builder_platform_interaction:modalFooter",
        {
            buttons: {
                buttonOne: {
                    buttonLabel: LABELS.createButtonLabel,
                    buttonVariant: 'brand',
                }
            },
        }
    );
    invokeModalWithComponents({ bodyClass: 'slds-p-around_none slds-is-relative', flavor: MODAL_SIZE.LARGE, closeCallback: closeFlowModalAction, closeModalCallback: createFlowFromTemplateCallback }, modalHeaderPromise, modalBodyPromise, modalFooterPromise);
};

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

/**
 * Checks if the popover singleton is opened
 * @return {boolean} - whether the popover is open
 */
export function isPopoverOpen() {
    return !!popoverState;
}

/**
 * Hides the popover singleton
 */
export function hidePopover() {
    if (isPopoverOpen()) {
        onDestroyPopover();
    }
}

/**
 * Object containing popover properties
 * @typedef {object} popoverProps - Contains popover attributes
 * @property {string} direction - Direction for the popover
 * @property {string} referenceElement - DOM element used to position the popover
 * @property {boolean} closeOnClickOut - Whether to close the popover on click out
 * @property {function} onClose - Callback invoked when the popover is closed
 */

/**
 * Shows a component in a popover singleton
 * @param {string} cmpName - Name of the component to be created
 * @param {object} cmpAttributes - Contains component attributes
 * @param {object} popoverProps - Contains popover properties
 */
export function showPopover(cmpName, cmpAttributes = {}, popoverProps) {
    if (isPopoverOpen()) {
        return;
    }

    const { direction, onClose, referenceElement, closeOnClickOut } = popoverProps;

    popoverState = {
        panelInstance: null,
        referenceElement,
        onClose
    };


    const componentPromise = createComponentPromise(cmpName, cmpAttributes);

    Promise.resolve(componentPromise).then((newComponent) => {
        const createPanelEventAttributes = {
            panelType: PANEL,
            visible: true,
            panelConfig: {
                body: newComponent,
                direction,
                showPointer: true,
                referenceElement,
                closeAction: onDestroyPopover,
                closeOnClickOut: !!closeOnClickOut
            },
            onCreate: onCreatePopover,
        };
        dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
    }).catch(errorMessage => {
        throw new Error('Status Icon Panel creation failed : ' + errorMessage);
    });
}
