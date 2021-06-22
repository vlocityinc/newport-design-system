import { LightningElement, api } from 'lwc';
import { NodeResizeEvent } from 'builder_platform_interaction/alcEvents';
import { AddElementEvent, DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { StageStep } from 'builder_platform_interaction/elementFactory';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { LABELS } from './orchestratedStageNodeLabels';
import { format } from 'builder_platform_interaction/commonUtils';
import { setupKeyboardShortcutUtil } from 'builder_platform_interaction/contextualMenuUtils';
import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { ArrowDown, ArrowUp, EnterCommand, SpaceCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

const selectors = {
    stepItem: 'div[role="option"]',
    addStepItemButton: 'button.add-item',
    deleteStepItemButton: 'button.delete-item'
};

export default class OrchestratedStageNode extends LightningElement {
    labels = LABELS;

    private _node?: NodeRenderInfo;

    private itemsHeader?: string;

    private width?: number;
    private height?: number;

    private _items: (StageStep & { tabIndex: number; ariaSelected: boolean })[] = [];

    set items(steps) {
        this._items = steps;
    }

    get items() {
        return this.computeStepItems(this._items, this.activeElementGuid);
    }

    @api
    isDefaultMode?: boolean;

    @api
    keyboardInteractions;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    @api
    get node() {
        return this._node;
    }

    set node(node) {
        this._node = node;

        // Refresh StageStep if needed
        if (node && node.metadata.dynamicNodeComponentSelector) {
            this.items = node.metadata.dynamicNodeComponentSelector(node.guid);

            this.itemsHeader =
                this.items.length === 1
                    ? this.labels.stageStepHeaderSingular
                    : format(this.labels.stageStepHeaderPlural, this.items.length);
        }
    }

    /**
     * Fires a NodeResizeEvent if the dimensions change after rendering
     */
    renderedCallback() {
        const node: HTMLElement = this.template.querySelector('div');

        if (node && this.node) {
            const rect: DOMRect = node.getBoundingClientRect();

            // Only fire the event if the height or width have changed
            if (rect.width !== this.width || rect.height !== this.height) {
                this.width = rect.width;
                this.height = rect.height;
                const event = new NodeResizeEvent(this.node.guid, this.width, this.height);
                this.dispatchEvent(event);
            }
        }
    }

    connectedCallback() {
        this.setupCommandsAndShortcuts();
    }

    /**
     * Helper function to move the focus when using arrow keys in a stage node
     *
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeys(key: string) {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const stepItems = Array.from(this.template.querySelectorAll(selectors.stepItem)) as any;
            if (stepItems.includes(currentItemInFocus)) {
                this.moveFocusOnArrowKey(stepItems, currentItemInFocus, key);
            }
        }
    }

    /**
     * Helper function used following an enter/space key command on a stage's step element
     */
    handleEnterOrSpaceKey() {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const stepItems = Array.from(this.template.querySelectorAll(selectors.stepItem)) as any;
            const deleteItemButtons = Array.from(this.template.querySelectorAll(selectors.deleteStepItemButton)) as any;

            if (stepItems.includes(currentItemInFocus)) {
                this.handleOpenItemPropertyEditor(undefined, currentItemInFocus);
            } else if (deleteItemButtons.includes(currentItemInFocus)) {
                this.handleDeleteItem(undefined, currentItemInFocus);
            } else if (currentItemInFocus === this.template.querySelector(selectors.addStepItemButton)) {
                this.handleAddItem(undefined, true);
            }
        }
    }

    /**
     * Adding StageStep directly from canvas
     *
     * @param event - mouse event on Add Step button
     * @param designateFocus - indicates whether or not to designate focus to the property editor when opened
     */
    handleAddItem(event?: MouseEvent, designateFocus = false) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const addItemEvent = new AddElementEvent({
            elementType: ELEMENT_TYPE.STAGE_STEP,
            // TODO this should come from the step type menu
            actionType: ACTION_TYPE.CREATE_WORK_ITEM,
            parent: this.node && this.node.guid,
            designateFocus
        });
        this.dispatchEvent(addItemEvent);
    }

    /**
     * Open property editor for child element directly from canvas
     *
     * @param event - the mouse event upon the target element to open the editor for
     * @param target - the exact target element from a enter/space press to open the editor for
     */
    handleOpenItemPropertyEditor(event?: MouseEvent, target?: HTMLElement) {
        // if target exists, this was triggered via keyboard, in which case we want to focus the property editor
        const designateFocus = !!target;

        if (event) {
            event.preventDefault();
            event.stopPropagation();

            target = event.currentTarget as HTMLElement;
        }

        if (this.isDefaultMode) {
            this.dispatchEvent(
                new EditElementEvent(
                    target && target.dataset.itemGuid,
                    undefined,
                    ELEMENT_TYPE.STAGE_STEP,
                    designateFocus
                )
            );
        }
    }

    /**
     * Deleting StageStep directly from canvas
     *
     * @param event - the mouse event upon the target element's delete button
     * @param target - the exact target element from a enter/space press on the delete button
     */
    handleDeleteItem(event?: MouseEvent, target?: HTMLElement) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();

            event.stopPropagation();
            target = event.currentTarget as HTMLElement;
        }

        if (this.isDefaultMode && target && target.dataset.itemGuid) {
            this.dispatchEvent(
                new DeleteElementEvent(
                    [target.dataset.itemGuid],
                    ELEMENT_TYPE.STAGE_STEP,
                    undefined,
                    this.node && this.node.guid
                )
            );
        }
    }

    /**
     * Initializer, Indexer, and Aria-Selection State Manager - used to map the proper a11y tab-indexes and
     * aria-selection (editing) states for a stage's step items
     *
     * @param items - an array of step items defined in the stage
     * @param items.tabIndex - should be 0 for the first step element or the last item to be (focused or active) and -1 for all others
     * @param items.ariaSelected - should only ever be true for 0 or 1 step - represents the step currently being edited
     * @param activeElementGuid - the guid of the step which is currently being edited in the property editor panel
     * in the property editor panel
     * @returns - a list of computed step items with aria-selected and tab-index properties
     */
    computeStepItems(
        items: (StageStep & { tabIndex: number; ariaSelected: boolean })[],
        activeElementGuid: string | null
    ) {
        let indexedItem;
        let activeItem;
        if (items.length) {
            items.forEach((item, i) => {
                item.ariaSelected = false;

                if (item.guid === activeElementGuid) {
                    item.ariaSelected = true;
                }
                if (item.ariaSelected) {
                    activeItem = item;
                }
                // if its the first step, or if it was the last focused, or if it was the last edited
                // note: tab focus should prioritize: last active > last focused > first step
                if (i === 0 || (item.tabIndex === 0 && !activeItem) || item.ariaSelected) {
                    indexedItem = item;
                }

                item.tabIndex = -1;
            });
            indexedItem.tabIndex = 0;
        }
        return items;
    }

    /**
     * Utility method for moving focus between step items via keyboard presses
     *
     * @param stepItems - an array of step items defined in the stage
     * @param currentItemInFocus - the stepItem element the currently has tab focus
     * @param key - the name of the key being pressed
     */
    moveFocusOnArrowKey(stepItems: HTMLElement[], currentItemInFocus: HTMLElement, key: string) {
        if (stepItems.includes(currentItemInFocus)) {
            const currentFocusIndex = stepItems.indexOf(currentItemInFocus);

            let nextFocusIndex = key === ArrowDown.COMMAND_NAME ? currentFocusIndex + 1 : currentFocusIndex - 1;

            if (nextFocusIndex >= stepItems.length) {
                // when the bottom of the step list is reached, focus the top step
                nextFocusIndex = 0;
            } else if (nextFocusIndex < 0) {
                // when the top of the step list is reached, focus the bottom step
                nextFocusIndex = stepItems.length - 1;
            }
            if (this.items.length) {
                // remove the tabIndex from current focused item, and add it to the next focused item
                this.items = this.items.map((item, index) => {
                    item.tabIndex = index === nextFocusIndex ? 0 : -1;
                    return item;
                });
            }

            stepItems[nextFocusIndex].focus();
        }
    }

    /**
     * Helper function used for mapping component level key actions to their handlers
     */
    setupCommandsAndShortcuts() {
        this.keyboardInteractions = new KeyboardInteractions();
        this.keyboardInteractions.addKeyDownEventListener(this.template);

        const keyboardCommands = {
            ArrowDown: new ArrowDown(() => this.handleArrowKeys(ArrowDown.COMMAND_NAME)),
            ArrowUp: new ArrowUp(() => this.handleArrowKeys(ArrowUp.COMMAND_NAME)),
            Enter: new EnterCommand(() => this.handleEnterOrSpaceKey()),
            ' ': new SpaceCommand(() => this.handleEnterOrSpaceKey())
        };

        setupKeyboardShortcutUtil(this.keyboardInteractions, keyboardCommands);
    }
}
