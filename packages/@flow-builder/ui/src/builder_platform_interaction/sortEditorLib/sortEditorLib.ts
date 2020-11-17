import { Guid } from 'builder_platform_interaction/flowModel';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const SORT_OUTPUT_OPTION = {
    ALL: 'All',
    CUSTOM: 'Custom'
};

export const SORT_ORDER = {
    ASC: 'Asc',
    DESC: 'Desc'
};

export interface SortOption {
    sortField: { value: string | null; error: string | null };
    sortOrder: { value: string | null; error: string | null };
    doesPutEmptyStringAndNullFirst: boolean;
    rowIndex?: Guid;
}

export interface SortElement {
    collectionReference: { value: string | null; error: string | null };
    limit: { value: string | null; error: string | null };
    sortOptions: SortOption[];
}

export interface SortOutput {
    selectedOutput: { value: string | null; error: string | null };
    limit: { value: string | null; error: string | null };
}

export const SORT_COMPATIBLE_TYPES = [
    FLOW_DATA_TYPE.BOOLEAN.value,
    FLOW_DATA_TYPE.CURRENCY.value,
    FLOW_DATA_TYPE.DATE.value,
    FLOW_DATA_TYPE.DATE_TIME.value,
    FLOW_DATA_TYPE.MULTI_PICKLIST.value,
    FLOW_DATA_TYPE.SOBJECT.value,
    FLOW_DATA_TYPE.NUMBER.value,
    FLOW_DATA_TYPE.PICKLIST.value,
    FLOW_DATA_TYPE.STRING.value,
    FLOW_DATA_TYPE.MULTI_PICKLIST.value
];
