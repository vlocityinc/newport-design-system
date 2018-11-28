import { createVariable, createVariableForStore, createVariableMetadataObject } from '../variable';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const variableWithDefaultValueAsString = {
    name: 'Var1',
    description: 'This is description',
    elementType: 'VARIABLE',
    isCollection: false,
    isInput: false,
    isOutput: false,
    dataType: 'String',
    objectType: null,
    scale: 0,
    defaultValue: 'Hello {!var_guid}',
    defaultValueDataType: 'String'
};

const variableWithDefaultValueAsReference = {
    name: 'Var2',
    description: 'This is description',
    elementType: 'VARIABLE',
    isCollection: false,
    isInput: false,
    isOutput: false,
    dataType: 'String',
    objectType: null,
    scale: 0,
    defaultValue: 'var',
    defaultValueDataType: 'reference'
};

const variableFlowMetadataWithDefaultValueAsString = {
    dataType: 'String',
    isCollection: false,
    isInput: false,
    isOutput: false,
    name: 'Var1',
    scale: 0,
    description: 'This is description',
    value: {
        stringValue: 'Hello {!var_guid}'
    }
};

const variableFlowMetadataWithDefaultValueAsReference = {
    dataType: 'String',
    isCollection: false,
    isInput: false,
    isOutput: false,
    name: 'Var2',
    scale: 0,
    description: 'This is description',
    value: {
        elementReference: 'var'
    }
};

describe('Variable:', () => {
    describe('createVariable function', () => {
        it('returns a new variable object when no argument is passed', () => {
            const expectedResult = {
                name: '',
                description: '',
                elementType: 'VARIABLE',
                isCollection: false,
                isInput: false,
                isOutput: false,
                dataType: null,
                objectType: null,
                scale: 2,
                defaultValue: null,
                defaultValueDataType: null
            };
            const actualResult = createVariable();
            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('when existing variable is passed', () => {
            it('returns a new variable object with same value', () => {
                const actualResult = createVariable(variableWithDefaultValueAsString);
                expect(actualResult).toMatchObject(variableWithDefaultValueAsString);
            });
            it('returns a new variable object', () => {
                const actualResult = createVariable(variableWithDefaultValueAsString);
                expect(actualResult).not.toBe(variableWithDefaultValueAsString);
            });
        });
    });
    describe('createVariableForStore function', () => {
        describe('variable metadata is passed', () => {
            it('return a new variable object when variable has default value of type string value', () => {
                const { elements } = createVariableForStore(variableFlowMetadataWithDefaultValueAsString);
                expect(Object.values(elements)[0]).toMatchObject(variableWithDefaultValueAsString);
            });
            it('return a new variable object when variable has default value of type element references value', () => {
                const { elements } = createVariableForStore(variableFlowMetadataWithDefaultValueAsReference);
                expect(Object.values(elements)[0]).toMatchObject(variableWithDefaultValueAsReference);
            });
        });
    });
    describe('createVariableMetadataObject function', () => {
        describe('variable is passed', () => {
            it('return a new metadata object when variable has default value of type string value', () => {
                const actualResult = createVariableMetadataObject(variableWithDefaultValueAsString);
                expect(actualResult).toMatchObject(variableFlowMetadataWithDefaultValueAsString);
            });
            it('return a new metadata object when variable has default value of type reference value', () => {
                const actualResult = createVariableMetadataObject(variableWithDefaultValueAsReference);
                expect(actualResult).toMatchObject(variableFlowMetadataWithDefaultValueAsReference);
            });
        });
    });
});


