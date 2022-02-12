// @ts-nocheck
// eslint-disable-next-line lwc-core/no-interop-create, lwc-core/no-interop-dispatch, lwc-core/no-interop-render
import { createComponent, dispatchGlobalEvent } from 'aura';
import { isObject } from 'builder_platform_interaction/commonUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import {
    EDIT_START_JOURNEY_CONTEXT,
    EDIT_START_RECORD_CHANGE_CONTEXT,
    EDIT_START_SCHEDULED_PATHS,
    EDIT_START_SCHEDULE_CONTEXT,
    getConfigForElement,
    getConfigForElementType,
    MODAL_SIZE
} from 'builder_platform_interaction/elementConfig';
import {
    AddConnectionEvent,
    AddElementEvent,
    AddNonCanvasElementEvent,
    EditElementEvent,
    NewResourceEvent,
    SaveFlowEvent
} from 'builder_platform_interaction/events';
import { clearExpressions } from 'builder_platform_interaction/expressionValidator';
import { FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { isOrchestrator } from 'builder_platform_interaction/processTypeLib';
import { commonUtils, invokeModalWithComponents } from 'builder_platform_interaction/sharedUtils';
import { LABELS } from './builderUtilsLabels';
const { format } = commonUtils;

/**
 * @constant state of callback result
 * @type {Object}
 */
const STATE = {
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR'
};

/**
 * @constant Panel type  used for modals.
 * @type {string}
 */
const MODAL = 'modal';
const PANEL = 'panel';

export enum CanvasMode {
    AutoLayout = 'auto-layout',
    FreeForm = 'free-form'
}

export enum modalBodyVariant {
    WARNING_ON_CANVAS_MODE_TOGGLE
}

export enum modalFooterVariant {
    PROMPT
}

export enum FlowTestMode {
    CREATE = 'create test',
    EDIT = 'edit test'
}

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
export const createComponentPromise = (cmpName, attr) => {
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
 * @param mode - based on the event type
 * @param elementMetadata - eg: Assignment, Decision, etc
 * @param processType - eg: Flow, Orchestrator, Workflow
 * @returns title for the modal
 */
const getTitleForModalHeader = (mode: string, elementMetadata: Object, processType?: string): string => {
    const elementConfig = getConfigForElement(elementMetadata);
    if (!elementConfig || !elementConfig.labels) {
        throw new Error(
            'label is not defined in the element config for the element type: ' + elementMetadata.elementType
        );
    }

    let titlePrefix = '',
        label;

    switch (mode) {
        case SaveFlowEvent.Type.SAVE:
            label = isOrchestrator(processType) ? LABELS.orchestrationCreateFlowTitle : LABELS.createFlowTitle;
            break;
        case SaveFlowEvent.Type.SAVE_AS:
            label = LABELS.saveFlowAsTitle;
            break;
        case SaveFlowEvent.Type.SAVE_AS_OVERRIDDEN:
            label = LABELS.saveAsOverriddenTitle;
            break;
        case SaveFlowEvent.Type.SAVE_AS_TEMPLATE:
            label = LABELS.saveAsTemplateTitle;
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
        case FLOW_TRIGGER_TYPE.BEFORE_SAVE:
        case FLOW_TRIGGER_TYPE.AFTER_SAVE:
            label = elementConfig.labels.editTrigger;
            break;
        case FLOW_TRIGGER_TYPE.SCHEDULED:
        case FLOW_TRIGGER_TYPE.SCHEDULED_JOURNEY:
            label = elementConfig.labels.editSchedule;
            break;
        case FLOW_TRIGGER_TYPE.PLATFORM_EVENT:
            label = elementConfig.labels.editPlatform;
            break;
        case EDIT_START_RECORD_CHANGE_CONTEXT:
            label = elementConfig.labels.editTriggerObjectLabel;
            break;
        case EDIT_START_SCHEDULE_CONTEXT:
            label = elementConfig.labels.editObjectAndFiltersLabel;
            break;
        case EDIT_START_JOURNEY_CONTEXT:
            label = elementConfig.labels.editObject;
            break;
        case EDIT_START_SCHEDULED_PATHS:
            label = elementConfig.labels.editScheduledPath;
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
    if (Object.values(SaveFlowEvent.Type).includes(mode)) {
        label = LABELS.saveButtonLabel;
    }
    return label;
};

const getNewResourceConfig = (attributes) => {
    const nodeUpdate = attributes.nodeUpdate;
    const desc = 'builder_platform_interaction:resourceEditor';
    const newResourceInfo = attributes.newResourceInfo;
    const titleForModal = format(
        LABELS.newResourceEditorTitle,
        newResourceInfo && newResourceInfo.newResourceTypeLabel
            ? newResourceInfo.newResourceTypeLabel
            : LABELS.resourceLabel
    );

    const attr = {
        nodeUpdate,
        bodyComponent: {
            desc,
            attr: {
                node: {},
                newResourceInfo
            }
        }
    };

    const panelConfig = {
        titleForModal,
        flavor: MODAL_SIZE.MEDIUM,
        bodyClass: 'slds-p-around_none'
    };

    newResourceConfig = {
        attr,
        panelConfig
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
 *
 * @param {Object} panel : panel Instance of status icon
 * @param {Object} attr : contains callback and actual data
 */
const closeActionCallback = (panel, attr) => {
    hidePopover();
    clearExpressionValidator(panel);
    panel.close();
    if (attr.isAutoLayoutCanvas && attr.bodyComponent.attr?.node?.isCanvasElement) {
        if (attr.bodyComponent.attr.mode === 'addelement') {
            attr.moveFocusOnCloseCallback(attr.insertInfo);
        } else if (attr.bodyComponent.attr.mode === 'editelement') {
            attr.moveFocusOnCloseCallback(attr.bodyComponent.attr.node.guid);
        }
    }
};

/**
 * Gets the connector picker config
 *
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @returns {object} - contains the attr for the editor and panel config
 */
const getConnectorPickerConfig = (mode, attributes) => {
    if (
        !attributes.nodeUpdate ||
        !attributes.comboboxOptions ||
        !attributes.sourceElementType ||
        !attributes.targetElementLabel
    ) {
        throw new Error(
            'Attributes passed to invoke connector selection panel method are incorrect. Must contain nodeUpdate, comboboxOptions, sourceElementType and targetElementLabel'
        );
    }
    const nodeUpdate = attributes.nodeUpdate,
        comboboxOptions = attributes.comboboxOptions,
        elementType = attributes.sourceElementType,
        elementConfig = getConfigForElementType(elementType),
        bodyText = elementConfig.labels.connectorPickerBodyText,
        comboBoxLabel = elementConfig.labels.comboBoxLabel,
        titleForModal = getTitleForModalHeader(mode, { elementType }),
        targetElementLabel = attributes.targetElementLabel;

    const attr = {
        nodeUpdate,
        bodyComponent: {
            desc: 'builder_platform_interaction:connectorPicker',
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
 *
 * @param {string} mode the event name(addelement, editelement)
 * @param {object} elementConfig - the element config
 * @returns {string|undefined} - the element config descriptor
 */
const getPropertyEditorDescriptor = (mode, elementConfig) => {
    const desc = elementConfig.descriptor;
    if (!isObject(desc)) {
        return desc;
    }
    return desc[mode];
};

/**
 * Gets the modal size for the property editor
 *
 * @param mode indicating the start element editor to be invoked(RecordAfterSave, RecordBeforeSave, Scheduled etc.)
 * @param elementConfig - the element config
 * @returns - the modal size for the property editor
 */
const getModalSize = (mode: string, elementConfig: UI.ElementConfig): string | undefined => {
    const modalSize = elementConfig.modalSize;
    if (!isObject(modalSize)) {
        return modalSize;
    }
    return modalSize[mode];
};

/**
 * Convert a property editor descriptor in to a class name for dynamic lwc loading.
 *
 * @param desc Description
 * @returns Property editor className
 */
const getPropertyEditorClassName = (desc) => {
    const packageAndClass = desc.split(':');

    return packageAndClass[0] + '/' + packageAndClass[1];
};

const invokeModalWithComponentsOnCreate = (modal, data) => {
    const modalFooter = modal.get('v.footer')[0];
    if (data.closeModalCallback) {
        modalFooter.set('v.closeModalCallback', () => {
            data.closeModalCallback(modal);
        });
    } else {
        modalFooter.set('v.closeModalCallback', modal.close);
    }
    return modalFooter;
};

/**
 * Gets the property editor config
 *
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @returns {object} - contains the attr for the editor and panel config
 */
export const getPropertyEditorConfig = (mode, attributes) => {
    if (!attributes.node || !attributes.nodeUpdate) {
        throw new Error('Attributes passed to invoke panel method are incorrect. Must contain node and nodeUpdate');
    }

    const nodeUpdate = attributes.nodeUpdate,
        newResourceCallback = attributes.newResourceCallback,
        editResourceCallback = attributes.editResourceCallback,
        moveFocusOnCloseCallback = attributes.moveFocusOnCloseCallback,
        insertInfo = attributes.insertInfo,
        isAutoLayoutCanvas = attributes.isAutoLayoutCanvas,
        node = attributes.node,
        elementType = attributes.node.elementType,
        elementConfig = getConfigForElement(attributes.node),
        titleForModal = getTitleForModalHeader(
            mode,
            {
                elementType,
                elementSubtype: getValueFromHydratedItem(attributes.node.elementSubtype)
            },
            attributes.processType || attributes.node?.processType?.value
        ),
        labelForOkButton = getLabelForOkButton(mode),
        desc = getPropertyEditorDescriptor(mode, elementConfig),
        className = getPropertyEditorClassName(desc),
        processType = attributes.processType,
        autoFocus = attributes.autoFocus,
        triggerType = attributes.triggerType;
    if (!desc) {
        throw new Error('descriptor is not defined in the element config for the element type: ' + elementType);
    }

    const attr = {
        nodeUpdate,
        newResourceCallback,
        editResourceCallback,
        moveFocusOnCloseCallback,
        insertInfo,
        isAutoLayoutCanvas,
        bodyComponent: {
            desc,
            className,
            attr: {
                node,
                processType,
                triggerType,
                mode,
                editorParams: { isAutoLayoutCanvas }
            }
        }
    };

    const panelConfig = {
        titleForModal,
        labelForOkButton,
        flavor: getModalSize(mode, elementConfig),
        bodyClass: elementConfig.bodyCssClass || '',
        isLabelCollapsibleToHeader: false,
        isFieldLevelCommitEnabled: false,
        elementType,
        propertyEditorPanelSize: elementConfig.propertyEditorPanelSize,
        autoFocus
    };

    return {
        attr,
        panelConfig
    };
};

/**
 * Gets the editor config based on the mode
 *
 * @param {string} mode based on the event type
 * @param {object} attributes - contains a callback and actual data
 * @returns {object} - contains the attr for the editor and panel config
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
 *
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attr - contains callback and actual data
 * @param {object} panelConfig - contains the modal title, flavor and css for the editor
 */
const doInvoke = (cmpName, attr, panelConfig) => {
    const propertyEditorBodyPromise = createComponentPromise(cmpName, attr);
    const propertyEditorHeaderPromise = createComponentPromise('builder_platform_interaction:propertyEditorHeader', {
        titleForModal: panelConfig.titleForModal
    });
    let propertyEditorFooterPromise;
    if (panelConfig.labelForOkButton) {
        propertyEditorFooterPromise = createComponentPromise('builder_platform_interaction:propertyEditorFooter', {
            labelForOkButton: panelConfig.labelForOkButton
        });
    } else {
        propertyEditorFooterPromise = createComponentPromise('builder_platform_interaction:propertyEditorFooter');
    }
    Promise.all([propertyEditorBodyPromise, propertyEditorHeaderPromise, propertyEditorFooterPromise])
        .then((newComponents) => {
            const createPanelEventAttributes = {
                panelType: MODAL,
                visible: true,
                panelConfig: {
                    body: newComponents[0],
                    flavor: panelConfig.flavor,
                    bodyClass: panelConfig.bodyClass,
                    autoFocus: panelConfig.autoFocus,
                    header: newComponents[1],
                    footer: newComponents[2],
                    closeAction: (panel) => {
                        closeActionCallback(panel, attr);
                    }
                },
                onCreate: (panel) => {
                    const panelFooter = panel.get('v.footer')[0];
                    panelFooter.set('v.panelInstance', panel);
                    panelFooter.set('v.closeActionCallback', closeActionCallback);
                    panelFooter.set('v.attr', attr);
                    const panelBody = panel.get('v.body')[0];
                    panelBody.set('v.panelInstance', panel);
                    panelBody.set('v.closeActionCallback', closeActionCallback);
                }
            };
            dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
        })
        .catch((errorMessage) => {
            throw new Error('UI panel creation failed: ' + errorMessage);
        });
};

/**
 * Callback invoked when the popover is created
 *
 * @param {Object} panelInstance - the panel instance
 */
function onCreatePopover(panelInstance) {
    popoverState.panelInstance = panelInstance;
}

/**
 * Callback invoked when the popover is destroyed
 *
 * @param panel Panel to destroy
 */
function onDestroyPopover(panel) {
    if (popoverState) {
        const { onClose } = popoverState;

        if (onClose) {
            onClose(panel);
        }

        panel.close(null, false); // set shouldReturnFocus param to false to prevent focus from leaving modal on closing the popover
        popoverState = null;
    }
}

/**
 * Invokes the panel and creates property editor inside it
 *
 * @param {string} cmpName - Name of the component to be created
 * @param {object} attributes - contains a callback and actual data
 */
export function invokePropertyEditor(cmpName, attributes) {
    if (!attributes || !attributes.mode) {
        throw new Error(
            'Attributes passed to invoke connector selection panel method are incorrect. Must contain a mode'
        );
    }

    const mode = attributes.mode;

    const { attr, panelConfig } = getEditorConfig(mode, attributes);

    doInvoke(cmpName, attr, panelConfig);
}

/**
 * Invokes the debug modal.
 *
 * @param {object} attributes - contains a callback and actual data
 */
export function invokeDebugEditor(attributes) {
    if (!attributes || !attributes.flowId) {
        throw new Error('Attributes passed to invoke debug editor is not correct. Must contain flow Id');
    }

    const flowName = attributes.flowDevName;
    const flowId = attributes.flowId;
    const processType = attributes.processType;
    const triggerType = attributes.triggerType;
    const rerun = attributes.rerun;
    const isCreateOrUpdate = attributes.isCreateOrUpdate;
    const recordTriggerType = attributes.recordTriggerType;
    const dollarRecordName = attributes.dollarRecordName;
    const scheduledPathsList = attributes.scheduledPathsList;
    const showScheduledPathComboBox = attributes.showScheduledPathComboBox;
    const defaultPath = attributes.defaultPath;

    showDebugEditorPopover(
        'builder_platform_interaction:modalHeader',
        'builder_platform_interaction:debugEditor',
        'builder_platform_interaction:modalFooter',
        {
            flowName,
            flowId,
            processType,
            triggerType,
            rerun,
            isCreateOrUpdate,
            recordTriggerType,
            dollarRecordName,
            scheduledPathsList,
            showScheduledPathComboBox,
            defaultPath
        },
        {
            flavor: 'small slds-modal_medium'
        },
        attributes.runDebugInterviewCallback
    );
}

/**
 * Open Debug Editor Popover.
 *
 * @param {string} cmpHeader - Name of the header component to be created.
 * @param {string} cmpBody - Name of the body component to be created.
 * @param {string} cmpFooter - Name of the footer component to be created.
 * @param {object} cmpAttributes - Contains components' attributes.
 * @param {object} popoverProps - Contains popover properties
 * @param {Function} runDebugInterviewCallback - callback after Run button is clicked
 */
function showDebugEditorPopover(
    cmpHeader,
    cmpBody,
    cmpFooter,
    cmpAttributes = {},
    popoverProps,
    runDebugInterviewCallback
) {
    if (isPopoverOpen()) {
        return;
    }

    popoverState = {
        panelInstance: null,
        referenceElement: popoverProps.referenceElement,
        onClose: popoverProps.onClose
    };

    const headerPromise = createComponentPromise(cmpHeader, {
        headerTitle: LABELS.newDebugEditorTitle
    });
    const footerPromise = createComponentPromise(cmpFooter, {
        buttons: {
            buttonOneClass: '.test-debug-modal-footer-run-button',
            buttonTwoClass: '.test-debug-modal-footer-cancel-button',
            buttonOne: {
                buttonLabel: LABELS.runTitle,
                buttonVariant: 'brand'
            },
            buttonTwo: {
                buttonLabel: LABELS.cancelButton,
                buttonVariant: 'neutral',
                buttonCallback: hidePopover,
                closeCallback: false
            }
        }
    });
    const bodyPromise = createComponentPromise(cmpBody, {
        flowName: cmpAttributes.flowName,
        flowId: cmpAttributes.flowId,
        processType: cmpAttributes.processType,
        triggerType: cmpAttributes.triggerType,
        rerun: cmpAttributes.rerun,
        isCreateOrUpdate: cmpAttributes.isCreateOrUpdate,
        recordTriggerType: cmpAttributes.recordTriggerType,
        dollarRecordName: cmpAttributes.dollarRecordName,
        scheduledPathsList: cmpAttributes.scheduledPathsList,
        showScheduledPathComboBox: cmpAttributes.showScheduledPathComboBox,
        defaultPath: cmpAttributes.defaultPath
    });
    const invokeModalWithComponentsOnCreateOverride = (modal, data) => {
        onCreatePopover(modal);
        invokeModalWithComponentsOnCreate(modal, data);
    };

    invokeModalWithComponents(
        {
            flavor: popoverProps.flavor,
            closeCallback: hidePopover,
            closeModalCallback: runDebugInterviewCallback
        },
        headerPromise,
        bodyPromise,
        footerPromise,
        invokeModalWithComponentsOnCreateOverride
    );
}

/**
 * Invokes the create, edit flow test editor
 *
 * @param attributes - contains callback and actual data
 */
export function invokeCreateEditFlowTestEditor(attributes) {
    const data = attributes.flowTestObject;
    const mode = attributes.createOrEdit;
    const triggerSaveType = attributes.triggerSaveType;
    showFlowTestPopover(
        'builder_platform_interaction:modalHeader',
        'builder_platform_interaction:flowTestEditor',
        'builder_platform_interaction:flowTestFooter',
        {
            data,
            mode,
            triggerSaveType
        },
        {
            flavor: 'large restrictWidthToSldsMedium'
        },
        attributes.saveTestCallback
    );
}

/**
 * Open Flow Test popover.
 *
 * @param cmpHeader - Name of the header component to be created.
 * @param cmpBody - Name of the body component to be created.
 * @param cmpFooter - Name of the footer component to be created.
 * @param cmpAttributes - Contains component's attributes.
 * @param popoverProps - Contains popover properties
 * @param saveTestCallback - callback after Save Test/Save Changes button is clicked
 */
function showFlowTestPopover(cmpHeader, cmpBody, cmpFooter, cmpAttributes = {}, popoverProps, saveTestCallback) {
    let headerLabel = null;
    let footerButtonLabel = null;

    if (cmpAttributes.mode === FlowTestMode.CREATE) {
        headerLabel = LABELS.flowTestEditorCreateLabel;
        footerButtonLabel = LABELS.flowTestEditorCreateButton;
    } else if (cmpAttributes.mode === FlowTestMode.EDIT) {
        headerLabel = LABELS.flowTestEditorEditLabel;
        footerButtonLabel = LABELS.flowTestEditorSaveButton;
    }
    popoverState = {
        panelInstance: null,
        referenceElement: popoverProps.referenceElement,
        onClose: popoverProps.onClose
    };

    const headerPromise = createComponentPromise(cmpHeader, {
        headerTitle: headerLabel
    });
    const footerPromise = createComponentPromise(cmpFooter, {
        flowTestButtons: {
            flowTestButtonOne: {
                buttonLabel: footerButtonLabel,
                buttonVariant: 'brand',
                buttonCallback: () => saveTestCallback
            },
            flowTestButtonTwo: {
                buttonLabel: LABELS.cancelButton,
                buttonVariant: 'neutral',
                buttonCallback: hidePopover,
                closeCallback: false
            }
        }
    });
    const bodyPromise = createComponentPromise(cmpBody, {
        flowTestObject: cmpAttributes.data,
        triggerSaveType: cmpAttributes.triggerSaveType
    });
    const invokeModalWithComponentsOnCreateOverride = (modal, data) => {
        onCreatePopover(modal);
        const modalFooter = invokeModalWithComponentsOnCreate(modal, data);
        // Disable "Create Test" and "Save Changes" button on modal footer.
        // TODO: Enable once modal is ready to send data to backend
        modalFooter.disableFlowTestButtonOne();
        modalFooter.panelInstance(modal);
    };

    invokeModalWithComponents(
        {
            flavor: popoverProps.flavor,
            closeCallback: hidePopover
        },
        headerPromise,
        bodyPromise,
        footerPromise,
        invokeModalWithComponentsOnCreateOverride
    );
}

/**
 * Invoke flow test list view
 *
 * @param attributes
 */
export function invokeFlowTestManager(attributes) {
    showTestFlowManagerPopover(
        'builder_platform_interaction:modalHeader',
        'builder_platform_interaction:flowTestManager',
        'builder_platform_interaction:modalFooter',
        {
            flavor: 'large restrictWidthToSldsMedium'
        },
        attributes.createNewTest
    );
}

/**
 * Open Flow Test listview
 *
 * @param cmpHeader - Name of the header component to be created.
 * @param cmpBody - Name of the body component to be created.
 * @param cmpFooter - Name of the footer component to be created.
 * @param popoverProps - Contains popover properties
 * @param createNewTest - Callback after Create New Test button is clicked
 */
function showTestFlowManagerPopover(cmpHeader, cmpBody, cmpFooter, popoverProps, createNewTest) {
    popoverState = {
        panelInstance: null,
        referenceElement: popoverProps.referenceElement,
        onClose: popoverProps.onClose
    };

    const headerPromise = createComponentPromise(cmpHeader, {
        headerTitle: LABELS.flowTestHeader
    });
    const footerPromise = createComponentPromise(cmpFooter, {
        buttons: {
            buttonOneClass: '.flow-test-modal-footer-run-button',
            buttonTwoClass: '.flow-test-modal-footer-cancel-button',
            buttonOne: {
                buttonLabel: LABELS.flowTestRunTest,
                buttonVariant: 'brand'
            },
            buttonTwo: {
                buttonLabel: LABELS.flowTestCancel,
                buttonVariant: 'neutral',
                buttonCallback: hidePopover,
                closeCallback: false
            }
        }
    });
    const bodyPromise = createComponentPromise(cmpBody, {
        buttonCallback: createNewTest,
        hideModal: hidePopover
    });

    const invokeModalWithComponentsOnCreateOverride = (modal, data) => {
        onCreatePopover(modal);
        const modalFooter = invokeModalWithComponentsOnCreate(modal, data);
        // Disable "Run Test" button on modal footer
        modalFooter.disableButtonOne();
        // May need to pass the modalFooter to the modal body for enabling the "Run Test" button if record is selected in list view
        // const panelBody = modal.get('v.body')[0];
        // panelBody.set('v.footer', modalFooter);
    };

    invokeModalWithComponents(
        {
            flavor: popoverProps.flavor,
            closeCallback: hidePopover
        },
        headerPromise,
        bodyPromise,
        footerPromise,
        invokeModalWithComponentsOnCreateOverride
    );
}

/**
 * Invokes the new flow modal.
 *
 * @param builderType Builder Type
 * @param configuration Configuration
 * @param {Function} closeFlowModalAction the callback to execute when clicking the exit icon
 * @param {Function} createFlowFromTemplateCallback the callback to execute when clicking the create button
 */
export const invokeNewFlowModal = (
    builderType,
    configuration = {
        showRecommended: true,
        showAll: true
    },
    closeFlowModalAction,
    createFlowFromTemplateCallback
) => {
    const modalHeaderPromise = createComponentPromise('builder_platform_interaction:modalHeader', {
        headerTitle: LABELS.headerTitle
    });

    const modalBodyPromise = createComponentPromise('builder_platform_interaction:newFlowModalBody', {
        ...configuration,
        builderType
    });
    const modalFooterPromise = createComponentPromise('builder_platform_interaction:modalFooter', {
        buttons: {
            buttonOne: {
                buttonLabel: LABELS.createButtonLabel,
                buttonVariant: 'brand'
            }
        }
    });

    const invokeModalWithComponentsOnCreateOverride = (modal, data) => {
        const modalFooter = invokeModalWithComponentsOnCreate(modal, data);
        const panelBody = modal.get('v.body')[0];
        panelBody.set('v.footer', modalFooter);
    };

    return invokeModalWithComponents(
        {
            bodyClass: 'slds-p-around_none slds-is-relative slds-scrollable_none',
            flavor: MODAL_SIZE.LARGE,
            closeCallback: closeFlowModalAction,
            closeModalCallback: createFlowFromTemplateCallback
        },
        modalHeaderPromise,
        modalBodyPromise,
        modalFooterPromise,
        invokeModalWithComponentsOnCreateOverride
    );
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
 *
 */
export function invokeKeyboardHelpDialog() {
    const modalHeaderPromise = createComponentPromise('builder_platform_interaction:modalHeader', {
        headerTitle: LABELS.keyboardShortcutListTitle
    });
    const modalBodyPromise = createComponentPromise('builder_platform_interaction:keyboardShortcutsListBody', {});
    const modalFooterPromise = createComponentPromise('builder_platform_interaction:modalFooter', {
        buttons: {
            buttonOne: {
                buttonLabel: LABELS.okayButtonLabel,
                buttonVariant: 'brand'
            }
        }
    });
    invokeModalWithComponents(
        {
            bodyClass: 'slds-p-around_none slds-is-relative',
            flavor: MODAL_SIZE.SMALL
        },
        modalHeaderPromise,
        modalBodyPromise,
        modalFooterPromise
    );
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
 * @returns {Object} The DOM element that is used to anchor the popover
 */
export function getPopoverReferenceElement() {
    return isPopoverOpen() ? popoverState.referenceElement : null;
}

/**
 * Checks if the popover singleton is opened
 *
 * @returns {boolean} - whether the popover is open
 */
export function isPopoverOpen() {
    return !!popoverState;
}

/**
 * Hides the popover singleton
 *
 * @param root0 Object
 * @param root0.closedBy Close event name
 */
export function hidePopover({ closedBy } = {}) {
    if (isPopoverOpen()) {
        const panelInstance = popoverState.panelInstance;
        if (closedBy) {
            panelInstance.closedBy = closedBy;
        }
        onDestroyPopover(panelInstance);
    }
}

/**
 * Object containing popover properties
 *
 * @typedef {object} popoverProps - Contains popover attributes
 * @property {string} direction - Direction for the popover
 * @property {string} referenceElement - DOM element used to position the popover
 * @property {boolean} closeOnClickOut - Whether to close the popover on click out
 * @property {Function} onClose - Callback invoked when the popover is closed
 */

/**
 * Shows a component in a popover singleton
 *
 * @param {string} cmpName - Name of the component to be created
 * @param {object} cmpAttributes - Contains component attributes
 * @param {object} popoverProps - Contains popover properties
 */
export function showPopover(cmpName, cmpAttributes = {}, popoverProps) {
    if (isPopoverOpen()) {
        return;
    }

    const { direction, onClose, referenceElement, closeOnClickOut, showCloseButton } = popoverProps;

    popoverState = {
        panelInstance: null,
        referenceElement,
        onClose
    };

    const componentPromise = createComponentPromise(cmpName, cmpAttributes);

    Promise.resolve(componentPromise)
        .then((newComponent) => {
            const createPanelEventAttributes = {
                panelType: PANEL,
                visible: true,
                panelConfig: {
                    body: newComponent,
                    flavor: 'popover',
                    direction,
                    showPointer: true,
                    referenceElement,
                    closeAction: onDestroyPopover,
                    closeOnClickOut: !!closeOnClickOut,
                    titleDisplay: false,
                    showCloseButton
                },
                onCreate: onCreatePopover
            };
            dispatchGlobalEvent(UI_CREATE_PANEL, createPanelEventAttributes);
        })
        .catch((errorMessage) => {
            throw new Error('Status Icon Panel creation failed : ' + errorMessage);
        });
}

/**
 *
 */
export function focusOnDockingPanel() {
    dispatchGlobalEvent('force:shortcutCommand', { command: 'GoToPrompt', args: null });
}
