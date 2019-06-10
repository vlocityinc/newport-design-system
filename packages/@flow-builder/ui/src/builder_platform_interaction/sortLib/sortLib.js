/**
 * A case-insensitive string comparison function used to sort arrays of objects
 * by a given field.
 *
 * @param {String}
 *            field name of the object field to use for the comparison
 * @param {boolean}
 *            reverse inverts the return value for reverse sorts when true
 * @returns {Function} case-insensitive string comparison function
 */
export const stringComparator = (field, reverse) => {
    // Objects can technically have undefined, null, or empty string keys but it
    // seems like a coding error if that happens.
    if (typeof field !== 'string' || field.length === 0) {
        throw new TypeError('field must be a non-empty string');
    }

    return (a, b) => {
        // TODO: Get locale from user settings rather than using what the
        // browser tells us.
        const result = a[field].localeCompare(b[field], undefined, {
            sensitivity: 'base'
        });
        return reverse ? -result : result;
    };
};

/**
 * A case-insensitive comparison function used to sort arrays of objects by
 * their label field.
 */
export const labelComparator = stringComparator('label');

/**
 * A case-insensitive comparison function used to sort arrays of objects by
 * their name field.
 */
export const nameComparator = stringComparator('name');

/**
 * A comparison function that uses a list of comparators for primary, secondary,
 * etc sorting.
 *
 * @param {Array}
 *            comparators list of comparators
 * @returns {Function} a comparison function using the given comparators for
 *          tiebreakers
 */
export const multiComparator = comparators => {
    if (!Array.isArray(comparators) || comparators.length === 0) {
        throw new TypeError('comparators must be a non-empty array');
    }

    return (a, b) => {
        let result = 0;
        comparators.some(comparator => {
            result = comparator(a, b);
            return result !== 0;
        });

        return result;
    };
};
