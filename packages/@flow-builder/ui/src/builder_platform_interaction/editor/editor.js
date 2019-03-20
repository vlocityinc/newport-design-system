import { LightningElement, track, api } from 'lwc';
import { invokePropertyEditor, PROPERTY_EDITOR, invokeModalInternalData, invokeNewFlowModal} from 'builder_platform_interaction/builderUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { getSObjectOrSObjectCollectionByEntityElements } from 'builder_platform_interaction/selectors';
import { updateFlow, doDuplicate, addElement, updateElement, selectOnCanvas, undo, redo, clearUndoRedo, updateProperties,
    UPDATE_PROPERTIES_AFTER_SAVING, TOGGLE_ON_CANVAS, DESELECT_ON_CANVAS, UPDATE_CANVAS_ELEMENT_LOCATION, UPDATE_PROPERTIES_AFTER_SAVE_FAILED } from 'builder_platform_interaction/actions';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { fetch, fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { translateFlowToUIModel, translateUIModelToFlow } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { undoRedo, isUndoAvailable, isRedoAvailable, INIT } from 'builder_platform_interaction/undoRedoLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './editorLabels';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { logPerfTransactionStart, logPerfTransactionEnd } from 'builder_platform_interaction/loggingUtils';
import { EditElementEvent, NewResourceEvent } from 'builder_platform_interaction/events';
import { SaveType } from 'builder_platform_interaction/saveType';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { mutateFlowResourceToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import { getElementForPropertyEditor, getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { diffFlow } from "builder_platform_interaction/metadataUtils";
import { getElementsToBeDeleted, getSaveType, updateStoreAfterSaveFlowIsSuccessful, updateUrl,
    updateStoreAfterSaveAsNewFlowIsFailed, updateStoreAfterSaveAsNewVersionIsFailed, setFlowErrorsAndWarnings,
    flowPropertiesCallback, saveAsFlowCallback, setPeripheralDataForPropertyEditor, getDuplicateElementGuidMaps,
    getConnectorToDuplicate, highlightCanvasElement } from './editorUtils';
import { cachePropertiesForClass } from "builder_platform_interaction/apexTypeLib";
import { getProcessTypes, setProcessTypes } from 'builder_platform_interaction/systemLib';
import { MODAL_SIZE } from 'builder_platform_interaction/elementConfig';

let unsubscribeStore;
let storeInstance;

const RUN = 'run';
const DEBUG = 'debug';

const EDITOR = 'EDITOR';

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @since 214
 */
export default class Editor extends LightningElement {
    currentFlowId;
    runDebugUrl;
    isFlowServerCallInProgress = false;

    originalFlowLabel;
    originalFlowDescription;
    originalFlowInterviewLabel;

    @track
    properties = {};

    @track
    flowErrorsAndWarnings = {
        errors: {},
        warnings: {}
    };

    @track backUrl;
    @track helpUrl;
    @track spinners = {
        showFlowMetadataSpinner: false,
        showPropertyEditorSpinner: false
    };
    @track hasNotBeenSaved = true;
    @track disableSave = true;
    @track saveStatus;
    @track saveType;
    @track retrievedHeaderUrls = false;

    @track isUndoDisabled = true;
    @track isRedoDisabled = true;

    propertyEditorBlockerCalls = [];
    peripheralDataFetched = false;

    constructor() {
        super();
        // Initialising store
        logPerfTransactionStart(EDITOR);
        const blacklistedActionsForUndoRedoLib = [
            INIT,
            UPDATE_PROPERTIES_AFTER_SAVING, // Called after successful save callback returns
            UPDATE_PROPERTIES_AFTER_SAVE_FAILED, // Called after save callback returns with errors from server
        ];
        const groupedActions = [
            TOGGLE_ON_CANVAS, // Used for shift-select elements on canvas.
            DESELECT_ON_CANVAS, // is dispatched when user clicks on the blank space in canvas.
            UPDATE_CANVAS_ELEMENT_LOCATION, // is dispatched when elements are moved on canvas.
        ];
        storeInstance = Store.getStore(undoRedo(reducer, {blacklistedActions: blacklistedActionsForUndoRedoLib, groupedActions}));
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        fetchOnce(SERVER_ACTION_TYPE.GET_HEADER_URLS).then(data => this.getHeaderUrlsCallBack(data));
    }

    @api
    get flowId() {
        return this.currentFlowId;
    }

    set flowId(newFlowId) {
        if (newFlowId) {
            this.currentFlowId = newFlowId;
            const params = {
                id: newFlowId
            };
            // Keeping this as fetch because we want to go to the server
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallback, params, {background: true});
            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
        } else {
            invokeNewFlowModal({bodyClass: 'slds-p-around_none', flavor: MODAL_SIZE.LARGE}, this.closeFlowModalCallback, this.createFlowFromTemplateCallback);
        }
    }

    get showSpinner() {
        return this.spinners.showFlowMetadataSpinner || this.spinners.showPropertyEditorSpinner;
    }

    get spinnerAlternativeText() {
        return LABELS.spinnerAlternativeText;
    }

    get isRunDebugDisabled() {
        return this.hasNotBeenSaved || !this.retrievedHeaderUrls;
    }

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.isUndoDisabled = !isUndoAvailable();
        this.isRedoDisabled = !isRedoAvailable();
        this.properties = currentState.properties;
        this.showWarningIfUnsavedChanges();
        if (!this.peripheralDataFetched && this.properties.processType) {
            logPerfTransactionStart(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_BY_PROCESS_TYPE);
            const getPeripheralDataForPropertyEditor = fetchOnce(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR, {
                crudType: 'ALL',
                flowProcessType: this.properties.processType,
            }).then(data => {
                logPerfTransactionEnd(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR);
                setPeripheralDataForPropertyEditor(data);
                this.peripheralDataFetched = true;
            });
            this.propertyEditorBlockerCalls.push(getPeripheralDataForPropertyEditor);
        }
        // should fetch process types here if they aren't fetched
        if (!getProcessTypes()) {
            const getProcessTypesCall = fetchOnce(SERVER_ACTION_TYPE.GET_PROCESS_TYPES, {}).then(data => {
                setProcessTypes(data);
            });
            this.propertyEditorBlockerCalls.push(getProcessTypesCall);
        }
    };

    /**
     * Callback which gets executed once we get the flow from java controller
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getFlowCallback = ({data, error}) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            storeInstance.dispatch(updateFlow(translateFlowToUIModel(data)));
            this.setOriginalFlowValues();
            this.loadFieldsForSobjectsInFlow();
        }
        this.isFlowServerCallInProgress = false;
    };

    /**
     * Internal only callback which gets executed when we get a flow for diffing.
     * @param data
     * @param error
     */
    getFlowCallbackAndDiff = ({data, error}) => {
        // TODO: W-5488109. We may want to revisit the idea of putting this functionality into a separate component.
        if (error) {
            invokeModalInternalData({
                headerData: {
                    headerTitle: "Metadata Diff"
                },
                bodyData: {
                    bodyTextOne: "Encountered an issue while trying to retrieve the before flow"
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: "OK"
                    }
                }
            });
        } else {
            const originalFlow = data;
            const newFlow =  translateUIModelToFlow(storeInstance.getCurrentState());

            // full diff
            const fullDiff = diffFlow(originalFlow, newFlow, false, false, false);
            const fullDiffJson = JSON.stringify(fullDiff, null, 2);

            // Trimmed Diff - use blacklist, ignore undefined values, empty arrays, empty strings,
            // and differences in date/dateTime formats
            const trimmedDiff = diffFlow(originalFlow, newFlow, true, true, true);
            const trimmedDiffJson = JSON.stringify(trimmedDiff, null, 2);

            invokeModalInternalData({
                headerData: {
                    headerTitle: "Metadata Diff"
                },
                bodyData: {
                    bodyTextOne: "Trimmed Diff\n\n" + trimmedDiffJson,
                    bodyTextTwo: "\n\nFull diff\n\n" + fullDiffJson,
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: "OK"
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
    setOriginalFlowValues()  {
        this.originalFlowLabel = this.properties.label;
        this.originalFlowDescription = this.properties.description;
        this.originalFlowInterviewLabel = this.properties.interviewLabel;
    }

    /**
     * This is called once the flow has been loaded, so that sobjects in the flow have their fields loaded and cached
     */
    loadFieldsForSobjectsInFlow() {
        // Only gets sObject variables (no collections)
        const sobjectVariables = getSObjectOrSObjectCollectionByEntityElements(storeInstance.getCurrentState().elements);
        for (let i = 0; i < sobjectVariables.length; i++) {
            // add sobject variable to combobox cache in required shape
            const sObjectInComboboxShape = mutateFlowResourceToComboboxShape(sobjectVariables[i]);
            addToParentElementCache(sObjectInComboboxShape.displayText, sObjectInComboboxShape);
            // fetch fields and cache them
            this.propertyEditorBlockerCalls.push(fetchFieldsForEntity(sobjectVariables[i].subtype, { disableErrorModal : true }).catch(() => {}));
        }
    }

    /**
     * Callback which gets executed after saving a flow
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    saveFlowCallback = ({data, error}) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else if (data.isSuccess) {
            this.currentFlowId = data.flowId;
            updateStoreAfterSaveFlowIsSuccessful(storeInstance, data);
            updateUrl(this.currentFlowId);
            this.setOriginalFlowValues();
        } else if (!data.isSuccess && this.saveType === SaveType.NEW_DEFINITION) {
            // If the save failed and saveType === SaveType.NEW_DEFINITION, then clear the flowId from the url
            // and reset some of the flow properties as if this is a net new flow
            this.currentFlowId = undefined;
            updateStoreAfterSaveAsNewFlowIsFailed(storeInstance);
            updateUrl();
        } else if (!data.isSuccess && this.saveType === SaveType.NEW_VERSION) {
            updateStoreAfterSaveAsNewVersionIsFailed(storeInstance, this.originalFlowLabel, this.originalFlowDescription, this.originalFlowInterviewLabel);
        }

        if (this.currentFlowId) {
            this.hasNotBeenSaved = false;
            this.saveStatus = LABELS.savedStatus;
        } else {
            this.hasNotBeenSaved = true;
            this.saveStatus = null;
        }
        this.disableSave = false;
        this.flowErrorsAndWarnings = setFlowErrorsAndWarnings(data);
    };

    /**
     * Callback which gets executed after getting data urls for header
     */
    getHeaderUrlsCallBack = (data) => {
        let isFromAloha = data.preferred === 'CLASSIC';
        if (window.location.search.indexOf('isFromAloha=true') >= 0) {
            isFromAloha = true;
        }
        this.backUrl = isFromAloha ? data.flowUrl : data.lightningFlowUrl;
        this.helpUrl = data.helpUrl;
        this.runDebugUrl = data.runDebugUrl;
        this.retrievedHeaderUrls = true;
    };

    /**
     * Helper method to construct the url for the run/debug mode and launch the window in a new tab
     * @param {String} runOrDebug - Used for deciding whether the user is trying to run the flow or debug it.
     */
    runOrDebugFlow = (runOrDebug = RUN) => {
        const currentState = storeInstance.getCurrentState();
        let flowDevName;
        let url;
        if (currentState && currentState.properties) {
            flowDevName = currentState.properties.name;
            url = `${this.runDebugUrl}${flowDevName}/${this.flowId}`;
            if (runOrDebug === DEBUG) {
                url = `${url}?flow__debug=true`;
            }
        }

        window.open(url, '_blank');
    };

    /**
     * Call back for before unload event
     * It will invoke a default browser warning when user tries to leave the flow builder
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
     * Handles the duplicate event fired from the Toolbar and dispatches a duplication action only if there's something
     * that can be duplicated
     */
    handleDuplicate = () => {
        const currentState = storeInstance.getCurrentState();
        const { canvasElementGuidMap, childElementGuidMap } = getDuplicateElementGuidMaps(currentState.canvasElements, currentState.elements);

        if (canvasElementGuidMap && Object.keys(canvasElementGuidMap).length > 0) {
            const connectorsToDuplicate = getConnectorToDuplicate(currentState.connectors, canvasElementGuidMap);

            const payload = {
                canvasElementGuidMap,
                childElementGuidMap,
                connectorsToDuplicate
            };
            storeInstance.dispatch(doDuplicate(payload));
        }
    };

    /**
     * Handles the edit flow properies event fired by the toolbar. Opens the flow properties property editor with
     * the current values for the flow properties.
     */
    handleEditFlowProperties = () => {
        const mode = EditElementEvent.EVENT_NAME;

        // Pop flow properties editor and do the following on callback.
        const node = getElementForPropertyEditor(storeInstance.getCurrentState().properties);
        node.saveType = SaveType.UPDATE;
        const nodeUpdate = flowPropertiesCallback(storeInstance);
        const newResourceCallback = this.newResourceCallback;
        this.queueOpenPropertyEditor({ mode, node, nodeUpdate, newResourceCallback });
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
     * Handles the run flow event fired by the toolbar. Opens and runs the flow in a different tab.
     */
    handleRunFlow = () => {
        this.runOrDebugFlow();
    };

    /**
     * Handles the debug flow event fired by the toolbar. Opens the flow debug window in a different tab.
     */
    handleDebugFlow = () => {
        this.runOrDebugFlow(DEBUG);
    };

    /**
     * Handles the save flow event fired by a toolbar. Saves the flow if the flow has already been created.
     * Pops the flowProperties property editor if the flow is being saved for the first time.
     * @param {object} event when save or save as buttons are clicked
     */
    handleSaveFlow = (event) => {
        if (event && event.detail && event.detail.type) {
            const eventType = event.detail.type;
            let flowProperties = storeInstance.getCurrentState().properties;
            const saveType = getSaveType(eventType, this.currentFlowId, flowProperties.canOnlySaveAsNewDefinition);
            if (saveType === SaveType.UPDATE) {
                this.saveFlow(SaveType.UPDATE);
            } else {
                flowProperties = getElementForPropertyEditor(flowProperties);
                flowProperties.saveType = saveType;
                const nodeUpdate = saveAsFlowCallback(storeInstance, this.saveFlow);
                const newResourceCallback = this.newResourceCallback;
                this.queueOpenPropertyEditor({ mode: eventType, node: flowProperties, nodeUpdate, newResourceCallback });
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
            const params = {id: this.flowId};
            // Keeping this as fetch because we want to go to the server
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallbackAndDiff, params);
        }
    };

    queueOpenPropertyEditor = (params) => {
        this.spinners.showPropertyEditorSpinner = true;
        Promise.all(this.propertyEditorBlockerCalls).then(() => {
            this.spinners.showPropertyEditorSpinner = false;
            this.propertyEditorBlockerCalls = [];
            invokePropertyEditor(PROPERTY_EDITOR, params);
        }).catch(() => {
            // we don't open the property editor because at least one promise was rejected
            this.spinners.showPropertyEditorSpinner = false;
        });
    };

    /**
     * Handle click event fired by a child component. Fires another event
     * containing resources information, which is handled by container.cmp.
     *  @param {object} event - when add resource button is clicked.
     */
    handleAddResourceElement = (event) => {
        const mode = event.type;
        const nodeUpdate = this.deMutateAndAddNodeCollection;
        this.queueOpenPropertyEditor({ mode, nodeUpdate });
    };

    /** *********** Canvas and Node Event Handling *************** **/

    /**
     * Handles the add element event which is fired after an element from left palette is dropped
     * on the canvas or via a click to add interaction.
     *
     * @param {Object} event canvas element drop event
     */
    handleAddCanvasElement = (event) => {
        if (event && event.type && event.detail) {
            const mode = event.type;
            const node = getElementForPropertyEditor({
                locationX: event.detail.locationX,
                locationY: event.detail.locationY,
                elementType: event.detail.elementType
            });
            const nodeUpdate = this.deMutateAndAddNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            this.queueOpenPropertyEditor({ mode, node, nodeUpdate, newResourceCallback });
        }
    };

    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - node double clicked event coming from node.js
     */
    handleEditElement = (event) => {
        if (event && event.detail && event.type) {
            const mode = event.type;
            const guid = event.detail.canvasElementGUID;
            const node = getElementForPropertyEditor(storeInstance.getCurrentState().elements[guid]);
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            this.queueOpenPropertyEditor({ mode, nodeUpdate, node, newResourceCallback });
            if (node && node.isCanvasElement) {
                storeInstance.dispatch(selectOnCanvas({
                    guid
                }));
            }
        }
    };

    /**
     * Handles the element delete event
     *
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleElementDelete = (event) => {
        if (event && event.detail) {
            getElementsToBeDeleted(storeInstance, event.detail);
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

            // Panning the canvas element into the viewport if needed
            const canvasContainer = this.template.querySelector('builder_platform_interaction-canvas-container');
            if (canvasContainer && canvasContainer.panElementToView) {
                canvasContainer.panElementToView(elementGuid);
            }

            // Highlighting the canvas element
            highlightCanvasElement(storeInstance, elementGuid);
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
     * @param {string} saveType the save type (saveDraft, createNewFlow, etc) to use when saving the flow
     */
    saveFlow = (saveType) => {
        const flow = translateUIModelToFlow(storeInstance.getCurrentState());

        const params = {
            flow,
            saveType
        };
        this.clearUndoRedoStack();
        // Keeping this as fetch because we want to go to the server
        fetch(SERVER_ACTION_TYPE.SAVE_FLOW, this.saveFlowCallback, params);
        this.saveType = saveType;
        this.saveStatus = LABELS.savingStatus;
        this.hasNotBeenSaved = true;
        this.disableSave = true;
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection = (node) => {
        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = getElementForStore(node);
        storeInstance.dispatch(updateElement(nodeForStore));
    };

    deMutateAndAddNodeCollection = (node) => {
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = getElementForStore(node);
        this.cacheNewComplexObjectFields(nodeForStore);
        storeInstance.dispatch(addElement(nodeForStore));
    };

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

    /**
     * Callback passed to variour property editors which support inline creation
     */
    newResourceCallback = () => {
        // This doesn't need the promise since a property editor already has to be open in this case
        invokePropertyEditor(PROPERTY_EDITOR, { mode: NewResourceEvent.EVENT_NAME, nodeUpdate: this.deMutateAndAddNodeCollection});
    };

    renderedCallback() {
        const currentState = storeInstance.getCurrentState();
        if (!this.isFlowServerCallInProgress && this.spinners.showFlowMetadataSpinner) {
            this.spinners.showFlowMetadataSpinner = false;
            logPerfTransactionEnd(EDITOR, {
                numOfNodes: currentState.canvasElements.length,
                numOfConnectors: currentState.connectors.length
            });

            if (this.flowId) {
                this.saveStatus = LABELS.savedStatus;
                this.hasNotBeenSaved = false;
            }
            this.disableSave = false;
        }
    }

    disconnectedCallback() {
        unsubscribeStore();
    }

    createFlowFromTemplate = (versionIdOrEnum) => {
        fetch(SERVER_ACTION_TYPE.GET_TEMPLATE_DATA, this.getTemplateDataCallback, {id: versionIdOrEnum}, {background: true});
    };

    getTemplateDataCallback = ({data, error}) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
        } else {
            this.getFlowCallback({data, error});
            storeInstance.dispatch(updateProperties({
                versionNumber: null,
                status: null,
                isLightningFlowBuilder: true,
                isTemplate: false,
                lastModifiedDate: null,
                lastModifiedBy: null,
                name: "",
            }));
            storeInstance.dispatch(clearUndoRedo);
        }
    };

    // Create start element
    createStartElement() {
        const startElement = getElementForStore({
            elementType: ELEMENT_TYPE.START_ELEMENT
        });
        storeInstance.dispatch(addElement(startElement));
    }

    /**
     * Callback passed when user clicks on Exit icon
     */
    closeFlowModalCallback = () => {
        if (this.backUrl) {
            window.top.location = this.backUrl;
            return false;
        }
        // skip exit
        return true;
    };

    /**
     * Callback passed when user clicks on Create button
     */
    createFlowFromTemplateCallback = (panel) => {
        const templatesModalBody = panel.get('v.body')[0];
        if (templatesModalBody && templatesModalBody.isValid()) {
            const selectedTemplate = templatesModalBody.get('v.selectedTemplate');
            const isProcessType = templatesModalBody.get('v.isProcessType');
            // create the flow from the template
            if (!isProcessType) {
                this.createFlowFromTemplate(selectedTemplate);
                this.isFlowServerCallInProgress = true;
                this.spinners.showFlowMetadataSpinner = true;
            } else {
                // create the empty flow for the selected process type
                this.spinners.showFlowMetadataSpinner = true;
                this.createFlowFromProcessType(selectedTemplate);
                this.spinners.showFlowMetadataSpinner = false;
            }
        }
        panel.close();
    };

    /**
     * Create the blank flow from the process type
     */
    createFlowFromProcessType = (processType) => {
        storeInstance.dispatch(updateFlow({properties: {processType}, canvasElements: [], connectors: [], elements: {}}));
        this.createStartElement();
        this.disableSave = false;
        storeInstance.dispatch(clearUndoRedo);
    };
}