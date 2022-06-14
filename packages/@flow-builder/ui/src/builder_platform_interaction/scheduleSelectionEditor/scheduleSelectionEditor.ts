import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import { PropertyChangedEvent, UpdateNodeEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE, FLOW_TRIGGER_FREQUENCY, START_ELEMENT_FIELDS } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './scheduleSelectionEditorLabels';
import { scheduleSelectionReducer } from './scheduleSelectionReducer';

export const JOURNEY_SCHEDULE_TYPE = {
    RECURRING: 'Recurring',
    RUN_ONCE: 'RunOnce'
};

export const RUN_ONCE_TYPE = {
    ON_ACTIVATION: 'OnActivation',
    AT_DATE_TIME: 'AtDateTime'
};

const nodeConfig = getConfigForElementType(ELEMENT_TYPE.START_ELEMENT).nodeConfig;

export default class ScheduleSelectionEditor extends LightningElement {
    labels = LABELS;

    @track
    startElement;

    @api
    mode;

    @api
    editorParams;

    @api
    processType;

    @api
    get node() {
        return this.startElement;
    }

    set node(newValue) {
        this.startElement = newValue || {};
    }

    get scheduleTypes() {
        return [
            {
                itemId: JOURNEY_SCHEDULE_TYPE.RECURRING,
                label: this.labels.recurring,
                description: this.labels.recurringDesc,
                isSelected: this.isRecurring,
                iconName: 'utility:loop'
            },
            {
                itemId: JOURNEY_SCHEDULE_TYPE.RUN_ONCE,
                label: this.labels.runOnce,
                description: this.labels.runOnceDesc,
                isSelected: this.isRunOnce,
                iconName: 'utility:right'
            }
        ];
    }

    get isRecurring() {
        return !this.isRunOnce;
    }

    get isRunOnce() {
        return this.startElement.frequency.value === FLOW_TRIGGER_FREQUENCY.ONCE;
    }

    get startDate() {
        return this.startElement.startDate ? this.startElement.startDate.value : null;
    }

    get startTime() {
        return this.startElement.startTime ? this.startElement.startTime.value : null;
    }

    get frequency() {
        return this.startElement.frequency ? this.startElement.frequency.value : null;
    }

    get iconName() {
        return nodeConfig?.iconName;
    }

    get iconShape() {
        return nodeConfig?.iconShape;
    }

    get iconBackgroundColor() {
        return nodeConfig?.iconBackgroundColor;
    }

    /**
     * Handles Schedule Type visual picker list selection
     *
     * @param event - visualpickerlistchanged event from visual-picker-list component.
     */
    handleScheduleTypeSelection = (event) => {
        const selectedItemId = event.detail.items.find((item) => item.isSelected)?.id;
        if (selectedItemId === JOURNEY_SCHEDULE_TYPE.RECURRING) {
            this.handleTypeRecurring();
        } else {
            this.handleTypeRunOnce();
        }
    };

    handleTypeRecurring() {
        this.updateField(START_ELEMENT_FIELDS.FREQUENCY, FLOW_TRIGGER_FREQUENCY.DAILY);
    }

    handleTypeRunOnce() {
        this.updateField(START_ELEMENT_FIELDS.FREQUENCY, FLOW_TRIGGER_FREQUENCY.ONCE);
    }

    /**
     * Updates a field by creating a PropertyChangedEvent and passing it to the reducer
     *
     * @param {string} prop - the name of the field to update
     * @param {string} value - the value for the field
     */
    updateField(prop, value) {
        const event = new PropertyChangedEvent(prop, value);
        this.startElement = scheduleSelectionReducer(this.startElement, event);
        this.dispatchEvent(new UpdateNodeEvent(this.startElement));
    }

    get repeatScheduleOptions() {
        return [
            {
                label: this.labels.triggerFrequencyDaily,
                value: FLOW_TRIGGER_FREQUENCY.DAILY
            },
            {
                label: this.labels.triggerFrequencyWeekly,
                value: FLOW_TRIGGER_FREQUENCY.WEEKLY
            }
        ];
    }

    get editorHeader() {
        return this.editorParams?.panelConfig?.titleForModal;
    }

    handleFrequencyChange = (event) => {
        this.updateField(START_ELEMENT_FIELDS.FREQUENCY, event.detail.value);
    };

    handleStartDateChange = (event) => {
        this.updateField(START_ELEMENT_FIELDS.START_DATE, event.detail.value);
    };

    handleStartTimeChange = (event) => {
        this.updateField(START_ELEMENT_FIELDS.START_TIME, event.detail.value);
    };

    get runOnceOptions() {
        return [
            { label: this.labels.runOnceOnDateTime, value: RUN_ONCE_TYPE.AT_DATE_TIME },
            { label: this.labels.runOnceOnActivation, value: RUN_ONCE_TYPE.ON_ACTIVATION }
        ];
    }
}
