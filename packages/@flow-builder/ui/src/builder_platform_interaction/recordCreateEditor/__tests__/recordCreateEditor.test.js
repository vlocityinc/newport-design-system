import { createElement } from 'lwc';
import RecordCreateEditor from '../recordCreateEditor';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';
import { NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import {
    RecordStoreOptionChangedEvent,
    SObjectReferenceChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import {
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTO = 'flow'; // MOCK is added to be able to use the variable in the jest.mock
const MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTO = 'fieldServiceMobileFLow';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const getComboboxStateChangedEvent = (value, displayText = value) => {
    return new CustomEvent('comboboxstatechanged', { detail: { item: { value, displayText } } });
};

const createComponentForTest = (node, processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTO) => {
    const el = createElement('builder_platform_interaction-record-create-editor', { is: RecordCreateEditor });
    Object.assign(el, { node, processType });
    document.body.appendChild(el);
    return el;
};

const toggleOnChangeEvent = new CustomEvent('change', { detail: { checked: true } });

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: () => {
            return Promise.resolve(mockAccountFields);
        },
        SERVER_ACTION_TYPE: jest.requireActual('builder_platform_interaction/serverDataLib').SERVER_ACTION_TYPE
    };
});
jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getChildrenItemsPromise: actual.getChildrenItemsPromise
    };
});
jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn(processType => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTO
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
    };
});

const SELECTORS = {
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    lightningRadioGroup: 'lightning-radio-group',
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    recordInputOutputAssignments: 'builder_platform_interaction-record-input-output-assignments',
    outputResourcePicker: 'builder_platform_interaction-output-resource-picker'
};

