// @ts-nocheck
import { api } from 'lwc';
export class KeyboardInteractions {
    commands = {};

    addKeyDownEventListener = jest.fn();
    removeKeyDownEventListener = jest.fn();

    setupCommandAndShortcut(command) {
        this.commands[command.id] = command;
    }

    registerShortcuts(shortcuts: any[]) {
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
 * @param Base
 */
// @ts-nocheck
export function withKeyboardInteractions(Base: any) {
    return class extends Base {
        // Used for testing purposes
        // @ts-ignore
        @api
        keyboardInteractions;

        constructor(...args: any[]) {
            super();
            const keyboardInteractions = new KeyboardInteractions();

            this.getKeyboardInteractions().forEach((interaction: KeyboardInteraction) =>
                keyboardInteractions.registerShortcuts(interaction.getBindings())
            );

            this.keyboardInteractions = keyboardInteractions;
        }

        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }

            this.keyboardInteractions.addKeyDownEventListener(this.template);
        }

        disconnectedCallback() {
            if (super.disconnectedCallback !== undefined) {
                super.disconnectedCallback();
            }

            this.keyboardInteractions.removeKeyDownEventListener(this.template);
        }
    };
}
