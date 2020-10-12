// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeTimeTriggerButtonLabels';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { EDIT_START_TIME_TRIGGERS } from 'builder_platform_interaction/elementConfig';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { ArrowDown, ArrowUp } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

export default class startNodeTimeTriggerButton extends LightningElement {
    @api
    node = {
        config: {}
    };

    // Used for testing purposes
    @api
    keyboardInteractions;

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get setTimeTiggerLabel() {
        return LABELS.startElementSetTimeTrigger;
    }

    // TODO
    get isTimeTriggerSet() {
        return false;
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    handleObjectClick = (event) => {
        event.stopPropagation();
        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, EDIT_START_TIME_TRIGGERS);
        this.dispatchEvent(editElementEvent);
    };

    /**
     * Helper function to dispatch the ArrowKeyDownEvent event that'll be handled
     * in flcNodeStartMenu
     * @param key - The arrow key pressed
     */
    handleArrowKeyDown(key) {
        const arrowKeyDownEvent = new ArrowKeyDownEvent(key);
        this.dispatchEvent(arrowKeyDownEvent);
    }

    setupCommandsAndShortcuts() {
        const arrowDownCommand = new ArrowDown(() => this.handleArrowKeyDown('arrowDown'));
        const arrowUpCommand = new ArrowUp(() => this.handleArrowKeyDown('arrowUp'));
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
}
