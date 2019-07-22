import { LightningElement, api, track, unwrap } from 'lwc';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    createAction,
    PROPERTY_EDITOR_ACTION
} from 'builder_platform_interaction/actions';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { choiceReducer } from './choiceReducer';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { getFerovInfoAndErrorFromEvent } from 'builder_platform_interaction/expressionUtils';
import { LABELS } from './choiceEditorLabels';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getRulesForElementType,
    RULE_TYPES
} from 'builder_platform_interaction/ruleLib';
import { STORED_VALUE_DATA_TYPE_PROPERTY } from 'builder_platform_interaction/elementFactory';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const flowDataTypeChoiceMenuItems = [
    FLOW_DATA_TYPE.STRING,
    FLOW_DATA_TYPE.NUMBER,
    FLOW_DATA_TYPE.CURRENCY,
    FLOW_DATA_TYPE.DATE,
    FLOW_DATA_TYPE.BOOLEAN
];

// the property names in a choice element (after mutation)
const CHOICE_FIELDS = {
    NAME: 'name',
    DESCRIPTION: 'description',
    CHOICE_TEXT: 'choiceText',
    DATA_TYPE: 'dataType',
    STORED_VALUE: 'storedValue',
    IS_SHOW_INPUT_SELECTED: 'isShowInputSelected',
    USER_INPUT: 'userInput',
    PROMPT_TEXT: 'promptText',
    IS_REQUIRED: 'isRequired',
    IS_VALIDATE_SELECTED: 'isValidateSelected',
    VALIDATION_RULE: 'validationRule',
    ERROR_MESSAGE: 'errorMessage',
    FORMULA_EXPRESSION: 'formulaExpression'
};

export default class ChoiceEditor extends LightningElement {
    _uniqueId = generateGuid();
    _ferovPickerId = `${this._uniqueId}ferov`;
    _rteId = `${this._uniqueId}rte`;
    /**
     * Internal state for the choice editor
     */
    @track
    choiceResource;

    get labels() {
        return LABELS;
    }

    @api
    get node() {
        return this.choiceResource;
    }

