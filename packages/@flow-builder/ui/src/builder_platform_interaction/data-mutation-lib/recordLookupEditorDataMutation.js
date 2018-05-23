import { SUB_ELEMENT_TYPE } from 'builder_platform_interaction-element-config';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';
import { RECORD_LOOKUP_FILTER_CRITERIA } from 'builder_platform_interaction-flow-metadata';

export const mutateFilterItems = (filterItems, objectType) => {
    filterItems.forEach((item, itemIndex) => {
        item.rowIndex = generateGuid(SUB_ELEMENT_TYPE.RECORD_LOOKUP_FILTER_ITEM);
        if (item.hasOwnProperty('field')) {
            item.leftHandSide = objectType + "." + item.field;
            delete item.field;
        }
        if (item.hasOwnProperty('value')) {
            filterItems[itemIndex] = mutateFEROV(item, 'value', {
                valueProperty: 'rightHandSide',
                dataTypeProperty: 'rightHandSideDataType',
            });
        }
    });
    return filterItems;
};

/**
 * Mutate record lookup for property editor
 * @param {Object} record The record lookup to mutate
 * @return {Object} The mutated record
 */
export const mutateRecordLookup = record => {
    // TODO: make this transform the record lookup in an immutable way.
    const filterItems = record.filters;
    if (filterItems) {
        record.filterType = (filterItems.length > 0 && filterItems[0].field) ? RECORD_LOOKUP_FILTER_CRITERIA.ALL : RECORD_LOOKUP_FILTER_CRITERIA.NONE;
        record.filters = mutateFilterItems(filterItems, record.object);
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
    delete record.filterType;
    const filterItems = record.filters;
    if (filterItems) {
        filterItems.forEach((item, itemIndex) => {
            delete item.rowIndex;

            if (item.hasOwnProperty('leftHandSide')) {
                item.field = item.leftHandSide.substring(item.leftHandSide.indexOf('.') + 1);
                delete item.leftHandSide;
            }
            if (item.hasOwnProperty('rightHandSide')) {
                filterItems[itemIndex] = deMutateFEROV(item, 'value', {
                    valueProperty: 'rightHandSide',
                    dataTypeProperty: 'rightHandSideDataType',
                });
            }
        });
    }
    return record;
};

