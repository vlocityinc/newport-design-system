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
import { format } from 'builder_platform_interaction/commonUtils';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import {
    SORT_ORDER,
    RECORD_FILTER_CRITERIA
} from 'builder_platform_interaction/recordEditorLib';
import { getOutputRules } from 'builder_platform_interaction/ruleLib';

const RECORD_CHOICE_SET_FIELDS = {
    RECORD_OBJECT: 'object',
    FILTER_TYPE: 'filterType',
    SORT_FIELD: 'sortField',
    SORT_ORDER: 'sortOrder',
    LIMIT: 'limit',
    DISPLAY_FIELD: 'displayField',
    DATA_TYPE: 'dataType',
    VALUE_FIELD: 'valueField',
    OUTPUT_ASSIGNMENTS: 'outputAssignments'
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
    menuDataFields = {};

    @track
    filteredMenuDataFields = {};

    rules = getOutputRules();

    /**
     * second section includes Filter, Sort Results, Choice Template and Additional Assignments sections
     */
    showSecondSection = false;

    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        const event = { type: VALIDATE_ALL, showSecondSection: this.showSecondSection };
        this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, event);
        const errors = getErrorsFromHydratedElement(this.recordChoiceSetResource);

        // If there are no errors then we need to update outputAssignments before storing the recordChoiceSetResource
        if (errors && errors.length === 0) {
            const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_OUTPUT_ASSIGNMENTS_BEFORE_CLOSE, {
                propertyName: RECORD_CHOICE_SET_FIELDS.OUTPUT_ASSIGNMENTS
            });
            this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, action);
        }
        return errors;
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

            if (this.recordChoiceSetResource.outputAssignments && this.recordChoiceSetResource.outputAssignments.length === 0) {
                const action = createAction(PROPERTY_EDITOR_ACTION.ADD_EMPTY_OUTPUT_ASSIGNMENT, {
                    propertyName: RECORD_CHOICE_SET_FIELDS.OUTPUT_ASSIGNMENTS
                });
                this.recordChoiceSetResource = recordChoiceSetReducer(this.recordChoiceSetResource, action);
            }

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

    get dataType() {
        return this.recordChoiceSetResource.dataType.value;
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

    get recordFieldsForFilter() {
        return Object.keys(this.menuDataFields).filter(key => this.menuDataFields[key].filterable).reduce((obj, key) => {
            obj[key] = this.menuDataFields[key];
            return obj;
        }, {});
    }

    get resourceDisplayText() {
        const entityToDisplay = sobjectLib.getAllEntities().filter(entity => entity.apiName === this.recordChoiceSetResource.object.value);
        if (entityToDisplay.length === 1) {
            return entityToDisplay[0].entityLabel;
        }
        return '';
    }

    get dataTypeList() {
        return [FLOW_DATA_TYPE.STRING, FLOW_DATA_TYPE.NUMBER, FLOW_DATA_TYPE.CURRENCY,
            FLOW_DATA_TYPE.DATE, FLOW_DATA_TYPE.BOOLEAN];
    }

    get dataTypePickerValue() {
        return { dataType : this.dataType };
    }

    get disableValueFieldPicker() {
        return !this.dataType;
    }

    get outputAssignmentTitle() {
        return format(this.labels.outputFieldsHeaderLabel, this.resourceDisplayText);
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
        sobjectLib.fetchFieldsForEntity(this.recordChoiceSetResource.object.value).then(fields => {
            this.menuDataFields = fields;

            if (!this.menuDataFields) {
                return;
            }

            // Filtering the menudata based on the selected dataType(if any) for the Choice Value Field Picker
            if (this.recordChoiceSetResource.dataType && this.recordChoiceSetResource.dataType.value) {
                this.filterEntityFields();
            }
        });
    }

    /**
     * Helper method to filter entityFields based on the selected dataType
     */
    filterEntityFields() {
        if (!this.menuDataFields) {
            return;
        }

        this.filteredMenuDataFields = Object.keys(this.menuDataFields).reduce((filteredMenuData, fieldName) => {
            if (this.menuDataFields[fieldName].dataType === this.dataType) {
                filteredMenuData[fieldName] = this.menuDataFields[fieldName];
            }
            return filteredMenuData;
        }, {});
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
            this.menuDataFields = {};
            this.filteredMenuDataFields = {};
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.RECORD_OBJECT, value, error);
            if (value && !error) {
                // Getting the entityFields only when a valid value is entered.
                this.getEntityFields();
            }
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.FILTER_TYPE, RECORD_FILTER_CRITERIA.NONE, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_ORDER, SORT_ORDER.NOT_SORTED, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_FIELD, null, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.DISPLAY_FIELD, null, null, false);
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.VALUE_FIELD, null, null, false);

            // Updating the dataType property only for the first time when second section opens
            if (!this.showSecondSection && !error) {
                this.updateProperty(RECORD_CHOICE_SET_FIELDS.DATA_TYPE, null, null, false);
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

    /**
     * @param {Object} event recordFilterType changed event from record-filter component
     */
    handleFilterTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.filterType;
        this.updateProperty(RECORD_CHOICE_SET_FIELDS.FILTER_TYPE, value, null);
    }

    /**
     * @param {Object} event [add/update/delete]recordFilter event from record-filter component
     */
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

    /**
     * @param {*} event change event from record sort component
     */
    handleRecordSortChanged(event) {
        event.stopPropagation();
        if (this.recordChoiceSetResource.sortField.value !== event.detail.fieldApiName) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_FIELD, event.detail.fieldApiName, event.detail.error, false);
        } else {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.SORT_ORDER, event.detail.sortOrder, event.detail.error, false);
        }
    }

    /**
     * @param {*} event focus out event from choice limit input
     */
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
     * @param {*} event comboboxstatechanged event coming from choice label field picker
     */
    handleDisplayFieldChanged(event) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;

        if (value !== this.recordChoiceSetResource.displayField.value) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.DISPLAY_FIELD, value, event.detail.error);
        }
    }

    /**
     * @param {*} event value changed event coming from data type picker
     */
    handleDataTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.value;

        // Updating the property only if newValue !== oldValue
        if (value.dataType !== this.dataType) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.DATA_TYPE, value.dataType, event.detail.error);
            // Filtering entityFields based on selected dataType
            this.filterEntityFields();
            // Resetting picklistField to null and ensuring that it doesn't get hydrated yet.
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.VALUE_FIELD, null, null, false);
        }
    }

    /**
     * @param {*} event event comboboxstatechanged event coming from choice value field picker
     */
    handleValueFieldChanged(event) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        const value = itemOrDisplayText.value || itemOrDisplayText;

        if (value !== this.recordChoiceSetResource.valueField.value) {
            this.updateProperty(RECORD_CHOICE_SET_FIELDS.VALUE_FIELD, value, event.detail.error);
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