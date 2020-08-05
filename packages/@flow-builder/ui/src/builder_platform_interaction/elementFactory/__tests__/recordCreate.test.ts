// @ts-nocheck
import { createRecordCreate, createDuplicateRecordCreate, createRecordCreateMetadataObject } from '../recordCreate';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { deepFindMatchers } from 'builder_platform_interaction/builderTestUtils';
import { GLOBAL_CONSTANTS } from 'builder_platform_interaction/systemLib';
import { DUPLICATE_ELEMENT_XY_OFFSET } from '../base/baseElement';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    flowWithAllElementsUIModel,
    createWithApexDefSingleSObjectVariable,
    createWithApexDefSObjectCollectionVariable,
    apexComplexTypeVariable
} from 'mock/storeData';
import { setApexClasses, cachePropertiesForClass } from 'builder_platform_interaction/apexTypeLib';
import { apexTypesForFlow } from 'serverData/GetApexTypes/apexTypesForFlow.json';

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    return Object.assign({}, actual, {
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn()
    });
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

expect.extend(deepFindMatchers);
const MOCK_GUID = 'mockGuid',
    MOCK_ASSIGN_RECORD_ID_TO_REFERENCE = 'myNewId';

const flowRecordCreateFieldsMetadataManual = () => ({
    assignRecordIdToReference: MOCK_ASSIGN_RECORD_ID_TO_REFERENCE,
    inputAssignments: [
        {
            field: 'BillingCity',
            value: { elementReference: 'myCity' }
        },
        {
            field: 'BillingCountry',
            value: { elementReference: 'myCountry' }
        }
    ],
    label: 'myCreate with fields',
    locationX: 1074,
    locationY: 527,
    name: 'myCreate',
    object: 'Account',
    storeOutputAutomatically: false
});

const flowRecordCreateFieldsMetadataAuto = () => ({
    ...flowRecordCreateFieldsMetadataManual(),
    assignRecordIdToReference: '',
    storeOutputAutomatically: true
});

const flowRecordCreateFieldsMetadataManualFromAuto = () => ({
    inputAssignments: [
        {
            field: 'BillingCity',
            value: { elementReference: 'myCity' }
        },
        {
            field: 'BillingCountry',
            value: { elementReference: 'myCountry' }
        }
    ],
    label: 'myCreate with fields',
    locationX: 1074,
    locationY: 527,
    name: 'myCreate',
    object: 'Account'
});

const flowRecordCreateFieldsStoreManual = () => ({
    assignRecordIdToReference: MOCK_ASSIGN_RECORD_ID_TO_REFERENCE,
    assignRecordIdToReferenceIndex: MOCK_GUID,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: 'Boolean',
    description: '',
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: MOCK_GUID,
    inputAssignments: [
        {
            leftHandSide: 'Account.BillingCity',
            rightHandSide: 'myCity',
            rightHandSideDataType: 'reference',
            rowIndex: 'ae4ba97b-9f5b-4705-adec-32f7700498c3'
        },
        {
            leftHandSide: 'Account.BillingCountry',
            rightHandSide: 'myCountry',
            rightHandSideDataType: 'reference',
            rowIndex: 'e7aa85e8-1a18-4211-862f-60bd9e7f8192'
        }
    ],
    inputReference: '',
    inputReferenceIndex: MOCK_GUID,
    isCanvasElement: true,
    label: 'myCreate with fields',
    locationX: 1074,
    locationY: 527,
    maxConnections: 2,
    name: 'myCreate',
    getFirstRecordOnly: true,
    object: 'Account',
    objectIndex: MOCK_GUID,
    storeOutputAutomatically: false
});

const flowRecordCreateFieldsStoreAuto = () => ({
    ...flowRecordCreateFieldsStoreManual(),
    assignRecordIdToReference: '',
    dataType: 'String',
    storeOutputAutomatically: true
});

const flowRecordCreateSObjectMetadata = () => ({
    inputReference: 'mySObjectVar',
    label: 'myCreateFast',
    locationX: 595,
    locationY: 580,
    name: 'myCreateFast'
});

const flowRecordCreateSObjectStore = () => ({
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    config: { isSelected: false },
    connectorCount: 0,
    dataType: 'Boolean',
    description: '',
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: MOCK_GUID,
    inputReference: 'mySObjectVar',
    inputReferenceIndex: MOCK_GUID,
    isCanvasElement: true,
    label: 'myCreateFast',
    locationX: 595,
    locationY: 580,
    maxConnections: 2,
    name: 'myCreateFast',
    getFirstRecordOnly: true,
    object: '',
    objectIndex: MOCK_GUID
});

