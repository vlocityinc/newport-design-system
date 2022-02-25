import { LIGHTNING_COMPONENTS_SELECTORS } from 'builder_platform_interaction/builderTestUtils';
import { UpdateTestRecordDataEvent } from 'builder_platform_interaction/events';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { api, LightningElement, track, wire } from 'lwc';

export default class FlowTestTriggerRecordEditForm extends LightningElement {
    @api
    objectApiName;

    @api
    recordData;

    @track
    objectFieldAndValues: object[] = [];

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    objectInfo({ data, error }) {
        if (data) {
            const { fields = {} } = data;
            const modifiableKeys = Object.keys(fields).filter((key) => {
                return fields[key].updateable;
            });
            this.getValuesForKeyArray(modifiableKeys, this.recordData, this.objectFieldAndValues);
        }
    }

    getValuesForKeyArray(keyArray: string[], data, targetArray) {
        keyArray.forEach((key) => {
            targetArray.push({
                name: key,
                value: data.hasOwnProperty('value') ? data.value[key] : undefined
            });
        });
    }

    onFieldChange(event) {
        event.preventDefault();
        this.dispatchUpdateTestRecordDataEvent();
    }

    dispatchUpdateTestRecordDataEvent() {
        const inputFields = this.template.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT_FIELD);
        const objectFieldValues = {};
        let hasError = false;
        inputFields.forEach((fieldComponent) => {
            if (fieldComponent.reportValidity() === false) {
                hasError = true;
            }
            objectFieldValues[fieldComponent.fieldName] = fieldComponent.value;
        });
        const updateTestRecordDataEvent = new UpdateTestRecordDataEvent(objectFieldValues, hasError);
        this.dispatchEvent(updateTestRecordDataEvent);
    }
}
