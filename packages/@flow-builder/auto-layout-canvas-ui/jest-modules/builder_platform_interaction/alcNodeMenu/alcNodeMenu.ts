// @ts-nocheck
import { api, LightningElement } from 'lwc';

export default class AlcNodeMenu extends LightningElement {
    static className = 'node-menu';

    @api
    conditionOptions;

    @api
    elementMetadata;

    @api
    guid;

    @api
    elementHasFault;

    @api
    canHaveFaultConnector;

    @api
    moveFocusToMenu;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    @api
    flowModel;
}
