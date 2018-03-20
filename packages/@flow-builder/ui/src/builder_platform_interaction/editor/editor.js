import { Element, track } from 'engine';
import { CRUD, EVENT, ELEMENT_TYPE, PROPERTY_EDITOR } from 'builder_platform_interaction-constant';
import { invokePanel } from 'builder_platform_interaction-builder-utils';
import { Store, generateGuid, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector, resourcesSelector, elementPropertyEditorSelector } from 'builder_platform_interaction-selectors';
import { addElement, updateElement, deleteElement, addConnector, selectOnCanvas, toggleOnCanvas, deselectOnCanvas } from 'builder_platform_interaction-actions';
import { dehydrate, hydrateWithErrors, mutateEditorElement, removeEditorElementMutation } from 'builder_platform_interaction-data-mutation-lib';
import { createFlowElement } from 'builder_platform_interaction-element-config';

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
    @track
    appState = {
        canvas: {
            nodes: [],
            connectors: []
        },
        resources: []
    };

    constructor() {
        super();
        storeInstance = Store.getStore();
        unsubscribeStore = storeInstance.subscribe(this.mapAppStateToStore);
    }

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();

        const nodes = canvasSelector(currentState);
        const connectors = currentState.connectors;
        const resources = resourcesSelector(currentState);

        this.appState = {
            canvas : {
                nodes,
                connectors
            },
            resources
        };
    };

    /**
     * Handle save event fired by a child component. Fires another event
     * containing flow information, which is handled by container.cmp.
     */
    handleSaveFlow = () => {
        const saveEvent = new CustomEvent(
            EVENT.SAVE_FLOW,
            {
                bubbles: true,
                composed: true
            }
        );
        this.dispatchEvent(saveEvent);
    };

    /** *********** Canvas and Node Event Handling *************** **/

    /**
     * Handles the node double clicked event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     *
     * @param {object} event - node double clicked event coming from node.js
     */
    handleNodeDblClicked = (event) => {
        if (event && event.detail) {
            this.handleNodeSelection(event);
            const mode = CRUD.UPDATE;
            const node = elementPropertyEditorSelector(storeInstance.getCurrentState(), event.detail.canvasElementGUID);
            const nodeUpdate = this.deMutateAndUpdateNodeCollection;
            invokePanel(PROPERTY_EDITOR, {mode, nodeUpdate, node});
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
            const connectorGuid = generateGuid('CONNECTOR');
            const payload = {
                guid: connectorGuid,
                source: event.detail.source,
                target: event.detail.target,
                label: event.detail.label,
                config: {isSelected: false}
            };
            storeInstance.dispatch(addConnector(payload));
        }
    };

    /**
     * Handles the canvas element drop event which is fired after an element from left palette is
     * dropped on the canvas.
     *
     * @param {Object} event canvas element drop event
     */
    handleCanvasElementDrop = (event) => {
        const mode = CRUD.CREATE;

        let node = createFlowElement(event.detail.elementType);
        node.locationX = event.detail.locationX;
        node.locationY = event.detail.locationY;

        node = mutateEditorElement(node);
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
        const nodeForStore = removeEditorElementMutation(dehydrate(deepCopy(node)));
        storeInstance.dispatch(updateElement(nodeForStore));
    }

    deMutateAndAddNodeCollection(node) {
        // TODO: add validations if needed
        // TODO: This looks almost exactly like deMutateAndUpdateNodeCollection. Maybe we should
        // pass the node collection modification mode (CREATE, UPDATE, etc) and switch the store
        // action based on that.
        const nodeForStore = removeEditorElementMutation(dehydrate(deepCopy(node)));
        storeInstance.dispatch(addElement(nodeForStore));
    }

    disconnectedCallback() {
        unsubscribeStore();
    }
}