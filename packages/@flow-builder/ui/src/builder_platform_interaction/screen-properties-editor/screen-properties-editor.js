import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';

const ALL_SECTION_NAMES = ['containerOptions', 'navigationOptions', 'helpText'];

/*
 * Screen element property editor
 */
export default class ScreenPropertiesEditor extends LightningElement {
    @api screen;
    labels = LABELS;

    get allSectionNames() {
        return ALL_SECTION_NAMES;
    }

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

    get pausedText() {
        return this.screen.pausedText ? this.screen.pausedText.value : null;
    }

    get helpTextValue() {
        return this.screen.helpText && this.screen.helpText.value ? this.screen.helpText : null;
    }
}