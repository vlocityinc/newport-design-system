// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { recordDeleteReducer } from './recordDeleteReducer';
import { LABELS } from './recordDeleteEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';
import { ENTITY_TYPE, fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';

/**
 * Record Delete Editor class
 */
export default class RecordDeleteEditor extends LightningElement {
    labels = LABELS;

    @track
    state = {
        recordDeleteElement: {},
        entityFields: {}
    };

    /**
     * CRUD filter in place nothing but "DELETABLE" entities allowed
     */
    crudFilterType = ENTITY_TYPE.DELETABLE;

    /**
     * element type of the current editor
     */
    elementType = ELEMENT_TYPE.RECORD_DELETE;

    sobjectCollectionCriterion = SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT_OR_SOBJECT_COLLECTION;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    @api
    editorParams;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    /**
     * API function to return the node
     * @returns {object} node - current node
     */
    @api getNode() {
        return this.state.recordDeleteElement;
    }

    /**
     * @returns {object} current node
     */
    @api
    get node() {
        return this.state.recordDeleteElement;
    }

    /**
     * Passing current element (node) to the editor
     * @param {object} newValue - element (node) to load
     */
    set node(newValue) {
        this.state.recordDeleteElement = newValue;
        this.updateFields();
    }

    /**
     * @returns {string} storing options in place
     */
    get numberRecordsToStoreValue() {
        return this.state.recordDeleteElement.useSobject
            ? NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            : NUMBER_RECORDS_TO_STORE.ALL_RECORDS;
    }

    /**
     * @returns {object} entity fields
     */
    get recordFieldsToFilter() {
        return this.state.entityFields;
    }

    /**
     * set the entity name (object) and load fields accordingly
     * @param {string} newValue - new entity name
     */
    set recordEntityName(newValue) {
        this.state.recordDeleteElement.object.value = newValue;
        this.updateFields();
    }

    /**
     * @returns {string} entity name (object)
     */
    get recordEntityName() {
        return this.state.recordDeleteElement.object.value;
    }

    /**
     * @returns {boolean} true if the editor is in sObject mode.
     * In sObject mode record(s) to delete are specified
     * with a given sObject or sObject collection with id field(s) populated
     * Otherwise record(s) to delete are specified using criteria
     */
    get isSObjectMode() {
        return this.state.recordDeleteElement.useSobject;
    }

    /**
     * @returns {string} record delete element 'inputReference' property value
     */
    get inputReferenceValue() {
        return this.state.recordDeleteElement.inputReference.value;
    }

    /**
     * @returns {Object} config to pass to entity-resource-picker component
     */
    get entityComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.labels.object,
            this.labels.objectPlaceholder,
            this.state.recordDeleteElement.object.error,
            false, // literalsAllowed?
            true, // required?
            false, // disabled?
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    /**
     * get the fields of the selected entity and set the state accordingly
     */
    updateFields() {
        this.state.entityFields = {};
        if (this.recordEntityName) {
            fetchFieldsForEntity(this.recordEntityName)
                .then(fields => {
                    this.state.entityFields = fields;
                })
                .catch(() => {
                    // fetchFieldsForEntity displays an error message
                });
        }
    }

    /**
     * update a property (set the state accordingly based on appropriate reducer)
     * @param {string} propertyName - property name about to change
     * @param {string} newValue - new property value
     * @param {error} error - error if any empty string otherwise
     * @param {boolean} ignoreValidate - ignore specific validation for the property
     * @param {string} oldValue - old value
     */
    updateProperty(propertyName, newValue, error, ignoreValidate, oldValue) {
        const propChangedEvent = new PropertyChangedEvent(propertyName, newValue, error, null, oldValue);
        propChangedEvent.detail.ignoreValidate = ignoreValidate;
        this.state.recordDeleteElement = recordDeleteReducer(this.state.recordDeleteElement, propChangedEvent);
    }

    /**
     * public API function to run the rules from record delete validation library
     * @returns {Object[]} list of errors
     */
    @api
    validate() {
        this.state.recordDeleteElement = recordDeleteReducer(this.state.recordDeleteElement, {
            type: VALIDATE_ALL,
            isSObjectMode: this.isSObjectMode
        });
        return getErrorsFromHydratedElement(this.state.recordDeleteElement);
    }

    /**
     * handler for "inputReference" element property changes
     * @param {object} event
     */
    handleInputReferenceChangedEvent(event) {
        event.stopPropagation();
        this.updateProperty('inputReference', event.detail.value, event.detail.error);
    }

    /**
     * handler for "numberRecordsToStore" changes
     * @param {object} event
     */
    handleRecordStoreOptionChanged(event) {
        event.stopPropagation();
        this.state.recordDeleteElement = recordDeleteReducer(this.state.recordDeleteElement, event);
    }

    /**
     * @param {object} event - comboboxstatechanged event from entity-resource-picker component. The property name depends on the record node
     */
    handleResourceChanged(event) {
        event.stopPropagation();
        const oldRecordEntityName = this.recordEntityName;
        const newRecordEntityName = (event.detail.item && event.detail.item.value) || '';

        if (newRecordEntityName !== oldRecordEntityName) {
            this.updateProperty('object', newRecordEntityName, event.detail.error, false, oldRecordEntityName);
            this.recordEntityName = newRecordEntityName;
        }
    }

    /**
     * handler for any changes related to filters elements properties
     * @param {object} event
     */
    handlePropertyOrListItemChanged(event) {
        event.stopPropagation();
        this.state.recordDeleteElement = recordDeleteReducer(this.state.recordDeleteElement, event);
    }
}
