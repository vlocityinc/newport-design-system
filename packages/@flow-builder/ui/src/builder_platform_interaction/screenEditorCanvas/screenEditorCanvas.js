import { LightningElement, api } from 'lwc';
import { CANVAS_SCREEN_GUIDS } from "builder_platform_interaction/screenEditorUtils";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { ReorderListEvent, createScreenElementDeselectedEvent, createAddScreenFieldEvent } from "builder_platform_interaction/events";
const DRAGGING_REGION_SELECTOR = '.screen-editor-canvas-dragging-region';
const INSERTION_LINE_SELECTOR = '.screen-editor-canvas-insertion-line';

/*
 * The screen editor canvas, support for adding, deleting, editing and rearranging fields (incomplete)
 */
export default class ScreenEditorCanvas extends LightningElement {
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
        return this.screen && this.screen.label.value ? this.screen.label.value : '[' + LABELS.screenTitlePlaceHolder + ']';
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

    get fields() {
        if (this.screen) {
            return this.screen.fields.map((field) => {
                return {
                    field,
                    selected: (this.selectedItemGuid === field.guid)
                };
            });
        }

        return [];
    }

    handleOnClick = (event) => {
        const selected = this.getSelectedElement();
        this.dispatchEvent(createScreenElementDeselectedEvent(selected));
        event.stopPropagation();
    }

    handleDrop(event) {
        event.preventDefault();
        this.handleDragEnd();
        const range = this.getDraggingRange(event);

        // Figure out if we're adding a field or moving a field and fire the correct event.
        if (event.dataTransfer.effectAllowed === 'copy') {
            // Field is being added from the palette.
            const fieldTypeName = event.dataTransfer.getData('text');
            const addFieldEvent = createAddScreenFieldEvent(fieldTypeName, range.index);
            this.dispatchEvent(addFieldEvent);
            this.clearDraggingState();
        } else {
            // Existing field is being moved around.
            const sourceGuid = event.dataTransfer.getData('text');
            const sourceIndex = this.screen.getFieldIndexByGUID(sourceGuid);
            const destIndex = range.index > sourceIndex ? range.index - 1 : range.index;
            const destGuid = this.screen.fields[destIndex].guid;
            if (sourceGuid && destIndex !== sourceIndex) {
                this.fireReorder(sourceGuid, destGuid);
                this.clearDraggingState();
            }
        }
    }

    handleDragEnter(event) {
        this.template.querySelector(DRAGGING_REGION_SELECTOR).classList.remove('slds-hide');
        event.preventDefault();
        event.stopPropagation();
    }

    handleDragEnd(/* event */) {
        this.template.querySelector(DRAGGING_REGION_SELECTOR).classList.add('slds-hide');
        this.template.querySelector(INSERTION_LINE_SELECTOR).style.top = '0';
    }

    handleDragOver(event) {
        const range = this.getDraggingRange(event);
        if (range) {
            if (!this.top) {
                this.top = this.template.querySelector(DRAGGING_REGION_SELECTOR).getBoundingClientRect().top;
            }

            this.template.querySelector(INSERTION_LINE_SELECTOR).style.top = (range.top - this.top) + 'px';
        }

        event.preventDefault();
        event.stopPropagation();
    }

    getDraggingRange(event) {
        if (!this.ranges) {
            this.ranges = [];
            let idx = 0;

            // iterate over all screen fields and get their vertical coordinates.
            for (const highlight of this.template.querySelector('div.screen-editor-canvas-body').querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
                const rect = highlight.getBoundingClientRect();
                this.ranges.push({
                    top: rect.top,
                    bottom: rect.bottom,
                    middle: rect.top + ((rect.bottom - rect.top) / 2),
                    index: idx
                });
                idx++;
            }

            // Add a range element to represent the very bottom spot.
            this.ranges.push({
                top: idx > 0 ? this.ranges[idx - 1].bottom + 1 : 0,
                bottom: this.top + 2,
                middle: this.top + 1,
                index: idx
            });
        }

        // Figure out which screen field's corresponding range is associated with this event.
        for (let i = 0, length = this.ranges.length; i < length; i++) {
            const range = this.ranges[i];
            if (event.y >= range.top && event.y <= range.bottom) {
                return (i < length - 1 && event.y >= range.middle) ? this.ranges[i + 1] : range;
            } else if ((i === 0 && event.y < range.top) || (i === length - 1 && event.y > range.top)) {
                return range;
            }
        }

        return null;
    }

    handleScroll()  {
        this.clearDraggingState();
    }

    clearDraggingState() {
        delete this.ranges; // Force recalculate bounding client rects for the new scroll position
        delete this.top;
    }

    getSelectedElement() {
        for (const highlight of this.template.querySelectorAll('builder_platform_interaction-screen-editor-highlight')) {
            if (highlight.selected) {
                return highlight;
            }
        }

        return null;
    }

    fireReorder(sourceIndex, destIndex) {
        if (sourceIndex !== destIndex) {
            const reorderListEvent = new ReorderListEvent(sourceIndex, destIndex);
            this.dispatchEvent(reorderListEvent);
        }
    }
}