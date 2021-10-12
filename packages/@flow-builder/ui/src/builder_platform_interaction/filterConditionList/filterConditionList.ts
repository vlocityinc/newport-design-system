import { LightningElement, api, track } from 'lwc';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './filterConditionListLabels';
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { isSObjectOrApexClass, SObjectOrApexReference } from 'builder_platform_interaction/sortEditorLib';
import * as sobjectLib from 'builder_platform_interaction/sobjectLib';
import * as apexTypeLib from 'builder_platform_interaction/apexTypeLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { string } from 'yargs';
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

    @track
    _fields!: Object;

    /**
     * @param fields - filterable fields of the entity
     */
    set recordFields(fields: Object) {
        if (fields) {
            this._fields = [];
            const filterableFields = Object.values(fields).filter((field) => field.filterable);
            filterableFields.forEach((filterableField) => {
                this._fields[filterableField.apiName] = filterableField;
            });
        }
    }

    @api
    get recordFields(): any {
        return this._fields;
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
            this._fields = {};
            if (this._sObjectOrApexReference.isSObject) {
                // load sobject's fields
                sobjectLib.fetchFieldsForEntity(this._sObjectOrApexReference.value).then((fields) => {
                    this._fields = fields;
                });
            } else if (this._sObjectOrApexReference.isApexClass) {
                // load filterable apex attributes
                this._fields = apexTypeLib.getPropertiesForClass(this._sObjectOrApexReference.value);
            }
        }
    }
}
