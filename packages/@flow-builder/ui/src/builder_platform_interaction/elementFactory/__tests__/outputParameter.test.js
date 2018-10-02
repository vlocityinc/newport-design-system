import {
    createOutputParameter,
    createOutputParameterMetadataObject,
} from '../outputParameter';

const valuePropertyName = 'value';
const valueDataTypePropertyName = 'valueDataType';

describe('outputParameter', () => {
    describe('createOutputParameter', () => {
        it('creates a value and valueDataType prop from a ferov object', () => {
            const mockElement = {};
            const result = createOutputParameter(mockElement);
            expect(result).toHaveProperty(valuePropertyName);
            expect(result).toHaveProperty(valueDataTypePropertyName);
        });

        it('uses name from the element', () => {
            const mockElement = { name: 'fooName' };
            const result = createOutputParameter(mockElement);
            expect(result.name).toEqual(mockElement.name);
        });

        it('uses value and valueDataType properties when not given assignToReference', () => {
            const value = 'foo';
            const valueDataType = 'fooDataType';
            const mockElement = { value, valueDataType };
            const result = createOutputParameter(mockElement);
            expect(result.value).toEqual(value);
            expect(result.valueDataType).toEqual(valueDataType);
        });
    });

    describe('createOutputParameterMetadataObject', () => {
        it('uses name from the element and assignToReference equals value', () => {
            const mockElement = { name: 'fooName', value: 'fooValue' };
            const result = createOutputParameterMetadataObject(mockElement);
            expect(result.name).toEqual(mockElement.name);
            expect(result.assignToReference).toEqual(mockElement.value);
        });
    });
});