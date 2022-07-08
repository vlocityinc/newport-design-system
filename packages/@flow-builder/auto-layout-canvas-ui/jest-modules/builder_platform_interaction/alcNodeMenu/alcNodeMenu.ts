// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class AlcNodeMenu extends LightningElement {
    static className = 'node-menu';

    @api
    elementMetadata;

    @api
    guid;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    @api
    flowModel;
}
