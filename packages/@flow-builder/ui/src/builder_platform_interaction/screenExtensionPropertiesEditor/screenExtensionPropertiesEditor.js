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
import { DynamicTypeMappingChangeEvent } from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

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
}
