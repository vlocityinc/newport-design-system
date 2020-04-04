import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import {
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent
} from 'builder_platform_interaction/events';

const MAX_COLUMNS = 4;

/*
 * Screen element property editor for section fields.
 */
export default class ScreenSectionFieldPropertiesEditor extends LightningElement {
    @api field = {};
    labels = LABELS;

    @api
    editorParams;

    get columns() {
        return this.field.fields.map((column, index) => {
            return {
                ...column,
                width: column.inputParameters[0].value,
                widthLabel: format(this.labels.columnsWidthTitle, index + 1),
                handleWidthChange: () => {
                    // TODO: W-7207695
                }
            };
        });
    }

    get columnWidthOptions() {
        return [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
            { value: 10, label: '10' },
            { value: 11, label: '11' },
            { value: 12, label: this.labels.fullWidth }
        ];
    }

    get isColumnDeleteEnabled() {
        return this.field.fields.length > 1;
    }

    get isAddDisabled() {
        return this.field.fields.length >= MAX_COLUMNS;
    }

    get columnsLabel() {
        return this.field.fields ? format(this.labels.columnsSectionTitle, this.field.fields.length) : '';
    }

    get maxColumns() {
        return MAX_COLUMNS;
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

    handleDeleteColumn(e) {
        const column = this.field.fields[e.detail.index];
        this.dispatchEvent(
            createScreenElementDeletedEvent(column, null, this.field, () => {
                this.dispatchEvent(createScreenElementSelectedEvent(this.field));
            })
        );
    }

    handlePropertyChanged = event => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
