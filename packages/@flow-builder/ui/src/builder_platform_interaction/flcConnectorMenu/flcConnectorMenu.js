import { api } from 'lwc';
import { AddElementEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';
import { MenuConfiguration } from './flcConnectorMenuConfig';
/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class FlcConnectorMenu extends Menu {
    @api
    childIndex;

    @api
    menuConfiguration = MenuConfiguration;

    @api
    next;

    @api
    parent;

    @api
    prev;

    handleSelectMenuItem(event) {
        this.dispatchEvent(new ToggleMenuEvent({}));
        this.dispatchEvent(
            new AddElementEvent(
                event.target.getAttribute('data-value'),
                0,
                0,
                this.prev,
                this.next,
                this.parent,
                this.childIndex
            )
        );
    }
}
