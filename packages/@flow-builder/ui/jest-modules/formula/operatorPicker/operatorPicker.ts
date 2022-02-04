import { api, LightningElement } from 'lwc';

export default class OperatorPicker extends LightningElement {
    @api operatorData;
    @api value;
    @api label;
}
