import {
    mutateVariable,
    deMutateVariable,
} from '../variableEditorDataMutation';
import { mutateFEROV, deMutateFEROV } from '../ferovEditorDataMutation';
import { elements, stringVariableGuid } from 'mock-store-data';
import { deepCopy } from 'builder_platform_interaction-store-lib';

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

describe('mutateVariable function', () => {
    it('mutates the FEROV', () => {
        const stringVariable = deepCopy(elements[stringVariableGuid]);
        mutateVariable(stringVariable);
        expect(mutateFEROV).toHaveBeenCalledTimes(1);
        expect(mutateFEROV).toHaveBeenCalledWith(stringVariable, 'value', expectedParams);
    });
});


describe('deMutateVariable function', () => {
    it('deMutates the FEROV', () => {
        const stringVariable = deepCopy(elements[stringVariableGuid]);
        deMutateVariable(stringVariable);
        expect(deMutateFEROV).toHaveBeenCalledTimes(1);
        expect(deMutateFEROV).toHaveBeenCalledWith(stringVariable, 'value', expectedParams);
    });
});