import { MERGE_WARNING_TYPE } from './mergeWarningType';

/**
* @typedef {Object} LABELS
* @property {String} [warningNotAvailable] the warning message when variable isn't available in subflow or parameter isn't available in action or apex plugin.
* @property {String} [warningLatestOnly] the warning message when variable is in only latest version.
* @property {String} [warningActiveOnly] the warning message when variable is in only active version.
* @property {String} [warningDataTypeChanged] the warning message when variable's data type is changed.
* @property {String} [badgeWillCauseErrors] the badge 'Will Cause Errors'
* @property {String} [badgeDebugOnly] the badge 'Debug Only'

*
*/

/**
 * Get the warnings for the ParameterList component
 *
 * @param {ParameterItemWithWarnings[]} inputs the input parameters
 * @param {ParameterItemWithWarnings[]} outputs the output parameters
 * @param {LABELS} labels the labels
 * @return {ParameterListWarnings} the warnings
 */
export function getParameterListWarnings(
    inputAssignments,
    outputAssignments,
    labels
) {
    const map = {};
    inputAssignments.forEach(assignment => {
        const warning = getParameterItemWarning(assignment.warnings, labels);
        if (warning) {
            map[assignment.rowIndex] = warning;
        }
    });
    outputAssignments.forEach(assignment => {
        const warning = getParameterItemWarning(assignment.warnings, labels);
        if (warning) {
            map[assignment.rowIndex] = warning;
        }
    });
    return map;
}

/**
 * Get the ParameterItem warning configuration corresponding to the given warning codes
 * @param {MERGE_WARNING_TYPE[]} the warning codes
 * @param {Object} the labels
 * @return {ParameterItemWarning} the ParameterItem warning configuration
 */
export function getParameterItemWarning(warnings, labels) {
    if (warnings == null || warnings.length === 0) {
        return undefined;
    }
    let warningMessage;
    let shouldBeDeleted = false;
    let warningBadge;
    let hideIcon = false;
    let grayPill = false;
    warnings.forEach(warning => {
        switch (warning) {
            case MERGE_WARNING_TYPE.NOT_AVAILABLE:
                warningMessage = labels.warningNotAvailable;
                shouldBeDeleted = true;
                hideIcon = true;
                warningBadge = labels.badgeWillCauseErrors;
                break;
            case MERGE_WARNING_TYPE.DATA_TYPE_CHANGED:
                warningMessage = labels.warningDataTypeChanged;
                break;
            case MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST:
                warningMessage = labels.warningLatestOnly;
                warningBadge = labels.badgeDebugOnly;
                grayPill = true;
                break;
            case MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE:
                warningMessage = labels.warningActiveOnly;
                break;
            case MERGE_WARNING_TYPE.DUPLICATE:
                shouldBeDeleted = true;
                break;
            default:
        }
    });
    return {
        warningBadge,
        warningMessage,
        shouldBeDeleted,
        hideIcon,
        grayPill
    };
}
