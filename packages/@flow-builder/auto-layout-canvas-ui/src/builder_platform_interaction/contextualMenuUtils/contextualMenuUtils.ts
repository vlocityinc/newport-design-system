import { commands } from 'builder_platform_interaction/sharedUtils';
const { ArrowDown } = commands;
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

function setupKeyboardShortcutUtil(keyboardInteract, shortCutCommands) {
    Object.entries(shortCutCommands).forEach(([shortcutKeys, command]) => {
        keyboardInteract.setupCommandAndShortcut(command, { key: shortcutKeys });
    });
}

function isMacPlatform() {
    return navigator.userAgent.indexOf('Macintosh') !== -1;
}

function setupKeyboardShortcutWithShiftKey(keyboardInteract, command, key) {
    const shiftTabShortCut = isMacPlatform() ? { shift: true, key } : { shift: true, ctrlOrCmd: true, key };
    keyboardInteract.setupCommandAndShortcut(command, shiftTabShortCut);
}

export { moveFocusInMenuOnArrowKeyDown, setupKeyboardShortcutUtil, isMacPlatform, setupKeyboardShortcutWithShiftKey };
