import LightningFocusTrap from 'lightning/focusTrap';
import { api } from 'lwc';

/**
 * Extends the lightning/focusTrap, adding functionality to
 * dynamically enable/disable the trap.
 */
export default class FocusTrap extends LightningFocusTrap {
    _enabled = false;
    _focused = false;

    @api set enabled(val) {
        this._enabled = val;
        this._focused = val;
    }

    get enabled() {
        return this._enabled;
    }

    _handleFocusIn() {
        if (!this._enabled) {
            return;
        }

        super._handleFocusIn();
    }

    _handleFocusOut() {
        if (!this._enabled) {
            return;
        }

        super._handleFocusOut();
    }
}
