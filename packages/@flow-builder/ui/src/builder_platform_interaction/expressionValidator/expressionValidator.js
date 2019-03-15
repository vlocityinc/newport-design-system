// This gets initialized whenever a property editor is created and cleared on close.
let expressions = {};

/**
 * Save the expression to be accessed later
 * @param {BaseExpressionBuilder} expression The expression to be saved
 */
export const saveExpression = (expression) => {
    expressions[expression.rowIndex] = expression;
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
};