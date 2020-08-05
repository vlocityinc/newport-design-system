// @ts-nocheck
import { api } from 'lwc';
import FlcNodeMenu from 'builder_platform_interaction/flcNodeMenu';

export default class FlcNodeStartMenu extends FlcNodeMenu {
    @api
    elementData;

    @api
    startData;
}