const RECORD_CREATE_MOCKS = [
    {
        mode: 'manual',
        metadata: flowRecordCreateFieldsMetadataManual(),
        store: flowRecordCreateFieldsStoreManual()
    },
    {
        mode: 'auto',
        metadata: flowRecordCreateFieldsMetadataAuto(),
        store: flowRecordCreateFieldsStoreAuto()
    }
];

const inputAssignmentFieldValue = {
    field: 'description',
    value: { stringValue: 'myDescription' }
};

const inputAssignmentField = {
    field: 'title'
};

const inputAssignmentFieldBooleanValue = {
    field: 'isEditable',
    value: { booleanValue: false }
};

const uiModelInputAssignmentFieldValue = {
    leftHandSide: 'Account.description',
    rightHandSide: 'myDescription',
    rightHandSideDataType: 'String'
};

const uiModelInputAssignmentField = {
    leftHandSide: 'Account.title',
    rightHandSide: '',
    rightHandSideDataType: ''
};

const uiModelEmptyInputAssignmentField = {
    leftHandSide: '',
    rightHandSide: '',
    rightHandSideDataType: ''
};

const uiModelInputAssignmentFieldBooleanValue = {
    leftHandSide: 'Account.isEditable',
    rightHandSide: GLOBAL_CONSTANTS.BOOLEAN_FALSE,
    rightHandSideDataType: 'Boolean'
};

beforeAll(() => {
    Store.setMockState(flowWithAllElementsUIModel);
});
afterAll(() => {
    Store.resetStore();
});

describe('recordCreate', () => {
    const storeLib = require('builder_platform_interaction/storeLib');
    storeLib.generateGuid = jest.fn().mockReturnValue(MOCK_GUID);
    describe('createRecordCreate function', () => {
        let recordCreate;
        describe('when empty recordCreate is created', () => {
            beforeAll(() => {
                recordCreate = createRecordCreate();
            });

            it('has dataType of boolean', () => {
                expect(recordCreate.dataType).toEqual(FLOW_DATA_TYPE.BOOLEAN.value);
            });
        });

        test.each`
            mode        | mockMetadata                            | dataType
            ${'manual'} | ${flowRecordCreateFieldsMetadataManual} | ${FLOW_DATA_TYPE.BOOLEAN.value}
            ${'auto'}   | ${flowRecordCreateFieldsMetadataAuto}   | ${FLOW_DATA_TYPE.STRING.value}
        `(
            'should return datatype: $dataType for flow metadata recordCreate in $mode mode',
            ({ mockMetadata, dataType }) => {
                recordCreate = createRecordCreate(mockMetadata());
                expect(recordCreate.dataType).toEqual(dataType);
            }
        );

        test.each`
            mode        | mockStore                            | dataType
            ${'manual'} | ${flowRecordCreateFieldsStoreManual} | ${FLOW_DATA_TYPE.BOOLEAN.value}
            ${'auto'}   | ${flowRecordCreateFieldsStoreAuto}   | ${FLOW_DATA_TYPE.STRING.value}
        `('should return datatype: $dataType for store recordCreate in $mode mode', ({ mockStore, dataType }) => {
            recordCreate = createRecordCreate(mockStore());
            expect(recordCreate.dataType).toEqual(dataType);
        });
    });
});
describe('recordCreate using Apex-Defined Variable', () => {
    beforeEach(() => {
        setApexClasses(apexTypesForFlow);
    });
    afterEach(() => {
        setApexClasses(null);
    });
    describe('Single Variable', () => {
        beforeEach(() => {
            cachePropertiesForClass('apexContainsOnlyASingleSObjectVariable');
        });
        it('has getFirstRecordOnly = true', () => {
            const loadCreateWithApexDefSingleSObjectVariable = createRecordCreate(
                createWithApexDefSingleSObjectVariable
            );
            expect(loadCreateWithApexDefSingleSObjectVariable.getFirstRecordOnly).toBe(true);
        });
    });
    describe('Collection Variable', () => {
        beforeEach(() => {
            cachePropertiesForClass('apexContainsOnlyAnSObjectCollectionVariable');
        });
        it('has getFirstRecordOnly = false', () => {
            const loadCreateWithApexDefSObjectCollectionVariable = createRecordCreate(
                createWithApexDefSObjectCollectionVariable
            );
            expect(loadCreateWithApexDefSObjectCollectionVariable.getFirstRecordOnly).toBe(false);
        });
    });
    describe('Create from apex variable', () => {
        // see W-7405327: this can happen when using loop auto output and loop variable is changed to return apex instead of SObject
        it('can create element with apex variable', () => {
            const element = createRecordCreate({
                inputReference: apexComplexTypeVariable.guid
            });

            expect(element).toBeDefined();
        });
    });
});

