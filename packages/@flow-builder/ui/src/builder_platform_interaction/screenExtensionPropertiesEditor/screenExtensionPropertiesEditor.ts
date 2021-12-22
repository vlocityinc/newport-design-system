// @ts-nocheck
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
import { swapDevNamesToGuids } from 'builder_platform_interaction/translatorLib';
import {
    DynamicTypeMappingChangeEvent,
    PropertyChangedEvent,
    InputsOnNextNavToAssocScrnChangeEvent
} from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { getFerovTypeFromTypeName, EXTENSION_PARAM_PREFIX } from 'builder_platform_interaction/screenEditorUtils';
import {
    InputsOnNextNavToAssocScrnOption,
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';
import {
    getBuilderContext,
    getAutomaticOutputVariables,
    getInputVariables,
    getScreenFieldTypeMappings,
    getElementInfo
} from 'builder_platform_interaction/customPropertyEditorLib';
/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
    @track
    private _field;

    labels = LABELS;
    expandedSectionNames = [];

    @api
    get field() {
        return this._field;
    }

    set field(value) {
        this._field = value;
        this.state = screenExtensionPropertiesPropsToStateReducer(this.state, this);
        if (hasScreenFieldVisibilityCondition(this._field) && this.expandedSectionNames.length === 0) {
            this.expandedSectionNames = [SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
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
    _extensionDescription;

    @track
    _processType;

    @track
    _automaticOutputHandlingSupported;

    @api
    editorParams;

    @track
    state = {
        inputParameters: null,
        outputParameters: null,
        dynamicTypeMappings: [],
        storeOutputAutomatically: undefined
    };

    inputsOnNextNavToAssocScrnOptions = [
        {
            label: LABELS.extensionInputsOnNextNavToAssocScrnUseStoredValuesDescription,
            value: InputsOnNextNavToAssocScrnOption.USE_STORED_VALUES
        },
        {
            label: LABELS.extensionInputsOnNextNavToAssocScrnResetValuesDescription,
            value: InputsOnNextNavToAssocScrnOption.RESET_VALUES
        }
    ];

    get isAdvancedCheckboxDisplayed() {
        return this.isAutomaticOutputHandlingSupported && this.hasOutputs;
    }

    /**
     * @returns {boolean} : whether or not the process type supports the automatic output handling
     */
    get isAutomaticOutputHandlingSupported() {
        return this._automaticOutputHandlingSupported;
    }

    /**
     * @returns {boolean} : whether or not this extension has output values
     */
    get hasOutputs() {
        return this.state.outputParameters && this.state.outputParameters.length > 0;
    }

    /**
     * @returns {boolean} true : the user chooses to use the Advanced Options
     */
    get isAdvancedMode() {
        return !this.state.storeOutputAutomatically;
    }

    /**
     * @returns {boolean} true : manual output section is displayed
     */
    get isManualOutputDisplayed() {
        return this.hasOutputs && (!this.isAutomaticOutputHandlingSupported || this.isAdvancedMode);
    }

    /**
     * @returns {boolean} true : the manual output are displayed in advanced accordion section
     */
    get isManualOutputDisplayedInAdvancedAccordionSection() {
        return this.isManualOutputDisplayed && this.isAutomaticOutputHandlingSupported;
    }

    /**
     * @returns {boolean} true : the manual output are displayed before advanced accordion section
     */
    get isManualOutputDisplayedBeforeAdvancedAccordionSection() {
        return this.isManualOutputDisplayed && !this.isAutomaticOutputHandlingSupported;
    }

    get hasUnboundDynamicTypeMappings() {
        return (
            this.state.dynamicTypeMappings &&
            !!this.state.dynamicTypeMappings.find(
                (dynamicTypeMapping) => !dynamicTypeMapping.value || dynamicTypeMapping.comboboxConfig.errorMessage
            )
        );
    }

    get hasDynamicTypeMappings() {
        return this.state.dynamicTypeMappings && this.state.dynamicTypeMappings.length > 0;
    }

    get showDynamicTypeMappings() {
        return this.hasDynamicTypeMappings && !this.hasConfigurationEditor;
    }

    get showExtraSections() {
        return this.hasConfigurationEditor || !this.hasUnboundDynamicTypeMappings;
    }

    /**
     * configuration editor associated with a component. It is null if it is not defined
     *
     * @memberof ScreenExtensionPropertiesEditor
     * @returns whether or not a configuration editor is set
     */
    get hasConfigurationEditor() {
        return !!this.configurationEditor;
    }

    /**
     * @returns the information about the screen LWC in which the configurationEditor is defined
     */
    get elementInfo() {
        return getElementInfo(this._field?.name, 'Screen');
    }

    /**
     * @returns list of input variables for configuration editor
     * filter the input parameters with value from flow extension and create a new copy
     * Dehydrate the new copy of input parameter and swap the guids with dev names
     * then convert it into desired shape
     */
    get configurationEditorInputVariables() {
        return getInputVariables(this.configurationEditor, this._field, Store.getStore().getCurrentState());
    }

    /**
     * @returns list of dynamic type mappings for configuration editor
     */
    get configurationEditorTypeMappings() {
        return getScreenFieldTypeMappings(this.configurationEditor, this._field);
    }

    /**
     * @returns the current flow state. Shape is same as flow metadata.
     */
    get builderContext() {
        return getBuilderContext(this.configurationEditor, Store.getStore().getCurrentState());
    }

    /**
     * @returns the automatic output variables in the flow.
     */
    get automaticOutputVariables() {
        return getAutomaticOutputVariables(this.configurationEditor, Store.getStore().getCurrentState());
    }

    /**
     * @param {object} event - property changed event coming from parameter-item of custom property editor
     */
    handleCpePropertyChangeEvent(event) {
        event.stopPropagation();
        const { name: propertyName, newValueDataType: valueDataType, newValue: value } = event && event.detail;
        if (!propertyName) {
            throw new Error('property name is not defined');
        }

        const inputParam =
            this.state && this.state.inputParameters.find(({ descriptor }) => descriptor.apiName === propertyName);
        const { isInput, isRequired, dataType } = inputParam && inputParam.descriptor;
        const refValue = value;

        const obj = {
            propertyName,
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
     * @param {object} event - type mapping changed event coming from parameter dynamic type of custom property editor
     */
    handleCpeTypeMappingChangeEvent(event) {
        event.stopPropagation();
        if (event && event.detail) {
            const { typeName, typeValue } = event.detail;
            this.dispatchEvent(
                new DynamicTypeMappingChangeEvent({
                    typeName,
                    typeValue,
                    isConfigurable: true
                })
            );
        }
    }

    /**
     * Handles selection/deselection of 'Manually Assign Variables' checkbox
     *
     * @param {Object} event - event
     */
    handleManuallyAssignVariablesChanged(event) {
        this.state = screenExtensionPropertiesEventReducer(this.state, this, event);
    }

    /**
     * Handles a change of a dynamic type mapping.
     *
     * @param {object} event
     */
    handleDynamicTypeMappingChange(event) {
        const rowIndex = event.target.rowIndex;
        const dynamicTypeMapping = this.state.dynamicTypeMappings.find((value) => value.rowIndex === rowIndex);
        this.dispatchEvent(
            new DynamicTypeMappingChangeEvent({
                typeName: getValueFromHydratedItem(dynamicTypeMapping.name),
                typeValue: event.detail.item
                    ? getValueFromHydratedItem(event.detail.item.value)
                    : event.detail.displayText,
                rowIndex,
                error: event.detail.error,
                isConfigurable: false
            })
        );
    }

    handleInputsOnNextNavToAssocScrnChange(event: CustomEvent) {
        event.stopPropagation();
        this.dispatchEvent(new InputsOnNextNavToAssocScrnChangeEvent(event.detail.value));
    }

    _updateInputParameter(inputParamObj) {
        const { propertyName, value, refValue, valueDataType, dataType, isInput, isRequired } = inputParamObj;
        const prefix = isInput ? EXTENSION_PARAM_PREFIX.INPUT : EXTENSION_PARAM_PREFIX.OUTPUT;
        const inputParam = this._field && this._field.inputParameters.find(({ name }) => name.value === propertyName);
        const oldValue = { value: null, error: null };
        oldValue.value = inputParam ? inputParam.value.value : null;
        const newValue = { value: refValue, error: null };

        // By: screenReducer -> PropertyChangedEvent
        const event = new PropertyChangedEvent(
            `${prefix}.${propertyName}`,
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
