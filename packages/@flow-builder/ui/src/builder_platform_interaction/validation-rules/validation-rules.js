// TODO: organize these functions in different files, inputValidation, vovValidation, etc
// TODO: i18n, also these are example functions, real methods are coming soon, also ternary instead of multiple returns in real methods
/**
 * @param {string} testValue - value to be tested
 * @returns {string|null} errorString or null
 */
export const shouldNotBeEmpty = (testValue) => {
    if (testValue === '' || testValue === null) {
        return 'Field can not be empty';
    }
    return null;
};

/**
 * @param {string} testValue - value to be tested
 * @returns {string|null} errorString or null
 * TODO: generalize to n char when we write the actual rules
 */
export const shouldNotBeMoreThan256Chars = (testValue) => {
    if (testValue.length > 256) {
        return 'length can not exceed 256 chars';
    }
    return null;
};

/**
 * @param {string} testValue - value to be tested
 * @returns {string|null} errorString or null
 */
export const cannotStartWithUnderScore = (testValue) => {
    if (testValue.startsWith('_')) {
        return 'Cannot start with an underscore';
    }
    return null;
};