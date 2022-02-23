import { FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { getProcessType } from 'builder_platform_interaction/storeUtils';
import { processTypes } from 'serverData/GetProcessTypes/processTypes.json';
import {
    getProcessTypesWithIcons,
    getProcessTypeTransactionControlledActionsSupport,
    isAutoLayoutCanvasOnly,
    isNonOrchestratorRecordTriggeredFlow
} from '../processTypeUtils';

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn()
    };
});

describe('processTypesUtils', () => {
    test('No filtering: all process types returned', () => {
        const actualResult = getProcessTypesWithIcons(processTypes);
        expect(actualResult).toHaveLength(processTypes.length);
    });
    test('Icon fetched (NO fallback)', () => {
        const actualResult = getProcessTypesWithIcons(processTypes);
        expect(actualResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: 'User Provisioning Flow',
                    name: FLOW_PROCESS_TYPE.USER_PROVISIONING_FLOW,
                    iconName: 'utility:user'
                })
            ])
        );
    });
    test('Default icon fetched (fallback)', () => {
        const processTypesWithUnknown = [...processTypes, { label: 'Well no icon yet', name: 'WeDoNotKnowYou' }];
        const actualResult = getProcessTypesWithIcons(processTypesWithUnknown);
        expect(actualResult).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    label: 'Well no icon yet',
                    name: 'WeDoNotKnowYou',
                    iconName: 'utility:flow'
                })
            ])
        );
    });
});

jest.mock('builder_platform_interaction/systemLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return {
        getProcessFeatures: (processType) => {
            if (processType === 'Flow') {
                return [actual.FLOW_PROCESS_TYPE_FEATURE.TRANSACTION_CONTROLLED_ACTIONS];
            }
            return [];
        }
    };
});

describe('transaction controlled actions', () => {
    test('When processType supports TransactionControlledActions, helper function should return true', () => {
        const isSupported = getProcessTypeTransactionControlledActionsSupport(FLOW_PROCESS_TYPE.FLOW);
        expect(isSupported).toBe(true);
    });
    test('When processType does not support TransactionControlledActions, helper function should return false', () => {
        const isSupported = getProcessTypeTransactionControlledActionsSupport(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        expect(isSupported).toBe(false);
    });
});

describe('isAutoLayoutCanvasOnly', () => {
    test('returns true only for app process', () => {
        const isSupported = isAutoLayoutCanvasOnly(FLOW_PROCESS_TYPE.ORCHESTRATOR);
        expect(isSupported).toBe(true);
    });
    test('returns false for other process types', () => {
        const isSupported = isAutoLayoutCanvasOnly(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
        expect(isSupported).toBe(false);
    });
});

describe('isRecordTriggeredFlowOnly function', () => {
    it('return true if processType is AutoLaunchedFlow and triggerType is AfterSave', () => {
        expect(
            isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.AFTER_SAVE, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW)
        ).toBeTruthy();
    });

    it('return false if processType is AutoLaunchedFlow and triggerType is None', () => {
        expect(
            isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.NONE, FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW)
        ).toBeFalsy();
    });

    it('return false if processType is not AutoLaunchedFlow', () => {
        expect(
            isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.AFTER_SAVE, FLOW_PROCESS_TYPE.ORCHESTRATOR)
        ).toBeFalsy();
    });

    describe('if processType is not provided, call getProcessType', () => {
        it('return true if return value of getProcessType is AutoLaunchedFlow', () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
            expect(isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.AFTER_SAVE)).toBeTruthy();
        });
        it('return false if return value of getProcessType is not AutoLaunchedFlow', () => {
            getProcessType.mockReturnValue(FLOW_PROCESS_TYPE.ORCHESTRATOR);
            expect(isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.AFTER_SAVE)).toBeFalsy();
        });
        it('return false if value of getProcessType is null', () => {
            getProcessType.mockReturnValue(null);
            expect(isNonOrchestratorRecordTriggeredFlow(FLOW_TRIGGER_TYPE.AFTER_SAVE)).toBeFalsy();
        });
    });
});
