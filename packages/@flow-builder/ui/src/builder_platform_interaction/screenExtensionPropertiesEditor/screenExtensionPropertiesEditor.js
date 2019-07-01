import { LightningElement, api, track } from 'lwc';
import { screenExtensionPropertiesReducer } from './screenExtensionPropertiesReducer';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';

/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
    @track _field;
    @track inputParameters;
    @track state = {
        editor: {}
    };
    labels = LABELS;

    processTypeValue = '';
    automaticOutputHandlingSupported = false;

    /**
     * Screen node getter
     * @returns {object} The screen
     */
    @api get node() {
        return this.state.editor;
    }

    /**
     * Screen node setter, sets the value and initializes the selectedNode
     * @param {object} newValue - The new screen
     */
    set node(newValue) {
        this.state.editor = newValue;
    }

    /**
     * public api function to return the node
     * @returns {object} node - node
     */
    @api getNode() {
        return this.state.editor;
    }

    set field(value) {
        this._field = value;
        this.checkState();
    }

    @api get field() {
        return this._field;
    }

    set extensionDescription(value) {
        if (!this.extensionDescription) {
            this.state.editor.extensionDescription = value;
            this.checkState();
        }
    }

    @api get extensionDescription() {
        return this.state.editor.extensionDescription;
    }

    @api
    get processType() {
        return this.processTypeValue;
    }

    set processType(newValue) {
        this.processTypeValue = newValue;
        this.automaticOutputHandlingSupported =
            getProcessTypeAutomaticOutPutHandlingSupport(newValue) !==
            FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        if (this.state.editor.storeOutputAutomatically === undefined) {
            this.state.editor.storeOutputAutomatically = true;
        }
    }

    /**
     * @return {Boolean} : whether or not the process type supports the automatic output handling
     */
    get isAutomaticOutputHandlingSupported() {
        return this.automaticOutputHandlingSupported;
    }

    /**
     * @return {Boolean} : whether or not this extension has output values
     */
    get hasOutputs() {
        return (
            this.state.editor.outputParameters &&
            this.state.editor.outputParameters.length > 0
        );
    }

    /**
     * @return {Boolean} true : the user chooses to use the Advanced Options
     */
    get isAdvancedMode() {
        return !this.state.editor.storeOutputAutomatically;
    }

    get isDisplayManualOutput() {
        return !this.isAutomaticOutputHandlingSupported || this.isAdvancedMode;
    }

    /**
     * Checks if both, the description and the value have been set, and, if so, creates the parameters arrays
     */
    checkState = () => {
        const extName = this.state.editor.extensionDescription
            ? this.state.editor.extensionDescription.name
            : null;
        const fieldName = this._field ? this._field.name : null;

        if (
            this.state.editor.extensionDescription &&
            fieldName &&
            extName !== fieldName
        ) {
            this.inputParameters = this.createParametersMapping(
                'inputParameters',
                'isInput',
                true
            );
            this.state.editor.outputParameters = this.createParametersMapping(
                'outputParameters',
                'isOutput',
                false
            );
        }
    };

    createParametersMapping = (name, filteringProperty, sortByRequiredness) => {
        const params = [];
        for (
            let i = 0;
            i < this.state.editor.extensionDescription[name].length;
            i++
        ) {
            const descriptor = this.state.editor.extensionDescription[name][i];
            if (descriptor[filteringProperty]) {
                const attributes = this.field[name].filter(
                    param => descriptor.apiName === param.name.value
                );
                if (attributes && attributes.length > 0) {
                    for (let j = 0; j < attributes.length; j++) {
                        params.push({
                            attribute: attributes[j],
                            descriptor,
                            index: j + 1,
                            rowIndex: attributes[j].rowIndex,
                            key: descriptor.apiName + j
                        });
                    }
                } else {
                    params.push({
                        attribute: undefined,
                        descriptor,
                        key: descriptor.apiName
                    });
                }
            }
        }

        params.sort((p1, p2) => {
            if (
                sortByRequiredness &&
                p1.descriptor.isRequired !== p2.descriptor.isRequired
            ) {
                return p1.descriptor.isRequired ? -1 : 1;
            }
            const p1Label = (
                p1.descriptor.label ||
                p1.descriptor.apiName ||
                ''
            ).toLowerCase();
            const p2Label = (
                p2.descriptor.label ||
                p2.descriptor.apiName ||
                ''
            ).toLowerCase();
            return p1Label.localeCompare(p2Label);
        });

        return params;
    };

    /**
     * Handles selection/deselection of 'Use Advanced Options' checkbox
     * @param {Object} event - event
     */
    handleAdvancedOptionsSelectionChange(event) {
        event.stopPropagation();
        this.state.editor = screenExtensionPropertiesReducer(
            this.state.editor,
            event
        );
    }
}
