import { LightningElement, api, track } from 'lwc';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';

/**
 * a combobox to retrieve a list of sobject and/or sobject collection variables of a specified entity or all if no entity
 */
export default class SObjectOrSObjectCollectionPicker extends LightningElement {
    @track
    state = {
        recordEntityName: '',
        value: '',
        sobjectCollectionCriterion:
            SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT,
        errorMessage: ''
    };

    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value) {
        this.state.errorMessage = value;
    }

    @api
    label;

    @api
    placeholder;

    /**
     * Unique guid for the picker
     * @type {String}
     */
    @api
    rowIndex;

    @api
    createable;

    @api
    updateable;

    @api
    deleteable;

    @api
    queryable;

    element = undefined;

    /**
     * @param {String} entityName the selected entity name (from select object combobox)
     */
    set recordEntityName(entityName) {
        this.state.recordEntityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.state.recordEntityName;
    }

    /**
     * @param {String} sobjectCollectionCriterion one of SOBJECT, SOBJECT_COLLECTION, SOBJECT_OR_SOBJECT_COLLECTION
     */
    set sobjectCollectionCriterion(sobjectCollectionCriterion) {
        this.state.sobjectCollectionCriterion = sobjectCollectionCriterion;
    }

    @api
    get sobjectCollectionCriterion() {
        return this.state.sobjectCollectionCriterion;
    }

    /**
     * @param {String} value the selected sObject or sObject collection variable
     */
    set value(value) {
        this.state.value = value;
        this.element = getResourceByUniqueIdentifier(this.state.value);
    }

    @api
    get value() {
        return this.state.value;
    }

    /**
     * @returns {Object|String} the value of the combobox (item or displayText)
     */
    get sobjectVariableItemOrDisplayText() {
        if (this.element) {
            return {
                text: this.element.name,
                displayText: addCurlyBraces(this.element.name),
                value: this.state.value
            };
        }
        return this.state.value;
    }

    /**
     * create the combobox config
     */
    get sobjectVariableComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label,
            this.placeholder,
            this.state.errorMessage,
            'false',
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value,
            true, // enableFieldDrilldown
            false // allowSObjectFields
        );
    }

    get sobjectVariableElementConfig() {
        return {
            allowedParamTypes: {
                SObject: [
                    {
                        paramType: 'Data',
                        dataType: this.state.recordEntityName
                            ? this.state.recordEntityName
                            : 'SObject',
                        canBeSobjectField: 'CannotBe',
                        canBeSystemVariable: 'CanBe',
                        canBeApexProperty: 'CanBe'
                    }
                ]
            },
            sObjectSelectorConfig: {
                sobjectCollectionCriterion: this.state
                    .sobjectCollectionCriterion,
                entityName: this.state.recordEntityName,
                createable: this.createable,
                updateable: this.updateable,
                queryable: this.queryable,
                deleteable: this.deleteable
            }
        };
    }

    /**
     * handle event when changing the sObject or sObject collection variable
     * @param {Object} event the comboboxstatechanged event
     */
    handleSObjectVariableChanged(event) {
        const newValue = event.detail.item
            ? event.detail.item.value
            : event.detail.displayText;

        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(
            newValue,
            event.detail.error
        );
        this.dispatchEvent(sObjectReferenceChangedEvent);
    }
}
