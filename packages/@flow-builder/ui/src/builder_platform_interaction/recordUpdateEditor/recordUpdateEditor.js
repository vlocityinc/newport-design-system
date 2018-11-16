import { LightningElement, api, track } from 'lwc';
import { recordUpdateReducer } from "./recordUpdateReducer";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "./recordUpdateEditorLabels";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from "builder_platform_interaction/dataMutationLib";
import { NUMBER_RECORDS_TO_STORE } from "builder_platform_interaction/recordEditorLib";
import { ENTITY_TYPE, fetchFieldsForEntity, getUpdateableEntities } from "builder_platform_interaction/sobjectLib";
import { SUB_ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { format } from 'builder_platform_interaction/commonUtils';
import { getRulesForElementType, RULE_TYPES } from "builder_platform_interaction/ruleLib";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";

export default class RecordUpdateEditor extends LightningElement {
    labels = LABELS;

    @track
    state = {
        numberRecordsToStore: NUMBER_RECORDS_TO_STORE.FIRST_RECORD,
        recordUpdateElement: {},
        recordEntityName: '',
        entityFields: [],
    }

    rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.RECORD_UPDATE);

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.state.recordUpdateElement;
    }

    @api
    get node() {
        return this.state.recordUpdateElement;
    }

    set node(newValue) {
        this.state.recordUpdateElement = newValue;
        this.state.recordEntityName = getValueFromHydratedItem(this.state.recordUpdateElement.object);
        this.state.numberRecordsToStore = this.state.recordUpdateElement.numberRecordsToStore;
        this.updateFields();
    }

    /**
     * public api function to run the rules from record update validation library
     * @returns {Object[]} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
        return getErrorsFromHydratedElement(this.state.recordUpdateElement);
    }

    get filterElementType() {
        return SUB_ELEMENT_TYPE.RECORD_UPDATE_FILTER_ITEM;
    }

    get assignentFieldElementType() {
        return SUB_ELEMENT_TYPE.RECORD_UPDATE_ASSIGNMENT_FIELD;
    }

    get assignmentTitle() {
        return format(this.labels.setFieldValuesForTheRecordsFormat, this.resourceDisplayText);
    }

    get recordFieldsToFilter() {
        return Object.keys(this.state.entityFields).filter(key => this.state.entityFields[key].filterable).reduce((obj, key) => {
            obj[key] = this.state.entityFields[key];
            return obj;
          }, {});
    }

    get recordFieldsToUpdate() {
        return  Object.keys(this.state.entityFields).filter(key => this.state.entityFields[key].editable).reduce((obj, key) => {
            obj[key] = this.state.entityFields[key];
            return obj;
          }, {});
    }

    /**
     * Return true if the editor is in sObject mode.
     * In sObject mode record(s) to update are specified
     * with a given sObject or sObject collection with id field(s) populated
     * Otherwise records to update are specified using critera(s).
     */
    get isSObjectMode() {
        return getValueFromHydratedItem(this.state.numberRecordsToStore) === NUMBER_RECORDS_TO_STORE.FIRST_RECORD;
    }

    get inputReference() {
        if (this.state.recordUpdateElement.inputReference && getValueFromHydratedItem(this.state.recordUpdateElement.inputReference)) {
            return getValueFromHydratedItem(this.state.recordUpdateElement.inputReference);
        }
        return '';
    }

    get crudFilterType() {
        return ENTITY_TYPE.UPDATABLE;
    }

    get resourceDisplayText() {
        const entityToDisplay = getUpdateableEntities().find(entity => entity.apiName === this.state.recordEntityName);
        if (entityToDisplay) {
            return entityToDisplay.entityLabel;
        }
        return '';
    }

    /**
     * Returns the number of result stored.
     * If firstRecord then the user will be able to select a sObject variable
     * If allRecord then the user will be able to select a sObject Collection variable
     * @returns {String} This value can be 'firstRecord' or 'allRecords'
     */
    get numberRecordsToStoreValue() {
        return getValueFromHydratedItem(this.state.numberRecordsToStore);
    }

    /**
 * @returns {Object} config to pass to entity-resource-picker component
 */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object,
            this.labels.objectPlaceholder,
            this.state.recordUpdateElement.object.error,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
    * get the fields of the selected entity
    */
    updateFields() {
        this.state.entityFields = [];
        if (this.state.recordEntityName) {
            fetchFieldsForEntity(this.state.recordEntityName).then(fields => {
                this.state.entityFields = fields;
            });
        }
    }

    /**
     * @param {object} event - input reference changed event coming from sobject-or-sobject-collection-picker component
     */
    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
    }

    handleRecordStoreOptionChanged(event) {
        event.stopPropagation();
        this.updateProperty('numberRecordsToStore', event.detail.numberRecordsToStore, event.detail.error, false, getValueFromHydratedItem(this.state.numberRecordsToStore));
        this.state.recordEntityName = getValueFromHydratedItem(this.state.recordUpdateElement.object);
        this.state.numberRecordsToStore = this.state.recordUpdateElement.numberRecordsToStore;
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
        }
    }

    /**
     * @param {object} event - property changed event coming from label-description component or the list item changed events (add/update/delete)
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    handleRecordInputOutputAssignmentsChanged(event) {
        event.stopPropagation();
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, event);
    }

    handleFilterTypeChanged(event) {
        event.stopPropagation();
        this.updateProperty('filterType', event.detail.filterType, event.detail.error, false);
    }


    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.state.recordUpdateElement = recordUpdateReducer(this.state.recordUpdateElement, propChangedEvent);
    }
}