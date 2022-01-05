import { shortcuts } from 'builder_platform_interaction/app';
import { keyboardInteractionUtils, platformUtils } from 'builder_platform_interaction/sharedUtils';
import { LightningElement } from 'lwc';
import { LABELS } from './keyboardShortcutsListBodyLabels';

const { formatShortcutKey } = keyboardInteractionUtils;

export default class KeyboardShortcutsListBody extends LightningElement {
    labels = LABELS;

    get keyboardHelpShortcut() {
        return formatShortcutKey(shortcuts.displayShortcuts);
    }

    get zoomInShortcut() {
        return formatShortcutKey(shortcuts.zoomIn);
    }

    get zoomOutShortcut() {
        return formatShortcutKey(shortcuts.zoomOut);
    }

    get zoomToFitShortcut() {
        return formatShortcutKey(shortcuts.zoomToFit);
    }

    get zoomToViewShortcut() {
        return formatShortcutKey(shortcuts.zoomToView);
    }

    get dockingPanelFocusShortcut() {
        return this.labels.dockingPanelFocusKeys;
    }

    get switchPanelFocusShortcut() {
        return formatShortcutKey(shortcuts.switchPanel);
    }

    get deleteShortcut() {
        if (platformUtils.isMacPlatform()) {
            return this.labels.deleteKey;
        }
        return this.labels.backspaceKey;
    }
}
