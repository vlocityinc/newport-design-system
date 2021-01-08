import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

export const SORT_OUTPUT_OPTION = {
    ALL: 'All',
    CUSTOM: 'Custom'
};

export const SORT_ORDER = {
    ASC: 'Asc',
    DESC: 'Desc'
};

export const LIMIT_RANGE = {
    min: 0,
    max: 2147483647 // the Integer.MAX_VALUE
};

export interface SortOption {
    sortField: { value: string | null; error: string | null };
    sortOrder: { value: string | null; error: string | null };
    doesPutEmptyStringAndNullFirst: boolean;
    rowIndex?: UI.Guid;
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

export interface SObjectOrApexReference {
    value: string | null;
    isSObject?: boolean;
    isApexClass?: boolean;
}

export const APEX_SORT_COMPATIBLE_TYPES = [
    FLOW_DATA_TYPE.BOOLEAN.value,
    FLOW_DATA_TYPE.CURRENCY.value,
    FLOW_DATA_TYPE.DATE.value,
    FLOW_DATA_TYPE.DATE_TIME.value,
    FLOW_DATA_TYPE.MULTI_PICKLIST.value,
    FLOW_DATA_TYPE.NUMBER.value,
    FLOW_DATA_TYPE.PICKLIST.value,
    FLOW_DATA_TYPE.STRING.value
];

export const SORT_COMPATIBLE_TYPES = [
    ...APEX_SORT_COMPATIBLE_TYPES,
    FLOW_DATA_TYPE.SOBJECT.value,
    FLOW_DATA_TYPE.APEX.value
];

export const isSObjectOrApexClass = (sObjectOrApexReference?: SObjectOrApexReference): boolean => {
    return !!sObjectOrApexReference && (!!sObjectOrApexReference.isSObject || !!sObjectOrApexReference.isApexClass);
};
