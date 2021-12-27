// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class ConditionListItem extends LightningElement {
    @api
    itemIndex;

    @api
    condition = {};

    @api
    deleteable;
}
