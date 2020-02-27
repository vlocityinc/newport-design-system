import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { format } from 'builder_platform_interaction/commonUtils';

// TODO will be needed once we use AddScreenFieldToContainerFieldEvent
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import { createAddScreenFieldEvent } from 'builder_platform_interaction/events';

/*
 * Screen element property editor for section fields.
 */
export default class ScreenSectionFieldPropertiesEditor extends LightningElement {
    @api field = {};
    labels = LABELS;

    get isAddDisabled() {
        // TODO: the max number of columns should be coming for a single location
        // in the code
        return this.field.fields.length >= 4;
    }

    get columnsLabel() {
        return this.field.fields ? format(this.labels.columnsSectionTitle, this.field.fields.length) : '';
    }

    handleAdd(event) {
        event.preventDefault();
        event.stopPropagation();

        const addFieldEvent = createAddScreenFieldEvent(
            getColumnFieldType().name,
            this.field.fields.length,
            this.field
        );
        this.dispatchEvent(addFieldEvent);
    }

    handleDelete() {
        // TODO
    }

    handlePropertyChanged = event => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
