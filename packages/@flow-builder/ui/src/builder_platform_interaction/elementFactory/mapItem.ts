import { createListRowItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY } from './base/baseList';
import { createFEROV, createFEROVMetadataObject } from './ferov';

/**
 * @param mapItem map item
 * @param outputSObjectType the output sObject type
 * @returns new map item
 */
export function createMapItem(mapItem, outputSObjectType) {
    if (mapItem && outputSObjectType) {
        let newMapItem;
        if (mapItem.hasOwnProperty('assignToFieldReference')) {
            const leftHandSide = outputSObjectType + '.' + mapItem.assignToFieldReference;
            const operator = mapItem.operator;
            const rhsFerovObject = createFEROV(mapItem.value, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
            newMapItem = Object.assign({}, { leftHandSide, operator }, rhsFerovObject);
            newMapItem = createListRowItem(newMapItem);
        } else {
            newMapItem = createListRowItem(mapItem);
        }
        return newMapItem;
    }
    throw new Error('mapItem or outputSObjectType is not defined');
}

/**
 * @param mapItem map item
 * @returns map item metadata
 */
export function createMapItemMetadataObject(mapItem) {
    if (!mapItem) {
        throw new Error('mapItem is not defined');
    }

    const assignToFieldReference = mapItem.leftHandSide.split('.')[1];
    const operator = mapItem.operator;
    const value = createFEROVMetadataObject(mapItem, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);

    const newMapItem = Object.assign({}, { assignToFieldReference, operator, value });

    return newMapItem;
}
