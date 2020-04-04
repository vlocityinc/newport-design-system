import { LightningElement, api, track } from 'lwc';
import { LABELS } from './platformEventEditorLabels';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { platformEventReducer } from './platformEventEditorReducer';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';

export default class platformEventEditor extends LightningElement {
    /**
     * Internal state for the platform event trigger editor
     */
    @track
    startElement;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    _lastRecordedEventTypeValue = null;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.startElement;
    }

    get entityMode() {
        return EntityResourcePicker.ENTITY_MODE.MANAGED_SETUP_EVENT;
    }

    /**
     * @returns {Object} configuration to pass to entity-resource-picker component. This is a required field
     */
    get entityComboboxConfigRequired() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.platformEventEnitityObject, // Label
            this.labels.platformEventEnitityObjectPlaceholder, // Placeholder
            this.startElement.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false // disabled
        );
    }

    /**
     * @param {Object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const { item, error, displayText } = event.detail;
        const newRecordEntityName = (item && item.value) || displayText;
        if (newRecordEntityName !== this._lastRecordedEventTypeValue) {
            this.updateProperty('object', newRecordEntityName, error, false, this._lastRecordedEventTypeValue);
            if (!error && newRecordEntityName) {
                this._lastRecordedEventTypeValue = newRecordEntityName;
            }
        }
    }

    /**
     * Instantiates property changed event based to handle property change and updating via element's reducer state accordingly
     * @param {string} propertyName - name of the property changed
     * @param {Object|string|boolean} newValue - new value to be passed to property
     * @param {string} error - error on property
     * @param {boolean} ignoreValidate - true if we do not want to have specific property validation
     * @param {Object|string|boolean} oldValue - property's previous value
     */
    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.startElement = platformEventReducer(this.startElement, propChangedEvent);
    }

    /**
     * public api function to run the rules from platform event record validation library
     * @returns {Array} list of errors
     */
    @api
    validate() {
        const event = { type: VALIDATE_ALL };
        this.startElement = platformEventReducer(this.startElement, event);
        return getErrorsFromHydratedElement(this.startElement);
    }
}
