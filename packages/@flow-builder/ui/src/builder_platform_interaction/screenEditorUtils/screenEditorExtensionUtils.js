import { fetch, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";
import { getDataTypeIcons, FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { GLOBAL_CONSTANTS } from "builder_platform_interaction/systemLib";

const DEFAULT_ATTRIBUTE_TYPE_ICON = 'utility:all';

let extensionCache = [];
let extensionDescriptionCache = {};
let flowProcessTypeCache;
let _retriever; // Retrieves extensions list and notifies all callbacks that registered while the operation was taking place

export const EXTENSION_TYPE_SOURCE = {LOCAL:'local', SERVER: 'server'};
export const COMPONENT_INSTANCE = 'ComponentInstance';

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
        const newParam = {
            apiName: param.apiName,
            dataType: param.dataType || FLOW_DATA_TYPE.APEX.value, // LC parameters that accept apex classes have no data type set
            subtype: param.objectType || param.apexClass,
            description: param.description,
            hasDefaultValue: param.hasDefaultValue,
            isRequired: param.isRequired,
            label: param.label,
            maxOccurs: param.maxOccurs
        };

        if (param.hasDefaultValue) {
            newParam.defaultValue = transformDefaultValue(param.defaultValue);
        }

        if (param.isInput) {
            desc.inputParameters.push(newParam);
        }

        if (param.isOutput) {
            desc.outputParameters.push(newParam);
        }

        freeze(newParam);
    }

    return desc;
}

function transformDefaultValue(value) {
    if (value) {
        if (value === false || (value.toLowerCase && value.toLowerCase().trim() === 'false')) {
            return GLOBAL_CONSTANTS.BOOLEAN_FALSE;
        } else if (value === true || (value.toLowerCase && value.toLowerCase().trim() === 'true')) {
            return GLOBAL_CONSTANTS.BOOLEAN_TRUE;
        } else if (value && value.trim && value.trim() === '') {
            return GLOBAL_CONSTANTS.EMPTY_STRING;
        }
    }

    return value;
}

/**
 * Returns a list of all the available lightning components implementing a flow marker interface with the following shape.
 * If there is already a request in process this function makes sure that the original request is used.
 *
 * {description, label, marker (the marker interface), qualifiedApiName, source (Managed | Unmanaged | Standard)}
 *
 * @param {Boolean} refreshCache - Refresh the cached list, if any. (data will be retrieved form the server)
 * @param {Function} callback - The callback to execute to notify, fn(data, error)
 */
export function listExtensions(flowProcessType, refreshCache, callback) {
    if (!refreshCache && extensionCache.length) {
        callback(extensionCache.slice(0), null);
    } else {
        const retriever = getListExtensionsRetriever(flowProcessType);
        retriever.callbacks.push(callback);
        retriever.retrieve();
    }
}

/*
 * Returns an object that will retrieve the extensions list and have an array of callbacks to be notified when the call returns from the server
 */
function getListExtensionsRetriever(flowProcessType) {
    if (!_retriever) {
        let started = false;
        _retriever = {
            callbacks: [],
            retrieve() {
                if (!started) {
                    started = true;
                    const cbs = this.callbacks;
                    extensionCache = [];
                    fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS, ({data, error}) => {
                        _retriever.callbacks = [];
                        _retriever = null;

                        if (error) {
                            for (const callback of cbs) {
                                callback(null, error);
                            }
                        } else {
                            flowProcessTypeCache = flowProcessType;
                            for (const extension of data) {
                                extensionCache.push(freeze({
                                    name: extension.qualifiedApiName,
                                    fieldType: COMPONENT_INSTANCE,
                                    label: extension.label ? extension.label : extension.qualifiedApiName,
                                    icon: 'standard:lightning_component',
                                    category: extension.source === 'Standard' ? LABELS.fieldCategoryInput : LABELS.fieldCategoryCustom,
                                    description: extension.description,
                                    marker: extension.marker,
                                    source: EXTENSION_TYPE_SOURCE.SERVER // The extension description was retrieved from the server
                                }));
                            }

                            for (const callback of cbs) {
                                callback(extensionCache.slice(0), null); // clone the array
                            }
                        }
                    }, {
                        flowProcessType
                    });
                }
            }
        };
    }

    return _retriever;
}

/**
 * This does not go back to the server
 * @returns {Array} A list of extension types from the cache
 */
export function getAllCachedExtensionTypes() {
    return extensionCache;
}

export function getCachedFlowProcessType() {
    return flowProcessTypeCache;
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
 * @param {Function} callback - The callback to execute to notify, fn(data, error)
 */
export function describeExtension(name, refreshCache, callback) {
    if (name) {
        if (!refreshCache && extensionDescriptionCache[name] !== undefined) {
            callback(cloneDescription(extensionDescriptionCache[name]), null);
            return;
        }

        fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_PARAMS, ({data, error}) => {
            if (error) {
                callback(null, error);
            } else {
                extensionDescriptionCache[name] = createDescription(name, data);
                callback(cloneDescription(extensionDescriptionCache[name]), null);
            }
        }, {name});
    }
}

