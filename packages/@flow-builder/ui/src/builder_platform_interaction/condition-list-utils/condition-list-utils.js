import { CONDITION_LOGIC} from 'builder_platform_interaction-flow-metadata';

const getPrefix = (conditionLogic, index) => {
    // conditionLogic.value is either 'and' or 'or' or a custom logic string (e.g. '1 AND (2 or 3)'
    if (conditionLogic.value === CONDITION_LOGIC.AND || conditionLogic.value === CONDITION_LOGIC.OR) {
        return index > 0 ? conditionLogic.value : '';
    }
    // Convert to 1 based indexes
    return (index + 1).toString();
};

/**
 * Returns the conditions decorated with prefexes for rendering in a condition list
 * @param {string}conditionLogic Either a logic constant or a custom logic string
 * @param {Object[]}conditions The condition objects to be rendered.  Note that these objects can be of any shape
 * @return {Object[]} Array of decorated objects
 */
export function getConditionsWithPrefixes(conditionLogic, conditions) {
    return conditions.map((condition, i) => {
        return {
            prefix: getPrefix(conditionLogic, i).toUpperCase(),
            condition
        };
    });
}

/**
 * Whether delete should be shown for each condition
 * @param {Object[]} conditions array of condition objects
 * @return {boolean} true if conditions should be rendered with delete buttons
 */
export function showDeleteCondition(conditions) {
    return conditions.length > 1;
}

