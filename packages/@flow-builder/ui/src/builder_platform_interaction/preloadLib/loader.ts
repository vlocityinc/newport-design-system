// @ts-nocheck
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

export const GET_APEX_TYPES_TIMEOUT_MS = 20000;

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
        resolve: null,
        reject: null
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
        // The returned promise will be fulfilled when either apex classes and entities are loaded or when timeout for fetching apex types is reached
        if (!this.apexClassesLoaded.promise) {
            this.apexClassesLoaded.promise = new Promise((resolve, reject) => {
                // getApexTypes can take a while. See W-7690844
                // We use a timeout so that we don't block on property editor opening for minutes
                let timer;
                new Promise((resolveTimeout, rejectTimeout) => {
                    // eslint-disable-next-line @lwc/lwc/no-async-operation
                    timer = setTimeout(
                        () => rejectTimeout(new Error('loadApexClasses took too long')),
                        GET_APEX_TYPES_TIMEOUT_MS
                    );
                }).catch(() => resolve());
                const fetchApexTypesPromise = fetchOnce(SERVER_ACTION_TYPE.GET_APEX_TYPES, {}, { background: true });
                fetchApexTypesPromise
                    .then(() => {
                        clearTimeout(timer);
                    })
                    .catch(() => {});

                // Load apex
                // we don't set the apex types until we loaded the entities because we need entities before we can get apex properties
                Promise.all([fetchApexTypesPromise, this.entitiesLoaded.promise])
                    .catch(e => {
                        reject(e);
                        throw e;
                    })
                    .then(([data]) => {
                        this.store.dispatch(updateApexClasses(data));
                        setApexClasses(data);
                        resolve();
                    })
                    .catch(() => {});
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
                        .catch(e => {
                            this.entitiesLoaded.reject(e);
                            throw e;
                        })
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
        this.entitiesLoaded.promise = new Promise((resolve, reject) => {
            this.entitiesLoaded.resolve = resolve;
            this.entitiesLoaded.reject = reject;
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
export const loadOnProcessTypeChange = (processType, flowDefinitionId?) =>
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
