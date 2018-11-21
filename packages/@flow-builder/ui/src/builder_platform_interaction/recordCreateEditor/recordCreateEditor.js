import { LightningElement, api, track } from 'lwc';
import { recordCreateReducer } from "./recordCreateReducer";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "./recordCreateEditorLabels";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from "builder_platform_interaction/recordEditorLib";
import { getRulesForElementType, RULE_TYPES, PARAM_PROPERTY } from "builder_platform_interaction/ruleLib";
import { ENTITY_TYPE, fetchFieldsForEntity, getCreateableEntities } from "builder_platform_interaction/sobjectLib";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { format } from 'builder_platform_interaction/commonUtils';
import { PropertyChangedEvent } from "builder_platform_interaction/events";

export default class RecordCreateEditor extends LightningElement {
    labels = LABELS;

    rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.RECORD_CREATE);

    /**
     * Internal state for the editor
     */
    @track
    state = {
        recordCreateElement: {},
        recordEntityName: '',
        entityFields: {},
        wayToStoreFields: '',
        resourceDisplayText: ''
    }

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.node;
    }

    @api
    get node() {
        return this.state.recordCreateElement;
    }

    set node(newValue) {
        this.state.recordCreateElement = newValue;
        this.state.recordEntityName = this.objectValue;
        this.state.wayToStoreFields = this.state.recordCreateElement.object.value === '' ? WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE : WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES;
        this.updateFields();
        this.resourceDisplayText();
    }

    /**
     * public api function to run the rules from record create validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL, wayToStoreFields: this.state.wayToStoreFields };
        this.state.recordCreateElement = recordCreateReducer(this.state.recordCreateElement, event);
        return getErrorsFromHydratedElement(this.state.recordCreateElement);
    }

    /**
     * Returns the number of result stored.
     * If firstRecord then the user will be able to select a sObject variable
     * If allRecord then the user will be able to select a sObject Collection variable
     * @returns {String} This value can be 'firstRecord' or 'allRecords'
     */
    get numberRecordsToStoreValue() {
        return this.state.recordCreateElement.numberRecordsToStore;
    }

    get objectValue() {
        return getValueFromHydratedItem(this.state.recordCreateElement.object);
    }

    get wayToStoreFieldsValue() {
        return this.state.wayToStoreFields;
    }

    get isSObjectMode() {
        return (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.FIRST_RECORD && this.state.wayToStoreFields === WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE)
        || (this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
    }

    get isCollection() {
        return this.numberRecordsToStoreValue === NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
    }

    get inputReference() {
        if (this.state.recordCreateElement.inputReference && this.state.recordCreateElement.inputReference.value) {
            return this.state.recordCreateElement.inputReference.value;
        }
        return '';
    }

    get inputReferenceError() {
        return this.state.recordCreateElement.inputReference.error;
    }

    get assignNullValuesIfNoRecordsFound() {
        return this.state.recordCreateElement.assignNullValuesIfNoRecordsFound;
    }

    get sObjectVariablePickerPlaceholder() {
        return !this.isCollection ? this.labels.sObjectVariablePlaceholder : this.labels.sObjectCollectionVariablePlaceholder;
    }

    get sObjectVariablePickerLabel() {
        return !this.isCollection ? this.labels.recordVariable : this.labels.recordCollectionVariable;
    }

    get assignmentTitle() {
        return format(this.labels.createAssignmentTitleFormat, this.state.resourceDisplayText);
    }

    get storeNewIdTitle() {
        return format(this.labels.storeIdInVariableFormat, this.state.resourceDisplayText);
    }

    get crudFilterType() {
        return ENTITY_TYPE.CREATABLE;
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object, // Label
            this.labels.objectPlaceholder, // Placeholder
            this.state.recordCreateElement.object.error, // errorMessage
            false, // literalsAllowed
            true, // required
            false, // disabled
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    get recordFieldsToCreate() {
        return  Object.keys(this.state.entityFields).filter(key => this.state.entityFields[key].creatable).reduce((obj, key) => {
            obj[key] = this.state.entityFields[key];
            return obj;
          }, {});
    }

    /**
     * get the fields of the selected entity
     */
     updateFields() {
         this.state.entityFields = {};
         if (this.state.recordEntityName) {
             fetchFieldsForEntity(this.state.recordEntityName).then(fields => {
                this.state.entityFields = fields;
             }).catch(() => {
                 // fetchFieldsForEntity displays an error message
             });
         }
     }

     resourceDisplayText() {
         const entityToDisplay = getCreateableEntities().find(entity => entity.apiName === this.state.recordEntityName);
         if (entityToDisplay) {
             this.state.resourceDisplayText = entityToDisplay.entityLabel;
         }
         return '';
     }

    get elementParam() {
        return {
            [PARAM_PROPERTY.DATA_TYPE]: FLOW_DATA_TYPE.STRING.value,
            [PARAM_PROPERTY.IS_COLLECTION]: false,
            [PARAM_PROPERTY.ELEMENT_TYPE]: this.state.recordCreateElement.elementType,
        };
    }

    get variableComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.variable, // Label
            this.labels.variablePlaceholder, // Placeholder
            '', // errorMessage not used in the output-resource-picker, error message is passed as parameter
            true, // literalsAllowed
            false, // required
            false, // disabled
            FLOW_DATA_TYPE.STRING.value
        );
    }

    get assignRecordIDValue() {
        return getValueFromHydratedItem(this.state.recordCreateElement.assignRecordIdToReference);
    }

    get assignRecordIDError() {
        return this.state.recordCreateElement.assignRecordIdToReference.error;
    }

    get sObjectAltText() {
        return this.isCollection ? this.labels.helpSObjectCollAltText : this.labels.helpSObjectAltText;
    }

    handleRecordStoreOptionChangedEvent(event) {
        event.stopPropagation();
        let numberRecordsToStoreOldValue = this.numberRecordsToStoreValue;
        // if the wayToStoreFields changed then we need to force the reset recordCreate in the reducer
        if (this.state.wayToStoreFields !== event.detail.wayToStoreFields) {
            numberRecordsToStoreOldValue = '';
            this.state.wayToStoreFields = event.detail.wayToStoreFields;
        }
        this.updateProperty('numberRecordsToStore', event.detail.numberRecordsToStore, event.detail.error, false, numberRecordsToStoreOldValue);
        this.state.recordEntityName = this.objectValue;
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleLabelDescriptionChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty(event.detail.propertyName, event.detail.value, event.detail.error, false);
    }

    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error, false);
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const oldRecordEntityName = this.state.recordEntityName;
        const newRecordEntityName = event.detail.item ? event.detail.item.value : '';

        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, event.detail.error, false, oldRecordEntityName);
            this.state.recordEntityName = newRecordEntityName;
            this.updateFields();
            this.resourceDisplayText();
        }
    }

    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordCreateElement = recordCreateReducer(this.state.recordCreateElement, event);
    }

    handleAssignRecordIdToReferenceEvent(event) {
        event.stopPropagation();
        const itemOrDisplayText = event.detail.item ? event.detail.item.displayText : event.detail.displayText;
        this.updateProperty('assignRecordIdToReference', itemOrDisplayText, event.detail.error, false);
    }

    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.state.recordCreateElement = recordCreateReducer(this.state.recordCreateElement, propChangedEvent);
    }
}