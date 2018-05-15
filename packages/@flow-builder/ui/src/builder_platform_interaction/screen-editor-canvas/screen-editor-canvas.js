import { Element, api } from 'engine';
import {
    localizeString,
    I18N_KEY_SCREEN_FINISH,
    I18N_KEY_SCREEN_PREVIOUS,
    I18N_KEY_SCREEN_PAUSE,
    I18N_KEY_SCREEN_HEADER,
    I18N_KEY_SCREEN_FOOTER
} from 'builder_platform_interaction-screen-editor-i18n-utils';

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends Element {
    @api screen;

    @api clearSelection() {
        for (const highlight of this.root.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            highlight.deselect();
        }
    }

    get finishLabel() {
        return localizeString(I18N_KEY_SCREEN_FINISH);
    }

    get previousLabel() {
        return localizeString(I18N_KEY_SCREEN_PREVIOUS);
    }

    get pauseLabel() {
        return localizeString(I18N_KEY_SCREEN_PAUSE);
    }

    get headerHighlightLabel() {
        return localizeString(I18N_KEY_SCREEN_HEADER);
    }

    get footerHighlightLabel() {
        return localizeString(I18N_KEY_SCREEN_FOOTER);
    }

    handleScreenElementSelected = (event) => {
        for (const highlight of this.root.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            if (highlight.screenElement !== event.srcElement.screenElement || highlight.property !== event.srcElement.property) {
                highlight.deselect();
            }
        }

        event.stopPropagation();
        this.fireEvent('screenelementselected', event.detail);
    }

    handleScreenElementDeleted = (event) => {
        event.stopPropagation();
        this.clearSelection();
        this.fireEvent('screenelementdeleted', event.detail);
    }

    addNewScreenField = (type) => {
        this.fireEvent('addscreenfield', {type});
    }

    handleOnClick = (/* event */) => {
        this.clearSelection();
        this.fireEvent('screenelementdeselected', {});
    }

    fireEvent(name, detail) {
        this.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail
        }));
    }
}