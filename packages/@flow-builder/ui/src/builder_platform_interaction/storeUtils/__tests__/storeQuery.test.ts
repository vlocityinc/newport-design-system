// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { Store } from 'builder_platform_interaction/storeLib';
import { assignmentElement, flowWithAllElementsUIModel } from 'mock/storeData';
import {
    getDuplicateDevNameElements,
    getElementByDevName,
    getElementsForElementType,
    getScheduledPathsList,
    isExecuteOnlyWhenChangeMatchesConditionsPossible,
    isLabelInStore,
    shouldUseAutoLayoutCanvas
} from '../storeQuery';

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

describe('isLabelInStore', () => {
    it('returns whether or not a given label is set on any element in the store', () => {
        expect(isLabelInStore('Label that is not in store')).toBeFalsy();
        expect(isLabelInStore('getAccountSeparateFieldsWithFilters')).toBeTruthy();
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

describe('shouldUseAutoLayoutCanvas', () => {
    it('returns false when isAutoLayoutCanvas property is set to false', () => {
        const result = shouldUseAutoLayoutCanvas();
        expect(result).toBeFalsy();
    });

    it('returns true when isAutoLayoutCanvas property is set to true', () => {
        Store.setMockState({
            properties: {
                isAutoLayoutCanvas: true
            }
        });
        const result = shouldUseAutoLayoutCanvas();
        expect(result).toBeTruthy();
    });
});

describe('getElementsForElementType', () => {
    it('returns an empty array if no elements for the type found', () => {
        Store.setMockState({
            elements: {}
        });

        const results: ElementUi[] = getElementsForElementType(ELEMENT_TYPE.SCREEN);
        expect(results).toHaveLength(0);
    });

    it('returns an array of only the elements of element type', () => {
        const screen1 = {
            guid: 'screen1',
            elementType: ELEMENT_TYPE.SCREEN
        };

        const screen2 = {
            guid: 'screen2',
            elementType: ELEMENT_TYPE.SCREEN
        };

        Store.setMockState({
            elements: {
                screen1,
                ss1: { guid: 'ss1', elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE },
                screen2
            }
        });

        const results: ElementUi[] = getElementsForElementType(ELEMENT_TYPE.SCREEN);
        expect(results).toEqual([screen1, screen2]);
    });
});

describe('getScheduledPathsList for Auto Layout flow', () => {
    it('return empty when no elements are found', () => {
        const result = getScheduledPathsList();
        expect(result).toHaveLength(0);
    });

    it('default path is RunImmediately for auto layout', () => {
        Store.setMockState({
            properties: {
                isAutoLayoutCanvas: true
            },
            elements: {
                '8ae1f238-5415-4cc2-b1b2-57fab555ad14': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update'
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(1);
        expect(result).toEqual([
            { label: 'FlowBuilderStartEditor.immediateScheduledPathLabel', pathType: null, value: 'RunImmediately' }
        ]);
    });

    it('RunOnSuccess path has pathType: AfterCommit', () => {
        Store.setMockState({
            properties: {
                isAutoLayoutCanvas: true
            },
            elements: {
                '8ae1f238-5415-4cc2-b1b2-57fab555ad14': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update',
                    childReferences: [
                        {
                            childReference: '643e1143-cb91-44fe-8b54-aab2ebf4be0c'
                        }
                    ]
                },
                '643e1143-cb91-44fe-8b54-aab2ebf4be0c': {
                    name: 'Run_On_Success',
                    label: 'Run On Success',
                    elementType: 'ScheduledPath',
                    pathType: 'AfterCommit'
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(2);
        expect(result).toEqual([
            { label: 'FlowBuilderStartEditor.immediateScheduledPathLabel', pathType: null, value: 'RunImmediately' },
            { label: 'Run On Success', pathType: 'AfterCommit', value: 'Run_On_Success' }
        ]);
    });

    it('Scheduled path has pathType null', () => {
        Store.setMockState({
            properties: {
                isAutoLayoutCanvas: true
            },
            elements: {
                '8ae1f238-5415-4cc2-b1b2-57fab555ad14': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update',
                    childReferences: [
                        {
                            childReference: '1d142b94-5b10-419a-bff0-8c155f5a3c12'
                        }
                    ]
                },
                '1d142b94-5b10-419a-bff0-8c155f5a3c12': {
                    guid: '1d142b94-5b10-419a-bff0-8c155f5a3c12',
                    name: 'sch_path',
                    label: 'sch path',
                    elementType: 'ScheduledPath',
                    dataType: 'Boolean',
                    timeSource: 'CreatedDate',
                    offsetUnit: 'DaysAfter',
                    offsetNumber: '1'
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(2);
        expect(result).toEqual([
            { label: 'FlowBuilderStartEditor.immediateScheduledPathLabel', pathType: null, value: 'RunImmediately' },
            { label: 'sch path', pathType: undefined, value: 'sch_path' }
        ]);
    });
});

describe('getScheduledPathsList for free form flow', () => {
    it('conditions for RunImmediately', () => {
        Store.setMockState({
            properties: {
                processType: 'AutoLaunchedFlow',
                isAutoLayoutCanvas: false
            },
            connectors: [
                {
                    guid: '1edefabb-5b08-454e-9cbf-7579a768d8db',
                    source: '8ae1f238-5415-4cc2-b1b2-57fab555ad14',
                    childSource: null,
                    target: 'd8360f3b-1add-4234-843d-b991044e96b9',
                    label: 'Run Immediately',
                    type: 'IMMEDIATE'
                }
            ],
            elements: {
                '8ae1f238-5415-4cc2-b1b2-57fab555ad14': {
                    elementType: 'START_ELEMENT',
                    triggerType: 'RecordAfterSave',
                    recordTriggerType: 'Update'
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(1);
        expect(result).toEqual([
            { label: 'FlowBuilderStartEditor.immediateScheduledPathLabel', pathType: null, value: 'RunImmediately' }
        ]);
    });

    it('Run on Success path', () => {
        Store.setMockState({
            properties: {
                processType: 'AutoLaunchedFlow',
                isAutoLayoutCanvas: false
            },
            connectors: [
                {
                    guid: '1b790eff-8470-4293-be4c-9144f83dffb6',
                    source: '8ae1f238-5415-4cc2-b1b2-57fab555ad14',
                    childSource: '643e1143-cb91-44fe-8b54-aab2ebf4be0c',
                    target: '7af5a0a8-616d-4598-a070-b328ab0f38e9',
                    label: 'Run On Success',
                    type: 'REGULAR'
                }
            ],
            elements: {
                '643e1143-cb91-44fe-8b54-aab2ebf4be0c': {
                    guid: '643e1143-cb91-44fe-8b54-aab2ebf4be0c',
                    name: 'Run_On_Success',
                    label: 'Run On Success',
                    elementType: 'ScheduledPath',
                    pathType: 'AfterCommit'
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(1);
        expect(result).toEqual([{ label: 'Run On Success', pathType: 'AfterCommit', value: 'Run_On_Success' }]);
    });

    it('Scheduled path', () => {
        Store.setMockState({
            properties: {
                processType: 'AutoLaunchedFlow',
                isAutoLayoutCanvas: false
            },
            connectors: [
                {
                    guid: '1b790eff-8470-4293-be4c-9144f83dffb6',
                    source: '8ae1f238-5415-4cc2-b1b2-57fab555ad14',
                    childSource: '643e1143-cb91-44fe-8b54-aab2ebf4be0c',
                    target: '7af5a0a8-616d-4598-a070-b328ab0f38e9',
                    label: 'Run On Success',
                    type: 'REGULAR'
                }
            ],
            elements: {
                '643e1143-cb91-44fe-8b54-aab2ebf4be0c': {
                    guid: '643e1143-cb91-44fe-8b54-aab2ebf4be0c',
                    name: 'Scheduled_Path',
                    label: 'Scheduled Path',
                    elementType: 'ScheduledPath',
                    pathType: null
                }
            }
        });
        const result = getScheduledPathsList();
        expect(result).toHaveLength(1);
        expect(result).toEqual([{ label: 'Scheduled Path', pathType: null, value: 'Scheduled_Path' }]);
    });
});
