import { LightningElement, api } from "lwc";
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';

/*
 * Screen element property editor
 */
export default class ScreenDisplayTextFieldPropertiesEditor extends LightningElement {
    @api field;
    labels = LABELS;

    /* Figure out if the value really changed, and if it did refire the event including the old value */
    handlePropertyChanged = (event) => {
        const property = event.detail.propertyName;
        const newValue = event.detail.value;
        const error = event.detail.error;
        const currentValue = property && this.field[property] && this.field[property].value;
        if (currentValue !== newValue) {
            this.dispatchEvent(new PropertyChangedEvent(property, newValue, error, this.field.guid, this.field[property]));
        }
        event.stopPropagation();
    }
}