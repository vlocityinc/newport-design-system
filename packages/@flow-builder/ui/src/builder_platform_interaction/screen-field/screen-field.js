import { Element, api } from 'engine';
/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends Element {
    @api screenfield;

    get isExtension() {
        return this.screenfield.type.fieldType === 'ComponentInstance';
    }

    get isInputFieldType() {
        return this.screenfield.type.fieldType === 'InputField' || this.screenfield.type.fieldType === 'PasswordField';
    }

    get isTextAreaType() {
        return this.screenfield.type.name === 'LargeTextArea';
    }

    get isDisplayTextType() {
        return this.screenfield.type.fieldType === 'DisplayText';
    }
}
