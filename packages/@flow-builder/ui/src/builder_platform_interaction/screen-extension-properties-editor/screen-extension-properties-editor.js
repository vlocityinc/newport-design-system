import { Element, api, track } from 'engine';
import { toDeveloperName } from 'builder_platform_interaction-screen-editor-utils';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { PropertyValueChangedEvent } from 'builder_platform_interaction-events';

/*
 * Dynamic property editor TODO: refactor to be used as the property editor for LCs - W-4947239
 */
export default class ScreenExtensionPropertiesEditor extends Element {
    @api element;
    @track errors;
    labels = LABELS;

    handlePropertyChange = (event) => {
        const field = event.field;
        if (field) {
            if (field.isBoolean) { // Visibility changes
                const parentProperty = field.property;
                const value = event.event.currentTarget.checked;
                for (const fld of this.template.querySelectorAll('builder_platform_interaction-screen-property-field')) {
                    const property = fld.property;
                    if (property.parent && property.parent.name === parentProperty.name) {
                        fld.setVisible(value);
                    }
                }
            }
        }

        this.getField(field.property.name).clearErrors();

        if (this.isImmediate(field)) {
            this.dispatchValueChangedEvent(field);
        }
    }

    handlePropertyBlur = (event) => {
        const field = event.field;

        // Label to unique name for screen fields
        if (field.property.name === 'label') {
            const devNameField = this.getField('name');
            if (!devNameField.getValue()) {
                devNameField.setValue(toDeveloperName(field.getValue()));
                devNameField.clearErrors();
            }
        }

        // validate
        if (this.validate(field.property).valid && !this.isImmediate(field)) {
            this.dispatchValueChangedEvent(field);
        }
    }

    isImmediate = (field) => {
        return field.isBoolean;
    }

    validate = (property) => {
        const field = this.getField(property.name);
        const value = field.getValue();
        const parentValue = property.parent ? this.getField(property.parent.name).getValue() : undefined;
        const errors = property.validate(value, parentValue);
        if (errors && errors.length) {
            field.setErrors(errors);
        }

        return {valid: errors && errors.length === 0, errors};
    }

    getField = (name) => {
        return this.template.querySelector('builder_platform_interaction-screen-property-field[data-property-name=' + name + ']');
    }

    dispatchValueChangedEvent = (field) => {
        const oldValue = field.property.value;
        const newValue = field.getValue();
        if (oldValue !== newValue) {
            this.dispatchEvent(new PropertyValueChangedEvent(field, field.property, oldValue, newValue));
        }
    }
}