const recordCreateNew = {
    guid: '6b7d7855-3f3f-42d5-adcb-008afe9919f5',
    name: { value: '', error: null },
    description: { value: '', error: null },
    label: { value: '', error: null },
    locationX: 557,
    locationY: 33.3125,
    isCanvasElement: true,
    object: { value: '', error: null },
    objectIndex: { value: '0ab294ab-72e1-4f0c-afb4-3b6d101b0e36', error: null },
    getFirstRecordOnly: true,
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: '8a645b13-e95f-4548-a30f-72b7f1fab82d', error: null },
    elementType: 'RecordCreate',
    assignRecordIdToReferenceIndex: { value: '250db198-a848-40c2-9c80-57c24e1d606c', error: null },
    dataType: { value: 'Boolean', error: null }
};
const recordCreateElementWithSObject = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '47519840-0d66-419e-8e47-1bd846ed2589',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateSobject', error: null },
    name: { value: 'testRecordCreateSobject', error: null },
    inputReference: { value: store.accountSObjectVariable.guid, error: null },
    inputReferenceIndex: { value: 'df4de9a1-1ea4-4000-b0bf-980438764548', error: null },
    inputAssignments: [],
    getFirstRecordOnly: true,
    object: { value: '', error: null },
    objectIndex: { value: 'd7786f3c-0df7-449d-b916-3049625ed8c2', error: null },
    dataType: { value: 'Boolean', error: null },
    assignRecordIdToReferenceIndex: { value: '891fe334-3f55-4954-b029-33d9618b829c', error: null }
};
const recordCreateElementWithSObjectCollection = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '34219840-0d66-419e-8e47-1bd846ed2589',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateSObjectCollection', error: null },
    name: { value: 'testRecordCreateSObjectCollection', error: null },
    inputReference: { value: store.accountSObjectCollectionVariable.guid, error: null },
    inputReferenceIndex: { value: 'guid', error: null },
    inputAssignments: [],
    getFirstRecordOnly: false,
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null },
    dataType: { value: 'Boolean', error: null }
};
const recordCreateElementWithFieldsManualNoId = {
    description: { value: '', error: null },
    elementType: ELEMENT_TYPE.RECORD_CREATE,
    guid: '14219840-0d66-419e-8e47-1bd846ed2589',
    isCanvasElement: true,
    locationX: 358,
    locationY: 227,
    label: { value: 'testRecordCreateFieldsManualNoId', error: null },
    name: { value: 'testRecordCreateFieldsManualNoId', error: null },
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: '76919840-0d66-419e-8e47-1bd846ed2583', error: null },
    getFirstRecordOnly: true,
    assignRecordIdToReferenceIndex: { value: '88919840-0d66-419e-8e47-1bd846ed2583', error: null },
    inputAssignments: [
        {
            leftHandSide: { value: 'Account.BillingCountry', error: null },
            rightHandSide: { value: 'myCountry', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rightHandSideGuid: { value: 'myCountry', error: null },
            rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
        }
    ],
    object: { value: 'Account', error: null },
    objectIndex: { value: '23919840-0d66-419e-8e47-1bd846ed2583', error: null },
    assignRecordIdToReference: { value: '', error: null }
};
const recordCreateElementWithFieldsManualWithId = {
    ...recordCreateElementWithFieldsManualNoId,
    label: { value: 'testRecordCreateFieldsManualWithId', error: null },
    name: { value: 'testRecordCreateFieldsManualWithId', error: null },
    assignRecordIdToReference: { value: '56519840-0d66-419e-8e47-1bd846ed2583', error: null }
};
const recordCreateElementWithFieldsAuto = {
    guid: 'dd24a5e0-0754-4359-99e8-7f9e78ce2492',
    description: { value: '', error: null },
    name: { value: 'testRecordCreateFieldsAuto', error: null },
    label: { value: 'testRecordCreateFieldsAuto', error: null },
    locationX: 600,
    locationY: 87.3125,
    isCanvasElement: true,
    object: { value: 'Account', error: null },
    objectIndex: { value: '454e61df-020e-4796-a3cf-bf77a3cdd171', error: null },
    inputAssignments: [
        {
            rowIndex: '897bb057-0a59-4447-8c51-03645d54e1f7',
            leftHandSide: {
                value: 'Account.BillingCity',
                error: null
            },
            rightHandSide: {
                value: 'paris',
                error: null
            },
            rightHandSideDataType: {
                value: 'String',
                error: null
            }
        },
        {
            rowIndex: 'b4779656-6be6-4d39-89e3-d6ca62881e98',
            leftHandSide: {
                value: 'Account.BillingCountry',
                error: null
            },
            rightHandSide: {
                value: 'france',
                error: null
            },
            rightHandSideDataType: {
                value: 'String',
                error: null
            }
        }
    ],
    getFirstRecordOnly: true,
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: '72ac3a63-0124-4f1e-90aa-bc419a39569d', error: null },
    elementType: 'RecordCreate',
    assignRecordIdToReference: { value: '', error: null },
    assignRecordIdToReferenceIndex: { value: 'cd960d83-346d-4c7d-b02b-d8b4b7ce7f16', error: null },
    dataType: { value: 'String', error: null },
    storeOutputAutomatically: true
};

const inputAssignmentElement = {
    leftHandSide: { value: 'Account.Address', error: null },
    rightHandSide: { value: 'myAddress', error: null },
    rightHandSideDataType: { value: 'String', error: null },
    rightHandSideGuid: { value: '345cafc2-7744-4e46-8eaa-f2df29539d2e', error: null },
    rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d2e'
};
const getRecordStoreOption = recordCreateEditor =>
    recordCreateEditor.shadowRoot.querySelector(SELECTORS.recordStoreOption);
const getSObjectOrSObjectCollectionPicker = recordCreateEditor =>
    recordCreateEditor.shadowRoot.querySelector(SELECTORS.sObjectOrSObjectCollectionPicker);
const getEntityResourcePicker = recordCreateEditor =>
    recordCreateEditor.shadowRoot.querySelector(SELECTORS.entityResourcePicker);
const getRecordInputOutputAssignments = recordCreateEditor =>
    recordCreateEditor.shadowRoot.querySelector(SELECTORS.recordInputOutputAssignments);
