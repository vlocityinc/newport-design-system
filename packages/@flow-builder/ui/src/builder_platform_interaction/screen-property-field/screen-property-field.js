import { Element, api, track } from 'engine';
import { PropertyChangedEvent } from 'builder_platform_interaction-events';
import { isItemHydratedWithErrors } from 'builder_platform_interaction-data-mutation-lib';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { booleanAttributeValue, getValueFromFerov, getFlowDataTypeByName, booleanValue } from 'builder_platform_interaction-screen-editor-utils';
import BaseResourcePicker from 'builder_platform_interaction-base-resource-picker';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';
import { isObject } from 'builder_platform_interaction-common-utils';

// QUILL supported formats
const RTE_FORMATS = ['abbr', 'address', 'align', 'alt', 'background', 'bdo', 'big', 'blockquote', 'bold', 'cite', 'clean', 'code', 'code-block', 'color', 'data-fileid', 'del', 'dfn', 'direction', 'divider', 'dl', 'dd', 'dt', 'font', 'header', 'image', 'indent', 'ins', 'italic', 'kbd', 'link', 'list', 'q', 'samp', 'script', 'size', 'small', 'strike', 'sup', 'table', 'tt', 'underline', 'var'];

/*
 * A property editor
 */
export default class ScreenPropertyField extends Element {
    @api name;
    @api label;
    @api type;
    @api required = false;
    @api readOnly = false;
    @api helpText;
    @api allowResources = false;
    @api resourcePickerConfig;
    @api disabled = false;

    @track _value;

    labels = LABELS;
    formats = RTE_FORMATS;

    @api set value(newValue) {
        this._value = newValue;
        const input = this.input;
        if (input && input.setCustomValidity) {
            input.setCustomValidity(this.error);
        }
    }

    @api get value() {
        return this._value;
    }

    get resourceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label, // Label
            '', // Placeholder
            this.error, // errorMessage
            this.resourcePickerConfig.allowLiterals, // literalsAllowed
            this.required, // required
            false, // disabled
            this.getFlowDataTypeByName(this.type)
        );
    }

    get error() {
        return (this.value && this.value.error) || null;
    }

    get propertyValue() {
        // Check for value like this because just doing this.value results in "false" when value is a number
        // set to 0, for example. Hence, perform the check like this.
        if (this.value !== undefined && this.value !== null) {
            if (this.allowsResources && isObject(this.value) && !isItemHydratedWithErrors(this.value)) {
                return getValueFromFerov(this.value);
            }

            return this.value.value ? this.value.value : this.value;
        }

        return null;
    }

    get elementParam() {
        const param = {
            dataType: getFlowDataTypeByName(this.type),
            collection: this.resourcePickerConfig.collection
        };

        if (this.resourcePickerConfig.objectType) {
            param.objectType = this.resourcePickerConfig.objectType;
        }

        if (this.resourcePickerConfig.elementType) {
            param.elementType = this.resourcePickerConfig.elementType; // isSObjectField
        }

        return param;
    }

    get objectType() {
        if (getFlowDataTypeByName(this.type) === FLOW_DATA_TYPE.SOBJECT.value) {
            return this.objectType;
        }

        return null;
    }

    get allowsResources() {
        return booleanAttributeValue(this, 'allowResources');
    }

    get isRequired() {
        return booleanAttributeValue(this, 'required');
    }

    get checked() {
        return this.isBoolean && booleanValue(this.value);
    }

    get isString() {
        return this.type === 'string';
    }

    get isLongString() {
        return this.type === 'long_string';
    }

    get isRichString() {
        return this.type === 'rich_string';
    }

    get isBoolean() {
        return this.type === 'boolean';
    }

    get isNumber() {
        return this.type === 'number';
    }

    get isInput() {
        return !this.allowsResources && !this.isLongString && !this.isRichString;
    }

    get inputType() {
        if (this.isNumber) {
            return 'number';
        } else if (this.isBoolean) {
            return 'checkbox';
        }

        return 'text';
    }

    get input() {
        return this.template.querySelector('.property-input');
    }

    get domValue() {
        const input = this.input;
        if (this.allowsResources) {
            return input.value && input.value.value ? input.value.value : input.value;
        } else if (this.isString || this.isLongString || this.isRichString) {
            return input.value;
        } else if (this.isBoolean) {
            return input.checked;
        } else if (this.isNumber) {
            return input.value;
        }

        throw new Error('Unknown type for property field ' + this.type);
    }

    get dehydratedValue() {
        return isItemHydratedWithErrors(this.value) ? this.value.value : this.value;
    }

    handleEvent = (event) => {
        const newValue = this.domValue;
        if (this.dehydratedValue !== newValue) {
            const error = event.detail && event.detail.error ? event.detail.error : null;
            this.dispatchEvent(new PropertyChangedEvent(this.name, newValue, error, null, this.value));
        }
        event.stopPropagation();
    }
}
