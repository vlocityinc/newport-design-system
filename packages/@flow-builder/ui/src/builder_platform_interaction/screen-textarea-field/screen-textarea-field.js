import { Element, api } from 'engine';
import { getVariant } from 'builder_platform_interaction-screen-editor-utils';

/**
 * Wrapper used to represent visual preview of screen fields which are are text areas.
 */
export default class ScreenTextareaField extends Element {
    @api label = ' '; // empty label is not allowed by the lightning component used to render this field type.
    @api value;
    @api required = false;

    @api
    get variant() {
        return getVariant(this.label);
    }
}