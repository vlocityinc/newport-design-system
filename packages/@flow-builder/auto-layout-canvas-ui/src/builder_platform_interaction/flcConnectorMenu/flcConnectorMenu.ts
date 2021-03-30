import { Guid, ElementMetadata } from 'builder_platform_interaction/autoLayoutCanvas';

import { api } from 'lwc';
import { AddElementEvent } from 'builder_platform_interaction/events';
import {
    CloseMenuEvent,
    PasteEvent,
    MoveFocusToConnectorEvent,
    GoToPathEvent,
    DeleteGoToConnectionEvent
} from 'builder_platform_interaction/flcEvents';
import Menu from 'builder_platform_interaction/menu';
import { configureMenu, PASTE_ACTION, GOTO_ACTION, GOTO_DELETE_ACTION } from './flcConnectorMenuConfig';
import { LABELS } from './flcConnectorMenuLabels';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    moveFocusInMenuOnArrowKeyDown,
    setupKeyboardShortcutUtil
} from 'builder_platform_interaction/contextualMenuUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand, EscapeCommand } = commands;
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
    canAddGoto!: boolean;

    @api
    isGoToConnector!: boolean;

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
    }

    /**
     * Menu item action behaviour dependent on yjr attributes of the selected element
     * @param currentTarget
     */
    doSelectMenuItem(currentTarget: HTMLElement) {
        this.dispatchEvent(new CloseMenuEvent());
        const action = currentTarget.getAttribute('data-value');

        switch (action) {
            case PASTE_ACTION:
                this.dispatchEvent(new PasteEvent(this.prev!, this.next!, this.parent!, this.childIndex!));
                this.dispatchEvent(new MoveFocusToConnectorEvent(this.prev || this.parent, this.childIndex));
                break;
            case GOTO_ACTION:
                this.dispatchEvent(
                    new GoToPathEvent(this.next!, this.prev, this.parent, this.childIndex, this.canMergeEndedBranch)
                );
                break;
            case GOTO_DELETE_ACTION:
                this.dispatchEvent(new DeleteGoToConnectionEvent(this.prev || this.parent, this.childIndex));
                break;
            default: {
                const { prev, parent, childIndex } = this;
                const alcInsertAt = prev ? { prev } : { parent, childIndex };

                this.dispatchEvent(
                    // @ts-ignore
                    new AddElementEvent({
                        elementType: currentTarget.getAttribute('data-value')!,
                        elementSubtype: currentTarget.getAttribute('data-sub-type')!,
                        locationX: 0,
                        locationY: 0,
                        alcInsertAt
                    })
                );
            }
        }
    }

    /**
     * Item selected via mouse click.  Does not propagate
     * @param event
     */
    handleSelectMenuItem(event) {
        event.stopPropagation();
        this.doSelectMenuItem(event.currentTarget);
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
            this.doSelectMenuItem(currentItemInFocus.parentElement);
        }
    }

    handleEscape() {
        this.dispatchEvent(new CloseMenuEvent());
        this.dispatchEvent(new MoveFocusToConnectorEvent(this.prev || this.parent, this.childIndex));
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)),
            Escape: new EscapeCommand(() => this.handleEscape())
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
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
