import {Element, api, track} from 'engine';
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction-events';
import {CONDITION_LOGIC} from 'builder_platform_interaction-flow-metadata';
import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';

const SELECTORS = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description'
};

/**
 * Usage: <builder_platform_interaction-outcome></builder_platform_interaction-outcome>
 */
export default class Outcome extends Element {
    @track element = {};
    @track outcomeConditions = [];

    @track conditionLogicValue;
    @track showCustomLogicInput = false;

    // TODO: Localize labels after W-4693112
    @track conditionLogicOptions = [
        {value: CONDITION_LOGIC.AND, label: 'All conditions are met'},
        {value: CONDITION_LOGIC.OR, label: 'Any condition is met'},
        {value: CONDITION_LOGIC.CUSTOM_LOGIC, label: 'Custom logic'},
    ];

    // TODO: Import Localization Labels & getter for the component to use that.
    // https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004ftBbIAI/view
    @track
    showErrorMessageIfBlank = "Cannot be Blank.";

    get expressionBuilderElementType() {
        return ELEMENT_TYPE.DECISION;
    }

    @api get outcome() {
        return this.element;
    }

    @api set outcome(outcome) {
        this.element = outcome;
        this.outcomeConditions = outcome.conditions;

        this.processConditionLogic(outcome.conditionLogic.value);
    }

    /** Focus the label field of the label description component */
    @api focus() {
        const labelDescription = this.root.querySelector(SELECTORS.LABEL_DESCRIPTION);
        labelDescription.focus();
    }

    get showDelete() {
        return this.outcomeConditions.length > 1;
    }

    get conditionsWithPrefixes() {
        return this.outcomeConditions.map((condition, i) => {
            return {
                // TODO: This should come from a label - https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004rhg0IAA/view
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
        event.guid = this.outcome.guid;
    }
}
