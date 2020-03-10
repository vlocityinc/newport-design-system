import { LightningElement, api, track } from 'lwc';
import {
    screenExtensionPropertiesEventReducer,
    screenExtensionPropertiesPropsToStateReducer
} from './screenExtensionPropertiesReducer';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    translateUIModelToFlow,
    swapDevNamesToGuids,
    swapUidsForDevNames
} from 'builder_platform_interaction/translatorLib';
import { createInputParameter } from 'builder_platform_interaction/elementFactory';
import { FEROV_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { addCurlyBraces } from 'builder_platform_interaction/commonUtils';
import { DynamicTypeMappingChangeEvent, PropertyChangedEvent } from 'builder_platform_interaction/events';
import { dehydrate, getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { getFerovTypeFromTypeName, EXTENSION_PARAM_PREFIX } from 'builder_platform_interaction/screenEditorUtils';

/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
    labels = LABELS;

    @api
    get field() {
        return this._field;
    }

    set field(value) {
        this._field = value;
        this.state = screenExtensionPropertiesPropsToStateReducer(this.state, this);
    }

    @api
    get extensionDescription() {
        return this._extensionDescription;
    }

    set extensionDescription(value) {
        this._extensionDescription = value;
        this.state = screenExtensionPropertiesPropsToStateReducer(this.state, this);
    }

    @api
    get processType() {
        return this._processTypeValue;
    }

    set processType(value) {
        this._processTypeValue = value;
        this._automaticOutputHandlingSupported =
            getProcessTypeAutomaticOutPutHandlingSupport(value) !== FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
    }

    @api
    validate() {
        if (this.hasConfigurationEditor) {
            const customPropertyEditor = this.template.querySelector(
                'builder_platform_interaction-custom-property-editor'
            );
            if (customPropertyEditor) {
                return customPropertyEditor.validate();
            }
        }
        return [];
    }

    @api
    configurationEditor;

    @track
    _field;

    @track
    _extensionDescription;

    @track
    _processType;

    @track
    _automaticOutputHandlingSupported;

    @track
    state = {
        inputParameters: null,
        outputParameters: null,
        dynamicTypeMappings: [],
        storeOutputAutomatically: undefined
    };

    get isAdvancedCheckboxDisplayed() {
        return this.isAutomaticOutputHandlingSupported && this.hasOutputs;
    }

    /**
     * @return {Boolean} : whether or not the process type supports the automatic output handling
     */
    get isAutomaticOutputHandlingSupported() {
        return this._automaticOutputHandlingSupported;
    }

    /**
     * @return {boolean} : whether or not this extension has output values
     */
    get hasOutputs() {
        return this.state.outputParameters && this.state.outputParameters.length > 0;
    }

    /**
     * @return {boolean} true : the user chooses to use the Advanced Options
     */
    get isAdvancedMode() {
        return !this.state.storeOutputAutomatically;
    }

    get isManualOutputDisplayed() {
        return this.hasOutputs && (!this.isAutomaticOutputHandlingSupported || this.isAdvancedMode);
    }

    get hasUnboundDynamicTypeMappings() {
        return (
            this.state.dynamicTypeMappings &&
            !!this.state.dynamicTypeMappings.find(
                dynamicTypeMapping => !dynamicTypeMapping.value || dynamicTypeMapping.comboboxConfig.errorMessage
            )
        );
    }

    get hasDynamicTypeMappings() {
        return this.state.dynamicTypeMappings && this.state.dynamicTypeMappings.length > 0;
    }

    /**
     * configuration editor associated with a component. It is null if it is not defined
     *
     * @memberof ScreenExtensionPropertiesEditor
     */
    get hasConfigurationEditor() {
        return !!this.configurationEditor;
    }

    /**
     * Returns the values for configuration editor
     * filter the input parameters with value from flow extension and create a new copy
     * Dehydrate the new copy of input parameter and swap the guids with dev names
     * then convert it into desired shape
     */
    get configurationEditorValues() {
        if (this._field && this._field.inputParameters && this._shouldCreateConfigurationEditor()) {
            const inputParameters = this._field.inputParameters
                .filter(({ value }) => !!value)
                .map(inputParameter => createInputParameter(inputParameter));
            dehydrate(inputParameters);
            swapUidsForDevNames(Store.getStore().getCurrentState().elements, inputParameters);
            return inputParameters.map(({ name, value, valueDataType }) => ({
                id: name,
                value: valueDataType === FEROV_DATA_TYPE.REFERENCE ? addCurlyBraces(value) : value,
                dataType: valueDataType
            }));
        }
        return [];
    }

    /**
     * Returns the current flow state. Shape is same as flow metadata.
     */
    get flowContext() {
        if (this._shouldCreateConfigurationEditor()) {
            const flow = translateUIModelToFlow(Store.getStore().getCurrentState());
            const {
                variables = [],
                constants = [],
                textTemplates = [],
                stages = [],
                screens = [],
                recordUpdates = [],
                recordLookups = [],
                recordDeletes = [],
                recordCreates = [],
                formulas = [],
                apexPluginCalls = [],
                actionCalls = []
            } = flow.metadata;
            return {
                variables,
                constants,
                textTemplates,
                stages,
                screens,
                recordUpdates,
                recordLookups,
                recordDeletes,
                recordCreates,
                formulas,
                apexPluginCalls,
                actionCalls
            };
        }
        return {};
    }

    /**
     * @param {object} event - property changed event coming from parameter-item of custom property editor
     */
    handleCpePropertyChangeEvent(event) {
        event.stopPropagation();
        const { id, newValueDataType: valueDataType, newValue: value } = event && event.detail;
        if (!id) {
            throw new Error('id is not defined');
        }

        const inputParam = this.state && this.state.inputParameters.find(({ descriptor }) => descriptor.apiName === id);
        const { isInput, isRequired, dataType } = inputParam && inputParam.descriptor;
        const refValue = value;

        const obj = {
            id,
            value,
            valueDataType,
            dataType,
            isInput,
            isRequired
        };
        swapDevNamesToGuids(Store.getStore().getCurrentState().elements, obj);
        this._updateInputParameter({ ...obj, ...{ refValue } });
    }

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     * @param {Object} event - event
     */
    handleAdvancedOptionsSelectionChange(event) {
        this.state = screenExtensionPropertiesEventReducer(this.state, this, event);
    }

    /**
     * Handles a change of a dynamic type mapping.
     * @param {object} event
     */
    handleDynamicTypeMappingChange(event) {
        const rowIndex = event.target.rowIndex;
        const dynamicTypeMapping = this.state.dynamicTypeMappings.find(value => value.rowIndex === rowIndex);
        this.dispatchEvent(
            new DynamicTypeMappingChangeEvent({
                typeName: getValueFromHydratedItem(dynamicTypeMapping.name),
                typeValue: event.detail.item
                    ? getValueFromHydratedItem(event.detail.item.value)
                    : event.detail.displayText,
                rowIndex,
                error: event.detail.error
            })
        );
    }

    _shouldCreateConfigurationEditor() {
        return (
            this.configurationEditor &&
            this.configurationEditor.name &&
            (!this.configurationEditor.errors || this.configurationEditor.errors.length === 0)
        );
    }

    _updateInputParameter(inputParamObj) {
        const { id, value, refValue, valueDataType, dataType, isInput, isRequired } = inputParamObj;
        const prefix = isInput ? EXTENSION_PARAM_PREFIX.INPUT : EXTENSION_PARAM_PREFIX.OUTPUT;
        const inputParam = this._field && this._field.inputParameters.find(({ name }) => name.value === id);
        const oldValue = { value: null, error: null };
        oldValue.value = inputParam ? inputParam.value.value : null;
        const newValue = { value: refValue, error: null };

        // By: screenReducer -> PropertyChangedEvent
        const event = new PropertyChangedEvent(
            `${prefix}.${id}`,
            newValue,
            null,
            value,
            oldValue,
            undefined,
            valueDataType
        );
        event.detail.required = isRequired;
        event.detail.valueDataType = getFerovTypeFromTypeName(dataType) || dataType;
        this.dispatchEvent(event);
    }
}
