import {
    createPicklistChoiceSet,
    createPicklistChoiceSetMetadataObject,
    createPicklistChoiceSetForStore
} from '../picklistChoiceSet';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { baseElementsArrayToMap } from '../base/baseElement';

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
        baseElementsArrayToMap: jest.fn((test) => {
            return {
                guid: [test]
            };
        }).mockName('baseElementsArrayToMap')
    };
});
const mockDefaultValuesForPicklistChoiceSet = {
    elementType: ELEMENT_TYPE.PICKLIST_CHOICE_SET,
    picklistObject: null,
    picklistField: null
};
const paramElementForPicklistChoiceSet = {
    picklistObject: 'mockObject',
    picklistField: 'mockField'
};
const mockPicklistChoiceSetResult = {
    elementType: ELEMENT_TYPE.PICKLIST_CHOICE_SET,
    picklistObject: 'mockObject',
    picklistField: 'mockField'
};
describe('createPicklistChoiceSet', () => {
    it('with empty param produces default value object', () => {
        const result = createPicklistChoiceSet();
        expect(result).toMatchObject(mockDefaultValuesForPicklistChoiceSet);
    });
    describe('with a valid element', () => {
        const result = createPicklistChoiceSet(paramElementForPicklistChoiceSet);
        it('result object matches the mockPicklistChoiceSetResult object', () => {
            expect(result).toMatchObject(mockPicklistChoiceSetResult);
        });
    });
});

describe('createPicklistChoiceSetMetadataObject', () => {
    it('throws an error when no element param is passed', () => {
        expect(() => {
            createPicklistChoiceSetMetadataObject();
        }).toThrow();
    });
    describe('when a valid element is passed as param', () => {
        const result = createPicklistChoiceSetMetadataObject(paramElementForPicklistChoiceSet);
        it('result object matches the paramElementForPicklistChoiceSet object', () => {
            expect(result).toMatchObject(paramElementForPicklistChoiceSet);
        });
    });
});

describe('createPicklistChoiceForStore', () => {
    it('throws when no valid element is passed', () => {
        expect(() => {
            createPicklistChoiceSetForStore();
        }).toThrow();
    });
    it('calls the baseElementsArrayToMap function with the right param', () => {
        createPicklistChoiceSetForStore(mockPicklistChoiceSetResult);
        expect(baseElementsArrayToMap.mock.calls[0][0]).toEqual([mockPicklistChoiceSetResult]);
    });
});