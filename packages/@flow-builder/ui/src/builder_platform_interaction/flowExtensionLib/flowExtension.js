import {
    fetch,
    SERVER_ACTION_TYPE
} from 'builder_platform_interaction/serverDataLib';
import { readonly } from 'lwc';
import { LABELS } from 'builder_platform_interaction/screenEditorI18nUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

let extensionCache = [];
let extensionDescriptionCache = {};
let flowProcessTypeCache;
let _retriever; // Retrieves extensions list and notifies all callbacks that registered while the operation was taking place

export const COMPONENT_INSTANCE = 'ComponentInstance';
export const EXTENSION_TYPE_SOURCE = { LOCAL: 'local', SERVER: 'server' };
const screenFieldLabelToIconMapping = {
        'Address': 'standard:address',
        'Dependent Picklists': 'standard:picklist_type',
        'Display Image': 'utility:image',
        'Email': 'standard:email',
        'Lookup': 'standard:record_lookup',
        'Name': 'standard:contact',
        'Phone': 'standard:call',
        'Time':  'standard:date_time',
        'URL': 'standard:link'
};

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
                    fetch(
                        SERVER_ACTION_TYPE.GET_FLOW_EXTENSIONS,
                        ({ data, error }) => {
                            _retriever.callbacks = [];
                            _retriever = null;

                            if (error) {
                                for (const callback of cbs) {
                                    callback(null, error);
                                }
                            } else {
                                flowProcessTypeCache = flowProcessType;
                                const defaultIcon = 'standard:lightning_component';
                                for (const extension of data) {
                                    extensionCache.push(
                                        readonly({
                                            name: extension.qualifiedApiName,
                                            fieldType: COMPONENT_INSTANCE,
                                            label: extension.label
                                                ? extension.label
                                                : extension.qualifiedApiName,
                                            icon: screenFieldLabelToIconMapping[extension.label] || defaultIcon,
                                            category:
                                                extension.source === 'Standard'
                                                    ? LABELS.fieldCategoryInput
                                                    : LABELS.fieldCategoryCustom,
                                            description: extension.description,
                                            marker: extension.marker,
                                            source: EXTENSION_TYPE_SOURCE.SERVER // The extension description was retrieved from the server
                                        })
                                    );
                                }

                                for (const callback of cbs) {
                                    callback(extensionCache.slice(0), null); // clone the array
                                }
                            }
                        },
                        {
                            flowProcessType
                        }
                    );
                }
            }
        };
    }

    return _retriever;
}

/**
 * Returns a Promise that will be resolved once the extension field types have been retrieved.
 *
 * @Returns {Promise} - The promise
 */
export function getExtensionFieldTypes(flowProcessType) {
    const cachedFields = getAllCachedExtensionTypes();
    // It's a short term fix to enable process type filtering. FetchOnce should be used to cache the data.
    // After refactoring, the screen property editor will be using the same mechanism to cache as other places in the flow builder.
    // Work item: https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B0000006Qf9JIAS/view
    const cachedFlowProcessType = getCachedFlowProcessType();
    if (
        cachedFields &&
        cachedFields.length &&
        cachedFlowProcessType &&
        cachedFlowProcessType === flowProcessType
    ) {
        return Promise.resolve(cachedFields);
    }

    return new Promise((resolve, reject) => {
        listExtensions(flowProcessType, true, (data, error) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
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
 * @returns {Promise} A promise to the extension description
 */
export function describeExtension(
    name,
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    return describeExtensions([name], {
        background,
        disableErrorModal,
        messageForErrorModal
    }).then(descriptions => descriptions[0]);
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
            descriptions.push(description);
        } else {
            return null;
        }
    }

    return descriptions;
}

/**
 * Returns the description of provided extension from the cache
 * @param {string} name - The extension name
 * @returns {ExtensionDescriptor} - The description of the extension or undefined if not found
 */
export function getCachedExtension(name) {
    return extensionDescriptionCache[name];
}

function transformDefaultValue(value) {
    if (value) {
        if (
            value === false ||
            (value.toLowerCase && value.toLowerCase().trim() === 'false')
        ) {
            return GLOBAL_CONSTANTS.BOOLEAN_FALSE;
        } else if (
            value === true ||
            (value.toLowerCase && value.toLowerCase().trim() === 'true')
        ) {
            return GLOBAL_CONSTANTS.BOOLEAN_TRUE;
        } else if (value && value.trim && value.trim() === '') {
            return GLOBAL_CONSTANTS.EMPTY_STRING;
        }
    }

    return value;
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
            isInput: param.isInput,
            isOutput: param.isOutput,
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
    }

    return readonly(desc);
}

/**
 * Describes a list of components, with the following shape:
 *      {name, inputParameters:[params], outputParameters:[params]}
 *
 * Parameters have the following shape:
 *      {apiName, dataType, description, hasDefaultValue, isRequired, label, maxOccurs}
 *
 * @param {String[]} names - The FQN of the components
 * @returns {Promise} - A promise to the extensions descriptions
 */
export function describeExtensions(
    names = [],
    { background = false, disableErrorModal = false, messageForErrorModal } = {}
) {
    const extensionNamesToFetch = names.filter(
        name => !extensionDescriptionCache[name]
    );
    let promise;
    if (extensionNamesToFetch.length === 0) {
        promise = Promise.resolve([]);
    } else {
        promise = new Promise((resolve, reject) => {
            fetch(
                SERVER_ACTION_TYPE.GET_FLOW_EXTENSION_LIST_PARAMS,
                ({ data, error }) => {
                    if (error) {
                        reject(new Error(error));
                    } else {
                        for (const name of extensionNamesToFetch) {
                            if (!extensionDescriptionCache[name]) {
                                extensionDescriptionCache[
                                    name
                                ] = createDescription(name, data[name]);
                            }
                        }
                        resolve(
                            extensionNamesToFetch.map(
                                name => extensionDescriptionCache[name]
                            )
                        );
                    }
                },
                { names: extensionNamesToFetch },
                {
                    background,
                    disableErrorModal,
                    messageForErrorModal
                }
            );
        });
    }
    return promise.then(() =>
        names.map(name => extensionDescriptionCache[name])
    );
}

/**
 * Clears the list and description cached data
 */
export function clearExtensionsCache() {
    extensionCache = [];
    extensionDescriptionCache = {};
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
