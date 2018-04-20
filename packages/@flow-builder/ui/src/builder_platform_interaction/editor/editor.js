import { Element, track, api } from 'engine';
import { PROPERTY_EDITOR } from 'builder_platform_interaction-constant';
import { CRUD, invokePanel } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector, elementPropertyEditorSelector } from 'builder_platform_interaction-selectors';
import { updateFlow, addElement, updateElement, deleteElement, addConnector, selectOnCanvas, toggleOnCanvas, deselectOnCanvas } from 'builder_platform_interaction-actions';
import { dehydrate, hydrateWithErrors, mutateEditorElement, removeEditorElementMutation } from 'builder_platform_interaction-data-mutation-lib';
import { createFlowElement, ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { createConnectorObject } from 'builder_platform_interaction-connector-utils';
import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { translateFlowToUIModel, translateUIModelToFlow } from "builder_platform_interaction-translator-lib";
import { reducer } from "builder_platform_interaction-reducers";
import { setRules } from "builder_platform_interaction-rule-lib";

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

    constructor() {
        super();
        // Initialising store
        storeInstance = Store.getStore(reducer);
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
        fetch(SERVER_ACTION_TYPE.GET_RULES, this.getRulesCallback);
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
        }
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
            const mode = CRUD.UPDATE;
            const node = elementPropertyEditorSelector(storeInstance.getCurrentState(), event.detail.canvasElementGUID);
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            invokePanel(PROPERTY_EDITOR, { mode, nodeUpdate, node, modalType: 'CANVAS', modalTitle: node.elementType });
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
     * @param {object} event - multi delete event coming from canvas.js
     */
    handleDeleteOnCanvas = (event) => {
        if (event && event.detail) {
            const payload = {
                selectedCanvasElementGUIDs: event.detail.selectedCanvasElementGUIDs,
                connectorGUIDs: event.detail.connectorGUIDs,
                canvasElementsToUpdate: event.detail.canvasElementsToUpdate,
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
        const mode = CRUD.CREATE;

        let node = createFlowElement(event.detail.elementType);
        node.locationX = event.detail.locationX;
        node.locationY = event.detail.locationY;

        node = mutateEditorElement(node, storeInstance.getCurrentState());
        node = hydrateWithErrors(node);

        const nodeUpdate = this.deMutateAndAddNodeCollection;
        invokePanel(PROPERTY_EDITOR, { mode, node, nodeUpdate, modalType: 'CANVAS', modalTitle: node.elementType });
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

    disconnectedCallback() {
        unsubscribeStore();
    }
}