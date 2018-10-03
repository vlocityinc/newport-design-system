import { LightningElement, track, api } from 'lwc';
import { invokePropertyEditor, PROPERTY_EDITOR, invokeModalInternalData } from 'builder_platform_interaction/builderUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { canvasSelector, getSObjectOrSObjectCollectionByEntityElements } from 'builder_platform_interaction/selectors';
import { updateFlow, updateProperties, addElement, updateElement, deleteElement, addConnector, selectOnCanvas, toggleOnCanvas, deselectOnCanvas } from 'builder_platform_interaction/actions';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { sortConnectorPickerComboboxOptions, getLabelAndValueForConnectorPickerOptions, createNewConnector } from 'builder_platform_interaction/connectorUtils';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { translateFlowToUIModel, translateUIModelToFlow } from 'builder_platform_interaction/translatorLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { setEntities, getFieldsForEntity, setEventTypes } from 'builder_platform_interaction/sobjectLib';
import { drawingLibInstance as lib } from 'builder_platform_interaction/drawingLib';
import { LABELS } from './editorLabels';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import { usedBy, invokeUsedByAlertModal } from 'builder_platform_interaction/usedByLib';
import { logPerfTransactionStart, logPerfTransactionEnd, logPerfMarkStart, logPerfMarkEnd } from 'builder_platform_interaction/loggingUtils';
import { SaveFlowEvent, EditElementEvent, NewResourceEvent } from 'builder_platform_interaction/events';
import { SaveType } from 'builder_platform_interaction/saveType';
import { addToParentElementCache } from 'builder_platform_interaction/comboboxCache';
import { mutateFlowResourceToComboboxShape } from 'builder_platform_interaction/expressionUtils';
import { getElementForPropertyEditor, getElementForStore } from 'builder_platform_interaction/propertyEditorFactory';
import { diffFlow } from "builder_platform_interaction/metadataUtils";

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

    @track
    appState = {
        canvas: {
            nodes: [],
            connectors: []
        },
        properties: {}
    };

    @track backUrl;

    @track helpUrl;

    runDebugUrl;

    isFlowServerCallInProgress = false;

    @track showSpinner = false;

    @track hasNotBeenSaved = true;
    @track disableSave = true;
    @track saveStatus;

    @track errors;

    constructor() {
        super();
        // Initialising store
        logPerfTransactionStart(EDITOR);
        storeInstance = Store.getStore(reducer);
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        // TODO: Move these server calls after getting the Flow
        fetch(SERVER_ACTION_TYPE.GET_RULES, this.getRulesCallback);
        fetch(SERVER_ACTION_TYPE.GET_OPERATORS, this.getOperatorsCallback);
        logPerfMarkStart(SERVER_ACTION_TYPE.GET_ENTITIES);
        fetch(SERVER_ACTION_TYPE.GET_ENTITIES, this.getEntitiesCallback, { crudType: 'ALL' }, {background: true});
        fetch(SERVER_ACTION_TYPE.GET_HEADER_URLS, this.getHeaderUrlsCallBack);
        fetch(SERVER_ACTION_TYPE.GET_RESOURCE_TYPES, this.getResourceTypesCallback);
        fetch(SERVER_ACTION_TYPE.GET_EVENT_TYPES, this.getEventTypesCallback, {}, { background: true });
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
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallback, params);
            this.isFlowServerCallInProgress = true;
            this.showSpinner = true;
        } else {
            // Create start element
            const startElement = getElementForStore({
                elementType: ELEMENT_TYPE.START_ELEMENT
            });
            storeInstance.dispatch(addElement(startElement));
            this.disableSave = false;
        }
    }

    get shouldCreateCanvas() {
        return (this.appState.canvas.nodes && this.appState.canvas.nodes.length > 0);
    }

    get spinnerAlternativeText() {
        return LABELS.spinnerAlternativeText;
    }

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();

        const nodes = canvasSelector(currentState);
        const connectors = currentState.connectors;
        const properties = currentState.properties;
        this.appState = {
            canvas : {
                nodes,
                connectors
            },
            properties
        };
    };

    /**
     * Callback which gets executed once we get the flow from java controller
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getFlowCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            storeInstance.dispatch(updateFlow(translateFlowToUIModel(data)));
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
            const fullDiff = diffFlow(originalFlow, newFlow, false, false);
            const fullDiffJson = JSON.stringify(fullDiff, null, 2);

            // Trimmed Diff - use blacklist, ignore undefined values, empty arrays, and empty strings
            const trimmedDiff = diffFlow(originalFlow, newFlow, true, true);
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
            getFieldsForEntity(sobjectVariables[i].objectType);
        }
    }

    /**
     * Callback which gets executed after saving a flow
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    saveFlowCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else if (data.isSuccess) {
            this.currentFlowId = data.flowId;
            storeInstance.dispatch(updateProperties({
                versionNumber: data.versionNumber,
                status: data.status,
                lastModifiedDate: data.lastModifiedDate
            }));
            window.history.pushState(null, 'Flow Builder', window.location.href.split('?')[0] + '?flowId=' + this.currentFlowId);
            this.errors = [];
        } else {
            this.saveStatus = null;
            this.errors = data.errors;
        }

        if (this.flowId) {
            this.hasNotBeenSaved = false;
            this.saveStatus = LABELS.savedStatus;
        }
        this.disableSave = false;
    };

    /**
     * Callback which gets executed after getting rules for expression builder
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getRulesCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            setRules(data);
        }
    };

    getOperatorsCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            setOperators(data);
        }
    }

    getEntitiesCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            logPerfMarkEnd(SERVER_ACTION_TYPE.GET_ENTITIES);
            setEntities(data);
        }
    };

    /**
     * Callback which gets executed after getting data urls for header
     *
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getHeaderUrlsCallBack = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            this.backUrl = data.backUrl;
            this.helpUrl = data.helpUrl;
            this.runDebugUrl = data.runDebugUrl;
        }
    };

    /**
     * Callback which gets executed after fetching the resource types for New Resource editor
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getResourceTypesCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
            setResourceTypes(data);
        }
    };

    /**
     * Callback which gets executed after fetching the extensions for Screen editor
     * @param {Array} data doesn't get used here
     * @param {String} error the error that gets returned
     */
    getExtensionsCallback = (data, error) => {
        if (error) {
            // TODO: handle error case
        }
    };

    /**
     * Callback which gets executed after fetching the event types for wait event editor
     * @param {Object} has error property if there is error fetching the data else has data property
     */
    getEventTypesCallback = ({ data, error }) => {
        if (error) {
            // Error is handled in auraFetch function to show error modal
        } else {
            setEventTypes(data);
        }
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
     * Handles the edit flow properies event fired by the toolbar. Opens the flow properties property editor with
     * the current values for the flow properties.
     */
    handleEditFlowProperties = () => {
        const mode = EditElementEvent.EVENT_NAME;

        // Pop flow properties editor and do the following on callback.
        const node = getElementForPropertyEditor(storeInstance.getCurrentState().properties);
        node.saveType = SaveType.UPDATE;
        const nodeUpdate = this.flowPropertiesCallback;
        invokePropertyEditor(PROPERTY_EDITOR, { mode, node, nodeUpdate });
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
        const mode = event.detail.type;

        if (mode === SaveFlowEvent.Type.SAVE && this.currentFlowId) {
            // We're updating a flow when the save button was pressed and we have a flow id.
            this.saveFlow(SaveType.UPDATE);
        } else {
            // Pop flow properties editor and do the following on callback.
            const node = getElementForPropertyEditor(storeInstance.getCurrentState().properties);

            // TODO: We won't need to set the save type here after we introduce the save type
            // selector in the flow-properties-editor component. Temporarily adding the save type
            // to the flow properties object so we know how we're supposed to save in the callback.
            const saveType = (mode === SaveFlowEvent.Type.SAVE) ? SaveType.CREATE : SaveType.NEW_VERSION;
            node.saveType = saveType;

            const nodeUpdate = this.flowPropertiesCallback;
            invokePropertyEditor(PROPERTY_EDITOR, { mode, node, nodeUpdate });
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
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallbackAndDiff, params);
        }
    }

    /**
     * Callback which gets executed after clicking done on the Flow Properties Editor
     *
     * @param {Object} flowProperties - An object containing all values for the various flow properties
     * that the user specified on the Flow Properties Editor
     */
    flowPropertiesCallback = (flowProperties) => {
        // Get the save type  before it gets removed by the mutation below.
        // TODO: We may not need to do this depending on how the save type selector is implemented.
        const saveType = flowProperties.saveType;
        const properties = getElementForStore(flowProperties);

        storeInstance.dispatch(updateProperties(properties));
        if (saveType !== SaveType.UPDATE) {
            this.saveFlow(saveType);
        }
    };

    /**
     * Handle click event fired by a child component. Fires another event
     * containing resources information, which is handled by container.cmp.
     *  @param {object} event - when add resource button is clicked.
     */
    handleAddResourceElement = (event) => {
        const mode = event.type;
        const nodeUpdate = this.deMutateAndAddNodeCollection;
        invokePropertyEditor(PROPERTY_EDITOR, { mode, nodeUpdate });
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
            invokePropertyEditor(PROPERTY_EDITOR, { mode, node, nodeUpdate, newResourceCallback });
        }
    };


    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - node double clicked event coming from node.js
     */
    handleEditElement = (event) => {
        this.handleNodeSelection(event);
        if (event && event.detail && event.type) {
            const mode = event.type;
            const guid = event.detail.canvasElementGUID;
            const node = getElementForPropertyEditor(storeInstance.getCurrentState().elements[guid]);
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            const newResourceCallback = this.newResourceCallback;
            invokePropertyEditor(PROPERTY_EDITOR, { mode, nodeUpdate, node, newResourceCallback });
        }
    };

    /**
     * Handles the node click event and dispatches an action to select the clicked node and deselect everything else on
     * the canvas when multi-select is off. If multi-select is off, then dispatches an action to toggle the current
     * state of the clicked node.
     *
     * @param {object} event - node clicked event coming from node.js
     */
    handleNodeSelection = (event) => {
        if (event && event.detail) {
            const payload = {
                guid: event.detail.canvasElementGUID
            };

            if (!event.detail.isMultiSelectKeyPressed) {
                storeInstance.dispatch(selectOnCanvas(payload));
            } else {
                storeInstance.dispatch(toggleOnCanvas(payload));
            }
        }
    };

    /**
     * Handles the connector click event and dispatches an action to select the clicked connector and deselect everything else on
     * the canvas when multi-select is off. If multi-select is off, then dispatches an action to toggle the current
     * state of the clicked connector.
     *
     * @param {object} event - connection clicked event coming from canvas.js
     */
    handleConnectorSelection = (event) => {
        if (event && event.detail) {
            const payload = {
                guid : event.detail.connectorGUID
            };

            if (!event.detail.isMultiSelectKeyPressed) {
                storeInstance.dispatch(selectOnCanvas(payload));
            } else {
                storeInstance.dispatch(toggleOnCanvas(payload));
            }
        }
    };

    /**
     * Handles the canvas mouse up event and dispatches an action to deselect all selected nodes and connectors.
     */
    handleElementDeselection = () => {
        storeInstance.dispatch(deselectOnCanvas());
    };

    /**
     * Helper method to determine if the connector is an associated connector or not
     *
     * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {Object} connector - A single connector object
     * @return {boolean} returns boolean based on if the connector is associated with any canvas element that is being deleted or not
     */
    isAssociatedConnector = (selectedElementGUIDs, connector) => {
        return (selectedElementGUIDs.indexOf(connector.target) !== -1 || selectedElementGUIDs.indexOf(connector.source) !== -1);
    };

    /**
     * Helper method to delete the selected elements
     *
     * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {String[]} connectorsToDelete - Contains all the selected and associated connectors that need to be deleted
     * @param {String} elementType - Type of the element being deleted
     */
    doDelete = (selectedElementGUIDs, connectorsToDelete, elementType) => {
        const selectedElementsLength  = selectedElementGUIDs.length;
        for (let i = 0; i < selectedElementsLength; i++) {
            const selectedGUID = selectedElementGUIDs[i];
            lib.removeNodeFromLib(selectedGUID);
        }

        const payload = {
            selectedElementGUIDs,
            connectorsToDelete,
            elementType
        };
        storeInstance.dispatch(deleteElement(payload));
    };

    /**
     * Helper method to delete the selected elements or invoke delete alert modal
     *
     * @param {String[]} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {String[]} connectorsToDelete - Contains all the selected and associated connectors that need to be deleted
     * @param {String} elementType - Type of the element being deleted
     */
    doDeleteOrInvokeAlert = (selectedElementGUIDs, connectorsToDelete, elementType) => {
        const currentState = storeInstance.getCurrentState();
        const storeElements = currentState.elements;

        const usedByElements = usedBy(selectedElementGUIDs, storeElements);

        if (!usedByElements || usedByElements.length === 0) {
            // Deleting the elements that are not being referenced anywhere else
            this.doDelete(selectedElementGUIDs, connectorsToDelete, elementType);
        } else {
            // Handling cases when the element/elements being deleted are being referenced somewhere in the flow
            invokeUsedByAlertModal(usedByElements, selectedElementGUIDs, elementType, storeElements);
        }
    };

    /**
     * Handles the element delete event
     *
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleElementDelete = (event) => {
        if (event && event.detail) {
            const selectedElementGUIDs = [];
            const connectorsToDelete = [];
            let elementType;

            if (!event.detail.selectedElementGUID) {
                // Adds all the selected nodes to the selectedElementGUIDs array
                const nodesLength = this.appState.canvas.nodes.length;
                for (let i = 0; i < nodesLength; i++) {
                    const canvasElement = this.appState.canvas.nodes[i];
                    if (canvasElement.config.isSelected) {
                        selectedElementGUIDs.push(canvasElement.guid);
                    }
                }

                // Adds all the selected and associated connectors to the connectorsToDelete array
                const connectorsLength = this.appState.canvas.connectors.length;
                for (let i = 0; i < connectorsLength; i++) {
                    const connector = this.appState.canvas.connectors[i];
                    if (connector.config.isSelected) {
                        connectorsToDelete.push(connector);
                    } else if (this.isAssociatedConnector(selectedElementGUIDs, connector)) {
                        connectorsToDelete.push(connector);
                    }
                }
            } else {
                const selectedGUID = event.detail.selectedElementGUID[0];
                elementType = event.detail.selectedElementType;
                selectedElementGUIDs.push(selectedGUID);

                // Adds all the associated connectors to the connectorsToDelete array
                const connectorsLength = this.appState.canvas.connectors.length;
                for (let i = 0; i < connectorsLength; i++) {
                    const connector = this.appState.canvas.connectors[i];
                    if (this.isAssociatedConnector(selectedElementGUIDs, connector)) {
                        connectorsToDelete.push(connector);
                    }
                }
            }

            this.doDeleteOrInvokeAlert(selectedElementGUIDs, connectorsToDelete, elementType);
        }
    };

    /**
     * Handles the drag node stop event and dispatches  an action to update the location of the node.
     *
     * @param {object} event - node stop event coming from node.js
     */
    handleDragNodeStop = (event) => {
        if (event && event.detail) {
            const payload = {
                guid: event.detail.canvasElementGUID,
                elementType: event.detail.elementType,
                locationX: event.detail.locationX,
                locationY: event.detail.locationY
            };
            storeInstance.dispatch(updateElement(payload));
        }
    };

    /**
     * Dispatches add connection action with the new connector
     *
     * @param {object} elements - Current state of elements in the store
     * @param {string} sourceGuid - Contains the source guid
     * @param {string} targetGuid - Contains the target guid
     * @return {Function} - Creates the connector object based on the selected or remaining availableConnection value
     */
    addConnection = (elements, sourceGuid, targetGuid) => (valueFromCombobox) => {
        const connectorObject = createNewConnector(elements, sourceGuid, targetGuid, valueFromCombobox);
        storeInstance.dispatch(addConnector(connectorObject));
    };

    /**
     * Handles the add connection event and dispatches an action to either add the newly created connector or invoke a connector picker panel
     *
     * @param {object} event - add connection event coming from canvas.js
     */
    handleAddConnection = (event) => {
        if (event && event.detail) {
            const currentState = storeInstance.getCurrentState();
            const elements = currentState.elements;
            const sourceElement = elements[event.detail.sourceGuid];
            const targetElement = elements[event.detail.targetGuid];
            if (sourceElement && targetElement) {
                const sourceElementType = sourceElement.elementType;
                const targetElementLabel = targetElement.label;

                const availableConnections = sourceElement.availableConnections;
                if (!availableConnections) {
                    // Creates a regular connection. Would be needed for Start element, Assignment element, Screen element and Steps element
                    if (sourceElementType === ELEMENT_TYPE.START_ELEMENT) {
                        this.addConnection(elements, event.detail.sourceGuid, event.detail.targetGuid)(CONNECTOR_TYPE.START);
                    } else {
                        this.addConnection(elements, event.detail.sourceGuid, event.detail.targetGuid)(CONNECTOR_TYPE.REGULAR);
                    }
                } else if (availableConnections.length === 1) {
                    // Creates the only connection remaining in availableConnections
                    let remainingConnectionValue;
                    const childReference = availableConnections[0].childReference;
                    const availableConnectionType = availableConnections[0].type;
                    if (childReference) {
                        remainingConnectionValue = childReference;
                    } else {
                        remainingConnectionValue = availableConnectionType;
                    }
                    this.addConnection(elements, event.detail.sourceGuid, event.detail.targetGuid)(remainingConnectionValue);
                } else if (sourceElementType === ELEMENT_TYPE.DECISION || sourceElementType === ELEMENT_TYPE.WAIT || sourceElementType === ELEMENT_TYPE.LOOP) {
                    // Opens the connector-picker to select which connector to connect when there are multiple available connections
                    let comboboxOptions = [];
                    const availableConnectionsLength = availableConnections.length;

                    for (let i = 0; i < availableConnectionsLength; i++) {
                        const childReference = availableConnections[i].childReference;
                        const availableConnectionType = availableConnections[i].type;
                        const {label, value} = getLabelAndValueForConnectorPickerOptions(elements, sourceElement, childReference, availableConnectionType);

                        comboboxOptions.push({
                            label,
                            value
                        });
                    }

                    // Sorting the options in the right order
                    comboboxOptions = sortConnectorPickerComboboxOptions(sourceElement, comboboxOptions);

                    // Invokes the connector-picker panel
                    const mode = event.type;
                    const nodeUpdate = this.addConnection(elements, event.detail.sourceGuid, event.detail.targetGuid);
                    invokePropertyEditor(PROPERTY_EDITOR, {mode, nodeUpdate, comboboxOptions, sourceElementType, targetElementLabel});
                } else {
                    // Creates the first regular connector for all element types (such as CRUD, Action etc.)
                    // that support 2 connectors namely regular and fault
                    this.addConnection(elements, event.detail.sourceGuid, event.detail.targetGuid)(CONNECTOR_TYPE.REGULAR);
                }
            }
        }
    };

    /**
     * Translates the client side model to the format expected by the server and then invokes
     * the save flow action with the correct save type: create or update.
     * @param {string} saveType the save type (saveDraft, createNewFlow, etc) to use when saving the flow
     */
    saveFlow(saveType) {
        const flow = translateUIModelToFlow(storeInstance.getCurrentState());

        const params = {
            flow,
            saveType
        };

        fetch(SERVER_ACTION_TYPE.SAVE_FLOW, this.saveFlowCallback, params);
        this.saveStatus = LABELS.savingStatus;
        this.hasNotBeenSaved = true;
        this.disableSave = true;
    }

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection(node) {
        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = getElementForStore(node);
        storeInstance.dispatch(updateElement(nodeForStore));
    }

    deMutateAndAddNodeCollection(node) {
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = getElementForStore(node);
        storeInstance.dispatch(addElement(nodeForStore));
    }

    /**
     * Callback passed to variour property editors which support inline creation
     */
    newResourceCallback = () => {
        invokePropertyEditor(PROPERTY_EDITOR, { mode: NewResourceEvent.EVENT_NAME, nodeUpdate: this.deMutateAndAddNodeCollection});
    };

    renderedCallback() {
        if (!this.isFlowServerCallInProgress && this.showSpinner) {
            this.showSpinner = false;
            logPerfTransactionEnd(EDITOR, {
                numOfNodes: this.appState.canvas.nodes.length,
                numOfConnectors: this.appState.canvas.connectors.length
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
}