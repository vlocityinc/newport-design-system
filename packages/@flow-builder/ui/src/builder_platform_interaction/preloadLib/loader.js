import { format } from 'builder_platform_interaction/commonUtils';
import { fetchOnce, SERVER_ACTION_TYPE, getAuraCallback } from 'builder_platform_interaction/serverDataLib';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { updateApexClasses } from 'builder_platform_interaction/actions';
import { logPerfTransactionEnd, logPerfTransactionStart } from 'builder_platform_interaction/loggingUtils';
import {
    loadApexPlugins,
    loadActions,
    loadSubflows,
    loadResourceTypes,
    loadOperators,
    loadRules,
    loadEventTypes,
    loadEntities,
    loadWorkflowEnabledEntities,
    loadSystemVariables,
    loadGlobalVariables,
    loadProcessTypeFeatures,
    loadPalette
} from './dataForProcessType';

import { invokeModal } from 'builder_platform_interaction/builderUtils';

import errorTitle from '@salesforce/label/FlowBuilderAlertModal.errorTitle';
import errorMessage from '@salesforce/label/FlowBuilderAlertModal.errorMessage';
import errorCode from '@salesforce/label/FlowBuilderAlertModal.errorCode';
import okayButtonLabel from '@salesforce/label/FlowBuilderAlertModal.okayButtonLabel';

/** Promise.allSettled() polyfill. */
const promiseAllSettled = promises =>
    Promise.all(
        promises.map(promise =>
            promise
                .then(value => ({
                    status: 'fulfilled',
                    value
                }))
                .catch(reason => ({
                    status: 'rejected',
                    reason
                }))
        )
    );

/** Promise.finally() polyfill. */
const promiseFinally = (promise, onFinally) =>
    promise.then(
        value => {
            const result = onFinally();
            return new Promise(resolve => {
                resolve(result);
            }).then(() => value);
        },
        reason => {
            const result = onFinally();
            return new Promise(resolve => {
                resolve(result);
            }).then(() => {
                throw reason;
            });
        }
    );

/**
 * Orchestrates loading of various metadata the Flow Builder requires.
 * This includes loading of metadata for the expression builder and resource picker,
 * aka peripheral metadata.
 */
class Loader {
    store;

    /** An object to be able to wait until entities are loaded */
    entitiesLoaded = {
        promise: null,
        resolve: null
    };

    apexClassesLoaded = {
        promise: null
    };

    constructor(store) {
        this.store = store;
        this.createEntitiesLoadedPromise();
    }

    // @api
    loadOnStart() {
        this.loadApexClasses();
    }

    // @api
    loadApexClasses() {
        if (!this.apexClassesLoaded.promise) {
            // Load apex
            // we don't set the apex types until we loaded the entities because we need entities before we can get apex properties
            this.apexClassesLoaded.promise = Promise.all([
                fetchOnce(SERVER_ACTION_TYPE.GET_APEX_TYPES, {}, { background: true }),
                this.entitiesLoaded.promise
            ]).then(([data]) => {
                this.store.dispatch(updateApexClasses(data));
                setApexClasses(data);
            });
        }
        return this.apexClassesLoaded.promise;
    }

    // @api
    loadOnProcessTypeChange(flowProcessType, flowDefinitionId) {
        // currently, we prefetch actions, apex plugins and subflows for performance reasons but we don't need them to be loaded
        // before we can open a Property Editor
        const loadActionsPromise = loadActions(flowProcessType);
        loadApexPlugins();
        loadSubflows(flowProcessType, flowDefinitionId);
        const loadPalettePromise = loadPalette(flowProcessType);
        const loadPeripheralMetadataPromise = this.loadPeripheralMetadata(flowProcessType);
        return {
            loadActionsPromise,
            loadPeripheralMetadataPromise,
            loadPalettePromise
        };
    }

    loadPeripheralMetadata(flowProcessType) {
        logPerfTransactionStart(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR);
        return getAuraCallback(() =>
            // TODO: Use Promise.allSettled() & Promise.finally() when supported by LWC
            promiseFinally(
                promiseAllSettled([
                    loadRules(),
                    loadOperators(),
                    loadEventTypes(),
                    // Get workflow enabled entities for before-save trigger object list
                    loadEntities('ALL')
                        .then(() => this.entitiesLoaded.resolve())
                        .then(loadWorkflowEnabledEntities),
                    loadResourceTypes(flowProcessType),
                    loadProcessTypeFeatures(flowProcessType),
                    loadGlobalVariables(flowProcessType),
                    loadSystemVariables(flowProcessType)
                ]).then(promises => {
                    const failed = promises.find(promise => promise.status === 'rejected');
                    if (failed) {
                        // This will get replaced with a better error message with W-7024241.
                        let messageForErrorModal = errorMessage;
                        if (failed.reason.cause) {
                            const error = failed.reason.cause;
                            if (error && error[0]) {
                                messageForErrorModal = error[0].data && error[0].data.contextMessage;
                                const gackId = error[0].id;
                                if (gackId) {
                                    messageForErrorModal += ' ' + format(errorCode, gackId);
                                }
                            }
                        }

                        invokeModal({
                            headerData: {
                                headerTitle: errorTitle
                            },
                            bodyData: {
                                bodyTextOne: messageForErrorModal
                            },
                            footerData: {
                                buttonOne: {
                                    buttonVariant: 'Brand',
                                    buttonLabel: okayButtonLabel
                                }
                            }
                        });
                    }
                    // There shoulnd't be a need to consume any of the promise data downstream and
                    // thus the metadata isn't propagated any further in the promise chain.
                }),
                // finally
                () => {
                    logPerfTransactionEnd(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR);
                }
            )
        )();
    }

    createEntitiesLoadedPromise() {
        this.entitiesLoaded.promise = new Promise(resolve => {
            this.entitiesLoaded.resolve = resolve;
        });
    }
}

/** Loader singleton */
let loader;

/**
 * Initialiases the loader, giving it the store instance.
 * @param {Store} store Store instance
 */
export function initializeLoader(store) {
    if (loader) {
        throw new Error('Loader already initialized');
    }
    loader = new Loader(store);
}

export function clearLoader() {
    loader = null;
}

/**
 * Triggers loading of
 * - apex types
 */
export const loadOnStart = () => loader.loadOnStart();

/**
 * Triggers loading of
 * - peripheral metadata
 * - invocable actions
 * - apex plugins
 * - subflows
 * @param {String} processType Process type
 * @param {String} flowDefinitionId
 */
export const loadOnProcessTypeChange = (processType, flowDefinitionId) =>
    loader.loadOnProcessTypeChange(processType, flowDefinitionId);

/**
 * Load all apex classes
 * @returns {Promise} A promise that is resolved when apex classes have been loaded
 */
export const loadApexClasses = () => loader.loadApexClasses();

/**
 * Load all supported features for the given list of process types
 * @param processTypes
 */
export const loadAllSupportedFeatures = processTypes =>
    processTypes.forEach(processType => loadProcessTypeFeatures(processType.name));
