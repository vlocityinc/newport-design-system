// @ts-nocheck
import errorCode from '@salesforce/label/FlowBuilderAlertModal.errorCode';
import errorMessage from '@salesforce/label/FlowBuilderAlertModal.errorMessage';
import errorTitle from '@salesforce/label/FlowBuilderAlertModal.errorTitle';
import okayButtonLabel from '@salesforce/label/FlowBuilderAlertModal.okayButtonLabel';
import { updateApexClasses } from 'builder_platform_interaction/actions';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { arraysCompare } from 'builder_platform_interaction/builderUtils';
import { fetchOnce, getAuraCallback, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { commonUtils, invokeModal, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import {
    loadActions,
    loadApexPlugins,
    loadEntities,
    loadEventTypes,
    loadFlowExtensions,
    loadGlobalVariables,
    loadOperators,
    loadPalette,
    loadProcessTypeFeatures,
    loadResourceTypes,
    loadRules,
    loadSubflows,
    loadSystemVariables,
    loadWorkflowEnabledEntities
} from './dataForProcessType';

const { format } = commonUtils;

const { logPerfTransactionEnd, logPerfTransactionStart } = loggingUtils;

/**
 * Promise.allSettled() polyfill.
 *
 * @param promises Promises
 * @returns The Promised result
 */
const promiseAllSettled = (promises) =>
    Promise.all(
        promises.map((promise) =>
            promise
                .then((value) => ({
                    status: 'fulfilled',
                    value
                }))
                .catch((reason) => ({
                    status: 'rejected',
                    reason
                }))
        )
    );

/**
 * Promise.finally() polyfill.
 *
 * @param promise The promise
 * @param onFinally Function called onFinally
 * @returns The Promise result
 */
const promiseFinally = (promise, onFinally) =>
    promise.then(
        (value) => {
            const result = onFinally();
            return new Promise((resolve) => {
                resolve(result);
            }).then(() => value);
        },
        (reason) => {
            const result = onFinally();
            return new Promise((resolve) => {
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
    private readonly store;

    /** An object to be able to wait until entities are loaded */
    private entitiesLoaded: { promise?: Promise<void>; resolve?: Function; reject?: Function } = {};

    private apexClassesLoaded: { promise?: Promise<void>; promiseWithTimeout?: Promise<void> } = {};

    private flowExtensionsLoaded: Promise;

    private flowProcessTypeCache: string;

    private flowEnvironmentsCache: string[];

    constructor(store) {
        this.store = store;
        this.createEntitiesLoadedPromise();
    }

    public loadOnStart(): Promise<void> {
        return this.loadApexClasses();
    }

    public loadApexClassesWithTimeout() {
        // The returned promise will be fulfilled when either apex classes and entities are loaded or when timeout for fetching apex types is reached
        if (!this.apexClassesLoaded.promiseWithTimeout) {
            this.apexClassesLoaded.promiseWithTimeout = new Promise((resolve, reject) => {
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

                this.loadApexClasses()
                    .catch((e) => {
                        reject(e);
                        clearTimeout(timer);
                        throw e;
                    })
                    .then(() => {
                        clearTimeout(timer);
                        resolve();
                    })
                    .catch(() => {});
            });
        }
        return this.apexClassesLoaded.promiseWithTimeout;
    }

    /**
     * Loads Auxiliary Metadata on Process Type Change
     *
     * @param flowProcessType - Flow Process Type
     * @param flowTriggerType - Flow Trigger Type
     * @param recordTriggerType - Record Trigger Type
     * @param flowDefinitionId - Flow Defintion Id
     * @param flowEnvironments - Selected Flow environments
     * @returns Object with promises
     */
    public loadOnProcessTypeChange(
        flowProcessType,
        flowTriggerType,
        recordTriggerType,
        flowDefinitionId,
        flowEnvironments
    ) {
        // currently, we prefetch actions, apex plugins and subflows for performance reasons but we don't need them to be loaded
        // before we can open a Property Editor
        let loadActionsProcessTypePromise: Promise<any>;
        if (flowTriggerType != null) {
            loadActionsProcessTypePromise = loadActions(flowProcessType, flowTriggerType);
        }
        loadApexPlugins();
        const loadSubflowsPromise = loadSubflows(flowProcessType, flowDefinitionId);
        const loadPalettePromise = loadPalette(flowProcessType, flowTriggerType);
        const loadPeripheralMetadataPromise = this.loadPeripheralMetadata(
            flowProcessType,
            flowTriggerType,
            recordTriggerType
        );
        this.loadExtensions(flowProcessType, flowEnvironments);
        return {
            loadPeripheralMetadataPromise,
            loadPalettePromise,
            loadSubflowsPromise,
            loadActionsProcessTypePromise
        };
    }

    /**
     * Loads Auxiliary Metadata on Trigger Type Change
     *
     * @param flowProcessType - Flow Process Type
     * @param flowTriggerType - Flow Trigger Type
     * @param recordTriggerType - Record Trigger Type
     * @returns Object with promises
     */
    public loadOnTriggerTypeChange(flowProcessType, flowTriggerType, recordTriggerType) {
        const loadActionsTriggerTypePromise = loadActions(flowProcessType, flowTriggerType);
        const loadPeripheralMetadataPromise = this.loadPeripheralMetadata(
            flowProcessType,
            flowTriggerType,
            recordTriggerType
        );
        const loadPalettePromise = loadPalette(flowProcessType, flowTriggerType);
        return {
            loadActionsTriggerTypePromise,
            loadPeripheralMetadataPromise,
            loadPalettePromise
        };
    }

    /**
     * Loads Extensions
     *
     * @param flowProcessType - Flow Process Type
     * @param flowEnvironments - Array of selected environment
     * @returns Flow Extionsion Promise
     */
    public loadExtensions(flowProcessType: string, flowEnvironments: string[]): Promise {
        if (
            !this.flowExtensionsLoaded ||
            flowProcessType !== this.flowProcessTypeCache ||
            !arraysCompare(flowEnvironments, this.flowEnvironmentsCache)
        ) {
            this.flowExtensionsLoaded = loadFlowExtensions(flowProcessType, flowEnvironments);
            this.flowProcessTypeCache = flowProcessType;
            this.flowEnvironmentsCache = flowEnvironments;
        }

        return this.flowExtensionsLoaded;
    }

    /**
     * Loads Apex Classes
     * WARNING: this is subject to take a long time. Do not use in a blocking call. Rather use loadApexClassesWithTimeout that will timeout if it takes too long.
     *
     * @returns The Apex Loaded promise
     */
    private loadApexClasses(): Promise<void> {
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

    /**
     * Loads Peripheral Metadata
     *
     * @param flowProcessType - Flow Process Type
     * @param flowTriggerType - Flow Trigger Type
     * @param recordTriggerType - Record Trigger Type
     * @returns auraCallback
     */
    private loadPeripheralMetadata(flowProcessType, flowTriggerType, recordTriggerType) {
        logPerfTransactionStart(SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR);
        return getAuraCallback(() =>
            // TODO: Use Promise.allSettled() & Promise.finally() when supported by LWC
            promiseFinally(
                promiseAllSettled([
                    loadRules(flowProcessType, flowTriggerType, recordTriggerType),
                    loadOperators(flowProcessType, flowTriggerType, recordTriggerType),
                    loadEventTypes(),
                    // Get workflow enabled entities for before-save trigger object list
                    loadEntities('ALL')
                        .catch((e) => {
                            this.entitiesLoaded.reject(e);
                            throw e;
                        })
                        .then(() => this.entitiesLoaded.resolve())
                        .then(loadWorkflowEnabledEntities),
                    loadResourceTypes(flowProcessType),
                    loadProcessTypeFeatures(flowProcessType),
                    loadGlobalVariables(flowProcessType),
                    loadSystemVariables(flowProcessType)
                ]).then((promises) => {
                    const failed = promises.find((promise) => promise.status === 'rejected');
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

    private createEntitiesLoadedPromise() {
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
 *
 * @param store Store instance
 */
export function initializeLoader(store) {
    if (loader) {
        throw new Error('Loader already initialized');
    }
    loader = new Loader(store);
}

/**
 *
 */
export function clearLoader() {
    loader = null;
}

/**
 * Triggers loading of
 * - apex types
 *
 * @returns Load on start promise
 */
export const loadOnStart = () => loader.loadOnStart();

/**
 * Triggers loading of
 * - peripheral metadata
 * - invocable actions
 * - apex plugins
 * - subflows
 *
 * @param flowProcessType The flow processType
 * @param flowTriggerType The flow Trigger type
 * @param flowRecordTriggerType The flow record trigger type
 * @param flowDefinitionId The Flow definition ID
 * @param flowEnvironments - Selected Flow environments
 * @returns the Promise
 */
export const loadOnProcessTypeChange = (
    flowProcessType: string,
    flowTriggerType?: string,
    flowRecordTriggerType?: string,
    flowDefinitionId?: string,
    flowEnvironments?: Array<string>
) =>
    loader.loadOnProcessTypeChange(
        flowProcessType,
        flowTriggerType,
        flowRecordTriggerType,
        flowDefinitionId,
        flowEnvironments
    );

/**
 * Triggers loading of
 * - peripheral metadata
 * - invocable actions
 * - palette
 *
 * @param flowProcessType The flow processType
 * @param flowTriggerType The flow Trigger type
 * @param flowRecordTriggerType The flow record trigger type
 * @returns Object with promises
 */
export const loadOnTriggerTypeChange = (
    flowProcessType: string,
    flowTriggerType?: string,
    flowRecordTriggerType?: string
) => loader.loadOnTriggerTypeChange(flowProcessType, flowTriggerType, flowRecordTriggerType);

/**
 * Triggers loading of operators and operator rules
 *
 * @param flowProcessType Process type
 * @param flowTriggerType Trigger type
 * @param flowRecordTriggerType Record Trigger type
 * @returns Promise
 */
export const loadOperatorsAndRulesOnTriggerTypeChange = (
    flowProcessType: string,
    flowTriggerType?: string,
    flowRecordTriggerType?: string
) => {
    const promises = [];
    promises.push(loadRules(flowProcessType, flowTriggerType, flowRecordTriggerType));
    promises.push(loadOperators(flowProcessType, flowTriggerType, flowRecordTriggerType));
    return Promise.all(promises);
};

/**
 * Load all apex classes
 *
 * @returns {Promise} A promise that is resolved when apex classes have been loaded
 */
export const loadApexClasses = () => loader.loadApexClassesWithTimeout();

/**
 * Load all supported features for the given list of process types
 *
 * @param processTypes The process type
 * @returns The processType features
 */
export const loadAllSupportedFeatures = (processTypes) =>
    processTypes.forEach((processType) => loadProcessTypeFeatures(processType.name));

/**
 * Triggers loading of  flow extensions
 *
 * @param flowProcessType The flow processType
 * @param flowEnvironments The selected environments
 * @returns Object with promises
 */
export const loadFlowExtensionsOnProcessTypeChange = (flowProcessType, flowEnvironments) => {
    return loader.loadExtensions(flowProcessType, flowEnvironments);
};
