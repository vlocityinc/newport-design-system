// @ts-nocheck
import { LightningElement, api } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';

import { addCurrentValueToEvent } from 'builder_platform_interaction/screenEditorCommonUtils';
import {
    getColumnFieldType,
    hasScreenFieldVisibilityCondition,
    SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME
} from 'builder_platform_interaction/screenEditorUtils';
import {
    createAddScreenFieldEvent,
    createScreenElementDeletedEvent,
    createScreenElementSelectedEvent,
    createColumnWidthChangedEvent
} from 'builder_platform_interaction/events';
import { getValueFromHydratedItem } from 'builder_platform_interaction/dataMutationLib';
import { commonUtils } from 'builder_platform_interaction/sharedUtils';
const { format } = commonUtils;

const MAX_COLUMNS = 4;

const SECTION_COLUMNS_NAME = 'columns';

/*
 * Screen element property editor for section fields.
 */
export default class ScreenSectionFieldPropertiesEditor extends LightningElement {
    private _field;
    labels = LABELS;

    @api
    editorParams;

    expandedSectionNames = [SECTION_COLUMNS_NAME];

    set field(value) {
        this._field = value;
        if (hasScreenFieldVisibilityCondition(this._field) && this.expandedSectionNames.length === 1) {
            this.expandedSectionNames = [SECTION_COLUMNS_NAME, SCREEN_FIELD_VISIBILITY_ACCORDION_SECTION_NAME];
        }
    }

    @api
    get field() {
        return this._field;
    }

    columnWidths = [
        { value: '1', label: this.labels.oneOfTwelveWidth },
        { value: '2', label: this.labels.twoOfTwelveWidth },
        { value: '3', label: this.labels.threeOfTwelveWidth },
        { value: '4', label: this.labels.fourOfTwelveWidth },
        { value: '5', label: this.labels.fiveOfTwelveWidth },
        { value: '6', label: this.labels.halfWidth },
        { value: '7', label: this.labels.sevenOfTwelveWidth },
        { value: '8', label: this.labels.eightOfTwelveWidth },
        { value: '9', label: this.labels.nineOfTwelveWidth },
        { value: '10', label: this.labels.tenOfTwelveWidth },
        { value: '11', label: this.labels.elevenOfTwelveWidth },
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
                handleWidthChange: (event) => {
                    this.dispatchEvent(
                        createColumnWidthChangedEvent(event.target.name, Number(event.detail.value), this.field.guid)
                    );
                }
            };
        });
    }

    calculateColumnWidthOptions(maxWidth) {
        return this.columnWidths.filter((columnWidth) => {
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

    handlePropertyChanged = (event) => {
        event.stopPropagation();
        const currentValue = this.field[event.detail.propertyName];
        this.dispatchEvent(addCurrentValueToEvent(event, this.field, currentValue));
    };
}
