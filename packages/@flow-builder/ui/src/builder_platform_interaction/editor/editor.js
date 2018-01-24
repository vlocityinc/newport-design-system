import { Element, track } from 'engine';
import { EVENT, PROPERTY_EDITOR } from 'builder_platform_interaction-constant';
import { invokePanel, getComponentDefForNodeType } from 'builder_platform_interaction-builder-utils';
import { Store, deepCopy } from 'builder_platform_interaction-store-lib';
import { canvasSelector } from 'builder_platform_interaction-selectors';
import { updateElement } from 'builder_platform_interaction-actions';

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
     *
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
     * Handles the node clicked event and fires up the property editor based on node type
     * It uses builder-util library to fire up the ui:panel
     * @param {object} event - node clicked event coming from node.js
     */
    handleNodeClicked = (event) => {
        if (event && event.detail) {
            const override = {};
            const node = deepCopy(storeInstance.getCurrentState().elements[event.detail.nodeGUID]);
            override.body = getComponentDefForNodeType(node.type);
            override.body.attr = {
                node
            };
            const nodeUpdate = this.updateNodeCollection;
            invokePanel(PROPERTY_EDITOR, {nodeUpdate, override});
        }
    };

    /**
     * Method for talking to validation library and store for updating the node collection/flow data
     * @param {object} node - node object for the particular property editor update
     */
    updateNodeCollection(node) {
        // TODO: add validations if needed
        if (node) {
            storeInstance.dispatch(updateElement(node));
        }
    }

    /**
     * Method for talking to the store and updating the connectors for a given source and target
     */
    handleAddConnection() {
        // TODO: Update store
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