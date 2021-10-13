import { LightningElement, api } from 'lwc';
import { LABELS } from './startNodeScheduledPathButtonLabels';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { EDIT_START_SCHEDULED_PATHS } from 'builder_platform_interaction/elementConfig';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { commonUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { withKeyboardInteractions, BaseKeyboardInteraction, createShortcut, Keys } = keyboardInteractionUtils;

const selectors = {
    button: '.button'
};
export default class StartNodeScheduledPathButton extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    node!: UI.Start;

    @api
    focus() {
        this.dom.button.focus();
    }

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium slds-truncate';
    }

    get startButtonClasses() {
        return 'start-button-scheduled-path slds-p-vertical_x-small slds-p-horizontal_medium';
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

    handleObjectClick = (event?: Event) => {
        if (event) {
            event.stopPropagation();
        }

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, EDIT_START_SCHEDULED_PATHS);
        this.dispatchEvent(editElementEvent);
    };

    /**
     * Helper function to dispatch the ArrowKeyDownEvent event that'll be handled
     * in alcStartMenu
     *
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

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(Keys.Enter, new EnterCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.Space, new SpaceCommand(() => this.handleSpaceOrEnter())),
                createShortcut(Keys.ArrowDown, new ArrowDown(() => this.handleArrowKeyDown(Keys.ArrowDown))),
                createShortcut(Keys.ArrowUp, new ArrowUp(() => this.handleArrowKeyDown(Keys.ArrowUp)))
            ])
        ];
    }
}
