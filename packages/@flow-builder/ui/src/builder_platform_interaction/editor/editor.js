import { Element, track, api } from 'engine';
import { CRUD, invokePanel, PROPERTY_EDITOR } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector, elementPropertyEditorSelector } from 'builder_platform_interaction-selectors';
import { updateFlow, addElement, updateElement, deleteElement, addConnector, selectOnCanvas, toggleOnCanvas, deselectOnCanvas } from 'builder_platform_interaction-actions';
import { dehydrate, hydrateWithErrors, mutateEditorElement, removeEditorElementMutation } from 'builder_platform_interaction-data-mutation-lib';
import { createFlowElement } from 'builder_platform_interaction-element-config';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { createConnectorObject } from 'builder_platform_interaction-connector-utils';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { translateFlowToUIModel, translateUIModelToFlow } from "builder_platform_interaction-translator-lib";
import { reducer } from "builder_platform_interaction-reducers";
import { setRules } from "builder_platform_interaction-rule-lib";
import { setEntities } from 'builder_platform_interaction-sobject-lib';
import { drawingLibInstance as lib } from 'builder_platform_interaction-drawing-lib';

import spinnerAlternativeText from '@label/FlowBuilderEditor.spinnerAlternativeText';

let unsubscribeStore;
let storeInstance;

const LABELS = {
    SPINNER_ALTERNATIVE_TEXT: spinnerAlternativeText
};

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

    get labels() {
        return LABELS;
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
        } else if (data !== 'fail') {
            // TODO: handle saving a flow case
            // Updating URL
            // Hack: fix it once we payload onsave is defined properly
            this.currentFlowId = data;
            window.history.pushState(null, 'Flow Builder', window.location.href.split('?')[0] + '?flowId=' + data);
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
     * @typedef {Object} GuidCollections
     * @property {String[]} connectorGUIDs - Array of guids for connectors
     * @property {String[]} canvasElementGUIDs - Array of guids for elements
     */

    /**
     * Helper method to return the canvas elements and connectors which are linked to a given set of elements and
     * connectors.  It will return all elements which are the source of a connector for one of the elements passed it
     * as well as all connectors passed in in addition to any connector which has either source or target of one of the
     * elements passed in.
     *
     * @param {String[]} selectedCanvasElementGUIDs - Contains GUIDs of all the selected canvas elements
     * @param {String[]} selectedConnectorGUIDs - Contains GUIDs of all the connectors that need to be deleted
     * @returns {GuidCollections} - Contains arrays of canvas element and connector guids which are related to the
     * the supplied canvas elements and connectors
     */
    getElementsAndConnectorsToUpdate = (selectedCanvasElementGUIDs, selectedConnectorGUIDs) => {
        const connectorGuidsToUpdate = new Set(selectedConnectorGUIDs);
        const canvasElementsToUpdate = [];

        for (let i = 0; i < this.appState.canvas.connectors.length; i++) {
            const connector = this.appState.canvas.connectors[i];

            if (selectedCanvasElementGUIDs.indexOf(connector.target) !== -1) {
                canvasElementsToUpdate.push(connector.source);
                connectorGuidsToUpdate.add(connector.guid);
            } else if (selectedCanvasElementGUIDs.indexOf(connector.source) !== -1) {
                connectorGuidsToUpdate.add(connector.guid);
            }
        }

        return {
            connectorGUIDs: [...connectorGuidsToUpdate],
            canvasElementGUIDs: canvasElementsToUpdate
        };
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
        if (event) {
            const mode = CRUD.CREATE;
            invokePanel(PROPERTY_EDITOR, {mode, modalType: 'RESOURCE', modalTitle: 'New Resource'});
        }
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
     * Handles the multi-element delete event and dispatches an action to delete all the selected nodes and connectors.
     *
     * @param {object} event - multi delete event coming from canvas.js.  If it contains the selectedCanvasElementGUIDs
     * attribute, then those guids will be used as the basis for the delete.  Otherwise, all canvas nodes will be
     * checked for isSelected and if true then they will be included in the list to delete
     */
    handleDeleteOnCanvas = (event) => {
        if (event && event.detail) {
            const elementsToDelete = [];
            const elementGuidsToDelete = [];

            const selectedElementGuids = event.detail.selectedCanvasElementGUIDs;
            const selectedConnectorGuids = [];

            // Guids were passed in
            if (selectedElementGuids) {
                const currentState = storeInstance.getCurrentState();

                for (let i = 0; i < selectedElementGuids.length; i++) {
                    const element = currentState.elements[selectedElementGuids[i]];
                    elementsToDelete.push(element);
                }
            } else {
                // Need to get element and connector guids based on canvas selections
                for (let i = 0; i < this.appState.canvas.nodes.length; i++) {
                    const node = this.appState.canvas.nodes[i];

                    // Cleaning up jsplumb nodes to keep it in sync with the store
                    // TODO: @ankush - add story number to refactor
                    if (node.config.isSelected) {
                        elementsToDelete.push(node);
                        lib.removeNodeFromLib(node.guid);
                    }
                }

                for (let i = 0; i < this.appState.canvas.connectors.length; i++) {
                    const connector = this.appState.canvas.connectors[i];

                    if (connector.config.isSelected) {
                        selectedConnectorGuids.push(connector.guid);
                    }
                }
            }

            // Collect the guids for all elements to delete and their subelements
            for (let i = 0; i < elementsToDelete.length; i++) {
                const element = elementsToDelete[i];

                elementGuidsToDelete.push(element.guid);
            }

            const {connectorGUIDs, canvasElementGUIDs} =
                this.getElementsAndConnectorsToUpdate(elementGuidsToDelete, selectedConnectorGuids);

            const payload = {
                selectedCanvasElementGUIDs: elementGuidsToDelete,
                connectorGUIDs,
                canvasElementsToUpdate: canvasElementGUIDs,
                // TODO: Update in second iteration
                elementType: ELEMENT_TYPE.ASSIGNMENT
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
     * Handles the add connection event and dispatches an action to add the newly created connector.
     *
     * @param {object} event - add connection event coming from canvas.js
     */
    handleAddConnection = (event) => {
        if (event && event.detail) {
            const connector = createConnectorObject(
                event.detail.source,
                event.detail.childSource,
                event.detail.target,
                event.detail.label,
                event.detail.type
            );
            storeInstance.dispatch(addConnector(connector));
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