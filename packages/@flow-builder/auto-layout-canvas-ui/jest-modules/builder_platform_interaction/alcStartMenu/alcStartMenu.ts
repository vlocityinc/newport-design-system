// @ts-nocheck
import { api } from 'lwc';
import AlcNodeMenu from 'builder_platform_interaction/alcNodeMenu';

export default class AlcStartMenu extends AlcNodeMenu {
    @api
    elementData;

    @api
    startData;

    @api
    supportsTimeTriggers;
}
