// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { getStyleFromGeometry } from 'builder_platform_interaction/alcComponentsUtils';
import { SelectMenuItemEvent, CloseMenuEvent, MoveFocusToNodeEvent } from 'builder_platform_interaction/alcEvents';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import {
    setupKeyboardShortcutUtil,
    setupKeyboardShortcutWithShiftKey
} from 'builder_platform_interaction/contextualMenuUtils';
const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand, EscapeCommand, TabCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

export default class Menu extends LightningElement {
    @api top;
    @api left;
    @api items;

    @api
    moveFocusToMenu;

    keyboardInteractions = new KeyboardInteractions();

    tabFocusRingIndex = 0;

    tabFocusRingCmds = [() => {}];

    get style() {
        return getStyleFromGeometry({ y: this.top + 10, x: this.left });
    }

    getFocusRingCmds() {
        return this.tabFocusRingCmds;
    }

    handleSelectItem(event) {
        this.dispatchEvent(new SelectMenuItemEvent({ value: event.detail.value }));
    }

    calcaulateTabFocusRingIdx(shift: boolean, tabFocusRingIndex: number, tabFocusRingCmds: Array) {
        let newTabFocusRingIdx = shift ? tabFocusRingIndex - 1 : (tabFocusRingIndex + 1) % tabFocusRingCmds.length;
        if (newTabFocusRingIdx === -1) {
            newTabFocusRingIdx = tabFocusRingCmds.length - 1;
        }
        return newTabFocusRingIdx;
    }

    handleTabCommand(shift: boolean) {
        const tabFocusRingIndex = this.tabFocusRingIndex;
        const tabFocusRingCmds = this.getFocusRingCmds();
        this.tabFocusRingIndex = this.calcaulateTabFocusRingIdx(shift, tabFocusRingIndex, tabFocusRingCmds);
        tabFocusRingCmds[this.tabFocusRingIndex]();
    }

    handleEscape() {
        this.dispatchEvent(new CloseMenuEvent());
        this.dispatchEvent(new MoveFocusToNodeEvent(this.guid));
    }

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)),
            Escape: new EscapeCommand(() => this.handleEscape()),
            Tab: new TabCommand(() => this.handleTabCommand(false), false)
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
        const shiftTabCommand = new TabCommand(() => this.handleTabCommand(true), true);
        setupKeyboardShortcutWithShiftKey(this.keyboardInteractions, shiftTabCommand, 'Tab');
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
    }
}
