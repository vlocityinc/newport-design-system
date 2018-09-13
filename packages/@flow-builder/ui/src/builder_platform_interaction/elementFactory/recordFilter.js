import {
    createListRowItem,
    rhsPropertyName,
    rhsDataTypePropertyName
} from "./base/baseList";
import { createFEROV, createFEROVMetadataObject } from './ferov';

export function createFilter(filter = {}, objectType) {
    let newFilter;

    if (filter.hasOwnProperty('field')) {
        let leftHandSide = '';
        if (filter.field) {
            leftHandSide = objectType + '.' + filter.field;
        }
        const { operator = ''} = filter;
        const rhsFerovObject = createFEROV(
            filter.value,
            rhsPropertyName,
            rhsDataTypePropertyName
        );
        newFilter = Object.assign(
            {},
            { leftHandSide, operator },
            rhsFerovObject
        );
        newFilter = createListRowItem(newFilter);
    } else {
        newFilter = createListRowItem(filter);
    }

    return newFilter;
}

export function createFilterMetadataObject(filter) {
    if (!filter) {
        throw new Error('record filter is not defined');
    }

    const field = filter.leftHandSide.substring(
        filter.leftHandSide.indexOf('.') + 1
    );
    const operator = filter.operator;
    const rhsFerovObject = createFEROVMetadataObject(
        filter,
        rhsPropertyName,
        rhsDataTypePropertyName
    );
    const newFilter = Object.assign({}, { field, operator }, rhsFerovObject);

    return newFilter;
}
