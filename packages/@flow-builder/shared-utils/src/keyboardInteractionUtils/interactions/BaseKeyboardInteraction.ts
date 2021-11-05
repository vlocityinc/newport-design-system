import { KeyboardShortcut } from '../keyboardInteractions';

// aliases KeyboardShortcut to KeyboardBinding
export type KeyboardBinding = KeyboardShortcut;
export interface KeyboardInteraction {
    // get the bindings for the interaction
    getBindings: () => KeyboardBinding[];

    // handle changes after rendering
    onRendered: () => void;

    // destroy the interaction
    destroy: () => void;
}

/**
 * Base class for keyboard interactions.
 */
export class BaseKeyboardInteraction implements KeyboardInteraction {
    protected bindings: KeyboardShortcut[];

    constructor(bindings: KeyboardShortcut[]) {
        this.bindings = bindings;
    }

    /**
     * Get the bindings associated with this interaction
     *
     * @returns The bindings for this interaction
     */
    getBindings() {
        return this.bindings;
    }

    /**
     * Called to update the interaction after the content governed by it has been (re-)rendered
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onRendered() {}

    /**
     * Called to destroy the interaction when the content governed by the interaction
     * is removed from the DOM
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    destroy() {}
}
