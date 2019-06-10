/**
 * @typedef {Object} validationRule
 * @property {string} errorMessage error message is a string/metadata field that can contain references to devNames/guids
 * @property {string} formulaExpression formula expression is a string/metadata field that can contain references to devNames/guids
 */
/**
 * Factory function to create validation rule object
 * @param {validationRule} validationRule
 * @returns {validationRule} validationRule object
 */
export function createValidationRuleObject(validationRule = {}) {
    const { errorMessage = '', formulaExpression = '' } = validationRule;
    return {
        errorMessage,
        formulaExpression
    };
}
