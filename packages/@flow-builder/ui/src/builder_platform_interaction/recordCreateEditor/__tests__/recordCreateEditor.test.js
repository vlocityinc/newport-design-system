import { createElement } from 'lwc';
import RecordCreateEditor from '../recordCreateEditor';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';
import {
    NUMBER_RECORDS_TO_STORE,
    WAY_TO_STORE_FIELDS
} from 'builder_platform_interaction/recordEditorLib';
import { mockAccountFields } from 'mock/serverEntityData';
import {
    RecordStoreOptionChangedEvent,
    SObjectReferenceChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/outputResourcePicker', () =>
    require('builder_platform_interaction_mocks/outputResourcePicker')
);

function createComponentForTest(node) {
    const el = createElement(
        'builder_platform_interaction-record-create-editor',
        { is: RecordCreateEditor }
    );
    el.node = node;
    document.body.appendChild(el);
    return el;
}

// Mocking out the fetch function to return Account fields
jest.mock('builder_platform_interaction/serverDataLib', () => {
    return {
        fetchOnce: () => {
            return Promise.resolve(JSON.stringify(mockAccountFields));
        },
        SERVER_ACTION_TYPE: require.requireActual(
            '../../serverDataLib/serverDataLib.js'
        ).SERVER_ACTION_TYPE
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = require.requireActual(
        '../../expressionUtils/expressionUtils.js'
    );
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getSecondLevelItems: actual.getSecondLevelItems
    };
});

const selectors = {
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker:
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    lightningRadioGroup: 'lightning-radio-group',
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    inputOutputAssignments:
        'builder_platform_interaction-record-input-output-assignments',
    outputResourcePicker: 'builder_platform_interaction-output-resource-picker'
};

const recordCreateElementWithSObject = {
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    guid: 'RECORDCREATE_1',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecord', error: null },
    inputReference: { value: store.accountSObjectVariableGuid, error: null },
    inputReferenceIndex: { value: 'guid', error: null },
    inputAssignments: [],
    getFirstRecordOnly: true,
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null }
};

const recordCreateElementWithSObjectCollection = {
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    guid: 'RECORDCREATE_1',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecord', error: null },
    inputReference: {
        value: store.accountSObjectCollectionVariableGuid,
        error: null
    },
    inputReferenceIndex: { value: 'guid', error: null },
    inputAssignments: [],
    getFirstRecordOnly: false,
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null }
};

const recordCreateElementWithFields = () => ({
    description: { value: '', error: null },
    elementType: 'RECORD_CREATE',
    guid: 'RECORDCREATE_2',
    isCanvasElement: true,
    label: { value: 'testRecordFields', error: null },
    locationX: 358,
    locationY: 227,
    name: { value: 'testRecordFields', error: null },
    inputReference: { value: '', error: null },
    inputReferenceIndex: { value: 'guid', error: null },
    getFirstRecordOnly: true,
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
    objectIndex: { value: 'guid', error: null },
    assignRecordIdToReference: { value: '', error: null }
});

const inputAssignmentElement = {
    leftHandSide: { value: 'Account.Address', error: null },
    rightHandSide: { value: 'myAddress', error: null },
    rightHandSideDataType: { value: 'String', error: null },
    rightHandSideGuid: { value: 'myAddress', error: null },
    rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d2e'
};

const getRecordStoreOption = recordCreateEditor => {
    return recordCreateEditor.shadowRoot.querySelector(
        selectors.recordStoreOption
    );
};

const getSObjectOrSObjectCollectionPicker = recordCreateEditor => {
    return recordCreateEditor.shadowRoot.querySelector(
        selectors.sObjectOrSObjectCollectionPicker
    );
};

const getEntityResourcePicker = recordCreateEditor => {
    return recordCreateEditor.shadowRoot.querySelector(
        selectors.entityResourcePicker
    );
};

const getInputOutputAssignments = recordCreateEditor => {
    return recordCreateEditor.shadowRoot.querySelector(
        selectors.inputOutputAssignments
    );
};

const getAssignRecordIdToReference = recordCreateEditor => {
    return recordCreateEditor.shadowRoot.querySelector(
        selectors.outputResourcePicker
    );
};

