// @ts-nocheck
import { LightningElement, track, api } from 'lwc';
import {
    getPropertyEditorConfig,
    invokePropertyEditor,
    PROPERTY_EDITOR,
    invokeModalInternalData,
    invokeNewFlowModal,
    invokeKeyboardHelpDialog,
    focusOnDockingPanel,
    invokeDebugEditor
} from 'builder_platform_interaction/builderUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { getSObjectOrSObjectCollectionByEntityElements } from 'builder_platform_interaction/selectors';
import {
    updateFlow,
    doDuplicate,
    addElement,
    addElementFault,
    deleteElementFault,
    updateElement,
    selectOnCanvas,
    selectionOnFixedCanvas,
    flcCreateConnection,
    pasteOnFixedCanvas,
    undo,
    redo,
    clearUndoRedo,
    updatePropertiesAfterCreatingFlowFromTemplate,
    updatePropertiesAfterCreatingFlowFromProcessType,
    updatePropertiesAfterActivateButtonPress,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    ADD_START_ELEMENT,
    UPDATE_APEX_CLASSES,
    UPDATE_ENTITIES,
    SELECTION_ON_FIXED_CANVAS
} from 'builder_platform_interaction/actions';
import {
    ELEMENT_TYPE,
    FLOW_STATUS,
    isSystemElement,
    FLOW_PROCESS_TYPE,
    FLOW_TRIGGER_TYPE
} from 'builder_platform_interaction/flowMetadata';
import { fetch, fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { translateFlowToUIModel, translateUIModelToFlow } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { undoRedo, isUndoAvailable, isRedoAvailable, INIT } from 'builder_platform_interaction/undoRedoLib';
import { fetchFieldsForEntity, setEventTypes, MANAGED_SETUP } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './editorLabels';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    logInteraction,
    logPerfTransactionEnd,
    logPerfTransactionStart,
    setAppName
} from 'builder_platform_interaction/loggingUtils';
import { EditElementEvent, NewResourceEvent } from 'builder_platform_interaction/events';
import { SaveType } from 'builder_platform_interaction/saveType';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { mutateFlowResourceToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import { getElementForPropertyEditor, getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { diffFlow } from 'builder_platform_interaction/metadataUtils';
import {
    canRunDebugWith,
    getElementsToBeDeleted,
    getSaveType,
    updateStoreAfterSaveFlowIsSuccessful,
    updateUrl,
    updateStoreAfterSaveAsNewFlowIsFailed,
    updateStoreAfterSaveAsNewVersionIsFailed,
    setFlowErrorsAndWarnings,
    flowPropertiesCallback,
    saveAsFlowCallback,
    getCopiedChildElements,
    getCopiedData,
    getPasteElementGuidMaps,
    getDuplicateElementGuidMaps,
    getConnectorToDuplicate,
    highlightCanvasElement,
    getSelectedFlowEntry,
    setErrorMessage,
    closeModalAndNavigateTo,
    createStartElement,
    isGuardrailsEnabled,
    getToolboxElements,
    getElementsMetadata
} from './editorUtils';
import { cachePropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import {
    getProcessTypes,
    setProcessTypes,
    getRunInModes,
    setRunInModes,
    setBuilderType
} from 'builder_platform_interaction/systemLib';
import { isConfigurableStartSupported } from 'builder_platform_interaction/processTypeLib';
import { getTriggerTypeInfo } from 'builder_platform_interaction/triggerTypeLib';
import { removeLastCreatedInlineResource } from 'builder_platform_interaction/actions';
import {
    loadFieldsForComplexTypesInFlow,
    loadParametersForInvocableApexActionsInFlowFromMetadata,
    loadOnStart,
    loadOnProcessTypeChange,
    initializeLoader,
    loadEntity,
    loadEventType
} from 'builder_platform_interaction/preloadLib';
import {
    ShiftFocusForwardCommand,
    ShiftFocusBackwardCommand,
    DisplayShortcutsCommand,
    FocusOnDockingPanelCommand
} from 'builder_platform_interaction/commands';
import { KeyboardInteractions } from 'builder_platform_interaction/keyboardInteractionUtils';
import { useFixedLayoutCanvas } from 'builder_platform_interaction/contextLib';
import { loadAllSupportedFeatures } from 'builder_platform_interaction/preloadLib';
import { loadReferencesIn } from 'builder_platform_interaction/mergeFieldLib';
import { FlowGuardrailsExecutor, GuardrailsResultEvent } from 'builder_platform_interaction/guardrails';
import { getTriggerType, getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createEndElement } from 'builder_platform_interaction/elementFactory';
import { getInvocableActions } from 'builder_platform_interaction/invocableActionLib';
import { usedBy } from 'builder_platform_interaction/usedByLib';

let unsubscribeStore;
let storeInstance;

const RUN = 'run';
const DEBUG = 'debug';

const EDITOR = 'EDITOR';
const APP_NAME = 'FLOW_BUILDER';

const PANELS = {
    HEADER: 'builder_platform_interaction-header',
    TOOLBAR: 'builder_platform_interaction-toolbar',
    TOOLBOX: 'builder_platform_interaction-left-panel',
    CANVAS: 'builder_platform_interaction-canvas-container'
};

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @since 214
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

    _guardrailsParams;

    /**
     * Params to execute guardrails and propagate info to help menu in header
     * {
     *  running: true/false
     *  count: number of guardrails
     * }
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
    runDebugUrl;
    isFlowServerCallInProgress = false;

    originalFlowLabel;
    originalFlowDescription;
    originalFlowInterviewLabel;
    keyboardInteractions;
    triggerType;
    guardrailsEngine;

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
        showPropertyEditorSpinner: false
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

    supportedElements = [];
    supportedActions = [];

    /** Whether to use the FLC canvas */
    get useFixedLayoutCanvas() {
        return useFixedLayoutCanvas();
    }

    /** Whether canvas elements are available. Don't render the canvas until then. */
    get hasCanvasElements() {
        return this.hasFlow && storeInstance.getCurrentState().canvasElements.length > 0;
    }

    /** Indicates if the component has a flow to edit (now or in future) */
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

    /** Default flow as supplied in the builder config */
    get defaultFlow() {
        return (
            this.builderConfig && this.builderConfig.newFlowConfig && this.builderConfig.newFlowConfig.defaultNewFlow
        );
    }

    /** Indicates that the new flow modal should be displayed */
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
        return this.builderConfig && this.builderConfig.usePanelForPropertyEditor;
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
            UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
            UPDATE_ENTITIES,
            SELECTION_ON_FIXED_CANVAS
        ];
        const groupedActions = [
            TOGGLE_ON_CANVAS, // Used for shift-select elements on canvas.
            DESELECT_ON_CANVAS, // is dispatched when user clicks on the blank space in canvas.
            MARQUEE_SELECT_ON_CANVAS // is dispatched when the user is marquee selecting on the canvas.
        ];

        this.guardrailsEngine = new FlowGuardrailsExecutor();

        // Initializing store
        storeInstance = Store.getStore(
            undoRedo(reducer, {
                blacklistedActions: blacklistedActionsForUndoRedoLib,
                groupedActions
            })
        );
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        fetchOnce(SERVER_ACTION_TYPE.GET_HEADER_URLS).then(data => this.getHeaderUrlsCallBack(data));
        this.keyboardInteractions = new KeyboardInteractions();
        initializeLoader(storeInstance);
        loadOnStart();
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
    get flowDefId() {
        return this.currentFlowDefId;
    }

    set flowDefId(flowDefId) {
        this.currentFlowDefId = flowDefId;
    }

    get showSpinner() {
        return (
            this.spinners.showFlowMetadataSpinner || this.spinners.showPropertyEditorSpinner || this.processTypeLoading
        );
    }

    get spinnerAlternativeText() {
        return LABELS.spinnerAlternativeText;
    }

    get isRunDebugDisabled() {
        return this.hasNotBeenSaved || !this.retrievedHeaderUrls || !this.canRunDebugWithVAD;
    }

    get toolboxElements() {
        return [...this.supportedElements, ...this.supportedActions];
    }

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
        const flowProcessTypeChanged = flowProcessType && flowProcessType !== this.properties.processType;
        const triggerTypeChanged = flowTriggerType !== this.triggerType;
        if (flowProcessTypeChanged || triggerTypeChanged) {
            const toolboxPromise = getToolboxElements(flowProcessType, flowTriggerType).then(supportedElements => {
                this.supportedElements = supportedElements;
            });

            if (flowProcessTypeChanged) {
                const {
                    loadActionsPromise,
                    loadPeripheralMetadataPromise,
                    loadPalettePromise
                } = loadOnProcessTypeChange(flowProcessType, definitionId);
                this.propertyEditorBlockerCalls.push(loadPeripheralMetadataPromise);

                loadActionsPromise.then(() => {
                    const actions = getInvocableActions();
                    if (actions) {
                        this.supportedActions = actions;
                    }
                });
                const palettePromise = loadPalettePromise.then(data => {
                    this.palette = data;
                });

                if (useFixedLayoutCanvas()) {
                    Promise.all([toolboxPromise, palettePromise]).then(() => {
                        this.elementsMetadata = getElementsMetadata(this.toolboxElements, this.palette);
                    });
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
                    ).then(eventTypesData => {
                        setEventTypes(eventTypesData, MANAGED_SETUP);
                    });
                    this.propertyEditorBlockerCalls.push(loadEventTypesManagedSetup);
                }
            }
        }

        this.properties = currentState.properties;
        this.showWarningIfUnsavedChanges();
        if (!getRunInModes()) {
            const getRunInModesCall = fetchOnce(SERVER_ACTION_TYPE.GET_RUN_IN_MODES, {}).then(data => {
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
        if (isGuardrailsEnabled() && this.guardrailsParams && this.guardrailsParams.running) {
            const flow = translateUIModelToFlow(flowState);
            this.guardrailsEngine.evaluate(flow).then(results => {
                this.dispatchEvent(new GuardrailsResultEvent(results));
            });
        }
    }

    /**
     * Callback which gets executed once we get the flow from java controller
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     * In case of data retrieved from a template, data points directly to flow.metadata
     */
    getFlowCallback = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
            this.spinners.showFlowMetadataSpinner = false;
        } else {
            // We need to load the parameters first, so as having some information needed at the factory level (e.g. for Action with anonymous output we need parameter related information see actionCall#createActionCall)
            // Also needed to load entity/eventType for the start element on canvas.
            this.preloadRequiredDatafromFlowMetadata(data).then(() => {
                // double dispatch is required for loop factory (we need to get the corresponding looped variable for auto output)
                storeInstance.dispatch(updateFlow(translateFlowToUIModel(data)));

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
                if (
                    triggerType === FLOW_TRIGGER_TYPE.SCHEDULED ||
                    triggerType === FLOW_TRIGGER_TYPE.AFTER_SAVE ||
                    triggerType === FLOW_TRIGGER_TYPE.BEFORE_SAVE
                ) {
                    promises.push(loadEntity(object));
                } else if (triggerType === FLOW_TRIGGER_TYPE.PLATFORM_EVENT) {
                    promises.push(loadEventType(MANAGED_SETUP, object));
                }
            }
        }
        promises.push(loadParametersForInvocableApexActionsInFlowFromMetadata(flowMetadata.actionCalls));
        return Promise.all(promises);
    }

    /**
     * Internal only callback which gets executed when we get a flow for diffing.
     * @param data
     * @param error
     */
    getFlowCallbackAndDiff = ({ data, error }) => {
        // TODO: W-5488109. We may want to revisit the idea of putting this functionality into a separate component.
        if (error) {
            invokeModalInternalData({
                headerData: {
                    headerTitle: 'Metadata Diff'
                },
                bodyData: {
                    bodyTextOne: 'Encountered an issue while trying to retrieve the before flow'
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: 'OK'
                    }
                }
            });
        } else {
            const originalFlow = data;
            const newFlow = translateUIModelToFlow(storeInstance.getCurrentState());

            // full diff
            const fullDiff = diffFlow(originalFlow, newFlow, false, false, false);
            const fullDiffJson = JSON.stringify(fullDiff, null, 2);

            // Trimmed Diff - use blacklist, ignore undefined values, empty arrays, empty strings,
            // and differences in date/dateTime formats
            const trimmedDiff = diffFlow(originalFlow, newFlow, true, true, true);
            const trimmedDiffJson = JSON.stringify(trimmedDiff, null, 2);

            invokeModalInternalData({
                headerData: {
                    headerTitle: 'Metadata Diff'
                },
                bodyData: {
                    bodyTextOne: 'Trimmed Diff\n\n' + trimmedDiffJson,
                    bodyTextTwo: '\n\nFull diff\n\n' + fullDiffJson
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: 'OK'
                    }
                }
            });
        }
        this.isFlowServerCallInProgress = false;
    };

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
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    saveFlowCallback = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else if (data.isSuccess) {
            this.currentFlowId = data.flowId;
            updateStoreAfterSaveFlowIsSuccessful(storeInstance, data);
            updateUrl(this.currentFlowId);
            this.setOriginalFlowValues();
            this._resetCopyStateOnSaveSuccess();
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
     */
    getHeaderUrlsCallBack = data => {
        let isFromAloha = data.preferred === 'CLASSIC';
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
     * @param {String} url - base url which we build on to construct the url for the detail page
     */
    buildBackUrlForAloha = url => {
        if (this.currentFlowDefId) {
            url = '/' + this.currentFlowDefId;
        }
        return url;
    };

    /**
     * Helper method to construct the detail page back url for Lightning
     * @param {String} url - base url which we build on to construct the url for the detail page
     */
    buildBackUrlForLightning = url => {
        if (this.currentFlowDefId) {
            url = url.split('/home')[0] + '/page?address=' + encodeURIComponent('/' + this.currentFlowDefId);
        }
        return url;
    };

    /**
     * Callback after run debug interivew initiated by pop-over footer and no errors.
     */
    runDebugInterviewCallback = () => {
        // TODO: notify editor & trigger debugger service.
    };

    /**
     * Helper method to construct the url for the run/debug mode and launch the window in a new tab
     * @param {String} runOrDebug - Used for deciding whether the user is trying to run the flow or debug it.
     */
    runOrDebugFlow = (runOrDebug = RUN) => {
        const currentState = storeInstance.getCurrentState();
        const processType = this.properties.processType;
        const runDebugInterviewCallback = this.runDebugInterviewCallback;
        let flowDevName;
        let url;
        let flowId;

        if (currentState && currentState.properties) {
            flowDevName = currentState.properties.name;
            flowId = this.flowId;
            url = `${this.runDebugUrl}${flowDevName}/${flowId}`;
            if (runOrDebug === DEBUG) {
                if (processType === FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW) {
                    this.queueOpenFlowDebugEditor(() => {
                        return {
                            flowId,
                            flowDevName,
                            runDebugInterviewCallback
                        };
                    });
                } else {
                    url = `${url}?flow__debug=true`;
                }
            }
        }
        if (runOrDebug === RUN || (runOrDebug === DEBUG && processType !== FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW)) {
            window.open(url, '_blank');
        }
    };

    /**
     * Call back for before unload event
     * It will invoke a default browser warning when user tries to leave the flow builder
     * @param {Object} event before unload event
     */
    beforeUnloadCallback = event => {
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
     * Handles the toggleSelectionMode event and toggles the isSelectionMode
     * Toggle selection mode also closes the property editor panel
     */
    handleToggleSelectionMode = () => {
        this.isSelectionMode = !this.isSelectionMode;
        this.handleClosePropertyEditor();
    };

    /**
     * Handles Selection on Fixed Layout Canvas
     * @param {object} event Selection event coming from flcBuilder
     */
    handleSelectionOnFixedCanvas = event => {
        if (event && event.detail) {
            const { canvasElementGuidsToSelect, canvasElementGuidsToDeselect, selectableGuids } = event.detail;
            const payload = {
                canvasElementGuidsToSelect,
                canvasElementGuidsToDeselect,
                selectableGuids
            };
            storeInstance.dispatch(selectionOnFixedCanvas(payload));

            this.topSelectedGuid = event.detail.topSelectedGuid;
            this.isCutCopyDisabled = !event.detail.topSelectedGuid;
        }
    };

    handleAddElementFault = event => {
        storeInstance.dispatch(addElementFault(event.detail.guid));
    };

    handleDeleteElementFault = event => {
        storeInstance.dispatch(deleteElementFault(event.detail.guid));
    };

    /**
     * Handles the copy event coming from the Element Action Contextual Menu and
     * updates the appropriate properties
     */
    handleCopySingleElement = event => {
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
     */
    handlePasteOnCanvas = event => {
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

            const editElementEvent = new EditElementEvent(Object.values(canvasElementGuidMap)[0]);
            this.handleEditElement(editElementEvent);
        }
    };

    /**
     * Handles the edit flow properies event fired by the toolbar. Opens the flow properties property editor with
     * the current values for the flow properties.
     */
    handleEditFlowProperties = () => {
        const mode = EditElementEvent.EVENT_NAME;
        // Pop flow properties editor and do the following on callback.
        const flowProperties = storeInstance.getCurrentState().properties;
        const triggerType = getTriggerType();
        const nodeUpdate = flowPropertiesCallback(storeInstance);
        const newResourceCallback = this.newResourceCallback;
        this.queueOpenPropertyEditor(() => {
            const node = getElementForPropertyEditor(Object.assign({}, flowProperties, { triggerType }));
            node.saveType = SaveType.UPDATE;
            return {
                mode,
                node,
                nodeUpdate,
                newResourceCallback
            };
        });
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
     * Handles the save flow event fired by a toolbar. Saves the flow if the flow has already been created.
     * Pops the flowProperties property editor if the flow is being saved for the first time.
     * @param {object} event when save or save as buttons are clicked
     */
    handleSaveFlow = event => {
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
     * Handles the diff flow event fired by the toolbar. This is an internal only event.
     * @param event
     */
    handleDiffFlow = (/* event */) => {
        // Only perform diff if there is a before diff.
        if (this.flowId) {
            // Get the saved copy from the DB as our 'before' flow for comparing.
            const params = { id: this.flowId };
            // Keeping this as fetch because we want to go to the server
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallbackAndDiff, params);
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
     * @param {Object} has error property if there is error fetching the data else has data property
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

    showPropertyEditor(params, forceModal = false) {
        if (this.usePanelForPropertyEditor && !forceModal) {
            this.showPropertyEditorRightPanel = true;
            this.propertyEditorParams = getPropertyEditorConfig(params.mode, params);
            this.propertyEditorParams.panelConfig.isLabelCollapsibleToHeader = true;
            this.propertyEditorParams.panelConfig.isFieldLevelCommitEnabled = true;
            this.elementBeingEditedInPanel = params.node;
        } else {
            invokePropertyEditor(PROPERTY_EDITOR, params);
        }
    }

    queueOpenPropertyEditor = (paramsProvider, forceModal) => {
        this.spinners.showPropertyEditorSpinner = true;
        Promise.all(this.propertyEditorBlockerCalls)
            .then(() => {
                this.spinners.showPropertyEditorSpinner = false;
                this.propertyEditorBlockerCalls = [];
                this.showPropertyEditor(paramsProvider(), forceModal);
            })
            .catch(() => {
                // we don't open the property editor because at least one promise was rejected
                this.spinners.showPropertyEditorSpinner = false;
            });
    };

    /**
     * Queuing up the call out for display debug editor's pop-over modal.
     */
    queueOpenFlowDebugEditor = paramsProvider => {
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
     *  @param {object} event - when add resource button is clicked.
     */
    handleAddResourceElement = event => {
        const mode = event.type;
        const nodeUpdate = this.deMutateAndAddNodeCollection;

        this.queueOpenPropertyEditor(
            () => ({
                mode,
                nodeUpdate
            }),
            true
        );
    };

    /** *********** Canvas and Node Event Handling *************** **/

    /**
     * Handles the add element event which is fired after an element from left palette is dropped
     * on the canvas or via a click to add interaction.
     *
     * @param {Object} event canvas element drop event
     */
    handleAddCanvasElement = event => {
        if (storeInstance && storeInstance.getCurrentState().properties.lastInlineResourceGuid) {
            storeInstance.dispatch(removeLastCreatedInlineResource);
        }

        if (event && event.type && event.detail) {
            logPerfTransactionStart('PropertyEditor');
            const mode = event.type;
            const {
                prev,
                next,
                childIndex,
                parent,
                elementType,
                locationX,
                locationY,
                actionType,
                actionName
            } = event.detail;

            // If displaying in a modal then the element is added at the end via nodeUpdate.
            // In a panel, the element is added upon opening and nodeUpdate updates
            const nodeUpdate = this.usePanelForPropertyEditor
                ? this.deMutateAndUpdateNodeCollection
                : this.deMutateAndAddNodeCollection;

            const newResourceCallback = this.newResourceCallback;
            const processType = this.properties.processType;

            // skip the editor for elements that don't need one
            if (elementType === ELEMENT_TYPE.END_ELEMENT) {
                this.dispatchAddElement(createEndElement({ prev, next, childIndex, parent, elementType }));
                return;
            }

            this.queueOpenPropertyEditor(() => {
                // getElementForPropertyEditor need to be called after propertyEditorBlockerCalls
                // has been resolved
                const node = getElementForPropertyEditor({
                    locationX,
                    locationY,
                    elementType,
                    actionType,
                    actionName,
                    isNewElement: true,
                    prev,
                    next,
                    childIndex,
                    parent
                });

                // For a panel, the element is created upon opening the property editor
                if (this.usePanelForPropertyEditor) {
                    this.deMutateAndAddNodeCollection(node);
                }

                return {
                    mode,
                    node,
                    nodeUpdate,
                    newResourceCallback,
                    processType
                };
            });
        }
    };

    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - node double clicked event coming from node.js
     */
    handleEditElement = event => {
        if (event && event.detail && event.type) {
            const mode = event.detail.mode;
            const guid = event.detail.canvasElementGUID;
            const element = storeInstance.getCurrentState().elements[guid];

            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            const processType = this.properties.processType;
            if (
                !isSystemElement(element.elementType) ||
                (element.elementType === ELEMENT_TYPE.START_ELEMENT && isConfigurableStartSupported(processType))
            ) {
                logPerfTransactionStart('PropertyEditor');
                this.queueOpenPropertyEditor(() => {
                    const node = getElementForPropertyEditor(element);
                    return {
                        mode,
                        nodeUpdate,
                        node,
                        newResourceCallback,
                        processType
                    };
                });
                if (element && element.isCanvasElement) {
                    storeInstance.dispatch(
                        selectOnCanvas({
                            guid
                        })
                    );
                }
            }
        }
    };

    /**
     * Handles the node selection event which is fired when node icon on
     * fixed layout canvas is clicked
     *
     * @param {object} event - node selection event from flcNode.js
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
     * Close the currently displayed property editor panel (for property editors shown inline
     */
    handleClosePropertyEditor() {
        this.showPropertyEditorRightPanel = false;
        this.propertyEditorParams = null;
        this.elementBeingEditedInPanel = null;
    }

    /**
     * Handle adding of a node from an inline property editor
     */
    handleAddNode(event) {
        this.deMutateAndAddNodeCollection(event.detail.node);
    }

    /**
     * Handle adding of a node from an inline property editor
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
    handleElementDelete = event => {
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
    handleHighlightOnCanvas = event => {
        if (event && event.detail && event.detail.elementGuid) {
            const elementGuid = event.detail.elementGuid;

            // Panning the canvas element into the viewport if needed
            const canvasContainer = this.template.querySelector('builder_platform_interaction-canvas-container');
            if (canvasContainer && canvasContainer.panElementToView) {
                canvasContainer.panElementToView(elementGuid);
            }

            // Highlighting the canvas element
            highlightCanvasElement(storeInstance, elementGuid);
        }
    };

    handleShiftFocus = shiftBackward => {
        const currentlyFocusedElement =
            this.template.activeElement && this.template.activeElement.tagName.toLowerCase();

        switch (currentlyFocusedElement) {
            case PANELS.HEADER:
                if (shiftBackward) {
                    this.template.querySelector(PANELS.CANVAS).focus();
                } else {
                    this.template.querySelector(PANELS.TOOLBAR).focus();
                }
                break;

            case PANELS.TOOLBAR:
                if (shiftBackward) {
                    this.template.querySelector(PANELS.HEADER).focus();
                } else {
                    this.template.querySelector(PANELS.TOOLBOX).focus();
                }
                break;

            case PANELS.TOOLBOX:
                if (shiftBackward) {
                    this.template.querySelector(PANELS.TOOLBAR).focus();
                } else {
                    this.template.querySelector(PANELS.CANVAS).focus();
                }
                break;

            case PANELS.CANVAS:
                if (shiftBackward) {
                    this.template.querySelector(PANELS.TOOLBOX).focus();
                } else {
                    this.template.querySelector(PANELS.HEADER).focus();
                }
                break;

            default:
                if (shiftBackward) {
                    this.template.querySelector(PANELS.CANVAS).focus();
                } else {
                    this.template.querySelector(PANELS.HEADER).focus();
                }
        }
        logInteraction('editor', 'editor', { operationStatus: 'shift panel focus' }, 'keydown');
    };

    handleFocusOnDockingPanel = () => {
        focusOnDockingPanel();
    };

    handleFlcCreateConnection = event => {
        storeInstance.dispatch(flcCreateConnection(event.detail));
    };

    @api
    handleFocusOnToolbox() {
        this.template.querySelector(PANELS.TOOLBOX).focus();
    }

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
     * @param {string} saveType the save type (saveDraft, createNewFlow, etc) to use when saving the flow
     */
    saveFlow = saveType => {
        const flow = translateUIModelToFlow(storeInstance.getCurrentState());
        const params = {
            flow,
            saveType
        };
        // Keeping this as fetch because we want to go to the server
        fetch(SERVER_ACTION_TYPE.SAVE_FLOW, this.saveFlowCallback, params);
        this.saveType = saveType;
        logInteraction(`saveas-menu-done-button`, 'modal', { saveType }, 'click');
        this.saveAndPendingOperationStatus = FLOW_STATUS.SAVING;
        this.hasNotBeenSaved = true;
        this.disableSave = true;
        this.isUndoDisabled = true;
        this.isRedoDisabled = true;
    };

    /**
     * If needed will fetch record lookup dependencies, and call deMutateAndUpdateNodeCollection on each of them
     * @param {Object} previousNodeValue the existing record lookup node
     * @param {Object} updatedNodeValue the record lookup node with updated values
     */
    updateRecordLookupDependenciesIfNeeded(previousNodeValue, updatedNodeValue) {
        if (updatedNodeValue.storeOutputAutomatically && previousNodeValue.subtype !== updatedNodeValue.subtype) {
            const storeElements = storeInstance.getCurrentState().elements;
            // Accumulator needs to be initalized with  [updatedNodeValue.guid]: updatedNodeValue because usedBy won't return any dependencies if nodeForStore is not in the 2nd arg...
            const loopElements = Object.keys(storeElements)
                .filter(key => storeElements[key].elementType === ELEMENT_TYPE.LOOP)
                .reduce((newObj, key) => ({ ...newObj, [key]: storeElements[key] }), {
                    [updatedNodeValue.guid]: updatedNodeValue
                });
            const loopsToUpdate = usedBy([updatedNodeValue.guid], loopElements);
            if (loopsToUpdate && loopsToUpdate.length > 0) {
                loopsToUpdate.forEach(loopToUpdate => {
                    this.deMutateAndUpdateNodeCollection(storeElements[loopToUpdate.guid]);
                });
            }
        }
    }

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection = node => {
        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = getElementForStore(node);
        const currentNode = getElementByGuid(nodeForStore.guid);
        storeInstance.dispatch(updateElement(nodeForStore));
        logInteraction(`update-node-of-type-${node.elementType}`, 'modal', null, 'click');
        if (node.elementType === ELEMENT_TYPE.RECORD_LOOKUP) {
            this.updateRecordLookupDependenciesIfNeeded(currentNode, nodeForStore);
        }
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndAddNodeCollection = node => {
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = getElementForStore(node);
        this.cacheNewComplexObjectFields(nodeForStore);
        this.dispatchAddElement(nodeForStore);
    };

    /**
     * Dispatch add element event and log it
     * @param {Object} element - element to create
     */
    dispatchAddElement(element) {
        storeInstance.dispatch(addElement(element));
        logInteraction(`add-node-of-type-${element.elementType}`, 'modal', null, 'click');
    }

    /**
     * Fetches & caches the fields/properties for new sobject/apex variable types. Shows spinner until this is done
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
        const displayShortcutKeyCombo = { key: '/' };
        this.keyboardInteractions.setupCommandAndShortcut(displayShortcutsCommand, displayShortcutKeyCombo);

        // Move Focus To Docking Panel Command
        const focusOnDockingPanelCommand = new FocusOnDockingPanelCommand(() => this.handleFocusOnDockingPanel());
        const focusOnDockingPanelShortcut = { key: 'g d' };
        this.keyboardInteractions.setupCommandAndShortcut(focusOnDockingPanelCommand, focusOnDockingPanelShortcut);
    };

    /**
     * Callback passed to variour property editors which support inline creation
     */
    newResourceCallback = () => {
        // This doesn't need the promise since a property editor already has to be open in this case
        // new resource is always shown in a modal
        this.showPropertyEditor(
            {
                mode: NewResourceEvent.EVENT_NAME,
                nodeUpdate: this.deMutateAndAddNodeCollection
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
                numOfNodes: currentState.canvasElements.length,
                numOfConnectors: currentState.connectors.length
            });

            if (this.flowId) {
                this.saveAndPendingOperationStatus = FLOW_STATUS.SAVED;
                this.hasNotBeenSaved = false;
            }
            this.disableSave = false;
        }
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();

        // Get list of supported process types for the current builder type
        if (!getProcessTypes()) {
            this.processTypeLoading = true;
            fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES, { builderType: this.builderType })
                .then(data => {
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
     * @param modal the flow modal
     */
    getTemplateDataCallback = modal => ({ data, error }) => {
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
     */
    closeFlowModalCallback = () => {
        this.newFlowModalActive = false;
        return closeModalAndNavigateTo(this.backUrl);
    };

    /**
     * Callback passed when user clicks on Create button from new flow modal
     *  @param modal the flow modal
     */
    createFlowFromTemplateCallback = modal => {
        const item = getSelectedFlowEntry(modal);
        if (typeof item === 'string') {
            // Create a new flow from a template referenced by a salesforce id
            logInteraction(`create-new-flow-button`, 'editor-component', { devNameOrId: item }, 'click', 'user');
            // create the flow from the template
            this.createFlowFromTemplate(item, modal);
            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
        } else {
            // Create a blank flow of the specified process type and started by a specified trigger.
            const { processType, triggerType } = item;
            if (processType) {
                logInteraction(
                    `create-new-flow-button`,
                    'editor-component',
                    { devNameOrId: processType },
                    'click',
                    'user'
                );
                // create the empty flow for the selected process type
                this.spinners.showFlowMetadataSpinner = true;
                this.createFlowFromProcessType(processType, triggerType);
                this.spinners.showFlowMetadataSpinner = false;
            }
            modal.close();
            this.newFlowModalActive = false;
        }
    };

    /**
     * Create the blank flow from the process type
     * @param processType the selected process type
     */
    createFlowFromProcessType = (processType, triggerType) => {
        const payload = { processType };
        storeInstance.dispatch(updatePropertiesAfterCreatingFlowFromProcessType(payload));

        createStartElement(storeInstance, triggerType);

        this.disableSave = false;
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

    _resetCopyStateOnSaveSuccess() {
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
}

export { createStartElement, getElementsToBeDeleted };
