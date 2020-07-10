// @ts-nocheck
import {
    getElementByDevName,
    getDuplicateDevNameElements,
    isExecuteOnlyWhenChangeMatchesConditionsPossible
} from '../storeQuery';
import { assignmentElement } from 'mock/storeData';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('getElementByDevName', () => {
    it('returns element in a case-insensitive way by default', () => {
        const element = getElementByDevName(assignmentElement.name.toUpperCase());
        expect(element).not.toBeUndefined();
        expect(element.name).toEqual(assignmentElement.name);
    });
    it('returns undefined if called with caseSensitive parameter set to true and devName has not the same case', () => {
        const element = getElementByDevName(assignmentElement.name.toUpperCase(), true);
        expect(element).toBeUndefined();
    });
    it('returns undefined if there is no element with given name', () => {
        const element = getElementByDevName('notExistingName');
        expect(element).toBeUndefined();
    });
});

describe('getDuplicateDevNameElements', () => {
    const mockElements = {
        mockGuid: {
            guid: 'mockGuid',
            name: 'testName'
        },
        mockGuid2: {
            guid: 'mockGuid2',
            name: 'testName2'
        }
    };
    it('should return an empty array if no elements are passed', () => {
        const result = getDuplicateDevNameElements({}, 'test', 'testGUID');
        expect(result).toEqual([]);
    });
    it('should return an empty array if dev name passed is not duplicate', () => {
        const result = getDuplicateDevNameElements(mockElements, 'testName3', 'testGUID');
        expect(result).toEqual([]);
    });
    it('should return an array with one element if duplicate dev name is detected', () => {
        const result = getDuplicateDevNameElements(mockElements, 'testName', 'testGUID');
        expect(result).toEqual([mockElements.mockGuid]);
    });
});

describe('isExecuteOnlyWhenChangeMatchesConditionsPossible', () => {
    it('returns true for after save on update', () => {
        Store.setMockState({
            elements: {
                '07fd2a44-4192-4709-888d-8ccc18cb4580': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update'
                }
            }
        });
        const result = isExecuteOnlyWhenChangeMatchesConditionsPossible();
        expect(result).toBeTruthy();
    });

    it('returns false if trigger type is not after save or before save & save type is create or delete', () => {
        Store.setMockState({
            elements: {
                '07fd2a44-4192-4709-888d-8ccc18cb4580': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'Scheduled',
                    recordTriggerType: 'Create'
                }
            }
        });
        const result = isExecuteOnlyWhenChangeMatchesConditionsPossible();
        expect(result).toBeFalsy();
    });
});
