import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';

let extensionCache = [];
let extensionDescriptionCache = {};

// Makes the object read only
function freeze(obj) {
    if (obj) {
        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                const type = typeof prop;
                if (type === 'object') {
                    freeze(obj);
                } else {
                    const val = obj[prop];
                    delete obj[prop];
                    Object.defineProperty(obj, prop, {
                        get() {
                            return val;
                        },
                        set() {
                            throw new Error('Immutable Object');
                        }
                    });
                }
            }
        }
    }

    return obj;
}

// Returns a copy of the description with a shallow copy of the parameter arrays
function cloneDescription(desc) {
    return {
        name: desc.name,
        inputParameters: desc.inputParameters.slice(0),
        outputParameters: desc.inputParameters.slice(0)
    };
}

function createDescription(name, data) {
    const desc = {
        name,
        inputParameters: [],
        outputParameters: []
    };

    for (const param of data) {
        const newParam = freeze({
            apiName: param.apiName,
            dataType: param.dataType,
            description: param.description,
            hasDefaultValue: param.hasDefaultValue,
            isRequired: param.isRequired,
            label: param.label,
            maxOccurs: param.maxOccurs
        });

        if (param.isInput) {
            desc.inputParameters.push(newParam);
        }

        if (param.isOutput) {
            desc.outputParameters.push(newParam);
        }
    }

    return desc;
}

/**
 * Returns a list of all the available lightning components implementing a flow marker interface with the following shape
 *
 * {description, label, marker (the marker interface), qualifiedApiName, source (Managed | Unmanaged | Standard)}
 *
 * @param {Boolean} refreshCache - Refresh the cached list, if any. (data will be retrieved form the server)
 * @returns {Array} a Promise with the description of the component
 */
export function listExtensions(refreshCache) {
    if (!refreshCache && extensionCache.length) {
        return Promise.resolve(extensionCache.slice(0));
    }

    return new Promise((resolve, reject) => {
        fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS, ({data, error}) => {
            if (error) {
                reject(error);
            } else {
                for (const extension of data) {
                    extensionCache.push(freeze({
                        description: extension.description,
                        label: extension.label,
                        marker: extension.marker,
                        qualifiedApiName: extension.qualifiedApiName,
                        source: extension.source
                    }));
                }
                resolve(extensionCache.slice(0)); // clone the array
            }
        });
    });
}

/**
 * Describes a component, with the following shape:
 *      {name, inputParameters:[params], outputParameters:[params]}
 *
 * Parameters have the following shape:
 *      {apiName, dataType, description, hasDefaultValue, isRequired, label, maxOccurs}
 *
 * @param {String} name - The FQN of the component
 * @param {Boolean} refreshCache - Refresh the cache for the specified component (data will be retrieved form the server)
 * @returns {Promise} a Promise with the description of the component with the following shape
 */
export function describeExtension(name, refreshCache) {
    if (!refreshCache && extensionDescriptionCache[name] !== undefined) {
        return Promise.resolve(cloneDescription(extensionDescriptionCache[name]));
    }

    return new Promise((resolve, reject) => {
        fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_PARAMS, ({data, error}) => {
            if (error) {
                reject(error);
            } else {
                extensionDescriptionCache[name] = createDescription(name, data);
                resolve(cloneDescription(extensionDescriptionCache[name]));
            }
        }, {name});
    });
}

/**
 * Clears the list and description cached data
 */
export function clearExtensionsCache() {
    extensionCache = [];
    extensionDescriptionCache = {};
}