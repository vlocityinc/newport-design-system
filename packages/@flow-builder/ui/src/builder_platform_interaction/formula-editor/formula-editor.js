import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { formulaReducer } from './formula-reducer';

export default class FormulaEditor extends Element {
    @track
    formulaResource;

    @api
    get node() {
        return this.formulaResource;
    }

    @api
    set node(newValue) {
        // TODO: update when W-4889306 is closed
        this.formulaResource = unwrap(newValue) || {};
    }

    /**
     * Public api function to return the unwrapped node
     * Called by the property editor controller on "OK"
     * @returns {object} node - unwrapped node
     */
    @api
    getNode() {
        // TODO: might have to update when W-4889306 is closed
        return unwrap(this.formulaResource);
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
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    @api
    validate() {
        return getErrorsFromHydratedElement(this.formulaResource);
    }
}