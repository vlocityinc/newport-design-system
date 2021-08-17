// @ts-nocheck
import { api, LightningElement, track } from 'lwc';

import {
    focusOnDockingPanel,
    getPropertyEditorConfig,
    hidePopover,
    invokeAutoLayoutWelcomeMat,
    invokeDebugEditor,
    invokeKeyboardHelpDialog,
    invokeNewFlowModal,
    invokePropertyEditor,
    modalBodyVariant,
    modalFooterVariant,
    PROPERTY_EDITOR
} from 'builder_platform_interaction/builderUtils';
import {
    commands,
    invokeModal,
    keyboardInteractionUtils,
    loggingUtils,
    storeUtils
} from 'builder_platform_interaction/sharedUtils';
import { deepCopy, Store } from 'builder_platform_interaction/storeLib';
import { getSObjectOrSObjectCollectionByEntityElements } from 'builder_platform_interaction/selectors';
import {
    ADD_START_ELEMENT,
    addElement,
    addElementFault,
    clearCanvasDecoration,
    clearUndoRedo,
    createGoToConnection,
    deleteElementFault,
    deleteGoToConnection,
    DESELECT_ON_CANVAS,
    doDuplicate,
    MARQUEE_SELECT_ON_CANVAS,
    pasteOnFixedCanvas,
    redo,
    removeLastCreatedInlineResource,
    resetGoTos,
    SELECTION_ON_FIXED_CANVAS,
    selectionOnFixedCanvas,
    selectOnCanvas,
    TOGGLE_ON_CANVAS,
    undo,
    UPDATE_APEX_CLASSES,
    UPDATE_ENTITIES,
    UPDATE_IS_AUTO_LAYOUT_CANVAS_PROPERTY,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE_AND_TRIGGER_TYPE,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
    updateElement,
    updateFlow,
    updateFlowOnCanvasModeToggle,
    updateIsAutoLayoutCanvasProperty,
    updatePropertiesAfterActivateButtonPress,
    updatePropertiesAfterCreatingFlowFromProcessTypeAndTriggerType,
    updatePropertiesAfterCreatingFlowFromTemplate
} from 'builder_platform_interaction/actions';
import {
    ELEMENT_TYPE,
    FLOW_PROCESS_TYPE,
    FLOW_STATUS,
    FLOW_TRIGGER_SAVE_TYPE,
    FLOW_TRIGGER_TYPE,
    isSystemElement,
    SCHEDULED_PATH_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { fetch, fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { translateFlowToUIModel, translateUIModelToFlow } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { INIT, isRedoAvailable, isUndoAvailable, undoRedo } from 'builder_platform_interaction/undoRedoLib';
import { fetchFieldsForEntity, getEntity, MANAGED_SETUP, setEventTypes } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './editorLabels';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { EditElementEvent, LocatorIconClickedEvent, NewResourceEvent } from 'builder_platform_interaction/events';
import { SaveType } from 'builder_platform_interaction/saveType';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { mutateFlowResourceToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import { getElementForPropertyEditor, getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import {
    canRunDebugWith,
    closeModalAndNavigateTo,
    createStartElement,
    debugInterviewResponseCallback,
    flowPropertiesCallback,
    getConnectorToDuplicate,
    getCopiedChildElements,
    getCopiedData,
    getDuplicateElementGuidMaps,
    getElementsMetadata,
    getElementsToBeDeleted,
    getPasteElementGuidMaps,
    getSaveType,
    getSelectedFlowEntry,
    getToolboxElements,
    highlightCanvasElement,
    isGuardrailsEnabled,
    logElementCreation,
    saveAsFlowCallback,
    screenFieldsReferencedByLoops,
    setErrorMessage,
    setFlowErrorsAndWarnings,
    shiftFocusFromCanvas,
    updateStoreAfterSaveAsNewFlowIsFailed,
    updateStoreAfterSaveAsNewVersionIsFailed,
    updateStoreAfterSaveFlowIsSuccessful,
    updateUrl
} from './editorUtils';
import { cachePropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import {
    BUILDER_MODE,
    getProcessTypes,
    getRunInModes,
    isVersioningDataInitialized,
    setBuilderType,
    setProcessTypes,
    setRunInModes
} from 'builder_platform_interaction/systemLib';
import { isAutoLayoutCanvasOnly, isConfigurableStartSupported } from 'builder_platform_interaction/processTypeLib';
import { getTriggerTypeInfo, isRecordChangeTriggerType } from 'builder_platform_interaction/triggerTypeLib';
import {
    initializeLoader,
    loadAllSupportedFeatures,
    loadEntity,
    loadEventType,
    loadFieldsForComplexTypesInFlow,
    loadFieldsForExtensionsInFlowFromMetadata,
    loadOnProcessTypeChange,
    loadOnStart,
    loadOnTriggerTypeChange,
    loadOperatorsAndRulesOnTriggerTypeChange,
    loadParametersForInvocableApexActionsInFlowFromMetadata,
    loadVersioningData
} from 'builder_platform_interaction/preloadLib';
import {
    CLASSIC_EXPERIENCE,
    getPreferredExperience,
    isAutoLayoutCanvasEnabled
} from 'builder_platform_interaction/contextLib';
import { loadReferencesIn } from 'builder_platform_interaction/mergeFieldLib';
import { FlowGuardrailsExecutor, GuardrailsResultEvent } from 'builder_platform_interaction/guardrails';
import {
    getElementByGuid,
    getRecordTriggerType,
    getScheduledPathsList,
    getStartElement,
    getStartObject,
    getTriggerType,
    isDevNameInStore
} from 'builder_platform_interaction/storeUtils';
import {
    createEndElement,
    createVariable,
    shouldSupportScheduledPaths
} from 'builder_platform_interaction/elementFactory';
import { usedBy } from 'builder_platform_interaction/usedByLib';
import { getConfigForElement } from 'builder_platform_interaction/elementConfig';

import { pubSub, PubSubEvent } from 'builder_platform_interaction/pubSub';
import { CreateGoToConnectionEvent, DeleteGoToConnectionEvent } from 'builder_platform_interaction/alcEvents';
import {
    addEndElementsAndConnectorsTransform,
    canConvertToAutoLayoutCanvas,
    convertToAutoLayoutCanvas,
    convertToFreeFormCanvas,
    removeEndElementsAndConnectorsTransform
} from 'builder_platform_interaction/alcConversionUtils';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { ConnectionSource } from 'builder_platform_interaction/autoLayoutCanvas';
import { TEXT_AREA_MAX_LENGTH } from 'builder_platform_interaction/screenEditorUtils';

const { generateGuid } = storeUtils;
const { logInteraction, logPerfTransactionEnd, logPerfTransactionStart, setAppName } = loggingUtils;
const {
    ShiftFocusForwardCommand,
    ShiftFocusBackwardCommand,
    DisplayShortcutsCommand,
    FocusOnDockingPanelCommand
} = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;
let unsubscribeStore;
let storeInstance: Store;

const RUN = 'run';
const DEBUG = 'debug';
const NEWDEBUG = 'new debug';
const RESTARTDEBUG = 'restart debug';

const EDITOR = 'EDITOR';
const TOGGLE_CANVAS_MODE = 'TOGGLE_CANVAS_MODE';
const ADD_ELEMENT = 'ADD_ELEMENT';
const APP_NAME = 'FLOW_BUILDER';

const PANELS = {
    HEADER: 'builder_platform_interaction-header',
    TOOLBAR: 'builder_platform_interaction-toolbar',
    TOOLBOX: 'builder_platform_interaction-left-panel',
    FREEFORM_CANVAS: 'builder_platform_interaction-canvas-container',
    AUTOLAYOUT_CANVAS: 'builder_platform_interaction-alc-canvas-container',
    PROPERTY_EDITOR_PANEL: 'builder_platform_interaction-property-editor-panel',
    DEBUG_PANEL: 'builder_platform_interaction-debug-panel'
};

const EDITOR_COMPONENT_CONFIGS = {
    TOOLBAR_CONFIG: 'toolbarConfig',
    LEFT_PANEL_CONFIG: 'leftPanelConfig',
    CANVAS_CONFIG: 'canvasConfig',
    HEADER_CONFIG: 'headerConfig',
    RIGHT_PANEL_CONFIG: 'rightPanelConfig'
};

type NodeWithParent = {
    elementType: ELEMENT_TYPE;
    element: UI.Element;
    parentGuid: UI.Guid;
};

const ELEMENT_TYPES_TO_ALWAYS_EDIT_IN_MODAL = [
    ELEMENT_TYPE.CONSTANT,
    ELEMENT_TYPE.TEXT_TEMPLATE,
    ELEMENT_TYPE.FORMULA,
    ELEMENT_TYPE.VARIABLE,
    ELEMENT_TYPE.FLOW_PROPERTIES
];
/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 */
export default class Editor extends LightningElement {
    _builderType;

    @api
    get builderType() {
        return this._builderType;
    }

    set builderType(value) {
        this._builderType = value;
        setBuilderType(value);
    }

    @api
    builderConfig;

    builderMode = BUILDER_MODE.EDIT_MODE;

    @api
    setBuilderMode(mode) {
        this.builderMode = mode;
    }

    disableGuardrails = false;

    debugData;

    fromEmailDebugging;

    _guardrailsParams;

    _isToolbarFocusedPostInitialLoad = false;

    /**
     * Params to execute guardrails and propagate info to help menu in header
     * {
     *  running: true/false
     *  count: number of guardrails
     * }
     *
     * @returns Guardrails params
     */
    @api
    get guardrailsParams() {
        return this._guardrailsParams;
    }

    set guardrailsParams(value) {
        const prevRunning = this._guardrailsParams ? this._guardrailsParams.running : false;
        this._guardrailsParams = value;
        if (!prevRunning) {
            this.executeGuardrails(storeInstance.getCurrentState());
        }
    }

    @track
    flowStatus;

    @track
    elementsMetadata;

    topSelectedGuid = null;
    cutOrCopiedCanvasElements = {};
    cutOrCopiedChildElements = {};
    topCutOrCopiedGuid = null;
    bottomCutOrCopiedGuid = null;
    currentFlowId;
    currentFlowDefId;
    currentInterviewGuid;
    runDebugUrl;
    isFlowServerCallInProgress = false;
    isRetrieveInterviewHistoryCallInProgress = false;
    flowRetrieveError;
    hideDebugAgainButton = false;
    _isAddingResourceViaLeftPanel = false;
    _isResourceQuickCreated = false;
    _isInlineEditingResource = false;
    ifBlockResume = false;

    originalFlowLabel;
    originalFlowDescription;
    originalFlowInterviewLabel;
    keyboardInteractions;
    triggerType;
    recordTriggerType;
    guardrailsEngine;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    activeElementGuid = null;

    @track
    properties = {};

    @track
    flowErrorsAndWarnings = {
        errors: {},
        warnings: {}
    };

    @track
    backUrl;

    @track
    helpUrl;

    @track
    trailheadUrl;

    @track
    trailblazerCommunityUrl;

    @track
    spinners = {
        showFlowMetadataSpinner: false,
        showPropertyEditorSpinner: false,
        showDebugSpinner: false,
        showAutoLayoutSpinner: false,
        showRetrieveInterviewHistorySpinner: false
    };

    @track
    hasNotBeenSaved = true;

    @track
    disableSave = true;

    @track
    saveAndPendingOperationStatus;

    @track
    saveType;

    @track
    retrievedHeaderUrls = false;

    @track
    canRunDebugWithVAD = false;

    @track
    isUndoDisabled = true;

    @track
    isRedoDisabled = true;

    @track
    showPropertyEditorRightPanel = false;

    @track
    propertyEditorParams = null;

    @track
    elementBeingEditedInPanel = null;

    propertyEditorBlockerCalls = [];

    debugEditorBlockerCalls = [];

    @track
    isCutCopyDisabled = true;

    @track
    isPasteAvailable = false;

    @track
    isSelectionMode = false;

    @track
    palette = null;

    processTypeLoading = false;

    requiredVariablesLoading = false;

    supportedElements = [];

    flowInitDefinitionId;

    labels = LABELS;

    /**
     * @returns true Whether canvas elements are available. Don't render the canvas until then.
     */
    get hasCanvasElements() {
        return (
            (this.hasFlow && storeInstance.getCurrentState().canvasElements.length > 0) ||
            this.properties.isAutoLayoutCanvas
        );
    }

    /**
     * @returns True if the component has a flow to edit (now or in future)
     */
    get hasFlow() {
        if (storeInstance) {
            const currentState = storeInstance.getCurrentState();
            return !!(
                this.currentFlowId ||
                (currentState && currentState.properties && currentState.properties.processType)
            );
        }
        return false;
    }

    /**
     * @returns Default flow as supplied in the builder config
     */
    get defaultFlow() {
        return (
            this.builderConfig && this.builderConfig.newFlowConfig && this.builderConfig.newFlowConfig.defaultNewFlow
        );
    }

    /**
     * Indicates that the new flow modal should be displayed
     *
     * @returns true if the new flow dialog must be shown
     */
    get showNewFlowDialog() {
        // Show New Flow modal if there is no flow to edit,
        // builder configuration isn't loading
        // and no default flow to create.
        return !this.hasFlow && !this.defaultFlow;
    }

    get builderIcon() {
        return this.builderConfig && this.builderConfig.icon;
    }

    get builderName() {
        return this.builderConfig && this.builderConfig.name;
    }

    get usePanelForPropertyEditor() {
        return (
            (this.builderConfig && this.builderConfig.usePanelForPropertyEditor) ||
            // Hardcoded for Orchestrator
            // TODO:  W-8146747 - remove in 234
            this.properties.processType === FLOW_PROCESS_TYPE.ORCHESTRATOR
        );
    }

    /**
     * Allows the right panel to size itself to fit its content without a max-width
     *
     * @returns True if the process type is ORCHESTRATOR
     */
    get isRightPanelVariableWidth() {
        // Hardcoded for App Process PoC
        // TODO:  W-8146747 - remove in 234
        return this.properties.processType === FLOW_PROCESS_TYPE.ORCHESTRATOR;
    }

    get useNewDebugExperience() {
        return (
            this.properties.processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW &&
            (!this.triggerType ||
                this.triggerType === FLOW_TRIGGER_TYPE.NONE ||
                this.triggerType === FLOW_TRIGGER_TYPE.SCHEDULED ||
                isRecordChangeTriggerType(this.triggerType))
        );
    }

    get debugInterviewStatus() {
        return this.debugData && this.debugData.interviewStatus;
    }

    get showInterviewLabel() {
        return this.headerConfig.showInterviewLabel;
    }

    get showDebugStatus() {
        return this.headerConfig.showDebugStatus;
    }

    get showLeftPanelElementsTab() {
        return !this.properties.isAutoLayoutCanvas;
    }

    /** Indicates that the new flow modal is displayed */
    newFlowModalActive = false;

    constructor() {
        super();
        // Setting the app name to differentiate between FLOW_BUILDER or STRATEGY_BUILDER
        setAppName(APP_NAME);
        logPerfTransactionStart(EDITOR);
        const blacklistedActionsForUndoRedoLib = [
            INIT,
            UPDATE_APEX_CLASSES,
            ADD_START_ELEMENT,
            UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
            UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE_AND_TRIGGER_TYPE,
            UPDATE_ENTITIES,
            SELECTION_ON_FIXED_CANVAS,
            UPDATE_IS_AUTO_LAYOUT_CANVAS_PROPERTY
        ];
        const groupedActions = [
            TOGGLE_ON_CANVAS, // Used for shift-select elements on canvas.
            DESELECT_ON_CANVAS, // is dispatched when user clicks on the blank space in canvas.
            MARQUEE_SELECT_ON_CANVAS // is dispatched when the user is marquee selecting on the canvas.
        ];

        this.guardrailsEngine = new FlowGuardrailsExecutor();

        // generate a guid as flow definitionId so that the definitionId of a newly created and
        // unsaved flow won't be undefined and can be logged using loglines
        this.flowInitDefinitionId = generateGuid();

        // Initializing store
        storeInstance = Store.getStore(
            undoRedo(reducer, {
                blacklistedActions: blacklistedActionsForUndoRedoLib,
                groupedActions
            })
        );
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        fetchOnce(SERVER_ACTION_TYPE.GET_HEADER_URLS).then((data) => this.getHeaderUrlsCallBack(data));
        this.keyboardInteractions = new KeyboardInteractions();
        initializeLoader(storeInstance);
        // W-7708069. Need to load references in Flow once we get all apex types.
        loadOnStart().then(() => this.loadReferencesInFlow());
    }

    @api
    get flowId() {
        return this.currentFlowId;
    }

    set flowId(currentFlowId) {
        if (currentFlowId) {
            this.currentFlowId = currentFlowId;
            const params = {
                id: currentFlowId
            };
            // Keeping this as fetch because we want to go to the server
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallback, params, {
                background: true
            });

            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
        }
    }

    @api
    get interviewGuid() {
        return this.currentInterviewGuid;
    }

    set interviewGuid(interviewGUID) {
        if (interviewGUID) {
            this.currentInterviewGuid = interviewGUID;
            this.spinners.showRetrieveInterviewHistorySpinner = true;
        }
    }

    @api
    get flowDefId() {
        return this.currentFlowDefId;
    }

    set flowDefId(flowDefId) {
        this.currentFlowDefId = flowDefId;
    }

    get showSpinner() {
        return (
            this.spinners.showFlowMetadataSpinner ||
            this.spinners.showPropertyEditorSpinner ||
            this.spinners.showDebugSpinner ||
            this.processTypeLoading ||
            this.spinners.showAutoLayoutSpinner ||
            this.spinners.showRetrieveInterviewHistorySpinner ||
            this.requiredVariablesLoading
        );
    }

    get spinnerAlternativeText() {
        return LABELS.spinnerAlternativeText;
    }

    get isRunDebugDisabled() {
        return this.hasNotBeenSaved || !this.retrievedHeaderUrls || !this.canRunDebugWithVAD;
    }

    get toolboxElements() {
        return [...this.supportedElements];
    }

    get headerConfig() {
        return this.getConfig(EDITOR_COMPONENT_CONFIGS.HEADER_CONFIG);
    }

    get toolbarConfig() {
        return this.getConfig(EDITOR_COMPONENT_CONFIGS.TOOLBAR_CONFIG);
    }

    get showCanvasModeToggle() {
        return this.toolbarConfig.showCanvasModeToggle && !isAutoLayoutCanvasOnly(this.properties.processType);
    }

    get leftPanelConfig() {
        return this.getConfig(EDITOR_COMPONENT_CONFIGS.LEFT_PANEL_CONFIG);
    }

    get rightPanelConfig() {
        return this.getConfig(EDITOR_COMPONENT_CONFIGS.RIGHT_PANEL_CONFIG);
    }

    get canvasConfig() {
        return this.getConfig(EDITOR_COMPONENT_CONFIGS.CANVAS_CONFIG);
    }

    get showLeftPanel() {
        return !!this.leftPanelConfig.showLeftPanel && !this.isSelectionMode;
    }

    get showDebugPanel() {
        return !!this.rightPanelConfig.showDebugPanel;
    }

    get showDebugButton() {
        // Hardcoded to hide debug button in orchestrator
        // TODO:  W-8146747
        return !!this.toolbarConfig.showDebugButton && this.properties.processType !== FLOW_PROCESS_TYPE.ORCHESTRATOR;
    }

    get showRunButton() {
        // Hardcoded to hide run button in Record-Triggered Orchestration
        // TODO:  W-8146747
        return (
            !!this.toolbarConfig.showRunButton &&
            (this.properties.processType !== FLOW_PROCESS_TYPE.ORCHESTRATOR ||
                !this.triggerType ||
                this.triggerType === FLOW_TRIGGER_TYPE.NONE)
        );
    }

    get showRightPanel() {
        return this.showPropertyEditorRightPanel || this.showDebugPanel;
    }

    get showDebugAgainButton() {
        return this.toolbarConfig.showRestartRunButton && !this.hideDebugAgainButton;
    }

    @api
    get blockDebugResume() {
        return this.builderMode === BUILDER_MODE.DEBUG_MODE && this.ifBlockResume;
    }

    get debugTraces() {
        return this.debugData || {};
    }

    get interviewLabel() {
        const options = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        };
        const time =
            this.debugData &&
            this.debugData.startInterviewTime &&
            this.debugData.startInterviewTime.toLocaleDateString(undefined, options);
        return this.properties.label + ' ' + time;
    }

    get hasUnsavedChangesAfterTogglingCanvas() {
        // this.properties.hasUnsavedChanges when toggling canvas modes will always be true because
        // the property to track current canvas mode gets changed, so we rely on this.isUndoDisabled instead
        return !this.isUndoDisabled;
    }

    get shouldResetExistingGoTos() {
        // We want to reset existing gotos if the user has toggled from alc to free form and made changes
        // OR if we are on a flow that has been saved in free form. If the user has just toggled back and forth
        // between alc and ffc without making any changes, we want to preserve the existing goTos.
        return (
            this.hasUnsavedChangesAfterTogglingCanvas ||
            (!this.properties.isAutoLayoutCanvas && !this.properties.hasUnsavedChanges)
        );
    }

    /**
     * Method to return the config based on the passed component(leftPanel, canvas etc.) config value.
     *
     * @param componentConfig - The component configuration name
     * @returns the configuration
     */
    getConfig = (componentConfig) => {
        return (
            (this.builderConfig &&
                this.builderConfig.componentConfigs &&
                this.builderConfig.componentConfigs[this.builderMode] &&
                this.builderConfig.componentConfigs[this.builderMode][componentConfig]) ||
            {}
        );
    };

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.isUndoDisabled = !isUndoAvailable();
        this.isRedoDisabled = !isRedoAvailable();
        const { status, processType: flowProcessType, definitionId } = currentState.properties;
        this.flowStatus = status;
        const flowTriggerType = getTriggerType();
        const flowRecordTriggerType = getRecordTriggerType();
        const flowProcessTypeChanged = flowProcessType && flowProcessType !== this.properties.processType;
        const recordTriggerTypeChanged = flowRecordTriggerType !== this.recordTriggerType;
        const triggerTypeChanged = flowTriggerType !== this.triggerType;
        if (flowProcessTypeChanged || triggerTypeChanged) {
            this.spinners.showAutoLayoutSpinner = true;
            const toolboxPromise = getToolboxElements(flowProcessType, flowTriggerType).then((supportedElements) => {
                this.supportedElements = supportedElements;
            });
            let palettePromise;
            if (flowProcessTypeChanged) {
                const { loadPeripheralMetadataPromise, loadPalettePromise } = loadOnProcessTypeChange(
                    flowProcessType,
                    flowTriggerType,
                    flowRecordTriggerType,
                    definitionId
                );
                this.propertyEditorBlockerCalls.push(loadPeripheralMetadataPromise);

                palettePromise = loadPalettePromise.then((data) => {
                    this.palette = data;
                });

                if (!isVersioningDataInitialized()) {
                    loadVersioningData();
                }
            }

            if (triggerTypeChanged) {
                this.triggerType = flowTriggerType;
                if (this.triggerType && this.triggerType !== FLOW_TRIGGER_TYPE.NONE) {
                    getTriggerTypeInfo(flowTriggerType);
                }
                if (this.triggerType && this.triggerType === FLOW_TRIGGER_TYPE.PLATFORM_EVENT) {
                    const loadEventTypesManagedSetup = fetchOnce(
                        SERVER_ACTION_TYPE.GET_EVENT_TYPES,
                        { eventType: MANAGED_SETUP },
                        { disableErrorModal: true }
                    ).then((eventTypesData) => {
                        setEventTypes(eventTypesData, MANAGED_SETUP);
                    });
                    this.propertyEditorBlockerCalls.push(loadEventTypesManagedSetup);
                }
                if (!flowProcessTypeChanged) {
                    const { loadPeripheralMetadataPromise } = loadOnTriggerTypeChange(
                        flowProcessType,
                        flowTriggerType,
                        flowRecordTriggerType
                    );
                    this.propertyEditorBlockerCalls.push(loadPeripheralMetadataPromise);
                }
            }

            Promise.all([toolboxPromise, palettePromise]).then(() => {
                if (this.palette) {
                    this.elementsMetadata = getElementsMetadata(
                        this.toolboxElements,
                        this.palette,
                        this.elementsMetadata
                    );
                    this.spinners.showAutoLayoutSpinner = false;
                }
            });
        }
        // load operators and operator rules when triggerType or recordTriggerType is changed
        if (triggerTypeChanged || recordTriggerTypeChanged) {
            this.triggerType = flowTriggerType;
            this.recordTriggerType = flowRecordTriggerType;
            this.propertyEditorBlockerCalls.push(
                loadOperatorsAndRulesOnTriggerTypeChange(flowProcessType, flowTriggerType, flowRecordTriggerType)
            );
        }

        this.properties = currentState.properties;
        this.showWarningIfUnsavedChanges();
        if (!getRunInModes()) {
            const getRunInModesCall = fetchOnce(SERVER_ACTION_TYPE.GET_RUN_IN_MODES, {}).then((data) => {
                setRunInModes(data);
            });
            this.propertyEditorBlockerCalls.push(getRunInModesCall);
        }

        // Update the property editor to receive any changes made from another
        // subsystem (like the canvas)
        if (this.elementBeingEditedInPanel) {
            const elementFromStore = getElementByGuid(this.elementBeingEditedInPanel.guid);
            this.elementBeingEditedInPanel = elementFromStore ? getElementForPropertyEditor(elementFromStore) : null;
        }

        this.executeGuardrails(currentState);
    };

    executeGuardrails(flowState) {
        const canvasInitialized =
            !this.properties.isAutoLayoutCanvas || flowState.elements[ELEMENT_TYPE.ROOT_ELEMENT] != null;

        if (
            isGuardrailsEnabled() &&
            this.guardrailsParams &&
            this.guardrailsParams.running &&
            canvasInitialized &&
            !this.disableGuardrails
        ) {
            const flow = translateUIModelToFlow(flowState);
            this.guardrailsEngine.evaluate(flow).then((results) => {
                this.dispatchEvent(new GuardrailsResultEvent(results));
            });
        }
    }

    /**
     * Checks if we can convert to auto-layout
     *
     * @param gack - Whether we should gack if the check fails
     * @returns true if we can convert, false otherwise
     */
    canConvertToAutoLayoutCheck(gack = false) {
        return canConvertToAutoLayoutCanvas(
            addEndElementsAndConnectorsTransform(deepCopy(storeInstance.getCurrentState())),
            this.properties.definitionId ? this.properties.definitionId : this.flowInitDefinitionId,
            gack,
            { resetExistingGoTos: this.shouldResetExistingGoTos }
        );
    }

    /**
     * Callback which gets executed once we get the flow from java controller
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     * In case of data retrieved from a template, data points directly to flow.metadata
     * @param has.data -
     * @param has.error -
     */
    getFlowCallback = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
            this.spinners.showFlowMetadataSpinner = false;
            this.isFlowServerCallInProgress = false;
            this.flowRetrieveError = error;
        } else {
            this.flowRetrieveError = null;
            // We need to load the parameters first, so as having some information needed at the factory level (e.g. for Action with anonymous output we need parameter related information see actionCall#createActionCall)
            // Also needed to load entity/eventType for the start element on canvas.
            this.preloadRequiredDatafromFlowMetadata(data).then(() => {
                storeInstance.dispatch(updateFlow(translateFlowToUIModel(data)));

                if (this.properties.isAutoLayoutCanvas) {
                    if (this.canConvertToAutoLayoutCheck(true)) {
                        this.updateCanvasMode(this.properties.isAutoLayoutCanvas);
                    } else {
                        // @W-8249637: fallback to free form if we can't convert to auto-layout
                        storeInstance.dispatch(updateIsAutoLayoutCanvasProperty(false));
                    }
                }

                if (!data.metadata) {
                    // service does not return the api name but the api name lower cased

                    this._resetFlowPropertiesWhenCreatedFromTemplate();
                }
                this.setOriginalFlowValues();
                this.cacheSObjectsInComboboxShape();
                this.loadFieldsForComplexTypesInFlow();
                this.loadReferencesInFlow();
                this.isFlowServerCallInProgress = false;
            });
        }
        if (data && data.metadata) {
            this.canRunDebugWithVAD = canRunDebugWith(data.metadata.runInMode, data.metadata.status);
        }
    };

    preloadRequiredDatafromFlowMetadata(data) {
        const promises = [];
        const flowMetadata = data.metadata || data;
        if (flowMetadata.start) {
            const { object, triggerType } = flowMetadata.start;
            if (triggerType && object) {
                if (triggerType === FLOW_TRIGGER_TYPE.SCHEDULED || isRecordChangeTriggerType(triggerType)) {
                    promises.push(loadEntity(object));
                } else if (triggerType === FLOW_TRIGGER_TYPE.PLATFORM_EVENT) {
                    promises.push(loadEventType(MANAGED_SETUP, object));
                }
            }
        }
        promises.push(loadParametersForInvocableApexActionsInFlowFromMetadata(flowMetadata.actionCalls));
        promises.push(loadFieldsForExtensionsInFlowFromMetadata(screenFieldsReferencedByLoops(flowMetadata)));
        return Promise.all(promises);
    }

    /**
     * This is called when the flow has been loaded or successfully saved, so that we always have the label, description and
     * interviewLabel of the version of the flow that is currently persisted in the DB. This is so that if the user attempts to
     * save a new version, having changed any of these values, and the save fails, then we can revert back to the original values.
     */
    setOriginalFlowValues() {
        this.originalFlowLabel = this.properties.label;
        this.originalFlowDescription = this.properties.description;
        this.originalFlowInterviewLabel = this.properties.interviewLabel;
    }

    cacheSObjectsInComboboxShape() {
        const currentState = storeInstance.getCurrentState();
        // Only gets elements with sObject datatype (no collections)
        const sobjects = getSObjectOrSObjectCollectionByEntityElements(currentState.elements);
        for (let i = 0; i < sobjects.length; i++) {
            // add sobject element to combobox cache in required shape
            const sObjectInComboboxShape = mutateFlowResourceToComboboxShape(sobjects[i]);
            addToParentElementCache(sObjectInComboboxShape.displayText, sObjectInComboboxShape);
        }
    }

    /**
     * This is called once the flow has been loaded, so that flow complex types have their fields loaded and cached.
     */
    loadFieldsForComplexTypesInFlow() {
        const currentState = storeInstance.getCurrentState();
        this.propertyEditorBlockerCalls.push(loadFieldsForComplexTypesInFlow(currentState));
    }

    /**
     * Callback which gets executed after saving a flow
     *
     * @param has error property if there is error fetching the data else has data property
     * @param has.data -
     * @param has.error -
     */
    saveFlowCallback = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
            this.ifBlockResume = false;
        } else if (data.isSuccess) {
            this.currentFlowId = data.flowId;
            updateStoreAfterSaveFlowIsSuccessful(storeInstance, data);
            updateUrl(this.currentFlowId);
            this.setOriginalFlowValues();
            this._resetSelectionState();
        } else if (!data.isSuccess && this.saveType === SaveType.NEW_DEFINITION) {
            // If the save failed and saveType === SaveType.NEW_DEFINITION, then clear the flowId from the url
            // and reset some of the flow properties as if this is a net new flow
            this.currentFlowId = undefined;
            updateStoreAfterSaveAsNewFlowIsFailed(storeInstance);
            updateUrl();
        } else if (!data.isSuccess && this.saveType === SaveType.NEW_VERSION) {
            updateStoreAfterSaveAsNewVersionIsFailed(
                storeInstance,
                this.originalFlowLabel,
                this.originalFlowDescription,
                this.originalFlowInterviewLabel
            );
        }

        if (data && !data.isSuccess) {
            this.ifBlockResume = false;
        }

        this.clearUndoRedoStack();

        if (this.currentFlowId) {
            this.hasNotBeenSaved = false;
            this.saveAndPendingOperationStatus = FLOW_STATUS.SAVED;
        } else {
            this.hasNotBeenSaved = true;
            this.saveAndPendingOperationStatus = null;
        }
        this.disableSave = false;
        this.flowErrorsAndWarnings = setFlowErrorsAndWarnings(data);

        if (data) {
            this.canRunDebugWithVAD = canRunDebugWith(data.runInMode, data.status);
        }
    };

    /**
     * Callback which gets executed after getting data urls for header
     *
     * @param data -
     */
    getHeaderUrlsCallBack = (data) => {
        let isFromAloha = getPreferredExperience() === CLASSIC_EXPERIENCE;
        if (window.location.search.indexOf('isFromAloha=true') >= 0) {
            isFromAloha = true;
        }
        this.backUrl = isFromAloha
            ? this.buildBackUrlForAloha(data.flowUrl)
            : this.buildBackUrlForLightning(data.lightningFlowUrl);
        this.helpUrl = data.helpUrl;
        this.trailheadUrl = data.trailheadUrl;
        this.trailblazerCommunityUrl = data.trailblazerCommunityUrl;
        this.runDebugUrl = data.runDebugUrl;
        this.retrievedHeaderUrls = true;
    };

    /**
     * Helper method to construct the detail page back url for Aloha
     *
     * @param url - base url which we build on to construct the url for the detail page
     * @returns The back url for aloha
     */
    buildBackUrlForAloha = (url: string) => {
        if (this.currentFlowDefId) {
            url = '/' + this.currentFlowDefId;
        }
        return url;
    };

    /**
     * Helper method to construct the detail page back url for Lightning
     *
     * @param url - base url which we build on to construct the url for the detail page
     * @returns The back url for Lightning
     */
    buildBackUrlForLightning = (url: string) => {
        if (this.currentFlowDefId) {
            url = url.split('/home')[0] + '/page?address=' + encodeURIComponent('/' + this.currentFlowDefId);
        }
        return url;
    };

    /**
     * Callback after run debug interivew initiated by the debug modal
     *
     * @param debugModal -
     */
    runDebugInterviewCallback = (debugModal) => {
        const debugOptions = debugModal.get('v.body')[0].getDebugInput() || {};
        this.spinners.showDebugSpinner = true;
        const startInterviewTime = new Date();
        const enableRollbackMode = !!debugOptions.enableRollback;
        const runAsyncScheduledPathOption = getScheduledPathsList().find(
            (option) => SCHEDULED_PATH_TYPE.RUN_ASYNC === option.pathType
        );
        const pathType =
            runAsyncScheduledPathOption && runAsyncScheduledPathOption.value === debugOptions.scheduledPathSelection
                ? runAsyncScheduledPathOption.pathType
                : null;
        fetch(
            SERVER_ACTION_TYPE.RUN_DEBUG,
            ({ data, error }) => {
                try {
                    if (error) {
                        // Handle server exception here if something is needed beyond our automatic server error popup
                    } else {
                        // Setup the debug data object for the debug panel, and switch to debug mode
                        this.ifBlockResume = false;
                        this.builderMode = BUILDER_MODE.DEBUG_MODE;
                        this.hideDebugAgainButton = false;
                        const endInterviewTime = new Date();
                        const response = debugInterviewResponseCallback(
                            data,
                            storeInstance,
                            this.properties.hasUnsavedChanges
                        );
                        this.debugData = Object.assign(response, {
                            startInterviewTime,
                            endInterviewTime,
                            enableRollbackMode
                        });

                        this.clearUndoRedoStack();
                    }
                    this.spinners.showDebugSpinner = false;
                    hidePopover();
                } catch (e) {
                    this.spinners.showDebugSpinner = false;
                    throw e;
                }
            },
            {
                flowDevName: storeInstance.getCurrentState().properties.name,
                flowVersionId: this.flowId,
                arguments: JSON.stringify(debugOptions.inputs),
                enabledTrace: true,
                enableRollbackMode: !!debugOptions.enableRollback,
                useLatestSubflow: true,
                showGovernorlimit: true,
                debugAsUserId: debugOptions.debugAsUserId,
                debugWaits: !!debugOptions.debugWaits,
                ignoreEntryCriteria: !!debugOptions.ignoreEntryCriteria,
                dmlType: debugOptions.dmlType,
                scheduledPathSelection: debugOptions.scheduledPathSelection,
                pathType
            }
        );
    };

    handleResumeDebugFlow = (event) => {
        if (!this.blockDebugResume) {
            this.spinners.showDebugSpinner = true;

            // Keep the original start time
            const startInterviewTime = this.debugData.startInterviewTime;
            // Record enableRollbackMode for next resume
            const enableRollback = !!this.debugData.enableRollbackMode;
            fetch(
                SERVER_ACTION_TYPE.RESUME_DEBUG_INTERVIEW,
                ({ data, error }) => {
                    try {
                        if (error) {
                            // Handle server exception here if something is needed beyond our automatic server error popup
                        }
                        this.hideDebugAgainButton = false;
                        const endInterviewTime = new Date();
                        const response = debugInterviewResponseCallback(
                            data,
                            storeInstance,
                            this.properties.hasUnsavedChanges,
                            true
                        );
                        this.debugData = Object.assign(response, {
                            startInterviewTime,
                            endInterviewTime,
                            enableRollback
                        });

                        this.spinners.showDebugSpinner = false;
                        this.ifDuringRunOrDebug = true;
                    } catch (e) {
                        this.spinners.showDebugSpinner = false;
                        throw e;
                    }
                },
                {
                    showGovernorlimit: true,
                    enabledTrace: true,
                    enableRollbackMode: enableRollback,
                    useLatestSubflow: true,
                    serializedInterview: this.debugData.serializedInterview,
                    waitEvent: event.detail.waitEventName
                }
            );
        }
    };

    /**
     * Helper method to construct the url for the run/debug mode and launch the window in a new tab
     *
     * @param {string} runOrDebug - Used for deciding whether the user is trying to run the flow or debug it.
     */
    runOrDebugFlow = (runOrDebug = RUN) => {
        const currentState = storeInstance.getCurrentState();
        let url;

        if (currentState && currentState.properties) {
            const flowDevName = currentState.properties.name;
            url = `${this.runDebugUrl}${flowDevName}/${this.flowId}`;
            if ((runOrDebug === NEWDEBUG || runOrDebug === RESTARTDEBUG) && this.useNewDebugExperience) {
                let triggerSaveType = null;
                let startObject = null;
                let createOrUpdate = false;
                let showScheduledPathComboBox = false;
                let startElement = null;
                const scheduledPathsList = getScheduledPathsList();
                const defaultPath = scheduledPathsList?.length > 0 ? scheduledPathsList[0].value : null;
                if (isRecordChangeTriggerType(this.triggerType)) {
                    triggerSaveType = getRecordTriggerType();
                    createOrUpdate = triggerSaveType === FLOW_TRIGGER_SAVE_TYPE.CREATE_AND_UPDATE;
                    startObject = getStartObject();
                    startElement = getStartElement();
                    showScheduledPathComboBox =
                        shouldSupportScheduledPaths(startElement) && scheduledPathsList?.length > 0;
                    if (startObject) {
                        // This should never be empty in a record change trigger where the debug button is clickable, but might as well check.
                        startObject = getEntity(startObject).entityLabel;
                    }
                }
                this.queueOpenFlowDebugEditor(() => {
                    return {
                        flowId: this.flowId,
                        flowDevName,
                        processType: this.properties.processType,
                        triggerType: this.triggerType,
                        rerun: runOrDebug === RESTARTDEBUG,
                        isCreateOrUpdate: createOrUpdate,
                        recordTriggerType: triggerSaveType,
                        dollarRecordName: startObject,
                        scheduledPathsList,
                        showScheduledPathComboBox,
                        defaultPath,
                        runDebugInterviewCallback: this.runDebugInterviewCallback
                    };
                });
                return;
            }
            if (runOrDebug === DEBUG) {
                url = `${url}?flow__debug=true`;
            }
        }

        window.open(url, '_blank');
    };

    /**
     * Call back for before unload event
     * It will invoke a default browser warning when user tries to leave the flow builder
     *
     * @param {Object} event before unload event
     */
    beforeUnloadCallback = (event) => {
        event.preventDefault();
        // Chrome requires returnValue to be set.
        event.returnValue = '';
    };

    /**
     * Add before unload event listener when flow has unsaved changes
     * Remove before unload event listener when flow has no unsaved changes
     * It is called when state of store is changed
     */
    showWarningIfUnsavedChanges = () => {
        if (this.properties.hasUnsavedChanges) {
            window.addEventListener('beforeunload', this.beforeUnloadCallback);
        } else {
            window.removeEventListener('beforeunload', this.beforeUnloadCallback);
        }
    };

    /**
     * Function to close the contextual menu in Auto-Layout Canvas as needed
     */
    closeAutoLayoutContextualMenu = () => {
        if (this.properties.isAutoLayoutCanvas) {
            const alcCanvasContainer = this.template.querySelector(PANELS.AUTOLAYOUT_CANVAS);
            if (alcCanvasContainer) {
                alcCanvasContainer.callCloseNodeOrConnectorMenuInBuilder();
            }
        }
    };

    handleLeftPanelAndToolbarInteraction = () => {
        this.closeAutoLayoutContextualMenu();
    };

    /**
     * Handles the toggleSelectionMode event and toggles the isSelectionMode
     * Toggle selection mode also closes the property editor panel
     */
    handleToggleSelectionMode = () => {
        this.isSelectionMode = !this.isSelectionMode;
        this.handleClosePropertyEditor();
        this.template.querySelector(PANELS.TOOLBAR).focus();
    };

    /**
     * Handles Selection on Fixed Layout Canvas
     *
     * @param {object} event Selection event coming from alcCanvas
     */
    handleSelectionOnFixedCanvas = (event) => {
        if (event && event.detail) {
            const {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                allowAllDisabledElements
            } = event.detail;
            const payload = {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids,
                allowAllDisabledElements
            };
            storeInstance.dispatch(selectionOnFixedCanvas(payload));

            this.topSelectedGuid = event.detail.topSelectedGuid;
            this.isCutCopyDisabled = !event.detail.topSelectedGuid;
        }
    };

    handleAddElementFault = (event) => {
        storeInstance.dispatch(addElementFault(event.detail.guid));
    };

    handleDeleteElementFault = (event) => {
        storeInstance.dispatch(deleteElementFault(event.detail.guid));
    };

    /**
     * Handles the copy event coming from the Element Action Contextual Menu and
     * updates the appropriate properties
     *
     * @param event - The copy single element event
     */
    handleCopySingleElement = (event) => {
        const { elementGuid } = event.detail;
        const elements = storeInstance.getCurrentState().elements;
        const copiedElement = elements[elementGuid];

        this.cutOrCopiedCanvasElements = {
            [copiedElement.guid]: copiedElement
        };
        this.cutOrCopiedChildElements = getCopiedChildElements(elements, copiedElement);
        this.topCutOrCopiedGuid = elementGuid;
        this.bottomCutOrCopiedGuid = elementGuid;
        this.isPasteAvailable = true;
    };

    /**
     * Handles the copy event from the toolbar and updates the appropriate properties
     */
    handleCopy = () => {
        const elements = storeInstance.getCurrentState() && storeInstance.getCurrentState().elements;
        this.topCutOrCopiedGuid = this.topSelectedGuid;
        const { copiedCanvasElements, copiedChildElements, bottomCutOrCopiedGuid } = getCopiedData(
            elements,
            this.topCutOrCopiedGuid
        );
        this.cutOrCopiedCanvasElements = copiedCanvasElements;
        this.cutOrCopiedChildElements = copiedChildElements;
        this.bottomCutOrCopiedGuid = bottomCutOrCopiedGuid;

        this.isPasteAvailable = true;

        // Toggling out of the selection mode on Copy
        this.handleToggleSelectionMode();
    };

    /**
     * Handles the paste event and dispatches the pasteOnFixedCanvas action to the store
     *
     * @param event - The paste event
     */
    handlePasteOnCanvas = (event) => {
        const { prev, next, parent, childIndex } = event.detail;

        const { canvasElementGuidMap, childElementGuidMap } = getPasteElementGuidMaps(
            this.cutOrCopiedCanvasElements,
            this.cutOrCopiedChildElements
        );

        const payload = {
            canvasElementGuidMap,
            childElementGuidMap,
            cutOrCopiedCanvasElements: this.cutOrCopiedCanvasElements,
            cutOrCopiedChildElements: this.cutOrCopiedChildElements,
            topCutOrCopiedGuid: this.topCutOrCopiedGuid,
            bottomCutOrCopiedGuid: this.bottomCutOrCopiedGuid,
            prev,
            next,
            parent,
            childIndex
        };
        storeInstance.dispatch(pasteOnFixedCanvas(payload));
    };

    /**
     * Handles the duplicate event fired from the Toolbar and dispatches a duplication action only if there's something
     * that can be duplicated
     */
    handleDuplicate = () => {
        const currentState = storeInstance.getCurrentState();
        const {
            canvasElementGuidMap,
            childElementGuidMap,
            unduplicatedCanvasElementsGuids
        } = getDuplicateElementGuidMaps(currentState.canvasElements, currentState.elements);

        if (canvasElementGuidMap && Object.keys(canvasElementGuidMap).length > 0) {
            const connectorsToDuplicate = getConnectorToDuplicate(currentState.connectors, canvasElementGuidMap);

            const payload = {
                canvasElementGuidMap,
                childElementGuidMap,
                connectorsToDuplicate,
                unduplicatedCanvasElementsGuids
            };
            storeInstance.dispatch(doDuplicate(payload));

            if (this.usePanelForPropertyEditor) {
                const editElementEvent = new EditElementEvent(Object.values(canvasElementGuidMap)[0]);
                this.handleEditElement(editElementEvent);
            }
        }
    };

    /**
     * Handles the edit flow properties event fired by the toolbar. Opens the flow properties property editor with
     * the current values for the flow properties.
     */
    handleEditFlowProperties = () => {
        const mode = EditElementEvent.EVENT_NAME;
        // Pop flow properties editor and do the following on callback.
        const flowProperties = storeInstance.getCurrentState().properties;
        const triggerType = getTriggerType();
        const nodeUpdate = flowPropertiesCallback(storeInstance);
        const newResourceCallback = this.newResourceCallback;

        const forceModal = ELEMENT_TYPES_TO_ALWAYS_EDIT_IN_MODAL.includes(ELEMENT_TYPE.FLOW_PROPERTIES);

        this.queueOpenPropertyEditor(() => {
            const node = getElementForPropertyEditor(Object.assign({}, flowProperties, { triggerType }));
            node.saveType = SaveType.UPDATE;
            return {
                mode,
                node,
                nodeUpdate,
                newResourceCallback
            };
        }, forceModal);
    };

    /**
     * Handles the undo event fired by toolbar.
     * Dispatches a Store Undo Action if undo is available.
     */
    handleUndo = () => {
        if (!this.isUndoDisabled) {
            storeInstance.dispatch(undo);
        }
    };

    /**
     * Handles the redo event fired by toolbar.
     * Dispatches a Store Redo Action if redo is available.
     */
    handleRedo = () => {
        if (!this.isRedoDisabled) {
            storeInstance.dispatch(redo);
        }
    };

    /**
     * Handles the edit flow event fired by the toolbar, and switches the current builder mode to Edit mode.
     */
    handleEditFlow = () => {
        this.builderMode = BUILDER_MODE.EDIT_MODE;
        storeInstance.dispatch(clearCanvasDecoration);
        this.clearUndoRedoStack();
    };

    /**
     * Handles the run flow event fired by the toolbar. Opens and runs the flow in a different tab or a modal.
     */
    handleRunFlow = () => {
        this.runOrDebugFlow();
    };

    /**
     * Handles the debug flow event fired by the toolbar. Opens the flow debug window in a different tab or a modal.
     */
    handleDebugFlow = () => {
        this.runOrDebugFlow(DEBUG);
    };

    /**
     * Handles the debug on canvas flow event fired byt toolbar. Opens the debug popover modal in the builder app
     */
    handleNewDebugFlow = () => {
        if (this.properties.hasUnsavedChanges) {
            invokeModal({
                headerData: {
                    headerTitle: LABELS.newDebugUnsavedChangesHeaderTitle
                },
                bodyData: {
                    bodyTextOne: LABELS.newDebugUnsavedChangesBodyTextLabel,
                    bodyVariant: modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE
                },
                footerData: {
                    buttonOne: {
                        buttonVariant: 'Brand',
                        buttonLabel: LABELS.cancelButtonLabel
                    },
                    buttonTwo: {
                        buttonLabel: LABELS.continueToDebugTitle,
                        buttonCallback: () => this.runOrDebugFlow(NEWDEBUG)
                    }
                },
                headerClass: 'slds-theme_alert-texture slds-theme_warning',
                bodyClass: 'slds-p-around_medium'
            });
        } else {
            this.runOrDebugFlow(NEWDEBUG);
        }
    };

    /**
     * Handles the Debug Again (aka restartdebugflow) even fired by the toolbar when in DEBUG MODE. Opens debug modal in builder
     */
    handleRestartDebugFlow = () => {
        this.runOrDebugFlow(RESTARTDEBUG);
    };

    /**
     * Handles the save flow event fired by a toolbar. Saves the flow if the flow has already been created.
     * Pops the flowProperties property editor if the flow is being saved for the first time.
     *
     * @param {object} event when save or save as buttons are clicked
     */
    handleSaveFlow = (event) => {
        this.setElementBeingEditedInPanelAsNotNew();

        if (event && event.detail && event.detail.type) {
            const eventType = event.detail.type;
            let flowProperties = storeInstance.getCurrentState().properties;
            const triggerType = getTriggerType();
            const saveType = getSaveType(eventType, this.currentFlowId, flowProperties.canOnlySaveAsNewDefinition);
            if (saveType === SaveType.UPDATE) {
                this.saveFlow(SaveType.UPDATE);
            } else {
                const nodeUpdate = saveAsFlowCallback(storeInstance, this.saveFlow);
                const newResourceCallback = this.newResourceCallback;
                this.queueOpenPropertyEditor(() => {
                    flowProperties = getElementForPropertyEditor(Object.assign({}, flowProperties, { triggerType }));
                    flowProperties.saveType = saveType;
                    return {
                        mode: eventType,
                        node: flowProperties,
                        nodeUpdate,
                        newResourceCallback
                    };
                }, true);
            }
        }
    };

    /**
     * Handles the toggle flow status event fired by a toolbar. Changes the flow status from obsolete or
     * draft to active or vice versa.
     */
    handleToggleFlowStatus = () => {
        const params = { flowId: this.flowId };
        fetch(SERVER_ACTION_TYPE.TOGGLE_FLOW_STATUS, this.toggleFlowStatusCallBack, params);
        if (this.flowStatus === FLOW_STATUS.ACTIVE) {
            this.saveAndPendingOperationStatus = FLOW_STATUS.DEACTIVATING;
        } else {
            this.saveAndPendingOperationStatus = FLOW_STATUS.ACTIVATING;
        }
        this.hasNotBeenSaved = true;
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    };

    /**
     * Callback which gets executed after activating a flow using the in-editor activate button
     *
     * @param has error property if there is error fetching the data else has data property
     * @param has.data -
     * @param has.error -
     */
    toggleFlowStatusCallBack = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else if (!data.isSuccess) {
            this.flowErrorsAndWarnings = setFlowErrorsAndWarnings(data);
        } else {
            storeInstance.dispatch(
                updatePropertiesAfterActivateButtonPress({
                    status: data.status,
                    lastModifiedDate: data.lastModifiedDate,
                    lastModifiedBy: data.lastModifiedBy
                })
            );
            this.clearUndoRedoStack();
        }
        this.saveAndPendingOperationStatus = FLOW_STATUS.SAVED;
        this.hasNotBeenSaved = false;
    };

    async showPropertyEditor(params, forceModal = false) {
        if (this.usePanelForPropertyEditor && !forceModal) {
            await this.handleClosePropertyEditor(false);

            this.showPropertyEditorRightPanel = true;
            this.propertyEditorParams = getPropertyEditorConfig(params.mode, params);
            this.propertyEditorParams.panelConfig.isLabelCollapsibleToHeader = true;
            this.propertyEditorParams.panelConfig.isFieldLevelCommitEnabled = true;
            this.elementBeingEditedInPanel = params.node;
        } else {
            invokePropertyEditor(PROPERTY_EDITOR, params);
        }
    }

    queueOpenPropertyEditor = async (paramsProvider, forceModal = false, designateFocus = false) => {
        this.spinners.showPropertyEditorSpinner = true;

        try {
            await Promise.all(this.propertyEditorBlockerCalls);

            this.spinners.showPropertyEditorSpinner = false;
            this.propertyEditorBlockerCalls = [];
            await this.showPropertyEditor(await paramsProvider(), forceModal);

            if (designateFocus) {
                this.handleFocusPropertyEditor();
            }
        } catch (e) {
            // we don't open the property editor because at least one promise was rejected
            this.spinners.showPropertyEditorSpinner = false;
        }
    };

    /**
     * Queuing up the call out for display debug editor's pop-over modal.
     *
     * @param paramsProvider - The invoke Debug editor parameters
     */
    queueOpenFlowDebugEditor = (paramsProvider) => {
        // borrow editor's spinner, UX approved.
        this.spinners.showPropertyEditorSpinner = true;
        // debug editor probably has pre setup also.
        Promise.all(this.debugEditorBlockerCalls)
            .then(() => {
                this.spinners.showPropertyEditorSpinner = false;
                this.debugEditorBlockerCalls = [];
                invokeDebugEditor(paramsProvider());
            })
            .catch(() => {
                this.spinners.showPropertyEditorSpinner = false;
            });
    };

    /**
     * Handle click event fired by a child component. Fires another event
     * containing resources information, which is handled by container.cmp.
     *
     *  @param {object} event - when add resource button is clicked.
     */
    handleAddResourceElement = (event) => {
        const mode = event.type;
        const nodeUpdate = this.deMutateAndAddNodeCollection;
        this._isAddingResourceViaLeftPanel = event.detail.viaLeftPanel;

        this.queueOpenPropertyEditor(
            () => ({
                mode,
                nodeUpdate
            }),
            true
        );
    };

    /**
     * the callback function to move focus correctly when closing property editor
     *
     * @param source - The source for the connection
     */
    moveFocusToConnector = (source: ConnectionSource) => {
        const alcCanvasContainer = this.template.querySelector('builder_platform_interaction-alc-canvas-container');
        alcCanvasContainer.focusOnConnector(source.guid, source.childIndex);
    };

    /** *********** Canvas and Node Event Handling */

    /**
     * Handles the add element event which is fired after an element from left palette is dropped
     * on the canvas or via a click to add interaction.
     *
     * @param event an AddElementEvent
     */
    handleAddCanvasElement = (event: AddElementEvent) => {
        if (storeInstance && storeInstance.getCurrentState().properties.lastInlineResourceGuid) {
            storeInstance.dispatch(removeLastCreatedInlineResource);
        }

        if (event && event.type && event.detail) {
            logPerfTransactionStart('PropertyEditor');
            const mode = event.type;
            const {
                elementType,
                elementSubtype,
                locationX,
                locationY,
                actionType,
                actionName,
                parent,
                designateFocus,

                // TODO: we are passing alcConnectionSource information here, but ideally we should remove it and expose
                // a method that creates an element and returns a promise. Then that method can be called the
                // @flow-builder/auto-layout-canvas-ui code, which can then take care of connection source stuff.
                alcConnectionSource
            } = event.detail;

            // If displaying in a modal then the element is added at the end via nodeUpdate.
            // In a panel, the element is added upon opening and nodeUpdate updates
            const nodeUpdate = this.usePanelForPropertyEditor
                ? this.deMutateAndUpdateNodeCollection
                : // creating a closure here to pass thru alcConnectionSource to deMutateAndAddNodeCollection when it is called
                  (node, parentGuid) => this.deMutateAndAddNodeCollection(node, parentGuid, alcConnectionSource);
            const moveFocusOnCloseCallback = this.moveFocusToConnector;
            const newResourceCallback = this.newResourceCallback;
            const editResourceCallback = this.editResourceCallback;
            const processType = this.properties.processType;
            const triggerType = getTriggerType();

            // skip the editor for elements that don't need one
            if (elementType === ELEMENT_TYPE.END_ELEMENT) {
                const endElement = createEndElement();

                this.dispatchAddElement({ ...endElement, alcConnectionSource });
                return;
            }

            this.queueOpenPropertyEditor(
                async () => {
                    // getElementForPropertyEditor need to be called after propertyEditorBlockerCalls
                    // has been resolved
                    const node = getElementForPropertyEditor({
                        locationX,
                        locationY,
                        elementType,
                        elementSubtype,
                        actionType,
                        actionName,
                        parent,
                        isNew: true
                    });
                    // For a panel, the element is created upon opening the property editor
                    // the parent guid is also passed in if a child element is being created
                    if (this.usePanelForPropertyEditor) {
                        await this.deMutateAndAddNodeCollection(node, parent, alcConnectionSource);
                        this.activeElementGuid = node.guid;
                    }

                    return {
                        mode,
                        node,
                        nodeUpdate,
                        newResourceCallback,
                        editResourceCallback,
                        processType,
                        triggerType,
                        moveFocusOnCloseCallback,
                        insertInfo: alcConnectionSource,
                        isAutoLayoutCanvas: this.properties.isAutoLayoutCanvas
                    };
                },
                false,
                designateFocus
            );
        }
    };

    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - edit element event from clicked/keyed node in which to edit
     */
    handleEditElement = (event: EditElementEvent) => {
        if (event && event.detail && event.type) {
            const { mode, canvasElementGUID: guid, designateFocus, elementType } = event.detail;

            const forceModal = elementType && ELEMENT_TYPES_TO_ALWAYS_EDIT_IN_MODAL.includes(elementType);
            this._isInlineEditingResource = false;
            this.editElement(mode, guid, forceModal, designateFocus);
        }
    };

    /**
     * Launches the merged recordChangeTriggerEditor (merged with contextRecordEditor)
     * for Record change trigger setup
     */
    handleEditStartElement = () => {
        const startElement = getStartElement();
        if (startElement) {
            this.editElement(startElement.triggerType, startElement.guid, false);
        }
    };

    /**
     * Toggles the isAutoLayoutCanvas if needed, converts the flow into the passed in canvas mode
     * and updates the store accordingly
     *
     * @param setupInAutoLayoutCanvas - Determines what mode to setup the Canvas in
     */
    updateCanvasMode(setupInAutoLayoutCanvas = false) {
        logPerfTransactionStart(TOGGLE_CANVAS_MODE);
        this.spinners.showAutoLayoutSpinner = true;
        try {
            // updatedHasUnsavedChangesProperty should be set to true only when toggling canvas modes.
            // It should be false when loading an existing flow. New Flow creation doesn't follow this code path.
            let updatedHasUnsavedChangesProperty = false;

            // In case of exiting flows, isAutoLayoutCanvas has already been updated.
            // Adding a check here to prevent unnecessary update to the store.
            if (this.properties.isAutoLayoutCanvas !== setupInAutoLayoutCanvas) {
                updatedHasUnsavedChangesProperty = true;

                // Need to disable guardrails until we have actually updated the flow, otherwise
                // guardrails will run while the isAutoLayoutCanvas and the flow state are out of sync
                this.disableGuardrails = true;

                // Updates the isAutoLayoutCanvas property in the store
                storeInstance.dispatch(updateIsAutoLayoutCanvasProperty(setupInAutoLayoutCanvas));
            }

            const flowState = storeInstance.getCurrentState();

            const autoLayoutCanvasContainer = this.template.querySelector(PANELS.AUTOLAYOUT_CANVAS);

            // OffsetX will be at left-most point of the Start Circle when switching to Free-Form.
            // Subtracting 24 (half icon width) to get to that point from the center.
            const offsetX = autoLayoutCanvasContainer ? autoLayoutCanvasContainer.clientWidth / 2 - 24 : 0;
            const options = { resetExistingGoTos: this.shouldResetExistingGoTos };
            const { elements, canvasElements, connectors } = setupInAutoLayoutCanvas
                ? convertToAutoLayoutCanvas(addEndElementsAndConnectorsTransform(deepCopy(flowState)), options)
                : removeEndElementsAndConnectorsTransform(convertToFreeFormCanvas(flowState, [offsetX, 48]));

            const payload = {
                elements,
                canvasElements,
                connectors,
                updatedHasUnsavedChangesProperty
            };

            this.disableGuardrails = false;
            // Updates the elements, canvasElements, connectors and hasUnsavedChanges property in the store
            storeInstance.dispatch(updateFlowOnCanvasModeToggle(payload));

            // Resetting Select mode and cut/copy/paste variables
            this._resetSelectionState();

            // Clearing the Undo/Redo stack after switching modes
            this.clearUndoRedoStack();

            this.spinners.showAutoLayoutSpinner = false;

            logPerfTransactionEnd(TOGGLE_CANVAS_MODE, {
                isSuccess: true,
                newMode: setupInAutoLayoutCanvas ? 'auto-layout' : 'free-form'
            });
        } catch (e) {
            this.spinners.showAutoLayoutSpinner = false;
            logPerfTransactionEnd(TOGGLE_CANVAS_MODE, { isSuccess: false });
            throw e;
        }
    }

    /**
     * Handles the ToggleCanvasMode event from the toolbar
     */
    handleToggleCanvasMode = () => {
        logInteraction(
            'toggle-canvas-button',
            'toolbar',
            {
                flowDefId: this.properties.definitionId ? this.properties.definitionId : this.flowInitDefinitionId,
                newMode: this.properties.isAutoLayoutCanvas ? 'free-form' : 'auto-layout'
            },
            'click'
        );
        if (!this.properties.isAutoLayoutCanvas) {
            // Attempt Free-Form to Auto-Layout Canvas conversion, no-gack if fails
            if (!this.canConvertToAutoLayoutCheck()) {
                const unsupportedFeatureItems = [
                    { message: LABELS.errorMessageDisconnectedElements, key: 1 },
                    { message: LABELS.errorMessageTerminatedForEach, key: 2 },
                    { message: LABELS.errorMessageEndInLoopDecision, key: 3 },
                    { message: LABELS.errorMessageEndInLoopPause, key: 4 },
                    { message: LABELS.errorMessageStepElement, key: 5 }
                ];

                invokeModal({
                    headerData: {
                        headerTitle: LABELS.unsupportedFeaturesHeaderTitle
                    },
                    bodyData: {
                        bodyTextOne: LABELS.unsupportedFeaturesBodyTextLabel,
                        bodyVariant: modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE,
                        listWarningItems: unsupportedFeatureItems
                    },
                    footerData: {
                        buttonOne: {
                            buttonLabel: LABELS.okayButtonLabel
                        },
                        footerVariant: modalFooterVariant.PROMPT
                    },
                    modalClass: 'slds-modal_prompt',
                    headerClass: 'slds-theme_alert-texture slds-theme_warning',
                    bodyClass: 'slds-p-around_medium',
                    footerClass: 'slds-theme_default'
                });
            } else if (this.hasUnsavedChangesAfterTogglingCanvas) {
                // Show a warning modal if there are unsaved changes (besides the canvas mode change) on toggle
                invokeModal({
                    headerData: {
                        headerTitle: LABELS.unsavedChangesHeaderTitle
                    },
                    bodyData: {
                        bodyTextOne: LABELS.unsavedChangesBodyTextLabel,
                        bodyVariant: modalBodyVariant.WARNING_ON_CANVAS_MODE_TOGGLE
                    },
                    footerData: {
                        buttonOne: {
                            buttonVariant: 'Brand',
                            buttonLabel: LABELS.cancelButtonLabel
                        },
                        buttonTwo: {
                            buttonLabel: LABELS.goToAutolayoutButtonLabel,
                            buttonCallback: () => this.updateCanvasMode(true)
                        }
                    },
                    headerClass: 'slds-theme_alert-texture slds-theme_warning',
                    bodyClass: 'slds-p-around_medium'
                });
            } else {
                this.updateCanvasMode(true);
            }
        } else {
            this.updateCanvasMode(false);
        }
    };

    /**
     * Handles the node selection event which is fired when node icon on
     * fixed layout canvas is clicked
     *
     * @param {object} event - node selection event from alcNode.js
     */
    handleNodeSelectedOnFixedCanvas(event) {
        if (this.showPropertyEditorRightPanel && !event.detail.isSelected) {
            // TODO: Right now the property editor closing and opening seem to happen in one tick
            // and thus the close never actually happens
            // Need to make sure the property editor panel is visually closed befere it opens again
            // for new element when the following story is being implemented
            // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000078hChIAI/view
            this.handleClosePropertyEditor();
            const editElementEvent = new EditElementEvent(event.detail.canvasElementGUID);
            this.handleEditElement(editElementEvent);
        }
    }

    /**
     * Handles the node selection event which is fired when node icon on
     * free form canvas is clicked
     *
     * @param {object} event - node selection event from node.js
     */
    handleNodeSelected(event) {
        if (!event.detail.isSelected) {
            this.handleClosePropertyEditor();
        }
    }

    /**
     * Close the currently displayed property editor panel
     *
     * @param clearActiveElement - indicates whether or not to clear the canvas element being actively edited
     */
    handleClosePropertyEditor(clearActiveElement = true) {
        this.showPropertyEditorRightPanel = false;
        this.propertyEditorParams = null;
        this.elementBeingEditedInPanel = null;

        if (clearActiveElement) {
            this.activeElementGuid = null;
        }
    }

    /**
     * Handler method for designating focus to the property editor panel
     */
    handleFocusPropertyEditor() {
        const propertyEditor = this.template.querySelector(PANELS.PROPERTY_EDITOR_PANEL);
        if (propertyEditor) {
            propertyEditor.focus();
        }
    }

    /**
     * Handle adding of a node from an inline property editor
     *
     * @param event - The add node event
     */
    handleAddNode(event) {
        this.deMutateAndAddNodeCollection(event.detail.node);
    }

    /**
     * Handle adding of a node from an inline property editor
     *
     * @param event - the update node event
     */
    handleUpdateNode(event) {
        this.deMutateAndUpdateNodeCollection(event.detail.node);
    }

    /**
     * Load all references in flow. No property editor can be opened until the references are loaded
     */
    loadReferencesInFlow() {
        const currentState = storeInstance.getCurrentState();
        const { elements, properties } = currentState;
        this.propertyEditorBlockerCalls.push(loadReferencesIn({ elements, properties }).catch(() => {}));
    }

    /**
     * Handles the element delete event
     *
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleElementDelete = (event) => {
        if (event && event.detail) {
            getElementsToBeDeleted(storeInstance, event.detail);
            this.handleClosePropertyEditor();
        }
    };

    /**
     * Handles the locator icon clicked event, pans the element into the viewport and dispatches an action to the store
     * to set the isHighlighted state of the canvas element to true.
     *
     * @param {object} event - locator icon clicked event coming from left-panel
     */
    handleHighlightOnCanvas = (event) => {
        if (event && event.detail && event.detail.elementGuid) {
            const elementGuid = event.detail.elementGuid;
            this.highlightOnCanvas(elementGuid);
        }
    };

    /**
     * Get currently active canvas component (autolayout or freeform)
     *
     * @returns The canvas component
     */
    _getCanvasComponent = () => {
        return (
            this.template.querySelector(PANELS.AUTOLAYOUT_CANVAS) || this.template.querySelector(PANELS.FREEFORM_CANVAS)
        );
    };

    /**
     * Get the left panel component
     *
     * @returns The left panel component
     */
    _getLeftPanelComponent = () => {
        return this.template.querySelector(PANELS.TOOLBOX);
    };

    /**
     * Get the toolbar component
     *
     * @returns The toolbar component
     */
    _getToolbarComponent = () => {
        return this.template.querySelector(PANELS.TOOLBAR);
    };

    /**
     * Get the header component
     *
     * @returns The header component
     */
    _getHeaderComponent = () => {
        return this.template.querySelector(PANELS.HEADER);
    };

    /**
     * Get the right panel component
     *
     * @returns The property editor panel or debug panel component (if present)
     */
    _getRightPanelComponent = () => {
        return (
            this.template.querySelector(PANELS.PROPERTY_EDITOR_PANEL) || this.template.querySelector(PANELS.DEBUG_PANEL)
        );
    };

    handleCanvasFocusOut = (event) => {
        shiftFocusFromCanvas(
            this._getLeftPanelComponent(),
            this._getToolbarComponent(),
            this._getHeaderComponent(),
            this._getRightPanelComponent(),
            event.detail.shiftBackward
        );
    };

    handleShiftFocus = (shiftBackward) => {
        const currentlyFocusedElement =
            this.template.activeElement && this.template.activeElement.tagName.toLowerCase();

        switch (currentlyFocusedElement) {
            case PANELS.HEADER:
                if (shiftBackward) {
                    const rightPanelComponent = this._getRightPanelComponent();
                    if (rightPanelComponent) {
                        rightPanelComponent.focus();
                    } else {
                        this._getCanvasComponent().focus();
                    }
                } else {
                    this._getToolbarComponent().focus();
                }
                break;

            case PANELS.TOOLBAR:
                if (shiftBackward) {
                    this._getHeaderComponent().focus();
                } else if (this._getLeftPanelComponent()) {
                    this._getLeftPanelComponent().focus();
                } else {
                    this._getCanvasComponent().focus();
                }

                break;

            case PANELS.TOOLBOX:
                if (shiftBackward) {
                    this._getToolbarComponent().focus();
                } else {
                    this._getCanvasComponent().focus();
                }
                break;

            case PANELS.FREEFORM_CANVAS:
                shiftFocusFromCanvas(
                    this._getLeftPanelComponent(),
                    this._getToolbarComponent(),
                    this._getHeaderComponent(),
                    this._getRightPanelComponent(),
                    shiftBackward
                );
                break;

            case PANELS.AUTOLAYOUT_CANVAS:
                this._getCanvasComponent().shiftFocus(shiftBackward);
                break;

            case PANELS.PROPERTY_EDITOR_PANEL:
            case PANELS.DEBUG_PANEL:
                if (shiftBackward) {
                    this._getCanvasComponent().focus();
                } else {
                    this._getHeaderComponent().focus();
                }
                break;

            default:
                if (shiftBackward) {
                    this._getCanvasComponent().focus();
                } else {
                    this._getHeaderComponent().focus();
                }
        }
        logInteraction('editor', 'editor', { operationStatus: 'shift panel focus' }, 'keydown');
    };

    handleFocusOnDockingPanel = () => {
        focusOnDockingPanel();
    };

    /**
     * Handles the CreateGoToConnectionEvent coming from alcCanvas and dispatches an action to create a GoTo connector
     *
     * @param event - CreateGoToConnectionEvent coming from alcCanvas
     */
    handleGoToCreation = (event: CreateGoToConnectionEvent) => {
        storeInstance.dispatch(createGoToConnection(event.detail));
    };

    /**
     * Handles the DeleteGoToConnectionEvent coming from alcConnectorMenu and dispatches an action to delete a GoTo connector
     *
     * @param event DeleteGoToConnectionEvent coming from alcConnectorMenu
     */
    handleGoToDeletion = (event: DeleteGoToConnectionEvent) => {
        storeInstance.dispatch(deleteGoToConnection(event.detail));
    };

    @api
    handleFocusOnToolbox() {
        this.template.querySelector(PANELS.TOOLBOX).focus();
    }

    /**
     * Handles the locator icon clicked event, pans the element into the viewport and dispatches an action to the store
     * to set the isHighlighted state of the canvas element to true.
     *
     * @param {object} event - event from subscriber
     */
    handleHighlightOnCanvasSubscriber = (event: PubSubEvent) => {
        const { payload } = event;
        if (payload && payload.elementGuid) {
            const elementGuid = payload.elementGuid;
            this.highlightOnCanvas(elementGuid);
        }
    };

    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - event from subscriber
     */
    handleEditElementSubscriber = (event: PubSubEvent) => {
        const { eventType, payload } = event;
        if (payload && eventType) {
            const mode = payload.mode;
            const guid = payload.canvasElementGUID;
            this.editElement(mode, guid);
        }
    };

    /**
     * Method to pan the element into the viewport and dispatches an action to the store
     * to set the isHighlighted state of the canvas element to true.
     *
     * @param {string} elementGuid - Guid of the element being highlighted
     */
    highlightOnCanvas(elementGuid: string) {
        // Panning the canvas element into the viewport if needed
        const canvasContainer = this.template.querySelector(PANELS.FREEFORM_CANVAS);
        if (canvasContainer && canvasContainer.panElementToView) {
            canvasContainer.panElementToView(elementGuid);
        }

        // Zooming on element on autolayout canvas
        const alcCanvasContainer = this.template.querySelector(PANELS.AUTOLAYOUT_CANVAS);
        if (alcCanvasContainer) {
            alcCanvasContainer.focusOnNode(elementGuid);
        }

        // Highlighting the canvas element
        highlightCanvasElement(storeInstance, elementGuid);
    }

    /**
     * the callback function to move focus correctly when closing property editor
     *
     * @param focusGuid - the guid of the element that the focus should go to
     */
    moveFocusToNode = (focusGuid: Guid) => {
        const alcCanvasContainer = this.template.querySelector('builder_platform_interaction-alc-canvas-container');
        alcCanvasContainer.focusOnNode(focusGuid);
    };

    /**
     * Method to open the property editor of the element needs to be edited
     *
     * @param mode - Mode of the event being handled
     * @param guid - Guid of element being currently edited
     * @param forceModal - If true, the editor will be opened in a modal
     * @param designateFocus - If true, the property editor will assume tab focus
     */
    editElement(mode: any, guid: string, forceModal = false, designateFocus = false) {
        const element = storeInstance.getCurrentState().elements[guid];
        if (element && element.elementType !== ELEMENT_TYPE.START_ELEMENT) {
            this.closeAutoLayoutContextualMenu();
        }

        const nodeUpdate = this.deMutateAndUpdateNodeCollection;
        const moveFocusOnCloseCallback = this.moveFocusToNode;
        const editResourceCallback = this.editResourceCallback;
        const newResourceCallback = this.newResourceCallback;
        const processType = this.properties.processType;
        if (
            element &&
            (!isSystemElement(element.elementType) ||
                (element.elementType === ELEMENT_TYPE.START_ELEMENT && isConfigurableStartSupported(processType)))
        ) {
            logPerfTransactionStart('PropertyEditor');
            this.queueOpenPropertyEditor(
                () => {
                    const node = getElementForPropertyEditor(element);
                    node.isNew = false;
                    return {
                        mode,
                        nodeUpdate,
                        node,
                        newResourceCallback,
                        editResourceCallback,
                        processType,
                        moveFocusOnCloseCallback,
                        isAutoLayoutCanvas: this.properties.isAutoLayoutCanvas
                    };
                },
                forceModal,
                designateFocus
            );
            if (element && element.isCanvasElement && !this.properties.isAutoLayoutCanvas) {
                storeInstance.dispatch(
                    selectOnCanvas({
                        guid
                    })
                );
            } else if (this.properties.isAutoLayoutCanvas && this.usePanelForPropertyEditor) {
                this.activeElementGuid = guid;
            }
        }
    }

    editResourceCallback = (editElementDetail) => {
        if (editElementDetail) {
            this._isInlineEditingResource = true;
            this.editElement(editElementDetail.mode, editElementDetail.canvasElementGUID);
        }
    };

    /**
     * Private method to call clear undo redo stack and make the undo redo buttons disabled
     */
    clearUndoRedoStack() {
        storeInstance.dispatch(clearUndoRedo);
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    }
    /**
     * Translates the client side model to the format expected by the server and then invokes
     * the save flow action with the correct save type: create or update.
     *
     * @param {string} saveType the save type (saveDraft, createNewFlow, etc) to use when saving the flow
     */
    saveFlow = (saveType) => {
        this.ifBlockResume = true; // immediately disable submit button to avoid clicking during save

        // Reset go to information on connectors if saving a free form canvas flow
        if (!this.properties.isAutoLayoutCanvas) {
            storeInstance.dispatch(resetGoTos);
        }

        const flow = translateUIModelToFlow(storeInstance.getCurrentState());
        const params = {
            flow,
            saveType
        };
        // Keeping this as fetch because we want to go to the server
        fetch(SERVER_ACTION_TYPE.SAVE_FLOW, this.saveFlowCallback, params);
        this.saveType = saveType;
        logInteraction(
            `saveas-menu-done-button`,
            'modal',
            {
                flowDefId: this.properties.definitionId ? this.properties.definitionId : this.flowInitDefinitionId,
                saveType,
                canvasMode: this.properties.isAutoLayoutCanvas ? 'auto-layout' : 'free-form'
            },
            'click'
        );
        this.saveAndPendingOperationStatus = FLOW_STATUS.SAVING;
        this.hasNotBeenSaved = true;
        this.disableSave = true;
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    };

    /**
     * If needed will fetch record lookup dependencies, and call deMutateAndUpdateNodeCollection on each of them
     *
     * @param {Object} previousNodeValue the existing record lookup node
     * @param {Object} updatedNodeValue the record lookup node with updated values
     */
    updateRecordLookupDependenciesIfNeeded(previousNodeValue, updatedNodeValue) {
        if (updatedNodeValue.storeOutputAutomatically && previousNodeValue.subtype !== updatedNodeValue.subtype) {
            const storeElements = storeInstance.getCurrentState().elements;
            // Accumulator needs to be initalized with  [updatedNodeValue.guid]: updatedNodeValue because usedBy won't return any dependencies if nodeForStore is not in the 2nd arg...
            const loopElements = Object.keys(storeElements)
                .filter((key) => storeElements[key].elementType === ELEMENT_TYPE.LOOP)
                .reduce((newObj, key) => ({ ...newObj, [key]: storeElements[key] }), {
                    [updatedNodeValue.guid]: updatedNodeValue
                });
            const loopsToUpdate = usedBy([updatedNodeValue.guid], { elements: loopElements });
            if (loopsToUpdate && loopsToUpdate.length > 0) {
                loopsToUpdate.forEach((loopToUpdate) => {
                    this.deMutateAndUpdateNodeCollection(storeElements[loopToUpdate.guid]);
                });
            }
        }
    }

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     *
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection = (node) => {
        if (this.builderMode === BUILDER_MODE.DEBUG_MODE) {
            const elementTypeLabel = getConfigForElement(node).labels.singular;
            const elementLabel = getValueFromHydratedItem(node.label);
            const debugToastEvent = new CustomEvent('debugtoastevent', {
                detail: {
                    elementTypeLabel,
                    elementLabel
                }
            });
            // Fire the custom event
            this.dispatchEvent(debugToastEvent);
        }

        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = getElementForStore(node);
        const currentNode = getElementByGuid(nodeForStore.guid);
        nodeForStore.isInlineEditingResource = this._isInlineEditingResource;
        storeInstance.dispatch(updateElement(nodeForStore));
        this._isInlineEditingResource = false;
        logInteraction(`update-node-of-type-${node.elementType}`, 'modal', null, 'click');
        if (node.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
            this.updateRecordLookupDependenciesIfNeeded(currentNode, nodeForStore);
        }
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     *
     * @param node The element to add
     * @param parentGuid Needed when adding a non-canvas child element (StageStep, Outcome, etc...)
     * directly from the canvas so we know where to add it
     * @param alcConnectionSource - The alc connection source
     */
    deMutateAndAddNodeCollection = (node: UI.Element, parentGuid: UI.Guid, alcConnectionSource: ConnectionSource) => {
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.

        logPerfTransactionStart(ADD_ELEMENT);
        const nodeForStore: UI.Element = getElementForStore(node);
        this.cacheNewComplexObjectFields(nodeForStore);

        let payload: UI.Element | NodeWithParent = nodeForStore;
        payload.isAddingResourceViaLeftPanel = this._isAddingResourceViaLeftPanel;
        // This is a non-canvas child element being added directly on the canvas
        if (!nodeForStore.canvasElement && parentGuid) {
            payload = {
                elementType: nodeForStore.elementType,
                parentGuid,
                element: nodeForStore
            } as NodeWithParent;
        }

        if (alcConnectionSource) {
            payload.alcConnectionSource = alcConnectionSource;
        }
        this.dispatchAddElement(payload);
        this._isAddingResourceViaLeftPanel = false;
        this._isResourceQuickCreated = false;

        logPerfTransactionEnd(ADD_ELEMENT, { elementType: nodeForStore.elementType });
    };

    /**
     * Dispatch add element event and log it
     *
     * @param element - The element to add
     */
    dispatchAddElement(element: UI.Element | NodeWithParent) {
        storeInstance.dispatch(addElement(element));
        logElementCreation(element, this._isResourceQuickCreated);
    }

    /**
     * Fetches & caches the fields/properties for new sobject/apex variable types. Shows spinner until this is done
     *
     * @param node -
     */
    cacheNewComplexObjectFields(node) {
        if (node.elementType === ELEMENT_TYPE.VARIABLE && node.subtype && !node.isCollection) {
            const varInComboboxShape = mutateFlowResourceToComboboxShape(node);
            addToParentElementCache(varInComboboxShape.displayText, varInComboboxShape);
            if (node.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                this.propertyEditorBlockerCalls.push(fetchFieldsForEntity(node.subtype).catch(() => {}));
            } else if (node.dataType === FLOW_DATA_TYPE.APEX.value) {
                cachePropertiesForClass(node.subtype);
            }
        }
    }

    isMacPlatform = () => {
        return navigator.userAgent.indexOf('Macintosh') !== -1;
    };

    setupCommandsAndShortcuts = () => {
        // Shift Focus Forward Command
        const shiftFocusForwardCommand = new ShiftFocusForwardCommand(() => this.handleShiftFocus(false));
        const shiftFocusForwardShortcut = this.isMacPlatform() ? { key: 'F6' } : { ctrlOrCmd: true, key: 'F6' };
        this.keyboardInteractions.setupCommandAndShortcut(shiftFocusForwardCommand, shiftFocusForwardShortcut);

        // Shift Focus Backward Command
        const shiftFocusBackwardCommand = new ShiftFocusBackwardCommand(() => this.handleShiftFocus(true));
        const shiftFocusBackwardShortcut = this.isMacPlatform()
            ? { shift: true, key: 'F6' }
            : { shift: true, ctrlOrCmd: true, key: 'F6' };
        this.keyboardInteractions.setupCommandAndShortcut(shiftFocusBackwardCommand, shiftFocusBackwardShortcut);

        // Display shortcuts Command
        const displayShortcutsCommand = new DisplayShortcutsCommand(() => invokeKeyboardHelpDialog());
        const displayShortcutKeyCombo = { ctrlOrCmd: true, key: '/' };
        this.keyboardInteractions.setupCommandAndShortcut(displayShortcutsCommand, displayShortcutKeyCombo);

        // Move Focus To Docking Panel Command
        const focusOnDockingPanelCommand = new FocusOnDockingPanelCommand(() => this.handleFocusOnDockingPanel());
        const focusOnDockingPanelShortcut = { key: 'g d' };
        this.keyboardInteractions.setupCommandAndShortcut(focusOnDockingPanelCommand, focusOnDockingPanelShortcut);
    };

    /**
     * Callback passed to various property editors which support inline creation
     *
     * @param newResourceDetail The new resource event's payload
     */
    newResourceCallback = (newResourceDetail) => {
        // If we are adding a new resource for the user, we don't want to pop the property editor, unless there
        // is an issue, such as name collision.
        const { newResourceInfo } = newResourceDetail;
        this._isResourceQuickCreated = false;
        if (newResourceInfo?.newResource) {
            this._isResourceQuickCreated = true;
            const newResource = newResourceInfo.newResource;
            if (
                !isDevNameInStore(newResource.name) &&
                newResourceInfo.userProvidedText?.length <= TEXT_AREA_MAX_LENGTH
            ) {
                this.deMutateAndAddNodeCollection(newResource);
                return;
            }
            newResourceInfo.preValidationNeeded = true;
        }
        // This doesn't need the promise since a property editor already has to be open in this case
        // new resource is always shown in a modal
        this.showPropertyEditor(
            {
                mode: NewResourceEvent.EVENT_NAME,
                nodeUpdate: this.deMutateAndAddNodeCollection,
                newResourceInfo
            },
            true
        );
    };

    renderedCallback() {
        // Show New Flow modal.
        // Hiding (!this.showNewFlowDialog && this.newFlowModalActive) is done in
        // the modal callbacks since the editor does not hold a reference to the modal.
        if (this.showNewFlowDialog && !this.newFlowModalActive) {
            this.newFlowModalActive = true;
            invokeNewFlowModal(
                this.builderType,
                (this.builderConfig && this.builderConfig.newFlowConfig) || undefined,
                this.closeFlowModalCallback,
                this.createFlowFromTemplateCallback
            );
        }

        // Create a default flow.
        if (!this.hasFlow && this.defaultFlow && !this.isFlowServerCallInProgress) {
            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
            this.getFlowCallback({
                data: this.builderConfig.newFlowConfig.defaultNewFlow
            });
        }

        const currentState = storeInstance.getCurrentState();
        if (!this.isFlowServerCallInProgress && this.spinners.showFlowMetadataSpinner) {
            this.spinners.showFlowMetadataSpinner = false;
            logPerfTransactionEnd(EDITOR, {
                flowId: this.flowId,
                numOfNodes: currentState.canvasElements.length,
                numOfConnectors: currentState.connectors.length
            });

            if (this.flowId) {
                this.saveAndPendingOperationStatus = FLOW_STATUS.SAVED;
                this.hasNotBeenSaved = false;
            }
            this.disableSave = false;
        }

        if (
            !this.isFlowServerCallInProgress &&
            !this.isRetrieveInterviewHistoryCallInProgress &&
            this.spinners.showRetrieveInterviewHistorySpinner
        ) {
            try {
                this.isRetrieveInterviewHistoryCallInProgress = true;
                const params = {
                    interviewGUID: this.currentInterviewGuid,
                    flowVersionId: this.currentFlowId
                };

                fetch(
                    SERVER_ACTION_TYPE.RETRIEVE_INTERVIEW_HISTORY,
                    ({ data, error }) => {
                        if (!error && !this.flowRetrieveError) {
                            this.builderMode = BUILDER_MODE.DEBUG_MODE;
                            this.hideDebugAgainButton = true;
                            this.fromEmailDebugging = true;
                            this.debugData = debugInterviewResponseCallback(data, storeInstance, null);
                            this.clearUndoRedoStack();
                        }
                        this.spinners.showRetrieveInterviewHistorySpinner = false;
                        this.isRetrieveInterviewHistoryCallInProgress = false;
                    },
                    params
                );
            } catch (e) {
                this.spinners.showRetrieveInterviewHistorySpinner = false;
                this.isRetrieveInterviewHistoryCallInProgress = false;
                throw e;
            }
        }

        // Moving focus to the Toolbar when Flow Builder is loaded for the first time
        const toolbarComponent = this._getToolbarComponent();
        if (this.hasCanvasElements && toolbarComponent && !this._isToolbarFocusedPostInitialLoad) {
            toolbarComponent.focus();
            this._isToolbarFocusedPostInitialLoad = true;
        }
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();

        pubSub.subscribe(LocatorIconClickedEvent.EVENT_NAME, this.handleHighlightOnCanvasSubscriber.bind(this));
        pubSub.subscribe(EditElementEvent.EVENT_NAME, this.handleEditElementSubscriber.bind(this));

        // Get list of supported process types for the current builder type
        if (!getProcessTypes()) {
            this.processTypeLoading = true;
            fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES, { builderType: this.builderType })
                .then((data) => {
                    setProcessTypes(data);
                    loadAllSupportedFeatures(getProcessTypes());
                })
                .then(() => {
                    this.processTypeLoading = false;
                });
        }
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
        unsubscribeStore();
    }

    /**
     * Create the flow from selected template
     *
     * @param versionIdOrEnum the selected template id
     * @param modal the flow modal
     */
    createFlowFromTemplate = (versionIdOrEnum, modal) => {
        fetch(
            SERVER_ACTION_TYPE.GET_TEMPLATE_DATA,
            this.getTemplateDataCallback(modal),
            { id: versionIdOrEnum },
            { disableErrorModal: true }
        );
    };

    /**
     * Callback to be called when getting the template data
     *
     * @param modal the flow modal
     * @returns The Template data
     */
    getTemplateDataCallback = (modal) => ({ data, error }) => {
        if (error) {
            // update error message to show in flow modal
            this.isFlowServerCallInProgress = false;
            this.spinners.showFlowMetadataSpinner = false;
            setErrorMessage(modal, error[0].data.contextMessage);
        } else {
            this.getFlowCallback({ data, error });
            modal.close();
            this.newFlowModalActive = false;
        }
    };

    /**
     * Callback passed when user clicks on Exit icon from new flow modal
     *
     * @returns true if you want to skip the close modal
     */
    closeFlowModalCallback = () => {
        this.newFlowModalActive = false;
        return closeModalAndNavigateTo(this.backUrl);
    };

    /**
     * Callback passed when user clicks on Create button from new flow modal
     *
     *  @param modal the flow modal
     */
    createFlowFromTemplateCallback = (modal) => {
        const item = getSelectedFlowEntry(modal);
        if (typeof item === 'string') {
            // Create a new flow from a template referenced by a salesforce id
            logInteraction(`create-new-flow-button`, 'editor-component', { devNameOrId: item }, 'click', 'user');
            // create the flow from the template
            this.createFlowFromTemplate(item, modal);
            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
        } else if (item) {
            // Create a blank flow of the specified process type and started by a specified trigger.
            const { processType, defaultTriggerType } = item;
            if (processType) {
                logInteraction(
                    `create-new-flow-button`,
                    'editor-component',
                    { devNameOrId: processType },
                    'click',
                    'user'
                );

                // True if this process type should always be opened in autolayout
                const isAutoLayoutCanvas: boolean = isAutoLayoutCanvasOnly(processType);

                // TODO: Directly call invokeAutoLayoutWelcomeMat when releasing
                if (isAutoLayoutCanvasEnabled() && !isAutoLayoutCanvas) {
                    invokeAutoLayoutWelcomeMat(
                        processType,
                        defaultTriggerType,
                        this.setupCanvas,
                        this.closeFlowModalCallback
                    );
                } else {
                    this.setupCanvas(processType, defaultTriggerType, isAutoLayoutCanvas);
                }
            }
            modal.close();
            this.newFlowModalActive = false;
        }
    };

    setupCanvas = (processType, triggerType, setupInAutoLayoutCanvas) => {
        logInteraction(
            'canvas-mode-checkbox',
            'canvas-selection-modal',
            {
                flowDefId: this.properties.definitionId ? this.properties.definitionId : this.flowInitDefinitionId,
                selectedMode: setupInAutoLayoutCanvas ? 'auto-layout' : 'free-form'
            },
            'click'
        );
        // Updating the isAutoLayoutCanvas property in the store based on user's selection.
        // Elements are accordingly created based on this property.
        storeInstance.dispatch(updateIsAutoLayoutCanvasProperty(setupInAutoLayoutCanvas));

        // create the empty flow for the selected process type
        this.spinners.showFlowMetadataSpinner = true;
        if (setupInAutoLayoutCanvas) {
            this.spinners.showAutoLayoutSpinner = true;
        }
        this.createFlowFromProcessTypeAndTriggerType(processType, triggerType);
        this.spinners.showFlowMetadataSpinner = false;
        // To Do: W-9299993: update this to not rely on hardcoded checks for process type and trigger type
        if (processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW && triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE) {
            this.handleEditStartElement();
        }
    };

    /**
     * Create the blank flow from the process type and trigger type
     *
     * @param processType the selected process type
     * @param triggerType the trigger type
     */
    createFlowFromProcessTypeAndTriggerType = (processType, triggerType) => {
        const payload = { processType, triggerType };
        storeInstance.dispatch(updatePropertiesAfterCreatingFlowFromProcessTypeAndTriggerType(payload));

        createStartElement(storeInstance, triggerType);

        // create required variables if needed
        this.createRequiredVariables(processType);
        this.disableSave = false;
    };

    createRequiredVariables = (flowProcessType) => {
        this.requiredVariablesLoading = true;
        fetchOnce(SERVER_ACTION_TYPE.GET_AUTO_GENERATED_REQUIRED_VARIABLES, { flowProcessType })
            .then((data) => {
                data.forEach((variable) => {
                    const varElement = createVariable({
                        name: variable.name,
                        dataType: variable.dataType,
                        subtype: variable.objectType,
                        isCollection: variable.isCollection,
                        isInput: variable.isInput,
                        isOutput: variable.isOutput
                    });
                    storeInstance.dispatch(addElement(varElement));
                });
                this.requiredVariablesLoading = false;
            })
            .catch(() => {
                this.requiredVariablesLoading = false;
            });
    };
    /**
     * Reset flow properties when the flow is created from a template
     * (namely: versionNumber, status, isLightningFlowBuilder, isTemplate, lastModifiedDate, lastModifiedBy and name)
     */
    _resetFlowPropertiesWhenCreatedFromTemplate = () => {
        storeInstance.dispatch(
            updatePropertiesAfterCreatingFlowFromTemplate({
                versionNumber: null,
                status: null,
                isLightningFlowBuilder: true,
                isTemplate: false,
                lastModifiedDate: null,
                lastModifiedBy: null,
                name: ''
            })
        );
    };

    _resetSelectionState() {
        // update tracked properties
        this.isCutCopyDisabled = true;
        this.isPasteAvailable = false;
        this.isSelectionMode = false;

        // reset cut/copy variables
        this.bottomCutOrCopiedGuid = null;
        this.cutOrCopiedCanvasElements = {};
        this.cutOrCopiedChildElements = {};
        this.topCutOrCopiedGuid = null;
        this.topSelectedGuid = null;
    }

    /**
     * Used to inform the property editor panel that the element currently being edited
     * should no longer be treated as new (and thus should be validated)
     */
    setElementBeingEditedInPanelAsNotNew() {
        if (this.elementBeingEditedInPanel) {
            this.elementBeingEditedInPanel = {
                ...this.elementBeingEditedInPanel,
                isNew: false
            };
        }
    }
}

export { createStartElement, getElementsToBeDeleted };
