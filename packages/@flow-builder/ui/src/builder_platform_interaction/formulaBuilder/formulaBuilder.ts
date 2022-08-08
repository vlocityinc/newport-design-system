import BaseResourcePicker from 'builder_platform_interaction/baseResourcePicker';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { FormulaChangedEvent } from 'builder_platform_interaction/events';
import { ElementFilterConfig } from 'builder_platform_interaction/expressionUtils';
import { ELEMENT_TYPE, FORMULA_TYPE } from 'builder_platform_interaction/flowMetadata';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { LIGHTNING_INPUT_VARIANTS } from 'builder_platform_interaction/screenEditorUtils';
import { fetchOnce, fetchPromise, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { loggingUtils, lwcUtils } from 'builder_platform_interaction/sharedUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getFlowMetadataInJsonString } from 'builder_platform_interaction/translatorLib';
import { shouldNotBeBlank } from 'builder_platform_interaction/validationRules';
import { api, LightningElement, track } from 'lwc';
import { LABELS } from './formulaBuilderLabels';

export interface FormulaResourcePickerConfig {
    elementConfig?: ElementFilterConfig | null;
    comboboxConfig?: ComboboxConfig | null;
    filterOptions?: {
        hideGlobalConstants?: boolean;
        hideSystemVariables?: boolean;
        hideGlobalVariables?: boolean;
        hideNewResource?: boolean;
        includeQuickCreateResourceOption?: boolean;
        activePicklistValues?: string[] | null;
        isPillSupported?: boolean;
        forFormula?: boolean;
        hideFlowSystemVariable?: boolean;
        newResourceTypeLabel?: string;
    };
    rules?: string[] | null;
}

const { logInteraction } = loggingUtils;

const selectors = {
    textArea: 'textarea',
    resourcePicker: 'builder_platform_interaction-ferov-resource-picker',
    functionPicker: 'formula-function-picker',
    operatorPicker: 'formula-operator-picker',
    syntaxValidation: 'formula-syntax-validation'
};

export default class FormulaBuilder extends LightningElement {
    dom = lwcUtils.createDomProxy(this, selectors);

    // flow process type
    @api flowProcessType;
    // flow trigger type
    @api flowTriggerType;

    // resource guid
    @api resourceId;
    // element type
    @api propertyEditorElementType = ELEMENT_TYPE.FORMULA;

    @api validationOptions: UI.FormulaValidationOptions = {};

    // help text
    @api
    helpText;
    // is it required?
    @api
    required = false;
    // label to display
    @api
    label = LABELS.formulaLabel;
    // text area name
    @api
    name = 'default';
    // the formula type to specify the sub resource validation path
    @api
    formulaType = FORMULA_TYPE.FLOW_FORMULA;

    @api
    elementName = '';

    @api
    formulaDataType = FLOW_DATA_TYPE.BOOLEAN.value;

    @track operatorData;
    @track functionData;
    @track validationResult;
    _recordTriggerType;

    @track
    error;

    // the dehydrated value
    @track
    _value;

    labels = LABELS;

    _resourcePickerConfig: FormulaResourcePickerConfig = {};

    set value(val: any) {
        this._value = getValueFromHydratedItem(val);
        if (val?.error) {
            this.setCustomValidity(val.error);
        }
        this.updateTextArea();
    }

    @api
    get value() {
        return { value: this._value, error: this.error };
    }

    @api
    get recordTriggerType() {
        return this._recordTriggerType;
    }

    set recordTriggerType(recordTriggerTypeValue) {
        this._recordTriggerType = recordTriggerTypeValue;
        this.fetchFunctionPickerData();
    }

    @api
    setCustomValidity(message) {
        this.error = message;
    }

    set resourcePickerConfig(resourceConfig: FormulaResourcePickerConfig) {
        this._resourcePickerConfig = resourceConfig || {};
    }

    // the configuration used in resource picker, it will contain the information to get the data.
    @api
    get resourcePickerConfig() {
        return this._resourcePickerConfig;
    }

    get rowIndex() {
        return this.resourceId || generateGuid();
    }

    /**
     * @returns the default element config if not set in resourcePickerConfig
     */
    get elementConfig() {
        return this._resourcePickerConfig.elementConfig || { elementType: this.propertyEditorElementType };
    }

    /**
     * @returns the default combobox config if not set in resourceComboboxConfig
     */
    get comboboxConfig() {
        return (
            this._resourcePickerConfig.comboboxConfig ||
            BaseResourcePicker.getComboboxConfig(
                LABELS.resourcePickerTitle, // Label
                LABELS.resourcePickerPlaceholder, // Placeholder
                null, // errorMessage
                false, // literalsAllowed
                false, // required
                false, // disabled
                '', // type
                true, // enableFieldDrilldown
                true, // allowSObjectFields
                LIGHTNING_INPUT_VARIANTS.LABEL_HIDDEN // variant
            )
        );
    }

    get filterOptions() {
        return this._resourcePickerConfig?.filterOptions || {};
    }

    // @ts-ignore TODO: remove me
    get classList() {
        return (
            'container slds-rich-text-editor slds-grid slds-grid_vertical slds-nowrap' +
            (this.error ? ' has-error' : '')
        );
    }

    /**
     * fetch the function categories and functions
     */
    fetchFunctionPickerData() {
        fetchOnce(SERVER_ACTION_TYPE.GET_FORMULA_FUNCTIONS, {
            flowProcessType: this.flowProcessType,
            flowTriggerType: this.flowTriggerType,
            recordTriggerType: this.recordTriggerType
        }).then((data) => {
            this.functionData = data;
        });
    }
    /**
     * fetch the operators
     */
    fetchOperatorData() {
        fetchOnce(SERVER_ACTION_TYPE.GET_FORMULA_OPERATORS, {
            flowProcessType: this.flowProcessType,
            flowTriggerType: this.flowTriggerType
        }).then((data) => {
            this.operatorData = data;
        });
    }

    connectedCallback() {
        this.fetchFunctionPickerData();
        this.fetchOperatorData();
    }

    updateTextArea() {
        const textarea = this.dom.as<HTMLTextAreaElement>().textArea;
        if (textarea && this._value) {
            textarea.value = this._value;
        }
    }
    /**
     * handle resource changed event.
     *
     * @param event resource changed event
     */
    handleResourceChanged = (event) => {
        event.stopPropagation();
        if (event.detail?.item) {
            const text = event.detail.item.displayText;
            if (text && !event.detail.item.hasNext) {
                this.insertCode(selectors.resourcePicker, text);
            }
        }
    };
    /**
     * handle check syntax click event.
     *
     * @param event button click event
     */
    handleCheckSyntax(event) {
        event.stopPropagation();
        this.checkSyntax();
    }

    /**
     * for now, the validation at client side is just checking the merge fields.
     *
     * @returns error if any
     */
    checkFormulaExpressionWithMergeFields() {
        const hideGlobalConstants = !!this.filterOptions.hideGlobalConstants;
        const options = {
            allowGlobalConstants: !hideGlobalConstants,
            allowCollectionVariables: true,
            ignoreGlobalVariables: !!this.filterOptions.forFormula
        };
        const textarea = this.dom.as<HTMLTextAreaElement>().textArea;
        this._value = textarea.value;
        // formula can't be empty if this is required
        let error = this.required ? shouldNotBeBlank(this._value) : null;
        if (!error) {
            const errors = validateTextWithMergeFields(this._value, options);
            error = errors.length > 0 ? errors[0].message : null;
        }
        this.setCustomValidity(error);
        this.dispatchEvent(new FormulaChangedEvent(this._value, error));
        return error;
    }

    checkSyntax() {
        logInteraction('formula-check-syntax', 'formula-builder-component', null, 'click');
        // validate formula when clicking on check syntax button
        const syntaxValidationCmp = this.dom.as<any>().syntaxValidation;
        // check merge field at client side
        const expError = this.checkFormulaExpressionWithMergeFields();
        if (expError) {
            this.validationResult = { isValidSyntax: false, validationMessage: '' };
            syntaxValidationCmp.enableCheckSyntaxButton();
        } else {
            const flowFormulaOptions = {
                flowMetadata: getFlowMetadataInJsonString(),
                elementType: this.propertyEditorElementType,
                elementName: this.elementName,
                dataType: this.formulaDataType
            };

            const validationOptions =
                this.formulaType === FORMULA_TYPE.FLOW_ENTRY_CRITERIA ? this.validationOptions : flowFormulaOptions;

            const params = {
                flowProcessType: this.flowProcessType,
                flowTriggerType: this.flowTriggerType,
                recordTriggerType: this.recordTriggerType,
                formulaType: this.formulaType,
                formula: this._value,
                validationOptions
            };
            fetchPromise(SERVER_ACTION_TYPE.VALIDATE_FORMULA, params)
                .then((data) => {
                    this.validationResult = data;
                    // set validationMessage to formula builder error, then reset it
                    this.setCustomValidity(
                        this.validationResult.isValidSyntax ? null : this.validationResult.validationMessage
                    );
                    this.validationResult.validationMessage = '';
                    // dispatch FormulaChangedEvent to update error
                    this.dispatchEvent(new FormulaChangedEvent(this._value, this.error));
                })
                .finally(() => {
                    syntaxValidationCmp.enableCheckSyntaxButton();
                });
        }
    }

    /**
     * handle function selected event.
     *
     * @param event function selected event
     */
    handleFunctionChanged(event) {
        event.stopPropagation();
        const text = event.detail.value;
        if (text) {
            this.insertCode(selectors.functionPicker, text);
        }
    }
    /**
     * handle operator selected event.
     *
     * @param event function selected event
     */
    handleOperatorChanged(event) {
        event.stopPropagation();
        const text = event.detail.value;
        if (text) {
            this.insertCode(selectors.operatorPicker, text);
        }
    }
    /**
     * insert text (selected resource, selected function, selected operator) to text area
     *
     * @param selector selector name
     * @param value text to be inserted
     */
    insertCode(selector, value) {
        // Insert the item at cursor position and notify up
        const textarea = this.dom.as<HTMLTextAreaElement>().textArea;
        const val = textarea.value;
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || start;
        const pre = val.substring(0, start);
        const post = val.substring(end, val.length);
        textarea.value = pre + value + post;
        textarea.setSelectionRange(start + value.length, start + value.length);
        // check formula merge fields
        const error = this.checkFormulaExpressionWithMergeFields();
        // set syntax validation message
        if (error) {
            this.validationResult = { isValidSyntax: false, validationMessage: '' };
        }
        // reset the cmp to the initial state
        Promise.resolve().then(() => {
            const selectedCmp = this.template.querySelector(selector);
            // re-pass functionData to functionPicker.functionData to reset the combobox value (to avoid using shadowRoot to query grouped combobox)
            if (selector === selectors.functionPicker) {
                selectedCmp.functionData = this.functionData;
            } else {
                selectedCmp.value = null;
            }
        });
    }
}
