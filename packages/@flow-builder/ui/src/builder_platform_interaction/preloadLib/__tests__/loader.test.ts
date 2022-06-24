// @ts-nocheck
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { makeQuerablePromise, ticks } from 'builder_platform_interaction/builderTestUtils';
import { FLOW_ENVIRONMENT } from 'builder_platform_interaction/flowMetadata';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { invokeModal, loggingUtils } from 'builder_platform_interaction/sharedUtils';
import {
    loadApexPlugins,
    loadDynamicActions,
    loadEntities,
    loadEventTypes,
    loadFlowExtensions,
    loadGlobalVariables,
    loadOperators,
    loadPalette,
    loadProcessTypeFeatures,
    loadResourceTypes,
    loadRules,
    loadStandardActions,
    loadSystemVariables,
    loadWorkflowEnabledEntities
} from '../dataForProcessType';
import {
    clearLoader,
    GET_APEX_TYPES_TIMEOUT_MS,
    initializeLoader,
    loadApexClasses,
    loadOnProcessTypeChange,
    loadOnStart,
    loadOnTriggerTypeChange,
    loadOperatorsAndRulesOnTriggerTypeChange
} from '../loader';

const { logPerfTransactionStart, logPerfTransactionEnd } = loggingUtils;
jest.useFakeTimers();

jest.mock('builder_platform_interaction/actions');
jest.mock('builder_platform_interaction/apexTypeLib');

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn().mockResolvedValue({}),
        getAuraCallback: (callback) => callback
    };
});

jest.mock('../dataForProcessType', () => {
    return {
        loadStandardActions: jest.fn().mockResolvedValue('actions'),
        loadDynamicActions: jest.fn().mockResolvedValue('actions'),
        loadApexPlugins: jest.fn().mockResolvedValue('apexplugins'),
        loadRules: jest.fn().mockResolvedValue('rules'),
        loadOperators: jest.fn().mockResolvedValue('operators'),
        loadEventTypes: jest.fn().mockResolvedValue('eventtypes'),
        loadEntities: jest.fn().mockResolvedValue('entities'),
        loadResourceTypes: jest.fn().mockResolvedValue('resourcetypes'),
        loadProcessTypeFeatures: jest.fn().mockResolvedValue('features'),
        loadGlobalVariables: jest.fn().mockResolvedValue('globalvariables'),
        loadSystemVariables: jest.fn().mockResolvedValue('systemvariables'),
        loadSubflows: jest.fn().mockResolvedValue('subflows'),
        loadPalette: jest.fn().mockResolvedValue('palette'),
        loadWorkflowEnabledEntities: jest.fn(),
        loadFlowExtensions: jest.fn().mockResolvedValue('extensions')
    };
});

jest.mock('builder_platform_interaction/sharedUtils');

jest.mock('builder_platform_interaction/builderUtils');

