import { commands, keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';

const { EnterCommand, SpaceCommand, EscapeCommand, ArrowDown, ArrowUp, TabCommand } = commands;
const { KeyboardInteractions } = keyboardInteractionUtils;

/**
 * @param items
 * @param currentItemInFocus
 * @param key
 */
function moveFocusInMenuOnArrowKeyDown(items, currentItemInFocus, key) {
    const currentFocusIndex = items.indexOf(currentItemInFocus);
    let nextFocusIndex = key === ArrowDown.COMMAND_NAME ? currentFocusIndex + 1 : currentFocusIndex - 1;
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
 * @param keyboardInteract
 * @param shortCutCommands
 */
function setupKeyboardShortcutUtil(keyboardInteract, shortCutCommands) {
    Object.entries(shortCutCommands).forEach(([shortcutKeys, command]) => {
        keyboardInteract.setupCommandAndShortcut(command, { key: shortcutKeys });
    });
}

type Shortcut = {
    key: Keys;
    handler: () => void;
};

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
    Tab = 'Tab'
}

// Maps a key to a Command class
const keyToCommandMap = {
    [Keys.Enter]: EnterCommand,
    [Keys.Space]: SpaceCommand,
    [Keys.Escape]: EscapeCommand,
    [Keys.Tab]: TabCommand,
    [Keys.ArrowUp]: ArrowUp,
    [Keys.ArrowDown]: ArrowDown
};

/**
 * Creates a command instance for a given key
 *
 * @param key The shortcut key
 * @param handler The handler
 * @returns The a command instance
 */
function createShortcutCommand(key: Keys, handler: () => void) {
    const CommandClass = keyToCommandMap[key];
    return new CommandClass(handler, false);
}

/**
 * Adds keyboard shortcuts to an LWC component
 *
 * @param component The lwc component
 * @param shortcuts The shortcuts
 * @returns A cleanup method to remove the shortcuts
 */
function addKeyboardShortcuts(component: any, shortcuts: Shortcut[]) {
    const keyboardInteractions = new KeyboardInteractions();

    keyboardInteractions.addKeyDownEventListener(component.template);

    const keyboardCommands = shortcuts.reduce((prev, curr) => {
        const { key, handler } = curr;
        prev[key] = createShortcutCommand(key, handler);
        return prev;
    }, {});

    setupKeyboardShortcutUtil(keyboardInteractions, keyboardCommands);

    return keyboardInteractions;
    // TODO: W-9582172 Fix addKeyboardShortcuts so it returns a cleanup method
    // return () => {
    //     keyboardInteractions.removeKeyDownEventListener(component.template);
    // };
}

/**
 * Checks if we are running on a Mac
 *
 * @returns true if we are on a Mac, false otherwise
 */
function isMacPlatform() {
    return navigator.userAgent.indexOf('Macintosh') !== -1;
}

/**
 * @param keyboardInteract
 * @param command
 * @param key
 */
function setupKeyboardShortcutWithShiftKey(keyboardInteract, command, key) {
    const shiftTabShortCut = isMacPlatform() ? { shift: true, key } : { shift: true, ctrlOrCmd: true, key };
    keyboardInteract.setupCommandAndShortcut(command, shiftTabShortCut);
}

export {
    moveFocusInMenuOnArrowKeyDown,
    setupKeyboardShortcutUtil,
    isMacPlatform,
    setupKeyboardShortcutWithShiftKey,
    addKeyboardShortcuts
};
