import { LightningElement, api } from 'lwc';
import { getIconForParameter, getFerovTypeFromTypeName, EXTENSION_PARAM_PREFIX } from "builder_platform_interaction/screenEditorUtils";

/*
 * Property editor for screen extensions attributes.
 */
export default class ScreenExtensionAttributeEditor extends LightningElement {
    @api descriptor;
    @api attribute;
    @api attributeType;
    @api index;
    @api attributeIndex = 0;

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
        const config = {
            allowLiterals: this.isInput && !collection && this.descriptor.dataType && !['sobject', 'apex'].includes(this.descriptor.dataType.toLowerCase()),
            collection,
            elementConfig: null,
            hideGlobalConstants: this.isOutput,
            hideNewResource: false
        };

        if (this.descriptor.subtype) {
            config.subtype = this.descriptor.subtype;
        }

        return config;
    }

    get label() {
        return this.descriptor.label || this.descriptor.apiName;
    }

    get value() {
        if (this.isInput) {
            return this.attribute ? this.attribute.value : (this.descriptor.hasDefaultValue ? this.descriptor.defaultValue : null);
        }

        return this.attribute ? this.attribute.value : null;
    }

    get helptext() {
        return this.descriptor.description || null;
    }

    get helptextClass() {
        return this.isFirst ? 'helptext' : 'helptext slds-p-top_xx-small';
    }

    /**
     * Prepend output for the screen-reducer to know it is handling with the output version of the attribute
     * @param {Event} event - The property change event
     */
    handlePropertyChanged = (event) => {
        const input = this.isInput;
        const prefix = input ? EXTENSION_PARAM_PREFIX.INPUT : EXTENSION_PARAM_PREFIX.OUTPUT;
        event.detail.propertyName = prefix + '.' + event.detail.propertyName;
        event.detail.valueDataType = getFerovTypeFromTypeName(this.descriptor.dataType) || this.descriptor.dataType;
        event.detail.required = input && this.descriptor.isRequired;
        if (!input && this.attributeIndex > 0) {
            event.detail.attributeIndex = this.attributeIndex;
        }
    }
}