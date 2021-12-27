import { ArrowDown, ArrowUp } from '../../commands';
import { createShortcut, Keys } from '../keyboardInteractions';
import { BaseKeyboardInteraction } from './BaseKeyboardInteraction';

/**
 * Moves the focus to previous/next list element
 *
 * @param items - The items to navigate
 * @param currentItemInFocus - The current item in focus
 * @param key - The key that was pressed
 */
export function moveFocusInMenuOnArrowKeyDown(
    items: HTMLElement[],
    currentItemInFocus: HTMLElement,
    key: Keys.ArrowDown | Keys.ArrowUp
): void {
    const currentFocusIndex = items.indexOf(currentItemInFocus);
    let nextFocusIndex = key === Keys.ArrowDown ? currentFocusIndex + 1 : currentFocusIndex - 1;
    if (nextFocusIndex >= items.length) {
        // Case when you have reached the bottom of the list and press arrow down key.
        // Focus should move to the top of the list
        nextFocusIndex = 0;
    } else if (nextFocusIndex < 0) {
        // Case when you have reached the top of the list and press arrow up key.
        // Focus should move to the bottom of the list
        nextFocusIndex = items.length - 1;
    }
    items[nextFocusIndex].focus();
}

/**
 *  Keyboard interaction class for navigating a list using the arrow keys.
 *  Uses a selector to query a template to find the HTML elements that make up the list.
 */
export class ListKeyboardInteraction extends BaseKeyboardInteraction {
    /**
     * Constructs a new ListKeyboardInteraction
     *
     * @param template  The template that contains the elements
     * @param itemsSelector The selector to query for the elements that should be part of the list
     */
    constructor(private template: ShadowRootTheGoodPart, private itemsSelector: string = '[role=option]') {
        super([
            createShortcut(Keys.ArrowDown, new ArrowDown(() => this.handleArrowKeyDown(Keys.ArrowDown))),
            createShortcut(Keys.ArrowUp, new ArrowUp(() => this.handleArrowKeyDown(Keys.ArrowUp)))
        ]);
    }

    /**
     * Helper function to move the focus correctly when using arrow keys in the contextual menu
     *
     * @param key - the key pressed (arrowDown or arrowUp)
     */
    handleArrowKeyDown(key: Keys.ArrowDown | Keys.ArrowUp): void {
        const currentItemInFocus = this.template.activeElement as HTMLElement;
        if (currentItemInFocus) {
            const items = Array.from<HTMLElement>(this.template.querySelectorAll(this.itemsSelector));
            moveFocusInMenuOnArrowKeyDown(items, currentItemInFocus, key);
        }
    }
}
