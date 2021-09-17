import { LightningElement, api } from 'lwc';
import { ArrowKeyDownEvent } from 'builder_platform_interaction/events';
import { LABELS } from './startNodeFlowExplorerEntryPointLabels';
import { commands, commonUtils, lwcUtils, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
import { setupKeyboardShortcutUtil } from 'builder_platform_interaction/contextualMenuUtils';
import { getEntitiesMenuData } from 'builder_platform_interaction/expressionUtils';
import { getWorkflowEnabledEntities } from 'builder_platform_interaction/sobjectLib';

const { format } = commonUtils;
const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    button: '.button'
};
const explorerUrl = '/interaction_explorer/flowExplorer.app?object={0}&recordTriggerType={1}';

export default class StartNodeFlowExplorerEntryPoint extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    @api
    node!: UI.Start;

    // Used for testing purposes
    @api
    keyboardInteractions;

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

    constructor() {
        super();
        this.keyboardInteractions = new KeyboardInteractions();
    }

    connectedCallback() {
        this.keyboardInteractions.addKeyDownEventListener(this.template);
        this.setupCommandsAndShortcuts();
    }

    disconnectedCallback() {
        this.keyboardInteractions.removeKeyDownEventListener(this.template);
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

    setupCommandsAndShortcuts() {
        const keyboardCommands = {
            Enter: new EnterCommand(() => this.handleSpaceOrEnter()),
            ' ': new SpaceCommand(() => this.handleSpaceOrEnter()),
            ArrowDown: new ArrowDown(() => this.handleArrowKeyDown(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeyDown(ArrowUp.COMMAND_NAME))
        };
        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
    }
}
