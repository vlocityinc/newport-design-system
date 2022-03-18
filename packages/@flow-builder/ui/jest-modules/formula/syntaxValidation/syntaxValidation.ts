import { api, LightningElement } from 'lwc';

export default class SyntaxValidation extends LightningElement {
    @api validationResult;
    @api validationStatusPosition;
    @api
    enableCheckSyntaxButton() {}
}
