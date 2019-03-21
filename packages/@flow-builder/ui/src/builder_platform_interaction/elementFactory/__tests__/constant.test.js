import { createConstant, createConstantForStore, createConstantMetadataObject } from '../constant';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const constantWithDefaultValueAsString = {
    name: "const1",
    description: "This is description",
    elementType: ELEMENT_TYPE.CONSTANT,
    dataType: "String",
    defaultValue: "Hello {!var_guid}",
    defaultValueDataType: "String"
};

const constantWithDefaultValueAsReference = {
    name: "const1",
    description: "This is description",
    elementType: ELEMENT_TYPE.CONSTANT,
    dataType: "String",
    defaultValue: "var_guid",
    defaultValueDataType: "reference"
};

const constantFlowMetadataWithDefaultValueAsString = {
    dataType: "String",
    description: "This is description",
    name: "const1",
    value: {
        stringValue: "Hello {!var_guid}"
    }
};

const constantFlowMetadataWithDefaultValueAsReference = {
    dataType: "String",
    description: "This is description",
    name: "const1",
    value: {
        elementReference: "var_guid"
    }
};

describe('Constant:', () => {
    describe('createConstant function', () => {
        it('returns a new constant object when no argument is passed', () => {
            const expectedResult = {
                name: '',
                description: '',
                elementType: ELEMENT_TYPE.CONSTANT,
                dataType: null,
                defaultValue: null,
                defaultValueDataType: null
            };
            const actualResult = createConstant();
            expect(actualResult).toMatchObject(expectedResult);
        });
        describe('when existing constant is passed', () => {
            it('returns a new constant object with same value', () => {
                const actualResult = createConstant(constantWithDefaultValueAsString);
                expect(actualResult).toMatchObject(constantWithDefaultValueAsString);
            });
            it('returns a new constant object', () => {
                const actualResult = createConstant(constantWithDefaultValueAsString);
                expect(actualResult).not.toBe(constantWithDefaultValueAsString);
            });
        });
    });
    describe('createConstantForStore function', () => {
        describe('constant metadata is passed', () => {
            it('return a new constant object when constant has default value of type string value', () => {
                const { elements } = createConstantForStore(constantFlowMetadataWithDefaultValueAsString);
                expect(Object.values(elements)[0]).toMatchObject(constantWithDefaultValueAsString);
            });
            it('return a new constant object when constant has default value of type element references value', () => {
                const { elements } = createConstantForStore(constantFlowMetadataWithDefaultValueAsReference);
                expect(Object.values(elements)[0]).toMatchObject(constantWithDefaultValueAsReference);
            });
        });
    });
    describe('createConstantMetadataObject function', () => {
        describe('constant is passed', () => {
            it('return a new metadata object when constant has default value of type string value', () => {
                const actualResult = createConstantMetadataObject(constantWithDefaultValueAsString);
                expect(actualResult).toMatchObject(constantFlowMetadataWithDefaultValueAsString);
            });
            it('return a new metadata object when constant has default value of type reference value', () => {
                const actualResult = createConstantMetadataObject(constantWithDefaultValueAsReference);
                expect(actualResult).toMatchObject(constantFlowMetadataWithDefaultValueAsReference);
            });
        });
    });
});


