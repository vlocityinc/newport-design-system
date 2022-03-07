/*
The system variable constants have been moved into this library from systemLib to resolve a circular dependency
between systemLib and storeUtils.
*/
export const SYSTEM_VARIABLE_PREFIX = '$Flow';
export const SYSTEM_VARIABLE_CLIENT_PREFIX = '$Client';
export const SYSTEM_VARIABLE_RECORD_CATEGORY = 'Record';
export const SYSTEM_VARIABLE_RECORD_PREFIX = '$' + SYSTEM_VARIABLE_RECORD_CATEGORY;
export const SYSTEM_VARIABLE_RECORD_PRIOR_PREFIX = '$' + SYSTEM_VARIABLE_RECORD_CATEGORY + '__Prior';
export const SYSTEM_VARIABLE_ICON_NAME = 'system_and_global_variable';
export const SYSTEM_VARIABLES = {
    CURRENT_DATE_TIME: SYSTEM_VARIABLE_PREFIX + '.CurrentDateTime'
};
