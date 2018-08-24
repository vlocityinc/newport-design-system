import { LightningElement, api, track } from "lwc";
import {
    PropertyChangedEvent,
    DeleteOutcomeEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction-events';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { LABELS } from './outcome-labels';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    CUSTOM_LOGIC: '.customLogic'
};

/**
 * Usage: <builder_platform_interaction-outcome></builder_platform_interaction-outcome>
 */
export default class Outcome extends LightningElement {
    @track element = {};
    @track outcomeConditions = [];

    @track conditionLogicValue;
    @track showCustomLogicInput = false;

    labels = LABELS;

    @track conditionLogicOptions = [
        {value: CONDITION_LOGIC.AND, label: this.labels.andConditionLogicLabel},
        {value: CONDITION_LOGIC.OR, label: this.labels.orConditionLogicLabel},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: this.labels.customConditionLogicLabel},
    ];

    @track
    showErrorMessageIfBlank = this.labels.cannotBeBlankError;

    get elementTypeForExpressionBuilder() {
        return ELEMENT_TYPE.DECISION;
    }

    @api get outcome() {
        return this.element;
    }

    @api showDelete;

    set outcome(outcome) {
        this.element = outcome;
        this.outcomeConditions = outcome.conditions;

        this.processConditionLogic(outcome.conditionLogic.value);
    }

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.template.querySelector(SELECTORS.LABEL_DESCRIPTION);
        labelDescription.focus();
    }

    get showDeleteCondition() {
        return this.outcomeConditions.length > 1;
    }

    get conditionsWithPrefixes() {
        return this.outcomeConditions.map((condition, i) => {
            return {
                prefix: this.getPrefix(i).toUpperCase(),
                condition
            };
        });
    }

    getPrefix(index) {
        // conditionLogic.value is either 'and' or 'or' or a custom logic string (e.g. '1 AND (2 or 3)'
        if (this.outcome.conditionLogic.value === CONDITION_LOGIC.AND || this.outcome.conditionLogic.value === CONDITION_LOGIC.OR) {
            return index > 0 ? this.outcome.conditionLogic.value : '';
        }
        // Convert to 1 based indexes
        return (index + 1).toString();
    }

    /**
     * @param {String} logicalOperator the logical operator we will use to build the custom logic
     * (should be either 'and' or 'or')
     * @return {string} Default logic string which is all conditions separate by AND or OR.
     * E.g. For three conditions and logicalOperator AND, '1 AND 2 AND 3' is returned
     */
    getDefaultCustomLogicStringForOutcome(logicalOperator) {
        logicalOperator = logicalOperator.toUpperCase();

        let customLogic = '1';
        for (let i = 2; i <= this.outcomeConditions.length; i++) {
            customLogic += ` ${logicalOperator} ${i}`;
        }

        return customLogic;
    }

    processConditionLogic(value) {
        this.conditionLogicValue = value;
        this.showCustomLogicInput = false;

        if (value !== CONDITION_LOGIC.AND && value !== CONDITION_LOGIC.OR) {
            // Select the custom logic option in the dropdown
            this.conditionLogicValue = CONDITION_LOGIC.CUSTOM_LOGIC;
            // And show the custom logic input
            this.showCustomLogicInput = true;
        }
    }

    /** After rendering the condition logic component we are setting the error
     * via setCustomValidity, except initial rendering.
     */
    renderedCallback() {
        if (this.element.conditionLogic) {
            const conditionLogicInput = this.template.querySelector(SELECTORS.CUSTOM_LOGIC);
            this.setInputErrorMessage(conditionLogicInput, this.element.conditionLogic.error);
        }
    }

    /** Sets the CustomValidity if there is a valid error message.
     * @param {Object} element - the input component
     * @param {Object} error - the error
     */
    setInputErrorMessage(element, error) {
        if (element) {
            if (error) {
                element.setCustomValidity(error);
            } else {
                element.setCustomValidity('');
            }
            element.showHelpMessageIfInvalid();
        }
    }

    /**
     * @param {object} event - Click Event to delete the outcome
     */
    handleDelete(event) {
        event.stopPropagation();

        const deleteOutcomeEvent = new DeleteOutcomeEvent(this.outcome.guid);
        this.dispatchEvent(deleteOutcomeEvent);
    }

    handleConditionLogicChange(event) {
        let newLogicValue = event.detail.value;
        if (newLogicValue === CONDITION_LOGIC.CUSTOM_LOGIC) {
            newLogicValue = this.getDefaultCustomLogicStringForOutcome(this.conditionLogicValue);
        }

        const propertyChangedEvent = new PropertyChangedEvent(
            'conditionLogic',
            newLogicValue, null, this.outcome.guid);
        this.dispatchEvent(propertyChangedEvent);
    }

    handleCustomLogicFocusOut(event) {
        const value = event.target.value;

        const propertyChangedEvent = new PropertyChangedEvent(
            'conditionLogic',
            value, null, this.outcome.guid);
        this.dispatchEvent(propertyChangedEvent);
    }

    /**
     * @param {object} event - AddListItemEvent to add a condition at the end of the list
     */
    handleAddCondition(event) {
        event.stopPropagation();

        const addConditionEvent = new AddConditionEvent(this.outcome.guid);

        this.dispatchEvent(addConditionEvent);
    }

    /**
     * @param {object} event - DeleteListItemEvent to delete a condition at the given index
     */
    handleDeleteCondition(event) {
        event.stopPropagation();

        const deleteConditionEvent = new DeleteConditionEvent(this.outcome.guid, event.detail.index);

        this.dispatchEvent(deleteConditionEvent);
    }

    /**
     * @param {object} event - UpdateListItemEvent to update a property value in the condition at the given index
     */
    handleUpdateCondition(event) {
        event.stopPropagation();

        const updateConditionEvent = new UpdateConditionEvent(this.outcome.guid,
            event.detail.index,
            event.detail.value,
            event.detail.error
        );

        this.dispatchEvent(updateConditionEvent);
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
