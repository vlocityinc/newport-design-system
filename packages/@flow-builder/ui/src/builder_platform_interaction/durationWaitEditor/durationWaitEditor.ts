import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { SCHEDULED_PATH_OFFSET_UNIT, WAIT_TIME_EVENT_OFFSET_UNIT } from 'builder_platform_interaction/flowMetadata';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './durationWaitEditorLabels';
import { defaultWaitElement, WaitElement } from './durationWaitEditorLib';
import { durationWaitValidation, getRules } from './durationWaitValidation';

const ELEMENT_PROPS = {
    durationOffset: {
        name: 'durationOffset',
        dataType: FEROV_DATA_TYPE.NUMBER
    },
    durationUnit: {
        name: 'durationUnit',
        dataType: FEROV_DATA_TYPE.STRING
    },
    timeValue: {
        name: 'timeValue',
        dataType: FEROV_DATA_TYPE.STRING
    },
    timeZone: {
        name: 'timeZone',
        dataType: FEROV_DATA_TYPE.STRING
    }
};

const MIDNIGHT_TIME_VALUE = '00:00:00.000';

export default class DurationWaitEditor extends LightningElement {
    selectedDurationUnit: string = WAIT_TIME_EVENT_OFFSET_UNIT.DAYS;
    @track waitElement: WaitElement = defaultWaitElement;
    _inputVariables: UI.ConfigurationEditorInputVariable[] = [];

    @api
    get inputVariables(): UI.ConfigurationEditorInputVariable[] {
        return this._inputVariables;
    }

    set inputVariables(inputVars: UI.ConfigurationEditorInputVariable[]) {
        inputVars.forEach((input) => {
            this.waitElement[input.name] = { value: input.value };
        });
        this._inputVariables = inputVars;
    }

    get durationOffset() {
        return this.waitElement.durationOffset?.value || 0;
    }

    get durationUnit() {
        return this.waitElement.durationUnit?.value || WAIT_TIME_EVENT_OFFSET_UNIT.HOURS;
    }

    get timeValue() {
        return this.waitElement.timeValue?.value;
    }

    get timeZone() {
        return this.waitElement.timeZone?.value;
    }

    get showExtendUntilTime() {
        // visibility of time fields is controlled by presence
        // of time values
        const timeVal = this.waitElement.timeValue?.value;
        return timeVal != null;
    }

    get durationUnitOptions() {
        return [
            { label: SCHEDULED_PATH_OFFSET_UNIT.HOURS, value: WAIT_TIME_EVENT_OFFSET_UNIT.HOURS },
            { label: SCHEDULED_PATH_OFFSET_UNIT.DAYS, value: WAIT_TIME_EVENT_OFFSET_UNIT.DAYS }
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
        const propertyName = event.target.id.split('-')[0];
        const { value } = event.detail;
        this.updateCpe(propertyName, value);
    }

    updateCpe(propertyName: string, value: string | null) {
        const { name, dataType } = ELEMENT_PROPS[propertyName];
        this.dispatchEvent(new ConfigurationEditorChangeEvent(name, value, dataType));
    }

    toggleExtendUntilTime() {
        if (this.showExtendUntilTime) {
            // clear time values when user explicitly unchecks the box
            this.updateCpe('timeValue', null);
            this.updateCpe('timeZone', null);
        } else {
            // set time val to a defaul when box is checked
            // to display time fields
            this.updateCpe('timeValue', MIDNIGHT_TIME_VALUE);
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
