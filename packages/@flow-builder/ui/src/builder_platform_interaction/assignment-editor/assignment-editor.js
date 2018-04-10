import { Element, api, track, unwrap } from 'engine';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { assignmentReducer } from './assignment-reducer';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
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

    get addLabel() {
        // TODO labels W-4813532
        return 'Add';
    }

    get elementType() {
        return ELEMENT_TYPE.ASSIGNMENT;
    }

    get showDelete() {
        return this.assignmentItems.length > 1;
    }

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
        return this.node && this.node.assignmentItems ? this.node.assignmentItems : [];
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
        const action = createAction(PROPERTY_EDITOR_ACTION.ADD_ASSIGNMENT_ITEM, {index: event.detail.index});
        this.storeDispatch(action);
    }

    /**
     * @param {object} event - DeleteListItemEvent to delete an item at the given index
     */
    handleDeleteListItem(event) {
        event.stopPropagation();
        const action = createAction(PROPERTY_EDITOR_ACTION.DELETE_ASSIGNMENT_ITEM, updateProperties({}, event.detail));
        this.storeDispatch(action);
    }

    /**
     * @param {object} event - UpdatListItemEvent to update a property value in the list item at the given index
     */
    handleUpdateListItem(event) {
        event.stopPropagation();
        // TODO: convert devName(s) in value to guid
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ASSIGNMENT_ITEM, updateProperties({}, event.detail));
        if (event.detail.index < this.assignmentItems.length) {
            this.storeDispatch(action);
        }
    }

    /**
     * @param {object} action - mimic redux in action handling/dispatching
     *                          could swap this out with a real store in the future if desired
     */
    storeDispatch(action) {
        this.assignmentNode = assignmentReducer(this.assignmentNode, action);
    }
}
