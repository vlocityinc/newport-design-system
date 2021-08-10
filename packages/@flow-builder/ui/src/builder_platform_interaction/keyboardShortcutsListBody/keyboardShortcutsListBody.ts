// @ts-nocheck
import { LightningElement } from 'lwc';
import { LABELS } from './keyboardShortcutsListBodyLabels';

const KEYS = {
    CMD_KEY: 'Cmd',
    CTRL_KEY: 'Ctrl',
    F6_KEY: 'F6',
    SHIFT_KEY: 'Shift',
    OPTION_KEY: 'Option',
    ALT_KEY: 'Alt'
};
export default class KeyboardShortcutsListBody extends LightningElement {
    labels = LABELS;

    isMacPlatform = () => {
        return navigator.userAgent.indexOf('Macintosh') !== -1;
    };

    get keyboardHelpShortcut() {
        if (this.isMacPlatform()) {
            return KEYS.CMD_KEY + '+/';
        }
        return KEYS.CTRL_KEY + '+/';
    }

    get zoomInShortcut() {
        if (this.isMacPlatform()) {
            return `${KEYS.CMD_KEY}+${KEYS.OPTION_KEY}+=`;
        }
        return `${KEYS.CTRL_KEY}+${KEYS.ALT_KEY}+=`;
    }

    get zoomOutShortcut() {
        if (this.isMacPlatform()) {
            return `${KEYS.CMD_KEY}+${KEYS.OPTION_KEY}+-`;
        }
        return `${KEYS.CTRL_KEY}+${KEYS.ALT_KEY}+-`;
    }

    get zoomToFitShortcut() {
        if (this.isMacPlatform()) {
            return `${KEYS.CMD_KEY}+${KEYS.OPTION_KEY}+1`;
        }
        return `${KEYS.CTRL_KEY}+${KEYS.ALT_KEY}+1`;
    }

    get zoomToViewShortcut() {
        if (this.isMacPlatform()) {
            return `${KEYS.CMD_KEY}+${KEYS.OPTION_KEY}+0`;
        }
        return `${KEYS.CTRL_KEY}+${KEYS.ALT_KEY}+0`;
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
