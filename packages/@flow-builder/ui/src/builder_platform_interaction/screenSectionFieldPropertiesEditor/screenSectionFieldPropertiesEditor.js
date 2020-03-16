import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import {
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';

const MAX_COLUMNS = 4;
const MAX_TOTAL_WIDTH = 12;

/*
 * Screen element property editor for section fields.
 */
export default class ScreenSectionFieldPropertiesEditor extends LightningElement {
    @api field = {};
    labels = LABELS;

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

    /**
     * Post add/delete column, all columns are reset to equal widths so that
     * the total widths is 12.
     */
    resetColumnWidths() {
        const fields = [];
        const newWidth = MAX_TOTAL_WIDTH / this.field.fields.length;

        // Update the column with a new width input parameter
        this.field.fields.forEach(column => {
            const originalInputParameters = column.inputParameters;
            const inputParameter = Object.assign({}, originalInputParameters[0], { name: 'width', value: newWidth });
            const field = Object.assign({}, column, { inputParameters: [inputParameter] });
            fields.push(field);
        });

        const columnWidthChangeEvent = new PropertyChangedEvent(
            'fields',
            fields,
            null,
            this.field.guid,
            this.field.fields
        );
        this.dispatchEvent(columnWidthChangeEvent);
    }

    handleAdd(event) {
        event.preventDefault();
        event.stopPropagation();

        const addFieldEvent = createAddScreenFieldEvent(
            getColumnFieldType().name,
            this.field.fields.length,
            this.field,
            () => {
                Promise.resolve()
                    .then(() => {
                        this.resetColumnWidths();
                    })
                    .catch();
            }
        );

        this.dispatchEvent(addFieldEvent);
    }

    handleDeleteColumn(e) {
        const column = this.field.fields[e.detail.index];
        this.dispatchEvent(
            createScreenElementDeletedEvent(column, null, this.field, () => {
                this.dispatchEvent(createScreenElementSelectedEvent(this.field));

                // Once the section is reselected, reset column widths
                Promise.resolve().then(() => {
                    this.resetColumnWidths();
                });
            })
        );
    }

    handlePropertyChanged = event => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
