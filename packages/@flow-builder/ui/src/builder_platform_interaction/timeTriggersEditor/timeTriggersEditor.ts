import { LightningElement, api, track } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { LABELS } from './timeTriggersEditorLabels';

const EMPTY_TIME_TRIGGER_LABEL = LABELS.emptyTimeTriggerLabel;

export default class TimeTriggersEditor extends LightningElement {
    @track activeTimeTriggerId;
    @track startElement;

    labels = LABELS;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    mode;

    // DO NOT REMOVE THIS - Added it to prevent the console warnings mentioned in W-6506350
    @api
    processType;

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.startElement;
    }

    /**
     * public api function to run the rules from time trigger validation library
     * @returns {object} list of errors
     */
    @api validate() {
        return null;
    }

    // getter and setter for nodes don't work well with mixins
    // currently need to be copied here for each property editor node
    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue;
        if (!this.activeTimeTriggerId && this.startElement.timeTriggers && this.startElement.timeTriggers.length > 0) {
            this.activeTimeTriggerId = this.startElement.timeTriggers[0].guid;
        }
    }

    get timeTriggersWithImmediateTrigger() {
        let timeTriggersWithImmediateTrigger = [];
        if (this.startElement.timeTriggers) {
            timeTriggersWithImmediateTrigger = this.startElement.timeTriggers.map((timeTrigger) => {
                return {
                    element: timeTrigger,
                    label:
                        timeTrigger.label && timeTrigger.label.value
                            ? timeTrigger.label.value
                            : EMPTY_TIME_TRIGGER_LABEL,
                    isDraggable: false,
                    hasErrors: getErrorsFromHydratedElement(timeTrigger).length > 0
                };
            });
        }

        return timeTriggersWithImmediateTrigger;
    }

    handleAddTimeTrigger(event) {
        event.stopPropagation();
        this.addTimeTrigger();

        // Select the newly added time trigger
        const timeTriggers = this.startElement.timeTriggers;
        this.activeTimeTriggerId = timeTriggers[timeTriggers.length - 1].guid;

        /* TODO: Uncomment this when we implement the inner time trigger editor component
         * as part of W-8057952

        // Focus on the newly selected time trigger ( focus on the name/label field )
        const timeTrigger = this.template.querySelector(SELECTORS.TIME_TRIGGER);
        // Set focus even if the timeTrigger component is not currently present
        if (timeTrigger) {
            timeTrigger.focus();
        }

        this.shouldFocus = true;
        */
    }

    addTimeTrigger() {
        // TODO: We'll uncomment this when we do the reducer work as part of W-8030277
        // const event = { type: PROPERTY_EDITOR_ACTION.ADD_START_ELEMENT_TIME_TRIGGER };
        // this.startElement = timeTriggersEditorReducer(this.startElement, event);
    }

    get activeTimeTrigger() {
        return this.startElement.timeTriggers
            ? this.startElement.timeTriggers.find((timeTrigger) => timeTrigger.guid === this.activeTimeTriggerId)
            : null;
    }

    handleTimeTriggerSelected(event) {
        event.stopPropagation();
        this.activeTimeTriggerId = event.detail.itemId;
    }
}
