import { Element, track } from 'engine';
import { EVENT, PROPERTY_EDITOR } from 'builder_platform_interaction-constant';
import { invokePanel, getComponentDefForNodeType } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector } from 'builder_platform_interaction-selectors';
import { updateElement } from 'builder_platform_interaction-actions';
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
        canvas: [],
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
     * Handles the drag node stop event and updates the location of the node.
     * @param {object} event - node stop event coming from node.js
     */
    handleDragNodeStop = (event) => {
        if (event && event.detail) {
            this.appState.canvas.nodes = this.appState.canvas.nodes.map((element) => {
                if (element.guid === event.detail.nodeGUID) {
                    element.locationX = event.detail.locationX;
                    element.locationY = event.detail.locationY;
                }
                return element;
            });
        }
    };

    /**
     * Handles the node double clicked event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel.
     * @param {object} event - node double clicked event coming from node.js
     */
    handleNodeDblClicked = (event) => {
        if (event && event.detail) {
            const override = {};
            const node = deepCopy(storeInstance.getCurrentState().elements[event.detail.nodeGUID]);
            const nodeWithErrorObjects = hydrateWithErrors(node);
            override.body = getComponentDefForNodeType(node.type);
            override.body.attr = {
                node: nodeWithErrorObjects
            };
            const nodeUpdate = this.updateNodeCollection;
            invokePanel(PROPERTY_EDITOR, {nodeUpdate, override});
        }
    };

    /**
     * Handles the node clicked event and marks the node as selected or unselected based on whether the
     * user is trying to multi-select or not. Also hand;es clicks on canvas to deselect all currently
     * selected nodes.
     * @param {object} event - node clicked event coming from node.js and canvas.js
     */
    handleNodeSelection = (event) => {
        this.appState.canvas.nodes = this.appState.canvas.nodes.map((node) => {
            if (node.guid === event.detail.nodeGUID) {
                if (event.detail.isMultiSelect) {
                    node.isSelected = !node.isSelected;
                } else {
                    node.isSelected = true;
                }
            } else if (!event.detail.isMultiSelect) {
                node.isSelected = false;
            }
            return node;
        });
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data.
     * @param {object} node - node object for the particular property editor update
     */
    updateNodeCollection(node) {
        // TODO: add validations if needed
        const dehydratedNode = dehydrate(node);
        if (dehydratedNode) {
            storeInstance.dispatch(updateElement(dehydratedNode));
        }
    }

    /**
     * Method for talking to the store and updating the connectors for a given source and target.
     * @param {object} event - add connection event coming from canvas.js
     */
    handleAddConnection(event) {
        // TODO: Update once the store is fixed
        this.appState.canvas.connectors = [...this.appState.canvas.connectors, ({source: event.detail.source, target: event.detail.target, label: event.detail.label})];
    }

    /**
     * Method to map appstate to store. This method get called when store changes.
     */
    mapAppStateToStore = () => {
        const currentState = storeInstance.getCurrentState();
        this.appState.canvas = canvasSelector(currentState);
    };

    disconnectedCallback() {
        unsubscribeStore();
    }
}