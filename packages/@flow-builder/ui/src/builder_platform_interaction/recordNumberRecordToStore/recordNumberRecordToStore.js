import { LightningElement, api } from 'lwc';
import { NumberRecordToStoreChangedEvent } from "builder_platform_interaction/events";

export default class RecordNumberRecordToStore extends LightningElement {
    @api
    label;

    @api
    recordStoreOptions;

    @api
    numberRecordsToStoreValue;

   handleNumberRecordsToStoreChange(event) {
       event.stopPropagation();
       this.dispatchEvent(new NumberRecordToStoreChangedEvent(event.detail.value));
   }
}