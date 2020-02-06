import { FlowGuardrailsExecutor } from '../execute';
import { FlowDataProvider } from '../flowDataProvider';
import { FlowRuleFactory } from '../flowRules';
import { mockEngineExecute, mockRegistryAddDataProvider, mockRegistryRegisterRules } from 'analyzer_framework/engine';

jest.mock('../flowDataProvider');

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

        expect.assertions(8);

        const results = new Map();
        results.set('flowId', [{ data: 'result1' }, { data: 'result2' }]);
        mockEngineExecute.mockReturnValue({ results });

        return executeInstance.evaluate(flow).then(result => {
            expect(flowDataProviderMock.updateFlow).toHaveBeenCalledWith(flow);
            expect(flowDataProviderMock.updateFlow).toHaveBeenCalledTimes(1);

            expect(mockEngineExecute).toHaveBeenCalledWith(['FLOW']);

            expect(result).toHaveLength(2);
            expect(result[0].id).toEqual(0);
            expect(result[0].data).toEqual('result1');
            expect(result[1].id).toEqual(1);
            expect(result[1].data).toEqual('result2');
        });
    });
});
