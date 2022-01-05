// @ts-nocheck
import { api } from 'lwc';
export class KeyboardInteractions {
    commands = {};

    addKeyDownEventListener = jest.fn();
    removeKeyDownEventListener = jest.fn();

    setupCommandAndShortcut(command) {
        this.commands[command.id] = command;
    }

    registerShortcuts(shortcuts) {
        for (const shortcut of shortcuts) {
            const { command } = shortcut;
            this.setupCommandAndShortcut(command);
        }
    }

    execute(commandId) {
        if (this.commands[commandId]) {
            this.commands[commandId].execute();
        }
    }
}
/**
 * Keyboard interaction decorator. Adds support for keyboard interactions to a classs.
 *
 * @param Base - The base class
 * @returns The base class with keyboard interactions
 */
export function withKeyboardInteractions(Base) {
    return class extends Base {
        // Used for testing purposes
        @api
        keyboardInteractions = new KeyboardInteractions();

        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }

            this.getKeyboardInteractions().forEach((interaction: KeyboardInteraction) =>
                this.keyboardInteractions.registerShortcuts(interaction.getBindings())
            );

            this.keyboardInteractions.addKeyDownEventListener(this.template);
        }

        renderedCallback() {
            if (super.renderedCallback !== undefined) {
                super.renderedCallback();
            }

            this.getKeyboardInteractions().forEach((interaction: KeyboardInteraction) => interaction.onRendered());
        }

        disconnectedCallback() {
            if (super.disconnectedCallback !== undefined) {
                super.disconnectedCallback();
            }

            this.keyboardInteractions.removeKeyDownEventListener(this.template);
        }
    };
}

export enum Keys {}

export const createShortcut = jest.fn((key, command) => ({ key, command }));

export class BaseKeyboardInteraction {
    getBindings() {
        return [];
    }
}
