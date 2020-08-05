// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
/**
 * Wrapper used to represent visual preview of section fields.
 */
export default class ScreenSectionField extends LightningElement {
    @api title;
    @api typeName;
    @api section;
    @api selectedItemGuid;

    get columns() {
        return this.section.fields.map((column) => {
            const columnWidth =
                column.inputParameters && column.inputParameters.length > 0
                    ? Number(getValueFromHydratedItem(column.inputParameters[0].value))
                    : 1;
            const calculatedClass =
                'slds-grow slds-col screen-section-field-column slds-size_' + columnWidth + '-of-12';
            return {
                ...column,
                calculatedClass
            };
        });
    }
}
