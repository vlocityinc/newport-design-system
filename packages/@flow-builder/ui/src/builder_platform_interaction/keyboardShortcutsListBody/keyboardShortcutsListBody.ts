// @ts-nocheck
import { LightningElement } from 'lwc';
import { LABELS } from './keyboardShortcutsListBodyLabels';

const KEYS = {
    CMD_KEY: 'Cmd',
    CTRL_KEY: 'Ctrl',
    F6_KEY: 'F6',
    SHIFT_KEY: 'Shift'
};
export default class KeyboardShortcutsListBody extends LightningElement {
    labels = LABELS;

    isMacPlatform = () => {
        return navigator.userAgent.indexOf('Macintosh') !== -1;
    };

    get keyboardHelpShortcut() {
        return '/';
    }

    get zoomInShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.CMD_KEY + '+=';
        }
        return KEYS.CTRL_KEY + '+=';
    }

    get zoomOutShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.CMD_KEY + '+-';
        }
        return KEYS.CTRL_KEY + '+-';
    }

    get zoomToFitShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.CMD_KEY + '+0';
        }
        return KEYS.CTRL_KEY + '+0';
    }

    get zoomToViewShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.CMD_KEY + '+1';
        }
        return KEYS.CTRL_KEY + '+1';
    }

    get dockingPanelFocusShortcut() {
        return this.labels.dockingPanelFocusKeys;
    }

    get switchPanelFocusShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.F6_KEY;
        }
        return KEYS.CTRL_KEY + '+' + KEYS.F6_KEY;
    }

    get deleteShortcut() {
        if (this.isMacPlatform()) {
            return this.labels.deleteKey;
        }
        return this.labels.backspaceKey;
    }
}
