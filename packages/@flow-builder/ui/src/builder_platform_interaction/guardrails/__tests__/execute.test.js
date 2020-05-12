// @ts-nocheck
import { FlowGuardrailsExecutor } from '../execute';
import { FlowDataProvider } from '../flowDataProvider/flowDataProvider';
import { FlowRuleFactory } from '../flowRules';
import { mockEngineExecute, mockRegistryAddDataProvider, mockRegistryRegisterRules } from 'analyzer_framework/engine';
import { ContextInfo } from 'analyzer_framework/api';

jest.mock('../flowDataProvider/flowDataProvider');

describe('guardrails init', () => {
    it('init registry', () => {
        const executeInstance = new FlowGuardrailsExecutor();

        expect(executeInstance).toBeInstanceOf(FlowGuardrailsExecutor);
        expect(mockRegistryAddDataProvider).toHaveBeenCalledTimes(1);
        expect(mockRegistryAddDataProvider).toHaveBeenCalledWith('FLOW', expect.any(FlowDataProvider));
        expect(mockRegistryRegisterRules).toHaveBeenCalledTimes(1);
        expect(mockRegistryRegisterRules).toHaveBeenCalledWith(expect.any(FlowRuleFactory));
    });
});

describe('guardrails execute', () => {
    let executeInstance;
    let flowDataProviderMock;
    beforeEach(() => {
        executeInstance = new FlowGuardrailsExecutor();
        flowDataProviderMock = FlowDataProvider.mock.instances[0];
    });

    it('no data', () => {
        expect.assertions(2);
        const flow = undefined;
        return executeInstance.evaluate(flow).then(result => {
            expect(result).toEqual(null);
            expect(flowDataProviderMock.updateFlow).toHaveBeenCalledTimes(0);
        });
    });

    it('executing with result', () => {
        const flow = { fullName: 'flowId' };

        expect.assertions(4);

        const results = new Map();
        const resultData = [{ data: 'result1' }, { data: 'result2' }];
        results.set(flow.fullName, resultData);
        mockEngineExecute.mockReturnValue({ results });

        return executeInstance.evaluate(flow).then(guardrailResults => {
            expect(flowDataProviderMock.updateFlow).toHaveBeenCalledTimes(1);
            expect(flowDataProviderMock.updateFlow).toHaveBeenCalledWith(flow);

            expect(mockEngineExecute).toHaveBeenCalledWith([new ContextInfo('FLOW')]);

            const result = guardrailResults.results.get(flow.fullName);
            expect(result).toEqual(resultData);
        });
    });
});
