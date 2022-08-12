// @ts-nocheck
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import PanelBasedPropertyEditor from 'builder_platform_interaction/panelBasedPropertyEditor';
import { isOrchestrator } from 'builder_platform_interaction/processTypeLib';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { api, track } from 'lwc';
import { LABELS } from './decisionEditorLabels';
import { decisionReducer, resetDeletedGuids } from './decisionReducer';

const SELECTORS = {
    OUTCOME: 'builder_platform_interaction-outcome',
    labelDescription: 'builder_platform_interaction-label-description'
};

const EMPTY_OUTCOME_LABEL = LABELS.emptyOutcomeLabel;
const EMPTY_DEFAULT_OUTCOME_LABEL = LABELS.emptyDefaultOutcomeLabel;
const DEFAULT_OUTCOME_ID = 'defaultOutcome';

export default class DecisionEditor extends PanelBasedPropertyEditor {
    @track activeOutcomeId;
    @track shouldFocus = false;

    labels = LABELS;

    constructor() {
        super(decisionReducer);
        resetDeletedGuids();
    }

    get isLabelCollapsibleToHeader() {
        return this.editorParams?.panelConfig?.isLabelCollapsibleToHeader;
    }

    get styleForLabelDescription() {
        if (!this.isLabelCollapsibleToHeader) {
            return 'slds-p-horizontal_small slds-p-top_small';
        }
        return '';
    }

    get activeOutcome() {
        return this.element.outcomes.find((outcome) => outcome.guid === this.activeOutcomeId);
    }

    override onSetNode(): void {
        if (!this.activeOutcomeId || !this.activeOutcome) {
            this.activeOutcomeId = this.element.outcomes[0].guid;
        }
    }

    get showDeleteOutcome() {
        return this.element.outcomes.length > 1;
    }

    // getErrorsFromHydratedElement recursively walks the object structure and there could be performance issues by calling it in a getter
    // (and thus on every render) depending on the object depth
    get outcomesWithDefaultOutcome() {
        const outcomesWithDefaultOutcome = this.element.outcomes.map((outcome) => {
            return {
                element: outcome,
                label: outcome.label && outcome.label.value ? outcome.label.value : EMPTY_OUTCOME_LABEL,
                isDraggable: true,
                hasErrors: getErrorsFromHydratedElement(outcome).length > 0
            };
        });

        // Add the default outcome
        const defaultLabel = this.element.defaultConnectorLabel;

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

    @api
    focus() {
        const labelDescription = this.template.querySelector(SELECTORS.labelDescription);

        if (labelDescription?.focus) {
            labelDescription.focus();
        }
    }

    handleAddOutcome(event) {
        event.stopPropagation();
        this.addOutcome();

        // Select the newly added outcome
        const outcomes = this.element.outcomes;
        this.activeOutcomeId = outcomes[outcomes.length - 1].guid;

        // Focus on the newly selected outcome ( focused the name/label field )
        const outcome = this.template.querySelector(SELECTORS.OUTCOME);
        // Set focus even if the outcome component is not currently present
        if (outcome) {
            outcome.focus();
        }
        this.shouldFocus = true;
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    renderedCallback() {
        // set the flag back to false to prevent focus incorrectly when child componenrts rerender
        this.shouldFocus = false;
    }

    addOutcome() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME };
        this.element = decisionReducer(this.element, event);
    }

    handleValueChanged(event) {
        event.stopPropagation();
        this.updateElement(event);
    }

    handleDefaultOutcomeChangedEvent(event) {
        event.stopPropagation();
        const defaultOutcomeChangedEvent = new PropertyChangedEvent('defaultConnectorLabel', event.detail.value);
        this.updateElement(defaultOutcomeChangedEvent);
    }

    /**
     * Handles deletion and sets focus to the first outcome (if deletion was successful)
     *
     * @param {object} event - deleteOutcomeEvent
     */
    handleDeleteOutcome(event) {
        event.stopPropagation();
        const originalNumberOfOutcomes = this.element.outcomes.length;
        this.element = decisionReducer(this.element, event);
        if (this.element.outcomes.length < originalNumberOfOutcomes) {
            this.activeOutcomeId = this.element.outcomes[0].guid;
        }
        this.dispatchEvent(new UpdateNodeEvent(this.element));

        // Move focus to the active outcome (first outcome) post deletion
        this.template.querySelector(SELECTORS.OUTCOME)?.focus();
    }

    handleOutcomeSelected(event) {
        event.stopPropagation();
        this.activeOutcomeId = event.detail.itemId;
    }
}
