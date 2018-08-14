import { LightningElement, api, track } from "lwc";
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { mergeExtensionInfo } from 'builder_platform_interaction-screen-editor-utils';

/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
    // TODO can't close this story until we are able to handle two outputs for the same attributes
    @track _field;
    @track _extensionDescription;
    @track mergedField;
    labels = LABELS;

    set field(value) {
        this._field = value;
        this.mergedField = null;
        this.checkState();
    }

    @api get field() {
        return this._field;
    }

    set extensionDescription(value) {
        this._extensionDescription = value;
        this.mergedField = null;
        this.checkState();
    }

    @api get extensionDescription() {
        return this._extensionDescription;
    }

    /**
     * Checks if both, the description and the value have been set, and, if so, merges both into mergedField
     */
    checkState = () => {
        const extName = this._extensionDescription ? this._extensionDescription.name : null;
        const fieldName = this._field ? this._field.name : null;

        if (this._extensionDescription && extName !== fieldName) {
            this.mergedField = mergeExtensionInfo(this._field, this._extensionDescription);
        }
    }

    /**
     * Prepend input for the screen-reducer to know it is handling the input version of the attribute
     * @param {Event} event - The property change event
     */
    handleInputPropertyChanged = (event) => {
        event.detail.propertyName = 'input.' + event.detail.propertyName;
    }

    /**
     * Prepend output for the screen-reducer to know it is handling with the output version of the attribute
     * @param {Event} event - The property change event
     */
    handleOutputPropertyChanged = (event) => {
        event.detail.propertyName = 'output.' + event.detail.propertyName;
    }
}