describe('recordCreate new element from left panel', () => {
    it('returns a new record create object when no argument is passed; getFirstRecordOnly should be true by default', () => {
        const uiModelResult = {
            name: '',
            description: '',
            elementType: ELEMENT_TYPE.RECORD_CREATE,
            getFirstRecordOnly: true
        };
        const actualResult = createRecordCreate();
        expect(actualResult).toMatchObject(uiModelResult);
    });
});

describe('createDuplicateRecordCreate function', () => {
    const originalRecordCreate = {
        guid: 'originalGuid',
        name: 'originalName',
        label: 'label',
        elementType: ELEMENT_TYPE.RECORD_CREATE,
        locationX: 100,
        locationY: 100,
        config: {
            isSelectd: true,
            isHighlighted: false
        },
        connectorCount: 1,
        maxConnections: 2,
        availableConnections: [
            {
                type: CONNECTOR_TYPE.FAULT
            }
        ]
    };
    const { duplicatedElement } = createDuplicateRecordCreate(originalRecordCreate, 'duplicatedGuid', 'duplicatedName');

    it('has the new guid', () => {
        expect(duplicatedElement.guid).toEqual('duplicatedGuid');
    });
    it('has the new name', () => {
        expect(duplicatedElement.name).toEqual('duplicatedName');
    });
    it('has the updated locationX', () => {
        expect(duplicatedElement.locationX).toEqual(originalRecordCreate.locationX + DUPLICATE_ELEMENT_XY_OFFSET);
    });
    it('has the updated locationY', () => {
        expect(duplicatedElement.locationY).toEqual(originalRecordCreate.locationY + DUPLICATE_ELEMENT_XY_OFFSET);
    });
    it('has isSelected set to true', () => {
        expect(duplicatedElement.config.isSelected).toBeTruthy();
    });
    it('has isHighlighted set to false', () => {
        expect(duplicatedElement.config.isHighlighted).toBeFalsy();
    });
    it('has connectorCount set to 0', () => {
        expect(duplicatedElement.connectorCount).toEqual(0);
    });
    it('has maxConnections set to 2', () => {
        expect(duplicatedElement.maxConnections).toEqual(2);
    });
    it('has the right elementType', () => {
        expect(duplicatedElement.elementType).toEqual(ELEMENT_TYPE.RECORD_CREATE);
    });
    it('has default availableConnections', () => {
        expect(duplicatedElement.availableConnections).toEqual([
            {
                type: CONNECTOR_TYPE.REGULAR
            },
            {
                type: CONNECTOR_TYPE.FAULT
            }
        ]);
    });
});

