import {
    createVariable,
    createVariableForStore,
    createVariableMetadataObject
} from '../variable';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const storeVariableWithDefaultValueAsString = {
    name: 'Var1',
    description: 'This is description',
    elementType: ELEMENT_TYPE.VARIABLE,
    isCollection: false,
    isInput: false,
    isOutput: false,
    dataType: 'String',
    subtype: null,
    scale: 0,
    defaultValue: 'Hello {!var_guid}',
    defaultValueDataType: 'String'
};

const storeVariableWithDefaultValueAsReference = {
    name: 'Var2',
    description: 'This is description',
    elementType: ELEMENT_TYPE.VARIABLE,
    isCollection: false,
    isInput: false,
    isOutput: false,
    dataType: 'String',
    subtype: null,
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
                elementType: ELEMENT_TYPE.VARIABLE,
                isCollection: false,
                isInput: false,
                isOutput: false,
                dataType: null,
                subtype: null,
                scale: 2,
                defaultValue: null,
                defaultValueDataType: null
            };
            const actualResult = createVariable();
            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('when existing variable is passed', () => {
            it('returns a new variable object with same value', () => {
                const actualResult = createVariable(
                    storeVariableWithDefaultValueAsString
                );
                expect(actualResult).toMatchObject(
                    storeVariableWithDefaultValueAsString
                );
            });
            it('returns a new variable object', () => {
                const actualResult = createVariable(
                    storeVariableWithDefaultValueAsString
                );
                expect(actualResult).not.toBe(
                    storeVariableWithDefaultValueAsString
                );
            });
        });
    });
    describe('createVariableForStore function', () => {
        describe('variable metadata is passed', () => {
            it('return a new variable object when variable has default value of type string value', () => {
                const { elements } = createVariableForStore(
                    variableFlowMetadataWithDefaultValueAsString
                );
                expect(Object.values(elements)[0]).toMatchObject(
                    storeVariableWithDefaultValueAsString
                );
            });
            it('return a new variable object when variable has default value of type element references value', () => {
                const { elements } = createVariableForStore(
                    variableFlowMetadataWithDefaultValueAsReference
                );
                expect(Object.values(elements)[0]).toMatchObject(
                    storeVariableWithDefaultValueAsReference
                );
            });
        });
    });
    describe('createVariableMetadataObject function', () => {
        describe('variable is passed', () => {
            it('return a new metadata object when variable has default value of type string value', () => {
                const actualResult = createVariableMetadataObject(
                    storeVariableWithDefaultValueAsString
                );
                expect(actualResult).toMatchObject(
                    variableFlowMetadataWithDefaultValueAsString
                );
            });
            it('return a new metadata object when variable has default value of type reference value', () => {
                const actualResult = createVariableMetadataObject(
                    storeVariableWithDefaultValueAsReference
                );
                expect(actualResult).toMatchObject(
                    variableFlowMetadataWithDefaultValueAsReference
                );
            });
        });
    });
});
