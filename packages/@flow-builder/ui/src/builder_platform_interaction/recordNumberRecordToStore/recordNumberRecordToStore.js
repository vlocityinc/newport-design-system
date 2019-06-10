import { LightningElement, api } from 'lwc';
import { NumberRecordToStoreChangedEvent } from 'builder_platform_interaction/events';
import { NUMBER_RECORDS_TO_STORE } from 'builder_platform_interaction/recordEditorLib';

export default class RecordNumberRecordToStore extends LightningElement {
    @api
    label;

    @api
    recordStoreOptions;

    @api
    numberRecordsToStoreValue;

    handleNumberRecordsToStoreChange(event) {
        event.stopPropagation();
        this.dispatchEvent(
            new NumberRecordToStoreChangedEvent(
                event.detail.value === NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            )
        );
    }
}
