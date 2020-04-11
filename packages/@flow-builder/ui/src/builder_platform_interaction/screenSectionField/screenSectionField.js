import { LightningElement, api } from 'lwc';
/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenSectionField extends LightningElement {
    @api title;
    @api typeName;
    @api section;
    @api selectedItemGuid;

    // TODO: This approach for setting the slds_size_* of the columns won't work when the user is able to
    // set the widths of the various columns (rather than all columns being equal width) - W-7207695
    get columnClass() {
        let calculatedColumnClass = 'slds-grow slds-col slds-p-horizontal_x-small';
        if (this.section && this.section.fields && this.section.fields.length > 0) {
            calculatedColumnClass = calculatedColumnClass + ' slds-size_1-of-' + this.section.fields.length;
        }
        return calculatedColumnClass;
    }
}
