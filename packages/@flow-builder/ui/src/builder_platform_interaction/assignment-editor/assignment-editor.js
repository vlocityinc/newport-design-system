import { Element, api, track, unwrap } from 'engine';
import { assignmentReducer } from './assignment-reducer';

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
        // TODO: Run assignment node validation rules for all fields
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

    /**
     * @param {object} event - property changed event coming from name desc component
     */
    handlePropertyChanged(event) {
        const propName = event.propertyName;
        const newValue = event.value;
        const error = event.error;
        // TODO: may be extract the action creation in actions.js, will need a bit of refactor in acitons.js
        this.node = assignmentReducer(this.node, {type: "UPDATE_PROPERTY", payload: { propName, newValue, error}});
    }
}