import { LightningElement, api } from 'lwc';
/**
 * Wrapper used to represent visual preview of a screen section field.
 */
export default class ScreenSectionField extends LightningElement {
    @api title;
    @api typeName;

    // TODO: Temporary data provider. This is just here so the section
    // isn't empty. When we do the factory work, the creation of the
    // default column will happen there. W-7149680
    columns = [{ name: 'Column 1', guid: '1' }];
}
