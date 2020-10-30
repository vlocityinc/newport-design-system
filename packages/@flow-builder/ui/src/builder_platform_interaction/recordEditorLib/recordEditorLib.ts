/**
 * The number of records to store.
 * @type {{FIRST_RECORD: string, ALL_RECORDS: string}}
 */
export enum NUMBER_RECORDS_TO_STORE {
    FIRST_RECORD = 'firstRecord',
    ALL_RECORDS = 'allRecords'
}

/**
 * The way the user want to store fields.
 */
export enum WAY_TO_STORE_FIELDS {
    SOBJECT_VARIABLE = 'sObjectVariable',
    SEPARATE_VARIABLES = 'separateVariables'
}

/**
 * The sort order.
 * @type {{ASC: string, DESC: string, NOT_SORTED_VALUE: string}}
 */
export enum SORT_ORDER {
    ASC = 'Asc',
    DESC = 'Desc',
    NOT_SORTED = 'NotSorted'
}

export enum VARIABLE_AND_FIELD_MAPPING_VALUES {
    AUTOMATIC = 'automatic',
    AUTOMATIC_WITH_FIELDS = 'manuallySelectFields',
    MANUAL = 'manual'
}
