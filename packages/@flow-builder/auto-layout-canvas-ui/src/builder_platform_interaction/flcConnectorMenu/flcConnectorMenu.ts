import { Guid, ElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';

import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import { CloseMenuEvent, PasteEvent, MergeWithExistingPathEvent } from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { configureMenu, PASTE_ACTION, MERGE_PATH_ACTION } from './flcConnectorMenuConfig';
import { LABELS } from './flcConnectorMenuLabels';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { moveFocusInMenuOnArrowKeyDown } from 'builder_platform_interaction/contextualMenuUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    menuItem: 'div[role="option"]'
};

/**
 * The connector menu overlay. It is displayed when clicking on a connector.
 */
export default class FlcConnectorMenu extends Menu {
    @api
    childIndex!: number;

    @api
    elementsMetadata: ElementMetadata[] = [];

    /* true if this branch can be merged, false otherwise*/
    @api
    canMergeEndedBranch!: boolean;

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
    openedWithKeyboard;

    // Used for testing purposes
    @api
    keyboardInteractions;

    get menuConfiguration() {
        return configureMenu(
            this.elementsMetadata,
            this.hasEndElement,
            this.isPasteAvailable,
            this.canMergeEndedBranch
        );
    }

    get labels(): Labels {
        return LABELS;
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    handleSelectMenuItem(event) {
        this.dispatchEvent(new CloseMenuEvent());
        const action = event.currentTarget.getAttribute('data-value');

        switch (action) {
            case PASTE_ACTION:
                this.dispatchEvent(new PasteEvent(this.prev!, this.next!, this.parent!, this.childIndex!));
                break;
            case MERGE_PATH_ACTION:
                this.dispatchEvent(new MergeWithExistingPathEvent(this.next!));
                break;
            default:
                this.dispatchEvent(
                    // @ts-ignore
                    new AddElementEvent({
                        elementType: event.currentTarget.getAttribute('data-value'),
                        elementSubtype: event.currentTarget.getAttribute('data-sub-type'),
                        locationX: 0,
                        locationY: 0,
                        prev: this.prev,
                        next: this.next,
                        parent: this.parent,
                        childIndex: this.childIndex
                    })
                );
        }
    }

    /**
     * Helper function to move the focus correctly when using arrow keys in the contextual menu
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeyDown(key) {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as any;
            moveFocusInMenuOnArrowKeyDown(items, currentItemInFocus, key);
        }
    }

    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const event = { currentTarget: currentItemInFocus.parentElement };
            this.handleSelectMenuItem(event);
        }
    }

    setupCommandsAndShortcuts() {
        const arrowDownCommand = new ArrowDown(() => this.handleArrowKeyDown('arrowDown'));
        const arrowUpCommand = new ArrowUp(() => this.handleArrowKeyDown('arrowUp'));
        const enterCommand = new EnterCommand(() => this.handleSpaceOrEnter());
        const spaceCommand = new SpaceCommand(() => this.handleSpaceOrEnter());
        this.keyboardInteractions.setupCommandAndShortcut(enterCommand, { key: 'Enter' });
        this.keyboardInteractions.setupCommandAndShortcut(spaceCommand, { key: ' ' });
        this.keyboardInteractions.setupCommandAndShortcut(arrowDownCommand, { key: 'ArrowDown' });
        this.keyboardInteractions.setupCommandAndShortcut(arrowUpCommand, { key: 'ArrowUp' });
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }

    renderedCallback() {
        if (this.openedWithKeyboard) {
            const items = Array.from(this.template.querySelectorAll(selectors.menuItem)) as any;
            if (items.length > 0) {
                items[0].focus();
            }
        }
    }
}
