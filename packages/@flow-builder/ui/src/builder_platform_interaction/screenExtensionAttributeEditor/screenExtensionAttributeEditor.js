import { LightningElement, api } from 'lwc';
import { getIconForParameter } from "builder_platform_interaction/screenEditorUtils";

/*
 * Property editor for screen extensions attributes.
 */
export default class ScreenExtensionAttributeEditor extends LightningElement {
    @api descriptor;
    @api attribute;
    @api attributeType;
    @api index;

    sIndex = 0;

    get isInput() {
        return this.attributeType === 'input';
    }

    get isOutput() {
        return this.attributeType === 'output';
    }

    get isFirst() {
        return this.index === 0;
    }

    get icon() {
        return getIconForParameter(this.descriptor.dataType);
    }

    get resourcePickerConfig() {
        const collection = this.descriptor.maxOccurs > 1;
        return {
            allowLiterals: this.isInput && !collection && this.descriptor.dataType && this.descriptor.dataType.toLowerCase() !== 'sobject',
            collection,
            elementConfig: null,
            hideGlobalConstants: this.isOutput,
            hideNewResource: true
        };
    }

    get value() {
        if (this.isInput) {
            return this.attribute ? this.attribute.value.value : (this.descriptor.hasDefaultValue ? this.descriptor.defaultValue : null);
        }

        return this.attribute ? this.attribute.value.value : null;
    }

    /**
     * Prepend output for the screen-reducer to know it is handling with the output version of the attribute
     * @param {Event} event - The property change event
     */
    handlePropertyChanged = (event) => {
        const prefix = this.isInput ? 'input' : 'output';
        event.detail.propertyName = prefix + '.' + event.detail.propertyName;
        event.detail.valueDataType = this.descriptor.dataType;
        event.detail.required = this.descriptor.isRequired;
    }
}