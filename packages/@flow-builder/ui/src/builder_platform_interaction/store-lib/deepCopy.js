/**
 * Function for making deep copy of an object
 * @param {Object} obj object to be copied
 * @returns {Object} new copied object
 * @private
 */
export function deepCopy(obj) {
    // TODO: check for performance issue. If there are any performance issue, then update this method.
    // TODO: Update when we find a better way to avoid circular structure for jsPlumbConnector (Hack)
    if (obj && obj.connector && obj.connector.jsPlumbConnector) {
        obj.connector.jsPlumbConnector = {};
    }
    return JSON.parse(JSON.stringify(obj));
}