import { api, track } from 'lwc';
import { AddElementEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';

import { configureMenu } from './flcConnectorMenuConfig';

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class FlcConnectorMenu extends Menu {
    @api
    childIndex;

    @api
    set elementsMetadata(elementsMetadata) {
        this.menuConfiguration = configureMenu(elementsMetadata);
        this._elementsMetadata = elementsMetadata;
    }

    get elementsMetadata() {
        return this._elementsMetadata;
    }

    @api
    next;

    @api
    parent;

    @api
    prev;

    @track
    menuConfiguration = [];

    _elementsMetadata = [];

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
