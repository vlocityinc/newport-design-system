import {Element, api, track} from 'engine';
import {AddConditionEvent, DeleteConditionEvent, UpdateConditionEvent} from 'builder_platform_interaction-events';
import {CONDITION_LOGIC} from 'builder_platform_interaction-flow-metadata';
import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';

/**
 * Usage: <builder_platform_interaction-outcome></builder_platform_interaction-outcome>
 */
export default class Outcome extends Element {
    @track element = {};
    @track
    outcomeConditions = [];

    get expressionBuilderElementType() {
        return ELEMENT_TYPE.DECISION;
    }

    @api get outcome() {
        return this.element;
    }

    @api set outcome(outcome) {
        this.element = outcome;
        this.outcomeConditions = outcome.conditions;
    }

    get showDelete() {
        return this.outcomeConditions.length > 1;
    }

    get conditions() {
        return this.outcomeConditions.map((condition, i) => {
            return {
                // TODO: This should come from a label - https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000004rhg0IAA/view
                prefix: this.getPrefix(i).toUpperCase(),
                condition
            };
        });
    }

    getPrefix(index) {
        if (this.outcome.conditionLogic.value === CONDITION_LOGIC.AND || this.outcome.conditionLogic.value === CONDITION_LOGIC.OR) {
            return index > 0 ? this.outcome.conditionLogic.value : '';
        }
        // Convert to 1 based indexes
        return (index + 1).toString();
    }

    /**
     * @param {object} event - AddListItemEvent to add a condition at the end of the list
     */
    handleAddCondition(event) {
        event.stopPropagation();

        const addConditionEvent = new AddConditionEvent(this.outcome.guid.value);

        this.dispatchEvent(addConditionEvent);
    }

    /**
     * @param {object} event - DeleteListItemEvent to delete a condition at the given index
     */
    handleDeleteCondition(event) {
        event.stopPropagation();

        const deleteConditionEvent = new DeleteConditionEvent(this.outcome.guid.value, event.detail.index);

        this.dispatchEvent(deleteConditionEvent);
    }

    /**
     * @param {object} event - UpdatListItemEvent to update a property value in the condition at the given index
     */
    handleUpdateCondition(event) {
        event.stopPropagation();

        const updateConditionEvent = new UpdateConditionEvent(this.outcome.guid.value,
            event.detail.index,
            event.detail.propertyName,
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
        event.guid = this.outcome.guid.value;
    }
}