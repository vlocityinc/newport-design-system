import { api } from 'lwc';
import { DeleteElementEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';
import { MenuConfiguration, Actions } from './flcNodeMenuConfig';

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class FlcNodeMenu extends Menu {
    @api
    elementMetadata;

    @api
    guid;

    get menuConfiguration() {
        const label = this.elementMetadata.label;
        return MenuConfiguration[label];
    }
    set menuConfiguration(config) {
        return config;
    }

    handleSelectMenuItem(event) {
        event.stopPropagation();

        const actionType = event.target.getAttribute('data-value');
        let customEvent;

        switch (actionType) {
            case Actions.Delete:
                customEvent = new DeleteElementEvent([this.guid], this.elementType);
                break;
            default:
                customEvent = null;
        }

        if (customEvent) {
            this.dispatchEvent(new ToggleMenuEvent({}));
            this.dispatchEvent(customEvent);
        }
    }
}
