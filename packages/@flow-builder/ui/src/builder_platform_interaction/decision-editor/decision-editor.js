import {Element, api, track} from 'engine';
import {decisionReducer} from './decision-reducer';
import {nameDescriptionMixin, baseEditor} from 'builder_platform_interaction-base-editor';
import {PROPERTY_EDITOR_ACTION} from 'builder_platform_interaction-actions';


import template from './decision-editor.html';

export default class DecisionEditor extends nameDescriptionMixin(baseEditor(Element)) {
    @track element;
    @track activeOutcomeId;

    get activeOutcome() {
        return this.element.outcomes.find(outcome => outcome.guid === this.activeOutcomeId);
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.element;
    }

    @api
    set node(newValue) {
        this.element = newValue;
        this.activeOutcomeId = this.element.outcomes[0].guid;
    }

    addInitialOutcomeIfNeeded() {
        if (this.element && (typeof this.element.outcomes === 'undefined' || this.element.outcomes.length === 0)) {
            this.addOutcome();
        }
    }

    get outcomes() {
        return (this.element) ? this.element.outcomes : [];
    }

    handleAddOutcome(event) {
        event.stopPropagation();
        this.addOutcome();
    }

    addOutcome() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME };
        this.element = decisionReducer(this.element, event);
    }

    /**
     * @param {object} event - property changed event coming from label-description component
     */
    handleEvent(event) {
        event.stopPropagation();
        this.element = decisionReducer(this.element, event);
    }

    handleOutcomeSelected(event) {
        event.stopPropagation();
        this.activeOutcomeId = event.detail.itemId;
    }

    // Required because Raptor doesn't know to add this method
    // since we aren't directly extending Element
    render() {
        return template;
    }
}
