import { Element, track, api } from 'engine';
import { invokePanel, PROPERTY_EDITOR } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector, elementPropertyEditorSelector } from 'builder_platform_interaction-selectors';
import { updateFlow, addElement, updateElement, deleteElement, addConnector, selectOnCanvas, toggleOnCanvas, deselectOnCanvas } from 'builder_platform_interaction-actions';
import { dehydrate, hydrateWithErrors, mutateEditorElement, removeEditorElementMutation } from 'builder_platform_interaction-data-mutation-lib';
import { createFlowElement } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { CONNECTOR_TYPE, createConnectorObject } from 'builder_platform_interaction-connector-utils';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { translateFlowToUIModel, translateUIModelToFlow } from "builder_platform_interaction-translator-lib";
import { reducer } from "builder_platform_interaction-reducers";
import { setRules } from "builder_platform_interaction-rule-lib";
import { setEntities } from 'builder_platform_interaction-sobject-lib';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';
import { LABELS } from './editor-labels';

let unsubscribeStore;
let storeInstance;

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @since 214
 */
export default class Editor extends Element {
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

    isFlowServerCallInProgress = false;

    @track showSpinner = false;

    @track disableSave = false;

    @track errors;

    constructor() {
        super();
        // Initialising store
        storeInstance = Store.getStore(reducer);
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        // TODO: Move these server calls after getting the Flow
        fetch(SERVER_ACTION_TYPE.GET_RULES, this.getRulesCallback);
        fetch(SERVER_ACTION_TYPE.GET_ENTITIES, this.getEntitiesCallback, { crudType: 'ALL' }, {background: true});
        fetch(SERVER_ACTION_TYPE.GET_HEADER_URLS, this.getHeaderUrlsCallBack);
    }

    @api
    get flowId() {
        return this.currentFlowId;
    }

