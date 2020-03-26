import { api } from 'lwc';
import {
    CopySingleElementEvent,
    DeleteElementEvent,
    EditElementEvent,
    ToggleMenuEvent
} from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';
import { elementActionsConfig, getMenuConfiguration } from './flcNodeMenuConfig';

/**
 * The node menu overlay, displayed when clicking on a node.
 */
export default class FlcNodeMenu extends Menu {
    @api
    elementMetadata;

    @api
    guid;

    get menuConfiguration() {
        return getMenuConfiguration(this.elementMetadata);
    }

    set menuConfiguration(config) {
        return config;
    }

    /**
     * Handles the click on the cancel button and closes the contextual menu
     */
    handleCancelButtonClick = event => {
        event.stopPropagation();
        this.dispatchEvent(new ToggleMenuEvent({}));
    };

    /**
     * Handles the click on the action row item and dispatches the appropriate event
     */
    handleSelectMenuItem = event => {
        event.stopPropagation();
        this.dispatchEvent(new ToggleMenuEvent({}));
        const actionType = event.currentTarget.getAttribute('data-value');
        switch (actionType) {
            case elementActionsConfig.COPY_ACTION.value:
                this.dispatchEvent(new CopySingleElementEvent(this.guid));
                break;
            case elementActionsConfig.DELETE_ACTION.value:
                this.dispatchEvent(new DeleteElementEvent([this.guid], this.elementMetadata.elementType));
                break;
            default:
                break;
        }
    };

    /**
     * Handles the click on the Edit button and dispatches the EditElementEvent
     */
    handleEditButtonClick = event => {
        event.stopPropagation();
        this.dispatchEvent(new ToggleMenuEvent({}));
        this.dispatchEvent(new EditElementEvent(this.guid));
    };
}
