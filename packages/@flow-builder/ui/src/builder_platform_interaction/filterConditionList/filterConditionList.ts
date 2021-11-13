import { LightningElement, api, track } from 'lwc';
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
import { fetchFieldsForEntity } from 'builder_platform_interaction/sobjectLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
const { format } = commonUtils;

/**
 * Usage: <builder_platform_interaction-filter-condition-list></builder_platform_interaction-filter-condition-list>
 */
export default class FilterConditionList extends LightningElement {
    labels = LABELS;
    elementType = ELEMENT_TYPE.COLLECTION_PROCESSOR;

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
            value: CONDITION_LOGIC.FORMULA,
            label: this.labels.formulaOptionLabel
        }
    ];

    @api
    elementGuid;

    @api
    conditions = [];

    @api
    formula = '';

    @api
    collectionReferenceDisplayText = '';

    @track
    _conditionLogic;

    @track
    showFormulaEditor = false;

    set conditionLogic(value: Object) {
        this._conditionLogic = value;
        this.showFormulaEditor = false;
        if (this._conditionLogic && this._conditionLogic.value === CONDITION_LOGIC.FORMULA) {
            this.showFormulaEditor = true;
        }
    }

    @api
    get conditionLogic() {
        return this._conditionLogic;
    }

    _sObjectOrApexReference: SObjectOrApexReference = { value: null };

    /**
     * @param ref the record entity name or apex class name
     */
    set sobjectOrApexReference(ref: SObjectOrApexReference) {
        this._sObjectOrApexReference = ref;
        this.updateRecordFields();
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
            (this.conditionLogic !== CONDITION_LOGIC.AND &&
                this.conditionLogic !== CONDITION_LOGIC.OR &&
                this.conditionLogic !== CONDITION_LOGIC.FORMULA)
        );
    }

    get isSObjectOrApex() {
        return isSObjectOrApexClass(this._sObjectOrApexReference);
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

    @track recordFields;

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
        this.recordFields = {};
        if (this._sObjectOrApexReference.isSObject) {
            filterableFields = Object.values(fields).filter((field) => field.filterable);
        } else if (this._sObjectOrApexReference.isApexClass) {
            // filter compatiable data type should be same as sort compatiable
            filterableFields = Object.values(fields).filter(
                (prop) => !prop.isCollection && APEX_SORT_COMPATIBLE_TYPES.includes(prop.dataType)
            );
        }
        filterableFields.forEach((filterableField) => {
            this.recordFields[filterableField.apiName] = filterableField;
        });
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
        const _conditionsWithPrefixes = this.conditions
            ? getConditionsWithPrefixes(this.conditionLogic, this.conditions)
            : [];
        _conditionsWithPrefixes.forEach((element) => {
            element.lhsFormattedDisplayText = this.lhsFormattedDisplayText();
        });
        return _conditionsWithPrefixes;
    }

    lhsFormattedDisplayText() {
        return !isSObjectOrApexClass(this._sObjectOrApexReference)
            ? format(this.labels.primtiveLhsPlaceholder, this.collectionReferenceDisplayText)
            : null;
    }

    /**
     * Handle condition logic 'formula'
     *
     * @param event PropertyChangedEvent
     */
    handleConditionLogicChanged(event) {
        const newLogicValue = event.detail.value;
        this.showFormulaEditor = false;
        if (newLogicValue === CONDITION_LOGIC.FORMULA) {
            this.showFormulaEditor = true;
        }
    }

    /**
     * Handle formula expression update.
     *
     * @param event resourced text area value change event
     */
    handleFormulaChanged(event) {
        event.stopPropagation();
        const newFormula = event.detail.value;
        const updateFormulaEvent = new PropertyChangedEvent('formula', newFormula, null, this.parentGuid);
        this.dispatchEvent(updateFormulaEvent);
    }

    updateRecordFields() {
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
