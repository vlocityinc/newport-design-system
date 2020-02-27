import { LightningElement, api } from 'lwc';
import {
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    ReorderListEvent
} from 'builder_platform_interaction/events';

/**
 * Wrapper used to represent visual preview of screen fields which are are display fields.
 */
export default class ScreenColumnField extends LightningElement {
    @api column;
    @api selectedItemGuid;

    get fields() {
        if (this.column.fields) {
            return this.column.fields.map(field => {
                return {
                    field,
                    selected: this.selectedItemGuid === field.guid
                };
            });
        }

        return [];
    }

    get isColumnEmpty() {
        return this.column.fields <= 0;
    }

    // TODO: handleDrop was copied from screenEditorCanvas. I just added them here so that
    // we can test my current user story (W-7149680), which is to do the factory work for
    // sections and columns. When I work on the story to add support for sections and columns
    // to the screen editor canvas (W-7036751), this will hopefully be consolidated with some
    // of the screenEditorCanvas code.
    handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();

        // Temporarily adding the new fields after all the other fields in the column
        const index = this.column.fields.length;

        // Figure out if we're adding a field or moving a field and fire the correct event.
        if (
            event.dataTransfer &&
            (event.dataTransfer.effectAllowed === 'copy' ||
                event.dataTransfer.getData('dragStartLocation') === 'leftPanel')
        ) {
            // Field is being added from the palette.
            const fieldTypeName = event.dataTransfer.getData('text');
            const addFieldEvent = createAddScreenFieldEvent(fieldTypeName, index, this.column);
            this.dispatchEvent(addFieldEvent);
        } else {
            // Existing field is being moved around.
            const sourceGuid = event.dataTransfer.getData('text');
            const destScreenField = this.column.fields[index - 1];
            if (sourceGuid && destScreenField) {
                this.fireReorder(sourceGuid, destScreenField.guid);
            }
        }
    }

    handleDeleteScreenElement(event) {
        event.preventDefault();
        event.stopPropagation();
        this.dispatchEvent(createScreenElementDeletedEvent(event.screenElement, event.property, this.column));
    }

    fireReorder(sourceIndex, destIndex) {
        if (sourceIndex !== destIndex) {
            const reorderListEvent = new ReorderListEvent(sourceIndex, destIndex);
            this.dispatchEvent(reorderListEvent);
        }
    }
}
