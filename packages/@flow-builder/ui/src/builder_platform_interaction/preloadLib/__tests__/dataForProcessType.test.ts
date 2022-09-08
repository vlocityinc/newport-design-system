// @ts-nocheck
import { getGlobalVariableTypeComboboxItems } from 'builder_platform_interaction/expressionUtils';
import {
    setDynamicInvocableActions,
    setStandardInvocableActions
} from 'builder_platform_interaction/invocableActionLib';
import { setOperators, setRules } from 'builder_platform_interaction/ruleLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { setEntities, setEventTypes, setWorkflowEnabledEntities } from 'builder_platform_interaction/sobjectLib';
import { setSubflows } from 'builder_platform_interaction/subflowsLib';
import { setGlobalVariables, setProcessTypeFeatures, setSystemVariables } from 'builder_platform_interaction/systemLib';
import {
    loadDynamicActions,
    loadEntities,
    loadEventTypes,
    loadGlobalVariables,
    loadOperators,
    loadProcessTypeFeatures,
    loadRules,
    loadStandardActions,
    loadSubflows,
    loadSystemVariables,
    loadWorkflowEnabledEntities
} from '../dataForProcessType';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

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

jest.mock('builder_platform_interaction/subflowsLib', () => {
    return {
        setSubflows: jest.fn()
    };
});

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        setDynamicInvocableActions: jest.fn(),
        setStandardInvocableActions: jest.fn()
    };
});

jest.mock('builder_platform_interaction/systemLib', () => {
    return {
        setGlobalVariables: jest.fn(),
        setSystemVariables: jest.fn(),
        setProcessTypeFeatures: jest.fn()
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

jest.mock('builder_platform_interaction/ruleLib', () => {
    return {
        setRules: jest.fn(),
        setOperators: jest.fn()
    };
});

describe('dataForProcessType', () => {
    describe('load standard actions', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('actions');
            await loadStandardActions('a');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_STANDARD_INVOCABLE_ACTIONS,
                { flowProcessType: 'a' },
                expect.anything()
            );
            expect(setStandardInvocableActions).toBeCalledTimes(1);
            expect(setStandardInvocableActions).toBeCalledWith('actions');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadStandardActions('a')).rejects.toEqual('error');
            expect(setStandardInvocableActions).toBeCalledTimes(0);
        });
    });

    describe('load dynamic actions', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('actions');
            await loadDynamicActions('a');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_DYNAMIC_INVOCABLE_ACTIONS,
                { flowProcessType: 'a' },
                expect.anything()
            );
            expect(setDynamicInvocableActions).toBeCalledTimes(1);
            expect(setDynamicInvocableActions).toBeCalledWith('actions');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadDynamicActions('a')).rejects.toEqual('error');
            expect(setDynamicInvocableActions).toBeCalledTimes(0);
        });
    });

    describe('load subflows', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('subflows');
            await loadSubflows('s', 't');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_SUBFLOWS,
                { flowProcessType: 's', flowTriggerType: 't' },
                expect.anything()
            );
            expect(setSubflows).toBeCalledTimes(1);
            expect(setSubflows).toBeCalledWith('subflows');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadSubflows('s', 't')).rejects.toEqual('error');
            expect(setSubflows).toBeCalledTimes(0);
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
            expect(setProcessTypeFeatures).toBeCalledTimes(1);
            expect(setProcessTypeFeatures).toBeCalledWith('a', 'features');
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadProcessTypeFeatures('a')).rejects.toEqual('error');
            expect(setProcessTypeFeatures).toBeCalledTimes(0);
        });
    });

    describe('load operators', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('operators');
            await loadOperators('AutoLaunchedFlow', 'RecordAfterSave', 'Update');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_OPERATORS,
                {
                    flowProcessType: 'AutoLaunchedFlow',
                    flowTriggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update'
                },
                expect.anything()
            );
            expect(setOperators).toBeCalledTimes(1);
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadOperators('AutoLaunchedFlow', 'RecordAfterSave', 'Update')).rejects.toEqual('error');
            expect(setOperators).toBeCalledTimes(0);
        });
    });

    describe('load rules', () => {
        it('invokes call out and call back', async () => {
            fetchOnce.mockResolvedValue('rules');
            await loadRules('AutoLaunchedFlow', 'RecordAfterSave', 'Update');
            expect(fetchOnce).toBeCalledWith(
                SERVER_ACTION_TYPE.GET_RULES,
                {
                    flowProcessType: 'AutoLaunchedFlow',
                    flowTriggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update'
                },
                expect.anything()
            );
            expect(setRules).toBeCalledTimes(1);
        });

        it('does not invoke call back on error', async () => {
            fetchOnce.mockRejectedValue('error');
            await expect(loadRules('AutoLaunchedFlow', 'RecordAfterSave', 'Update')).rejects.toEqual('error');
            expect(setRules).toBeCalledTimes(0);
        });
    });
});
