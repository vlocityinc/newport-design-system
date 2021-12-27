/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
import { api, LightningElement } from 'lwc';

export default class Popup extends LightningElement {
    _visible = false;
    @api alignment;
    @api close() {
        this._visible = false;
    }
    @api show() {
        this._visible = true;
    }

    @api
    isVisible() {
        return this._visible;
    }
}
