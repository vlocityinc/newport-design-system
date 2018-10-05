import { LightningElement, api, track } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { booleanAttributeValue, getFlowDataTypeByName, booleanValue } from "builder_platform_interaction/screenEditorUtils";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { hydrateIfNecessary } from "builder_platform_interaction/dataMutationLib";
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

// QUILL supported formats
const RTE_FORMATS = ['abbr', 'address', 'align', 'alt', 'background', 'bdo', 'big', 'blockquote', 'bold', 'cite', 'clean', 'code', 'code-block', 'color', 'data-fileid', 'del', 'dfn', 'direction', 'divider', 'dl', 'dd', 'dt', 'font', 'header', 'image', 'indent', 'ins', 'italic', 'kbd', 'link', 'list', 'q', 'samp', 'script', 'size', 'small', 'strike', 'sup', 'table', 'tt', 'underline', 'var'];

/*
 * A property editor
 */
export default class ScreenPropertyField extends LightningElement {
    @api name;
    @api label;
    @api type;
    @api required = false;
    @api readOnly = false;
    @api helpText;
    @api allowResources = false;
    @api resourcePickerConfig;
    @api disabled = false;
    @api listIndex;

    @api hideTopPadding = false;

    @track _value;

    labels = LABELS;
    formats = RTE_FORMATS;
    rules = [];

    constructor() {
        super();
        this.topPadding = true;
        this.rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.SCREEN);
    }

    get computedClass() {
        return booleanAttributeValue(this, 'hideTopPadding') ? 'slds-form-element' : 'slds-form-element slds-p-top_x-small';
    }

    set value(newValue) {
        this._value = newValue;
        const input = this.input;
        if (input && input.setCustomValidity) {
            input.setCustomValidity(this.error || '');
        }
    }

    @api get value() {
        return this._value;
    }

    get resourcePickerRules() {
        return this.rules;
    }

    get resourceComboBoxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            this.label, // Label
            '', // Placeholder
            this.error, // errorMessage
            this.resourcePickerConfig.allowLiterals, // literalsAllowed
            this.required, // required
            false, // disabled
            getFlowDataTypeByName(this.type)
        );
    }

    get error() {
        return (this.value && this.value.error) || null;
    }

    get propertyValue() {
        // Check for value like this because just doing this.value results in "false" when value is a number
        // set to 0, for example. Hence, perform the check like this.
        if (this.value !== undefined && this.value !== null) {
            return this.value.hasOwnProperty('value') ? this.value.value : this.value;
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
            return input.value && input.value.hasOwnProperty('value') ? input.value.value : input.value;
        } else if (this.isLongString || this.isRichString) {
            return input.value.value;
        } else if (this.isBoolean) {
            return input.checked;
        } else if (this.isString || this.isNumber) {
            return input.value;
        }

        throw new Error('Unknown type for property field ' + this.type);
    }

    handleEvent = (event) => {
        event.stopPropagation();

        let newValue = null, newGuid = null, currentValue = null;

        if (this.allowResources && event.detail.item) { // And it contains a ferov
            newValue = event.detail.item.displayText;
            newGuid = event.detail.item.value;
        } else {
            newValue = this.domValue;
        }

        currentValue = this.value;

        if (!this.isBoolean) {
            newValue = hydrateIfNecessary(newValue);
            currentValue = hydrateIfNecessary(currentValue);
        }

        const error = event.detail && event.detail.error ? event.detail.error : null;
        this.dispatchEvent(new PropertyChangedEvent(this.name, newValue, error, newGuid, currentValue, this.listIndex));
    }
}
