import { LightningElement, api, track} from 'lwc';
import { recordDeleteReducer } from './recordDeleteReducer';
import { LABELS } from './recordDeleteEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';

export default class RecordDeleteEditor extends LightningElement {
    labels = LABELS;
    /**
     * Internal state for the editor
     */
    @track
    recordDeleteElement = {};

    /**
     * public API function to return the node
     *
     * @returns {object} node - current node
     */
    @api getNode() {
        return this.recordDeleteElement;
    }

    @api
    get node() {
        return this.recordDeleteElement;
    }

    /**
     * Passing current element (node) to the editor
     * @param {object} newValue - element (node) to load
     */
    set node(newValue) {
        this.recordDeleteElement = newValue;
    }

    /**
     * public API function to run the rules from record delete validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        this.recordDeleteElement = recordDeleteReducer(this.recordDeleteElement, { type: VALIDATE_ALL });
        return getErrorsFromHydratedElement(this.recordDeleteElement);
    }

    /**
     * Returns the element type of the current node
     */
    get elementType() {
        return this.recordDeleteElement.elementType;
    }

    /**
     * Return true if the editor is in sObject mode.
     * In sObject mode record(s) to delete are specified
     * with a given sObject or sObject collection with id field(s) populated
     * Otherwise record(s) to delete are specified using criteria
     */
    get isSObjectMode() {
        return !!this.recordDeleteElement.inputReference;
    }

    /**
     * Returns the element 'inputReference' property value if not 'falsy' empty string otherwise
     */
    get inputReferenceValue() {
        if (this.recordDeleteElement.inputReference && this.recordDeleteElement.inputReference.value) {
            return this.recordDeleteElement.inputReference.value;
        }
        return '';
    }

    /**
     * Returns the element 'inputReference' error value if any null otherwise
     */
    get inputReferenceErrorMsg() {
        return this.recordDeleteElement.inputReference ? this.recordDeleteElement.inputReference.error : null;
    }

    /**
     * Editor's property value changed event handler
     * @param {object} event - event dispatched by the property change
     */
    handlePropertyValueChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty(event.detail);
    }

    /**
     * Triggers the editor's reducer for any property's change (if no property name explicitly given defaulted to 'inputReference'
     */
    updateProperty({propertyName = 'inputReference', value, error}) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.recordDeleteElement = recordDeleteReducer(this.recordDeleteElement, action);
    }
}