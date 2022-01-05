import { keyboardInteractionUtils } from 'builder_platform_interaction/sharedUtils';
const { Keys } = keyboardInteractionUtils;

// source of truth for all app shortcuts
const shortcutMap = {
    displayShortcuts: {
        key: Keys.Slash,
        ctrlOrCmd: true
    },

    switchPanel: {
        key: Keys.F6
    },

    focusOnDockingPanel: {
        key: 'g d'
    },

    shiftFocusForward: {
        key: Keys.F6
    },

    shiftFocusBackward: {
        key: Keys.F6,
        shift: true
    },

    zoomIn: {
        ctrlOrCmd: true,
        alt: true,
        key: '»',
        label: '+'
    },

    zoomOut: {
        ctrlOrCmd: true,
        alt: true,
        key: '½',
        label: '-'
    },

    zoomToFit: {
        ctrlOrCmd: true,
        alt: true,
        key: Keys.One
    },

    zoomToView: {
        ctrlOrCmd: true,
        alt: true,
        key: Keys.Zero
    }
};

export const shortcuts: Record<keyof typeof shortcutMap, any> = shortcutMap;