describe('Loader', () => {
    describe('initialize', () => {
        it('passes', () => {
            initializeLoader({});
            clearLoader();
        });
    });

    describe('loading stages', () => {
        let store;

        const getResolvablePromise = () => {
            let tempResolve;
            let tempReject;
            const promise = new Promise((resolve, reject) => {
                tempResolve = resolve;
                tempReject = reject;
            });
            promise.resolve = tempResolve;
            promise.reject = tempReject;
            return promise;
        };
        beforeEach(() => {
            store = {
                dispatch: jest.fn()
            };
            initializeLoader(store);
        });

        afterEach(() => {
            jest.runAllTimers();
            clearLoader();
        });

        describe('loadOnStart', () => {
            it('triggers loading', () => {
                loadOnStart();
                expect(fetchOnce.mock.calls[0][0]).toBe(SERVER_ACTION_TYPE.GET_APEX_TYPES);
                expect(store.dispatch).toBeCalledTimes(0);
                expect(setApexClasses).toBeCalledTimes(0);
            });
            it('does not resolve while apex types are not loaded', async () => {
                const getApexTypesPromise = getResolvablePromise();
                fetchOnce.mockImplementation((serverActionType) => {
                    if (serverActionType === SERVER_ACTION_TYPE.GET_APEX_TYPES) {
                        return getApexTypesPromise;
                    }
                    return Promise.resolve({});
                });
                const startPromise = makeQuerablePromise(loadOnStart());
                loadOnProcessTypeChange('process_type_1');

                // before timeout : waiting for results
                jest.advanceTimersByTime(GET_APEX_TYPES_TIMEOUT_MS - 1000);
                await ticks();
                expect(startPromise.isFulfilled()).toBe(false);

                // after timeout : promise is still not fulfilled
                jest.advanceTimersByTime(1001);
                await ticks();
                expect(startPromise.isFulfilled()).toBe(false);

                // when apex types returned by fetchOnce : promise is fulfilled
                getApexTypesPromise.resolve({});
                await ticks();
                expect(startPromise.isFulfilled()).toBe(true);
            });
        });

        describe('loadApexClasses', () => {
            let getApexTypesPromise;
            let loadEntitiesPromise;
            beforeEach(() => {
                getApexTypesPromise = getResolvablePromise();
                loadEntitiesPromise = getResolvablePromise();
                fetchOnce.mockImplementation((serverActionType) => {
                    if (serverActionType === SERVER_ACTION_TYPE.GET_APEX_TYPES) {
                        return getApexTypesPromise;
                    }
                    return Promise.resolve({});
                });
                loadEntities.mockImplementation(() => loadEntitiesPromise);
            });
            afterEach(() => {
                // restore mock implementation for fetchOnce
                fetchOnce.mockImplementation(() => Promise.resolve({}));
                loadEntities.mockImplementation(() => Promise.resolve('entities'));
            });
            it('resolves on timeout', async () => {
                loadOnProcessTypeChange('process_type_1');
                loadEntitiesPromise.resolve();
                const loadApexTypePromise = makeQuerablePromise(loadApexClasses());

                // before timeout : waiting for results
                jest.advanceTimersByTime(GET_APEX_TYPES_TIMEOUT_MS - 1000);
                await ticks();
                expect(store.dispatch).toBeCalledTimes(0);
                expect(setApexClasses).toBeCalledTimes(0);
                expect(loadApexTypePromise.isPending()).toBe(true);

                // after timeout : promise fulfilled but apex types not updated
                jest.advanceTimersByTime(1001);
                await ticks();
                expect(loadApexTypePromise.isFulfilled()).toBe(true);
                expect(store.dispatch).toBeCalledTimes(0);
                expect(setApexClasses).toBeCalledTimes(0);

                // when apex types returned by fetchOnce : apex types updated
                getApexTypesPromise.resolve({});
                await ticks();
                expect(store.dispatch).toBeCalledTimes(1);
                expect(setApexClasses).toBeCalledTimes(1);
            });
            it('returns a rejected promise if getApexClasses returns an error', async () => {
                loadOnProcessTypeChange('process_type_1');
                loadEntitiesPromise.resolve();
                const loadApexTypePromise = makeQuerablePromise(loadApexClasses());
                getApexTypesPromise.reject(new Error('Error while retrieving apex types'));
                await ticks();
                await expect(loadApexTypePromise).rejects.toEqual(new Error('Error while retrieving apex types'));
            });
            it('returns a rejected promise if entities could not be retrieved', async () => {
                loadOnProcessTypeChange('process_type_1');
                const loadApexTypePromise = loadApexClasses();
                loadEntitiesPromise.reject(new Error('Error while retrieving entities'));
                await ticks();
                await expect(loadApexTypePromise).rejects.toEqual(new Error('Error while retrieving entities'));
            });
            it('does not set apex classes until entities are loaded', async () => {
                loadApexClasses();
                loadOnProcessTypeChange('process_type_1');
                getApexTypesPromise.resolve({});
                await ticks();
                expect(store.dispatch).toBeCalledTimes(0);
                expect(setApexClasses).toBeCalledTimes(0);
                loadEntitiesPromise.resolve('entities');
                await ticks();
                expect(store.dispatch).toBeCalledTimes(1);
                expect(setApexClasses).toBeCalledTimes(1);
            });
            test('concurrency with loadOnStart', async () => {
                const startPromise = makeQuerablePromise(loadOnStart());
                loadOnProcessTypeChange('process_type_1');
                loadEntitiesPromise.resolve();
                const loadApexTypePromise = makeQuerablePromise(loadApexClasses());

                // before timeout : waiting for results -> both promises pending
                jest.advanceTimersByTime(GET_APEX_TYPES_TIMEOUT_MS - 1000);
                await ticks();
                expect(startPromise.isPending()).toBe(true);
                expect(loadApexTypePromise.isPending()).toBe(true);

                // after timeout : promise is still not fulfilled -> only loadOnStart which has no timeout is still pending
                jest.advanceTimersByTime(1001);
                await ticks();
                expect(startPromise.isPending()).toBe(true);
                expect(loadApexTypePromise.isFulfilled()).toBe(true);

                // when apex types returned by fetchOnce : loadOnStart promise is fulfilled
                getApexTypesPromise.resolve({});
                await ticks();
                expect(startPromise.isFulfilled()).toBe(true);
            });
        });

        describe('loadOnProcessTypeChange', () => {
            it('initiates loading of peripheral metadata', async () => {
                const processType = 'process_type_1';
                const triggerType = 'record_after_save';
                const recordTriggerType = 'update';
                loadOnStart();
                const promise = loadOnProcessTypeChange(
                    processType,
                    triggerType,
                    recordTriggerType
                ).loadPeripheralMetadataPromise;
                expect(promise).not.toBeNull();
                await promise;
                // Resolves to nothing currently in that there is no need to handle loaded data down in the promise chain.
                expect(promise).resolves.toEqual();
                expect(logPerfTransactionStart).toBeCalledWith(
                    SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                );
                expect(loadStandardActions).toBeCalledWith(processType, triggerType);
                expect(loadDynamicActions).toBeCalledWith(processType, triggerType);
                expect(loadApexPlugins).toBeCalledTimes(1);
                expect(loadRules).toBeCalledTimes(1);
                expect(loadRules).toBeCalledWith(processType, triggerType, recordTriggerType);
                expect(loadOperators).toBeCalledTimes(1);
                expect(loadOperators).toBeCalledWith(processType, triggerType, recordTriggerType);
                expect(loadEventTypes).toBeCalledTimes(1);
                expect(loadEntities).toBeCalledWith('ALL');
                expect(loadResourceTypes).toBeCalledWith(processType);
                expect(loadProcessTypeFeatures).toBeCalledWith(processType);
                expect(loadGlobalVariables).toBeCalledWith(processType);
                expect(loadSystemVariables).toBeCalledWith(processType);
                expect(loadWorkflowEnabledEntities).toBeCalledTimes(1);
                expect(store.dispatch).toBeCalledTimes(1);
                expect(setApexClasses).toBeCalledTimes(1);
                expect(logPerfTransactionEnd).toBeCalledWith(
                    SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                );
            });
            it('initiates loading of extensions', () => {
                const processType = 'process_type_1';
                loadOnStart();
                loadOnProcessTypeChange(processType, null, null, null, [FLOW_ENVIRONMENT.SLACK]);
                expect(loadFlowExtensions).toBeCalledTimes(1);
                expect(loadFlowExtensions).toBeCalledWith(processType, [FLOW_ENVIRONMENT.SLACK]);
            });
            it('brings up an alert when either of the calls fails', async () => {
                loadResourceTypes.mockRejectedValue('something went wrong');
                loadEventTypes.mockRejectedValue('something else went wrong');
                const processType = 'process_type_1';
                loadOnStart();
                const promise = loadOnProcessTypeChange(processType).loadPeripheralMetadataPromise;
                expect(promise).not.toBeNull();
                await promise;
                expect(promise).resolves.toEqual();
                expect(invokeModal).toBeCalledTimes(1);
            });
        });
        describe('loadOperatorsAndRulesOnTriggerTypeChange', () => {
            it('initiates loading of operators and rules', () => {
                const processType = 'process_type_1';
                const triggerType = 'record_after_save';
                const recordTriggerType = 'update';
                loadOperatorsAndRulesOnTriggerTypeChange(processType, triggerType, recordTriggerType);
                expect(loadRules).toBeCalledTimes(1);
                expect(loadRules).toBeCalledWith(processType, triggerType, recordTriggerType);
                expect(loadOperators).toBeCalledTimes(1);
                expect(loadOperators).toBeCalledWith(processType, triggerType, recordTriggerType);
            });
        });

        describe('loadOnTriggerTypeChange', () => {
            const processType = 'process_type_1';
            const triggerType = 'record_after_save';
            const recordTriggerType = 'update';
            it('initiates loading of invocable actions and palette', () => {
                loadOnTriggerTypeChange(processType, triggerType, recordTriggerType);
                expect(loadStandardActions).toBeCalledTimes(1);
                expect(loadStandardActions).toBeCalledWith(processType, triggerType);
                expect(loadDynamicActions).toBeCalledTimes(1);
                expect(loadDynamicActions).toBeCalledWith(processType, triggerType);
                expect(loadPalette).toBeCalledTimes(1);
                expect(loadPalette).toBeCalledWith(processType, triggerType);
            });

            it('initiates loading of peripheral metadata', async () => {
                loadOnStart();
                const promise = loadOnProcessTypeChange(
                    processType,
                    triggerType,
                    recordTriggerType
                ).loadPeripheralMetadataPromise;
                expect(promise).not.toBeNull();
                await promise;
                expect(promise).resolves.toEqual();
                expect(logPerfTransactionStart).toBeCalledWith(
                    SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                );
                expect(loadRules).toBeCalledTimes(1);
                expect(loadRules).toBeCalledWith(processType, triggerType, recordTriggerType);
                expect(loadOperators).toBeCalledTimes(1);
                expect(loadOperators).toBeCalledWith(processType, triggerType, recordTriggerType);
                expect(loadApexPlugins).toBeCalledTimes(1);
                expect(loadEventTypes).toBeCalledTimes(1);
                expect(loadEntities).toBeCalledWith('ALL');
                expect(loadResourceTypes).toBeCalledWith(processType);
                expect(loadProcessTypeFeatures).toBeCalledWith(processType);
                expect(loadGlobalVariables).toBeCalledWith(processType);
                expect(loadSystemVariables).toBeCalledWith(processType);
                expect(logPerfTransactionEnd).toBeCalledWith(
                    SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                );
            });
        });
    });
});
