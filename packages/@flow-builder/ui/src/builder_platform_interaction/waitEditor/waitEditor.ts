// @ts-nocheck
import { PROPERTY_EDITOR_ACTION } from 'builder_platform_interaction/actions';
import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { elementTypeToConfigMap } from 'builder_platform_interaction/elementConfig';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import PanelBasedPropertyEditor from 'builder_platform_interaction/panelBasedPropertyEditor';
import { track } from 'lwc';
import { LABELS } from './waitEditorLabels';
import { resetDeletedGuids, waitReducer } from './waitReducer';

const SELECTORS = {
    WAIT_EVENT: 'builder_platform_interaction-wait-event',
    CUSTOM_PROPERTY_EDITOR: 'builder_platform_interaction-custom-property-editor'
};

const DEFAULT_WAIT_EVENT_ID = 'defaultWaitEvent';

export default class WaitEditor extends PanelBasedPropertyEditor {
    labels = LABELS;

    constructor() {
        super();
        this.reducer = waitReducer;
        resetDeletedGuids();
    }

    @track
    activeWaitEventId;

    @track
    configurationEditorInputVariables = [];

    override onSetNode() {
        if (!this.activeWaitEventId) {
            this.activeWaitEventId = this.element.waitEvents[0].guid;
        }
        this.configurationEditor = {
            name: elementTypeToConfigMap[this.element.elementSubtype?.value]?.configComponent
        };
        this.setConfigurationEditorInputVariables();
    }

    get showDeleteWaitEvent() {
        return this.element.waitEvents.length > 1;
    }

    handleEvent(event) {
        event.stopPropagation();
        this.element = waitReducer(this.element, event);
        this.setConfigurationEditorInputVariables();
        this.dispatchEvent(new UpdateNodeEvent(this.element));
    }

    get activeWaitEvent() {
        return this.element.waitEvents.find((waitEvent) => waitEvent.guid === this.activeWaitEventId);
    }

    get waitEventsWithDefaultPath() {
        const waitEventsWithDefaultPath = this.element.waitEvents.map((waitEvent) => {
            return {
                element: waitEvent,
                label: waitEvent.label && waitEvent.label.value ? waitEvent.label.value : LABELS.newWaitEventLabel,
                isDraggable: true,
                hasErrors: getErrorsFromHydratedElement(waitEvent).length > 0
            };
        });

        const defaultLabel = this.element.defaultConnectorLabel;
        const defaultPath = {
            element: {
                guid: DEFAULT_WAIT_EVENT_ID
            },
            label: defaultLabel && defaultLabel.value ? defaultLabel.value : LABELS.defaultPathLabel,
            isDraggable: false,
            hasErrors: defaultLabel && defaultLabel.error
        };
        waitEventsWithDefaultPath.push(defaultPath);

        return waitEventsWithDefaultPath;
    }

    get isDefaultPath() {
        return this.activeWaitEventId === DEFAULT_WAIT_EVENT_ID;
    }

    handleValueChanged(event) {
        event.stopPropagation();
        this.updateElement(event);
    }

    handleDefaultPathChangedEvent(event) {
        event.stopPropagation();
        const defaultPathChangedEvent = new PropertyChangedEvent('defaultConnectorLabel', event.detail.value);
        this.updateElement(defaultPathChangedEvent);
    }

    handleWaitEventSelected(event) {
        event.stopPropagation();
        this.activeWaitEventId = event.detail.itemId;
    }

    /**
     * Handles deletion and sets focus to the first wait event (if deletion was successful)
     *
     * @param {object} event - deleteWaitEventEvent
     */
    handleDeleteWaitEvent(event) {
        event.stopPropagation();
        const originalNumberOfWaitEvents = this.element.waitEvents.length;
        this.updateElement(event);

        if (this.element.waitEvents.length < originalNumberOfWaitEvents) {
            this.activeWaitEventId = this.element.waitEvents[0].guid;
        }

        // Move focus to the active pause event (first pause event) post deletion
        this.template.querySelector(SELECTORS.WAIT_EVENT)?.focus();
    }

    /**
     * Handles reordering in the list of the outcomes
     *
     * @param {object} event - reorderListEvent
     */
    handleReorderWaitEvents(event) {
        event.stopPropagation();
        this.updateElement(event);
    }

    handleAddWaitEvent(event) {
        event.stopPropagation();
        this.addWaitEvent();

        // Select the newly added outcome
        const waitEvents = this.element.waitEvents;
        this.activeWaitEventId = waitEvents[waitEvents.length - 1].guid;

        // Focus on the newly selected wait event( focused the name/label field )
        const waitEvent = this.template.querySelector(SELECTORS.WAIT_EVENT);
        if (waitEvent) {
            waitEvent.focus();
        }
    }

    addWaitEvent() {
        const event = { type: PROPERTY_EDITOR_ACTION.ADD_WAIT_EVENT };
        this.updateElement(event);
    }

    /**
     * set input variables for sub editor
     */
    setConfigurationEditorInputVariables() {
        this.configurationEditorInputVariables = [];
        for (const prop in this.element) {
            if (this.element[prop]) {
                const inputVar = {
                    name: prop,
                    value: getValueFromHydratedItem(this.element[prop])
                };
                this.configurationEditorInputVariables.push(inputVar);
            }
        }
    }
}
