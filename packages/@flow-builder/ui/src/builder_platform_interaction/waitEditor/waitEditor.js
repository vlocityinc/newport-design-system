import { LightningElement, api, track } from 'lwc';
import { waitReducer, resetDeletedGuids } from './waitReducer';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { PropertyChangedEvent } from 'builder_platform_interaction/events';
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { LABELS } from './waitEditorLabels';

const SELECTORS = {
    WAIT_EVENT: 'builder_platform_interaction-wait-event'
};

const DEFAULT_WAIT_EVENT_ID = 'defaultWaitEvent';

export default class WaitEditor extends LightningElement {
    labels = LABELS;

    constructor() {
        super();
        resetDeletedGuids();
    }

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

        this.activeWaitEventId = this.waitElement.waitEvents[0].guid;
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

    get showDeleteWaitEvent() {
        return this.waitElement.waitEvents.length > 1;
    }

    handleEvent(event) {
        event.stopPropagation();
        this.waitElement = waitReducer(this.waitElement, event);
    }

    get activeWaitEvent() {
        return this.waitElement.waitEvents.find(
            waitEvent => waitEvent.guid === this.activeWaitEventId
        );
    }

    get waitEventsWithDefaultPath() {
        const waitEventsWithDefaultPath = this.waitElement.waitEvents.map(
            waitEvent => {
                return {
                    element: waitEvent,
                    label:
                        waitEvent.label && waitEvent.label.value
                            ? waitEvent.label.value
                            : LABELS.newWaitEventLabel,
                    isDraggable: true,
                    hasErrors:
                        getErrorsFromHydratedElement(waitEvent).length > 0
                };
            }
        );

        const defaultLabel = this.waitElement.defaultConnectorLabel;
        const defaultPath = {
            element: {
                guid: DEFAULT_WAIT_EVENT_ID
            },
            label:
                defaultLabel && defaultLabel.value
                    ? defaultLabel.value
                    : LABELS.defaultPathLabel,
            isDraggable: false,
            hasErrors: defaultLabel && defaultLabel.error
        };
        waitEventsWithDefaultPath.push(defaultPath);

        return waitEventsWithDefaultPath;
    }

    get isDefaultPath() {
        return this.activeWaitEventId === DEFAULT_WAIT_EVENT_ID;
    }

    handleDefaultPathChangedEvent(event) {
        event.stopPropagation();
        const defaultPathChangedEvent = new PropertyChangedEvent(
            'defaultConnectorLabel',
            event.detail.value
        );
        this.waitElement = waitReducer(
            this.waitElement,
            defaultPathChangedEvent
        );
    }

    handleWaitEventSelected(event) {
        event.stopPropagation();
        this.activeWaitEventId = event.detail.itemId;
    }

    /**
     * Handles deletion and sets focus to the first wait event (if deletion was successful)
     * @param {object} event - deleteWaitEventEvent
     */
    handleDeleteWaitEvent(event) {
        event.stopPropagation();
        const originalNumberOfWaitEvents = this.waitElement.waitEvents.length;
        this.waitElement = waitReducer(this.waitElement, event);
        if (this.waitElement.waitEvents.length < originalNumberOfWaitEvents) {
            this.activeWaitEventId = this.waitElement.waitEvents[0].guid;
        }
    }

    /**
     * Handles reordering in the list of the outcomes
     * @param {object} event - reorderListEvent
     */
    handleReorderWaitEvents(event) {
        event.stopPropagation();
        this.waitElement = waitReducer(this.waitElement, event);
    }

    handleAddWaitEvent(event) {
        event.stopPropagation();
        this.addWaitEvent();

        // Select the newly added outcome
        const waitEvents = this.waitElement.waitEvents;
        this.activeWaitEventId = waitEvents[waitEvents.length - 1].guid;

        // Focus on the newly selected wait event( focused the name/label field )
        const waitEvent = this.template.querySelector(SELECTORS.WAIT_EVENT);
        if (waitEvent) {
            waitEvent.focus();
        }
    }

    addWaitEvent() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_WAIT_EVENT };
        this.waitElement = waitReducer(this.waitElement, event);
    }
}
