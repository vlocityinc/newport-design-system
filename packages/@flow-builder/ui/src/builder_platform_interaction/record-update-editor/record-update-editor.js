import { Element, api, track, unwrap } from 'engine';
import { recordUpdateReducer } from './record-update-reducer';
import { LABELS } from './record-update-editor-labels';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

export default class RecordUpdateEditor extends Element {
    labels = LABELS;

    /**
     * Internal state for the editor
     */
    @track
    recordUpdateElement = {};

    /**
     * public api function to return the unwrapped node
     *
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.recordUpdateElement);
    }

    @api
    get node() {
        return this.recordUpdateElement;
    }

    @api
    set node(newValue) {
        this.recordUpdateElement = newValue;
    }

    /**
     * public api function to run the rules from record update validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.recordUpdateElement = recordUpdateReducer(this.recordUpdateElement, event);
        return getErrorsFromHydratedElement(this.recordUpdateElement);
    }

    get elementType() {
        return this.recordUpdateElement.elementType;
    }

    /**
     * Return true if the editor is in sObject mode.
     * In sObject mode record(s) to update are specified
     * with a given sObject or sObject collection with id field(s) populated
     * Otherwise records to update are specified using critera(s).
     */
    get isSObjectMode() {
        return !!this.recordUpdateElement.inputReference;
    }

    get inputReference() {
        if (this.recordUpdateElement.inputReference && this.recordUpdateElement.inputReference.value) {
            return this.recordUpdateElement.inputReference.value;
        }
        return '';
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.updateProperty(event.detail.propertyName, event.detail.value, event.detail.error);
    }

    /**
     * @param {object} event - input reference changed event coming from sobject-or-sobject-collection-picker component
     */
    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
    }

    updateProperty(propertyName, value, error) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error });
        this.recordUpdateElement = recordUpdateReducer(this.recordUpdateElement, action);
    }
}