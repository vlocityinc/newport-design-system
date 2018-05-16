import { Element, api } from 'engine';

/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class DisplayTextWrapper extends Element {
    @api title;
    @api value;
    @api typeName;

    get isDisplayRichTextType() {
        return this.typeName === 'DisplayRichText';
    }
}