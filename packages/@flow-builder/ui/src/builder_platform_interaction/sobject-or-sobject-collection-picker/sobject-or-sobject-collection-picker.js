import { LightningElement, api, track } from "lwc";
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction-expression-utils';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { addCurlyBraces } from 'builder_platform_interaction-common-utils';
import {
    SObjectReferenceChangedEvent,
} from 'builder_platform_interaction-events';

/**
 * a combobox to retrieve a list of sobject and/or sobject collection variables of a specified entity or all if no entity
 */
export default class SObjectOrSObjectCollectionPicker extends LightningElement {
    @track
    state = {
        recordEntityName: '',
        value: '',
        isCollection: false,
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
    elementType;

    @api
    label;

    @api
    placeholder;

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
     * @param {Boolean} isCollection true if select from sObject collection variables
     */
    set isCollection(isCollection) {
        this.state.isCollection = isCollection;
    }

    @api
    get isCollection() {
        return this.state.isCollection;
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
            FLOW_DATA_TYPE.SOBJECT.value
        );
    }

    get sobjectVariableElementConfig() {
        return {elementType: this.elementType, isCollection: this.state.isCollection, entityName: this.state.recordEntityName, sObjectSelector: true};
    }

    /**
     * handle event when changing the sObject or sObject collection variable
     * @param {Object} event the comboboxstatechanged event
     */
    handleSObjectVariableChanged(event) {
        event.stopPropagation();
        const newValue = event.detail.item ? event.detail.item.value : event.detail.displayText;
        const sObjectReferenceChangedEvent = new SObjectReferenceChangedEvent(newValue, event.detail.error);
        this.dispatchEvent(sObjectReferenceChangedEvent);
    }
}