const getOutputResourcePickerForId = recordCreateEditor =>
    recordCreateEditor.shadowRoot.querySelector(SELECTORS.outputResourcePicker);

describe('record-create-editor', () => {
    describe('new element', () => {
        let recordCreateEditor;
        beforeAll(() => {
            recordCreateEditor = createComponentForTest(recordCreateNew);
        });
        it('should display/hide every expected components (snapshot check)', () => {
            expect(recordCreateEditor).toMatchSnapshot();
        });
        it('Number of record to store should be firstRecord', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
        });
        it('"wayToStoreFields" should be SOBJECT_VARIABLE', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
        });
        it('"storeOutputAutomatically" should be undefined', () => {
            expect(recordCreateEditor.getNode().storeOutputAutomatically).toBeUndefined();
        });
        it('"dataType" should be Boolean', () => {
            expect(recordCreateEditor.getNode().dataType.value).toBe(FLOW_DATA_TYPE.BOOLEAN.value);
        });
        it('validate API', () => {
            const errors = recordCreateEditor.validate();
            expect(errors).toEqual([
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'name' },
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'label' },
                { errorString: 'FlowBuilderValidation.cannotBeBlank', key: 'inputReference' }
            ]);
        });
        describe('process type NOT supporting automatic output', () => {
            describe('changing to separate variables store options and select object', () => {
                beforeAll(async () => {
                    recordCreateEditor = createComponentForTest(recordCreateNew, MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTO);
                    const eventWayToStoreChange = new RecordStoreOptionChangedEvent(
                        true,
                        WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
                    );
                    getRecordStoreOption(recordCreateEditor).dispatchEvent(eventWayToStoreChange);
                    await ticks(1);
                    getEntityResourcePicker(recordCreateEditor).dispatchEvent(getComboboxStateChangedEvent('Contact'));
                    await ticks(1);
                });
                it('should display/hide every expected components (snapshot check)', () => {
                    expect(recordCreateEditor).toMatchSnapshot();
                });
                it('"storeOutputAutomatically" should be false', async () => {
                    expect(recordCreateEditor.node.storeOutputAutomatically).toBe(false);
                });
                it('sets process type ', () => {
                    expect(recordCreateEditor.processType).toBe(MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTO);
                });
            });
        });
    });
    describe('existing element', () => {
        describe('using sObject', () => {
            describe('single record', () => {
                let recordCreateEditor;
                beforeAll(() => {
                    recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
                });
                it('should display/hide every expected components (snapshot check)', () => {
                    expect(recordCreateEditor).toMatchSnapshot();
                });
                it('Number of record to store should be firstRecord', () => {
                    const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                    expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('selected sObject should be displayed', () => {
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(
                        recordCreateElementWithSObject.inputReference.value
                    );
                });
                it('"wayToStoreFields" should be SOBJECT_VARIABLE', () => {
                    const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                    expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                });
                it('"storeOutputAutomatically" should be undefined', () => {
                    expect(recordCreateEditor.node.storeOutputAutomatically).toBeUndefined();
                });
                it('"dataType" should be Boolean', () => {
                    expect(recordCreateEditor.node.dataType.value).toBe(FLOW_DATA_TYPE.BOOLEAN.value);
                });
                describe('Handle Events', () => {
                    beforeEach(() => {
                        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
                        recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
                    });
                    it('Number of record change should empty the sObject picker', async () => {
                        const event = new RecordStoreOptionChangedEvent(false, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                            recordCreateEditor
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                    it('Number of record change should change the sObject or sObject Collection picker placeHolder', async () => {
                        let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                        expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                            'FlowBuilderRecordEditor.searchRecords'
                        );
                        const event = new RecordStoreOptionChangedEvent(false, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                        expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                            'FlowBuilderRecordEditor.searchRecordCollections'
                        );
                    });
                    it('handle Input Reference Changed', async () => {
                        const event = new SObjectReferenceChangedEvent('sObj2', null);
                        getSObjectOrSObjectCollectionPicker(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                            recordCreateEditor
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('sObj2');
                    });
                });
                describe('changing to separate variables store options and select object', () => {
                    beforeAll(async () => {
                        recordCreateEditor = createComponentForTest(recordCreateElementWithSObject);
                        const eventWayToStoreChange = new RecordStoreOptionChangedEvent(
                            true,
                            WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
                        );
                        getRecordStoreOption(recordCreateEditor).dispatchEvent(eventWayToStoreChange);
                        await ticks(1);
                        getEntityResourcePicker(recordCreateEditor).dispatchEvent(
                            getComboboxStateChangedEvent('Contact')
                        );
                        await ticks(1);
                    });
                    it('should display/hide every expected components (snapshot check)', () => {
                        expect(recordCreateEditor).toMatchSnapshot();
                    });
                    it('"storeOutputAutomatically" should be true', async () => {
                        expect(recordCreateEditor.node.storeOutputAutomatically).toBe(true);
                    });
                });
                describe('Process type NOT supporting automatic output', () => {
                    describe('changing to separate variables store options and select object', () => {
                        beforeAll(async () => {
                            recordCreateEditor = createComponentForTest(
                                recordCreateElementWithSObject,
                                MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTO
                            );
                            const eventWayToStoreChange = new RecordStoreOptionChangedEvent(
                                true,
                                WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
                            );
                            getRecordStoreOption(recordCreateEditor).dispatchEvent(eventWayToStoreChange);
                            await ticks(1);
                            getEntityResourcePicker(recordCreateEditor).dispatchEvent(
                                getComboboxStateChangedEvent('Contact')
                            );
                            await ticks(1);
                        });
                        it('should display/hide every expected components (snapshot check)', () => {
                            expect(recordCreateEditor).toMatchSnapshot();
                        });
                        it('"storeOutputAutomatically" should be false', async () => {
                            expect(recordCreateEditor.node.storeOutputAutomatically).toBe(false);
                        });
                    });
                });
            });
            describe('collection', () => {
                let recordCreateEditor;
                beforeAll(() => {
                    recordCreateEditor = createComponentForTest(recordCreateElementWithSObjectCollection);
                });
                it('should display/hide every expected components (snapshot check)', () => {
                    expect(recordCreateEditor).toMatchSnapshot();
                });
                it('selected sObject Collection should be displayed', () => {
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(store.accountSObjectCollectionVariable.guid);
                });
                it('Number of record to store should be all records', () => {
                    const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                    expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
                });
                it('"storeOutputAutomatically" should be undefined', () => {
                    expect(recordCreateEditor.node.storeOutputAutomatically).toBeUndefined();
                });
                it('"dataType" should be Boolean', () => {
                    expect(recordCreateEditor.node.dataType.value).toBe(FLOW_DATA_TYPE.BOOLEAN.value);
                });
                describe('Handle Events', () => {
                    beforeEach(() => {
                        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
                        recordCreateEditor = createComponentForTest(recordCreateElementWithSObjectCollection);
                    });
                    it('Number of record change should empty the sObject picker', async () => {
                        const event = new RecordStoreOptionChangedEvent(true, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                            recordCreateEditor
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                    it('Number of record change should change the sObject or sObject Collection picker placeHolder', async () => {
                        let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                        expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                            'FlowBuilderRecordEditor.searchRecordCollections'
                        );
                        const event = new RecordStoreOptionChangedEvent(true, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                        getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                        expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                            'FlowBuilderRecordEditor.searchRecords'
                        );
                    });
                    it('handle Input Reference Changed', async () => {
                        const event = new SObjectReferenceChangedEvent('sObj2', null);
                        getSObjectOrSObjectCollectionPicker(recordCreateEditor).dispatchEvent(event);
                        await ticks(1);
                        const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                            recordCreateEditor
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('sObj2');
                    });
                });
            });
        });
        describe('using fields', () => {
            describe('manual', () => {
                describe('no id', () => {
                    let recordCreateEditor;
                    beforeAll(() => {
                        recordCreateEditor = createComponentForTest(recordCreateElementWithFieldsManualNoId);
                    });
                    it('Selected object should not be null', () => {
                        const entityResourcePicker = getEntityResourcePicker(recordCreateEditor);
                        expect(entityResourcePicker).not.toBeNull();
                    });
                    it('"recordInputOutputAssignment" component should be displayed', () => {
                        const recordInputOutputAssignment = getRecordInputOutputAssignments(recordCreateEditor);
                        expect(recordInputOutputAssignment).not.toBeNull();
                    });
                    it('"outputResourcePicker" component for id should be displayed', () => {
                        const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                        expect(outputResourcePickerForId).not.toBeNull();
                    });
                    it('Number of record to store should be all records', () => {
                        const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                        expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                    });
                    it('wayToStoreFields should be separateVariable', () => {
                        const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                        expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
                    });
                    it('it should only display creatable fields', () => {
                        const recordInputOutputAssignments = getRecordInputOutputAssignments(recordCreateEditor);
                        expect(recordInputOutputAssignments.recordFields).not.toBeNull();
                        const fields = Object.values(recordInputOutputAssignments.recordFields);
                        expect(fields).toContainEqual(
                            expect.objectContaining({
                                creatable: true
                            })
                        );
                        expect(fields).not.toContainEqual(
                            expect.objectContaining({
                                creatable: false
                            })
                        );
                    });
                    it('enables field drilldown for outputResourcePicker', () => {
                        const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                        const config = outputResourcePickerForId.comboboxConfig;
                        expect(config.enableFieldDrilldown).toEqual(true);
                    });
                    it('storeOutputAutomatically should be undefined', () => {
                        expect(recordCreateEditor.node.storeOutputAutomatically).toBeUndefined();
                    });
                });
                describe('with id', () => {
                    let recordCreateEditor;
                    beforeAll(() => {
                        recordCreateEditor = createComponentForTest(recordCreateElementWithFieldsManualWithId);
                    });
                    it('Selected object should not be null', () => {
                        const entityResourcePicker = getEntityResourcePicker(recordCreateEditor);
                        expect(entityResourcePicker).not.toBeNull();
                    });
                    it('"recordInputOutputAssignment" component should be displayed', () => {
                        const recordInputOutputAssignment = getRecordInputOutputAssignments(recordCreateEditor);
                        expect(recordInputOutputAssignment).not.toBeNull();
                    });
                    it('"outputResourcePicker" component for id should be displayed', () => {
                        const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                        expect(outputResourcePickerForId).not.toBeNull();
                    });
                    it('Number of record to store should be all records', () => {
                        const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                        expect(recordStoreOption.numberOfRecordsToStore).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                    });
                    it('wayToStoreFields should be separateVariable', () => {
                        const recordStoreOption = getRecordStoreOption(recordCreateEditor);
                        expect(recordStoreOption.wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
                    });
                    it('it should only display creatable fields', () => {
                        const recordInputOutputAssignments = getRecordInputOutputAssignments(recordCreateEditor);
                        expect(recordInputOutputAssignments.recordFields).not.toBeNull();
                        const fields = Object.values(recordInputOutputAssignments.recordFields);
                        expect(fields).toContainEqual(
                            expect.objectContaining({
                                creatable: true
                            })
                        );
                        expect(fields).not.toContainEqual(
                            expect.objectContaining({
                                creatable: false
                            })
                        );
                    });
                    it('enables field drilldown for outputResourcePicker', () => {
                        const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                        const config = outputResourcePickerForId.comboboxConfig;
                        expect(config.enableFieldDrilldown).toEqual(true);
                    });
                    it('storeOutputAutomatically should be undefined', () => {
                        expect(recordCreateEditor.node.storeOutputAutomatically).toBeUndefined();
                    });
                });
            });
            describe('automatic', () => {
                let recordCreateEditor;
                beforeEach(() => {
                    recordCreateEditor = createComponentForTest(recordCreateElementWithFieldsAuto);
                });
                it('Selected "object" should be displayed', () => {
                    const entityResourcePicker = getEntityResourcePicker(recordCreateEditor);
                    expect(entityResourcePicker.value).toBe(recordCreateElementWithFieldsAuto.object.value);
                });
                it('"recordInputOutputAssignment" should be displayed', () => {
                    const recordInputOutputAssignment = getRecordInputOutputAssignments(recordCreateEditor);
                    expect(recordInputOutputAssignment.inputOutputAssignmentsItems).toEqual(
                        recordCreateElementWithFieldsAuto.inputAssignments
                    );
                });
                it('"outputResourcePicker" component for id should NOT be displayed', () => {
                    const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                    expect(outputResourcePickerForId).toBeNull();
                });
                it('Advanced Option Component should be visible', () => {
                    expect(getUseAdvancedOptionComponent(recordCreateEditor)).not.toBeNull();
                });
                it('"useAdvancedOptionsCheckbox" should be unchecked', async () => {
                    await ticks(1);
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(recordCreateEditor);
                    expect(advancedOptionCheckbox).toBeDefined();
                    expect(advancedOptionCheckbox.type).toBe('checkbox');
                    expect(advancedOptionCheckbox.checked).toBe(false);
                });
                it('storeOutputAutomatically should be true', () => {
                    expect(recordCreateEditor.node.storeOutputAutomatically).toBe(true);
                });
                describe('Handle Events with advanced option', () => {
                    let advancedOptionCheckbox;
                    beforeEach(() => {
                        advancedOptionCheckbox = getAdvancedOptionCheckbox(recordCreateEditor);
                        advancedOptionCheckbox.dispatchEvent(toggleOnChangeEvent);
                    });
                    it('Use adavanced checkbox should be checked', async () => {
                        await ticks(1);
                        expect(advancedOptionCheckbox.checked).toBe(true);
                    });
                    it('"outputResourcePicker" component for id should be displayed', () => {
                        const outputResourcePickerForId = getOutputResourcePickerForId(recordCreateEditor);
                        expect(outputResourcePickerForId).not.toBeNull();
                    });
                    it('storeOutputAutomatically should be false', () => {
                        expect(recordCreateEditor.node.storeOutputAutomatically).toBe(false);
                    });
                });
            });
            describe('Handle Events with fields', () => {
                let recordCreateEditor;
                beforeEach(() => {
                    recordCreateEditor = createComponentForTest(recordCreateElementWithFieldsManualNoId);
                });
                it('change number record to store to All records, sObject picker should changed', async () => {
                    const event = new RecordStoreOptionChangedEvent(true, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                    getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
                    await ticks(1);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordCreateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', async () => {
                    const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
                    getRecordInputOutputAssignments(recordCreateEditor).dispatchEvent(addRecordFieldAssignmentEvent);
                    await ticks(1);
                    expect(recordCreateEditor.node.inputAssignments).toHaveLength(2);
                });
                it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', async () => {
                    const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                        0,
                        inputAssignmentElement,
                        null
                    );
                    getRecordInputOutputAssignments(recordCreateEditor).dispatchEvent(updateRecordFieldAssignmentEvent);
                    await ticks(1);
                    expect(recordCreateEditor.node.inputAssignments[0]).toMatchObject(inputAssignmentElement);
                });
                it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', async () => {
                    const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
                    getRecordInputOutputAssignments(recordCreateEditor).dispatchEvent(deleteRecordFieldAssignmentEvent);
                    await ticks(1);
                    expect(recordCreateEditor.node.inputAssignments).toHaveLength(0);
                });
            });
        });
    });
});
