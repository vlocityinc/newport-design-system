import { api, LightningElement } from 'lwc';

export default class ComponentVisiblity extends LightningElement {
    @api
    guid;

    @api
    visibilityRule;

    @api
    logicComboboxLabel;
}
