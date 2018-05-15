import { Element, api, track, unwrap } from 'engine';
import { nodeType } from 'builder_platform_interaction-screen-editor-utils';
import { localizeString, I18N_KEY_SCREEN_SCREEN } from 'builder_platform_interaction-screen-editor-i18n-utils';

/*
 * Right hand side component, used to toggle between screen and field property editors.
 */
export default class ScreenEditorPropertiesEditorContainer extends Element {
    @track _node;
    @track toggleIconName = 'utility:expand_alt';

    @api set node(value) {
        this._node = unwrap(value);
    }

    @api get node() {
        return this._node;
    }

    get isScreen() {
        return this.node && this.node.nodeType === nodeType.screen;
    }

    get screenLabel() {
        return localizeString(I18N_KEY_SCREEN_SCREEN);
    }

    handleToggleExpand = (/* event */) => {
        const container = this.root.querySelector('builder_platform_interaction-screen-properties-editor');

        container.classList.toggle('slds-size_medium');
        const expanded = container.classList.toggle('slds-size_x-large');

        this.toggleIconName = expanded ? 'utility:contract_alt' :  'utility:expand_alt';
    }

    handleScreenSelection =  (/* event */) => {
        this.dispatchEvent(new CustomEvent('screenselected', {
            bubbles: true,
            cancelable: true,
            composed: true,
            detail: {screenField: this.node}
        }));
    }
}