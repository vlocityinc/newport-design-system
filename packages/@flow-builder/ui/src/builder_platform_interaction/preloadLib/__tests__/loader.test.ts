// @ts-nocheck
import {
    initializeLoader,
    loadOnStart,
    loadOnProcessTypeChange,
    clearLoader,
    loadApexClasses,
    GET_APEX_TYPES_TIMEOUT_MS
} from '../loader';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import {
    loadActions,
    loadApexPlugins,
    loadRules,
    loadOperators,
    loadEventTypes,
    loadEntities,
    loadResourceTypes,
    loadProcessTypeFeatures,
    loadGlobalVariables,
    loadSystemVariables,
    loadWorkflowEnabledEntities
} from '../dataForProcessType';
import { logPerfTransactionStart, logPerfTransactionEnd } from 'builder_platform_interaction/loggingUtils';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { ticks, makeQuerablePromise } from 'builder_platform_interaction/builderTestUtils';

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
        loadActions: jest.fn().mockResolvedValue('actions'),
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
        loadWorkflowEnabledEntities: jest.fn()
    };
});

jest.mock('builder_platform_interaction/loggingUtils', () => {
    return {
        logPerfTransactionStart: jest.fn(),
        logPerfTransactionEnd: jest.fn()
    };
});

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
        });

        describe('loadApexClasses', () => {
            let getApexTypesPromise;
            let loadEntitiesPromise;
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
                loadOnStart();
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
                loadOnStart();
                loadOnProcessTypeChange('process_type_1');
                loadEntitiesPromise.resolve();
                const loadApexTypePromise = makeQuerablePromise(loadApexClasses());
                getApexTypesPromise.reject(new Error('Error while retrieving apex types'));
                await ticks();
                await expect(loadApexTypePromise).rejects.toEqual(new Error('Error while retrieving apex types'));
            });
            it('returns a rejected promise if entities could not be retrieved', async () => {
                loadOnStart();
                loadOnProcessTypeChange('process_type_1');
                const loadApexTypePromise = loadApexClasses();
                loadEntitiesPromise.reject(new Error('Error while retrieving entities'));
                await ticks();
                await expect(loadApexTypePromise).rejects.toEqual(new Error('Error while retrieving entities'));
            });
            it('does not set apex classes until entities are loaded', async () => {
                loadOnStart();
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
        });

        describe('loadOnProcessTypeChange', () => {
            it('initiates loading of peripheral metadata', async () => {
                const processType = 'process_type_1';
                loadOnStart();
                const promise = loadOnProcessTypeChange(processType).loadPeripheralMetadataPromise;
                expect(promise).not.toBeNull();
                await promise;
                // Resolves to nothing currently in that there is no need to handle loaded data down in the promise chain.
                expect(promise).resolves.toEqual();
                expect(logPerfTransactionStart).toBeCalledWith(
                    SERVER_ACTION_TYPE.GET_PERIPHERAL_DATA_FOR_PROPERTY_EDITOR
                );
                expect(loadActions).toBeCalledWith(processType);
                expect(loadApexPlugins).toBeCalledTimes(1);
                expect(loadRules).toBeCalledTimes(1);
                expect(loadOperators).toBeCalledTimes(1);
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
    });
});
