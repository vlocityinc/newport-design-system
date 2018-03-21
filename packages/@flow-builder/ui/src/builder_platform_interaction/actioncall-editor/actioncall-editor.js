import { Element, api, track, unwrap } from 'engine';
import { actionCallReducer } from './actioncall-reducer';
import inputs from '@label/DesignerLabels.actioncall_inputs_label';
import outputs from '@label/DesignerLabels.actioncall_outputs_label';
import { createAction } from 'builder_platform_interaction-actions';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-constant';
import { getInvocableActionParameters } from 'builder_platform_interaction-actioncall-lib';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */
const UPDATE_PROPERTY = 'UPDATE_PROPERTY';

const ACTIVETABID_DEFAULT = "tabitem-inputs";

export default class ActionCallEditor extends Element {
    /**
     * Internal state for the editor
     */
    @track actionCallNode = {};
    @track activetabid = ACTIVETABID_DEFAULT;

    labels = {
        inputs,
        outputs
    };

    static UPDATE_PROPERTY = UPDATE_PROPERTY;

    @api
    get node() {
        return this.actionCallNode;
    }

    @api
    set node(newValue) {
        this.actionCallNode = newValue || {};
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.node);
    }

    /**
     * public api function to run the rules from actionCall validation library
     * @returns {object} list of errors
     */
    @api validate() {
        return [];
    }

    /**
     * @returns {object} label, eg : {value: "xyz", error: null}
     */
    get label() {
        return (this.node && this.node.label) ? this.node.label : undefined;
    }

    /**
     * @returns {object} description
     */
    get description() {
        return (this.node && this.node.description) ? this.node.description : undefined;
    }

    /**
     * @returns {object} devName
     */
    get devName() {
        return (this.node && this.node.name) ? this.node.name : undefined;
    }

    get elementType() {
        return (this.node && this.node.elementType) ? this.node.elementType : undefined;
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const propertyName = event.propertyName;
        const value = event.value;
        const error = event.error;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error});
        this.actionCallNode = actionCallReducer(this.node, action);
    }

    @api
    get activeTabId() {
        return this.activetabid;
    }

    handleTabChanged(event) {
        this.activetabid = event.detail.tabId;
    }

    handleActionSelected(event) {
        getInvocableActionParameters(event.value.actionType, event.value.actionName, () => {
            // display the parameters
        });
    }
}