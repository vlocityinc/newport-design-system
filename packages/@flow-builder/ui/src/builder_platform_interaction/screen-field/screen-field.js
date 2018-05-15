import { Element, api } from 'engine';

/*
 * The screen field element that will decide the actual component to use for preview based on the field type
 */
export default class ScreenField extends Element {
    @api screenfield;

    get isExtension() {
        return this.screenfield.type.fieldType === 'ComponentInstance';
    }

    get icon() {
        return this.screenfield.icon;
    }

    get hasName() {
        const name = this.screenfield.name;
        return name !== undefined && name !== null && name !== '';
    }

    get name() {
        return this.screenfield.name;
    }
}
