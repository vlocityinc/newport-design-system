import { LightningElement, api, track } from 'lwc';
import *  as screenEditorUtils from "builder_platform_interaction/screenEditorUtils";
import { createScreenNodeSelectedEvent } from "builder_platform_interaction/events";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { getErrorsFromHydratedElement } from "builder_platform_interaction/dataMutationLib";


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
        if (this._node && this._node.guid !== value.guid) {
            this.displaySpinner = true;
            this._node = null;
            Promise.resolve().then(() => {
                this.displaySpinner = false;
                this._node = value;
                if (this.isExtensionField) {
                    this.fetchDescription();
                } else {
                    this.extendedInfo = null;
                }
            });
        } else {
            this.displaySpinner = false;
            this._node = value;
        }
    }

    @api get node() {
        return this._node;
    }

    get isScreen() {
        return screenEditorUtils.isScreen(this.node);
    }

    get isExtensionField() {
        return screenEditorUtils.isExtensionField(this.node);
    }

    get isDisplayField() {
        return screenEditorUtils.isDisplayTextField(this.node);
    }

    get isInputField() {
        return screenEditorUtils.isInputField(this.node) || screenEditorUtils.isPasswordField(this.node);
    }

    get isTextAreaField() {
        return screenEditorUtils.isTextAreaField(this.node);
    }

    get isChoiceField() {
        return screenEditorUtils.isChoiceField(this.node);
    }

    // Temporary function that is only needed while property editors are in development.
    get isOther() {
        return !this.isScreen && !this.isExtensionField && !this.isDisplayField && !this.isInputField &&
            !this.isTextAreaField && !this.isPasswordField && !this.isChoiceField;
    }

    get hasErrors() {
        return getErrorsFromHydratedElement(this.node).length > 0;
    }

    handleToggleExpand = (/* event */) => {
        const container = this.template.querySelector('.properties-container');

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
        screenEditorUtils.describeExtension(node.extensionName.value, false, (desc, error) => {
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