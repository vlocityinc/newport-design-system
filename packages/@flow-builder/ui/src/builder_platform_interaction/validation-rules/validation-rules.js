/**
 * @param {value} - value to be evaluated.
 * @param {rule} - object
 * @returns {string|null} errorString or null
 * TODO: generalize to n char when we write the actual rules
 */

export const evaluateRegex = (value, rule) => {
    const regex = new RegExp(rule.regexPattern);
    if (regex.test(value)) {
        return rule.message;
    }
    return null;
};