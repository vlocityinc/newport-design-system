/**
 * @enum {string} MERGE_VARIABLES_WARNING_TYPE
 */
export const MERGE_VARIABLES_WARNING_TYPE = {
    DATA_TYPE_CHANGED: 'dataTypeChanged',
    ONLY_AVAILABLE_IN_LATEST: 'onlyAvailableInLatest',
    ONLY_AVAILABLE_IN_ACTIVE: 'onlyAvailableInActive'
};

export function getMergeWarning(activeVariable, latestVariable) {
    if (activeVariable && !latestVariable) {
        return MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE;
    }
    if (latestVariable && !activeVariable) {
        return MERGE_VARIABLES_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST;
    }
    if (latestVariable && activeVariable) {
        if (
            latestVariable.dataType !== activeVariable.dataType ||
            latestVariable.objectType !== activeVariable.objectType ||
            latestVariable.isCollection !== activeVariable.isCollection
        ) {
            return MERGE_VARIABLES_WARNING_TYPE.DATA_TYPE_CHANGED;
        }
    }
    return undefined;
}
