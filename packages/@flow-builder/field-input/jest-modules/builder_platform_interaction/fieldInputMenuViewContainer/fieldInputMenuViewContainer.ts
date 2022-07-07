import { api, LightningElement } from 'lwc';

export default class FieldInputMenuViewContainer extends LightningElement {
    @api view;
    @api rules;
    @api config;
    @api context;
}
