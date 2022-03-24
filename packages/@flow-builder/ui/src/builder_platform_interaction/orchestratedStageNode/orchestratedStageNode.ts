import { getDomElementGeometry, scheduleTask } from 'builder_platform_interaction/alcComponentsUtils';
import { NodeResizeEvent, PopoverToggledEvent } from 'builder_platform_interaction/alcEvents';
import { NodeRenderInfo } from 'builder_platform_interaction/autoLayoutCanvas';
import { StageStep } from 'builder_platform_interaction/elementFactory';
import { DeleteElementEvent, EditElementEvent } from 'builder_platform_interaction/events';
import { ELEMENT_TYPE, ICONS } from 'builder_platform_interaction/flowMetadata';
import { commands, commonUtils, keyboardInteractionUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import LightningPopup from 'lightning/popup';
import { api, LightningElement } from 'lwc';
import { LABELS } from './orchestratedStageNodeLabels';

const { BaseKeyboardInteraction, withKeyboardInteractions, createShortcut, Keys } = keyboardInteractionUtils;
const { EnterCommand, SpaceCommand, ArrowDown, ArrowUp } = commands;

const { format } = commonUtils;

const selectors = {
    stepItem: 'div[role="option"]',
    deleteStepItemButton: 'button.delete-item',
    stepMenuTrigger: 'button.step-menu-trigger',
    stepMenuContainer: '.stepMenuContainer',
    lightningPopup: 'lightning-popup',
    options: '[role="option"]'
};

export default class OrchestratedStageNode extends withKeyboardInteractions(LightningElement) {
    dom = lwcUtils.createDomProxy(this, selectors);

    labels = LABELS;

    private _node?: NodeRenderInfo;

    private _lastFocusedItemGuid?: string;

    private itemsHeader?: string;

    private width?: number;

    private height?: number;

    private _items: (StageStep & { tabIndex: number; ariaSelected: boolean })[] = [];

    private isStepMenuOpened = false;

    // used to prevent double triggering of the menu popup (before and after a click)
    private originalIsStepMenuOpened = false;

    get popup() {
        return this.dom.as<LightningPopup>().lightningPopup;
    }

    get stepMenuButtonIcon() {
        return this.isStepMenuOpened ? ICONS.closeStepMenu : ICONS.openStepMenu;
    }

    get stepMenuButtonLabel() {
        return this.isStepMenuOpened ? LABELS.cancelButton : LABELS.addNewStageStep;
    }

    get nodeLabel() {
        // @ts-ignore
        return this.node?.node?.label;
    }

    set items(steps) {
        this._items = steps;
    }

    get items() {
        return this.computeStepItems(this._items);
    }

    @api
    isDefaultMode?: boolean;

    @api
    disableDeleteElements;

    @api
    disableEditElements;

    /**
     * The active element refers to the element currently being edited using the property editor panel
     */
    @api
    activeElementGuid;

    @api
    get node() {
        return this._node;
    }

    @api
    canvasContext;

    get disableAddElements() {
        return this.canvasContext.connectorMenuMetadata == null;
    }

    get stageStepsWithErrorClass() {
        const baseClasses = 'item slds-p-around_small slds-clearfix slds-listbox__option';

        return this.items.map((item) => ({
            ...item,
            cssClass: baseClasses + (item.config.hasError ? ' stage-step-error' : ''),
            stepLabelCssClass: 'itemLabel' + (item.config.hasError ? ' stage-step-label-error' : '')
        }));
    }

    get errorStateMessage() {
        return LABELS.stageStepErrorStateLabel;
    }

    set node(node: NodeRenderInfo | undefined) {
        this._node = node;

        // Refresh StageStep if needed
        if (node && node.metadata.dynamicNodeComponentSelector) {
            this.items = node.metadata.dynamicNodeComponentSelector(node.guid);

            this.itemsHeader =
                this.items.length === 1
                    ? this.labels.stageStepHeaderSingular
                    : format(this.labels.stageStepHeaderPlural, this.items.length);
        }

        // resize after the next render
        scheduleTask(() => this.resize());
    }

    @api
    findNode(guid: string) {
        return this.dom.all.options.find((ele) => ele.dataset.itemGuid === guid);
    }

    /**
     * Helper function for resizing the node
     *
     * @fires NodeResizeEvent
     */
    resize() {
        const { w, h } = getDomElementGeometry(this.template.host);

        // Only fire the event if the height or width have changed
        if ((this.width !== w || this.height !== h) && this.node != null) {
            this.width = w;
            this.height = h;

            const event = new NodeResizeEvent(this.node.guid, w, h);
            this.dispatchEvent(event);
        }
    }

    /**
     * Handler used to hack the trigger button to prevent a double trigger from occurring on click
     */
    handleButtonPreClick() {
        this.originalIsStepMenuOpened = this.isStepMenuOpened;
    }

    /**
     * StageStepMenu Trigger used to show and close the lightning popup component
     */
    triggerStageStepMenu() {
        if (!this.isStepMenuOpened && !this.originalIsStepMenuOpened) {
            const referenceElement = this.dom.stepMenuTrigger;
            this.popup.show(referenceElement, {
                reference: { horizontal: 'center', vertical: 'bottom' },
                popup: { horizontal: 'center', vertical: 'top' },
                autoFlip: false
            });
            this.isStepMenuOpened = true;
        } else {
            this.popup.close();
            this.isStepMenuOpened = false;
        }
        this.dispatchEvent(new PopoverToggledEvent(this.isStepMenuOpened));
        this.originalIsStepMenuOpened = this.isStepMenuOpened;
    }

    /**
     * Handler for the 'close' event - used to toggle the trigger icon/label via the isStepMenuOpened flag
     */
    handleCloseStepMenu() {
        this.isStepMenuOpened = false;
        this.dispatchEvent(new PopoverToggledEvent(false));
    }

    /**
     * Event handler for FocusOutEvent used to return focus to menu trigger
     * Additional Note: fired in the stage step menu on esc/tab key
     *
     * @param event - FocusOutEvent used to stop the event from propagating
     */
    handleCanvasFocusOut(event) {
        event.stopPropagation();

        this.dom.stepMenuTrigger.focus();
    }

    /**
     * Helper function to move the focus when using arrow keys in a stage node
     *
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeys(key: string) {
        const currentItemInFocus = this.template.activeElement;
        if (currentItemInFocus) {
            const stepItems = this.dom.all.stepItem;
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
            const stepItems = this.dom.all.stepItem;
            const deleteItemButtons = this.dom.all.deleteStepItemButton;

            if (!this.disableEditElements && stepItems.includes(currentItemInFocus)) {
                this.handleOpenItemPropertyEditor(undefined, currentItemInFocus);
            } else if (!this.disableDeleteElements && deleteItemButtons.includes(currentItemInFocus)) {
                this.handleDeleteItem(undefined, currentItemInFocus);
            } else if (!this.disableEditElements && currentItemInFocus === this.dom.stepMenuTrigger) {
                this.originalIsStepMenuOpened = this.isStepMenuOpened;
                this.triggerStageStepMenu();
            }
        }
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

        if (this.isDefaultMode && !this.disableEditElements) {
            this.dispatchEvent(
                new EditElementEvent(
                    target && target.dataset.itemGuid,
                    undefined,
                    ELEMENT_TYPE.STAGE_STEP,
                    designateFocus
                )
            );
            this._lastFocusedItemGuid = target && target.dataset.itemGuid;
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
     * in the property editor panel
     * @returns - a list of computed step items with aria-selected and tab-index properties
     */
    computeStepItems(items: (StageStep & { tabIndex: number; ariaSelected: boolean })[]) {
        let indexedItem;

        if (items.length) {
            items.forEach((item, i) => {
                item.ariaSelected = item.guid === this.activeElementGuid;

                if (item.stepTypeLabel === LABELS.interactiveStepLabel) {
                    item.icon = ICONS.interactiveStep;
                } else if (item.stepTypeLabel === LABELS.backgroundStepLabel) {
                    item.icon = ICONS.backgroundStep;
                }

                if (i === 0 || item.guid === this._lastFocusedItemGuid) {
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

            let nextFocusIndex = key === Keys.ArrowDown ? currentFocusIndex + 1 : currentFocusIndex - 1;

            if (nextFocusIndex >= stepItems.length) {
                // when the bottom of the step list is reached, focus the top step
                nextFocusIndex = 0;
            } else if (nextFocusIndex < 0) {
                // when the top of the step list is reached, focus the bottom step
                nextFocusIndex = stepItems.length - 1;
            }

            stepItems[nextFocusIndex].focus();
            this._lastFocusedItemGuid = stepItems[nextFocusIndex].dataset.itemGuid;
        }
    }

    getKeyboardInteractions() {
        return [
            new BaseKeyboardInteraction([
                createShortcut(Keys.Enter, new EnterCommand(() => this.handleEnterOrSpaceKey())),
                createShortcut(Keys.Space, new SpaceCommand(() => this.handleEnterOrSpaceKey())),
                createShortcut(Keys.ArrowUp, new ArrowUp(() => this.handleArrowKeys(Keys.ArrowUp))),
                createShortcut(Keys.ArrowDown, new ArrowDown(() => this.handleArrowKeys(Keys.ArrowDown)))
            ])
        ];
    }
}
