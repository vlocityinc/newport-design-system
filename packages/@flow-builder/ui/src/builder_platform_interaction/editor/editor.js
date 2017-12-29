import { Element, unwrap } from 'engine';
import {EVENT, PROPERTY_EDITOR} from 'builder_platform_interaction-constant';
import {invokePanel, getComponentDefForNodeType} from 'builder_platform_interaction-builder-utils';


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
    @api flow;

    @track
    appState = {
        flow: {}
    };

    @api
    get flow() {
        return this.appState.flow;
    }

    @api
    set flow(newValue = {}) {
        this.appState.flow = newValue;
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
                detail: unwrap(this.appState.flow),
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
    handleNodeClicked(event) {
        if (event && event.detail) {
            const override = {};
            override.body = getComponentDefForNodeType(event.detail.node.type);
            override.body.attr = {
                node : event.detail.node
            };
            const nodeUpdate = this.updateNodeCollection;
            invokePanel(PROPERTY_EDITOR, {nodeUpdate, override});
        }
    }

    /**
     * Method for talking to validation library and store for updating the node collection/flow data
     * @param {object} node - node object for the particular property editor update
     * TODO: Add the node param to the function when we use it else it is a eslint warning
     */
    updateNodeCollection() {
        // call validations & talk to store for updating state
        // console.log("UpdateNode Collection with node name", node.label);
    }
}