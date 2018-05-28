import { Element, api, track, unwrap } from 'engine';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction-data-mutation-lib';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { formulaReducer } from './formula-reducer';
import { LABELS } from './formula-editor-labels';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

const dataTypeMenuItems = [FLOW_DATA_TYPE.STRING, FLOW_DATA_TYPE.NUMBER, FLOW_DATA_TYPE.CURRENCY, FLOW_DATA_TYPE.BOOLEAN, FLOW_DATA_TYPE.DATE, FLOW_DATA_TYPE.DATE_TIME];

export default class FormulaEditor extends Element {
    @track
    formulaResource;

    labels = LABELS;

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

    get dataType() {
        return getValueFromHydratedItem(this.formulaResource.dataType);
    }

    get dataTypeMenuItems() {
        return dataTypeMenuItems;
    }

    get isDataTypeComboboxDisabled() {
        return false;
    }

    get showScale() {
        return this.dataType === FLOW_DATA_TYPE.NUMBER.value || this.dataType === FLOW_DATA_TYPE.CURRENCY.value;
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
        const dataType = event.detail.value;
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value : { dataType } });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    handleScaleFocusOut(event) {
        event.stopPropagation();
        const dataType = this.formulaResource.dataType.value;
        const scale = Number(event.target.value);
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, { value : { dataType, scale } });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    handleFormulaFocusOut(event) {
        event.stopPropagation();
        const propertyName = 'expression';
        const value = event.target.value;
        const error = null;
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.formulaResource = formulaReducer(this.formulaResource, action);
    }

    @api
    validate() {
        return getErrorsFromHydratedElement(this.formulaResource);
    }
}