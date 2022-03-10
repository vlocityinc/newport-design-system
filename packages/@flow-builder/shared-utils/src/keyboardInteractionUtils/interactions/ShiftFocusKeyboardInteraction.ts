import { ShiftFocusBackwardCommand, ShiftFocusForwardCommand } from '../../commands';
import { createShortcut, Keys } from '../keyboardInteractions';
import { BaseKeyboardInteraction } from './BaseKeyboardInteraction';
import { Direction, getNextItem } from './interactionsUtils';

/**
 *  Keyboard interaction class for navigating application sections using F6 and Shift+F6
 */
export class ShiftFocusKeyboardInteraction extends BaseKeyboardInteraction {
    itemSet: Set<HTMLElement>;

    constructor(private items: HTMLElement[]) {
        super([
            createShortcut(Keys.F6, new ShiftFocusForwardCommand((e) => this.navigateList(e))),
            createShortcut(
                {
                    key: Keys.F6,
                    shift: true
                },
                new ShiftFocusBackwardCommand((e) => this.navigateList(e, Direction.Up))
            )
        ]);

        this.itemSet = new Set(items);
    }

    /**
     * Get the items governed by the interaction
     *
     * @returns the items
     */
    getItems(): HTMLElement[] {
        return this.items;
    }

    /**
     * Helper function to move the focus to the next section
     *
     * @param event - The keyboard event
     * @param direction - The direction to navigate
     */
    navigateList(event: KeyboardEvent, direction = Direction.Down): void {
        event.stopPropagation();

        // get the original target of the event (eg the section we are currently in)
        const currSection = event
            .composedPath()
            .find((element) => this.itemSet.has(element as HTMLElement)) as HTMLElement;

        // and get the next item
        const nextSection = getNextItem(this.items, currSection, direction);

        // Move the focus there
        nextSection?.focus();
    }
}
