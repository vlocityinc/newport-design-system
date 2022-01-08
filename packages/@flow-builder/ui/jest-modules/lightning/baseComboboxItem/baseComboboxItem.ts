// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class BaseComboboxItem extends LightningElement {
    @api
    item = {};

    @api
    highlight() {}

    @api
    removeHighlight() {}
}
