import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getIsoTime } from 'builder_platform_interaction/dateTimeUtils';
import { DEFAULT_OFFSET_UNIT, DEFAULT_OFFSET_VALUE } from 'builder_platform_interaction/elementFactory';
import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { SCHEDULED_PATH_OFFSET_UNIT, WAIT_TIME_EVENT_OFFSET_UNIT } from 'builder_platform_interaction/flowMetadata';
import { defaultWaitElement, WaitElement } from 'builder_platform_interaction/waitEditorLib';
import { parsePropertyNameFromId } from 'builder_platform_interaction/waitEditorUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './durationWaitEditorLabels';
import { durationWaitValidation, getRules } from './durationWaitValidation';

const ELEMENT_PROPS = {
    waitEvents: {
        name: 'waitEvents',
        dataType: FEROV_DATA_TYPE.ARRAY
    },
    timeZoneId: {
        name: 'timeZoneId',
        dataType: FEROV_DATA_TYPE.STRING
    }
};

const MIDNIGHT_TIME_VALUE = '00:00:00.000';

type DurationWaitProperty = keyof typeof ELEMENT_PROPS;

export default class DurationWaitEditor extends LightningElement {
    selectedOffsetUnit: string = WAIT_TIME_EVENT_OFFSET_UNIT.DAYS;
    @track waitElement: WaitElement = defaultWaitElement;
    _inputVariables: UI.ConfigurationEditorInputVariable[] = [];

    connectedCallback() {
        this.initDefaults();
    }

    initDefaults() {
        const waitEvt = Object.assign({}, this.waitEvent);
        const offsetVal = this.waitEvent?.offset == null ? DEFAULT_OFFSET_VALUE : this.waitEvent?.offset;
        const offsetUnitVal = this.waitEvent?.offsetUnit == null ? DEFAULT_OFFSET_UNIT : this.waitEvent?.offsetUnit;

        waitEvt.offset = offsetVal;
        waitEvt.offsetUnit = offsetUnitVal;

        this.updateCpe('waitEvents', [waitEvt]);
    }

    @api
    get durationWaitInfo() {
        return this.waitElement;
    }

    set durationWaitInfo(value) {
        if (value) {
            this.waitElement = value;
        }
    }

    @api
    get inputVariables(): UI.ConfigurationEditorInputVariable[] {
        return this._inputVariables;
    }

    set inputVariables(inputVars: UI.ConfigurationEditorInputVariable[]) {
        inputVars.forEach((input) => {
            this.waitElement[input.name] = input.value;
        });
        this._inputVariables = inputVars;
    }

    get offset() {
        const offsetValue = getValueFromHydratedItem(this.waitEvent?.offset);
        return offsetValue ?? DEFAULT_OFFSET_VALUE;
    }

    get offsetUnit() {
        return getValueFromHydratedItem(this.waitEvent?.offsetUnit) || WAIT_TIME_EVENT_OFFSET_UNIT.DAYS;
    }

    get resumeTime() {
        const timeValue = getValueFromHydratedItem(this.waitEvent?.resumeTime);
        return getIsoTime(timeValue);
    }

    get waitEvent() {
        return getValueFromHydratedItem(this.waitElement.waitEvents)[0];
    }

    get timeZoneId() {
        return this.waitElement.timeZoneId;
    }

    get showResumeTime() {
        // visibility of time fields is controlled by presence
        // of time values
        const timeVal = getValueFromHydratedItem(this.waitEvent?.resumeTime);
        return timeVal != null;
    }

    get helpText() {
        return LABELS.extendUntilHelpText;
    }

    get offsetUnitOptions() {
        return [
            { label: SCHEDULED_PATH_OFFSET_UNIT.MINUTES, value: WAIT_TIME_EVENT_OFFSET_UNIT.MINUTES },
            { label: SCHEDULED_PATH_OFFSET_UNIT.HOURS, value: WAIT_TIME_EVENT_OFFSET_UNIT.HOURS },
            { label: SCHEDULED_PATH_OFFSET_UNIT.DAYS, value: WAIT_TIME_EVENT_OFFSET_UNIT.DAYS },
            { label: SCHEDULED_PATH_OFFSET_UNIT.MONTHS, value: WAIT_TIME_EVENT_OFFSET_UNIT.MONTHS }
        ];
    }

    get extendUntilTimeCheckboxLabel() {
        return LABELS.extendUntilTimeCheckboxLabel;
    }

    get timeLabel() {
        return LABELS.timeLabel;
    }

    handleValueChanged(event) {
        event.stopPropagation();
        const propertyName = parsePropertyNameFromId(event.target.id);
        const { value } = event.detail;
        this.updateCpe(propertyName, value);
    }

    handleWaitEventValueChanged(event) {
        event.stopPropagation();
        const { value } = event.detail;
        const propertyName = parsePropertyNameFromId(event.target.id);
        const waitEvt = Object.assign({}, getValueFromHydratedItem(this.waitElement.waitEvents)[0]);
        waitEvt[propertyName] = value;
        this.updateCpe('waitEvents', [waitEvt]);
    }

    updateCpe(propertyName: DurationWaitProperty, value: string | object | null) {
        const { name, dataType } = ELEMENT_PROPS[propertyName];
        this.dispatchEvent(new ConfigurationEditorChangeEvent(name, value, dataType));
    }

    toggleResumeTime() {
        const waitEvt = Object.assign({}, getValueFromHydratedItem(this.waitElement.waitEvents)[0]);
        if (this.showResumeTime) {
            // clear time values when user explicitly unchecks the box
            waitEvt.resumeTime = null;
            this.updateCpe('waitEvents', [waitEvt]);
            this.updateCpe('timeZoneId', null);
        } else {
            // set time val to a defaul when box is checked
            // to display time fields
            waitEvt.resumeTime = MIDNIGHT_TIME_VALUE;
            this.updateCpe('waitEvents', [waitEvt]);
        }
    }

    /**
     * Validate the durationWait editor. This method will be called in the upper editor.
     *
     * @returns errors
     */
    @api
    validate() {
        this.waitElement = durationWaitValidation.validateAll(this.waitElement, getRules());
        return getErrorsFromHydratedElement(this.waitElement);
    }
}
