import { LightningElement, api } from 'lwc';
import { createAddScreenFieldToContainerFieldEvent } from 'builder_platform_interaction/events';
/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenSectionField extends LightningElement {
    @api title;
    @api typeName;
    @api section;
    @api selectedItemGuid;

    handleAddScreenFieldToContainerField(event) {
        event.preventDefault();
        event.stopPropagation();
        const ancestorPositions = event.detail.ancestorPositions;
        ancestorPositions.push(this.getIndexOfChildField(event.detail.container));
        const addFieldEvent = createAddScreenFieldToContainerFieldEvent(
            event.detail.typeName,
            event.detail.position,
            event.detail.parent,
            ancestorPositions,
            this.section
        );
        this.dispatchEvent(addFieldEvent);
    }

    getIndexOfChildField(field) {
        if (this.section) {
            return this.section.fields.findIndex(sfield => {
                return sfield.guid === field.guid;
            });
        }
        return -1;
    }
}
