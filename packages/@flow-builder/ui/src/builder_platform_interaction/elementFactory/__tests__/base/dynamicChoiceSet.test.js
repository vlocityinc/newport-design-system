import {
    createDynamicChoiceSet,
    DEFAULT_SORT_VALUE,
    createDynamicChoiceSetMetadataObject
} from '../../base/dynamicChoiceSet';
jest.mock('../../base/baseElement', () => {
    return {
        baseResource: jest.fn(() => {
            return {};
        }).mockName('baseResource'),
        baseResourceMetadataObject: jest.fn(() => {
            return {};
        }).mockName('baseResourceMetadataObject')
    };
});

const mockDynamicChoiceSetObjectForNoParam = {
    limit: undefined,
    displayField: undefined,
    valueField: undefined,
    dataType: undefined,
    sortOrder: DEFAULT_SORT_VALUE
};
const mockParamForDynamicChoiceSet = {
    limit: 0,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: undefined
};
const mockDynamicChoiceSetResult = {
    limit: undefined,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: DEFAULT_SORT_VALUE
};
const mockDyanmicChoiceMetadataObjectResult = {
    limit: undefined,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: undefined
};
describe('createDynamicChoiceSet', () => {
    describe('when no element is passed as param', () => {
        const result = createDynamicChoiceSet();
        it('returns an object which matches the mockDynamicChoiceSetObjectForNoParam mock object', () => {
            expect(result).toMatchObject(mockDynamicChoiceSetObjectForNoParam);
        });
    });
    describe('when valid mock dyanmic choice set element is sent as a param', () => {
        const result = createDynamicChoiceSet(mockParamForDynamicChoiceSet);
        it('result object matches the mockDynamicChoiceSetResult object', () => {
            expect(result).toMatchObject(mockDynamicChoiceSetResult);
        });
    });
});
describe('createDynamicChoiceMetadataObject', () => {
    it('throws an error if no param is passed', () => {
        expect(() => {
            createDynamicChoiceSetMetadataObject();
        }).toThrow();
    });
    describe('when a valid element is passed', () => {
        const result = createDynamicChoiceSetMetadataObject(mockDynamicChoiceSetResult);
        it('result object matches the mockDyanmicChoiceMetadataObjectResult object', () => {
            expect(result).toMatchObject(mockDyanmicChoiceMetadataObjectResult);
        });
    });
});