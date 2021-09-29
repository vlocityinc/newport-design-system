import { KeyboardShortcut } from '../keyboardInteractions';

// aliases KeyboardShortcut to KeyboardBinding
export type KeyboardBinding = KeyboardShortcut;
export interface KeyboardInteraction {
    getBindings: () => KeyboardBinding[];
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
}
