import { Element, api } from 'engine';
import { ScreenElementSelectedEvent, ScreenElementDeletedEvent } from 'builder_platform_interaction-events';

const SELECTED_CLASS = 'selected';
const DRAGGING_CLASS = 'dragging';
const CONTAINER_DIV_SELECTOR = 'div.highlight';

/*
 * Selection frame with a header and support for deleting components
 */
export default class ScreenEditorHighlight extends Element {
    @api screenElement;
    @api property;
    @api preventEvents = false;
    @api displayMoveIcon = false;
    @api draggable = false;
    @api title;
    @api tabIndex = 0;

    @api get selected() {
        return this.template.querySelector(CONTAINER_DIV_SELECTOR).classList.contains(SELECTED_CLASS);
    }

    @api select() {
        this.setSelected(true);
    }

    @api deselect() {
        this.setSelected(false);
    }

    get isDraggable() {
        return typeof this.draggable === 'string' ? this.draggable.toLowerCase() === 'true' : this.draggable;
    }

    get shouldPreventEvents() {
        return typeof this.preventEvents === 'string' ? this.preventEvents.toLowerCase() === 'true' : this.preventEvents;
    }

    get shouldDisplayMoveIcon() {
        return typeof this.displayMoveIcon === 'string' ? this.displayMoveIcon.toLowerCase() === 'true' : this.displayMoveIcon;
    }

    setSelected(value) {
        const element = this.template.querySelector(CONTAINER_DIV_SELECTOR);
        if (value !== element.classList.contains(SELECTED_CLASS)) {
            element.classList.toggle(SELECTED_CLASS);
        }
    }

    handleSelected = (event) => {
        if (!this.selected) {
            this.setSelected(true);
            this.dispatchEvent(new ScreenElementSelectedEvent(this.screenElement, this.property));
        }

        event.stopPropagation();
    }

    handleDelete = (event) => {
        this.dispatchEvent(new ScreenElementDeletedEvent(this.screenElement, this.property));
        event.stopPropagation();
    }

    handleDragStart(event) {
        this.template.querySelector(CONTAINER_DIV_SELECTOR).classList.add(DRAGGING_CLASS);
        event.dataTransfer.effectAllowed = 'move';
        // Cannot use a different attribute here because only 'text' works in IE
        event.dataTransfer.setData('text', this.screenElement.guid);
    }

    handleDragEnd(/* event */) {
        this.template.querySelector(CONTAINER_DIV_SELECTOR).classList.remove(DRAGGING_CLASS);
    }
}
