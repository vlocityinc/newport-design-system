import { fetch, SERVER_ACTION_TYPE } from "builder_platform_interaction/serverDataLib";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";
import { LABELS } from "builder_platform_interaction/screenEditorI18nUtils";

let extensionCache = [];
let extensionDescriptionCache = {};
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
        const newParam = freeze({
            apiName: param.apiName,
            dataType: param.dataType,
            objectType: param.objectType,
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

function mergeParameters(fieldParameters, descParameters, valuePropName, isInput) {
    const fieldParamMap = [];
    for (const param of fieldParameters) {
        const fieldParam = {};
        fieldParam.name = param.name.value;
        fieldParam[valuePropName] = param[valuePropName];
        fieldParamMap[param.name.value] = fieldParam;
    }

    const mergedParams = [];
    for (const fieldParam of descParameters) {
        const param = {
            apiName: fieldParam.apiName,
            name: fieldParam.apiName,
            dataType: fieldParam.dataType,
            description: fieldParam.description,
            hasDefaultValue: fieldParam.hasDefaultValue,
            isRequired: isInput ? fieldParam.isRequired : false,
            label: fieldParam.label,
            maxOccurs: fieldParam.maxOccurs,
            isCollection: fieldParam.maxOccurs > 1,
            guid: generateGuid(),
            key: (isInput ? 'input$$.' : 'output$$.') + fieldParam.apiName,
            resourcePickerConfig: {
                allowLiterals: isInput,
                collection: fieldParam.maxOccurs > 1
            }
        };

        if (fieldParam.objectType) {
            param.objectType = fieldParam.objectType;
            param.resourcePickerConfig.objectType = fieldParam.objectType;
        }

        if (!isInput) {
            param.resourcePickerConfig.elementType = ELEMENT_TYPE.VARIABLE;
        } else if (!param.value) {
            // Input param without value, create hydrated null value
            param.value = {value: null, error: null};
        }

        const mdParam = fieldParamMap[param.apiName];
        if (mdParam) {
            param[valuePropName] = mdParam[valuePropName];
        }

        mergedParams.push(param);
    }

    return mergedParams;
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
export function listExtensions(refreshCache, callback) {
    if (!refreshCache && extensionCache.length) {
        callback(extensionCache.slice(0), null);
    } else {
        const retriever = getListExtensionsRetriever();
        retriever.callbacks.push(callback);
        retriever.retrieve();
    }
}

/*
 * Returns an object that will retrieve the extensions list and have an array of callbacks to be notified when the call returns from the server
 */
function getListExtensionsRetriever() {
    if (!_retriever) {
        let started = false;
        _retriever = {
            callbacks: [],
            retrieve() {
                if (!started) {
                    started = true;
                    const cbs = this.callbacks;
                    fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS, ({data, error}) => {
                        _retriever.callbacks = [];
                        _retriever = null;

                        if (error) {
                            for (const callback of cbs) {
                                callback(null, error);
                            }
                        } else {
                            for (const extension of data) {
                                extensionCache.push(freeze({
                                    name: extension.qualifiedApiName,
                                    fieldType: COMPONENT_INSTANCE,
                                    label: extension.label ? extension.label : extension.qualifiedApiName,
                                    icon: 'utility:connected_apps', // 'standard:custom_notification', //Removing this until we clarify how to change the size and the background of icons in the palette
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
    if (!refreshCache && extensionDescriptionCache[name] !== undefined) {
        callback(cloneDescription(extensionDescriptionCache[name]), null);
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
 * Merges the metadata and the description of a field of type extension
 * @param {object} fieldMetadata - The screen field
 * @param {object} extensionDescription - The extension description
 * @returns {object} The merged object
 */
export function mergeExtensionInfo(fieldMetadata, extensionDescription) {
    return {
        extensionName: extensionDescription.name,
        name: fieldMetadata.name ? fieldMetadata.name : {value: '', error: null},
        inputParameters: mergeParameters(fieldMetadata.inputParameters, extensionDescription.inputParameters, 'value', true),
        outputParameters: mergeParameters(fieldMetadata.outputParameters, extensionDescription.outputParameters, 'value', false)
    };
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
        if (param.isRequired) {
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