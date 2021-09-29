import { LightningElement, api } from 'lwc';
import { ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { LABELS } from './startNodeFlowExplorerEntryPointLabels';
import { commands, commonUtils, lwcUtils, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { getWorkflowEnabledEntities } from 'builder_platform_interaction/sobjectLib';

const { format } = commonUtils;
const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { BaseKeyboardInteraction, KeyboardInteractions, Keys, createShortcut, withKeyboardInteractions } =
    keyboardInteractionUtils;

const selectors = {
    button: '.button'
};
const explorerUrl = '/interaction_explorer/flowExplorer.app?object={0}&recordTriggerType={1}';

export default class StartNodeFlowExplorerEntryPoint extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    node!: UI.Start;

    @api
    focus() {
        this.dom.button.focus();
    }

    getDurableId() {
        return getWorkflowEnabledEntities()
            .filter((entity) => entity.apiName === this.node.object)
            .map((e) => e.durableId)?.[0];
    }

    get entryPointLabel() {
        const item = getEntitiesMenuData().find((menuItem) => menuItem.value === this.node.object);
        const sObject = item ? item.displayText : this.node.object;
        return format(LABELS.startNodeFlowExplorerEntryPointLabel, sObject);
    }

    handleClick = (event?: Event) => {
        if (event) {
            event.stopPropagation();
        }

        window.open(format(explorerUrl, this.getDurableId(), this.node.recordTriggerType), '_blank');
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
        this.handleClick();
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
