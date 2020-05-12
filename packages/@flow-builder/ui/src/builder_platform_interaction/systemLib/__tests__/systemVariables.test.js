// @ts-nocheck
import { setSystemVariables, getSystemVariables, resetSystemVariables } from '../systemVariables';
import { systemVariablesForFlow } from 'serverData/GetSystemVariables/systemVariablesForFlow.json';
import { systemVariablesForAutoLaunchedFlow } from 'serverData/GetSystemVariables/systemVariablesForAutoLaunchedFlow.json';

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

            systemVariablesForFlow.forEach(systemVariable => {
                expect(getSystemVariables(`$${systemVariable.category}.${systemVariable.devName}`)).not.toEqual({});
            });
        });
    });
});
