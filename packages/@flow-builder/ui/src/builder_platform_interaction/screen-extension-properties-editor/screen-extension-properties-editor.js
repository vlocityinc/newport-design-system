import { Element, api, track } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { PropertyValueChangedEvent } from 'builder_platform_interaction-events';
import { mergeExtensionInfo } from 'builder_platform_interaction-screen-editor-utils';

/*
 * Dynamic property editor TODO: refactor to be used as the property editor for LCs - W-4947239
 */
export default class ScreenExtensionPropertiesEditor extends Element {
    @track _field;
    @track _extensionDescription;
    @track mergedField;
    labels = LABELS;

    @api set field(value) {
        this._field = value;
        this.mergedField = null;
        this.checkState();
    }

    @api get field() {
        return this._field;
    }

    @api set extensionDescription(value) {
        this._extensionDescription = value;
        this.mergedField = null;
        this.checkState();
    }

    @api get extensionDescription() {
        return this._extensionDescription;
    }

    checkState() {
        const extName = this._extensionDescription ? this._extensionDescription.name : null;
        const fieldName = this._field ? this._field.name : null;

        if (this._extensionDescription && extName !== fieldName) {
            this.mergedField = mergeExtensionInfo(this._field, this._extensionDescription);
        }
    }

    handlePropertyChange = (/* event */) => {

    }

    handlePropertyBlur = (/* event */) => {
    //    this.dispatchValueChangedEvent(field);
    }

    dispatchValueChangedEvent = (field) => {
        const oldValue = field.property.value;
        const newValue = field.getValue();
        if (oldValue !== newValue) {
            this.dispatchEvent(new PropertyValueChangedEvent(field, field.property, oldValue, newValue));
        }
    }
}