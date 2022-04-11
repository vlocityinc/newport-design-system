import { CommandRegistry, KeyboardShortcutServiceImpl } from 'builder_framework/command';
// @ts-ignore
import { api, LightningElement } from 'lwc';
import { BaseCommand } from '../commands';
import { ShadowRootTheGoodPart } from '../lwcUtils';
import { isMacPlatform } from '../platformUtils';
import { KeyboardInteraction } from './interactions/BaseKeyboardInteraction';

// HTML keyboard strings
// TODO: should rename to "Key", enums names should be singular
export enum Keys {
    Enter = 'Enter',
    Space = ' ',
    Escape = 'Escape',
    ArrowUp = 'ArrowUp',
    ArrowDown = 'ArrowDown',
    ArrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
    Delete = 'Delete',
    Backspace = 'Backspace',
    Tab = 'Tab',
    F6 = 'F6',
    One = '1',
    Zero = '0',
    Slash = '/'
}

/**
 * Type for a ShortcutKey.
 * A ShortcutKey consists of a Key and optional modifiers.
 */
export type ShortcutKey = {
    key: Keys;
    shift?: boolean;
    alt?: boolean;
    ctrlOrCmd?: boolean;
    label?: string;
};

/**
 * Type for a KeyboardShortcut.
 * A KeyboardShortcut binds a ShortcutKey to a BaseCommand
 */
export type KeyboardShortcut = {
    key: ShortcutKey;
    command: BaseCommand;
};

const FUNCTION_KEY_REGEX = /F\d/;

/**
 * Utility function to create a ShortcutKey
 *
 * @param key - The shortcut key
 * @param shift - Optinal shift modifier
 * @returns A ShortcutKey instance
 */
export function createShortcutKey(key: Keys, shift?: boolean): ShortcutKey {
    const modifiers = shift ? (isMacPlatform() ? { shift: true } : { shift: true, ctrlOrCmd: true }) : {};
    return { key, ...modifiers };
}

/**
 * Utility function to create a Shortcut
 *
 * @param key - The shortcut key
 * @param command - The associated command
 * @returns A Shortcut instance
 */
export function createShortcut(key: Keys | ShortcutKey, command: BaseCommand): KeyboardShortcut {
    const shortcutKey = typeof key === 'string' ? createShortcutKey(key) : key;

    // for function keys, need the Ctrl modifier for non-macs
    if (!isMacPlatform() && FUNCTION_KEY_REGEX.test(shortcutKey.key)) {
        Object.assign(shortcutKey, { ctrlOrCmd: true });
    }

    return { key: shortcutKey, command };
}

/**
 * Formats a shortcut key for display to a user
 *
 * @param key - The shortcut key
 * @returns  The formatted shortcut key
 */
export function formatShortcutKey(key: ShortcutKey): string {
    const parts: string[] = [];

    if (key.ctrlOrCmd) {
        parts.push(isMacPlatform() ? 'Cmd' : 'Ctrl');
    }

    if (key.alt) {
        parts.push(isMacPlatform() ? 'Option' : 'Alt');
    }

    parts.push(key.label || key.key);
    return parts.join('+');
}

/**
 * Class used to manage the registration of Shortcuts with a HTML Element
 */
export class KeyboardInteractions {
    commandRegistry;
    keyboardService;

    constructor() {
        this.commandRegistry = new CommandRegistry();
        this.keyboardService = new KeyboardShortcutServiceImpl(this.commandRegistry);
    }

    keydownListener = (event: Event) => {
        // setting this property makes the event available to the interactions
        // @ts-ignore
        event.commandContext = event;

        this.keyboardService.handleKeydown(event);
    };

    addKeyDownEventListener(template: HTMLElement | ShadowRootTheGoodPart) {
        template.addEventListener('keydown', this.keydownListener);
    }

    removeKeyDownEventListener(template: HTMLElement | ShadowRootTheGoodPart) {
        template.removeEventListener('keydown', this.keydownListener);
    }

    setupCommandAndShortcut(command: BaseCommand, shortcutkey: ShortcutKey) {
        this.registerShortcuts([createShortcut(shortcutkey, command)]);
    }

    registerShortcuts(shortcuts: KeyboardShortcut[]) {
        for (const shortcut of shortcuts) {
            const { key, command } = shortcut;
            this.commandRegistry.registerCommands([command]);

            // TODO: add types definitions for KeyboardShortcutServiceImpl
            this.keyboardService.registerShortcuts([
                {
                    shortcut: key,
                    commandId: command.id
                }
            ]);
        }
    }
}

/* eslint-disable  @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars  */
type Constructor<T = {}> = new (...args: any[]) => T;

type KeyboardEnabled = {
    getKeyboardInteractions(): KeyboardInteraction[];
    setKeyboardInteractions(interactions: KeyboardInteraction[]): void;
};

/**
 * Adds keyboard interaction support to a LightningElement subclass.
 * The subclass must satisfy the KeyboardEnabled interface, that is define
 * a getKeyboardInteractions method to provide the interactions.
 *
 * For example:
 *    class MyUiWidget extends withKeyboardInteractions(LightningElement) {
 *          ...
 *          getKeyboardInteractions() {
 *              return [new ListKeyboardInteraction(this.template)];
 *          }
 *    }
 *
 * @param Base a base class that extends LightningElement
 * @returns a LightningElement subclass with keyboard interactions
 */
export function withKeyboardInteractions<TBase extends Constructor<LightningElement>>(
    Base: TBase
): TBase & Constructor<KeyboardEnabled> {
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

            this._keyboardInteractions.forEach((interaction: KeyboardInteraction) => interaction.onRendered());
        }

        private initInteractions() {
            this._keyboardInteractions = this.getKeyboardInteractions();

            this._keyboardInteractions.forEach((interaction: KeyboardInteraction) =>
                this.keyboardInteractions.registerShortcuts(interaction.getBindings())
            );

            this.keyboardInteractions.addKeyDownEventListener(this.template);
        }

        private destroyInteractions() {
            this._keyboardInteractions?.forEach((interaction: KeyboardInteraction) => interaction.destroy());
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
