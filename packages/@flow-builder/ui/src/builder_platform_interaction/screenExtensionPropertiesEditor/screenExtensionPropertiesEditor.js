import { LightningElement, api, track } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

/*
 * Dynamic property editor for screen extensions.
 */
export default class ScreenExtensionPropertiesEditor extends LightningElement {
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
        const extName = this._extensionDescription
            ? this._extensionDescription.name
            : null;
        const fieldName = this._field ? this._field.name : null;

        if (this._extensionDescription && fieldName && extName !== fieldName) {
            this.inputParameters = this.createParametersMapping(
                'inputParameters',
                'isInput',
                true
            );
            this.outputParameters = this.createParametersMapping(
                'outputParameters',
                'isOutput',
                false
            );
        }
    };

    createParametersMapping = (name, filteringProperty, sortByRequiredness) => {
        const params = [];
        for (let i = 0; i < this._extensionDescription[name].length; i++) {
            const descriptor = this._extensionDescription[name][i];
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
}
