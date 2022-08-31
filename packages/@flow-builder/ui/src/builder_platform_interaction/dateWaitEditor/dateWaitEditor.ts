import { getErrorsFromHydratedElement, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getIsoTime } from 'builder_platform_interaction/dateTimeUtils';
import { ConfigurationEditorChangeEvent } from 'builder_platform_interaction/events';
import { defaultWaitElement, WaitElement } from 'builder_platform_interaction/waitEditorLib';
import { parsePropertyNameFromId } from 'builder_platform_interaction/waitEditorUtils';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './dateWaitEditorLabels';
import { dateWaitValidation, getRules } from './dateWaitValidation';

const WAIT_PROPS = {
    waitEvents: {
        name: 'waitEvents',
        dataType: FEROV_DATA_TYPE.ARRAY
    },
    timeZoneId: {
        name: 'timeZoneId',
        dataType: FEROV_DATA_TYPE.STRING
    }
};

type DateWaitProperty = keyof typeof WAIT_PROPS;

export default class DateWaitEditor extends LightningElement {
    @track dateWaitElement: WaitElement = defaultWaitElement;
    _inputVars: UI.ConfigurationEditorInputVariable[] = [];
    labels = LABELS;

    @api
    get dateWaitInfo() {
        return this.dateWaitElement;
    }

    set dateWaitInfo(value) {
        if (value) {
            this.dateWaitElement = value;
        }
    }

    @api
    get inputVariables(): UI.ConfigurationEditorInputVariable[] {
        return this._inputVars;
    }

    set inputVariables(inputVars: UI.ConfigurationEditorInputVariable[]) {
        inputVars.forEach((inputVar) => {
            this.dateWaitElement[inputVar.name] = inputVar.value;
        });
        this._inputVars = inputVars;
    }

    get resumeDate() {
        return getValueFromHydratedItem(this.waitEvent?.resumeDate);
    }

    get resumeTime() {
        const timeValue = getValueFromHydratedItem(this.waitEvent?.resumeTime);
        return getIsoTime(timeValue);
    }

    get waitEvent() {
        return getValueFromHydratedItem(this.dateWaitElement.waitEvents)[0];
    }

    get timeZoneId() {
        return this.dateWaitElement.timeZoneId;
    }

    handleTimeZoneChanged(e) {
        e.stopPropagation();
        this.updateCpe('timeZoneId', e.detail.value);
    }

    handleWaitEventChanged(e) {
        e.stopPropagation();
        this.updateWaitEventField(parsePropertyNameFromId(e.target.id), e.detail.value);
    }

    updateWaitEventField(prop, value) {
        const waitEvent = { ...this.waitEvent };
        waitEvent[prop] = value;
        this.updateCpe('waitEvents', [waitEvent]);
    }

    updateCpe(propName: DateWaitProperty, value: string | object | null) {
        const { name, dataType } = WAIT_PROPS[propName];
        this.dispatchEvent(new ConfigurationEditorChangeEvent(name, value, dataType));
    }

    /**
     * Validate the dateWait editor. This method will be called in the upper editor.
     *
     * @returns errors
     */
    @api
    validate() {
        this.dateWaitElement = dateWaitValidation.validateAll(this.dateWaitElement, getRules());
        return getErrorsFromHydratedElement(this.dateWaitElement);
    }
}
