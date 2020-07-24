import FlcNodeMenu from 'builder_platform_interaction/flcNodeMenu';
import { api } from 'lwc';

export default class FlcNodeStartMenu extends FlcNodeMenu {
    @api
    startData;

    get hasTrigger() {
        return this.elementMetadata.hasTrigger;
    }

    get hasContext() {
        return this.elementMetadata.hasContext;
    }

    get startNode() {
        return { ...this.startData, ...{ guid: this.guid } };
    }

    get startNodeClass() {
        return this.hasTrigger || this.hasContext
            ? 'node-menu-header slds-border_bottom slds-dropdown__header'
            : 'node-menu-header slds-dropdown__header';
    }
}
