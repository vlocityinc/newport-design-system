import { Element, api } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { ScreenElementDeselectedEvent } from 'builder_platform_interaction-events';

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends Element {
    @api screen;
    labels = LABELS;
    _tabIndex = 0;

    get nextTabIndex() {
        return ++this._tabIndex;
    }

    @api clearSelection() {
        for (const highlight of this.template.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            highlight.deselect();
        }
    }

    handleScreenElementSelected = (event) => {
        for (const highlight of this.template.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            if (highlight.screenElement !== event.target.screenElement || highlight.property !== event.target.property) {
                highlight.deselect();
            }
        }

        // let event bubble up
    }

    handleScreenElementDeleted = (/* event */) => {
        this.clearSelection();
        // let event bubble up
    }
    /*
    addNewScreenField = (type) => {
        this.fireEvent('addscreenfield', {type});
    }
     */
    handleOnClick = (/* event */) => {
        const selected = this.getSelectedElement();
        this.clearSelection();
        this.dispatchEvent(new ScreenElementDeselectedEvent(selected));
        event.stopPropagation();
    }

    getSelectedElement() {
        for (const highlight of this.template.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            if (highlight.selected) {
                return highlight;
            }
        }

        return null;
    }
}