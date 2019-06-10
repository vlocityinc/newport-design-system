import {
    createDynamicChoiceSet,
    createDynamicChoiceSetMetadataObject
} from '../../base/dynamicChoiceSet';
import { SORT_ORDER } from 'builder_platform_interaction/recordEditorLib';
jest.mock('../../base/baseElement', () => {
    return {
        baseResource: jest
            .fn(() => {
                return {};
            })
            .mockName('baseResource'),
        baseResourceMetadataObject: jest
            .fn(() => {
                return {};
            })
            .mockName('baseResourceMetadataObject')
    };
});

const mockDynamicChoiceSet = {
    limit: 5,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.ASC
};
const mockDynamicChoiceSetObjectForNoParam = {
    limit: '',
    displayField: undefined,
    valueField: null,
    dataType: undefined,
    sortOrder: SORT_ORDER.NOT_SORTED
};
const mockDynamicChoiceSetWithNoLimitSortOrder = {
    limit: 0,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: undefined
};
const mockParamWithEmptyValuesForDynamicChoiceSet = {
    limit: '',
    displayField: 'mockDisplayField',
    valueField: '',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.NOT_SORTED
};
const mockDynamicChoiceSetResult = {
    limit: '5',
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.ASC
};
const mockDynamicChoiceSetResultWithNoLimitSortOrder = {
    limit: '',
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.NOT_SORTED
};
const mockDyanmicChoiceMetadataObjectResult = {
    limit: 5,
    displayField: 'mockDisplayField',
    valueField: 'mockValueField',
    dataType: 'mockDataType',
    sortOrder: SORT_ORDER.ASC
};
const mockDyanmicChoiceWithUndefinedValuesMetadataObjectResult = {
    limit: undefined,
    displayField: 'mockDisplayField',
    valueField: undefined,
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
        const result = createDynamicChoiceSet(mockDynamicChoiceSet);
        it('result object matches the mockDynamicChoiceSetResult object', () => {
            expect(result).toMatchObject(mockDynamicChoiceSetResult);
        });
    });
    describe('when mock dyanmic choice set element with no limit or sort order is sent as a param', () => {
        const result = createDynamicChoiceSet(
            mockDynamicChoiceSetWithNoLimitSortOrder
        );
        it('result object matches the mockDynamicChoiceSetResult object', () => {
            expect(result).toMatchObject(
                mockDynamicChoiceSetResultWithNoLimitSortOrder
            );
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
        const result = createDynamicChoiceSetMetadataObject(
            mockDynamicChoiceSet
        );
        it('result object matches the mockDyanmicChoiceMetadataObjectResult object', () => {
            expect(result).toMatchObject(mockDyanmicChoiceMetadataObjectResult);
        });
    });
    describe('when a valid element is passed with empty values', () => {
        const result = createDynamicChoiceSetMetadataObject(
            mockParamWithEmptyValuesForDynamicChoiceSet
        );
        it('result object matches the mock metadata object with undefined values', () => {
            expect(result).toMatchObject(
                mockDyanmicChoiceWithUndefinedValuesMetadataObjectResult
            );
        });
    });
});
