// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeTimeTriggerButtonLabels';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { EDIT_START_TIME_TRIGGERS } from 'builder_platform_interaction/elementConfig';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { format } from 'builder_platform_interaction/commonUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
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
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium slds-truncate';
    }

    get startButtonClasses() {
        return 'start-button-time-trigger slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get addScheduledPathsLabel() {
        return LABELS.startElementAddScheduledPathsLabel;
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get hasScheduledPaths() {
        return this.node.childReferences && this.node.childReferences.length > 0;
    }

    get scheduledPathsLabel() {
        return LABELS.startElementScheduledPaths;
    }

    get scheduledPathsAmount() {
        return this.node.childReferences.length + 1;
    }

    get scheduledPathsTitle() {
        return format(LABELS.startElementScheduledPathsTitle, this.node.childReferences.length + 1);
    }

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    handleObjectClick = (event) => {
        if (event) {
            event.stopPropagation();
        }

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

    /**
     * Helper function used during keyboard commands
     */
    handleSpaceOrEnter() {
        this.handleObjectClick();
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
}
