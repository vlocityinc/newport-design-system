import { LightningElement, api } from 'lwc';

export default class ComponentVisiblity extends LightningElement {
    @api
    guid;

    @api
    visibilityRule;
}
