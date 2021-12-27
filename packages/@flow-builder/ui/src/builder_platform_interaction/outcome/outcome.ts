// @ts-nocheck
import { getConditionsWithPrefixes, showDeleteCondition } from 'builder_platform_interaction/conditionListUtils';
import { DeleteOutcomeEvent, ExecuteWhenOptionChangedEvent } from 'builder_platform_interaction/events';
import { CONDITION_LOGIC, ELEMENT_TYPE, FlowComparisonOperator } from 'builder_platform_interaction/flowMetadata';
import { getRulesForElementType, RULE_OPERATOR, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { api, LightningElement, track } from 'lwc';
import { EXECUTE_OUTCOME_WHEN_OPTION_VALUES, LABELS, outcomeExecuteWhenOptions } from './outcomeLabels';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    CUSTOM_LOGIC: '.customLogic'
};

/**
 * Usage: <builder_platform_interaction-outcome></builder_platform_interaction-outcome>
 */
export default class Outcome extends LightningElement {
    @track element = {};
    @track outcomeExecutionOption = EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;

    labels = LABELS;
    defaultOperator = RULE_OPERATOR.EQUAL_TO;

    @api get outcome() {
        return this.element;
    }

    @api showDelete;

    private disableRadioGroupIndicator = false;

    set outcome(outcome) {
        this.element = outcome;

        this.disableRadioGroupIndicator = this.hasConditionWithOperator(FlowComparisonOperator.IsChanged);

        this.outcomeExecutionOption =
            this.element.showOutcomeExecutionOptions && this.element.doesRequireRecordChangedToMeetCriteria
                ? EXECUTE_OUTCOME_WHEN_OPTION_VALUES.ONLY_WHEN_CHANGES_MEET_CONDITIONS
                : EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
    }

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION);
        labelDescription.focus();
    }

    @api shouldFocus;

    renderedCallback() {
        if (this.shouldFocus) {
            this.focus();
        }
    }

    conditionLogicOptions = [
        {
            value: CONDITION_LOGIC.AND,
            label: this.labels.andConditionLogicLabel
        },
        { value: CONDITION_LOGIC.OR, label: this.labels.orConditionLogicLabel },
        {
            value: CONDITION_LOGIC.CUSTOM_LOGIC,
            label: this.labels.customConditionLogicLabel
        }
    ];

    @track
    elementTypeForExpressionBuilder = ELEMENT_TYPE.DECISION;

    @track
    rulesForExpressionBuilder = getRulesForElementType(RULE_TYPES.COMPARISON, this.elementTypeForExpressionBuilder);

    /**
     * Helper method needed for conditions list
     *
     * @returns {boolean} if delete should be shown for each condition
     */
    get showDeleteCondition() {
        return this.element.conditions && showDeleteCondition(this.element.conditions);
    }

    /**
     * Return the conditions to be rendered edcorated with the correct prefixes
     *
     * @returns {Object[]} Array of all conditions decorated with prefix
     */
    get conditionsWithPrefixes() {
        return this.element.conditions
            ? getConditionsWithPrefixes(this.element.conditionLogic, this.element.conditions)
            : [];
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

    get showOutcomeExecutionOptions(): boolean {
        return this.element.showOutcomeExecutionOptions;
    }

    get disableRadioGroup(): boolean {
        return this.disableRadioGroupIndicator;
    }

    /**
     * @returns true iff a condition exists for the outcome
     */
    get showOutcomeExecutionOptionsSelector(): boolean {
        return this.element.conditions && this.element.conditions.length > 0;
    }

    get executeOutcomeWhenLabel() {
        return this.labels.executeOutcomeWhenLabel;
    }

    get outcomeExecuteWhenOptions() {
        return outcomeExecuteWhenOptions();
    }

    handleOutcomeExecutionOptionOnChange(event) {
        event.stopPropagation();
        this.outcomeExecutionOption = event.detail.value;
        this.dispatchExecuteWhenOptionChangedEvent();
    }

    handleIsChangedOperatorEvent(event) {
        if (event?.detail?.value?.operator?.value === FlowComparisonOperator.IsChanged) {
            this.outcomeExecutionOption = EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
            this.dispatchExecuteWhenOptionChangedEvent();
        }
    }

    dispatchExecuteWhenOptionChangedEvent() {
        const doesRequireRecordChangedToMeetCriteria =
            this.outcomeExecutionOption !== EXECUTE_OUTCOME_WHEN_OPTION_VALUES.EVERY_TIME_CONDITION_MET;
        const executeWhenEvent = new ExecuteWhenOptionChangedEvent(
            this.outcome.guid,
            doesRequireRecordChangedToMeetCriteria
        );
        this.dispatchEvent(executeWhenEvent);
    }

    /**
     * @param operator
     * @returns true if an operator is selected in the list of conditions
     *  Used to disable the radio group accordingly (W-8869340)
     */
    hasConditionWithOperator(operator: FlowComparisonOperator): boolean {
        const operators = [];
        if (this.element.conditions != null) {
            this.element.conditions.forEach((key) => {
                if (key.operator != null && key.operator.value != null) {
                    operators.push(key.operator.value);
                }
            });
        }
        return operators.includes(operator);
    }
}
