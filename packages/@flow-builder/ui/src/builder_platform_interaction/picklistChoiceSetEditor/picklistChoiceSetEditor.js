import { LightningElement, api, track, unwrap } from 'lwc';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { picklistChoiceSetReducer } from './picklistChoiceSetReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { DEFAULT_SORT_VALUE } from 'builder_platform_interaction/elementFactory';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { LABELS } from './picklistChoiceSetEditorLabels';
import { format } from 'builder_platform_interaction/commonUtils';

const SORT_ORDER_OPTIONS = [{
    label : LABELS.ascendingSortOrder,
    value : 'Asc'
}, {
    label : LABELS.descendingSortOrder,
    value : 'Desc'
}, {
    label : LABELS.defaultSortOrder,
    value : DEFAULT_SORT_VALUE
}];

const PICKLIST_CHOICE_SET_FIELDS = {
    NAME: 'name',
    DESCRIPTION: 'description',
    PICKLIST_OBJECT: 'picklistObject',
    DATA_TYPE: 'dataType',
    PICKLIST_FIELD: 'picklistField',
    SORT_ORDER: 'sortOrder'
};

export default class PicklistChoiceSetEditor extends LightningElement {
    /**
     * Internal state for the picklist choice set editor
     */
    @track
    picklistChoiceSetResource;

    @track
    menuDataFields = [];

    _entityFields;

    showPicklistSection = false;

    @api
    get node() {
        return this.picklistChoiceSetResource;
    }

    set node(newValue) {
        this.picklistChoiceSetResource = unwrap(newValue);
        // Filling up fieldMenuData when in edit mode.
        if (!this._entityFields && this.picklistChoiceSetResource.picklistObject && this.picklistChoiceSetResource.picklistObject.value &&
            this.picklistChoiceSetResource.dataType && this.picklistChoiceSetResource.dataType.value) {
            this.getEntityFields();
            this.showPicklistSection = true;
        }
    }

