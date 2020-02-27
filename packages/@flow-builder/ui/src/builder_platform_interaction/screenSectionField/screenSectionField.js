import { LightningElement, api } from 'lwc';
/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenSectionField extends LightningElement {
    @api title;
    @api typeName;
    @api section;
    @api selectedItemGuid;
}
