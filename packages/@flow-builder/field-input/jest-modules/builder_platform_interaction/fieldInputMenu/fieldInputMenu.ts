import { api, LightningElement } from 'lwc';

export default class FieldInputMenu extends LightningElement {
    @api contextItems;
    @api rules;
    @api config;
    @api context;
}
