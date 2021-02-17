import { api, unwrap, LightningElement } from 'lwc';
import { AuraComponent } from './auraInterop';

export default class ScreenExtensionField extends LightningElement {
    @api
    descriptor;

    @api
    name;

    embededAuraComponent;

    _attributes;

    @api
    get attributes() {
        return this._attributes;
    }

    set attributes(newAttributes) {
        // Only reload the component if it's present AND the attributes have actually changed.
        // Otherwise, we may show the user an error they have already seen even though they
        // didn't change anything. For example, when a user clicks done in the screen editor,
        // there is some processing of the entire screen that results
        // in this code being executed, even if there are no changes to your screen field.
        // In that case, we don't want to set new attributes. If we did, the user would see any
        // errors caused by this component again (if the component already had errors).
        if (this.embededAuraComponent && this.attributesHaveChanged(this._attributes, newAttributes)) {
            this._attributes = newAttributes;
            this.reloadComponent();
        } else {
            this._attributes = newAttributes;
        }
    }

    get fieldClass() {
        return this.descriptor.startsWith('flowruntime') ? 'slds-m-bottom_x-small' : '';
    }

    // We aren't going to be using this for now, but this is how we'll update attributes
    // inline (i.e. without destroying and recreating the component) if we ever want to do
    // this again. For now, we will destory and recreate every time.
    updateComponent() {
        for (const attr of Object.keys(this._attributes)) {
            this.embededAuraComponent.component.set('v.' + attr, this._attributes[attr]);
        }
    }

    renderedCallback() {
        if (!this.embededAuraComponent) {
            this.embededAuraComponent = this.prepareComponent();
        }
    }

    reloadComponent() {
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

    attributesHaveChanged(oldAttributes, newAttributes) {
        const diffKeys = Object.keys(newAttributes).filter((key) => newAttributes[key] !== oldAttributes[key]);
        return diffKeys && diffKeys.length > 0;
    }
}
