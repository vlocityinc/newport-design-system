import { api, unwrap, LightningElement } from 'lwc';
import { AuraComponent } from './auraInterop';

export default class ScreenExtensionField extends LightningElement {
    @api
    descriptor;

    @api
    name;

    @api
    outputs;

    embededAuraComponent;

    _attributes;

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

    @api
    get attributes() {
        return this._attributes;
    }

    set attributes(newAttributes) {
        // Only set attributes if they have actually changed. If we don't perform this check, we
        // can end up re-rendering the component when not necessary. For example, when a user clicks
        // done in the screen editor, there is some processing of the entire screen that results
        // in this code being executed, even if there are no changes to your screen field.
        // In that case, we don't want to set new attributes. If we did, the user would see any
        // errors caused by this component again.
        if (this._attributes && newAttributes && this._attributes.length === newAttributes.length) {
            const diffKeys = Object.keys(newAttributes).filter((key) => newAttributes[key] !== this._attributes[key]);
            if (diffKeys && diffKeys.length > 0) {
                this._attributes = newAttributes;
                this.reloadComoponent();
            }
        } else {
            this._attributes = newAttributes;
            this.reloadComoponent();
        }
    }

    renderedCallback() {
        if (!this.embededAuraComponent) {
            this.embededAuraComponent = this.prepareComponent();
        }
    }

    reloadComoponent() {
        if (this.embededAuraComponent) {
            this.embededAuraComponent.unrenderComponent();
            this.embededAuraComponent = this.prepareComponent();
        }
    }

    prepareComponent() {
        // remove proxies/membranes for component creation
        const container = unwrap(this.template.querySelector('div'));
        const descriptor = unwrap(this.descriptor);
        const attributes = unwrap(this._attributes);
        return new AuraComponent(container, descriptor, attributes, null);
    }

    disconnectedCallback() {
        if (this.embededAuraComponent) {
            this.embededAuraComponent.unrenderComponent();
            this.embededAuraComponent = undefined;
        }
    }
}
