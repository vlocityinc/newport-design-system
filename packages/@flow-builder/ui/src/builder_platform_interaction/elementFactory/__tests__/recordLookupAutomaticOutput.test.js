import {
    createRecordLookup,
    createRecordLookupMetadataObject
} from '../recordLookup';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';

jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        'builder_platform_interaction/processTypeLib'
    );
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
    filterType: 'all',
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
                getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue(
                    FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                );
            });
            it('sets null queried fields', () => {
                const actualResult = createRecordLookupMetadataObject(
                    recordLookupStore()
                );
                expect(actualResult).toMatchObject(
                    recordLookupMetadataWithQueriedFieldNull()
                );
            });
        });
    });
});
