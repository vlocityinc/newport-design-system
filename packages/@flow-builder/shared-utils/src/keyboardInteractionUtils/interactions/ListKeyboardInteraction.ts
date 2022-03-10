import { ArrowDown, ArrowUp } from '../../commands';
import { createDomProxy } from '../../lwcUtils';
import { createShortcut, Keys } from '../keyboardInteractions';
import { BaseKeyboardInteraction, TabIndex, updateTabIndex } from './BaseKeyboardInteraction';
import { Direction, getNextItem } from './interactionsUtils';

const selectors = {
    itemsSelector: () => `[role="menuitem"]`,
    activeElement: (activeElementId: string) => `[data-interaction-item-id="${activeElementId}"]`
};

/**
 *  Keyboard interaction class for navigating a list using the arrow keys.
 *  Uses a selector to query a template to find the HTML elements that make up the list.
 */
export class ListKeyboardInteraction extends BaseKeyboardInteraction {
    dom;

    template: ShadowRootTheGoodPart;

    // the active element id
    activeElementId?: string;

    /**
     * Constructs a new ListKeyboardInteraction
     *
     * @param template  The template that contains the elements
     */
    constructor(template: ShadowRootTheGoodPart) {
        super([
            createShortcut(Keys.ArrowDown, new ArrowDown(() => this.navigateList())),
            createShortcut(Keys.ArrowUp, new ArrowUp(() => this.navigateList(Direction.Up)))
        ]);

        this.template = template;
        this.dom = createDomProxy(this, selectors);
    }

    /**
     * Get the items governed by the interaction
     *
     * @returns the items
     */
    getItems(): HTMLElement[] {
        return this.dom.all[selectors.itemsSelector()];
    }

    /**
     * Helper function to move the focus correctly when using arrow keys in the contextual menu
     *
     * @param direction - The direction to navigate
     */
    navigateList(direction = Direction.Down): void {
        const currItem = this.getActiveElement();

        if (currItem != null) {
            const nextItem = getNextItem(this.getItems(), currItem, direction);

            if (nextItem.dataset.interactionItemId !== currItem.dataset.interactionItemId) {
                this.setActiveElement(nextItem);
            }
        }
    }

    /**
     *
     * @returns The active element
     */
    getActiveElement(): HTMLElement | undefined {
        return this.activeElementId != null ? this.dom[selectors.activeElement(this.activeElementId)] : undefined;
    }

    /**
     * Sets the active element
     *
     * @param activeElement - The active element
     * @param shouldFocus - whether to focus on the element as well
     */
    setActiveElement(activeElement: HTMLElement, shouldFocus = true) {
        const currActiveElement = this.getActiveElement();

        if (currActiveElement != null) {
            updateTabIndex(currActiveElement, TabIndex.Inactive);
        }

        this.activeElementId = activeElement.dataset.interactionItemId;

        updateTabIndex(activeElement, TabIndex.Active);

        if (shouldFocus) {
            activeElement.focus();
        }
    }

    private initInteractionItem(item: HTMLElement) {
        item.dataset.interactionItemId = this.getNextInteractionItemId();
        updateTabIndex(item, TabIndex.Inactive);
        item.addEventListener('focusin', (event) => {
            // @ts-ignore
            this.setActiveElement(event.target, false);
        });
    }

    private initActiveElement() {
        const items = this.getItems();
        let activeElement = this.getActiveElement();

        if (activeElement == null && items.length > 0) {
            activeElement = items[0];
        }

        if (activeElement != null) {
            this.setActiveElement(activeElement, false);
        }
    }

    override onRendered(): boolean {
        const isFirstRender = super.onRendered();

        // init any items that have not been initialized (can happen if new items are added on subsequent renders)
        const items = this.getItems();
        items.filter((item) => !item.dataset.interactionItemId).forEach((item) => this.initInteractionItem(item));

        // on render, set tabindex = 0 on the active element, or on the first element if none
        if (isFirstRender) {
            this.initActiveElement();
        }

        return isFirstRender;
    }
}
