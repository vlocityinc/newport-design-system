// @ts-nocheck
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { createRecordLookup, createRecordLookupMetadataObject } from '../recordLookup';

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return Object.assign({}, actual, {
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn()
    });
});

expect.extend(deepFindMatchers);

const MOCK_GUID = 'mockGuid';

const recordLookupStore = () => ({
    availableConnections: [{ type: 'REGULAR' }, { type: 'FAULT' }],
    config: { isSelected: false, isHighlighted: false },
    connectorCount: 0,
    dataType: 'SObject',
    description: '',
    elementType: 'RecordQuery',
    filterLogic: CONDITION_LOGIC.AND,
    filters: [
        {
            leftHandSide: 'Account.BillingCity',
            operator: 'EqualTo',
            rightHandSide: 'Paris',
            rightHandSideDataType: 'String',
            rowIndex: 'mockGuid'
        }
    ],
    getFirstRecordOnly: true,
    guid: 'mockGuid',
    isCanvasElement: true,
    isCollection: false,
    label: 'getAccount automatic',
    locationX: 264,
    locationY: 300,
    maxConnections: 2,
    name: 'getAccount automatic',
    object: 'Account',
    objectIndex: 'mockGuid',
    outputReference: undefined,
    outputReferenceIndex: 'mockGuid',
    queriedFields: null,
    sortField: '',
    sortOrder: 'NotSorted',
    storeOutputAutomatically: true,
    subtype: 'Account',
    variableAndFieldMapping: 'automatic'
});

const recordLookupMetadata = () => ({
    assignNullValuesIfNoRecordsFound: false, // this is returned by the server should be true or undefined / null
    filterLogic: CONDITION_LOGIC.AND,
    filters: [
        {
            field: 'BillingCity',
            operator: 'EqualTo',
            value: { stringValue: 'Paris' }
        }
    ],
    getFirstRecordOnly: true,
    label: 'getAccount automatic',
    locationX: 264,
    locationY: 300,
    name: 'getAccount automatic',
    object: 'Account',
    outputAssignments: [],
    processMetadataValues: [],
    queriedFields: [],
    storeOutputAutomatically: true
});

const recordLookupMetadataWithQueriedFieldNull = () => ({
    filterLogic: CONDITION_LOGIC.AND,
    filters: [
        {
            field: 'BillingCity',
            operator: 'EqualTo',
            value: { stringValue: 'Paris' }
        }
    ],
    getFirstRecordOnly: true,
    label: 'getAccount automatic',
    locationX: 264,
    locationY: 300,
    name: 'getAccount automatic',
    object: 'Account',
    queriedFields: null,
    storeOutputAutomatically: true
});

describe('recordLookup', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('recordLookup flow metadata => UI model', () => {
        describe('recordLookup function using sObject', () => {
            it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
                const actualResult = createRecordLookup(recordLookupMetadata());
                expect(actualResult).toMatchObject(recordLookupStore());
            });
        });
    });
    describe('recordLookup UI model => flow metadata', () => {
        describe('recordLookup function with automatic handled output', () => {
            beforeEach(() => {
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED);
            });
            it('sets null queried fields', () => {
                const actualResult = createRecordLookupMetadataObject(recordLookupStore());
                expect(actualResult).toMatchObject(recordLookupMetadataWithQueriedFieldNull());
            });
        });
        it('when filterLogic = no_conditions in the metadata the value should be undefined', () => {
            const recordLookupFilterNoCondition = recordLookupStore();
            recordLookupFilterNoCondition.filterLogic = CONDITION_LOGIC.NO_CONDITIONS;
            const actualResult = createRecordLookupMetadataObject(recordLookupFilterNoCondition);
            expect(actualResult.filterLogic).toBeUndefined();
        });
    });
});
