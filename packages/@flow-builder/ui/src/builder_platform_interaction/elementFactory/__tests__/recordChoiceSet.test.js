import {
    createRecordChoiceSet,
    createRecordChoiceSetMetadataObject,
    createRecordChoiceSetForStore
} from '../recordChoiceSet';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseElementsArrayToMap } from '../base/baseElement';
import { createFilter } from '../base/baseRecordElement';

jest.mock('../base/dynamicChoiceSet', () => {
    return {
        createDynamicChoiceSet: jest.fn(() => {
            return {};
        }).mockName('createDynamicChoiceSet'),
        createDynamicChoiceSetMetadataObject: jest.fn(() => {
            return {};
        }).mockName('createDynamicChoiceSetMetadataObject')
    };
});
jest.mock('../base/baseElement', () => {
    return {
        baseElementsArrayToMap: jest.fn(() => {
            return {};
        }).mockName('baseElementsArrayToMap')
    };
});
jest.mock('builder_platform_interaction/storeLib', () => {
    return {
        generateGuid: jest.fn().mockImplementation(() => {
            return 'MOCK_GUID';
        })
    };
});
const mockDefaultValuesForRecordChoiceSet = {
    elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
    object: null,
    sortField: '',
    outputAssignments: [],
    filters: [createFilter()]
};
const paramElementForRecordChoiceSet = {
    object: 'mockObject',
    sortField: 'mockField',
    outputAssignments: [],
    filters: []
};
const mockRecordChoiceSetResult = {
    elementType: ELEMENT_TYPE.RECORD_CHOICE_SET,
    object: 'mockObject',
    sortField: 'mockField',
    outputAssignments: [],
    filters: [createFilter()]
};
describe('createRecordChoiceSet', () => {
    it('with empty param produces default value object', () => {
        const result = createRecordChoiceSet();
        expect(result).toMatchObject(mockDefaultValuesForRecordChoiceSet);
    });
    describe('with a valid element', () => {
        const result = createRecordChoiceSet(paramElementForRecordChoiceSet);
        it('result object matches the mockRecordChoiceSetResult object', () => {
            expect(result).toMatchObject(mockRecordChoiceSetResult);
        });
    });
});

describe('createRecordChoiceSetMetadataObject', () => {
    it('throws an error when no element param is passed', () => {
        expect(() => {
            createRecordChoiceSetMetadataObject();
        }).toThrow();
    });
    describe('when a valid element is passed as param', () => {
        const result = createRecordChoiceSetMetadataObject(paramElementForRecordChoiceSet);
        it('result object matches the paramElementForRecordChoiceSet object', () => {
            expect(result).toMatchObject(paramElementForRecordChoiceSet);
        });
    });
});

describe('createRecordChoiceForStore', () => {
    it('throws when no valid element is passed', () => {
        expect(() => {
            createRecordChoiceSetForStore();
        }).toThrow();
    });
    it('calls the baseElementsArrayToMap function with the right param', () => {
        createRecordChoiceSetForStore(mockRecordChoiceSetResult);
        expect(baseElementsArrayToMap.mock.calls[0][0]).toMatchObject([mockRecordChoiceSetResult]);
    });
});