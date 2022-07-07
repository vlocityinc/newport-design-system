/**
 * Formats an arbitrary number of arguments into a string by replacing {0}, {1}, ... {n} with the corresponding argument supplied after 'formatString'.
 *
 * @param formatString The string to be formatted.
 * @param args The list of arguments to splice into formatString.
 * @returns a formatted String
 */
export const format = (formatString: string, ...args: any[]) => {
    return formatString.replace(/\{(\d+)\}/gm, (match, index) => {
        const substitution = args[index];
        if (substitution === undefined) {
            return match;
        }
        return substitution + '';
    });
};

/**
 * Condition to check for closing the modal
 *
 * @param {Function} closeModalCallback callback function
 * @param {boolean} closeCallback true if closeCallback set
 * @returns true if callback function exists to be called
 */
export function checkCloseCallback(closeModalCallback: Function, closeCallback: boolean) {
    return typeof closeModalCallback === 'function' && closeCallback === true;
}

/**
 * @param func
 */
export function memoize<T extends (...args: any[]) => any>(func: T) {
    let everInvoked = false;
    let lastArguments;
    let lastResult;
    return function (...args: any[]): any {
        // Invoke the memoized function, but only if never invoked or if the arguments are different.
        if (everInvoked === false || !equalArguments(lastArguments, args)) {
            lastResult = func.apply(null, args);
            lastArguments = args;
            everInvoked = true;
        }
        return lastResult;
    } as T;
}
/**
 * Compares two arrays for equality. For the two arrays to be equal they should either be
 * the same arrays or they should contain exact same elements and in the same order.
 *
 * @param left One array to compare.
 * @param right Another array to compare.
 * @returns 'true' if the arrays are equal. Otherwise - 'false'.
 */
function equalArguments(left: any[], right: any[]) {
    if (left === null || left === undefined || left.length !== right.length) {
        return false;
    }
    for (let i = 0; i < right.length; i++) {
        if (left[i] !== right[i]) {
            return false;
        }
    }
    return true;
}

/**
 * debounce function
 *
 * @param fct - The function to debounce to
 * @param wait - The time to wait
 * @returns - the debounced function
 */
export function debounce(fct, wait) {
    let timeoutId;

    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        // eslint-disable-next-line @lwc/lwc/no-async-operation
        timeoutId = setTimeout(() => {
            return fct(...args);
        }, wait);
    };
}

/**
 * remove objects from checkedArr that are duplicates of ones in targetArr
 *
 * @param checkedArr - Array of objects where duplicates will be checked against objects in targetArr
 * @param targetArr - Array of objects where duplicates will be checked against objects in checkedArr
 * @param properties - Properties of objects that need to be equal to be treated as duplicates
 * @returns - checkedArr with duplicates against targetArr removed
 */
export function removeDuplicates(checkedArr: any[], targetArr: any[], properties: string[]) {
    return checkedArr.filter(
        (value) => !targetArr.find((t) => properties.map((p) => t[p] === value[p]).every((check) => check === true))
    );
}
