// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import { format } from 'builder_platform_interaction/commonUtils';
import { getColumnFieldType } from 'builder_platform_interaction/screenEditorUtils';
import {
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    createColumnWidthChangedEvent
} from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';

const MAX_COLUMNS = 4;

/*
 * Screen element property editor for section fields.
 */
export default class ScreenSectionFieldPropertiesEditor extends LightningElement {
    @api field = {};
    labels = LABELS;

    @api
    editorParams;

    columnWidths = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
        { value: '5', label: '5' },
        { value: '6', label: '6' },
        { value: '7', label: '7' },
        { value: '8', label: '8' },
        { value: '9', label: '9' },
        { value: '10', label: '10' },
        { value: '11', label: '11' },
        { value: '12', label: this.labels.fullWidth }
    ];

    get columns() {
        return this.field.fields.map((column, index) => {
            const numOfColumns = this.field.fields.length;

            const columnWidth = getValueFromHydratedItem(column.inputParameters[0].value);
            let maxWidth = '12';
            if (numOfColumns > 1) {
                let neighboringColumn;
                if (index === numOfColumns - 1) {
                    neighboringColumn = this.field.fields[index - 1];
                } else if (index < numOfColumns - 1) {
                    neighboringColumn = this.field.fields[index + 1];
                }
                const neighboringColumnWidth = Number(
                    getValueFromHydratedItem(neighboringColumn.inputParameters[0].value)
                );
                maxWidth = Number(columnWidth) + neighboringColumnWidth - 1;
            }
            return {
                ...column,
                width: columnWidth,
                widthLabel: format(this.labels.columnsWidthTitle, index + 1),
                widthOptions: this.calculateColumnWidthOptions(maxWidth),
                handleWidthChange: event => {
                    this.dispatchEvent(
                        createColumnWidthChangedEvent(event.target.name, Number(event.detail.value), this.field.guid)
                    );
                }
            };
        });
    }

    calculateColumnWidthOptions(maxWidth) {
        return this.columnWidths.filter(columnWidth => {
            if (maxWidth === '12') {
                return Number(columnWidth.value) === Number(maxWidth);
            }
            return Number(columnWidth.value) <= Number(maxWidth);
        });
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
            this.field.guid
        );

        this.dispatchEvent(addFieldEvent);
    }

    handleDeleteColumn(e) {
        const column = this.field.fields[e.detail.index];
        this.dispatchEvent(
            createScreenElementDeletedEvent(column, null, this.field.guid, () => {
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
