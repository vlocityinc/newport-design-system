import { LABELS } from './subflowEditorLabels';
import { MERGE_WARNING_TYPE } from 'builder_platform_interaction/calloutEditorLib';

/**
 * Get the warnings for the ParameterList component
 *
 * @param {ParameterItemWithWarnings[]} inputs the input parameters
 * @param {ParameterItemWithWarnings[]} outputs the output parameters
 * @return {ParameterListWarnings} the warnings
 */
export function getParameterListWarnings(inputAssignments, outputAssignments) {
    const map = {};
    inputAssignments.forEach(assignment => {
        const warning = getParameterItemWarning(assignment.warnings);
        if (warning) {
            map[assignment.rowIndex] = warning;
        }
    });
    outputAssignments.forEach(assignment => {
        const warning = getParameterItemWarning(assignment.warnings);
        if (warning) {
            map[assignment.rowIndex] = warning;
        }
    });
    return map;
}

/**
 * Get the ParameterItem warning configuration corresponding to the given warning codes
 * @param {MERGE_WARNING_TYPE[]} the warning codes
 * @return {ParameterItemWarning} the ParameterItem warning configuration
 */
export function getParameterItemWarning(warnings) {
    if (warnings == null || warnings.length === 0) {
        return undefined;
    }
    let warningMessage;
    let shouldBeDeleted = false;
    let warningBadge;
    let hideIcon = false;
    warnings.forEach(warning => {
        switch (warning) {
        case MERGE_WARNING_TYPE.NOT_AVAILABLE_IN_SUBFLOW:
            warningMessage = LABELS.warningNotAvailable;
            shouldBeDeleted = true;
            hideIcon = true;
            warningBadge = LABELS.badgeWillCauseErrors;
            break;
        case MERGE_WARNING_TYPE.DATA_TYPE_CHANGED:
            warningMessage = LABELS.warningDataTypeChanged;
            break;
        case MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_LATEST:
            warningMessage = LABELS.warningLatestOnly;
            warningBadge = LABELS.badgeDebugOnly;
            break;
        case MERGE_WARNING_TYPE.ONLY_AVAILABLE_IN_ACTIVE:
            warningMessage = LABELS.warningActiveOnly;
            break;
        case MERGE_WARNING_TYPE.DUPLICATE:
            shouldBeDeleted = true;
            break;
        default:
        }
    });
    return { warningBadge, warningMessage, shouldBeDeleted, hideIcon };
}
