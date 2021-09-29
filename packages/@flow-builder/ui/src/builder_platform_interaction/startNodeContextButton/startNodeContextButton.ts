import { LightningElement, api } from 'lwc';
import { CONDITION_LOGIC, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { LABELS } from './startNodeContextButtonLabels';
import {
    EDIT_START_RECORD_CHANGE_CONTEXT,
    EDIT_START_SCHEDULE_CONTEXT,
    EDIT_START_JOURNEY_CONTEXT
} from 'builder_platform_interaction/elementConfig';
import { EditElementEvent, ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { commands, keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { BaseKeyboardInteraction, Keys, createShortcut, withKeyboardInteractions } = keyboardInteractionUtils;
const { BEFORE_SAVE, BEFORE_DELETE, AFTER_SAVE, SCHEDULED, SCHEDULED_JOURNEY } = FLOW_TRIGGER_TYPE;

const selectors = {
    button: '.button'
};
export default class StartNodeContextButton extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    node!: UI.Start;

    @api
    focus() {
        this.dom.button.focus();
    }

    get unsetStartButtonClasses() {
        return 'unset-start-button slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get startButtonClasses() {
        return 'start-button-trigger-context slds-p-vertical_x-small slds-p-horizontal_medium';
    }

    get chooseContext() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
                return LABELS.startElementChooseObject;
            case BEFORE_DELETE:
                return LABELS.startElementChooseObject;
            case SCHEDULED:
                return LABELS.startElementChooseObject;
            case SCHEDULED_JOURNEY:
                return LABELS.startElementChooseAudience;
            default:
                return '';
        }
    }

    get isOptional() {
        return this.node.triggerType === SCHEDULED ? true : false;
    }

    get optionalLabel() {
        return LABELS.startElementOptional;
    }

    get isContextSet() {
        switch (this.node.triggerType) {
            case SCHEDULED_JOURNEY:
                return !!this.node.objectContainer;
            default:
                return !!this.node.object;
        }
    }

    get objectLabel() {
        return LABELS.startElementObject;
    }

    get selectedObject() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_SAVE:
            case BEFORE_DELETE:
            case SCHEDULED: {
                const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
                return item ? item.displayText : this.node.object;
            }
            default:
                return this.node.object;
        }
    }

    get editLabel() {
        return LABELS.startElementEdit;
    }

    get isConditions() {
        return !!(this.node.filterLogic && this.node.filterLogic !== CONDITION_LOGIC.NO_CONDITIONS);
    }

    get recordConditionsLabel() {
        return LABELS.startElementRecordConditions;
    }

    get conditionsLengthLabel() {
        return this.node.filters?.length;
    }

    getContextMode() {
        switch (this.node.triggerType) {
            case AFTER_SAVE:
            case BEFORE_DELETE:
            case BEFORE_SAVE:
                return EDIT_START_RECORD_CHANGE_CONTEXT;
            case SCHEDULED:
                return EDIT_START_SCHEDULE_CONTEXT;
            case SCHEDULED_JOURNEY:
                return EDIT_START_JOURNEY_CONTEXT;
            default:
                return undefined;
        }
    }

    handleObjectClick = (event?: Event) => {
        if (event) {
            event.stopPropagation();
        }

        const canvasElementGUID = this.node.guid;
        const editElementEvent = new EditElementEvent(canvasElementGUID, this.getContextMode());
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
                createShortcut(Keys.ArrowDown, new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME))),
                createShortcut(Keys.ArrowUp, new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME)))
            ])
        ];
    }
}
