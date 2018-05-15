import { Element, api } from 'engine';

/*
 * Selection frame with a header and support for deleting components
 */
export default class ScreenEditorHighlight extends Element {
    @api screenElement;
    @api property;
    @api preventEvents = 'false';
    @api displayMoveIcon = 'false';
    @api title;

    @api get selected() {
        return this.root.querySelector('div.highlight').classList.contains('selected');
    }

    @api select() {
        this.setSelected(true);
    }

    @api deselect() {
        this.setSelected(false);
    }

    get shouldPreventEvents() {
        return this.preventEvents.toLowerCase() === 'true';
    }

    get shouldDisplayMoveIcon() {
        return this.displayMoveIcon.toLowerCase() === 'true';
    }

    setSelected(value) {
        const element = this.root.querySelector('div.highlight');
        if (value !== element.classList.contains('selected')) {
            element.classList.toggle('selected');
        }
    }

    handleSelected = (event) => {
        if (!this.selected) {
            this.setSelected(true);
            this.fireEvent('screenelementselected');
            event.stopPropagation();
        }
    }

    handleDelete = (event) => {
        this.fireEvent('screenelementdeleted');
        event.stopPropagation();
    }

    fireEvent = (name) => {
        this.dispatchEvent(new CustomEvent(name, {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {
                screenElement: this.screenElement,
                property: this.property
            }
        }));
    }
}
