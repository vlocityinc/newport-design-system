// @ts-nocheck
import { createElement } from 'lwc';
import RecordUpdateEditor from '../recordUpdateEditor';
import * as storeMockedData from 'mock/storeData';
import { PropertyChangedEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { CONDITION_LOGIC, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    RecordStoreOptionChangedEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent
} from 'builder_platform_interaction/events';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { allEntities as mockEntities } from 'serverData/GetEntities/allEntities.json';
import { ticks } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

function createComponentForTest(node) {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
}

const selectors = {
    sObjectOrSObjectCollectionPicker: 'builder_platform_interaction-sobject-or-sobject-collection-picker',
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    inputOutputAssignments: 'builder_platform_interaction-record-input-output-assignments',
    fieldToFerovExpBuilder: 'builder_platform_interaction-field-to-ferov-expression-builder'
};

const defaultRecordUpdateElement = () => {
    return {
        description: { value: '', error: null },
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        filters: [],
        guid: 'RECORDUPDATE_1',
        inputAssignments: [],
        isCanvasElement: true,
        inputReference: { value: '', error: null },
        inputReferenceIndex: { value: 'guid', error: null },
        label: { value: '', error: null },
        name: { value: '', error: null },
        object: { value: '', error: null },
        objectIndex: { value: 'guid', error: null },
        useSobject: true
    };
};

const recordUpdateElementWithSObject = () => {
    return {
        description: { value: '', error: null },
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        guid: 'RECORDUPDATE_1',
        isCanvasElement: true,
        label: { value: 'testRecord', error: null },
        locationX: 358,
        locationY: 227,
        name: { value: 'testRecord', error: null },
        useSobject: true,
        inputReference: {
            value: storeMockedData.accountSObjectVariable.guid,
            error: null
        },
        inputReferenceIndex: { value: 'guid', error: null },
        object: { value: null, error: null },
        objectIndex: { value: 'guid', error: null }
    };
};

const recordUpdateElementWithFields = () => {
    return {
        description: { value: '', error: null },
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        guid: 'RECORDUPDATE_2',
        isCanvasElement: true,
        label: { value: 'testRecordFields', error: null },
        locationX: 358,
        locationY: 227,
        name: { value: 'testRecordFields', error: null },
        useSobject: false,
        inputReferenceIndex: { value: 'guid', error: null },
        inputAssignments: [
            {
                leftHandSide: { value: 'Account.BillingCountry', error: null },
                rightHandSide: { value: 'myCountry', error: null },
                rightHandSideDataType: { value: 'String', error: null },
                rightHandSideGuid: { value: 'myCountry', error: null },
                rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d1d'
            }
        ],
        filters: [],
        filterLogic: { value: CONDITION_LOGIC.AND, error: null },
        object: { value: 'account', error: null },
        objectIndex: { value: 'guid', error: null }
    };
};

const filterElement = {
    leftHandSide: { value: 'Account.Id', error: null },
    operator: { value: 'EqualTo', error: null },
    rightHandSide: { value: '{!myFormula1}', error: null },
    rightHandSideDataType: { value: 'reference', error: null },
    rightHandSideGuid: { value: 'FORMULA_8', error: null },
    rowIndex: '112'
};

const inputAssignmentElement = {
    leftHandSide: { value: 'Account.Address', error: null },
    rightHandSide: { value: 'myAddress', error: null },
    rightHandSideDataType: { value: 'String', error: null },
    rightHandSideGuid: { value: 'myAddress', error: null },
    rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d2e'
};

jest.mock('builder_platform_interaction/sobjectLib', () => {
    return {
        fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
        getUpdateableEntities: jest.fn().mockImplementation(() => {
            return mockEntities;
        }),
        ENTITY_TYPE: jest.requireActual('builder_platform_interaction/sobjectLib').ENTITY_TYPE
    };
});

const getSObjectOrSObjectCollectionPicker = recordUpdateEditor => {
    return recordUpdateEditor.shadowRoot.querySelector(selectors.sObjectOrSObjectCollectionPicker);
};

const getEntityResourcePicker = recordUpdateEditor => {
    return recordUpdateEditor.shadowRoot.querySelector(selectors.entityResourcePicker);
};

const getRecordStoreOption = recordUpdateEditor => {
    return recordUpdateEditor.shadowRoot.querySelector(selectors.recordStoreOption);
};

const getRecordFilter = recordUpdateEditor => {
    return recordUpdateEditor.shadowRoot.querySelector(selectors.recordFilter);
};

const getInputOutputAssignments = recordUpdateEditor => {
    return recordUpdateEditor.shadowRoot.querySelector(selectors.inputOutputAssignments);
};

describe('record-update-editor', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('with default values', () => {
        let recordUpdateEditor;
        beforeEach(() => {
            recordUpdateEditor = createComponentForTest(defaultRecordUpdateElement());
        });
        it('contains an entity resource picker for sobject', () => {
            const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectPicker).not.toBeNull();
        });
        it('contains an record store option component', () => {
            const recordStoreOption = getRecordStoreOption(recordUpdateEditor);
            expect(recordStoreOption).not.toBeNull();
        });
        it('Other elements should not be visible', () => {
            expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
            expect(getRecordFilter(recordUpdateEditor)).toBeNull();
            expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
        });
    });
});

