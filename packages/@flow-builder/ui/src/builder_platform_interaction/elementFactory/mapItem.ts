import { createListRowItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY } from './base/baseList';
import { createFEROV, createFEROVMetadataObject } from './ferov';

/**
 * @param mapItem map item
 * @param outputTable the output table
 * @returns new map item
 */
export function createMapItem(mapItem, outputTable) {
    if (mapItem && outputTable) {
        let newMapItem;
        if (mapItem.hasOwnProperty('targetField')) {
            const leftHandSide = outputTable + '.' + mapItem.targetField;
            const operator = mapItem.operator;
            const rhsFerovObject = createFEROV(mapItem.value, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
            newMapItem = Object.assign({}, { leftHandSide, operator }, rhsFerovObject);
            newMapItem = createListRowItem(newMapItem);
        } else {
            newMapItem = createListRowItem(mapItem);
        }
        return newMapItem;
    }
    throw new Error('mapItem or outputTable is not defined');
}

/**
 * @param mapItem map item
 * @returns map item metadata
 */
export function createMapItemMetadataObject(mapItem) {
    if (!mapItem) {
        throw new Error('mapItem is not defined');
    }

    const targetField = mapItem.leftHandSide.split('.')[1];
    const operator = mapItem.operator;
    const value = createFEROVMetadataObject(mapItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);

    const newMapItem = Object.assign({}, { targetField, operator, value });

    return newMapItem;
}
