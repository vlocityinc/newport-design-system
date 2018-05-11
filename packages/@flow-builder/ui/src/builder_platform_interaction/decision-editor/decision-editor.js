import { Element, api, track, unwrap } from 'engine';
import { decisionReducer } from './decision-reducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome'
};

const EMPTY_OUTCOME_LABEL = '[New Outcome]';
const EMPTY_DEFAULT_OUTCOME_LABEL = '[Default Outcome]';

export default class DecisionEditor extends Element {
    @track activeOutcomeId;
    @track decisionElement;

    /**
     * public api function to return the unwrapped node
     * @returns {object} node - unwrapped node
     */
    @api getNode() {
        return unwrap(this.decisionElement);
    }

    /**
     * public api function to run the rules from decision validation library
     * @returns {object} list of errors
     */
    @api validate() {
        // TODO : validation for ok button, W-4875650
        return getErrorsFromHydratedElement(this.decisionElement);
    }

    get activeOutcome() {
        return this.decisionElement.outcomes.find(outcome => outcome.guid === this.activeOutcomeId);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.decisionElement;
    }

    @api
    set node(newValue) {
        this.decisionElement = newValue;
        this.activeOutcomeId = this.decisionElement.outcomes[0].guid;
    }

    get showDeleteOutcome() {
        return this.decisionElement.outcomes.length > 1;
    }

    get outcomesWithDefaultOutcome() {
        const outcomesWithDefaultOutcome = this.decisionElement.outcomes.map(outcome => {
            return {
                element: outcome,
                label: outcome.label && outcome.label.value ? outcome.label.value : EMPTY_OUTCOME_LABEL,
                isDraggable: true
            };
        });

        // Add the default outcome
        const defaultLabel = this.decisionElement.defaultConnectorLabel;

        outcomesWithDefaultOutcome.push({
            element: {},
            label: defaultLabel && defaultLabel.value ? defaultLabel.value : EMPTY_DEFAULT_OUTCOME_LABEL,
            isDraggable: false
        });

        return outcomesWithDefaultOutcome;
    }

    handleAddOutcome(event) {
        event.stopPropagation();
        this.addOutcome();

        // Select the newly added outcome
        const outcomes = this.decisionElement.outcomes;
        this.activeOutcomeId = outcomes[outcomes.length - 1].guid;

        // Focus on the newly selected outcome ( focused the name/label field )
        const outcome = this.root.querySelector(SELECTORS.OUTCOME);
        outcome.focus();
    }

    addOutcome() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME };
        this.decisionElement = decisionReducer(this.decisionElement, event);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);
    }

    handleDefaultOutcomeChangedEvent(event) {
        event.stopPropagation();

        event.propertyName = 'defaultConnectorLabel';
        this.decisionElement = decisionReducer(this.decisionElement, event);
    }

    /**
     * Handles deletion and sets focus to the first outcome
     * @param {object} event - deleteOutcomeEvent
     */
    handleDeleteOutcome(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);

        this.activeOutcomeId = this.decisionElement.outcomes[0].guid;
    }

    /**
     * Handles reordering in the list of the outcomes
     * @param {object} event - reorderListEvent
     */
    handleReorderOutcomes(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);
    }

    handleOutcomeSelected(event) {
        event.stopPropagation();
        this.activeOutcomeId = event.detail.itemId;
    }

    handleDefaultOutcomeClicked(event) {
        event.stopPropagation();
        this.activeOutcomeId = null;
    }
}
