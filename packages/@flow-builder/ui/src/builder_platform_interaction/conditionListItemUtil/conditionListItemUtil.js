import {
    getResourceByUniqueIdentifier,
    mutateFlowResourceToComboboxShape
} from 'builder_platform_interaction/expressionUtils';
import { normalizeDateTime } from 'builder_platform_interaction/dateTimeUtils';
import { transformOperatorsForCombobox } from 'builder_platform_interaction/ruleLib';

/**
 * Returns the formatted LHS value as displayText and the dataType used for the RHS
 * @param {string} lhsValue Given to us from the condition popover
 * @return {Object{}} Object that contains displayText and the dataType
 */
export function formatLhs(lhsValue) {
    const comboxShape = getResourceById(lhsValue);
    const dataType = comboxShape.dataType;
    const displayText = resourceToDisplayText(lhsValue, comboxShape);
    return { displayText, dataType };
}

/**
 * Converts the operator value into comobobox values for better readability
 * @param {string} op Operator given from the conditional popover
 * @return {string} Formatted and user friendly operator
 */
export function formatOperator(op) {
    const formattedOp = transformOperatorsForCombobox([op]);
    if (formattedOp) {
        return formattedOp[0].label;
    }
    return null;
}

/**
 * Returns the formatted RHS value as displayText. Needs to be able
 * to handle user input, date, datetime, flow constants, object references, ect.
 * @param {string} rhsValue Given to us from the condition popover
 * @return {string} Formatted rhs value
 */
export function formatRhs(rhsValue, dataType) {
    let displayText;
    if (dataType === 'Date' && Date.parse(rhsValue)) {
        displayText = normalizeDateTime(rhsValue, false);
    } else if (dataType === 'DateTime' && Date.parse(rhsValue)) {
        displayText = normalizeDateTime(rhsValue, true);
    } else if (rhsValue === '') {
        displayText = 'Null';
    } else {
        const comboxShape = getResourceById(rhsValue);
        displayText = rhsValue;
        if (comboxShape) {
            displayText = resourceToDisplayText(rhsValue, comboxShape);
        }
    }
    return displayText;
}

/**
 * This first determines if we have a guid or flow constant using regex.
 * If we have a guid, we must use the comboxShape.text value. If there
 * is no match then just use the displayText.
 * @param {string} unformattedValue Unmodified lhs or rhs value
 * @param {Object{}} comboxShape Transformed lookup on the unformattedValue using getResourceById
 * @return {string} Returns the correct text for the given resource
 */
function resourceToDisplayText(unformattedValue, comboxShape) {
    // Regex to split guid from sobject variables or apex types references
    const _guidRegex = /^([\w]{8}-[\w]{4}-4[\w]{3}-[\w]{4}-[\w]{12})(\.+.*)/g;
    const rxMatch = _guidRegex.exec(unformattedValue);
    let returnText = comboxShape.displayText;
    if (rxMatch) {
        if (rxMatch.length > 2) {
            returnText = '{!' + comboxShape.text + rxMatch[2] + '}';
        }
    }
    return returnText.replace('$', '');
}

/**
 * This converts a lhs or rhs string value into the correct comobobox shape.
 * Looks up the unique guid and returns the variable/object associated with it.
 * @param {sting} id Value passed down to conditionalListItem for either lhs or rhs
 * @return {Object{}} Object in combobox shape for the given guid/constant
 */
function getResourceById(id) {
    if (id) {
        const fer = getResourceByUniqueIdentifier(id);
        if (fer) {
            return mutateFlowResourceToComboboxShape(fer);
        }
    }
    return null;
}