    @api isNewMode = false;

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.picklistChoiceSetResource;
    }

    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        const event = { type: VALIDATE_ALL };
        this.picklistChoiceSetResource = picklistChoiceSetReducer(this.picklistChoiceSetResource, event);
        return getErrorsFromHydratedElement(this.picklistChoiceSetResource);
    }

    get labels() {
        return LABELS;
    }

    get dataType() {
        return this.picklistChoiceSetResource.dataType.value;
    }

    // we want to disable certain fields based on whether we are editing an existing picklistChoiceSet or not.
    get isFieldDisabled() {
        return !this.isNewMode;
    }

    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.entityPickerLabel, // label
            LABELS.entityPickerPlaceholder, // placeholder
            this.picklistChoiceSetResource.picklistObject.error, // errorMessage
            false, // literalsAllowed
            true, // required
            this.isFieldDisabled, // disabled
            FLOW_DATA_TYPE.SOBJECT.value // type
        );
    }

    get dataTypeList() {
        return [FLOW_DATA_TYPE.PICKLIST, FLOW_DATA_TYPE.MULTI_PICKLIST];
    }

    get dataTypePickerValue() {
        return { dataType : this.dataType };
    }

    get fieldPickerPlaceholder() {
        if (this.dataType) {
            return format(LABELS.fieldPickerDataTypePlaceholder, this.dataType);
        }

        return LABELS.fieldPickerPlaceholder;
    }

    get disableFieldPicker() {
        return !this.dataType;
    }

    get sortOrderOptions() {
        return SORT_ORDER_OPTIONS;
    }

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {String} value to update with
     * @param {String} error if any
     * @param {Boolean} doValidateProperty If false, doesn't validate the property on blur
     */
    updateProperty(propertyName, value, error, doValidateProperty = true) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, { propertyName, value, error, doValidateProperty });
        this.picklistChoiceSetResource = picklistChoiceSetReducer(this.picklistChoiceSetResource, action);
    }

    /**
     * @param {Object} event property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        event.stopPropagation();

        const value = event.detail.value;
        const error = event.detail.error || null;

        this.updateProperty(event.detail.propertyName, value, error);
    }

    /**
     * Extract out value from the event or item if payload is from combobox
     * Ex: If a select happened it will have an item as payload
     * Ex: if a literal is typed then the event will not have an item, just a display text
     * @param {Object} event Event for the data type
     * @return {Object|String} value of the event payload
     */
    getItemOrDisplayText(event) {
        // if it is a combobox value changed event we have two cases: literals or item select
        return event.detail.item ? event.detail.item : event.detail.displayText;
    }

    /**
     * Helper method to get entityFields based on the selected picklistObject
     */
    getEntityFields() {
        sobjectLib.getFieldsForEntity(this.picklistChoiceSetResource.picklistObject.value, (fields) => {
            this._entityFields = fields;
            if (this.dataType) {
                this.filterEntityFields();
            }
        });
    }

    /**
     * Helper method to update the picklistObjectType. Also resets other properties accordingly.
     * @param {Object} event
     * @param {String} error
     */
    updateObjectType(event, error) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;

        // Updating the property only if newValue !== oldValue
        if (value !== this.picklistChoiceSetResource.picklistObject.value) {
            if (!this.showPicklistSection && !error) {
                this.showPicklistSection = true;
            }

            this.menuDataFields = [];
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.PICKLIST_OBJECT, value, error);

            if (value && !error) {
                // Getting the entityFields only when a valid value is entered.
                this.getEntityFields();
            }
            // Resetting picklistField to null and ensuring that it doesn't get hydrated yet.
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.PICKLIST_FIELD, null, null, false);
        }
    }


    /**
     * Handles the on change event and updated picklistChoiceSetResource accordingly
     * @param {Object} event On combobox-state-changed event coming from entity-resource-picker
     */
    handleObjectTypeChange(event) {
        this.updateObjectType(event, event.detail.error);
    }

    /**
     * Handles the on select event and updated picklistChoiceSetResource accordingly
     * @param {Object} event On item-selected event coming from entity-resource-picker
     */
    handleObjectTypeSelect(event) {
        this.updateObjectType(event, null);
    }

    /**
     * Helper method to filter entityFields based on the selected dataType
     */
    filterEntityFields() {
        if (!this._entityFields) {
            return;
        }

        this.menuDataFields = Object.keys(this._entityFields).reduce((menuData, fieldName) => {
            if (this._entityFields[fieldName].dataType === this.dataType) {
                menuData[fieldName] = this._entityFields[fieldName];
            }
            return menuData;
        }, {});
    }

    /**
     * Handles the on change event and updates the dataType of the picklistChoiceSetResource if it has been changed
     * @param {Object} event On value changed event coming from data-type-picker
     */
    handleDataTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.value;

        // Updating the property only if newValue !== oldValue
        if (value.dataType !== this.dataType) {
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.DATA_TYPE, value.dataType, event.detail.error);
            // Filtering entityFields based on selected dataType
            this.filterEntityFields();
            // Resetting picklistField to null and ensuring that it doesn't get hydrated yet.
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.PICKLIST_FIELD, null, null, false);
        }
    }

    /**
     * Handle the on change event and updated the picklistField of the picklistChoiceSetResource accordingly
     * @param {Object} event On change event coming from the field-picker
     */
    handleFieldChanged(event) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;

        if (value !== this.picklistChoiceSetResource.picklistField.value) {
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.PICKLIST_FIELD, value, event.detail.error);
        }
    }

    /**
     * Handle the on change event and updated the sortOrder of the picklistChoiceSetResource accordingly
     * @param {Object} event On change event coming from the combobox
     */
    handleSortOrderChanged(event) {
        event.stopPropagation();
        const value = event.detail.value;

        if (value !== this.picklistChoiceSetResource.sortOrder.value) {
            this.updateProperty(PICKLIST_CHOICE_SET_FIELDS.SORT_ORDER, value, null);
        }
    }
}