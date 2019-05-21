import { LightningElement, api, track } from 'lwc';
import { LABELS } from "./recordSobjectAndQueryFieldsLabels";
import { format } from "builder_platform_interaction/commonUtils";

export default class RecordSobjectAndQueryFields extends LightningElement {
    labels = LABELS;

    @track
    state = {
        recordEntityName: '',
        outputReference: '',
        queriedFields: [],
        isCollection: false,
    };

    /**
     * sObject variable error message if any
     */
    @api
    sobjectVariableErrorMessage;

    @api
    elementType;

    @api
    resourceDisplayText;

    /**
     * Unique guid for the output reference picker
     * @type {String}
     */
    @api
    outputReferenceIndex;

    /**
     * @type {Boolean} true means the component is use in the advanced option panel.
     */
    @api
    isDisplayedInAutomaticOutputAdvancedMode;

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
     * @param {String} value the output reference (the selected sObject or sObject collection variable)
     */
    set outputReference(value) {
        this.state.outputReference = value;
    }

    @api
    get outputReference() {
        return this.state.outputReference;
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
     * @param {String[]} fields the selected fields
     */
    set queriedFields(fields) {
        this.state.queriedFields = fields;
    }

    @api
    get queriedFields() {
        return this.state.queriedFields;
    }

    get topDivCss() {
        return this.isDisplayedInAutomaticOutputAdvancedMode ? "" : "slds-m-bottom_small slds-border_top";
    }

    get sObjectTypeSelectionDivCss() {
        return this.isDisplayedInAutomaticOutputAdvancedMode ? "slds-form-element slds-size_1-of-2 slds-m-bottom_small" : "slds-p-horizontal_small slds-form-element slds-size_1-of-2 slds-m-bottom_small";
    }

    get titleCss() {
        return this.isDisplayedInAutomaticOutputAdvancedMode ? "slds-text-heading_x-small slds-p-top_small " : "slds-text-heading_small slds-p-around_small";
    }

    get sObjectVariablePickerTitle() {
        return !this.state.isCollection ? format(this.labels.selectVariableToStore, this.resourceDisplayText) : format(this.labels.selectVariableToStoreRecords, this.resourceDisplayText);
    }

    get sObjectVariablePickerLabel() {
        return !this.isCollection ? this.labels.recordVariable : this.labels.recordCollectionVariable;
    }

    get sObjectVariablePickerPlaceholder() {
        return !this.state.isCollection ? this.labels.sObjectVariablePlaceholder : this.labels.sObjectCollectionVariablePlaceholder;
    }

    get selectFieldsLabel() {
        return format(this.labels.selectFields, this.resourceDisplayText);
    }
    /**
     * menu data for disabled Id combobox
     */
    get idMenuData() {
        return [this.idComboboxValue];
    }

    /**
     * Id value for Id combobox
     */
    get idComboboxValue() {
        return {type : 'option-inline', text: 'ID', value: 'Id', displayText: 'ID'};
    }
}