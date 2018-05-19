import { Element, api } from 'engine';
import { ScreenElementSelectedEvent, ScreenElementDeletedEvent } from 'builder_platform_interaction-events';

const SELECTED_CLASS = 'selected';
const CONTAINER_DIV_SELECTOR = 'div.highlight';

/*
 * Selection frame with a header and support for deleting components
 */
export default class ScreenEditorHighlight extends Element {
    @api screenElement;
    @api property;
    @api preventEvents = false;
    @api displayMoveIcon = false;
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
}
