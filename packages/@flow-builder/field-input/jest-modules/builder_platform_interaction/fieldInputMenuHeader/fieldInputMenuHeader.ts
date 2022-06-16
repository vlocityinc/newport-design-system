import { api, LightningElement } from 'lwc';

// make mock util?

export default class FieldInputMenuHeader extends LightningElement {
    @api mode;
    @api info;
    @api breadcrumbs;
}
