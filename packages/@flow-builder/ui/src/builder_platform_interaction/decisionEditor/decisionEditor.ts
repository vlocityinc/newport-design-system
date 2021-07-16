// @ts-nocheck
import { LightningElement, api, track } from 'lwc';
import { decisionReducer, resetDeletedGuids } from './decisionReducer';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import {
    getErrorsFromHydratedElement,
    mergeErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { LABELS } from './decisionEditorLabels';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { isOrchestrator } from 'builder_platform_interaction/processTypeLib';

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome'
};

const EMPTY_OUTCOME_LABEL = LABELS.emptyOutcomeLabel;
const EMPTY_DEFAULT_OUTCOME_LABEL = LABELS.emptyDefaultOutcomeLabel;
const DEFAULT_OUTCOME_ID = 'defaultOutcome';

export default class DecisionEditor extends LightningElement {
    @track activeOutcomeId;
    @track decisionElement;
    @track shouldFocus = false;

    labels = LABELS;

    constructor() {
        super();
        resetDeletedGuids();
    }

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    @api
    editorParams;

    get isLabelCollapsibleToHeader() {
        return this.editorParams && this.editorParams.panelConfig.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    /**
     * public api function to return the node
     *
     * @returns {object} node - node
     */
    @api getNode() {
        return this.decisionElement;
    }

    /**
     * public api function to run the rules from decision validation library
     *
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.decisionElement = decisionReducer(this.decisionElement, event);
        return getErrorsFromHydratedElement(this.decisionElement);
    }

    get activeOutcome() {
        return this.decisionElement.outcomes.find((outcome) => outcome.guid === this.activeOutcomeId);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.decisionElement;
    }

    set node(newValue) {
        const oldHasError = this.decisionElement?.config?.hasError;
        this.decisionElement = mergeErrorsFromHydratedElement(newValue, this.decisionElement);

        if (!this.activeOutcomeId) {
            this.activeOutcomeId = this.decisionElement.outcomes[0].guid;
        }

        if (this.decisionElement?.config?.hasError !== oldHasError) {
            this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
        }

        // Reopening existing elements should always validate
        // This has to be done manually in every property editor
        if (!newValue.isNew) {
            this.validate();
        }
    }

    get showDeleteOutcome() {
        return this.decisionElement.outcomes.length > 1;
    }

    // getErrorsFromHydratedElement recursively walks the object structure and there could be performance issues by calling it in a getter
    // (and thus on every render) depending on the object depth
    get outcomesWithDefaultOutcome() {
        const outcomesWithDefaultOutcome = this.decisionElement.outcomes.map((outcome) => {
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

    get outcomesSectionDescription() {
        return isOrchestrator(getProcessType())
            ? this.labels.orchestratorOutcomesSectionDescription
            : this.labels.outcomesSectionDescription;
    }

    get defaultOutcomeDetailsDescription2() {
        return isOrchestrator(getProcessType())
            ? this.labels.orchestratorDefaultOutcomeDetailsDescription2
            : this.labels.defaultOutcomeDetailsDescription2;
    }

    handleAddOutcome(event) {
        event.stopPropagation();
        this.addOutcome();

        // Select the newly added outcome
        const outcomes = this.decisionElement.outcomes;
        this.activeOutcomeId = outcomes[outcomes.length - 1].guid;

        // Focus on the newly selected outcome ( focused the name/label field )
        const outcome = this.template.querySelector(SELECTORS.OUTCOME);
        // Set focus even if the outcome component is not currently present
        if (outcome) {
            outcome.focus();
        }
        this.shouldFocus = true;
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }

    renderedCallback() {
        // set the flag back to false to prevent focus incorrectly when child componenrts rerender
        this.shouldFocus = false;
    }

    addOutcome() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME };
        this.decisionElement = decisionReducer(this.decisionElement, event);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handlePropertyChangedEvent(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }

    handleDefaultOutcomeChangedEvent(event) {
        event.stopPropagation();

        const defaultOutcomeChangedEvent = new PropertyChangedEvent('defaultConnectorLabel', event.detail.value);

        this.decisionElement = decisionReducer(this.decisionElement, defaultOutcomeChangedEvent);
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }

    /**
     * Handles deletion and sets focus to the first outcome (if deletion was successful)
     *
     * @param {object} event - deleteOutcomeEvent
     */
    handleDeleteOutcome(event) {
        event.stopPropagation();
        const originalNumberOfOutcomes = this.decisionElement.outcomes.length;
        this.decisionElement = decisionReducer(this.decisionElement, event);
        if (this.decisionElement.outcomes.length < originalNumberOfOutcomes) {
            this.activeOutcomeId = this.decisionElement.outcomes[0].guid;
        }
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }

    /**
     * Handles reordering in the list of the outcomes
     *
     * @param {object} event - reorderListEvent
     */
    handleReorderOutcomes(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }

    handleOutcomeSelected(event) {
        event.stopPropagation();
        this.activeOutcomeId = event.detail.itemId;
    }

    /**
     * Handles the change on when an outcome is executed
     * i.e. whenever the conditions are met or only when the conditions are met for changed values.
     *
     * @param event
     */
    handleOutcomeExecutionOptionChange(event) {
        event.stopPropagation();
        this.decisionElement = decisionReducer(this.decisionElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.decisionElement));
    }
}
