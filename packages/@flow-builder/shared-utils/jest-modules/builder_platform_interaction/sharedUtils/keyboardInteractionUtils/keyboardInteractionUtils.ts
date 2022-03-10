// @ts-nocheck

import { api } from 'lwc';
import { Keys } from '../../../../src/keyboardInteractionUtils';
export { Keys };
export class KeyboardInteractions {
    commands = {};

    keydownListener = (event: KeyboardEvent) => {
        const { key } = event;

        switch (key) {
            case Keys.Enter:
                this.commands.entercommand.execute();
                break;
            case Keys.Escape:
                this.commands.escapecommand.execute();
                break;
            case Keys.Space:
                this.commands.spacecommand.execute();
                break;
            case Keys.ArrowDown:
                this.commands.arrowdown.execute();
                break;
            case Keys.ArrowUp:
                this.commands.arrowup.execute();
                break;
            default:
        }
    };

    addKeyDownEventListener(template: HTMLElement) {
        template.addEventListener('keydown', this.keydownListener);
    }

    removeKeyDownEventListener(template: HTMLElement) {
        template.removeEventListener('keydown', this.keydownListener);
    }

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
export function withKeyboardInteractions<TBase extends Constructor<LightningElement & KeyboardEnabled>>(
    Base: TBase
): KeyboardInteractionsCtor & TBase {
    return class extends Base {
        // TODO: rename KeyboardInteractions => KeyboardInteractionsManager
        // @api present for testing purposes
        // @ts-ignore
        @api
        keyboardInteractions = new KeyboardInteractions();

        // TODO: rename to keyboardInteractions after the above field is renamed
        private _keyboardInteractions: KeyboardInteraction[] = [];

        firstRender = true;

        /**
         * Override in decorated class to provide the keyboard interactions
         *
         * @returns the keyboard interactions
         */
        getKeyboardInteractions(): KeyboardInteraction[] {
            return this._keyboardInteractions || [];
        }

        setKeyboardInteractions(interactions: KeyboardInteraction[]) {
            this.destroyInteractions();

            this._keyboardInteractions = interactions;

            this.initInteractions();
        }

        connectedCallback() {
            if (super.connectedCallback !== undefined) {
                super.connectedCallback();
            }
        }

        renderedCallback() {
            if (super.renderedCallback !== undefined) {
                super.renderedCallback();
            }

            if (this.firstRender) {
                this.initInteractions();
                this.firstRender = false;
            }
        }

        private initInteractions() {
            this._keyboardInteractions = this.getKeyboardInteractions();

            this._keyboardInteractions.forEach((interaction: KeyboardInteraction) =>
                this.keyboardInteractions.registerShortcuts(interaction.getBindings())
            );

            this.keyboardInteractions.addKeyDownEventListener(this.template);
            this._keyboardInteractions.forEach((interaction: KeyboardInteraction) => {
                if (interaction.onRendered) {
                    interaction.onRendered();
                }
            });
        }

        private destroyInteractions() {
            this._keyboardInteractions?.forEach((interaction: KeyboardInteraction) => {
                if (interaction?.destroy) {
                    interaction.destroy();
                }
            });
            this.keyboardInteractions?.removeKeyDownEventListener(this.template);
        }

        disconnectedCallback() {
            if (super.disconnectedCallback !== undefined) {
                super.disconnectedCallback();
            }

            this.destroyInteractions();
        }
    };
}

export const createShortcut = jest.fn((key, command) => ({ key, command }));

export class BaseKeyboardInteraction {
    getBindings() {
        return [];
    }
}