    @api
    set flowId(newFlowId) {
        if (newFlowId) {
            this.currentFlowId = newFlowId;
            const params = {
                id: newFlowId
            };
            fetch(SERVER_ACTION_TYPE.GET_FLOW, this.getFlowCallback, params);
            this.isFlowServerCallInProgress = true;
            this.showSpinner = true;
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
        }
        this.isFlowServerCallInProgress = false;
    };

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
            window.history.pushState(null, 'Flow Builder', window.location.href.split('?')[0] + '?flowId=' + this.currentFlowId);
        } else {
            this.errors = data.errors;
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

    getEntitiesCallback = ({data, error}) => {
        if (error) {
            // TODO: handle error case
        } else {
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
        }
    };

    /**
     * Handle save event fired by a child component. Fires another event
     * containing flow information, which is handled by container.cmp.
     */
    handleSaveFlow = () => {
        const flow = translateUIModelToFlow(storeInstance.getCurrentState());
        const params = {
            flow
        };

        fetch(SERVER_ACTION_TYPE.SAVE_FLOW, this.saveFlowCallback, params);
        this.disableSave = true;
    };

    /**
     * Handle click event fired by a child component. Fires another event
     * containing resources information, which is handled by container.cmp.
     *  @param {object} event - when add resource button is clicked.
     */
    handleAddResourceClick = (event) => {
        const mode = event.type;

        const nodeUpdate = this.deMutateAndAddNodeCollection;
        invokePanel(PROPERTY_EDITOR, { mode, nodeUpdate });
    };

    /** *********** Canvas and Node Event Handling *************** **/

    /**
     * Handles the edit element event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - node double clicked event coming from node.js
     */
    handleEditElement = (event) => {
        if (event && event.detail) {
            this.handleNodeSelection(event);
            const mode = event.type;
            const node = elementPropertyEditorSelector(storeInstance.getCurrentState(), event.detail.canvasElementGUID);
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            invokePanel(PROPERTY_EDITOR, { mode, nodeUpdate, node });
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
     * @param {Array} selectedElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {Object} connector - A single connector object
     * @return {boolean} returns boolean based on if the connector is associated with any canvas element that is being deleted or not
     */
    isAssociatedConnector = (selectedElementGUIDs, connector) => {
        return (selectedElementGUIDs.indexOf(connector.target) !== -1 || selectedElementGUIDs.indexOf(connector.source) !== -1);
    };

    /**
     * Handles the multi-element delete event and dispatches an action to delete all the selected nodes and connectors.
     *
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleElementDelete = (event) => {
        if (event && event.detail) {
            const selectedElementGUIDs = [];
            const connectorsToDelete = [];
            let elementType;

            if (!event.detail.selectedElementGUID) {
                const nodesLength = this.appState.canvas.nodes.length;
                for (let i = 0; i < nodesLength; i++) {
                    // Removes all the selected nodes from jsPlumb and adds them to the selectedElementGUIDs array
                    const canvasElement = this.appState.canvas.nodes[i];

                    if (canvasElement.config.isSelected) {
                        lib.removeNodeFromLib(canvasElement.guid);
                        selectedElementGUIDs.push(canvasElement.guid);
                    }
                }

                const connectorsLength = this.appState.canvas.connectors.length;
                for (let i = 0; i < connectorsLength; i++) {
                    // Adds all the selected and associated connectors to the connectorsToDelete array
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

                lib.removeNodeFromLib(selectedGUID);
                selectedElementGUIDs.push(selectedGUID);

                const connectorsLength = this.appState.canvas.connectors.length;

                for (let i = 0; i < connectorsLength; i++) {
                    // Adds all the associated connectors to the connectorsToDelete array
                    const connector = this.appState.canvas.connectors[i];
                    if (this.isAssociatedConnector(selectedElementGUIDs, connector)) {
                        connectorsToDelete.push(connector);
                    }
                }
            }

            const payload = {
                selectedElementGUIDs,
                connectorsToDelete,
                elementType
            };
            storeInstance.dispatch(deleteElement(payload));
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
     * Method to get the connector label and value used for building combobox options
     *
     * @param {object} elements - State of elements in the store
     * @param {object} sourceElement - Source element of the connector
     * @param {string} childReference - GUID of the child reference
     * @param {string} availableConnectionType - Type of the available connection
     * @return {object} - The connector label and value
     */
    getConnectorLabelAndValue = (elements, sourceElement, childReference, availableConnectionType) => {
        let label,
            value;

        value = availableConnectionType;

        if (childReference) {
            label = elements[childReference].label;
            value = childReference;
        } else if (availableConnectionType === CONNECTOR_TYPE.DEFAULT) {
            label = sourceElement.defaultConnectorLabel;
        } else if (availableConnectionType === CONNECTOR_TYPE.FAULT) {
            label = LABELS.faultConnectorLabel;
        } else if (availableConnectionType === CONNECTOR_TYPE.LOOP_NEXT) {
            label = LABELS.loopNextComboBoxOption;
        } else if (availableConnectionType === CONNECTOR_TYPE.LOOP_END) {
            label = LABELS.loopEndComboBoxOption;
        }

        return {
            label,
            value
        };
    };

    /**
     * Dispatches add connection action with the new connector
     *
     * @param {string} source - Contains the source guid
     * @param {string} target - Contains the target guid
     * @return {Function} - Creates the connector object based on the selected or remaining availableConnection value
     */
    createAndAddConnector = (source, target) => (valueFromCombobox) => {
        const currentState = storeInstance.getCurrentState();
        const elements = currentState.elements;

        let type = valueFromCombobox,
            label,
            childSource;

        if (valueFromCombobox === CONNECTOR_TYPE.REGULAR) {
            label = null;
        } else if (valueFromCombobox === CONNECTOR_TYPE.DEFAULT) {
            label = elements[source].defaultConnectorLabel;
        } else if (valueFromCombobox === CONNECTOR_TYPE.FAULT) {
            label = LABELS.faultConnectorLabel;
        } else if (valueFromCombobox === CONNECTOR_TYPE.LOOP_NEXT) {
            label = null;
        } else if (valueFromCombobox === CONNECTOR_TYPE.LOOP_END) {
            label = LABELS.loopEndConnectorLabel;
        } else {
            type = CONNECTOR_TYPE.REGULAR;
            label = elements[valueFromCombobox].label;
            childSource = valueFromCombobox;
        }

        const connectorObject = createConnectorObject(source, childSource, target, label, type);
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
                    const connector = createConnectorObject(event.detail.sourceGuid, null, event.detail.targetGuid, null, CONNECTOR_TYPE.REGULAR);
                    storeInstance.dispatch(addConnector(connector));
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
                    this.createAndAddConnector(event.detail.sourceGuid, event.detail.targetGuid)(remainingConnectionValue);
                } else if (sourceElementType === ELEMENT_TYPE.DECISION || sourceElementType === ELEMENT_TYPE.WAIT || sourceElementType === ELEMENT_TYPE.LOOP) {
                    // Opens the connector-picker to select which connector to connect when there are multiple available connections
                    const comboboxOptions = [];
                    const availableConnectionsLength = availableConnections.length;

                    for (let i = 0; i < availableConnectionsLength; i++) {
                        const childReference = availableConnections[i].childReference;
                        const availableConnectionType = availableConnections[i].type;
                        const {label, value} = this.getConnectorLabelAndValue(elements, sourceElement, childReference, availableConnectionType);

                        comboboxOptions.push({
                            label,
                            value
                        });
                    }

                    // Invokes the connector-picker panel
                    const mode = event.type;
                    const nodeUpdate = this.createAndAddConnector(event.detail.sourceGuid, event.detail.targetGuid);
                    invokePanel(PROPERTY_EDITOR, {mode, nodeUpdate, comboboxOptions, sourceElementType, targetElementLabel});
                } else {
                    // Creates the first regular connector for all element types (such as CRUD, Action etc.)
                    // that support 2 connectors namely regular and fault
                    this.createAndAddConnector(event.detail.sourceGuid, event.detail.targetGuid)(CONNECTOR_TYPE.REGULAR);
                }
            }
        }
    };

    /**
     * Handles the add element event which is fired after an element from left palette is dropped
     * on the canvas or via a click to add interaction.
     *
     * @param {Object} event canvas element drop event
     */
    handleAddElement = (event) => {
        const mode = event.type;

        let node = createFlowElement(event.detail.elementType);
        node.locationX = event.detail.locationX;
        node.locationY = event.detail.locationY;

        node = mutateEditorElement(node, storeInstance.getCurrentState());
        node = hydrateWithErrors(node);

        const nodeUpdate = this.deMutateAndAddNodeCollection;
        invokePanel(PROPERTY_EDITOR, { mode, node, nodeUpdate });
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     *
     * @param {object} node - node object for the particular property editor update
     */
    deMutateAndUpdateNodeCollection(node) {
        // TODO: add validations if needed
        // This deepCopy is needed as a temporary workaround because the unwrap() function that the property editor
        // calls on OK doesn't actually work and keeps the proxy wrappers.
        const nodeForStore = removeEditorElementMutation(dehydrate(deepCopy(node)), storeInstance.getCurrentState());

        storeInstance.dispatch(updateElement(nodeForStore));
    }

    deMutateAndAddNodeCollection(node) {
        // TODO: add validations if needed
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = removeEditorElementMutation(dehydrate(deepCopy(node)), storeInstance.getCurrentState());
        storeInstance.dispatch(addElement(nodeForStore));
    }

    renderedCallback() {
        if (!this.isFlowServerCallInProgress && this.showSpinner) {
            this.showSpinner = false;
        }
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}