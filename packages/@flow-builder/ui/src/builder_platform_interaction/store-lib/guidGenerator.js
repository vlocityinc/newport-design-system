// Unique counter for ids.
let counter = 0;

/**
 * Returns a unique ID for tracking elements in the store
 *
 * @param {String} prefix    human readable string used to generate a unique id
 * @returns {String}         a unique ID
 */
export function generateGuid(prefix) {
    // Strip out all non alphabetical characters and use uid as the prefix if no
    // prefix is applied or if there are no alphabetical characters in the provided prefix
    const cleanPrefix = String(prefix || '').replace(/[^a-zA-Z]/g, '') || 'uid';
    const suffix = String(counter++).padStart(5, '0');

    return cleanPrefix + '_' + suffix;
}
