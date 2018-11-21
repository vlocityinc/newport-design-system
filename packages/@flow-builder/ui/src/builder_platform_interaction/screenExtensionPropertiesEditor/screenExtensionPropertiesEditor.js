import { LightningElement, api, track } from 'lwc';
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";

/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
    // TODO can't close this story until we are able to handle two outputs for the same attribute
    @track _field;
    @track _extensionDescription;
    @track inputParameters;
    @track outputParameters;
    labels = LABELS;

    set field(value) {
        this._field = value;
        this.checkState();
    }

    @api get field() {
        return this._field;
    }

    set extensionDescription(value) {
        if (!this._extensionDescription) {
            this._extensionDescription = value;
            this.checkState();
        }
    }

    @api get extensionDescription() {
        return this._extensionDescription;
    }

    get hasOutputs() {
        return this.outputParameters && this.outputParameters.length > 0;
    }

    /**
     * Checks if both, the description and the value have been set, and, if so, creates the parameters arrays
     */
    checkState = () => {
        const extName = this._extensionDescription ? this._extensionDescription.name : null;
        const fieldName = this._field ? this._field.name : null;

        if (this._extensionDescription && extName !== fieldName) {
            this.inputParameters = this.createParametersMapping('inputParameters', true);
            this.outputParameters = this.createParametersMapping('outputParameters', false);
        }
    };

    createParametersMapping = (name, sort) => {
        const params = [];
        for (let i = 0; i <  this._extensionDescription[name].length; i++) {
            const descriptor = this._extensionDescription[name][i];
            const attribute = this.field[name].find(param => descriptor.apiName === param.name.value);
            params.push({attribute, descriptor});
        }

        if (sort) {
            params.sort((p1, p2) => {
                if (p1.descriptor.isRequired !== p2.descriptor.isRequired) {
                    return p1.descriptor.isRequired ? -1 : 1;
                }
                const p1Label = (p1.descriptor.label || p1.descriptor.apiName || '').toLowerCase();
                const p2Label = (p2.descriptor.label || p2.descriptor.apiName || '').toLowerCase();
                return p1Label.localeCompare(p2Label);
            });
        }

        return params;
    };
}