// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    SCREEN_EDITOR_GUIDS,
    getPlaceHolderLabel,
    getDragFieldValue
} from 'builder_platform_interaction/screenEditorUtils';
import { createAddScreenFieldEvent, createScreenElementMovedEvent } from 'builder_platform_interaction/events';
const DRAGGING_REGION_SELECTOR = '.screen-canvas-dragging-region';
const INSERTION_LINE_SELECTOR = '.screen-canvas-insertion-line';
const CANVAS_BODY_SELECTOR = '.screen-canvas-body';
const HIGHLIGHT_SELECTOR = 'builder_platform_interaction-screen-editor-highlight';
const SLDS_HIDE_CLASS = 'slds-hide';
/*
 * A reusable component that renders a collection of screen fields and provides support for dragging and
 * dropping in order to add new fields or rearrange existing fields. Used in components such as the screen
 * editor canvas and the screen section field (each column is a screen canvas).
 */
export default class ScreenCanvas extends LightningElement {
    @api element;
    @api selectedItemGuid;
    @api showEmptyPlaceholder;
    labels = LABELS;
    dragEnterCounter = 0;

    get fields() {
        if (this.element) {
            return this.element.fields.map(field => {
                return {
                    field,
                    selected: this.selectedItemGuid === field.guid
                };
            });
        }

        return [];
    }

    get shouldShowEmptyPlaceholder() {
        return this.showEmptyPlaceholder && this.element.fields <= 0;
    }

    get emptyPlaceHolderText() {
        return this.element && this.element.type ? getPlaceHolderLabel(this.element.type.name) : null;
    }

    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        this.handleDragEnd();
        if (!this.isSectionWithinField()) {
            const range = this.getDraggingRange(event);
            // Make sure range is not null
            if (range) {
                // Figure out if we're adding a field or moving a field and fire the correct event.
                if (
                    event.dataTransfer &&
                    (event.dataTransfer.effectAllowed === 'copy' ||
                        event.dataTransfer.getData('dragStartLocation') === SCREEN_EDITOR_GUIDS.PALETTE)
                ) {
                    // Field is being added from the palette.
                    const fieldTypeName = event.dataTransfer.getData('text');
                    const addFieldEvent = createAddScreenFieldEvent(fieldTypeName, range.index, this.element);
                    this.dispatchEvent(addFieldEvent);
                    this.clearDraggingState();
                } else {
                    // Existing field is being moved around.
                    const sourceGuid = event.dataTransfer.getData('text');
                    if (sourceGuid && this.element.fields.length >= range.index) {
                        this.fireMoveEvent(sourceGuid, this.element.guid, range.index);
                        this.clearDraggingState();
                    } else {
                        throw new Error(
                            'No screen field found at drag destination. Source guid: ' +
                                sourceGuid +
                                '. Destination index: ' +
                                range.index +
                                '. Event: ' +
                                event.dataTransfer.effectAllowed +
                                '. Number of screen fields: ' +
                                this.element.fields.length
                        );
                    }
                }
            }
        }
    }

    handleDragEnter(event) {
        if (!this.isSectionWithinField()) {
            this.template.querySelector(DRAGGING_REGION_SELECTOR).classList.remove(SLDS_HIDE_CLASS);
        }
        event.preventDefault();
        event.stopPropagation();
        this.dragEnterCounter++;
        // TODO: dispatch an event telling the screen editor canvas body to remove its dragging region
    }

    handleDragEnd(event = null) {
        this.dragEnterCounter = 0;
        this.template.querySelector(DRAGGING_REGION_SELECTOR).classList.add(SLDS_HIDE_CLASS);
        this.template.querySelector(INSERTION_LINE_SELECTOR).style.top = '0';
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.clearDraggingState();
    }

    handleDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dragEnterCounter--;
        if (this.dragEnterCounter === 0) {
            this.handleDragEnd();
        }
    }

    handleDragOver(event) {
        if (!this.isSectionWithinField()) {
            const range = this.getDraggingRange(event);
            if (range) {
                if (!this.top) {
                    this.top = this.template.querySelector(DRAGGING_REGION_SELECTOR).getBoundingClientRect().top;
                }

                this.template.querySelector(INSERTION_LINE_SELECTOR).style.top = range.top - this.top + 'px';
            }

            event.preventDefault();
        }
        event.stopPropagation();
    }

    getDraggingRange(event) {
        if (!this.ranges) {
            this.ranges = [];
            let idx = 0;

            // iterate over all screen fields and get their vertical coordinates.
            for (const highlight of this.template
                .querySelector(CANVAS_BODY_SELECTOR)
                .querySelectorAll(HIGHLIGHT_SELECTOR)) {
                const rect = highlight.getBoundingClientRect();
                const rectMiddle = (rect.bottom - rect.top) / 2;
                this.ranges.push({
                    top: rect.top,
                    bottom: rect.bottom,
                    middle: rect.top + rectMiddle,
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
                return i < length - 1 && event.y >= range.middle ? this.ranges[i + 1] : range;
            } else if ((i === 0 && event.y < range.top) || (i === length - 1 && event.y > range.top)) {
                return range;
            }
        }
        return null;
    }

    handleScroll() {
        this.clearDraggingState();
    }

    clearDraggingState() {
        delete this.ranges; // Force recalculate bounding client rects for the new scroll position
        delete this.top;
    }

    fireMoveEvent(sourceGuid, destinationParentGuid, destinationIndex) {
        const moveFieldEvent = createScreenElementMovedEvent(sourceGuid, destinationParentGuid, destinationIndex);
        this.dispatchEvent(moveFieldEvent);
    }

    isSectionWithinField() {
        const draggedFieldValue = getDragFieldValue();
        if (draggedFieldValue) {
            return (
                (draggedFieldValue === 'RegionContainer' || draggedFieldValue === 'Section') &&
                this.element.elementType === 'SCREEN_FIELD'
            );
        }
        return false;
    }
}
