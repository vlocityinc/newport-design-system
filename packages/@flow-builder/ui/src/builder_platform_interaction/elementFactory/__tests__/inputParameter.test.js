import {
    createInputParameter,
    createInputParameterMetadataObject,
    valuePropertyName,
    valueDataTypePropertyName,
} from '../inputParameter';
import { createFEROV, createFEROVMetadataObject } from '../ferov';

jest.mock('../ferov', () => {
    return {
        createFEROV: jest.fn().mockName('createFEROV'),
        createFEROVMetadataObject: jest.fn().mockName('createFEROVMetadataObject'),
    };
});

describe('inputParameter', () => {
    describe('createInputParameter', () => {
        it('creates a value and valueDataType prop from a ferov object', () => {
            const mockElement = {};
            const result = createInputParameter(mockElement);
            expect(result).toHaveProperty(valuePropertyName);
            expect(result).toHaveProperty(valueDataTypePropertyName);
        });

        it('uses name from the element', () => {
            const mockElement = { name: 'fooName' };
            const result = createInputParameter(mockElement);
            expect(result.name).toEqual(mockElement.name);
        });

        it('calls createFEROV when passed a FEROV object', () => {
            const mockFerov = { elementReference: 'foo' };
            const mockElement = { value: mockFerov };
            createInputParameter(mockElement);
            expect(createFEROV).toHaveBeenCalledWith(mockFerov, valuePropertyName, valueDataTypePropertyName);
        });

        it('uses value and valueDataType properties when not given a FEROV obejct', () => {
            const value = 'foo';
            const valueDataType = 'fooDataType';
            const mockElement = { value, valueDataType };
            const result = createInputParameter(mockElement);
            expect(result.value).toEqual(value);
            expect(result.valueDataType).toEqual(valueDataType);
        });
    });

    describe('createInputParameterMetadataObject', () => {
        it('calls createFEROVMetadataObject when given object with value', () => {
            const value = 'foo';
            const valueDataType = 'fooDataType';
            const mockElement = { value, valueDataType };
            createInputParameterMetadataObject(mockElement);
            expect(createFEROVMetadataObject).toHaveBeenCalledWith(mockElement, valuePropertyName, valueDataTypePropertyName);
        });

        it('uses name from the element', () => {
            const mockElement = { name: 'fooName' };
            const result = createInputParameterMetadataObject(mockElement);
            expect(result.name).toEqual(mockElement.name);
        });
    });
});