import {
    createDynamicChoiceSet,
    createDynamicChoiceSetMetadataObject
} from '../../base/dynamicChoiceSet';
import { SORT_ORDER } from 'builder_platform_interaction/recordEditorLib';
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
    limit: '',
    displayField: undefined,
    valueField: undefined,
    dataType: undefined,
    sortOrder: SORT_ORDER.NOT_SORTED
};
const mockParamForDynamicChoiceSet = {
    limit: 0,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: undefined
};
const mockDynamicChoiceSetResult = {
    limit: '',
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.NOT_SORTED
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