describe('record-update-editor using sObject', () => {
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('Edit existing record element', () => {
        it('Selected sObject should be the same', () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject());
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariable.guid);
        });
    });
    describe('Handle Events', () => {
        it('handle Input Reference Changed', async () => {
            const recordUpdateEditor = createComponentForTest(recordUpdateElementWithSObject());
            const event = new SObjectReferenceChangedEvent(storeMockedData.accountSObjectVariable.guid, null);
            let sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            sObjectOrSObjectCollectionPicker.dispatchEvent(event);
            await ticks(1);
            sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe(storeMockedData.accountSObjectVariable.guid);
        });
    });
});
describe('record-update-editor usung fields', () => {
    let recordUpdateEditor;
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    beforeEach(() => {
        recordUpdateEditor = createComponentForTest(recordUpdateElementWithFields());
    });
    describe('Edit existing record element using fields assignment', () => {
        it('entity resource picker should be visible & sObject picker should not be visible', () => {
            const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker).toBeNull();
            expect(entityResourcePicker).not.toBeNull();
        });
        it('it should only display editable fields', () => {
            const inputOutputAssignments = getInputOutputAssignments(recordUpdateEditor);
            expect(inputOutputAssignments.recordFields).not.toBeNull();
            const fields = Object.values(inputOutputAssignments.recordFields);
            expect(fields).toContainEqual(
                expect.objectContaining({
                    editable: true
                })
            );
            expect(fields).not.toContainEqual(
                expect.objectContaining({
                    editable: false
                })
            );
        });
    });
    describe('Handle Events', () => {
        it('change number record to store to All records, sObject picker should changed', async () => {
            const event = new RecordStoreOptionChangedEvent(true, '', false);
            getRecordStoreOption(recordUpdateEditor).dispatchEvent(event);
            await ticks(1);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
            expect(sObjectOrSObjectCollectionPicker.value).toBe('');
        });
        it('handle UpdateRecordFilterEvent should update the filter element', async () => {
            const updateRecordFilterEvent = new UpdateRecordFilterEvent(0, filterElement, null);
            getRecordFilter(recordUpdateEditor).dispatchEvent(updateRecordFilterEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.filters[0]).toMatchObject(filterElement);
        });
        it('handle AddRecordFilterEvent should add a filter element', async () => {
            const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordUpdateEditor).dispatchEvent(addRecordFilterEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.filters).toHaveLength(1);
        });
        it('record filter fire DeleteRecordFilterEvent', async () => {
            const deleteRecordFilterEvent = new DeleteRecordFilterEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getRecordFilter(recordUpdateEditor).dispatchEvent(deleteRecordFilterEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.filters).toHaveLength(0);
        });
        it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', async () => {
            const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(addRecordFieldAssignmentEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.inputAssignments).toHaveLength(2);
        });
        it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', async () => {
            const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                0,
                inputAssignmentElement,
                null
            );
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(updateRecordFieldAssignmentEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.inputAssignments[0]).toMatchObject(inputAssignmentElement);
        });
        it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', async () => {
            const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
            getInputOutputAssignments(recordUpdateEditor).dispatchEvent(deleteRecordFieldAssignmentEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.inputAssignments).toHaveLength(0);
        });
        it('handle record filter logic Change event', async () => {
            const propertyChangeEvent = new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.OR);
            getRecordFilter(recordUpdateEditor).dispatchEvent(propertyChangeEvent);
            await ticks(1);
            expect(recordUpdateEditor.node.filterLogic.value).toBe(CONDITION_LOGIC.OR);
        });
    });
});
