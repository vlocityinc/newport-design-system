import { KeyboardShortcut } from '../keyboardInteractions';

// aliases KeyboardShortcut to KeyboardBinding
export type KeyboardBinding = KeyboardShortcut;
export interface KeyboardInteraction {
    // get the bindings for the interaction
    getBindings: () => KeyboardBinding[];

    // post-render callback
    onRendered: () => boolean;

    // destroy the interaction
    destroy: () => void;
}

export enum TabIndex {
    Active = '0',
    Inactive = '-1'
}

/**
 * Updates an elements's tabindex attribute
 *
 * @param element - The element
 * @param tabIndex - The tabIndex for the element
 */
export function updateTabIndex(element: HTMLElement, tabIndex: TabIndex | undefined) {
    // if (!element.dataset.interactionId) {
    //     // eslint-disable-next-line @lwc/lwc/no-inner-html
    //     throw new Error(`Missing data-id param for list item: ${element.outerHTML}`);
    // }

    if (tabIndex == null) {
        element.removeAttribute('tabindex');
    } else {
        element.setAttribute('tabindex', tabIndex);
    }
}

const bindings: unique symbol = Symbol('bindings');
const isFirstRender: unique symbol = Symbol('isFirstRender');

let interactionItemId = 0;

/**
 * Base class for keyboard interactions.
 */
export class BaseKeyboardInteraction implements KeyboardInteraction {
    private [bindings];
    private [isFirstRender];

    constructor(binds) {
        this[bindings] = binds;
        this[isFirstRender] = false;
    }

    /**
     * Returns a unique id to identify an interaction element
     *
     * @returns A unique id for an interaction element
     */
    getNextInteractionItemId() {
        return `${interactionItemId++}`;
    }

    /**
     * Get the bindings associated with this interaction
     *
     * @returns The bindings for this interaction
     */
    getBindings(): KeyboardShortcut[] {
        return this[bindings] as KeyboardShortcut[];
    }

    /**
     * Called to update the interaction after the content governed by it has been (re-)rendered
     *
     * @returns true if first render, flase otherwise
     */
    onRendered(): boolean {
        if (!this[isFirstRender]) {
            this[isFirstRender] = true;
        }

        return this[isFirstRender];
    }

    /**
     * Called to destroy the interaction when the content governed by the interaction
     * is removed from the DOM.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}
}
