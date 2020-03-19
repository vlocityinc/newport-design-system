import { api, track } from 'lwc';
import { AddElementEvent, PasteEvent, ToggleMenuEvent } from 'builder_platform_interaction/events';
import Menu from 'builder_platform_interaction/menu';

import { configureMenu, PASTE_ACTION } from './flcConnectorMenuConfig';

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class FlcConnectorMenu extends Menu {
    @api
    childIndex;

    @api
    set elementsMetadata(elementsMetadata) {
        const showEndElement = this.next == null;
        this.menuConfiguration = configureMenu(elementsMetadata, showEndElement, this.isPasteAvailable);
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

    @api
    isPasteAvailable;

    @track
    menuConfiguration = [];

    _elementsMetadata = [];

    handleSelectMenuItem(event) {
        this.dispatchEvent(new ToggleMenuEvent({}));
        if (event.currentTarget.getAttribute('data-value') === PASTE_ACTION) {
            const pasteEvent = new PasteEvent(this.prev, this.next, this.parent, this.childIndex);
            this.dispatchEvent(pasteEvent);
        } else {
            this.dispatchEvent(
                new AddElementEvent(
                    event.currentTarget.getAttribute('data-value'),
                    0,
                    0,
                    null,
                    null,
                    this.prev,
                    this.next,
                    this.parent,
                    this.childIndex
                )
            );
        }
    }
}
