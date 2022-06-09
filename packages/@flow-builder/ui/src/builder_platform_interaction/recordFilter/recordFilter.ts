// @ts-nocheck
import { getConditionsWithPrefixes } from 'builder_platform_interaction/conditionListUtils';
import {
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    PropertyChangedEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getRulesForElementType, RULE_OPERATOR, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { getEntity } from 'builder_platform_interaction/sobjectLib';
import { api, LightningElement, track } from 'lwc';
import { criteriaLabels, filterLogicOptionsLabels, LABELS, WARNING_LABELS } from './recordFilterLabels';
const { format } = commonUtils;

const VARIANT_START = 'startElement';

export default class RecordFilter extends LightningElement {
    defaultOperator = RULE_OPERATOR.EQUAL_TO;
    labels = LABELS;
    showPrefixValue = false;
    showWarning: boolean | undefined;
    options;

    @api
    filterLogic = { value: CONDITION_LOGIC.AND, error: null };

    @track items = [];

    @track entityFields = [];

    @track entityName = '';

    @track _rules;

    @api
    elementType;

    @api
    disableConditionLogicPicker;

    @api
    hideNewResource = false;

    @api
    hideSystemVariables = false;

    @api
    hideGlobalVariables = false;

    @api
    hideTitle = false;

    @api
    variant;

    @api
    elementGuid;

    @api
    isSingular: boolean | undefined;

    @api
    title: string | undefined;

    @api
    updateRules() {
        this._rules = this.elementType ? getRulesForElementType(RULE_TYPES.COMPARISON, this.elementType) : undefined;
    }

    get rules() {
        return this._rules;
    }

    /**
     * The filter items
     *
     * @param {Object} value - it comes from the recordNode.filters
     */
    set filterItems(value) {
        this.items = value;
    }

    @api
    get filterItems() {
        return this.items;
    }

    /**
     * @param {string} entityName the selected record object
     */
    set recordEntityName(entityName) {
        this.entityName = entityName;
    }

    @api
    get recordEntityName() {
        return this.entityName;
    }
    /**
     * @param {Object} fields - Filterable fields of the entity
     */
    set recordFields(fields) {
        if (fields) {
            this.entityFields = {};
            const filterableFields = Object.values(fields).filter((field) => field.filterable);
            filterableFields.forEach((filterableField) => {
                this.entityFields[filterableField.apiName] = filterableField;
            });
        }
    }

    @api
    get recordFields() {
        return this.entityFields;
    }

    set showPrefix(value) {
        this.showPrefixValue = value;
    }

    @api
    get showPrefix() {
        return (
            this.showPrefixValue ||
            (this.filterLogic.value !== CONDITION_LOGIC.AND &&
                this.filterLogic.value !== CONDITION_LOGIC.OR &&
                this.filterLogic.value !== CONDITION_LOGIC.NO_CONDITIONS)
        );
    }

    /**
     * Return the conditions to be rendered edcorated with the correct prefixes
     *
     * @returns {Object[]} Array of all conditions decorated with prefix
     */
    get conditionsWithPrefixes() {
        return this.items ? getConditionsWithPrefixes(this.filterLogic, this.items) : [];
    }

    get containerClasses() {
        return this.variant === VARIANT_START ? 'slds-m-bottom_small' : 'slds-m-bottom_small slds-border_top';
    }

    set filterLogicOptions(options) {
        this.options = options;
    }

    @api
    get filterLogicOptions() {
        return this.options ?? filterLogicOptionsLabels(this.elementType, this.entityLabelPlural, this.entityLabel);
    }

    get showDeleteFilter() {
        return this.filterItems.length > 1;
    }

    get showTitle() {
        return !this.hideTitle;
    }

    get filterLabel() {
        return criteriaLabels(this.elementType, this.isSingular);
    }

    get warningLabel() {
        return WARNING_LABELS[this.elementType];
    }

    /**
     * @returns {string} entity label if any  found for current selected entity empty string otherwise
     */
    get entityLabelPlural() {
        if (this.recordEntityName) {
            const entityToDisplay = getEntity(this.recordEntityName);
            return entityToDisplay ? entityToDisplay.entityLabelPlural : '';
        }
        return '';
    }

    /**
     * @returns {string} entity label if any  found for current selected entity empty string otherwise
     */
    get entityLabel() {
        if (this.recordEntityName) {
            const entityToDisplay = getEntity(this.recordEntityName);
            return entityToDisplay ? entityToDisplay.entityLabel : '';
        }
        return '';
    }

    set showWarningMessage(show: boolean) {
        this.showWarning = show;
    }

    @api
    get showWarningMessage(): boolean {
        if (this.filterLogic.value === CONDITION_LOGIC.NO_CONDITIONS) {
            if (this.showWarning === undefined) {
                return this.elementType === ELEMENT_TYPE.RECORD_LOOKUP;
            }
            return this.showWarning;
        }
        return false;
    }

    get filterRecordsTitle() {
        return this.title ?? format(this.labels.findRecords, this.entityLabel);
    }

    @api
    hideRecordSystemVariable = false;

    /**
     * handle event when adding the new filter
     *
     * @param {Object} event the add filter event
     */
    handleAddFilter(event) {
        event.stopPropagation();
        const addRecordFilterEvent = new AddRecordFilterEvent();
        this.dispatchEvent(addRecordFilterEvent);
    }

    /**
     * handle event when updating the filter
     *
     * @param {Object} event the update filter event
     */
    handleUpdateFilter(event) {
        event.stopPropagation();
        const updateRecordFilterEvent = new UpdateRecordFilterEvent(
            event.detail.index,
            event.detail.value,
            event.detail.error
        );
        this.dispatchEvent(updateRecordFilterEvent);
    }

    /**
     * handle event when deleting the filter
     *
     * @param {Object} event the delete filter event
     */
    handleDeleteFilter(event) {
        event.stopPropagation();
        const deleteRecordFilterEvent = new DeleteRecordFilterEvent(event.detail.index);
        this.dispatchEvent(deleteRecordFilterEvent);
    }

    /**
     * Handle event when the logic is changed.
     *
     * @param {object} event - PropertyChangedEvent from label description
     */
    handlePropertyChanged(event) {
        event.stopPropagation();
        const propertyChangedEvent = new PropertyChangedEvent('filterLogic', event.detail.value);
        this.dispatchEvent(propertyChangedEvent);
    }

    connectedCallback() {
        this.updateRules();
    }
}
