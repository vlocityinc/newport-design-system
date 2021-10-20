import { LightningElement, track, api } from 'lwc';
import { collectionChoiceSetReducer } from './collectionChoiceSetReducer';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { createAction, PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { LABELS } from './collectionChoiceSetEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const COLLECTION_CHOICE_SET_FIELDS = {
    COLLECTION_REFERENCE: 'collectionReference',
    DISPLAY_FIELD: 'displayField',
    DATA_TYPE: 'dataType',
    VALUE_FIELD: 'valueField'
};

export default class CollectionChoiceSetEditor extends LightningElement {
    _ferovPickerId = generateGuid();
    _objectType?: string = '';

    set ferovPickerId(ferovPickerId: string) {
        this._ferovPickerId = ferovPickerId ? ferovPickerId : generateGuid();
    }

    @api
    get ferovPickerId() {
        return this._ferovPickerId;
    }

    /**
     * Internal state for the collection choice set editor
     */
    @track
    collectionChoiceSet;

    @track
    menuDataFields = {};

    @track
    filteredMenuDataFields = {};

    /**
     * second section includes Label (displayField), Data Type, and Value (valueField)
     */
    showSecondSection = false;

    @api validate() {
        const action = {
            type: VALIDATE_ALL,
            showSecondSection: this.showSecondSection
        };
        this.collectionChoiceSet = collectionChoiceSetReducer(this.collectionChoiceSet, action);

        return getErrorsFromHydratedElement(this.collectionChoiceSet);
    }

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     *
     * @returns node - node
     */
    @api
    getNode(): object {
        return this.collectionChoiceSet;
    }

    @api
    get node() {
        return this.collectionChoiceSet;
    }

    set node(newValue) {
        if (newValue?.collectionReference?.value !== this.collectionChoiceSet?.collectionReference.value) {
            const collectionObj = getElementByGuid(newValue.collectionReference.value);
            if (collectionObj) {
                this._objectType = collectionObj?.subtype;
            }
            this.collectionChoiceSet = newValue;
            if (this._objectType) {
                this.getEntityFields();
                this.showSecondSection = true;
            }
        }
    }

    @api
    isNewMode = false;

    /**
     * disable datatype based on whether we are editing an existing collection choice set
     *
     * @returns boolean
     */
    get isDataTypeDisabled() {
        return !this.isNewMode;
    }

    @api
    mode;

    @api
    editorParams;

    get labels() {
        return LABELS;
    }

    get dataType() {
        return this.collectionChoiceSet?.dataType?.value;
    }

    get dataTypeList() {
        return [
            FLOW_DATA_TYPE.STRING,
            FLOW_DATA_TYPE.NUMBER,
            FLOW_DATA_TYPE.CURRENCY,
            FLOW_DATA_TYPE.DATE,
            FLOW_DATA_TYPE.BOOLEAN
        ];
    }

    get dataTypePickerValue() {
        return { dataType: this.dataType };
    }

    get disableValueFieldPicker() {
        return !this.dataType;
    }

    get collectionReferenceValue() {
        return this.collectionChoiceSet?.collectionReference?.value;
    }

    get collectionReferenceError() {
        return this.collectionChoiceSet?.collectionReference?.error;
    }

    /**
     * Extract out value from the event or item if payload is from combobox
     * Ex: If a select happened it will have an item as payload
     * Ex: if a literal is typed then the event will not have an item, just a display text
     *
     * @param event Event for the data type
     * @returns value of the event payload
     */
    getItemOrDisplayText(event: CustomEvent): UI.Ferov | string {
        // if it is a combobox value changed event we have two cases: literals or item select
        return event.detail.item || event.detail.displayText;
    }

    get propertyEditorElementType() {
        return ELEMENT_TYPE.COLLECTION_CHOICE_SET;
    }

