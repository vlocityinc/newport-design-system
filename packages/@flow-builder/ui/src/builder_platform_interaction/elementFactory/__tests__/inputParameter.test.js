import {
    createInputParameter,
    createInputParameterMetadataObject,
    VALUE_PROPERTY_NAME,
    VALUE_DATA_TYPE_PROPERTY_NAME,
} from '../inputParameter';
import { createFEROV, createFEROVMetadataObject } from '../ferov';

jest.mock('../ferov', () => {
    return {
        createFEROV: jest.fn().mockName('createFEROV'),
        createFEROVMetadataObject: jest.fn().mockName('createFEROVMetadataObject'),
        getDataTypeKey: require.requireActual('../ferov').getDataTypeKey,
    };
});

describe('inputParameter', () => {
    describe('createInputParameter', () => {
        it('creates a value and valueDataType prop from a ferov object', () => {
            const mockElement = {};
            const result = createInputParameter(mockElement);
            expect(result).toHaveProperty(VALUE_PROPERTY_NAME);
            expect(result).toHaveProperty(VALUE_DATA_TYPE_PROPERTY_NAME);
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
            expect(createFEROV).toHaveBeenCalledWith(mockFerov, VALUE_PROPERTY_NAME, VALUE_DATA_TYPE_PROPERTY_NAME);
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
            expect(createFEROVMetadataObject).toHaveBeenCalledWith(mockElement, VALUE_PROPERTY_NAME, VALUE_DATA_TYPE_PROPERTY_NAME);
        });

        it('uses name from the element', () => {
            const mockElement = { name: 'fooName' };
            const result = createInputParameterMetadataObject(mockElement);
            expect(result.name).toEqual(mockElement.name);
        });
    });
});