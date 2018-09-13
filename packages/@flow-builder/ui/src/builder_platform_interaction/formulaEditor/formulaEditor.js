import { LightningElement, api, track } from 'lwc';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { createAction, PROPERTY_EDITOR_ACTION } from "builder_platform_interaction/actions";
import { formulaReducer } from "./formulaReducer";
import { LABELS } from "./formulaEditorLabels";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";

const dataTypes = [FLOW_DATA_TYPE.STRING, FLOW_DATA_TYPE.NUMBER, FLOW_DATA_TYPE.CURRENCY, FLOW_DATA_TYPE.BOOLEAN, FLOW_DATA_TYPE.DATE, FLOW_DATA_TYPE.DATE_TIME];

export default class FormulaEditor extends LightningElement {
    @track
    formulaResource;

    labels = LABELS;

    // used to keep track of whether this is an existing formula resource
    @api
    isNewMode = false;

    @api
    get node() {
        return this.formulaResource;
    }

    set node(newValue) {
        this.formulaResource = newValue || {};
    }

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.formulaResource;
    }

    get dataTypes() {
        return dataTypes;
    }

    get selectedDataType() {
        return  {
            dataType : getValueFromHydratedItem(this.formulaResource.dataType),
            scale : this.formulaResource.scale
        };
    }

    get isEditMode() {
        return !this.isNewMode;
    }

    get dataTypeHelpText() {
        return !this.isNewMode ? this.labels.dataTypeCannotBeChangedHelpText : null;
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const propertyName = event.detail.propertyName;
        const value = event.detail.value;
        const error = event.detail.error;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    handleDataTypeChanged(event) {
        event.stopPropagation();
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value : event.detail.value });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    handleFormulaExpressionChanged(event) {
        const propertyName = 'expression';
        const value = event.detail.value;
        const errors = event.detail.error;
        const error = errors ? errors[0].message : null;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    @api
    validate() {
        const action = createAction(VALIDATE_ALL);
        this.formulaResource = formulaReducer(this.formulaResource, action);
        return getErrorsFromHydratedElement(this.formulaResource);
    }
}