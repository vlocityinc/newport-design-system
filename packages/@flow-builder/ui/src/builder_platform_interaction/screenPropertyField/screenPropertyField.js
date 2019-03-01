import { LightningElement, api } from 'lwc';
import { PropertyChangedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { booleanAttributeValue, getFlowDataTypeByName, booleanValue, compareValues } from "builder_platform_interaction/screenEditorUtils";
import { hydrateIfNecessary } from "builder_platform_interaction/dataMutationLib";
import { getRulesForElementType, RULE_TYPES } from 'builder_platform_interaction/ruleLib';
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import BaseResourcePicker from "builder_platform_interaction/baseResourcePicker";
import { getFerovInfoAndErrorFromEvent } from 'builder_platform_interaction/expressionUtils';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

/*
 * A property editor
 */
export default class ScreenPropertyField extends LightningElement {
    @api name;
    @api value;
    @api label;
    @api type;
    @api required = false;
    @api readOnly = false;
    @api helpText;
    @api allowResourcesForParameter = false;
    @api allowResourcesForContext = false;
    @api allowResourcesForOutput = false;

    @api resourcePickerConfig;
    @api disabled = false;
    @api listIndex;
    @api listChoices;

    @api hideTopPadding = false;

    currentError;
    labels = LABELS;
    rules = [];

    constructor() {
        super();
        this.rules = getRulesForElementType(RULE_TYPES.ASSIGNMENT, ELEMENT_TYPE.SCREEN);
    }

    renderedCallback() {
        const oldError = this.currentError;
        const newError = this.value && this.value.error;

        if (compareValues(oldError, newError)) { // Error changed
            const input = this.input;
            if (input && input.setCustomValidity) {
                // Set error to empty string to clear the error.
                // See https://www.w3.org/TR/html50/forms.html#dom-cva-setcustomvalidity
                const error = this.error || '';
                input.setCustomValidity(error);
                if (input.showHelpMessageIfInvalid) {
                    input.showHelpMessageIfInvalid();
                }
            }
        }

        this.currentError = newError;
    }
    get propertyEditorElementType() {
        return ELEMENT_TYPE.SCREEN;
    }

    get computedClass() {
        return booleanAttributeValue(this, 'hideTopPadding') ? 'slds-form-element' : 'slds-form-element slds-p-top_xx-small';
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
            this.disabled, // disabled
            getFlowDataTypeByName(this.type),
            true // enableFieldDrilldown
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
        if (this.allowsResourcesForParameter || this.allowResourcesForOutput) {
            const param = {
                dataType: getFlowDataTypeByName(this.type),
                collection: this.resourcePickerConfig.collection
            };

            if (this.resourcePickerConfig.subtype) {
                param.subtype = this.resourcePickerConfig.subtype;
            }

            if (this.resourcePickerConfig.elementType) {
                param.elementType = this.resourcePickerConfig.elementType; // isSObjectField
            }

            return param;
        }

        return null;
    }

    get isFerov() {
        return this.allowsResourcesForParameter || this.allowsResourcesForContext;
    }

    get allowsResources() {
        return this.allowResourcesForContext || this.allowResourcesForParameter || this.allowResourcesForOutput;
    }

    get allowsResourcesForParameter() {
        return booleanAttributeValue(this, 'allowResourcesForParameter');
    }

    get allowsResourcesForContext() {
        return booleanAttributeValue(this, 'allowResourcesForContext');
    }

    get allowsResourcesForOutput() {
        return booleanAttributeValue(this, 'allowResourcesForOutput');
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
        return !this.allowsResources && !this.isLongString && !this.isRichString && !this.isList;
    }

    get isList() {
        return this.type === 'list';
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
        } else if (this.isLongString) {
            return input.value.value;
        } else if (this.isRichString) {
            return input.value;
        } else if (this.isBoolean) {
            return input.checked;
        } else if (this.isString || this.isNumber || this.isList) {
            return input.value;
        }

        throw new Error('Unknown type for property field ' + this.type);
    }

    handleComboboxChanged = (event) => {
        event.stopPropagation();

        const { value, dataType, error } = getFerovInfoAndErrorFromEvent(event, getFlowDataTypeByName(this.type));
        let newValue = hydrateIfNecessary(event.detail.item ? event.detail.item.displayText : event.detail.displayText);
        const currentValue = hydrateIfNecessary(this.value);
        if (newValue === '') {
            newValue = null;
        }

        this.dispatchEvent(new PropertyChangedEvent(this.name, newValue, error, value, currentValue, this.listIndex, dataType));
    }

    handleEvent = (event) => {
        event.stopPropagation();

        // If this is a change event, we don't want to always handle it, because it can
        // be too noisy.
        if (event.type === 'change' && !this.isBoolean && !this.isList && !this.isLongString && !this.isRichString) {
            return;
        }

        let newValue = null, newGuid = null, currentValue = null, ferovDataType = null;

        if (event.detail && event.detail.item && this.allowsResources) { // And it contains a ferov
            newValue = event.detail.item.displayText;
            newGuid = event.detail.item.value;
        } else if (this.isList && event.detail.value) { // And it contains a ferov from a static list
            newGuid = event.detail.value;
        } else if (this.isLongString && event.detail.value) {
            newValue = event.detail.value;
            ferovDataType = FEROV_DATA_TYPE.STRING;
        } else if (this.isRichString && event.detail && event.detail.value != null) {
            newValue = event.detail.value;
            ferovDataType = FEROV_DATA_TYPE.STRING;
        } else {
            newValue = this.domValue;
        }

        currentValue = this.value;

        // This is here specifically for boolean values, we are getting an empty string
        // from the dom and that doesn't work for booleans, feel free to add && this.isBoolean
        // to the if test if this is causing issues with other data types
        if (newValue === '') {
            newValue = null;
        }

        if ((this.allowsResources || !this.isBoolean) && !this.isList) {
            newValue = hydrateIfNecessary(newValue);
            currentValue = hydrateIfNecessary(currentValue);

            if (event.detail && event.detail.error) {
                newValue.error = event.detail.error;
            }
        }

        const error = event.detail && event.detail.error ? event.detail.error : null;
        this.dispatchEvent(new PropertyChangedEvent(this.name, newValue, error, newGuid, currentValue, this.listIndex, ferovDataType));
    }
}
