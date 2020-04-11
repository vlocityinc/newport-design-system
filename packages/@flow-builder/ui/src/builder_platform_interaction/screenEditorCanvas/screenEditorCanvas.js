import { LightningElement, api } from 'lwc';
import { CANVAS_SCREEN_GUIDS } from 'builder_platform_interaction/screenEditorUtils';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { createScreenElementDeselectedEvent } from 'builder_platform_interaction/events';

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends LightningElement {
    @api flowLabel;
    @api screen;
    @api selectedItemGuid;
    labels = LABELS;

    get screenConfigurationHasErrors() {
        for (const property in this.screen) {
            if (this.screen.hasOwnProperty(property)) {
                const val = this.screen[property];
                if (val && !Array.isArray(val) && val.error) {
                    return true;
                }
            }
        }

        return false;
    }

    get screenTitle() {
        return this.flowLabel || `[${LABELS.screenTitlePlaceHolder}]`;
    }

    get hasHelpText() {
        return this.screen.helpText && this.screen.helpText.value;
    }

    get headerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.HEADER_GUID;
    }

    get footerSelected() {
        return this.selectedItemGuid === CANVAS_SCREEN_GUIDS.FOOTER_GUID;
    }

    handleOnClick = event => {
        const selected = this.getSelectedElement();
        this.dispatchEvent(createScreenElementDeselectedEvent(selected));
        event.stopPropagation();
    };

    handleScroll() {
        this.clearDraggingState();
    }

    clearDraggingState() {
        delete this.ranges; // Force recalculate bounding client rects for the new scroll position
        delete this.top;
    }

    getSelectedElement() {
        for (const highlight of this.template.querySelectorAll(
            'builder_platform_interaction-screen-editor-highlight'
        )) {
            if (highlight.selected) {
                return highlight;
            }
        }

        return null;
    }
}
