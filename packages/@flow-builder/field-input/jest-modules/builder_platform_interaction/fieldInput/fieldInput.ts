import { api, LightningElement } from 'lwc';

export default class FieldInput extends LightningElement {
    @api rules;
    @api config;
    @api context;
}