describe('record-create-editor', () => {
    describe('Edit existing record element using sObject', () => {
        let recordCreateEditor;
        beforeEach(() => {
            recordCreateEditor = createComponentForTest(
                recordCreateElementWithSObject
            );
        });
        it('inputoutputAssignment should not be displayed', () => {
            const inputoutputAssignment = getInputOutputAssignments(
                recordCreateEditor
            );
            expect(inputoutputAssignment).toBeNull();
        });
        it('assignRecordIdToReference should not be displayed', () => {
            const assignRecordIdToReference = getAssignRecordIdToReference(
                recordCreateEditor
            );
            expect(assignRecordIdToReference).toBeNull();
        });
        it('Number of record to store should be firstRecord', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(
                NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            );
        });
        it('Selected sObject should be the same', () => {
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                recordCreateEditor
            );
            expect(sObjectOrSObjectCollectionPicker.value).toBe(
                store.accountSObjectVariableGuid
            );
        });
        it('wayToStoreFields should be SOBJECT_VARIABLE', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.wayToStoreFields).toBe(
                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
            );
        });
    });
    describe('Edit existing record element using sObject Collection', () => {
        let recordCreateEditor;
        beforeEach(() => {
            recordCreateEditor = createComponentForTest(
                recordCreateElementWithSObjectCollection
            );
        });
        it('Selected sObject Collection should be the same', () => {
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                recordCreateEditor
            );
            expect(sObjectOrSObjectCollectionPicker.value).toBe(
                store.accountSObjectCollectionVariableGuid
            );
        });
        it('inputoutputAssignment component should not be displayed', () => {
            const inputoutputAssignment = getInputOutputAssignments(
                recordCreateEditor
            );
            expect(inputoutputAssignment).toBeNull();
        });
        it('assignRecordIdToReference component should not be displayed', () => {
            const assignRecordIdToReference = getAssignRecordIdToReference(
                recordCreateEditor
            );
            expect(assignRecordIdToReference).toBeNull();
        });
        it('Number of record to store should be all records', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(
                NUMBER_RECORDS_TO_STORE.ALL_RECORDS
            );
        });
    });
    describe('Edit existing record element using fields', () => {
        let recordCreateEditor;
        beforeEach(() => {
            recordCreateEditor = createComponentForTest(
                recordCreateElementWithFields()
            );
        });
        it('Selected object should not be null', () => {
            const entityResourcePicker = getEntityResourcePicker(
                recordCreateEditor
            );
            expect(entityResourcePicker).not.toBeNull();
        });
        it('inputoutputAssignment component should be displayed', () => {
            const inputoutputAssignment = getInputOutputAssignments(
                recordCreateEditor
            );
            expect(inputoutputAssignment).not.toBeNull();
        });
        it('assignRecordIdToReference component should be displayed', () => {
            const assignRecordIdToReference = getAssignRecordIdToReference(
                recordCreateEditor
            );
            expect(assignRecordIdToReference).not.toBeNull();
        });
        it('Number of record to store should be all records', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.numberOfRecordsToStore).toBe(
                NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            );
        });
        it('wayToStoreFields should be separateVariable', () => {
            const recordStoreOption = getRecordStoreOption(recordCreateEditor);
            expect(recordStoreOption.wayToStoreFields).toBe(
                WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
            );
        });
        it('it should only display creatable fields', () => {
            const inputOutputAssignments = getInputOutputAssignments(
                recordCreateEditor
            );
            expect(inputOutputAssignments.recordFields).not.toBeNull();
            const fields = Object.values(inputOutputAssignments.recordFields);
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
            const outputResourcePicker = getAssignRecordIdToReference(
                recordCreateEditor
            );
            const config = outputResourcePicker.comboboxConfig;
            expect(config.enableFieldDrilldown).toEqual(true);
        });
    });
    describe('Handle Events with fields', () => {
        let recordCreateEditor;
        beforeEach(() => {
            recordCreateEditor = createComponentForTest(
                recordCreateElementWithFields()
            );
        });
        it('change number record to store to All records, sObject picker should changed', () => {
            const event = new RecordStoreOptionChangedEvent(
                true,
                WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE,
                false
            );
            getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                    recordCreateEditor
                );
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', () => {
            const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
            getInputOutputAssignments(recordCreateEditor).dispatchEvent(
                addRecordFieldAssignmentEvent
            );
            return Promise.resolve().then(() => {
                expect(recordCreateEditor.node.inputAssignments).toHaveLength(
                    2
                );
            });
        });
        it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', () => {
            const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                0,
                inputAssignmentElement,
                null
            );
            getInputOutputAssignments(recordCreateEditor).dispatchEvent(
                updateRecordFieldAssignmentEvent
            );
            return Promise.resolve().then(() => {
                expect(
                    recordCreateEditor.node.inputAssignments[0]
                ).toMatchObject(inputAssignmentElement);
            });
        });
        it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', () => {
            const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(
                0
            ); // This is using the numerical rowIndex not the property rowIndex
            getInputOutputAssignments(recordCreateEditor).dispatchEvent(
                deleteRecordFieldAssignmentEvent
            );
            return Promise.resolve().then(() => {
                expect(recordCreateEditor.node.inputAssignments).toHaveLength(
                    0
                );
            });
        });
    });
    describe('Handle Events with sObject', () => {
        let recordCreateEditor;
        beforeEach(() => {
            const sObjectVariableElement =
                store.elements[store.accountSObjectVariableGuid];
            expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                sObjectVariableElement
            );
            recordCreateEditor = createComponentForTest(
                recordCreateElementWithSObject
            );
        });
        it('Number of record change should empty the sObject picker', () => {
            const event = new RecordStoreOptionChangedEvent(false, '', false);
            getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                    recordCreateEditor
                );
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });
        });
        it('Number of record change should change the sObject or sObject Collection picker placeHolder', () => {
            let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                recordCreateEditor
            );
            expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                'FlowBuilderRecordEditor.sObjectVariablePlaceholder'
            );
            const event = new RecordStoreOptionChangedEvent(false, '', false);
            getRecordStoreOption(recordCreateEditor).dispatchEvent(event);
            return Promise.resolve().then(() => {
                sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                    recordCreateEditor
                );
                expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                    'FlowBuilderRecordEditor.sObjectCollectionVariablePlaceholder'
                );
            });
        });
        it('handle Input Reference Changed', () => {
            const event = new SObjectReferenceChangedEvent('sObj2', null);
            getSObjectOrSObjectCollectionPicker(
                recordCreateEditor
            ).dispatchEvent(event);
            return Promise.resolve().then(() => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                    recordCreateEditor
                );
                expect(sObjectOrSObjectCollectionPicker.value).toBe('sObj2');
            });
        });
    });
});
