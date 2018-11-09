const DEFAULT_MAX_TICKS = 10;

/**
 * Returns a promise that is fulfilled when condition is truthy and rejected if we exceed given max number of event loop ticks
 *
 * @param {Function} condition should return truthy value when condition is met
 * @param {number} maxTicks max number of event loop ticks before the condition becomes truthy
 * @returns {Promise} if fulfilled, value is the condition returned value
 */
export const until = (condition, maxTicks = DEFAULT_MAX_TICKS) => {
    return Promise.resolve().then(() => {
        try {
            const result = condition();
            if (result) {
                return Promise.resolve(result);
            }
            if (maxTicks === 0) {
                return Promise.reject(Error('Condition not met'));
            }
        } catch (error) {
            if (maxTicks === 0) {
                return Promise.reject(error);
            }
        }
        return until(condition, maxTicks - 1);
    });
};

/**
 * Returns a promise that is fulfilled when expectations are met
 * @param {Function} expectations should throw an exception if an expectation is not met
 * @param {number} maxTicks max number of event loop ticks before the condition becomes truthy
 */
export const untilNoFailure = (expectations, maxTicks = DEFAULT_MAX_TICKS) => {
    return until(() => {
        expectations();
        return true;
    }, maxTicks);
};