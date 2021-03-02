import { LightningElement, api, track } from 'lwc';
import { ElementFilterConfig, getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { SOBJECT_OR_SOBJECT_COLLECTION_FILTER } from 'builder_platform_interaction/filterTypeLib';
import { CrudFilter } from 'builder_platform_interaction/selectors';

/**
 * a combobox to retrieve a list of sobject and/or sobject collection variables of a specified entity or all if no entity
 */
export default class SObjectOrSObjectCollectionPicker extends LightningElement {
    static SELECTOR = 'builder_platform_interaction-sobject-or-sobject-collection-picker';

    @track
    private state = {
        recordEntityName: '',
        value: '',
        sobjectCollectionCriterion: SOBJECT_OR_SOBJECT_COLLECTION_FILTER.SOBJECT,
        errorMessage: ''
    };

    @api
    get errorMessage() {
        return this.state.errorMessage;
    }

    set errorMessage(value: string) {
        this.state.errorMessage = value;
    }

    @api
    label?: string;

    @api
    placeholder?: string;

    @api
    disableFieldDrilldown = false;

    /**
     * Unique guid for the picker
     * @type {String}
     */
    @api
    rowIndex?: string;

    @api
    crudFilter?: CrudFilter;

    element: any = undefined;

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
     * Supports pill display?
     */
    @api
    isPillSupported = false;

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
    @api
    get sobjectVariableComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label,
            this.placeholder,
            this.state.errorMessage,
            false,
            true,
            false,
            FLOW_DATA_TYPE.SOBJECT.value,
            !this.disableFieldDrilldown, // enableFieldDrilldown
            false // allowSObjectFields
        );
    }

    get sobjectVariableElementConfig(): ElementFilterConfig {
        return {
            allowedParamTypes: {
                SObject: [
                    {
                        paramType: 'Data',
                        dataType: 'SObject',
                        canBeSobjectField: 'CannotBe',
                        canBeSystemVariable: 'CanBe',
                        canBeApexProperty: 'CanBe'
                    }
                ]
            },
            selectorConfig: {
                dataType: 'SObject',
                sobjectCollectionCriterion: this.sobjectCollectionCriterion,
                entityName: this.recordEntityName,
                crudFilter: this.crudFilter
            }
        };
    }

    /**
     * handle event when changing the sObject or sObject collection variable
     * @param {Object} event the comboboxstatechanged event
     */
    handleSObjectVariableChanged(event) {
        const newValue = event.detail.item ? event.detail.item.value : event.detail.displayText;

        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(newValue, event.detail.error);
        this.dispatchEvent(sObjectReferenceChangedEvent);
    }
}
