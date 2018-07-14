import { fetch, SERVER_ACTION_TYPE } from 'builder_platform_interaction-server-data-lib';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import {LABELS} from 'builder_platform_interaction-screen-editor-i18n-utils';

let extensionCache = [];
let extensionDescriptionCache = {};

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
            isRequired: fieldParam.isRequired,
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
            param.objecType = fieldParam.objectType;
            param.resourcePickerConfig.objectType = fieldParam.objectType;
        }

        if (!isInput) {
            param.resourcePickerConfig.elementType = ELEMENT_TYPE.VARIABLE;
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
 * Returns a list of all the available lightning components implementing a flow marker interface with the following shape
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
        fetch(SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS, ({data, error}) => {
            if (error) {
                callback(null, error);
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
                    }));
                }
                callback(extensionCache.slice(0), null); // clone the array
            }
        });
    }
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
        outputParameters: mergeParameters(fieldMetadata.outputParameters, extensionDescription.outputParameters, 'assignToReference', false)
    };
}