// @ts-nocheck
import { initializeLoader, loadOnStart, loadOnProcessTypeChange, clearLoader } from '../loader';
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

jest.mock('builder_platform_interaction/actions');
jest.mock('builder_platform_interaction/apexTypeLib');

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn().mockResolvedValue({}),
        getAuraCallback: callback => callback
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
