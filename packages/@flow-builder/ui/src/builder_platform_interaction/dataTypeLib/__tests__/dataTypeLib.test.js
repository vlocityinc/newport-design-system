import {
    getDataTypeLabel,
    FLOW_DATA_TYPE,
} from '../dataTypeLib';

jest.mock('../dataTypeLib.js', () => {
    const dataTypeLib = Object.assign({}, jest.requireActual('../dataTypeLib.js'));
    dataTypeLib.FLOW_DATA_TYPE.MULTI_PICKLIST.label = undefined;
    return dataTypeLib;
});

describe('dataTypeLib', () => {
    describe('getDataTypeLabel', () => {
        it('thows an error when given an invalid data type api name', () => {
            const invalidDataType = 'fooDataType';
            expect(() => getDataTypeLabel(invalidDataType)).toThrow();
        });

        it('returns the data type api name when there is no label', () => {
            const label = getDataTypeLabel(FLOW_DATA_TYPE.MULTI_PICKLIST.value);
            expect(label).toEqual(FLOW_DATA_TYPE.MULTI_PICKLIST.value);
        });

        it('returns the label of the given data type', () => {
            const label = getDataTypeLabel(FLOW_DATA_TYPE.STRING.value);
            expect(label).toEqual(FLOW_DATA_TYPE.STRING.label);
        });
    });
});