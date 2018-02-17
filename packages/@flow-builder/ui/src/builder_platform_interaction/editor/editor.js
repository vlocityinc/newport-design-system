import { Element, track } from 'engine';
import { EVENT, PROPERTY_EDITOR } from 'builder_platform_interaction-constant';
import { invokePanel, getConfigForElementType } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector, resourcesSelector } from 'builder_platform_interaction-selectors';
import { updateElement, deleteElement } from 'builder_platform_interaction-actions';
import { hydrateWithErrors, dehydrate } from 'builder_platform_interaction-data-mutation-lib';

let unsubscribeStore;
let storeInstance;

/**
 * Editor component for flow builder. This is the top-level smart component for
 * flow builder. It is responsible for maintaining the overall state of app and
 * handle event from various child components.
 *
 * @ScrumTeam Process UI
 * @author Ankush Bansal
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

    /**
     * Handles the canvas mouse up event and deselects all selected nodes and connectors.
     */
    handleCanvasMouseUp = () => {
        this.appState.canvas.nodes = this.appState.canvas.nodes.map((node) => {
            node.config.isSelected = false;
            return node;
        });

        this.appState.canvas.connectors = this.appState.canvas.connectors.map((connector) => {
            connector.config.isSelected = false;
            return connector;
        });
    };

    /**
     * Handles the node double clicked event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     * @param {object} event - node double clicked event coming from node.js
     */
    handleNodeDblClicked = (event) => {
        if (event && event.detail) {
            this.handleNodeSelection(event);
            const override = {};
            const node = deepCopy(storeInstance.getCurrentState().elements[event.detail.nodeGUID]);
            override.body = {descriptor: getConfigForElementType(node.elementType, 'descriptor')};
            const nodeWithErrorObjects = hydrateWithErrors(node);
            override.body.attr = {
                node: nodeWithErrorObjects
            };
            const nodeUpdate = this.updateNodeCollection;
            invokePanel(PROPERTY_EDITOR, {nodeUpdate, override});
        }
    };

    /**
     * Handles the node clicked event and marks the node as selected or unselected based on whether the
     * user is trying to multi-select or not. Also deselects all the selected connectors if multi-select is off.
     * @param {object} event - node clicked event coming from node.js
     */
    handleNodeSelection = (event) => {
        this.appState.canvas.nodes = this.appState.canvas.nodes.map((node) => {
            if (node.guid === event.detail.nodeGUID) {
                if (event.detail.isMultiSelectKeyPressed) {
                    node.config.isSelected = !node.config.isSelected;
                } else {
                    node.config.isSelected = true;
                }
            } else if (!event.detail.isMultiSelectKeyPressed) {
                node.config.isSelected = false;
            }
            return node;
        });

        // TODO: Support multi-selection of nodes and connectors once store is fixed.
        this.appState.canvas.connectors = this.appState.canvas.connectors.map((connector) => {
            connector.config.isSelected = false;
            return connector;
        });
    };

    /**
     * Handles the drag node stop event and updates the location of the node.
     * @param {object} event - node stop event coming from node.js
     */
    handleDragNodeStop = (event) => {
        if (event && event.detail) {
            const updatedNode = this.appState.canvas.nodes.filter(node => (node.guid === event.detail.nodeGUID));
            updatedNode[0].locationX = event.detail.locationX;
            updatedNode[0].locationY = event.detail.locationY;
            this.updateNodeCollection(updatedNode[0], false);
        }
    };

    /**
     * Handles the node delete event and updates the store accordingly.
     * TODO: Need to update it to delete associated connectors as well
     * @param {object} event - node delete event coming from node.js
     */
    handleNodeDelete(event) {
        this.appState.canvas.nodes = this.appState.canvas.nodes.map((node) => {
            if (node.config.isSelected && (event.detail.nodeGUID === undefined || node.guid === event.detail.nodeGUID)) {
                storeInstance.dispatch(deleteElement(node));
            }
            return node;
        });
    }

    /**
     * Method for talking to the store and updating the connectors for a given source and target.
     * @param {object} event - add connection event coming from canvas.js
     */
    handleAddConnection(event) {
        // TODO: Update once the store is fixed. This will also fix selection/deselection for new connectors.
        this.appState.canvas.connectors = [...this.appState.canvas.connectors, ({source: event.detail.source,
            target: event.detail.target, label: event.detail.label, config: {isSelected: false}, jsPlumbConnector: {}})];
    }

    /**
     * Handles the connector clicked event and marks the connector as selected or unselected based on whether the
     * user is trying to multi-select or not. Also deselects all the selected nodes if multi-select is off.
     * @param {object} event - connection clicked event coming from canvas.js
     */
    handleConnectorSelection(event) {
        this.appState.canvas.connectors = this.appState.canvas.connectors.map((connector) => {
            if (connector.source === event.detail.source && connector.target === event.detail.target) {
                connector.jsPlumbConnector = event.detail.connection;
                if (event.detail.isMultiSelectKeyPressed) {
                    connector.config.isSelected = !connector.config.isSelected;
                } else {
                    connector.config.isSelected = true;
                }
            } else if (!event.detail.isMultiSelectKeyPressed) {
                connector.config.isSelected = false;
            }
            return connector;
        });

        // TODO: Support multi-selection of nodes and connectors once store is fixed.
        this.appState.canvas.nodes = this.appState.canvas.nodes.map((node) => {
            node.config.isSelected = false;
            return node;
        });
    }

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     * @param {boolean} needsDehydration - if dehydration is needed for the updated node
     */
    updateNodeCollection(node, needsDehydration = true) {
        // TODO: add validations if needed
        const nodeForStore = needsDehydration ? dehydrate(node) : node;
        storeInstance.dispatch(updateElement(nodeForStore));
    }

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.appState.canvas = canvasSelector(currentState);
        this.appState.resources = resourcesSelector(currentState);
    };

    disconnectedCallback() {
        unsubscribeStore();
    }
}