describe('recordCreate flow metadata => UI model', () => {
    describe('recordCreate function using sObject', () => {
        it('returns a new record update object with same value and the numberRecordsToStore calculated from the inputReference', () => {
            const recordCreateSObjectMetadata = flowRecordCreateSObjectMetadata();
            const actualResult = createRecordCreate(recordCreateSObjectMetadata);
            expect(actualResult).toMatchObject(flowRecordCreateSObjectStore());
        });
        it('has no common mutable object with record create metadata passed as parameter', () => {
            const recordCreateSObjectMetadata = flowRecordCreateSObjectMetadata();
            const actualResult = createRecordCreate(recordCreateSObjectMetadata);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateSObjectMetadata);
        });
    });
    describe('recordCreate function using Fields', () => {
        let actualResult;

        RECORD_CREATE_MOCKS.forEach(({ mode, metadata, store }) => {
            it(`inputAssignments with value should return the expression (RHS/LHS) in ${mode} mode`, () => {
                metadata.inputAssignments = [inputAssignmentFieldValue];
                actualResult = createRecordCreate(metadata);
                store.inputAssignments = [uiModelInputAssignmentFieldValue];
                expect(actualResult).toMatchObject(store);
            });

            it(`inputAssignments with multiple values should return the expression (RHS/LHS) in ${mode} mode`, () => {
                metadata.inputAssignments = [
                    inputAssignmentFieldValue,
                    inputAssignmentField,
                    inputAssignmentFieldBooleanValue
                ];
                actualResult = createRecordCreate(metadata);
                store.inputAssignments = [
                    uiModelInputAssignmentFieldValue,
                    uiModelInputAssignmentField,
                    uiModelInputAssignmentFieldBooleanValue
                ];
                expect(actualResult).toMatchObject(store);
            });
            it(`has no common mutable object with record create with fields metadata passed as parameter in ${mode} mode`, () => {
                actualResult = createRecordCreate(metadata);
                expect(actualResult).toHaveNoCommonMutableObjectWith(metadata);
            });
            it(`should have an "inputReference" with empty text value in ${mode} mode`, () => {
                actualResult = createRecordCreate(metadata);
                expect(actualResult).toHaveProperty('inputReference', '');
            });
        });
    });
    describe('null recordCreate', () => {
        it('Passing null recordCreate should throw error', () => {
            expect(() => createRecordCreate(null)).toThrowError();
        });
    });
});
describe('recordCreate UI model => flow metadata', () => {
    describe('recordCreate function using sObject', () => {
        it('record update using sObject', () => {
            const actualResult = createRecordCreateMetadataObject(flowRecordCreateSObjectStore());
            expect(actualResult).toMatchObject(flowRecordCreateSObjectMetadata());
        });
        it('has no common mutable object with record create store passed as parameter', () => {
            const recordCreateSObjectStore = flowRecordCreateSObjectStore();
            const actualResult = createRecordCreateMetadataObject(recordCreateSObjectStore);
            expect(actualResult).toHaveNoCommonMutableObjectWith(recordCreateSObjectStore);
        });
    });
    describe('recordCreate function using Fields', () => {
        let actualResult;

        RECORD_CREATE_MOCKS.forEach(({ mode, metadata, store, isInManualMode = mode === 'manual' }) => {
            it(`inputAssignments without value in ${mode} mode`, () => {
                store.inputAssignments = [uiModelEmptyInputAssignmentField];
                metadata.inputAssignments = [];
                actualResult = createRecordCreateMetadataObject(store);
                expect(actualResult).toHaveProperty('inputAssignments', metadata.inputAssignments);
            });
            it(`inputAssignments with value in ${mode} mode`, () => {
                store.inputAssignments = [uiModelInputAssignmentFieldValue];
                metadata.inputAssignments = [inputAssignmentFieldValue];
                actualResult = createRecordCreateMetadataObject(store);
                expect(actualResult).toHaveProperty('inputAssignments', metadata.inputAssignments);
            });
            it(`inputAssignments with multiple values in ${mode} mode`, () => {
                store.inputAssignments = [
                    uiModelInputAssignmentFieldValue,
                    uiModelInputAssignmentField,
                    uiModelInputAssignmentFieldBooleanValue
                ];
                metadata.inputAssignments = [
                    inputAssignmentFieldValue,
                    inputAssignmentField,
                    inputAssignmentFieldBooleanValue
                ];
                actualResult = createRecordCreateMetadataObject(store);
                expect(actualResult).toHaveProperty('inputAssignments', metadata.inputAssignments);
            });
            it(`"storeOutputAutomatically" value in ${mode} mode`, () => {
                actualResult = createRecordCreateMetadataObject(store);
                expect(actualResult).toHaveProperty('storeOutputAutomatically', !isInManualMode);
            });

            it(`has no common mutable object with record create store passed as parameter in ${mode} mode`, () => {
                actualResult = createRecordCreateMetadataObject(store);
                expect(actualResult).toHaveNoCommonMutableObjectWith(store);
            });

            if (isInManualMode) {
                it(`"assignRecordIdToReference" with value (not empty string) in ${mode} mode`, () => {
                    actualResult = createRecordCreateMetadataObject(store);
                    expect(actualResult).toHaveProperty(
                        'assignRecordIdToReference',
                        MOCK_ASSIGN_RECORD_ID_TO_REFERENCE
                    );
                });
                it(`no "assignRecordIdToReference" with empty string value in ${mode} mode`, () => {
                    store.assignRecordIdToReference = '';
                    actualResult = createRecordCreateMetadataObject(store);
                    expect(actualResult).not.toHaveProperty('assignRecordIdToReference');
                });
            } else {
                it(`"assignRecordIdToReference" with empty string value in ${mode} mode`, () => {
                    store.assignRecordIdToReference = '';
                    actualResult = createRecordCreateMetadataObject(store);
                    expect(actualResult).not.toHaveProperty('assignRecordIdToReference', '');
                });
            }
        });
    });
    describe('undefined/null recordCreate', () => {
        test.each([undefined, null])('Passing with %s recordCreate should throw error', (recordCreate) => {
            expect(() => createRecordCreateMetadataObject(recordCreate)).toThrowError();
        });
    });
});

describe('recordLookup function with automatic handled output and saved with a process type that does not support automatic output handling', () => {
    beforeEach(() => {
        getProcessTypeAutomaticOutPutHandlingSupport.mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED);
    });
    it('Should not have storeOutputAutomatically', () => {
        const actualResult = createRecordCreateMetadataObject(flowRecordCreateFieldsStoreAuto());
        expect(actualResult).toMatchObject(flowRecordCreateFieldsMetadataManualFromAuto());
        expect(actualResult.storeOutputAutomatically).toBe(undefined);
    });
});