/**
 * Returns the description of all the provided extensions form the cache or null if any of the can't be found
 * @param {string} names - The extension names
 * @returns {ExtensionDescriptor[]} - The description of the extensions
 */
export function getCachedExtensions(names) {
    const descriptions = [];
    for (const name of names) {
        const description = extensionDescriptionCache[name];
        if (description) {
            descriptions.push(cloneDescription(description));
        } else {
            return null;
        }
    }

    return descriptions;
}

/**
 * Describes a list of components, with the following shape:
 *      {name, inputParameters:[params], outputParameters:[params]}
 *
 * Parameters have the following shape:
 *      {apiName, dataType, description, hasDefaultValue, isRequired, label, maxOccurs}
 *
 * @param {String[]} names - The FQN of the components
 * @param {Boolean} refreshCache - Refresh the cache for the specified component (data will be retrieved form the server)
 * @param {Function} callback - The callback to execute to notify, fn(descriptors[], error)
 */
export function describeExtensions(names, refreshCache, callback) {
    // Check if all descriptions are cached
    if (!refreshCache) {
        const cachedDescs = getCachedExtensions(names);
        if (cachedDescs) {
            callback(cachedDescs, null);
            return;
        }
    }

    fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_LIST_PARAMS, ({data, error}) => {
        if (error) {
            callback(null, error);
        } else {
            const descs = [];
            for (const name of names) {
                extensionDescriptionCache[name] = createDescription(name, data[name]);
                descs.push(cloneDescription(extensionDescriptionCache[name]));
            }

            callback(descs, null);
        }
    }, {names});
}

/**
 * Clears the list and description cached data
 */
export function clearExtensionsCache() {
    extensionCache = [];
    extensionDescriptionCache = {};
}

/**
 * Replaces all local (temporary) extension field types with their server versions (if available) in every field in the provided screen
 * @param {object} screen - the screen
 * @returns {object} the processed screen
 */
export function processScreenExtensionTypes(screen) {
    for (const field of screen.fields) {
        if (field.fieldType === COMPONENT_INSTANCE && field.type.source === EXTENSION_TYPE_SOURCE.LOCAL) {
            for (const type of extensionCache) {
                if (type.name === field.type.name) {
                    field.type = type;
                    break;
                }
            }
        }
    }

    return screen;
}

/**
 * Adds all required and not present input parameters to all extension fields in the screen. If a callback is provided it will
 * go to the server to retrieve the descriptions in case they are not in the cache
 *
 * @param {Screen} screen - The screen
 * @param {Function} callback - The callback to execute when done (can be null)
 */
export function processRequiredParamsForExtensionsInScreen(screen, callback) {
    // Get all extension fields
    const extensionFields = screen.fields.filter(f => f.fieldType === COMPONENT_INSTANCE);

    // Get the extension names
    const extensions = extensionFields.map(f => f.extensionName.value);

    const processFn = (descriptions) => {
        // Create a map field.name = field
        const fieldsMap = extensionFields.reduce((map, field) => {
            map[field.extensionName.value] = field;
            return map;
        }, {});

        // For each descriptor add all required attributes not present to the field
        for (const description of descriptions) {
            // Add all required attributes not present in input params
            const field = fieldsMap[description.name];
            addRequiredInputParameters(field, description);
        }
    };


    if (callback) { // Async, go to server if necessary
        // Get the descriptions
        describeExtensions(extensions, false, (descs, error) => {
            if (error) {
                callback({error});
            } else {
                processFn(descs);
                callback({error, screen});
            }
        });
    } else {
        // Use cached descriptors
        const descs = getCachedExtensions(extensions);
        if (descs.length !== extensions.length) {
            throw new Error('Can not find all required extension descriptions in the cache');
        } else {
            processFn(descs);
        }
    }
}

/**
 * Injects all required input parameters that are not present in the field.
 *
 * @param {screenfield} field - The extension screen field
 * @param {ExtensionDescription} description - The descriptor of the extension
 */
export function addRequiredInputParameters(field, description) {
    for (const param of description.inputParameters) {
        if (param.isRequired && !param.hasDefaultValue) {
            if (field.inputParameters.filter(p => p.name.value === param.apiName).length === 0) { // Param is not present
                field.inputParameters.push({
                    name: {value: param.apiName, error: null},
                    value: {value: null, error: null},
                    processMetadataValues: {}
                });
            }
        }
    }
}

/**
 * Returns the icon for the type of the specified parameter.
 *
 * @param {Object} type - The parameter type
 * @returns {String} - The icon name
 */
export function getIconForParameter(type) {
    return getDataTypeIcons(type, 'utility') || DEFAULT_ATTRIBUTE_TYPE_ICON;
}