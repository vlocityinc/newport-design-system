let getApexPluginsFunction;

export function setGetApexPluginsFunction(theFunction) {
    getApexPluginsFunction = theFunction;
}

/**
 * Callback for getApexPlugins
 *
 * @callback apexPluginsCallback
 * @param {Object[]}
 *            apexPlugins array of apex plugins
 * @param {String}
 *            apexPlugins[].apexClass
 * @param {String}
 *            apexPlugins[].description
 * @param {String}
 *            apexPlugins[].name
 * @param {String}
 *            apexPlugins[].tag
 *
 */

/**
 * Gets apex plugins defined in the org
 *
 * @param {apexPluginsCallback}
 *            callback The callback that handles the response. May be called twice : First with the cached response, if
 *            it’s in storage. Second with updated data from the server, if the stored response has exceeded the time to
 *            refresh entries.
 */
export function getApexPlugins(callback) {
    getApexPluginsFunction(callback);
}