    /**
     * Helper method to get entityFields based on the selected recordChoiceSetObject
     */
    getEntityFields() {
        sobjectLib
            .fetchFieldsForEntity(this._objectType)
            .then((fields) => {
                this.menuDataFields = fields;
                if (!this.menuDataFields) {
                    return;
                }

                // Filtering the menudata based on the selected dataType(if any) for the Choice Value Field Picker
                if (this.collectionChoiceSet.dataType && this.collectionChoiceSet.dataType.value) {
                    // keep in object not collectionChoiceSet
                    this.filterEntityFields();
                }
            })
            .catch(() => {
                // fetchFieldsForEntity displays an error message
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
     * Helper method to update the collectionChoiceSet object. Also resets other properties accordingly.
     *
     * @param event Event for Ferov Resource Picker
     * @param error Potential Error from Ferov Resource Picker
     */
    updateResource(event: CustomEvent, error: string | null) {
        event.stopPropagation();
        const collectionReferenceValue = event.detail?.item?.value;

        this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.COLLECTION_REFERENCE, collectionReferenceValue, error);
        const subtype = event.detail?.item?.subtype;

        if (subtype && this._objectType !== subtype) {
            this._objectType = subtype;
            this.menuDataFields = {};
            this.filteredMenuDataFields = {};

            if (!error) {
                this.getEntityFields();
            }
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.DISPLAY_FIELD, null, null, false);
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.VALUE_FIELD, null, null, false);

            // Updating the dataType property only for the first time when second section opens
            if (!this.showSecondSection && !error) {
                const dataTypeValue = this.collectionChoiceSet.dataType
                    ? this.collectionChoiceSet.dataType.value
                    : null;
                this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.DATA_TYPE, dataTypeValue, null, false);
                this.showSecondSection = true;
            }
        }
    }

    /**
     * Handles the on change event and updated collectionChoiceSet accordingly
     *
     * @param event On combobox-state-changed event coming from entity-resource-picker
     */
    handleResourceChange(event: CustomEvent) {
        this.updateResource(event, event.detail.error);
    }
    /**
     * Handles the on select event and updated collectionChoiceSet accordingly
     *
     * @param event On item-selected event coming from entity-resource-picker
     */
    handleResourceSelect(event: CustomEvent) {
        this.updateResource(event, null);
    }

    /**
     * @param event property changed event coming from label-description component
     */
    handlePropertyChanged(event: CustomEvent) {
        event.stopPropagation();
        const value = event.detail.value;
        const error = event.detail.error || null;
        this.updateProperty(event.detail.propertyName, value, error);
    }

    /**
     * @param event comboboxstatechanged event coming from choice label field picker
     */
    handleDisplayFieldChanged(event: CustomEvent) {
        event.stopPropagation();
        const itemOrDisplayText = this.getItemOrDisplayText(event);
        let value: string | null = '';
        if (typeof itemOrDisplayText !== 'string') {
            value = itemOrDisplayText?.value;
        } else {
            value = itemOrDisplayText;
        }

        if (value !== this.collectionChoiceSet.displayField.value) {
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.DISPLAY_FIELD, value, event.detail.error);
        }
    }

    /**
     * @param event value changed event coming from data type picker
     */
    handleDataTypeChanged(event: CustomEvent) {
        event.stopPropagation();
        const value = event.detail.value;

        // // Updating the property only if newValue !== oldValue
        if (value.dataType !== this.dataType) {
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.DATA_TYPE, value.dataType, event.detail.error);
            // Filtering entityFields based on selected dataType
            this.filterEntityFields();
            // Resetting picklistField to null and ensuring that it doesn't get hydrated yet.
            // todo: be sure this is needed in this use case
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.VALUE_FIELD, null, null, false);
        }
    }

    /**
     * @param event event comboboxstatechanged event coming from choice value field picker
     */
    handleValueFieldChanged(event: CustomEvent) {
        event.stopPropagation();

        const itemOrDisplayText = this.getItemOrDisplayText(event);
        let value: string | null = '';
        if (typeof itemOrDisplayText !== 'string') {
            value = itemOrDisplayText?.value;
        } else {
            value = itemOrDisplayText;
        }

        if (value !== this.collectionChoiceSet.valueField.value) {
            this.updateProperty(COLLECTION_CHOICE_SET_FIELDS.VALUE_FIELD, value, event.detail.error);
        }
    }

    /**
     * Does the update property action with passed in property name, value and error.
     *
     * @param propertyName to update
     * @param value to update with
     * @param error if any
     * @param doValidateProperty If false, doesn't validate the property on blur
     */
    updateProperty(propertyName: string, value: string | null, error: string | null, doValidateProperty = true) {
        const action = createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
            propertyName,
            value,
            error,
            doValidateProperty
        });
        this.collectionChoiceSet = collectionChoiceSetReducer(this.collectionChoiceSet, action);
    }

    get resourceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.collectionChoiceSetResourceLabel,
            LABELS.collectionChoiceSetResourcePlaceholder,

            this.collectionChoiceSet?.collectionReference?.error,
            false, // literalsAllowed
            true, // required
            false, // disabled
            '', // type
            true, // enableFieldDrilldown
            true // allowSObjectFields
        );
    }

    get resourceElementConfig() {
        return {
            allowsApexCollAnonymousAutoOutput: false,
            selectorConfig: {
                dataType: 'SObject',
                allowTraversal: true,
                isCollection: true
            }
        };
    }
}
