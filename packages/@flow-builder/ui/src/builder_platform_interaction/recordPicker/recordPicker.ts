import { AuraComponent } from './auraInterop';
import { api, LightningElement, unwrap } from 'lwc';

export default class RecordPicker extends LightningElement {
    embededAuraComponent;
    _attributes;
    _values;
    _recordSelectedCallback;

    @api
    get attributes() {
        return this._attributes;
    }

    set attributes(newAttributes) {
        this._attributes = newAttributes;
    }

    @api
    get values() {
        return this._values;
    }

    set values(values) {
        const oldValues = this._values;

        this._values = values;

        if (values && values !== oldValues) {
            this.reloadComponent();
        }
    }

    @api
    error;

    @api
    get recordSelectedCallback() {
        return this._recordSelectedCallback;
    }

    set recordSelectedCallback(recordSelectedCallback) {
        const oldCallback = this._recordSelectedCallback;

        this._recordSelectedCallback = recordSelectedCallback;

        if (recordSelectedCallback && recordSelectedCallback !== oldCallback) {
            this.reloadComponent();
        }
    }

    renderedCallback() {
        if (
            !this.embededAuraComponent &&
            this.attributes &&
            this.values &&
            this.recordSelectedCallback &&
            this.error !== undefined
        ) {
            this.embededAuraComponent = this.prepareComponent();
        }
    }

    reloadComponent() {
        if (this.embededAuraComponent) {
            this.embededAuraComponent.unrenderComponent();
        }
        this.embededAuraComponent = this.prepareComponent();
    }

    prepareComponent() {
        const container = this.template.querySelector('.entityPicker');

        const descriptor = 'builder_platform_interaction:recordPickerWrapper';
        const attributes = {
            ...unwrap(this._attributes),
            recordSelectedCallback: this.recordSelectedCallback,
            values: this.values ? this.values : [],
            errors: this.error ? [{ message: this.error }] : []
        };

        return new AuraComponent(container, descriptor, attributes, this.embededAuraComponent);
    }

    disconnectedCallback() {
        if (this.embededAuraComponent) {
            this.embededAuraComponent.unrenderComponent();
            this.embededAuraComponent = undefined;
        }
    }
}
