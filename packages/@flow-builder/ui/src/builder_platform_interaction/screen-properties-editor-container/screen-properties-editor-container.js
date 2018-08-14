import { LightningElement, api, track } from "lwc";
import { isScreen, isDisplayTextField, isExtensionField, isInputField, isTextAreaField, isPasswordField, describeExtension } from 'builder_platform_interaction-screen-editor-utils';
import { createScreenNodeSelectedEvent } from 'builder_platform_interaction-events';
import { LABELS } from 'builder_platform_interaction-screen-editor-i18n-utils';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction-data-mutation-lib';

/*
 * Right hand side component, used to toggle between screen and field property editors.
 */
export default class ScreenEditorPropertiesEditorContainer extends LightningElement {
    @track _node;
    @track extendedInfo;
    @track toggleIconName = 'utility:expand_alt';
    @track displaySpinner;

    labels = LABELS;

    set node(value) {
        this._node = value;
        if (this.isExtensionField) {
            this.fetchDescription();
        } else {
            this.extendedInfo = null;
        }
    }

    @api get node() {
        return this._node;
    }

    get isScreen() {
        return isScreen(this.node);
    }

    get isExtensionField() {
        return isExtensionField(this.node);
    }

    get isDisplayField() {
        return isDisplayTextField(this.node);
    }

    get isInputField() {
        return isInputField(this.node);
    }

    get isTextAreaField() {
        return isTextAreaField(this.node);
    }

    get isPasswordField() {
        return isPasswordField(this.node);
    }

    // Temporary function that is only needed while property editors are in development.
    get isOther() {
        return !this.isScreen && !this.isExtensionField && !this.isDisplayField && !this.isInputField && !this.isTextAreaField && !this.isPasswordField;
    }

    get hasErrors() {
        return getErrorsFromHydratedElement(this.node).length > 0;
    }

    handleToggleExpand = (/* event */) => {
        const container = this.template.querySelector('.properties-editor-panel');

        container.classList.toggle('slds-size_medium');
        const expanded = container.classList.toggle('slds-size_x-large');

        this.toggleIconName = expanded ? 'utility:contract_alt' :  'utility:expand_alt';
    }

    handleScreenSelection =  (/* event */) => {
        this.dispatchEvent(createScreenNodeSelectedEvent(this.node));
    }

    fetchDescription() {
        this.displaySpinner = true;
        const node = this.node; // closure
        describeExtension(node.extensionName.value, false, (desc, error) => {
            this.displaySpinner = false;
            if (this.node === node) { // Let's make sure the user didn't change the selection
                if (error) {
                    throw error;
                } else {
                    this.extendedInfo = desc;
                }
            }
        });
    }
}