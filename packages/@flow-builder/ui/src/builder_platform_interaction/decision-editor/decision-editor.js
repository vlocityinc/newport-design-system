import { LightningElement, api, track } from "lwc";
import { decisionReducer } from './decision-reducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction-actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from './decision-editor-labels';
import { VALIDATE_ALL } from 'builder_platform_interaction-validation-rules';

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome'
};

const EMPTY_OUTCOME_LABEL = LABELS.emptyOutcomeLabel;
const EMPTY_DEFAULT_OUTCOME_LABEL = LABELS.emptyDefaultOutcomeLabel;
const DEFAULT_OUTCOME_ID = 'defaultOutcome';

export default class DecisionEditor extends LightningElement {
    @track activeOutcomeId;
    @track decisionElement;

    labels = LABELS;

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.decisionElement;
    }

    /**
     * public api function to run the rules from decision validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.decisionElement = decisionReducer(this.decisionElement, event);
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

    set node(newValue) {
        this.decisionElement = newValue;
        this.activeOutcomeId = this.decisionElement.outcomes[0].guid;
    }

    get showDeleteOutcome() {
        return this.decisionElement.outcomes.length > 1;
    }

    // getErrorsFromHydratedElement recursively walks the object structure and there could be performance issues by calling it in a getter
    // (and thus on every render) depending on the object depth
    get outcomesWithDefaultOutcome() {
        const outcomesWithDefaultOutcome = this.decisionElement.outcomes.map(outcome => {
            return {
                element: outcome,
                label: outcome.label && outcome.label.value ? outcome.label.value : EMPTY_OUTCOME_LABEL,
                isDraggable: true,
                hasErrors: getErrorsFromHydratedElement(outcome).length > 0
            };
        });

        // Add the default outcome
        const defaultLabel = this.decisionElement.defaultConnectorLabel;

        outcomesWithDefaultOutcome.push({
            element: {
                guid: DEFAULT_OUTCOME_ID
            },
            label: defaultLabel && defaultLabel.value ? defaultLabel.value : EMPTY_DEFAULT_OUTCOME_LABEL,
            isDraggable: false,
            hasErrors: defaultLabel && defaultLabel.error
        });

        return outcomesWithDefaultOutcome;
    }

    get isDefaultOutcome() {
        return this.activeOutcomeId === DEFAULT_OUTCOME_ID;
    }

    handleAddOutcome(event) {
        event.stopPropagation();
        this.addOutcome();

        // Select the newly added outcome
        const outcomes = this.decisionElement.outcomes;
        this.activeOutcomeId = outcomes[outcomes.length - 1].guid;

        // Focus on the newly selected outcome ( focused the name/label field )
        const outcome = this.template.querySelector(SELECTORS.OUTCOME);
        // TODO: correctly set focus even if the outcome component is not currently present
        // See: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000054X60IAE/view
        if (outcome) {
            outcome.focus();
        }
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

        const defaultOutcomeChangedEvent = new PropertyChangedEvent(
            'defaultConnectorLabel',
            event.detail.value
        );

        this.decisionElement = decisionReducer(this.decisionElement, defaultOutcomeChangedEvent);
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
}