    set node(newValue) {
        this.choiceResource = unwrap(newValue);
        this._rules = getRulesForElementType(
            RULE_TYPES.ASSIGNMENT,
            ELEMENT_TYPE.CHOICE
        );
        if (
            this.choiceResource &&
            this.choiceResource.userInput &&
            this.choiceResource.userInput.promptText &&
            !this.choiceResource.userInput.promptText.value
        ) {
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                {
                    propertyName: CHOICE_FIELDS.PROMPT_TEXT,
                    value: '',
                    error: LABELS.cannotBeBlank
                }
            );
            this.choiceResource.userInput = choiceReducer(
                this.choiceResource.userInput,
                action
            );
        }
    }

    @api isNewMode = false;

    /**
     * Public api function to return the node
     * Called by the property editor controller on "OK"
     * @returns {object} node - node
     */
    @api
    getNode() {
        return this.choiceResource;
    }

    get dataTypeList() {
        return flowDataTypeChoiceMenuItems;
    }

    // we want to disable certain fields based on whether we are editing an existing variable/constant or a new variable/constant
    get isFieldDisabled() {
        return !this.isNewMode;
    }

    get dataType() {
        return this.choiceResource.dataType.value;
    }

    get dataTypePickerValue() {
        return { dataType: this.dataType };
    }

    get storedValue() {
        const storedValue = this.choiceResource.storedValue.value;
        if (
            storedValue &&
            (typeof storedValue === 'number' ||
                typeof storedValue === 'boolean')
        ) {
            return storedValue.toString();
        }
        return storedValue;
    }

    get hideNewResourceButton() {
        return this.isNewMode;
    }

    get storedValueComboboxConfig() {
        return BaseResourcePicker.getComboboxConfig(
            LABELS.choiceValueLabel, // label
            LABELS.choiceValuePlaceholder, // placeholder
            this.choiceResource.storedValue.error, // errorMessage
            true, // literalsAllowed
            false, // required
            !this.dataType, // disabled
            this.dataType, // type
            true // enableFieldDrilldown
        );
    }

    get choiceParam() {
        return {
            dataType: this.choiceResource.dataType
        };
    }

    get rulesForChoiceDefaultValue() {
        return this._rules;
    }

    get isDateTypeBoolean() {
        return this.dataType === 'Boolean';
    }

    /**
     * Does the update property action with passed in property name, value and error.
     * @param {String} propertyName to update
     * @param {String} value to update with
     * @param {String} error if any
     */
    updateProperty(propertyName, value, error) {
        const action = createAction(
            PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            { propertyName, value, error }
        );
        this.choiceResource = choiceReducer(this.choiceResource, action);
    }

    /**
     * Helper method to update the property based extracting value from the event.
     * @param {object} event to handle
     * @param {string} propertyName property name to update
     */
    handleChange(event, propertyName) {
        event.stopPropagation();

        const value = event.detail.value;
        const error = event.detail.error || null;

        this.updateProperty(propertyName, value, error);
    }

    /**
     * @param {object} event property changed event coming from label-description component
     */
    handlePropertyChanged(event) {
        this.handleChange(event, event.detail.propertyName);
    }

    /**
     * Helper method to handle updation/addition of inputs. Also checks the validity of these inputs
     * @param {object} inputElement - lightning-input element
     * @param {string} propertyName - name of the property that needs to be updated
     * @param {object} error - error message if any
     * @return {object} Returns the updateElementProperty action
     */
    updateInputValue(inputElement, propertyName, error = null) {
        let newLabel = inputElement.value;
        newLabel = (newLabel || '').trim();

        if (newLabel !== inputElement.value) {
            // if whitespace was removed we need to update the input
            // only required if the user makes a whitespace only change such as 'a' to 'a '
            inputElement.value = newLabel;
        }
        if (!newLabel && !error) {
            error = LABELS.cannotBeBlank;
        }

        return createAction(PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY, {
            propertyName,
            value: newLabel,
            error
        });
    }

    /**
     * Handles addition/updation of choiceText on change event
     * @param {object} event - change event coming from resourced rich text editor
     */
    handleChoiceLabelChanged(event) {
        event.stopPropagation();
        const action = this.updateInputValue(
            event.detail,
            CHOICE_FIELDS.CHOICE_TEXT
        );
        this.choiceResource = choiceReducer(this.choiceResource, action);
    }

    /**
     * Handles choiceText on blur event.
     * The resourced rich text editor is adding a p tag in the beginning of the text, for the choice editor we need to remove this p tag.
     * @param {object} event - change event coming from resourced rich text editor
     */
    handleChoiceLabelBlur(event) {
        event.stopPropagation();
        // if the value start with <p> tag we should remove it W-5886583
        if (
            this.choiceResource.choiceText.value &&
            this.choiceResource.choiceText.value.match(/^<p>/i)
        ) {
            this.choiceResource.choiceText.value = this.choiceResource.choiceText.value
                .replace('<p>', '')
                .replace('</p>', '');
        }
    }

    /**
     * Handles selection/updation of data type
     * @param {object} event - onvaluechanged event coming from data-type-picker
     */
    handleDataTypeChanged(event) {
        event.stopPropagation();
        const value = event.detail.value;

        // clear any values that need to be cleared (ie: stored value, object type)
        if (this.dataType !== value.dataType) {
            // we want to clear the stored value
            this.updateStoredValueWithLiteral(null, null);
        }
        const action = createAction(PROPERTY_EDITOR_ACTION.CHANGE_DATA_TYPE, {
            value
        });
        this.choiceResource = choiceReducer(this.choiceResource, action);
    }

    /**
     * Helper method to update store value with a literal
     * @param {object} displayText
     * @param {object} error
     */
    updateStoredValueWithLiteral(displayText, error) {
        this.updateProperty(
            STORED_VALUE_DATA_TYPE_PROPERTY,
            this.dataType,
            null
        );
        this.updateProperty(CHOICE_FIELDS.STORED_VALUE, displayText, error);
    }

    /**
     * Handles addition/updation of storedValue
     * @param {object} event - oncomboboxstatechanged event coming from ferov-resource-picker
     */
    handleStoredValuePropertyChanged(event) {
        event.stopPropagation();

        const { value, dataType, error } = getFerovInfoAndErrorFromEvent(
            event,
            this.dataType
        );
        this.updateProperty(STORED_VALUE_DATA_TYPE_PROPERTY, dataType, null);
        this.updateProperty(CHOICE_FIELDS.STORED_VALUE, value, error);
    }

    /**
     * Handles selection/deselection of 'inputSelection' checkbox
     * @param {object} event - onchange event coming from lightning-input
     */
    handleInputSelectionChange(event) {
        event.stopPropagation();
        this.updateProperty(
            CHOICE_FIELDS.IS_SHOW_INPUT_SELECTED,
            event.detail.checked,
            null
        );

        let emptyUserInputObject;
        if (event.detail.checked) {
            // Creates the userInput object with the required defaults
            emptyUserInputObject = {
                [CHOICE_FIELDS.IS_REQUIRED]: false,
                [CHOICE_FIELDS.PROMPT_TEXT]: {
                    error: null,
                    value: null
                },
                [CHOICE_FIELDS.VALIDATION_RULE]: undefined
            };
        } else {
            // Need to set this to false so that validationEditor doesn't show up
            this.updateProperty(
                CHOICE_FIELDS.IS_VALIDATE_SELECTED,
                event.detail.checked,
                null
            );
        }

        this.updateProperty(
            CHOICE_FIELDS.USER_INPUT,
            emptyUserInputObject,
            null
        );
    }

    /**
     * Handles addition/updation of Input Label
     * @param {object} event - onfocusout event coming from lightning-input
     */
    handlePromptTextChanged(event) {
        event.stopPropagation();
        const action = this.updateInputValue(
            event.target,
            CHOICE_FIELDS.PROMPT_TEXT
        );
        this.choiceResource.userInput = choiceReducer(
            this.choiceResource.userInput,
            action
        );
    }

    /**
     * Handles selection/deselection of 'Required' checkbox
     * @param {object} event - onchange event coming from lightning-input
     */
    handleIsRequiredChange(event) {
        event.stopPropagation();
        const action = createAction(
            PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            {
                propertyName: CHOICE_FIELDS.IS_REQUIRED,
                value: event.detail.checked,
                error: null
            }
        );
        this.choiceResource.userInput = choiceReducer(
            this.choiceResource.userInput,
            action
        );
    }

    /**
     * Handles selection/deselection of 'Validate' checkbox
     * @param {object} event - onchange event coming from lightning-input
     */
    handleIsValidateChange(event) {
        event.stopPropagation();
        this.updateProperty(
            CHOICE_FIELDS.IS_VALIDATE_SELECTED,
            event.detail.checked,
            null
        );

        let emptyValidationRuleObject;
        if (event.detail.checked) {
            emptyValidationRuleObject = {
                [CHOICE_FIELDS.ERROR_MESSAGE]: {
                    error: null,
                    value: ''
                },
                [CHOICE_FIELDS.FORMULA_EXPRESSION]: {
                    error: null,
                    value: ''
                }
            };
        }

        const action = createAction(
            PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
            {
                propertyName: CHOICE_FIELDS.VALIDATION_RULE,
                value: emptyValidationRuleObject,
                error: null
            }
        );
        this.choiceResource.userInput = choiceReducer(
            this.choiceResource.userInput,
            action
        );
    }

    /**
     * Handling changes made to the validation-editor
     * @param {object} event - onpropertychange event coming from validation-editor
     */
    handleValidationEditorChanged(event) {
        event.stopPropagation();
        if (event.detail && event.detail.rule) {
            const action = createAction(
                PROPERTY_EDITOR_ACTION.UPDATE_ELEMENT_PROPERTY,
                {
                    propertyName: CHOICE_FIELDS.VALIDATION_RULE,
                    value: event.detail.rule,
                    error: null
                }
            );
            this.choiceResource.userInput = choiceReducer(
                this.choiceResource.userInput,
                action
            );
        }
    }

    /**
     * Sets custom validation for lightning text input fields when 'Ok' button on the property editor is clicked
     * @param {object} inputField - Field that needs custom validation
     * @param {string} error - Any existing error message
     */
    setInputFieldErrorMessage(inputField, error) {
        if (inputField) {
            if (error) {
                inputField.setCustomValidity(error);
            } else {
                inputField.setCustomValidity('');
            }
            inputField.showHelpMessageIfInvalid();
        }
    }

    @api validate() {
        // NOTE: if we find there is a case where an error can happen on a field without touching on it,
        // we might have to go through reducer to stuff the errors and call get errors method
        const event = { type: VALIDATE_ALL };
        this.choiceResource = choiceReducer(this.choiceResource, event);
        const promptTextInput = this.template.querySelector('.prompt-text');
        if (
            this.choiceResource.userInput &&
            this.choiceResource.userInput.promptText &&
            this.choiceResource.userInput.promptText.error
        ) {
            this.setInputFieldErrorMessage(
                promptTextInput,
                this.choiceResource.userInput.promptText.error
            );
        }
        return getErrorsFromHydratedElement(this.choiceResource);
    }

    renderedCallback() {
        if (
            this.choiceResource.userInput &&
            this.choiceResource.userInput.promptText &&
            this.choiceResource.userInput.promptText.value !== null
        ) {
            const promptTextInput = this.template.querySelector('.prompt-text');
            this.setInputFieldErrorMessage(
                promptTextInput,
                this.choiceResource.userInput.promptText.error
            );
        }
    }
}
