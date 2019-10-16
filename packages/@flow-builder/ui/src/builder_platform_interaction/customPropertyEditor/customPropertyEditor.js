import { LightningElement, api } from 'lwc';
import { createConfigurationEditor } from 'builder_platform_interaction/builderUtils';

export default class CustomPropertyEditor extends LightningElement {
    @api
    configurationEditor;

    _isComponentCreated = false;
    _unrenderFn;

    createComponent = () => {
        const container = this.template.querySelector(".configuration-editor");
        const errorCallback = () => {
            throw new Error('unable to create the component');
        };
        const params = {
            cmpName: this.configurationEditor,
            container,
            errorCallback
        };
        this._unrenderFn = createConfigurationEditor(params);
        this._isComponentCreated = true;
    }

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