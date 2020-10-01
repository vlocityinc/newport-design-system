// @ts-nocheck
import { getProcessTypesWithIcons, getProcessTypeTransactionControlledActionsSupport } from '../processTypeUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MOCK_ALL_PROCESS_TYPES } from 'mock/processTypesData';

const getProcessTypesWithIconsWithProcessTypes = getProcessTypesWithIcons.bind(null, MOCK_ALL_PROCESS_TYPES);

describe('processTypesUtils', () => {
    test('No filtering: all process types returned', () => {
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
        expect(actualResult).toHaveLength(MOCK_ALL_PROCESS_TYPES.length);
    });
    test('Icon fetched (NO fallback)', () => {
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
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
        const actualResult = getProcessTypesWithIconsWithProcessTypes();
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
