import { LightningElement, api, track } from 'lwc';
import { getConditionsWithPrefixes, showDeleteCondition } from "builder_platform_interaction/conditionListUtils";
import {
    DeleteOutcomeEvent
} from "builder_platform_interaction/events";
import { CONDITION_LOGIC, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { RULE_OPERATOR, RULE_TYPES, getRulesForElementType } from 'builder_platform_interaction/ruleLib';
import { LABELS } from "./outcomeLabels";

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    CUSTOM_LOGIC: '.customLogic'
};

/**
 * Usage: <builder_platform_interaction-outcome></builder_platform_interaction-outcome>
 */
export default class Outcome extends LightningElement {
    @track element = {};

    labels = LABELS;
    defaultOperator = RULE_OPERATOR.EQUAL_TO;

    @api get outcome() {
        return this.element;
    }

    @api showDelete;

    set outcome(outcome) {
        this.element = outcome;
    }

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION);
        labelDescription.focus();
    }

    conditionLogicOptions = [
        {value: CONDITION_LOGIC.AND, label: this.labels.andConditionLogicLabel},
        {value: CONDITION_LOGIC.OR, label: this.labels.orConditionLogicLabel},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: this.labels.customConditionLogicLabel},
    ];

    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.DECISION;

    @track
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementTypeForExpressionBuilder);

    /**
     * Helper method needed for conditions list
     * @return {boolean} if delete should be shown for each condition
     */
    get showDeleteCondition() {
        return this.element.conditions && showDeleteCondition(this.element.conditions);
    }

    /**
     * Return the conditions to be rendered edcorated with the correct prefixes
     * @return {Object[]} Array of all conditions decorated with prefix
     */
    get conditionsWithPrefixes() {
        return this.element.conditions ? getConditionsWithPrefixes(this.element.conditionLogic, this.element.conditions) : [];
    }

    /**
     * @param {object} event - Click Event to delete the outcome
     */
    handleDelete(event) {
        event.stopPropagation();

        const deleteOutcomeEvent = new DeleteOutcomeEvent(this.outcome.guid);
        this.dispatchEvent(deleteOutcomeEvent);
    }

    /**
     * @param {object} event - PropertyChangedEvent from label description
     */
    handlePropertyChanged(event) {
        // just decorate the event with the outcome guid and let it flow up
        // to be handled by the parent component
        event.detail.guid = this.outcome.guid;
    }
}
