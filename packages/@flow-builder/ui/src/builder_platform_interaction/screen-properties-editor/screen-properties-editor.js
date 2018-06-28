import { Element, api } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';

/*
 * Screen element property editor
 */
export default class ScreenPropertiesEditor extends Element {
    @api screen;
    labels = LABELS;

    /* Figure out if the value really changed, and if it did refire the event including the old value */
    handlePropertyChanged = (event) => {
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        const currentValue = property && this.screen[property] && this.screen[property].value;
        if (currentValue !== newValue) {
            this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, null, this.screen[property]));
        }
    }
}