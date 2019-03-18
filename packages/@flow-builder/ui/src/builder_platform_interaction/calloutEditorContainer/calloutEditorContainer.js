import { LightningElement, api, track } from 'lwc';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import invocableActionTemplate from "./invocableActionTemplate.html";
import apexPluginTemplate from "./apexPluginTemplate.html";
import subflowTemplate from "./subflowTemplate.html";
import noActionTemplate from "./noActionTemplate.html";
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { LABELS } from "./calloutEditorLabels";

const EDITOR_SELECTOR = '.editor_template';

export default class CalloutEditorContainer extends LightningElement {
    labels = LABELS;

    @track
    state = {
        noActionBodyRegular: '',
        noActionHeadingMedium: '',
    };

    /**
     * The currently selected action
     * @type {Object}
     */
    _selectedAction = null;

    _filterBy = '';
    _invocableActionsFetched = false;

    /**
     * The node that represents initial state of the currently selected editor
     * @type {Object}
     */
    @track
    node = {};

    _hasActions = false;

    @api
    get hasActions() {
        return this._hasActions;
    }

    set hasActions(newValue) {
        this._hasActions = newValue.value;
        this.updateLabels();
    }

    @api
    get location() {
        return { locationX: this.node.locationX, locationY: this.node.locationY };
    }

    set location(newValue) {
        const _location = newValue || {};
        this.node.locationX = _location.locationX;
        this.node.locationY = _location.locationY;
    }

    @api
    get filterBy() {
        return this._filterBy;
    }

    set filterBy(value) {
        this._filterBy = value;
    }

    @api
    get invocableActionsFetched() {
        return this._invocableActionsFetched;
    }

    set invocableActionsFetched(value) {
        this._invocableActionsFetched = value;
    }
    /**
     * Sets the selected action
     * This will create a flow element of the corresponding element type
     * @param {SelectedInvocableAction|SelectedApexPlugin|SelectedSubflow} selectedActionType the selected action type from action-selector component
     */
    set selectedAction(selectedActionType) {
        if (!selectedActionType) {
            return;
        }

        this._selectedAction = selectedActionType;

        // go through the needed steps to create a flow element and get it ready to be used by property editor
        const elementType = this._selectedAction.elementType;
        let node = getElementForPropertyEditor({ elementType });
        // assign values from _selectedAction to node
        node = Object.assign({}, node, { locationX: this.node.locationX, locationY: this.node.locationY }, this._selectedAction);
        const editorNode = this.getNode();
        if (editorNode) {
            node.name = editorNode.name;
            node.label = editorNode.label;
            node.description = editorNode.description;
        }
        // set this to our member variable so that we can pass to the selected property editor template
        this.node = node;
    }

    isInitialState() {
        const elementType = this.node.elementType;
        switch (elementType) {
            case ELEMENT_TYPE.EXTERNAL_SERVICE:
            case ELEMENT_TYPE.ACTION_CALL:
            case ELEMENT_TYPE.EMAIL_ALERT:
            case ELEMENT_TYPE.APEX_CALL:
                return !this._selectedAction.actionName && !this._selectedAction.actionType;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                return !this._selectedAction.apexClass;
            case ELEMENT_TYPE.SUBFLOW:
                return !this._selectedAction.flowName;
            default:
                return true;
        }
    }

    @api
    get selectedAction() {
        return this._selectedAction;
    }

    /**
     * Gets the inner node (the editor of the chosen action)
     * @returns {Object} the node of the chosen action
     */
    @api
    getNode() {
        const editor = this.template.querySelector(EDITOR_SELECTOR);
        if (editor) {
            return this.template.querySelector(EDITOR_SELECTOR).getNode();
        }
        return undefined;
    }

    /**
     * Calls validate method on the inner node (the editor of the chosen action)
     * @returns {Array} the array of errors from validation call
     */
    @api
    validate() {
        const editor = this.template.querySelector(EDITOR_SELECTOR);
        if (editor) {
            return this.template.querySelector(EDITOR_SELECTOR).validate();
        }
        return undefined;
    }

    render() {
        const elementType = this.node.elementType;
        if (!this._hasActions) {
            return noActionTemplate;
        }
        if (this.isInitialState()) {
            return noActionTemplate;
        }
        switch (elementType) {
            case ELEMENT_TYPE.EXTERNAL_SERVICE:
            case ELEMENT_TYPE.ACTION_CALL:
            case ELEMENT_TYPE.EMAIL_ALERT:
            case ELEMENT_TYPE.APEX_CALL:
                return invocableActionTemplate;
            case ELEMENT_TYPE.APEX_PLUGIN_CALL:
                return apexPluginTemplate;
            case ELEMENT_TYPE.SUBFLOW:
                return subflowTemplate;
            default:
                return noActionTemplate;
        }
    }

    @api
    get noActionHeadingMedium() {
        return this.state.noActionHeadingMedium;
    }

    @api
    get noActionBodyRegular() {
        return this.state.noActionBodyRegular;
    }

    updateLabels() {
        const elementType = (this.node && this.node.elementType) ? this.node.elementType : null;
        if (elementType == null) {
            this.state.noActionHeadingMedium = '';
            this.state.noActionBodyRegular = '';
        }

        if (this._invocableActionsFetched) {
            if (this._filterBy === this.labels.filterByCategoryOption) {
                this.state.noActionHeadingMedium = this.labels.selectActionHeadingMedium;
                this.state.noActionBodyRegular = this.labels.selectActionBodyRegular;
            } else {
                this.state.noActionHeadingMedium = this.labels[elementType].HEAD[this._hasActions];
                this.state.noActionBodyRegular = this.labels[elementType].BODY[this._hasActions];
            }
        } else {
            this.state.noActionHeadingMedium = this.labels.actionsLoading;
        }
    }
}