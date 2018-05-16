import { Element, api } from 'engine';
import {
    hiddenLabel,
    standardLabel
} from 'builder_platform_interaction-screen-editor-utils';

/**
 * Wrapper used to represent visual preview of screen fields which are are text areas.
 */
export default class TextareaWrapper extends Element {
    @api name = '';
    @api label = ' '; // empty label is not allowed by the lightning component used to render this field type.
    @api value = '';
    @api required = false;
    @api disabled = false;

    @api
    get variant() {
        // field labels are not required in flow, but they are required by the lightning component
        // we're using to preview them. Hide the label if the label is an empty string or equivalent.
        if (this.label === null || this.label.trim().length === 0) {
            return hiddenLabel;
        }
        return standardLabel;
    }
}