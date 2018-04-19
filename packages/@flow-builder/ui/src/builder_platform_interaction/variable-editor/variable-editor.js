import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { variableReducer } from './variable-reducer';

/**
 * Variable property editor for Flow Builder
 *
 * @ScrumTeam Process UI
 * @author Alejandro Lopez
 * @since 216
 */
export default class VariableEditor extends Element {
    /**
     * Internal state for the variable editor
     */
    @track
    variableResource;

    @api
    get node() {
        return this.variableResource;
    }

    @api
    set node(newValue) {
        // TODO: update when W-4889306 is closed
        this.variableResource = unwrap(newValue) || {};
    }

    /**
     * Public api function to return the unwrapped node
     * Called by the property editor controller on "OK"
     * @returns {object} node - unwrapped node
     */
    @api
    getNode() {
        // TODO: might have to update when W-4889306 is closed
        return unwrap(this.variableResource);
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const propertyName = event.propertyName;
        const value = event.value;
        const error = event.error;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error});
        this.variableResource = variableReducer(this.variableResource, action);
    }

    /** *********************************/
    /*       Validation methods         */
    /** *********************************/

    /**
     * public api function to run the rules from assignment validation library
     * TODO: validation W-4900878
     * @returns {object} list of errors
     */
    @api
    validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        return getErrorsFromHydratedElement(this.variableResource);
    }
}