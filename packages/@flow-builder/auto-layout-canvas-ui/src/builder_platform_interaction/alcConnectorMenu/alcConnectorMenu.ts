import { Guid, ElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';

import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import {
    PasteOnCanvasEvent,
    MoveFocusToConnectorEvent,
    GoToPathEvent,
    DeleteGoToConnectionEvent
} from 'builder_platform_interaction/alcEvents';
import Menu from 'builder_platform_interaction/menu';
import {
    configureMenu,
    PASTE_ACTION,
    GOTO_ACTION,
    GOTO_DELETE_ACTION,
    GOTO_REROUTE_ACTION
} from './alcConnectorMenuConfig';
import { LABELS } from './alcConnectorMenuLabels';
import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { KeyboardInteractions } = keyboardInteractionUtils;

enum TabFocusRingItems {
    Icon = 0,
    ListItems = 1
}

// TODO: W-9581902: Make alcConnectorMenu use the popover component

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class AlcConnectorMenu extends Menu {
    @api
    childIndex!: number;

    @api
    elementsMetadata: ElementMetadata[] = [];

    @api
    next!: Guid;

    @api
    parent!: Guid;

    @api
    prev!: Guid;

    @api
    isPasteAvailable!: boolean;

    /* whether the end element should be shown in the menu */
    @api
    hasEndElement!: boolean;

    @api
    canAddGoto!: boolean;

    @api
    isGoToConnector!: boolean;

    // Used for testing purposes
    @api
    keyboardInteractions;

    get menuConfiguration() {
        return configureMenu(
            this.elementsMetadata,
            this.hasEndElement,
            this.isPasteAvailable,
            this.canAddGoto,
            this.isGoToConnector
        );
    }

    get labels(): Labels {
        return LABELS;
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
        this.tabFocusRingIndex = TabFocusRingItems.Icon;
    }

    /**
     * Menu item action behaviour dependent on the attributes of the selected element
     *
     * @param currentTarget the HTML element selected in the menu
     */
    doSelectMenuItem(currentTarget: HTMLElement) {
        super.doSelectMenuItem(currentTarget);

        const action = currentTarget.getAttribute('data-value');

        switch (action) {
            case PASTE_ACTION:
                this.dispatchEvent(new PasteOnCanvasEvent(this.prev, this.next, this.parent, this.childIndex));
                this.moveFocusToConnector();
                break;
            case GOTO_ACTION:
                this.dispatchEvent(new GoToPathEvent(this.next, this.prev, this.parent, this.childIndex));
                break;
            case GOTO_DELETE_ACTION:
                this.dispatchEvent(new DeleteGoToConnectionEvent(this.prev || this.parent, this.childIndex));
                break;
            case GOTO_REROUTE_ACTION:
                this.dispatchEvent(new GoToPathEvent(this.next, this.prev, this.parent, this.childIndex, true));
                break;
            default: {
                const { prev, parent, childIndex } = this;
                const alcConnectionSource = { guid: prev || parent, childIndex };

                this.dispatchEvent(
                    new AddElementEvent({
                        elementType: currentTarget.getAttribute('data-value')!,
                        elementSubtype: currentTarget.getAttribute('data-sub-type')!,
                        locationX: 0,
                        locationY: 0,
                        alcConnectionSource,
                        designateFocus: true
                    })
                );
            }
        }
    }

    /**
     * Moves the focus back to the connector trigger
     */
    moveFocusToConnector() {
        this.dispatchEvent(new MoveFocusToConnectorEvent(this.prev || this.parent, this.childIndex));
    }

    /**
     * Closes the menu and moves the focus back to the connector trigger
     */
    handleEscape() {
        super.handleEscape();
        this.moveFocusToConnector();
    }

    tabFocusRingCmds = [
        // focus on the connector icon
        () => this.moveFocusToConnector(),
        // focus on the first item
        () => this.moveFocusToFirstListItem()
    ];
}
