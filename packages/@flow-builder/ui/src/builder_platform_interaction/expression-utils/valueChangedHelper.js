/**
 * Value changed util for Expression Builder
 *
 * @ScrumTeam Process UI Runtime
 * @author Alejandro Lopez
 * @since 214
 */
import { updateProperties } from 'builder_platform_interaction-data-mutation-lib';
import { EXPRESSION_PROPERTY_TYPE } from 'builder_platform_interaction-constant';
const { LEFT_HAND_SIDE: lhs, OPERATOR: operator, RIGHT_HAND_SIDE: rhs } = EXPRESSION_PROPERTY_TYPE;

/**
 * Handles logic for when the lhs value changes. Currently this is being constructed
 * as a general libary that assignment & decision editors can use. However, if the overhead
 * for keeping this generic is found to be too large we can make this a util libary specificly for
 * assignment editors.
 * @param  {Object} item the item that changed
 * @return {Object} the new modified item, undefined if unsucessful
 */
const lhsValueChanged = (item) => {
    // call updateProperties with no second param to create a copy of our item
    const newItem = updateProperties(item);
    // sanity checks
    if (newItem && newItem[lhs] && newItem[lhs].value) {
        // we also want to preemptively fetch the menu data for the operator combobox
        // TODO call library function for fetching the menu data
    }
    return newItem;
};

/**
 * Handles logic for when the operator value changes
 * @param  {[type]} item the item that changed
 * @return {Object}      the updated item object
 */
const operatorValueChanged = (item) => {
    // call updateProperties with no second param to create a copy of our item
    const newItem = updateProperties(item);
    // sanity checks
    if (newItem && newItem[operator] && newItem[operator].value) {
        // we also want to preemptively fetch the menu data for the rhs combobox
        // TODO call library function for fetching the menu data
    }
    return newItem;
};

/**
 * Handles logic for when the rhs value changes
 * @param  {[type]} item the item that changed
 * @return {Object}      the updated item object
 */
const rhsValueChanged = (item) => {
    // call updateProperties with no second param to create a copy of our item
    const newItem = updateProperties(item);
    if (newItem && newItem[rhs] && newItem[rhs].value) {
        // TODO call library function for fetching the menu data
    }
    return newItem;
};

/**
 * Object that contains helper methods that will be called when
 * the given property changes
 * @type {Object}
 */
export const valueChangedHelper = {
    [lhs]: lhsValueChanged,
    [operator]: operatorValueChanged,
    [rhs]: rhsValueChanged,
};
