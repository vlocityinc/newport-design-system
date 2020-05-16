// @ts-nocheck
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    loadActions,
    loadEventTypes,
    loadEntities,
    loadWorkflowEnabledEntities,
    loadGlobalVariables,
    loadSystemVariables,
    loadProcessTypeFeatures
} from '../dataForProcessType';
import { setInvocableActions } from 'builder_platform_interaction/invocableActionLib';
import { setEventTypes, setEntities, setWorkflowEnabledEntities } from 'builder_platform_interaction/sobjectLib';
import { setGlobalVariables, setSystemVariables, setProcessTypeFeature } from 'builder_platform_interaction/systemLib';
import { getGlobalVariableTypeComboboxItems } from 'builder_platform_interaction/expressionUtils';

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        fetchOnce: jest.fn(),
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        setEntities: jest.fn(),
        setEventTypes: jest.fn(),
        setWorkflowEnabledEntities: jest.fn(),
        RUNTIME: jest.requireActual('builder_platform_interaction/sobjectLib').RUNTIME
    };
});

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        setInvocableActions: jest.fn()
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        setGlobalVariables: jest.fn(),
        setSystemVariables: jest.fn(),
        setProcessTypeFeature: jest.fn()
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    return {
        getGlobalVariableTypeComboboxItems: jest.fn().mockReturnValue([]),
        getFlowSystemVariableComboboxItem: jest.fn().mockReturnValue({})
    };
});

jest.mock('builder_platform_interaction/comboboxCache', () => {
    return {
        addToParentElementCache: jest.fn()
    };
});

describe('dataForProcessType', () => {
    describe('load actions', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('actions');
            await loadActions('a');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS,
                { flowProcessType: 'a' },
                expect.anything()
            );
            expect(setInvocableActions).toBeCalledTimes(1);
            expect(setInvocableActions).toBeCalledWith('actions');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadActions('a')).rejects.toEqual('error');
            expect(setInvocableActions).toBeCalledTimes(0);
        });
    });

    describe('load event types', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('event types');
            await loadEventTypes();
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_EVENT_TYPES,
                { eventType: 'Runtime' },
                expect.anything()
            );
            expect(setEventTypes).toBeCalledTimes(1);
            expect(setEventTypes).toBeCalledWith('event types', 'Runtime');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadEventTypes('a')).rejects.toEqual('error');
            expect(setEventTypes).toBeCalledTimes(0);
        });
    });

    describe('load entities', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('entities');
            await loadEntities();
            expect(fetchOnce).toBeCalledWith(SERVER_ACTION_TYPE.GET_ENTITIES, {}, expect.anything());
            expect(setEntities).toBeCalledTimes(1);
            expect(setEntities).toBeCalledWith('entities');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadEntities('a')).rejects.toEqual('error');
            expect(setEntities).toBeCalledTimes(0);
        });
    });

    describe('load workflow-enabled entities', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('entities');
            await loadWorkflowEnabledEntities();
            expect(fetchOnce).toBeCalledWith(SERVER_ACTION_TYPE.GET_WORKFLOW_ENABLED_ENTITIES, {}, expect.anything());
            expect(setWorkflowEnabledEntities).toBeCalledTimes(1);
            expect(setWorkflowEnabledEntities).toBeCalledWith('entities');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadWorkflowEnabledEntities('a')).rejects.toEqual('error');
            expect(setWorkflowEnabledEntities).toBeCalledTimes(0);
        });
    });

    describe('load global variables', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('global variables');
            await loadGlobalVariables('a');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_ALL_GLOBAL_VARIABLES,
                { flowProcessType: 'a' },
                expect.anything()
            );
            expect(setGlobalVariables).toBeCalledTimes(1);
            expect(getGlobalVariableTypeComboboxItems).toBeCalledTimes(1);
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadGlobalVariables('a')).rejects.toEqual('error');
            expect(setGlobalVariables).toBeCalledTimes(0);
            expect(getGlobalVariableTypeComboboxItems).toBeCalledTimes(0);
        });
    });

    describe('load system variables', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('system variables');
            await loadSystemVariables('a');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_SYSTEM_VARIABLES,
                { flowProcessType: 'a' },
                expect.anything()
            );
            expect(setSystemVariables).toBeCalledTimes(1);
            expect(setSystemVariables).toBeCalledWith('system variables');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadSystemVariables('a')).rejects.toEqual('error');
            expect(setSystemVariables).toBeCalledTimes(0);
        });
    });

    describe('load process type features', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('features');
            await loadProcessTypeFeatures('a');
            expect(fetchOnce).toBeCalledWith(SERVER_ACTION_TYPE.GET_PROCESS_TYPE_FEATURES, {
                flowProcessType: 'a'
            });
            expect(setProcessTypeFeature).toBeCalledTimes(1);
            expect(setProcessTypeFeature).toBeCalledWith('a', 'features');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadProcessTypeFeatures('a')).rejects.toEqual('error');
            expect(setProcessTypeFeature).toBeCalledTimes(0);
        });
    });
});
