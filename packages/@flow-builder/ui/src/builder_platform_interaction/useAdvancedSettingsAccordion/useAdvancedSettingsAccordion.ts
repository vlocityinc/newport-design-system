import { LightningElement, api } from 'lwc';
import advancedAccordionLabel from '@salesforce/label/FlowBuilderRecordEditor.advancedAccordionLabel';
import { compareParamsByLabel } from 'builder_platform_interaction/calloutEditorLib';

export const LABELS = {
    advancedAccordionLabel
};

export default class UseAdvancedSettingsAccordion extends LightningElement {
    @api
    parameterListConfig;

    @api
    elementType;

    @api
    configurationEditor;

    /**
     * Checks if transaction control picker can be displayed based on the process type
     */
    @api
    showTransactionControlPicker;

    get labels() {
        return LABELS;
    }

    get hasConfigurationEditor() {
        return !!this.configurationEditor;
    }

    /**
     * The CSS depends on the automatic output handling supports.
     * @return {string} "slds-p-left_xx-large slds-p-right_small" : if the automatic output handling is supported
     * @return {string}
     * "slds-p-left_x-large slds-p-right_small" : if custom property editor exists
     * "slds-p-left_xx-large slds-p-right_small" : if the automatic output handling is supported
     */
    get cssDivAdvancedMode() {
        if (this.hasConfigurationEditor) {
            return 'slds-p-left_x-large slds-p-right_small';
        }
        return this.automaticOutputHandlingSupported ? 'slds-p-left_xx-large slds-p-right_small' : 'slds-p-right_small';
    }

    get storeOutputAutomatically() {
        return this.parameterListConfig.storeOutputAutomatically;
    }

    get automaticOutputHandlingSupported() {
        return this.parameterListConfig.automaticOutputHandlingSupported;
    }

    get isAdvancedMode() {
        return !this.storeOutputAutomatically || !this.automaticOutputHandlingSupported;
    }

    get emptyOutputs() {
        return this.parameterListConfig.outputs.length === 0;
    }

    get output() {
        return this.parameterListConfig.outputs[0];
    }

    get flowTransactionModel() {
        return this.parameterListConfig.flowTransactionModel;
    }

    get outputHeader() {
        return this.parameterListConfig.outputHeader;
    }

    get sortOutputs() {
        return this.parameterListConfig.sortOutputs;
    }

    get sortedOutputsWithWarnings() {
        const sortedOutputs = this.sortOutputs
            ? this.parameterListConfig.outputs.slice().sort(compareParamsByLabel)
            : this.parameterListConfig.outputs;
        return sortedOutputs.map((item) => ({
            item,
            warning: this.parameterListConfig.warnings[item.rowIndex] || {}
        }));
    }

    get showOutputSection() {
        return this.automaticOutputHandlingSupported && !this.emptyOutputs;
    }
}
