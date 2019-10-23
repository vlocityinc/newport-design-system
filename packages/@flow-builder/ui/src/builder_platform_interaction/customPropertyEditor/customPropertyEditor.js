import { api, LightningElement, unwrap } from 'lwc';
import { createConfigurationEditor } from 'builder_platform_interaction/builderUtils';
import { generateGuid } from 'builder_platform_interaction/storeLib';

const CONFIGURATION_EDITOR_SELECTOR = '.configuration-editor';

export default class CustomPropertyEditor extends LightningElement {
    _id = generateGuid();
    _isComponentCreated = false;
    _property = [];
    _unrenderFn;

    @api
    configurationEditor;

    @api
    flowContext;

    @api
    set configurationEditorProperties(properties) {
        this._property = properties ? unwrap(properties) : [];
    }

    get configurationEditorProperties() {
        return this._property;
    }

    createComponent = () => {
        const container = this.template.querySelector(
            CONFIGURATION_EDITOR_SELECTOR
        );
        const errorCallback = () => {
            throw new Error('unable to create the component');
        };

        const params = {
            cmpName: this.configurationEditor,
            container,
            errorCallback,
            attr: {
                flowContext: this.flowContext,
                id: this._id,
                property: this.configurationEditorProperties
            }
        };
        this._unrenderFn = createConfigurationEditor(params);
        this._isComponentCreated = true;
    };

    renderedCallback() {
        // Dynamically creating the component for the first time
        if (!this._isComponentCreated && this.configurationEditor) {
            this.createComponent();
        }
    }

    disconnectedCallback() {
        if (this._unrenderFn) {
            this._unrenderFn();
        }
    }
}
