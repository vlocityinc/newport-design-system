import { Element, api, track } from 'engine';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { PropertyValueChangedEvent } from 'builder_platform_interaction-events';
import { describeExtension } from 'builder_platform_interaction-screen-editor-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';

/*
 * Dynamic property editor TODO: refactor to be used as the property editor for LCs - W-4947239
 */
export default class ScreenExtensionPropertiesEditor extends Element {
    @track _field;
    @track mergedField;
    labels = LABELS;

    @api set field(val) {
        this._field = val;
        this.mergedField = null;
        if (this._field && this._field.extensionName) {
            describeExtension(this._field.extensionName.value).then(descriptor => {
                this.mergedField = {
                    extensionName: descriptor.name,
                    name: this._field.name ? this._field.name : {value: '', error: null},
                    inputParameters: this.mergeParameters(this._field.inputParameters, descriptor.inputParameters, 'value'),
                    outputParameters: this.mergeParameters(this._field.outputParameters, descriptor.outputParameters, 'assignToReference'),
                };
            }).catch(error => {
                throw error;
            });
        }
    }

    @api get field() {
        return this._field;
    }

    mergeParameters = (fieldParameters, descParameters, valuePropName) => {
        const fieldParamMap = [];
        for (const param of fieldParameters) {
            const fieldParam = {};
            fieldParam.name = param.name.value;
            fieldParam[valuePropName] = param[valuePropName];
            fieldParamMap[param.name.value] = fieldParam;
        }

        const mergedParams = [];
        for (const fieldParam of descParameters) {
            const param = {
                apiName: fieldParam.apiName,
                dataType: fieldParam.dataType,
                description: fieldParam.description,
                hasDefaultValue: fieldParam.hasDefaultValue,
                isRequired: fieldParam.isRequired,
                label: fieldParam.label,
                maxOccurs: fieldParam.maxOccurs,
                isCollection: fieldParam.maxOccurs > 1,
                guid: generateGuid()
            };

            if (fieldParam.objectType) {
                param.objecType = fieldParam.objectType;
            }

            const mdParam = fieldParamMap[param.apiName];
            if (mdParam) {
                param[valuePropName] = mdParam[valuePropName];
            }

            mergedParams.push(param);
        }

        return mergedParams;
    }

    handlePropertyChange = (/* event */) => {
    }

    handlePropertyBlur = (/* event */) => {
    //    this.dispatchValueChangedEvent(field);
    }

    dispatchValueChangedEvent = (field) => {
        const oldValue = field.property.value;
        const newValue = field.getValue();
        if (oldValue !== newValue) {
            this.dispatchEvent(new PropertyValueChangedEvent(field, field.property, oldValue, newValue));
        }
    }
}