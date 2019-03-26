// These gets initialized whenever a property editor is created and cleared on close.
let expressions = {};
let resourcePickers = {};

/**
 * Save the expression to be accessed later
 * @param {BaseExpressionBuilder} expression The expression to be saved
 */
export const saveExpression = (expression) => {
    expressions[expression.rowIndex] = expression;
};

/**
 * Save the resource picker to be accessed later
 * @param {BaseResourcePicker} resourcePicker the resourcePicker to be saved
 */
export const saveResourcePicker = (resourcePicker) => {
    const index = resourcePicker.rowIndex;
    if (index) {
        resourcePickers[index.value ? index.value : index] = resourcePicker;
    }
};

/**
 * Validate the picker
 * @param {String} rowIndex The index(guid) associated with the picker
 * @returns {String} the error message or null
 */
export const validatePicker = (rowIndex) => {
    if (rowIndex) {
        const index = rowIndex.value ? rowIndex.value : rowIndex;
        if (resourcePickers[index]) {
            const combobox = resourcePickers[index].template.querySelector('builder_platform_interaction-combobox');
            return combobox.validate();
        }
    }
    return null;
};

/**
 * Validate the LHS of the expression
 * @param {String} rowIndex The index(guid) associated with the expression
 * @returns {String} the error message or null
 */
export const validateLHS = (rowIndex) => {
    const lhsCombobox = expressions[rowIndex].template.querySelector('.lhs');
    return lhsCombobox.validate();
};

/**
 * Validate the RHS of the expression
 * @param {String} rowIndex The index(guid) associated with the expression
 * @returns {String} the error message or null
 */
export const validateRHS = (rowIndex) => {
    const rhsCombobox = expressions[rowIndex].template.querySelector('.rhs');
    return rhsCombobox.validate();
};

/**
 * Clears the saved expressions
 */
export const clearExpressions = () => {
    expressions = {};
    resourcePickers = {};
};