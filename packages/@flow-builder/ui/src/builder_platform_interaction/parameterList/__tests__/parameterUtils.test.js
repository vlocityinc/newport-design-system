import { compareParamsByRequired, compareParamsByLabel } from "../parameterUtils";

describe('compareParamsByRequired', () => {
    it('sorts params by isRequired', () => {
        const params = [
            { name: 'param7', isRequired: true },
            { name: 'param8', isRequired: false },
            { name: 'param2', isRequired: false },
            { name: 'param1', isRequired: true },
            { name: 'param6', isRequired: false },
            { name: 'param5', isRequired: true },
            { name: 'param3', isRequired: true },
            { name: 'param4', isRequired: false }
        ];
        const expectedParams = [
            { name: 'param7', isRequired: true },
            { name: 'param1', isRequired: true },
            { name: 'param5', isRequired: true },
            { name: 'param3', isRequired: true },
            { name: 'param8', isRequired: false },
            { name: 'param2', isRequired: false },
            { name: 'param6', isRequired: false },
            { name: 'param4', isRequired: false }
        ];
        expect(params.sort(compareParamsByRequired)).toEqual(expectedParams);
    });
    it('sorts params when some of params do not have isRequired', () => {
        const params = [
            { name: 'param7', isRequired: true },
            { name: 'param8' },
            { name: 'param2', isRequired: false },
            { name: 'param1', isRequired: true },
            { name: 'param6' },
            { name: 'param5', isRequired: true },
            { name: 'param3', isRequired: true },
            { name: 'param4', isRequired: false }
        ];
        const expectedParams = [
            { name: 'param7', isRequired: true },
            { name: 'param1', isRequired: true },
            { name: 'param5', isRequired: true },
            { name: 'param3', isRequired: true },
            { name: 'param8' },
            { name: 'param2', isRequired: false },
            { name: 'param6' },
            { name: 'param4', isRequired: false },
        ];
        expect(params.sort(compareParamsByRequired)).toEqual(expectedParams);
    });
});
describe('compareParamsByLabel', () => {
    it('sorts params by label', () => {
        const params = [
            { name: 'param1', label: 'param 1' },
            { name: 'param2', label: 'param 5' },
            { name: 'param3', label: 'param 6' },
            { name: 'param4', label: 'param 2' },
            { name: 'param5', label: 'param 7' },
            { name: 'param6', label: 'param 3' },
            { name: 'param7', label: 'param 4' },
            { name: 'param8', label: 'param 8' }
        ];
        const expectedParams = [
            { name: 'param1', label: 'param 1' },
            { name: 'param4', label: 'param 2' },
            { name: 'param6', label: 'param 3' },
            { name: 'param7', label: 'param 4' },
            { name: 'param2', label: 'param 5' },
            { name: 'param3', label: 'param 6' },
            { name: 'param5', label: 'param 7' },
            { name: 'param8', label: 'param 8' }
        ];
        expect(params.sort(compareParamsByLabel)).toEqual(expectedParams);
    });
    it('sorts params by name', () => {
        const params = [
            { name: 'param1' },
            { name: 'param5' },
            { name: 'param6' },
            { name: 'param2' },
            { name: 'param7' },
            { name: 'param3' },
            { name: 'param4' },
            { name: 'param8' }
        ];
        const expectedParams = [
            { name: 'param1' },
            { name: 'param2' },
            { name: 'param3' },
            { name: 'param4' },
            { name: 'param5' },
            { name: 'param6' },
            { name: 'param7' },
            { name: 'param8' }
        ];
        expect(params.sort(compareParamsByLabel)).toEqual(expectedParams);
    });
    it('sorts params when some of params do not have label', () => {
        const params = [
            { name: 'param1', label: 'param 1' },
            { name: 'param5', label: 'param 5' },
            { name: 'param6', label: 'param 6' },
            { name: 'aparam' },
            { name: 'param7', label: 'param 7' },
            { name: 'param3', label: 'param 3' },
            { name: 'param4' },
            { name: 'param2' }
        ];
        const expectedParams = [
            { name: 'aparam' },
            { name: 'param1', label: 'param 1' },
            { name: 'param3', label: 'param 3' },
            { name: 'param5', label: 'param 5' },
            { name: 'param6', label: 'param 6' },
            { name: 'param7', label: 'param 7' },
            { name: 'param2' },
            { name: 'param4' }
        ];
        expect(params.sort(compareParamsByLabel)).toEqual(expectedParams);
    });
});