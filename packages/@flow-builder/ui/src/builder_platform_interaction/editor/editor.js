import { LightningElement, track, api } from 'lwc';
import {
    invokePropertyEditor,
    PROPERTY_EDITOR,
    invokeModalInternalData,
    invokeNewFlowModal
} from 'builder_platform_interaction/builderUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    getSObjectOrSObjectCollectionByEntityElements,
    componentInstanceScreenFieldsSelector,
    byElementTypeElementsSelector
} from 'builder_platform_interaction/selectors';
import {
    updateFlow,
    doDuplicate,
    addElement,
    updateElement,
    selectOnCanvas,
    undo,
    redo,
    clearUndoRedo,
    updatePropertiesAfterCreatingFlowFromTemplate,
    updatePropertiesAfterCreatingFlowFromProcessType,
    updatePropertiesAfterActivateButtonPress,
    updatePropertiesAfterSaveButtonPress,
    UPDATE_PROPERTIES_AFTER_SAVING,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
    UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    UPDATE_CANVAS_ELEMENT_LOCATION,
    UPDATE_PROPERTIES_AFTER_SAVE_FAILED,
    updateApexClasses,
    ADD_START_ELEMENT,
    UPDATE_APEX_CLASSES,
    UPDATE_PROPERTIES_AFTER_ACTIVATE_BUTTON_PRESS
} from 'builder_platform_interaction/actions';
import {
    ELEMENT_TYPE,
    FLOW_STATUS
} from 'builder_platform_interaction/flowMetadata';
import {
    fetch,
    fetchOnce,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import {
    translateFlowToUIModel,
    translateUIModelToFlow
} from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import {
    undoRedo,
    isUndoAvailable,
    isRedoAvailable,
    INIT
} from 'builder_platform_interaction/undoRedoLib';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './editorLabels';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    logInteraction,
    logPerfTransactionEnd,
    logPerfTransactionStart,
    setAppName
} from 'builder_platform_interaction/loggingUtils';
import {
    EditElementEvent,
    NewResourceEvent
} from 'builder_platform_interaction/events';
import { SaveType } from 'builder_platform_interaction/saveType';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { mutateFlowResourceToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import {
    getElementForPropertyEditor,
    getElementForStore
} from 'builder_platform_interaction/propertyEditorFactory';
import { diffFlow } from 'builder_platform_interaction/metadataUtils';
import {
    getElementsToBeDeleted,
    getSaveType,
    updateStoreAfterSaveFlowIsSuccessful,
    updateUrl,
    updateStoreAfterSaveAsNewFlowIsFailed,
    updateStoreAfterSaveAsNewVersionIsFailed,
    setFlowErrorsAndWarnings,
    flowPropertiesCallback,
    saveAsFlowCallback,
    setPeripheralDataForPropertyEditor,
    setApexClassesForPropertyEditor,
    getDuplicateElementGuidMaps,
    getConnectorToDuplicate,
    highlightCanvasElement,
    getSelectedTemplate,
    setErrorMessage,
    closeModalAndNavigateTo,
    createStartElement
} from './editorUtils';
import { cachePropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import {
    getProcessTypes,
    setProcessTypes,
    setProcessTypeFeature
} from 'builder_platform_interaction/systemLib';
import { isConfigurableStartSupported } from 'builder_platform_interaction/processTypeLib';
import { describeExtensions } from 'builder_platform_interaction/flowExtensionLib';
import { removeLastCreatedInlineResource } from 'builder_platform_interaction/actions';
import {
    fetchParametersForInvocableAction,
    setInvocableActions
} from 'builder_platform_interaction/invocableActionLib';

let unsubscribeStore;
let storeInstance;

const RUN = 'run';
const DEBUG = 'debug';

const EDITOR = 'EDITOR';
const APP_NAME = 'FLOW_BUILDER';

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @since 214
 */
export default class Editor extends LightningElement {
    @track
    flowStatus;

    currentFlowId;
    currentFlowDefId;
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

    @track
    backUrl;

    @track
    helpUrl;

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
    disableActivate = true;

    @track
    saveStatus;

    @track
    saveType;

    @track
    retrievedHeaderUrls = false;

    @track
    isUndoDisabled = true;

    @track
    isRedoDisabled = true;

    propertyEditorBlockerCalls = [];

    constructor() {
        super();
        // Setting the app name to differenciate between FLOW_BUILDER or STRATEGY_BUILDER
        setAppName(APP_NAME);
        logPerfTransactionStart(EDITOR);
        const blacklistedActionsForUndoRedoLib = [
            INIT,
            UPDATE_APEX_CLASSES,
            ADD_START_ELEMENT,
            UPDATE_PROPERTIES_AFTER_SAVING, // Called after successful save callback returns
            UPDATE_PROPERTIES_AFTER_SAVE_FAILED, // Called after save callback returns with errors from server
            UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_TEMPLATE,
            UPDATE_PROPERTIES_AFTER_CREATING_FLOW_FROM_PROCESS_TYPE,
            UPDATE_PROPERTIES_AFTER_ACTIVATE_BUTTON_PRESS
        ];
        const groupedActions = [
            TOGGLE_ON_CANVAS, // Used for shift-select elements on canvas.
            DESELECT_ON_CANVAS, // is dispatched when user clicks on the blank space in canvas.
            MARQUEE_SELECT_ON_CANVAS, // is dispatched when the user is marquee selecting on the canvas.
            UPDATE_CANVAS_ELEMENT_LOCATION // is dispatched when elements are moved on canvas.
        ];
        // Initialising store
        storeInstance = Store.getStore(
            undoRedo(reducer, {
                blacklistedActions: blacklistedActionsForUndoRedoLib,
                groupedActions
            })
        );
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        fetchOnce(SERVER_ACTION_TYPE.GET_HEADER_URLS).then(data =>
            this.getHeaderUrlsCallBack(data)
        );
        this.retrieveApexInfo();
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
        } else {
            invokeNewFlowModal(
                this.closeFlowModalCallback,
                this.createFlowFromTemplateCallback
            );
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
            this.spinners.showPropertyEditorSpinner
        );
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
        this.flowStatus = currentState.properties.status;
        if (
            currentState.properties.processType &&
            currentState.properties.processType !== this.properties.processType
        ) {
            logPerfTransactionStart(
                SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
            );
            const getPeripheralDataForPropertyEditor = fetchOnce(
                SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR,
                {
                    crudType: 'ALL',
                    flowProcessType: currentState.properties.processType
                },
                { background: true }
            )
                .then(data => {
                    logPerfTransactionEnd(
                        SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                    );
                    setPeripheralDataForPropertyEditor(data);
                    this.peripheralDataFetched = true;
                })
                .catch(() => {});
            this.propertyEditorBlockerCalls.push(
                getPeripheralDataForPropertyEditor
            );

            // Get Features
            const getProcessTypeFeatureCall = fetchOnce(
                SERVER_ACTION_TYPE.GET_PROCESS_TYPE_FEATURES,
                { flowProcessType: currentState.properties.processType }
            )
                .then(data => {
                    setProcessTypeFeature(
                        currentState.properties.processType,
                        data
                    );
                })
                .catch(() => {});
            this.propertyEditorBlockerCalls.push(getProcessTypeFeatureCall);

            // Get Actions
            fetchOnce(
                SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS,
                {
                    flowProcessType: currentState.properties.processType
                },
                { background: true }
            )
                .then(data => setInvocableActions(data))
                .catch(() => {});

            // Get Apex Plugins
            fetchOnce(
                SERVER_ACTION_TYPE.GET_APEX_PLUGINS,
                {},
                { background: true }
            ).catch(() => {});

            // Get Subflows
            fetchOnce(
                SERVER_ACTION_TYPE.GET_SUBFLOWS,
                {
                    flowProcessType: currentState.properties.processType
                },
                { background: true }
            ).catch(() => {});
        }
        this.properties = currentState.properties;
        this.showWarningIfUnsavedChanges();
        // should fetch process types here if they aren't fetched
        if (!getProcessTypes()) {
            const getProcessTypesCall = fetchOnce(
                SERVER_ACTION_TYPE.GET_PROCESS_TYPES,
                {}
            ).then(data => {
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
    getFlowCallback = ({ data, error }) => {
        if (error) {
            // Handle error case here if something is needed beyond our automatic generic error modal popup
            this.spinners.showFlowMetadataSpinner = false;
        } else {
            storeInstance.dispatch(updateFlow(translateFlowToUIModel(data)));
            this.setOriginalFlowValues();
            this.loadFieldsForSobjectsInFlow();
            this.loadFieldsForExtensionsInFlow();
            this.loadParametersForInvocableActionsInFlow();
        }
        this.isFlowServerCallInProgress = false;
    };

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
                    bodyTextOne:
                        'Encountered an issue while trying to retrieve the before flow'
                },
                footerData: {
                    buttonOne: {
                        buttonLabel: 'OK'
                    }
                }
            });
        } else {
            const originalFlow = data;
            const newFlow = translateUIModelToFlow(
                storeInstance.getCurrentState()
            );

            // full diff
            const fullDiff = diffFlow(
                originalFlow,
                newFlow,
                false,
                false,
                false
            );
            const fullDiffJson = JSON.stringify(fullDiff, null, 2);

            // Trimmed Diff - use blacklist, ignore undefined values, empty arrays, empty strings,
            // and differences in date/dateTime formats
            const trimmedDiff = diffFlow(
                originalFlow,
                newFlow,
                true,
                true,
                true
            );
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

    /**
     * This is called once the flow has been loaded, so that sobjects in the flow have their fields loaded and cached
     */
    loadFieldsForSobjectsInFlow() {
        const currentState = storeInstance.getCurrentState();
        // Only gets elements with sObject datatype (no collections)
        const sobjects = getSObjectOrSObjectCollectionByEntityElements(
            currentState.elements
        );
        for (let i = 0; i < sobjects.length; i++) {
            // add sobject element to combobox cache in required shape
            const sObjectInComboboxShape = mutateFlowResourceToComboboxShape(
                sobjects[i]
            );
            addToParentElementCache(
                sObjectInComboboxShape.displayText,
                sObjectInComboboxShape
            );
            // fetch fields and cache them
            this.propertyEditorBlockerCalls.push(
                fetchFieldsForEntity(sobjects[i].subtype, {
                    disableErrorModal: true
                }).catch(() => {})
            );
        }
    }

    /**
     * This is called once the flow has been loaded, so that Lightning component screen fields in the flow have their fields loaded and cached.
     * We only consider lightning components screen fields in automatic output handling mode.
     */
    loadFieldsForExtensionsInFlow() {
        const extensionNames = componentInstanceScreenFieldsSelector(
            storeInstance.getCurrentState()
        )
            .filter(
                screenField => screenField.storeOutputAutomatically === true
            )
            .map(screenField => screenField.extensionName);
        this.propertyEditorBlockerCalls.push(
            describeExtensions(extensionNames, {
                disableErrorModal: true,
                background: true
            }).catch(() => {})
        );
    }

    /**
     * This is called once the flow has been loaded, so that actions in the flow have their fields loaded and cached.
     * We only consider actions in automatic output handling mode.
     */
    loadParametersForInvocableActionsInFlow() {
        const actionCallsSelector = byElementTypeElementsSelector(
            ELEMENT_TYPE.ACTION_CALL
        );
        const actionCallNamesAndTypes = actionCallsSelector(
            storeInstance.getCurrentState()
        )
            .filter(actionCall => actionCall.storeOutputAutomatically === true)
            .map(actionCall => ({
                actionName: actionCall.actionName,
                actionType: actionCall.actionType
            }));
        actionCallNamesAndTypes.forEach(actionCallNameAndType =>
            this.propertyEditorBlockerCalls.push(
                fetchParametersForInvocableAction(actionCallNameAndType, {
                    disableErrorModal: true,
                    background: true
                }).catch(() => {})
            )
        );
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
            this.clearUndoRedoStack();
            this.currentFlowId = data.flowId;
            updateStoreAfterSaveFlowIsSuccessful(storeInstance, data);
            updateUrl(this.currentFlowId);
            this.setOriginalFlowValues();
        } else if (
            !data.isSuccess &&
            this.saveType === SaveType.NEW_DEFINITION
        ) {
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
    getHeaderUrlsCallBack = data => {
        let isFromAloha = data.preferred === 'CLASSIC';
        if (window.location.search.indexOf('isFromAloha=true') >= 0) {
            isFromAloha = true;
        }
        this.backUrl = isFromAloha
            ? this.buildBackUrlForAloha(data.flowUrl)
            : this.buildBackUrlForLightning(data.lightningFlowUrl);
        this.helpUrl = data.helpUrl;
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
            url =
                url.split('/home')[0] +
                '/page?address=' +
                encodeURIComponent('/' + this.currentFlowDefId);
        }
        return url;
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
            window.removeEventListener(
                'beforeunload',
                this.beforeUnloadCallback
            );
        }
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
        } = getDuplicateElementGuidMaps(
            currentState.canvasElements,
            currentState.elements
        );

        if (
            canvasElementGuidMap &&
            Object.keys(canvasElementGuidMap).length > 0
        ) {
            const connectorsToDuplicate = getConnectorToDuplicate(
                currentState.connectors,
                canvasElementGuidMap
            );

            const payload = {
                canvasElementGuidMap,
                childElementGuidMap,
                connectorsToDuplicate,
                unduplicatedCanvasElementsGuids
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
        const node = getElementForPropertyEditor(
            storeInstance.getCurrentState().properties
        );
        node.saveType = SaveType.UPDATE;
        const nodeUpdate = flowPropertiesCallback(storeInstance);
        const newResourceCallback = this.newResourceCallback;
        this.queueOpenPropertyEditor({
            mode,
            node,
            nodeUpdate,
            newResourceCallback
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
    handleSaveFlow = event => {
        if (event && event.detail && event.detail.type) {
            const eventType = event.detail.type;
            let flowProperties = storeInstance.getCurrentState().properties;
            const saveType = getSaveType(
                eventType,
                this.currentFlowId,
                flowProperties.canOnlySaveAsNewDefinition
            );
            if (saveType === SaveType.UPDATE) {
                this.saveFlow(SaveType.UPDATE);
            } else {
                flowProperties = getElementForPropertyEditor(flowProperties);
                flowProperties.saveType = saveType;
                const nodeUpdate = saveAsFlowCallback(
                    storeInstance,
                    this.saveFlow
                );
                const newResourceCallback = this.newResourceCallback;
                this.queueOpenPropertyEditor({
                    mode: eventType,
                    node: flowProperties,
                    nodeUpdate,
                    newResourceCallback
                });
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
            fetch(
                SERVER_ACTION_TYPE.GET_FLOW,
                this.getFlowCallbackAndDiff,
                params
            );
        }
    };

    /**
     * Handles the toggle flow status event fired by a toolbar. Changes the flow status from obsolete or
     * draft to active or vice versa.
     */
    handleToggleFlowStatus = () => {
        const params = { flowId: this.flowId };
        fetch(
            SERVER_ACTION_TYPE.TOGGLE_FLOW_STATUS,
            this.toggleFlowStatusCallBack,
            params
        );
        storeInstance.dispatch(
            updatePropertiesAfterActivateButtonPress({
                status: FLOW_STATUS.ACTIVATING
            })
        );
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
            this.clearUndoRedoStack();
            storeInstance.dispatch(
                updatePropertiesAfterActivateButtonPress({
                    status: data.status,
                    lastModifiedDate: data.lastModifiedDate,
                    lastModifiedBy: data.lastModifiedBy
                })
            );
        }
    };

    queueOpenPropertyEditor = params => {
        this.spinners.showPropertyEditorSpinner = true;
        Promise.all(this.propertyEditorBlockerCalls)
            .then(() => {
                this.spinners.showPropertyEditorSpinner = false;
                this.propertyEditorBlockerCalls = [];
                invokePropertyEditor(PROPERTY_EDITOR, params);
            })
            .catch(() => {
                // we don't open the property editor because at least one promise was rejected
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
        this.queueOpenPropertyEditor({ mode, nodeUpdate });
    };

    /** *********** Canvas and Node Event Handling *************** **/

    /**
     * Handles the add element event which is fired after an element from left palette is dropped
     * on the canvas or via a click to add interaction.
     *
     * @param {Object} event canvas element drop event
     */
    handleAddCanvasElement = event => {
        if (
            storeInstance &&
            storeInstance.getCurrentState().properties.lastInlineResourceGuid
        ) {
            storeInstance.dispatch(removeLastCreatedInlineResource);
        }

        if (event && event.type && event.detail) {
            logPerfTransactionStart('PropertyEditor');
            const mode = event.type;
            const node = getElementForPropertyEditor({
                locationX: event.detail.locationX,
                locationY: event.detail.locationY,
                elementType: event.detail.elementType,
                isNewElement: true
            });
            const nodeUpdate = this.deMutateAndAddNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            const processType = this.properties.processType;
            this.queueOpenPropertyEditor({
                mode,
                node,
                nodeUpdate,
                newResourceCallback,
                processType
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
            const mode = event.type;
            const guid = event.detail.canvasElementGUID;
            const node = getElementForPropertyEditor(
                storeInstance.getCurrentState().elements[guid]
            );
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            const processType = this.properties.processType;
            if (
                node.elementType !== ELEMENT_TYPE.START_ELEMENT ||
                isConfigurableStartSupported(processType)
            ) {
                logPerfTransactionStart('PropertyEditor');
                this.queueOpenPropertyEditor({
                    mode,
                    nodeUpdate,
                    node,
                    newResourceCallback,
                    processType
                });
                if (node && node.isCanvasElement) {
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
     * Handles the element delete event
     *
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleElementDelete = event => {
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
    handleHighlightOnCanvas = event => {
        if (event && event.detail && event.detail.elementGuid) {
            const elementGuid = event.detail.elementGuid;

            // Panning the canvas element into the viewport if needed
            const canvasContainer = this.template.querySelector(
                'builder_platform_interaction-canvas-container'
            );
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
    saveFlow = saveType => {
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
            { saveType },
            'click'
        );
        this.saveStatus = LABELS.savingStatus;
        storeInstance.dispatch(
            updatePropertiesAfterSaveButtonPress({
                status: FLOW_STATUS.SAVING
            })
        );
        this.hasNotBeenSaved = true;
        this.disableSave = true;
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection = node => {
        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = getElementForStore(node);
        storeInstance.dispatch(updateElement(nodeForStore));
        logInteraction(
            `update-node-of-type-${node.elementType}`,
            'modal',
            null,
            'click'
        );
    };

    deMutateAndAddNodeCollection = node => {
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = getElementForStore(node);
        this.cacheNewComplexObjectFields(nodeForStore);
        storeInstance.dispatch(addElement(nodeForStore));
        logInteraction(
            `add-node-of-type-${node.elementType}`,
            'modal',
            null,
            'click'
        );
    };

    /**
     * Fetches & caches the fields/properties for new sobject/apex variable types. Shows spinner until this is done
     */
    cacheNewComplexObjectFields(node) {
        if (
            node.elementType === ELEMENT_TYPE.VARIABLE &&
            node.subtype &&
            !node.isCollection
        ) {
            const varInComboboxShape = mutateFlowResourceToComboboxShape(node);
            addToParentElementCache(
                varInComboboxShape.displayText,
                varInComboboxShape
            );
            if (node.dataType === FLOW_DATA_TYPE.SOBJECT.value) {
                this.propertyEditorBlockerCalls.push(
                    fetchFieldsForEntity(node.subtype).catch(() => {})
                );
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
        invokePropertyEditor(PROPERTY_EDITOR, {
            mode: NewResourceEvent.EVENT_NAME,
            nodeUpdate: this.deMutateAndAddNodeCollection
        });
    };

    renderedCallback() {
        const currentState = storeInstance.getCurrentState();
        if (
            !this.isFlowServerCallInProgress &&
            this.spinners.showFlowMetadataSpinner
        ) {
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
            modal.close();
        }
    };

    /**
     * Callback passed when user clicks on Exit icon from new flow modal
     */
    closeFlowModalCallback = () => {
        return closeModalAndNavigateTo(this.backUrl);
    };

    /**
     * Callback passed when user clicks on Create button from new flow modal
     * @param modal the flow modal
     */
    createFlowFromTemplateCallback = modal => {
        const { templateId, processType } = getSelectedTemplate(modal);
        if (templateId) {
            logInteraction(
                `create-new-flow-button`,
                'editor-component',
                { devNameOrId: templateId },
                'click',
                'user'
            );
            // create the flow from the template
            this.createFlowFromTemplate(templateId, modal);
            this.isFlowServerCallInProgress = true;
            this.spinners.showFlowMetadataSpinner = true;
        } else {
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
                this.createFlowFromProcessType(processType);
                this.spinners.showFlowMetadataSpinner = false;
            }
            modal.close();
        }
    };

    /**
     * Create the blank flow from the process type
     * @param processType the selected process type
     */
    createFlowFromProcessType = processType => {
        storeInstance.dispatch(
            updatePropertiesAfterCreatingFlowFromProcessType({ processType })
        );
        createStartElement(storeInstance);
        this.disableSave = false;
    };

    retrieveApexInfo = () => {
        fetchOnce(
            SERVER_ACTION_TYPE.GET_APEX_TYPES,
            {},
            { background: true }
        ).then(data => {
            storeInstance.dispatch(updateApexClasses(data));
            setApexClassesForPropertyEditor(data);
        });
    };
}
