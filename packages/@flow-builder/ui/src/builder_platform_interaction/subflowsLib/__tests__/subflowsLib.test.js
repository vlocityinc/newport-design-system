import { getActiveOrLatestInputOutputVariables } from '../subflowsLib';
import { flowWithActiveAndLatest } from 'serverData/GetFlowInputOutputVariables/flowWithActiveAndLatest.json';
import { flowWithNoActiveVersion } from 'serverData/GetFlowInputOutputVariables/flowWithNoActiveVersion.json';
import { flowWithNoInputOutputVariables } from 'serverData/GetFlowInputOutputVariables/flowWithNoInputOutputVariables.json';

describe('subflowsLib', () => {
    describe('getActiveOrLatestInputOutputVariables', () => {
        const getVariableWithApiName = (variables, apiName) => variables.find(variable => variable.apiName === apiName);
        it('returns the latest version variables when there is no active version', () => {
            const inputOutputVariables = getActiveOrLatestInputOutputVariables(flowWithNoActiveVersion);
            const variable = getVariableWithApiName(inputOutputVariables.outputVariables, 'output1');
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
        it('returns the active version variables when there is an active version', () => {
            const inputOutputVariables = getActiveOrLatestInputOutputVariables(flowWithActiveAndLatest);
            expect(inputOutputVariables.outputVariables).toEqual([
                expect.objectContaining({ apiName: 'accountOutput' }),
                expect.objectContaining({ apiName: 'accountOutputCollection' }),
                expect.objectContaining({ apiName: 'carOutput' }),
                expect.objectContaining({ apiName: 'carOutputCollection' }),
                expect.objectContaining({ apiName: 'inputOutput1' }),
                expect.objectContaining({ apiName: 'inputOutput2' }),
                expect.objectContaining({ apiName: 'output1' }),
                expect.objectContaining({ apiName: 'output2' }),
                expect.objectContaining({ apiName: 'output3' })
            ]);
        });
        it('returns no variables when there are no input output variables in the subflow', () => {
            const inputOutputVariables = getActiveOrLatestInputOutputVariables(flowWithNoInputOutputVariables);
            expect(inputOutputVariables.inputVariables).toEqual([]);
            expect(inputOutputVariables.outputVariables).toEqual([]);
        });
        it('returns a input/output variable in both inputVariables and outputVariables', () => {
            const inputOutputVariables = getActiveOrLatestInputOutputVariables(flowWithActiveAndLatest);
            const inputVariable = getVariableWithApiName(inputOutputVariables.inputVariables, 'inputOutput2');
            const outputVariable = getVariableWithApiName(inputOutputVariables.outputVariables, 'inputOutput2');
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
                scale: 0
            });
        });
    });
});
