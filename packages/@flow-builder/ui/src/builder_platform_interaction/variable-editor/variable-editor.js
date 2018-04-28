import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { variableReducer } from './variable-reducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

// the property names in a variable element (after mutation)
const VARIABLE_FIELDS = {
    DATA_TYPE: 'dataType',
    DESCRIPTION: 'description',
    IS_COLLECTION: 'isCollection',
    IS_INPUT: 'isInput',
    IS_OUTPUT: 'isOutput',
    NAME: 'name',
    OBJECT_TYPE: 'objectType',
    SCALE: 'scale',
    DEFAULT_VALUE: 'defaultValue',
};

const flowDataTypeMenuItems = Object.values(FLOW_DATA_TYPE);

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
        this.variableResource = unwrap(newValue);
    }

    // used to keep track of whether this is an existing variable resource
    @api
    isNewMode = false;

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

    get dataType() {
        return this.variableResource.dataType.value;
    }

    get isDataTypeDisabled() {
        return !this.isNewMode;
    }

    get dataTypeList() {
        return flowDataTypeMenuItems;
    }

    get dataTypeHelpText() {
        // TODO: use labels
        return !this.isNewMode ? 'Data type cannot be changed while this resource is being referenced in your flow' : null;
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

    handleDataTypeSelect(event) {
        event.stopPropagation();
        const propertyName = VARIABLE_FIELDS.DATA_TYPE;
        const value = event.detail.value;
        const error = null;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.variableResource = variableReducer(this.variableResource, action);
        // TODO: handle clearing of fields when data type is changed
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