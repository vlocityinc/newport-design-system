/**
 * Returns a unique ID for tracking elements in the store
 *
 * @param {String} prefix    human readable string used to generate a unique id
 * @returns {String}         a unique ID
 */
export function generateGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
