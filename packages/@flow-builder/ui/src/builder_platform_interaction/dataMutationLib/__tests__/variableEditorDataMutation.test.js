import {
    mutateVariableOrConstant,
    deMutateVariableOrConstant,
} from '../variableConstantEditorDataMutation';
import { mutateFEROV, deMutateFEROV } from '../ferovEditorDataMutation';
import { elements, stringVariableGuid } from "mock/storeData";
import { deepCopy } from "builder_platform_interaction/storeLib";

jest.mock('builder_platform_interaction-store-lib', () => {
    return {
        'deepCopy': require.requireActual('builder_platform_interaction-store-lib').deepCopy,
    };
});

jest.mock('../ferovEditorDataMutation', () => {
    return {
        'mutateFEROV': jest.fn(),
        'deMutateFEROV': jest.fn(),
    };
});

const expectedParams = {
    valueProperty: 'defaultValue',
    dataTypeProperty: 'ferovDataType',
};

describe('mutateVariableOrConstant function', () => {
    it('mutates the FEROV', () => {
        const stringVariable = deepCopy(elements[stringVariableGuid]);
        mutateVariableOrConstant(stringVariable);
        expect(mutateFEROV).toHaveBeenCalledTimes(1);
        expect(mutateFEROV).toHaveBeenCalledWith(stringVariable, 'value', expectedParams);
    });
});


describe('deMutateVariableOrConstant function', () => {
    it('deMutates the FEROV', () => {
        const stringVariable = deepCopy(elements[stringVariableGuid]);
        deMutateVariableOrConstant(stringVariable);
        expect(deMutateFEROV).toHaveBeenCalledTimes(1);
        expect(deMutateFEROV).toHaveBeenCalledWith(stringVariable, 'value', expectedParams);
    });
});