import { Element, api, track, unwrap } from 'engine';
import { assignmentReducer } from './assignment-reducer';
import { createAction } from 'builder_platform_interaction-actions';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-constant';
import { getErrorsFromHydratedElement, updateProperties } from 'builder_platform_interaction-data-mutation-lib';

/**
 * @constant UPDATE_PROPERTY
 * @type {string}
 */

export default class AssignmentEditor extends Element {
    /**
     * Internal state for the assignment editor
     */
    @track assignmentNode = {};

    @api
    get node() {
        return this.assignmentNode;
    }

    @api
    set node(newValue) {
        this.assignmentNode = newValue || {};
    }

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.node);
    }

    /**
     * public api function to run the rules from assignment validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a filed without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        return getErrorsFromHydratedElement(this.node);
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

    get assignmentItems() {
        return (this.node) ? this.node.assignmentItems : [];
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
        this.assignmentNode = assignmentReducer(this.node, action);
    }

    /**
     * @param {object} event - AddListItemEvent to add an item at the end of the list
     */
    handleAddListItem(event) {
        event.stopPropagation();
        // TODO : we add at the end, change if we need to add at an index
        // TODO this should come from some assignment item factory like propertyEditorDataMutation that is shared with the translation layer
        const emptyListItem = {assignToReference: {value:'', error:null}, assignmentOperatorType: {value: '', error:null},  value: {value:'', error:null}};
        const action = createAction(PROPERTY_EDITOR_ACTION.ADD_LIST_ITEM, {item: emptyListItem, index: event.detail.index});
        this.assignmentNode.assignmentItems = assignmentReducer(this.assignmentItems, action);
    }

    /**
     * @param {object} event - DeleteListItemEvent to delete an item at the given index
     */
    handleDeleteListItem(event) {
        event.stopPropagation();
        const action = createAction(PROPERTY_EDITOR_ACTION.DELETE_LIST_ITEM, updateProperties({}, event.detail));
        this.assignmentNode.assignmentItems = assignmentReducer(this.assignmentItems, action);
    }

    /**
     * @param {object} event - UpdatListItemEvent to update a property value in the list item at the given index
     */
    handleUpdateListItem(event) {
        event.stopPropagation();
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_LIST_ITEM, updateProperties({}, event.detail));
        if (event.detail.index < this.assignmentItems.length) {
            this.assignmentNode.assignmentItems = assignmentReducer(this.assignmentItems, action);
        }
    }
}