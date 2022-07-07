import { api, LightningElement } from 'lwc';

export default class FieldInputMenuAllView extends LightningElement {
    @api rules;
    @api config;
    @api context;
}
