/* eslint-disable lwc-core/no-inline-disable */
import { LightningElement, api } from 'lwc';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './filterConditionListLabels';
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import {
    APEX_SORT_COMPATIBLE_TYPES,
    isSObjectOrApexClass,
    SObjectOrApexReference
} from 'builder_platform_interaction/sortEditorLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
const { format } = commonUtils;

/**
 * Usage: <builder_platform_interaction-filter-condition-list></builder_platform_interaction-filter-condition-list>
 */
export default class FilterConditionList extends LightningElement {
    labels = LABELS;
    elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;
    conditionLogicFormula = 'formula_evaluates_to_true';

    conditionLogicOptions = [
        {
            value: CONDITION_LOGIC.AND,
            label: this.labels.andConditionLogicLabel
        },
        {
            value: CONDITION_LOGIC.OR,
            label: this.labels.orConditionLogicLabel
        },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: this.labels.customLogicLabel
        },
        {
            value: this.conditionLogicFormula,
            label: this.labels.formulaOptionLabel
        }
    ];

    @api
    elementGuid;

    @api
    conditions = [];

    @api
    formulaExpression;

    @api
    collectionReferenceDisplayText = '';

    @api conditionLogic;

    _sObjectOrApexReference: SObjectOrApexReference = { value: null };

    /**
     * @param ref the record entity name or apex class name
     */
    set sobjectOrApexReference(ref: SObjectOrApexReference) {
        this._sObjectOrApexReference = ref;
    }

    @api
    get sobjectOrApexReference(): SObjectOrApexReference {
        return this._sObjectOrApexReference;
    }

    _showPrefixValue = false;

    set showPrefix(value) {
        this._showPrefixValue = value;
    }

    @api
    get showPrefix() {
        return (
            this._showPrefixValue ||
            (this.conditionLogic !== CONDITION_LOGIC.AND && this.conditionLogic !== CONDITION_LOGIC.OR)
        );
    }

    /**
     * @returns true if selected condition logic is 'formula evaluates to true'.
     */
    get isFormulaFilter() {
        return this.conditionLogic === this.conditionLogicFormula;
    }

    get showConditionsBuilderForSObjectOrApex() {
        return isSObjectOrApexClass(this._sObjectOrApexReference) && !this.isFormulaFilter;
    }

    get showConditionsBuilderForPrimitive() {
        return !isSObjectOrApexClass(this._sObjectOrApexReference) && !this.isFormulaFilter;
    }

    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementType);

    /**
     * Helper method needed for conditions list
     *
     * @returns whether or not to display delete button
     */
    get showDeleteCondition(): boolean {
        return this.conditions && showDeleteCondition(this.conditions);
    }

    _filterableRecordFields = {};
    /**
     * Populate filterable fields or apex properties in lhs of condition builder
     *
     * @param fields all fields or properties
     */
    populateRecordFields(fields: Object) {
        if (!fields || !isSObjectOrApexClass(this._sObjectOrApexReference)) {
            return;
        }
        let filterableFields;
        this._filterableRecordFields = {};
        if (this._sObjectOrApexReference.isSObject) {
            filterableFields = Object.values(fields).filter((field) => field.filterable);
        } else if (this._sObjectOrApexReference.isApexClass) {
            // filter compatiable data type should be same as sort compatiable
            filterableFields = Object.values(fields).filter(
                (prop) => !prop.isCollection && APEX_SORT_COMPATIBLE_TYPES.includes(prop.dataType)
            );
        }
        filterableFields.forEach((filterableField) => {
            this._filterableRecordFields[filterableField.apiName] = filterableField;
        });
    }

    @api
    get recordFields() {
        return this._filterableRecordFields;
    }

    set recordFields(fields: Object) {
        this.populateRecordFields(fields);
    }

    get lhsWritable() {
        return isSObjectOrApexClass(this._sObjectOrApexReference);
    }

    /**
     * Return the conditions to be rendered decorated with the correct prefixes
     *
     * @returns array of all conditions decorated with prefix
     */
    get conditionsWithPrefixes() {
        return this.conditions ? getConditionsWithPrefixes(this.conditionLogic, this.conditions) : [];
    }

    get lhsPlaceholderText() {
        return !isSObjectOrApexClass ?? format(this.labels.primtiveLhsPlaceholder, this.collectionReferenceDisplayText);
    }

    /**
     * Hanlde condition logic 'formula'
     *
     * @param event PropertyChangedEvent
     */
    handleConditionLogicChange(event) {
        const newLogicValue = event.detail.value;
        if (newLogicValue === this.conditionLogicFormula) {
            event.stopPropagation();
            // need to hanlde the event when adding formula option
        } else {
            const propertyChangedEvent = new PropertyChangedEvent(
                'conditionLogic',
                newLogicValue,
                null,
                this.parentGuid
            );
            this.dispatchEvent(propertyChangedEvent);
        }
    }

    connectedCallback() {
        if (this._sObjectOrApexReference && this._sObjectOrApexReference.value) {
            if (this._sObjectOrApexReference.isSObject) {
                // load sobject's fields
                fetchFieldsForEntity(this._sObjectOrApexReference.value)
                    .then((fields) => {
                        this.populateRecordFields(fields);
                    })
                    .catch(() => {
                        // fetchFieldsForEntity displays an error message
                    });
            } else if (this._sObjectOrApexReference.isApexClass) {
                // load filterable apex attributes
                const props = apexTypeLib.getPropertiesForClass(this._sObjectOrApexReference.value);
                this.populateRecordFields(props);
            }
        }
    }
}
