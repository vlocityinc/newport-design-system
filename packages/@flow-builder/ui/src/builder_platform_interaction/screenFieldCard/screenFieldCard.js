import { LightningElement, api } from 'lwc';
import { booleanAttributeValue} from "builder_platform_interaction/screenEditorUtils";
/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends LightningElement {
    @api title;
    @api text;
    @api icon;
    @api error;

    get iconName() {
        return this.error ? 'utility:error' : this.icon;
    }

    get hasError() {
        return booleanAttributeValue(this, 'error');
    }

    get computedClass() {
        return 'slds-card slds-grow ' + (this.hasError ? 'has-error' : 'bordered');
    }

    get iconVariant() {
        return this.hasError ? 'error' : '';
    }
}