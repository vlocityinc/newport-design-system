import { LightningElement, api, track } from 'lwc';
import {
    DeleteOutcomeEvent
} from 'builder_platform_interaction-events';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
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

    labels = LABELS;

    get elementTypeForExpressionBuilder() {
        return ELEMENT_TYPE.DECISION;
    }

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
