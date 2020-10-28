// @ts-nocheck
import { setSystemVariables, getSystemVariables, resetSystemVariables } from '../systemVariables';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { systemVariablesForAutoLaunchedFlow } from 'serverData/GetSystemVariables/systemVariablesForAutoLaunchedFlow.json';
import { startElement as recordTriggeredStartElement } from 'mock/storeDataRecordTriggered';
import { startElement as screenFlowStartElement } from 'mock/storeData';
import { getStartElementFromState } from 'builder_platform_interaction/storeUtils';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getStartElementFromState: jest.fn().mockImplementation(() => {})
    };
});

describe('system Variables', () => {
    describe('setSystemVariables', () => {
        afterEach(() => {
            resetSystemVariables();
        });
        it('does not modify given data', () => {
            const originalVariables = [
                {
                    category: 'Flow',
                    dataType: 'String',
                    devName: 'ActiveStages',
                    elementType: 'STAGE',
                    isAssignable: true,
                    isAvailableInBuilder: true,
                    isCollection: true
                },
                {
                    category: 'Flow',
                    dataType: 'Date',
                    devName: 'CurrentDate',
                    isAssignable: false,
                    isAvailableInBuilder: true,
                    isCollection: false
                }
            ];

            setSystemVariables(originalVariables);

            expect(originalVariables).toEqual([
                {
                    category: 'Flow',
                    dataType: 'String',
                    devName: 'ActiveStages',
                    elementType: 'STAGE',
                    isAssignable: true,
                    isAvailableInBuilder: true,
                    isCollection: true
                },
                {
                    category: 'Flow',
                    dataType: 'Date',
                    devName: 'CurrentDate',
                    isAssignable: false,
                    isAvailableInBuilder: true,
                    isCollection: false
                }
            ]);
        });
        it('does not set Record variable', () => {
            setSystemVariables(systemVariablesForAutoLaunchedFlow);

            expect(getSystemVariables('$Record')).toEqual({});
        });
        it('sets variables', () => {
            setSystemVariables(systemVariablesForFlow);

            systemVariablesForFlow.forEach((systemVariable) => {
                expect(getSystemVariables(`$${systemVariable.category}.${systemVariable.devName}`)).not.toEqual({});
            });
        });
    });
    describe('getSystemVariables', () => {
        beforeAll(() => {
            setSystemVariables(systemVariablesForAutoLaunchedFlow);
        });
        afterAll(() => {
            resetSystemVariables();
        });
        it('does not return $Record__Prior if flow is not a Record-Triggered Flow', () => {
            getStartElementFromState.mockImplementationOnce(() => screenFlowStartElement);
            const recordPriorVariable = getSystemVariables('$Record__Prior').$Record__Prior;
            expect(recordPriorVariable).toBeUndefined();
        });
        it('returns $Record__Prior for Record-Triggered Flow and the trigger fires on an Update', () => {
            getStartElementFromState.mockImplementationOnce(() => ({
                ...recordTriggeredStartElement,
                recordTriggerType: 'Update'
            }));
            const recordPriorVariable = getSystemVariables('$Record__Prior').$Record__Prior;
            expect(recordPriorVariable).toMatchObject({
                dataType: 'SObject',
                subtype: 'Account',
                name: '$Record__Prior'
            });
        });
        it('returns $Record__Prior for Record-Triggered Flow and the trigger fires on an Create/Update', () => {
            getStartElementFromState.mockImplementationOnce(() => ({
                ...recordTriggeredStartElement,
                recordTriggerType: 'CreateAndUpdate'
            }));
            const recordPriorVariable = getSystemVariables('$Record__Prior').$Record__Prior;
            expect(recordPriorVariable).toMatchObject({
                dataType: 'SObject',
                subtype: 'Account',
                name: '$Record__Prior'
            });
        });
        it('does not return $Record__Prior for Record-Triggered Flow if trigger fires on Create', () => {
            getStartElementFromState.mockImplementationOnce(() => ({
                ...recordTriggeredStartElement,
                recordTriggerType: 'Create'
            }));
            const recordPriorVariable = getSystemVariables('$Record__Prior').$Record__Prior;
            expect(recordPriorVariable).toBeUndefined();
        });
    });
});
