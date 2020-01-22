import { getMergedInputOutputVariables } from '../subflowVariablesMerger';
import { flowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';

describe('subflowVariablesMerger', () => {
    describe('merges latest and active version', () => {
        const getVariableWithApiName = (variables, apiName) =>
            variables.find(variable => variable.apiName === apiName);
        let inputOutputVariables;
        beforeAll(() => {
            inputOutputVariables = getMergedInputOutputVariables(
                flowWithActiveAndLatest
            );
        });
        it('returns no warning for a variable that is both in active and latest', () => {
            const variable = getVariableWithApiName(
                inputOutputVariables.outputVariables,
                'output1'
            );
            expect(variable).toEqual({
                apiName: 'output1',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: true,
                name: 'output1',
                scale: 0
            });
        });
        it('returns a warning for a variable that is only in active', () => {
            const variable = getVariableWithApiName(
                inputOutputVariables.outputVariables,
                'output2'
            );
            expect(variable).toEqual({
                apiName: 'output2',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: true,
                name: 'output2',
                scale: 0,
                mergeWarning: 'onlyAvailableInActive'
            });
        });
        it('returns a warning for a variable that is only in latest', () => {
            const variable = getVariableWithApiName(
                inputOutputVariables.outputVariables,
                'output4'
            );
            expect(variable).toEqual({
                apiName: 'output4',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: true,
                name: 'output4',
                scale: 0,
                mergeWarning: 'onlyAvailableInLatest'
            });
        });
        it('returns a warning for a variable that has its type changed between active and latest', () => {
            const variable = getVariableWithApiName(
                inputOutputVariables.outputVariables,
                'output3'
            );
            expect(variable).toEqual({
                apiName: 'output3',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: true,
                name: 'output3',
                scale: 0,
                mergeWarning: 'dataTypeChanged'
            });
        });
        it('returns a input/output variable in both inputVariables and outputVariables, possibly with a different warning', () => {
            const inputVariable = getVariableWithApiName(
                inputOutputVariables.inputVariables,
                'inputOutput2'
            );
            const outputVariable = getVariableWithApiName(
                inputOutputVariables.outputVariables,
                'inputOutput2'
            );
            expect(inputVariable).toEqual({
                apiName: 'inputOutput2',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                name: 'inputOutput2',
                scale: 0
            });
            expect(outputVariable).toEqual({
                apiName: 'inputOutput2',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                name: 'inputOutput2',
                scale: 0,
                mergeWarning: 'onlyAvailableInActive'
            });
        });
    });
});
