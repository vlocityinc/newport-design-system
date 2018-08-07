import { generateGuid } from 'builder_platform_interaction-store-lib';
import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';
import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { RECORD_FILTER_CRITERIA, SORT_ORDER } from 'builder_platform_interaction-record-editor-lib';

const mutateFilterItems = (filterItems, objectType) => {
    return filterItems.map(item => {
        item.rowIndex = generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM);
        if (item.hasOwnProperty('field')) {
            if (item.field) {
                item.leftHandSide = objectType + '.' + item.field;
            } else {
                item.leftHandSide = '';
            }
            delete item.field;
        }

        item = mutateFEROV(item, 'value', {
            valueProperty: 'rightHandSide',
            dataTypeProperty: 'rightHandSideDataType',
        });
        return item;
    });
};

/**
 * Mutate record lookup for property editor
 * @param {Object} record The record lookup to mutate
 * @return {Object} The mutated record
 */
export const mutateRecordLookup = record => {
    const filterItems = record.filters;
    record.filterType = (filterItems.length > 0 && filterItems[0].field) ? RECORD_FILTER_CRITERIA.ALL : RECORD_FILTER_CRITERIA.NONE;
    // create at least one empty filter
    if (filterItems.length === 0) {
        record.filters.push({
            field: '',
            operator: ''
        });
    }
    record.filters = mutateFilterItems(filterItems, record.object);

    // push 'Id' as a mandatory field
    if (!record.queriedFields.includes('Id')) {
        record.queriedFields.push('Id');
    }
    // create at least one empty in queriedFields + 'Id'
    if (record.queriedFields.length === 1) {
        record.queriedFields.push('');
    }
    record.queriedFields = record.queriedFields.map(queriedField => {
        return {
            field: queriedField,
            rowIndex: generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FIELD)
        };
    });
    if (!record.sortOrder) {
        record.sortOrder = SORT_ORDER.NOT_SORTED;
        record.sortField = '';
    }
    return record;
};

/**
 * Remove property editor mutation for record lookup
 *
 * @param {Object} record Record lookup element to de-mutate
 * @return {Object} The demutated record
 */
export const deMutateRecordLookup = record => {
    if (record.filterType === RECORD_FILTER_CRITERIA.NONE) {
        record.filters = [];
    } else {
        record.filters = record.filters.map(item => {
            delete item.rowIndex;
            item.field = item.leftHandSide.substring(item.leftHandSide.indexOf('.') + 1);
            delete item.leftHandSide;
            item = deMutateFEROV(item, 'value', {
                valueProperty: 'rightHandSide',
                dataTypeProperty: 'rightHandSideDataType',
            });
            return item;
        });
    }
    delete record.filterType;
    record.queriedFields = record.queriedFields.filter((queriedField) => queriedField.field !== '');
    record.queriedFields = record.queriedFields.map(queriedField => {
        return queriedField.field;
    });

    if (record.sortOrder === SORT_ORDER.NOT_SORTED) {
        delete record.sortOrder;
        delete record.sortField;
    }
    return record;
};