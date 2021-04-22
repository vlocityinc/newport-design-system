// @ts-nocheck
import { LightningElement, api } from 'lwc';

export default class AlcNodeMenu extends LightningElement {
    @api
    conditionOptions;

    @api
    elementMetadata;

    @api
    guid;

    @api
    elementHasFault;

    @api
    openedWithKeyboard;

    @api
    disableDeleteElements;
}
