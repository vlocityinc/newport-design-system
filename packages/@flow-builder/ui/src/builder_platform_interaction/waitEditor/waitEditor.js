import { LightningElement, api, track } from 'lwc';
import { waitReducer } from "./waitReducer";
import { VALIDATE_ALL } from "builder_platform_interaction/validationRules";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";
import { LABELS } from "./waitEditorLabels";

export default class WaitEditor extends LightningElement {
    labels = LABELS;

    /**
     * internal state for the wait editor
     */
    @track waitElement;
    @track activeWaitEventId;

    @api
    get node() {
        return this.waitElement;
    }

    set node(newValue) {
        this.waitElement = newValue || {};

        // TODO: W-5395888 Replace with first wait event ID
        this.activeWaitEventId = "WaitEvent1";
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.waitElement;
    }

    /**
     * public api function to run the rules from wait validation library
     * @returns {object} list of errors
     */
    @api validate() {
        const event = { type: VALIDATE_ALL };
        this.waitElement = waitReducer(this.waitElement, event);
        return getErrorsFromHydratedElement(this.waitElement);
    }

    handleEvent(event) {
        event.stopPropagation();
        this.waitElement = waitReducer(this.waitElement, event);
    }

    get activeWaitEvent() {
        // TODO: W-5395888 Replace with actual active wait event
        return {   element: { guid: "WaitEvent1"},
            label: { value: "WaitEvent 1", error: null },
            name: { value : "event_name", error: null },
            isDraggable: true,
            hasErrors: false,
        };
    }

    get waitEventsWithDefaultPath() {
        // TODO: W-5395888 Replace with actual wait events
        const waitEventsWithDefaultPath = [];

        const waitEvent1 = {   element: { guid: "WaitEvent1"},
            label: "WaitEvent 1",
            isDraggable: true,
            hasErrors: false
        };

        const waitEvent2 = {   element: { guid: "WaitEvent2"},
            label: "WaitEvent2",
            isDraggable: true,
            hasErrors: false
        };

        const defaultPath = {   element: { guid: "DefaultPath"},
            label: "DefaultPath",
            isDraggable: true,
            hasErrors: false
        };
        waitEventsWithDefaultPath.push(waitEvent1);
        waitEventsWithDefaultPath.push(waitEvent2);
        waitEventsWithDefaultPath.push(defaultPath);
        return waitEventsWithDefaultPath;
    }

    handleWaitEventSelected(event) {
        event.stopPropagation();
        this.activeWaitEventId = event.detail.itemId;
    }

    handleReorderWaitEvents(event) {
        event.stopPropagation();
        // do nothing for now
    }

    handleAddWaitEvent(event) {
        event.stopPropagation();
        // do nothing for now
    }
}
