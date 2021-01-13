import { api, unwrap, LightningElement } from 'lwc';
import { AuraComponent } from './auraInterop';

export default class ScreenExtensionField extends LightningElement {
    @api
    attributes;

    @api
    descriptor;

    @api
    name;

    @api
    outputs;

    embededAuraComponent;

    @api
    getAuraComponent() {
        return this.embededAuraComponent;
    }

    get auraFieldClass() {
        return this.descriptor.startsWith('flowruntime') ? 'slds-m-bottom_x-small' : '';
    }

    get containerClass() {
        return 'slds-p-vertical_x-small slds-p-horizontal_small';
    }

    renderedCallback() {
        if (!this.embededAuraComponent) {
            // remove proxies/membranes for component creation
            const container = unwrap(this.template.querySelector('div'));
            const descriptor = unwrap(this.descriptor);
            const attributes = unwrap(this.attributes);
            this.embededAuraComponent = new AuraComponent(container, descriptor, attributes, null);
        }
    }

    disconnectedCallback() {
        if (this.embededAuraComponent) {
            this.embededAuraComponent.unrenderComponent();
            this.embededAuraComponent = undefined;
        }
    }
}
