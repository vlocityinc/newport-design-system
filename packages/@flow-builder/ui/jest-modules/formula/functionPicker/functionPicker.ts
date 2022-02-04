import { api, LightningElement } from 'lwc';

export default class FunctionPicker extends LightningElement {
    @api functionData;
    @api label;
    @api placeholder;
    @api filterDisplayText;
}
