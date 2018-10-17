import {
    LightningElement,
    track,
    api,
    unwrap
} from 'lwc';
import { recordChoiceSetReducer } from './recordChoiceSetReducer';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { LABELS } from './recordChoiceSetEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import {
    SORT_ORDER,
    RECORD_FILTER_CRITERIA
} from 'builder_platform_interaction/recordEditorLib';

const RECORD_CHOICE_SET_FIELDS = {
    RECORD_OBJECT: 'object',
    FILTER_TYPE: 'filterType',
    SORT_FIELD: 'sortField',
    SORT_ORDER: 'sortOrder',
    LIMIT: 'limit',
};
const SELECTORS = {
    LIMIT: '.choice-limit'
};

export default class RecordChoiceSetEditor extends LightningElement {
    /**
     * Internal state for the record choice set editor
     */
    @track
    recordChoiceSetResource;
    @track
    menuDataFields = [];

    _entityFields;

    /**
     * second section includes Filter, Sort Results, Choice Template and Additional Assignments sections
     */
    showSecondSection = false;

    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        const event = { type: VALIDATE_ALL };
        this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, event);
        return getErrorsFromHydratedElement(this.recordChoiceSetResource);
    }

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.recordChoiceSetResource;
    }

    @api
    get node() {
        return this.recordChoiceSetResource;
    }

    set node(newValue) {
        this.recordChoiceSetResource = unwrap(newValue);
        if (this.recordChoiceSetResource.object && this.recordChoiceSetResource.object.value) {
            this.getEntityFields();
            this.showSecondSection = true;
        }
    }

    @api isNewMode = false;

    get labels() {
        return LABELS;
    }

    /**
     * disable certain fields based on whether we are editing an existing record choice set
     */
    get isFieldDisabled() {
        return !this.isNewMode;
    }

    get hideNewResourceButton() {
        return this.isNewMode;
    }
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.entityPickerLabel, // label
            LABELS.entityPickerPlaceholder, // placeholder
            this.recordChoiceSetResource.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            this.isFieldDisabled, // disabled
            FLOW_DATA_TYPE.SOBJECT.value // type
        );
    }

    /**
     * @returns {Object} the entity fields
     */
    get entityFields() {
        return this._entityFields;
    }

    get resourceDisplayText() {
        const entityToDisplay = sobjectLib.getAllEntities().filter(entity => entity.apiName === this.recordChoiceSetResource.object.value);
        if (entityToDisplay.length === 1) {
            return entityToDisplay[0].entityLabel;
        }
        return '';
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
     * Extract out value from the event or item if payload is from combobox
     * Ex: If a select happened it will have an item as payload
     * Ex: if a literal is typed then the event will not have an item, just a display text
     * @param {Object} event Event for the data type
     * @return {Object|String} value of the event payload
     */
    getItemOrDisplayText(event) {
        // if it is a combobox value changed event we have two cases: literals or item select
        return event.detail.item || event.detail.displayText;
    }
    /**
     * Helper method to get entityFields based on the selected recordChoiceSetObject
     */
    getEntityFields() {
        sobjectLib.getFieldsForEntity(this.recordChoiceSetResource.object.value, (fields) => {
            this._entityFields = fields;
            if (this.dataType) {
                this.filterEntityFields();
            }
        });
    }
    /**
     * Helper method to update the recordChoiceObjectType. Also resets other properties accordingly.
     * @param {Object} event
     * @param {String} error
     */
    updateObjectType(event, error) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;
        // Updating the property only if newValue !== oldValue
        if (value !== this.recordChoiceSetResource.object.value) {
            this.menuDataFields = [];
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.RECORD_OBJECT, value, error);
            if (value && !error) {
                // Getting the entityFields only when a valid value is entered.
                this.getEntityFields();
            }
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.FILTER_TYPE, RECORD_FILTER_CRITERIA.NONE, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_ORDER, SORT_ORDER.NOT_SORTED, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_FIELD, null, null, false);
            if (!this.showSecondSection && !error) {
                this.showSecondSection = true;
            }
        }
    }

    /**
     * Handles the on change event and updated recordChoiceSetResource accordingly
     * @param {Object} event On combobox-state-changed event coming from entity-resource-picker
     */
    handleObjectTypeChange(event) {
        this.updateObjectType(event, event.detail.error);
    }
    /**
     * Handles the on select event and updated recordChoiceSetResource accordingly
     * @param {Object} event On item-selected event coming from entity-resource-picker
     */
    handleObjectTypeSelect(event) {
        this.updateObjectType(event, null);
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

    handleFilterTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.filterType;
        this.updateProperty(RECORD_CHOICE_SET_FIELDS.FILTER_TYPE, value, null);
    }
    handleListItemChanged(event) {
        event.stopPropagation();
        const actionType = event.type;
        const value = event.detail && event.detail.value;
        const index = event.detail && event.detail.index;
        const action = createAction(actionType, {
            value,
            index,
        });
        this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, action);
    }

    handleRecordSortChanged(event) {
        event.stopPropagation();
        if (this.recordChoiceSetResource.sortField.value !== event.detail.fieldApiName) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_FIELD, event.detail.fieldApiName, event.detail.error, false);
        } else {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_ORDER, event.detail.sortOrder, event.detail.error, false);
        }
    }

    handleChoiceLimitChanged(event) {
        const choiceLimitElement = event.target;
        const limitValue = choiceLimitElement.value;
        if (choiceLimitElement.validity && !choiceLimitElement.validity.valid && choiceLimitElement.validity.badInput) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.LIMIT, limitValue, LABELS.mustBeAValidNumber);
        } else {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.LIMIT, limitValue, null);
        }
    }

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {String} value to update with
     * @param {String} error if any
     * @param {Boolean} doValidateProperty If false, doesn't validate the property on blur
     */
    updateProperty(propertyName, value, error, doValidateProperty = true) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
            propertyName,
            value,
            error,
            doValidateProperty
        });
        this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, action);
    }

    renderedCallback() {
        const limitElement = this.template.querySelector(SELECTORS.LIMIT);
        if (limitElement) {
            if (this.recordChoiceSetResource.limit && this.recordChoiceSetResource.limit.error) {
                limitElement.setCustomValidity(this.recordChoiceSetResource.limit.error);
            } else {
                limitElement.setCustomValidity('');
            }
            limitElement.showHelpMessageIfInvalid();
        }
    }
}