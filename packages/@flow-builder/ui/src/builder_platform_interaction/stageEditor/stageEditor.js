import { LightningElement, api, track } from 'lwc';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { stageReducer } from './stageReducer';
import {
    VALIDATE_ALL,
    isUniqueOrderNumberInStore
} from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './stageEditorLabels';
import { STAGE_ORDER_RANGE } from 'builder_platform_interaction/dataTypeLib';

const SELECTORS = {
    INPUT_FIELD: 'lightning-input'
};

export default class StageEditor extends LightningElement {
    labels = LABELS;

    stageOrderRange = STAGE_ORDER_RANGE;

    /**
     * Internal state for the stage editor
     */
    @track
    stageResource;

    @track
    showErrorMessageIfBlank = LABELS.cannotBeBlank;
    // used to keep track of whether this is an existing stage resource
    @api
    isNewMode = false;
    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    get node() {
        return this.stageResource;
    }

    set node(newValue) {
        this.stageResource = newValue || {};
        const orderInput = this.template.querySelector(SELECTORS.INPUT_FIELD);
        this.setInputErrorMessage(
            orderInput,
            this.stageResource.stageOrder.error
        );
    }

    @api
    getNode() {
        return this.stageResource;
    }

    @api
    validate() {
        const action = createAction(VALIDATE_ALL);
        this.stageResource = stageReducer(this.stageResource, action);
        const labelInput = this.template.querySelector(SELECTORS.INPUT_FIELD);
        this.setInputErrorMessage(
            labelInput,
            this.stageResource.stageOrder.error
        );
        return getErrorsFromHydratedElement(this.stageResource);
    }

    /* ********************** */
    /*     Error Handling    */
    /* ********************** */

    /** LWC hook after rendering every component we are setting all errors via set Custom Validity
     * except initial rendering
     **/
    renderedCallback() {
        if (this.stageResource.stageOrder.value !== null) {
            const labelInput = this.template.querySelector(
                SELECTORS.INPUT_FIELD
            );
            this.setInputErrorMessage(
                labelInput,
                this.stageResource.stageOrder.error
            );
        }
    }
    /** Sets the CustomValidity if there is a valid error message.
     * @param {Object} element - the input component
     * @param {Object} error - the input component
     */
    setInputErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /* ********************** */
    /*     Event handlers     */
    /* ********************** */

    /**
     * @param {object} event - property changed event coming from label-description component
     * */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const propertyName = event.detail.propertyName;
        const value = event.detail.value;
        const error = event.detail.error;
        const action = createAction(
            PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            { propertyName, value, error }
        );
        this.stageResource = stageReducer(this.stageResource, action);
    }
    /**
     * Handles the value change for stageOrder input.
     * @param {object} event on change / focus out
     */
    handleOrderChange(event) {
        event.stopPropagation();
        const value = event.target.value;
        if (value !== this.stageResource.stageOrder.value) {
            const error = isUniqueOrderNumberInStore(value, [
                this.stageResource.guid
            ]);
            const propertyName = 'stageOrder';
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                { propertyName, value, error }
            );
            this.stageResource = stageReducer(this.stageResource, action);
        }
    }
    /**
     * Handles the value change for active or inactive input.
     * @param {object} event on change / focus out
     */
    handleIsActiveChange(event) {
        event.stopPropagation();
        const value = event.detail.checked;
        if (value !== this.stageResource.isActive) {
            const propertyName = 'isActive';
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_VALUE,
                { propertyName, value }
            );
            this.stageResource = stageReducer(this.stageResource, action);
        }
    }
}
