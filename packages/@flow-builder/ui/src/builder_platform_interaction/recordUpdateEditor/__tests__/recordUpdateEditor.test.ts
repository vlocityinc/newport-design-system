import { createElement } from 'lwc';
import RecordUpdateEditor from '../recordUpdateEditor';
import { accountSObjectVariable, updateAccountWithFilter } from 'mock/storeData';
import { PropertyChangedEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { accountFields as mockAccountFields } from 'serverData/GetFieldsForEntity/accountFields.json';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
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
import { INTERACTION_COMPONENTS_SELECTORS, ticks } from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/sobjectLib', () => ({
    fetchFieldsForEntity: jest.fn().mockImplementation(() => Promise.resolve(mockAccountFields)),
    getUpdateableEntities: jest.fn().mockImplementation(() => mockEntities),
    ENTITY_TYPE: jest.requireActual('builder_platform_interaction/sobjectLib').ENTITY_TYPE,
    getEntity: jest.fn().mockImplementation((entityName) => mockEntities.find(({ apiName }) => apiName === entityName))
}));
jest.mock('builder_platform_interaction/storeUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/storeUtils');
    return Object.assign({}, actual, {
        getElementByGuid: jest.fn().mockReturnValue({})
    });
});
const createComponentForTest = (node: {}) => {
    const el = createElement('builder_platform_interaction-record-update-editor', { is: RecordUpdateEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const newElementNode = {
    guid: '574474cf-2e90-43e4-8f04-95a03e87dd8d',
    name: {
        value: '',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: '',
        error: null
    },
    locationX: 444,
    locationY: 63.3125,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true
    },
    elementSubtype: {
        value: null,
        error: null
    },
    inputReference: {
        value: '',
        error: null
    },
    inputReferenceIndex: {
        value: '8fd8d550-7478-4411-93ab-3c844fb93cfc',
        error: null
    },
    maxConnections: 2,
    availableConnections: [
        {
            type: 'REGULAR'
        },
        {
            type: 'FAULT'
        }
    ],
    elementType: 'RecordUpdate',
    inputAssignments: [],
    useSobject: true,
    filters: [
        {
            rowIndex: 'd181b25d-bda7-4b73-8286-82961bd3270d',
            leftHandSide: {
                value: '',
                error: null
            },
            rightHandSide: {
                value: '',
                error: null
            },
            rightHandSideDataType: {
                value: '',
                error: null
            },
            operator: {
                value: '',
                error: null
            }
        }
    ],
    filterLogic: {
        value: 'and',
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: '0d5629a2-48b2-4ea0-9603-a7a43e0a0ca6',
        error: null
    },
    dataType: {
        value: 'Boolean',
        error: null
    }
};

const getSObjectOrSObjectCollectionPicker = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);

const getEntityResourcePicker = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

const getRecordStoreOption = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);

const getRecordFilter = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

const getInputOutputAssignments = (recordUpdateEditor) =>
    recordUpdateEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);

describe('record-update-editor', () => {
    describe('new', () => {
        describe('using sObject', () => {
            let recordUpdateEditor;
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(newElementNode);
            });
            it('contains an entity resource picker for sobject', () => {
                const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectPicker).not.toBeNull();
            });
            it('contains a record store option component', () => {
                const recordStoreOption = getRecordStoreOption(recordUpdateEditor);
                expect(recordStoreOption).not.toBeNull();
            });
            it('Other elements should not be visible', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
            });
            it('has no sObject selected', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe('');
            });

            describe('Handle Events', () => {
                it('"SObjectReferenceChangedEvent" (inputReference) changed', async () => {
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(accountSObjectVariable.guid, null)
                    );
                    await ticks(1);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
                });
            });
        });
    });
    describe('existing', () => {
        describe('using sObject', () => {
            let recordUpdateEditor, updateElement;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(flowWithAllElementsUIModel);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                updateElement = getElementByDevName('updateSObject');
                const recordUpdateNode = getElementForPropertyEditor(updateElement);
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('contains an entity resource picker for sobject', () => {
                const sObjectPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectPicker).not.toBeNull();
            });
            it('contains a record store option component', () => {
                const recordStoreOption = getRecordStoreOption(recordUpdateEditor);
                expect(recordStoreOption).not.toBeNull();
            });
            it('other elements (entityResourcePicker, recordFilter, inputOutputAssignments) should not be visible', () => {
                expect(getEntityResourcePicker(recordUpdateEditor)).toBeNull();
                expect(getRecordFilter(recordUpdateEditor)).toBeNull();
                expect(getInputOutputAssignments(recordUpdateEditor)).toBeNull();
            });
            it('has correct sObject selected', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.value).toBe(updateElement.inputReference);
            });
            it('supports pills by default', () => {
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker.isPillSupported).toBe(true);
            });

            describe('Handle Events', () => {
                it('"SObjectReferenceChangedEvent" (inputReference)', async () => {
                    const event = new SObjectReferenceChangedEvent(accountSObjectVariable.guid, null);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(event);
                    await ticks(1);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(accountSObjectVariable.guid);
                });
            });
        });
        describe('using fields', () => {
            let recordUpdateEditor, recordUpdateNode;
            beforeAll(() => {
                // @ts-ignore
                Store.setMockState(flowWithAllElementsUIModel);
                recordUpdateNode = getElementForPropertyEditor(updateAccountWithFilter);
            });
            afterAll(() => {
                // @ts-ignore
                Store.resetStore();
            });
            beforeEach(() => {
                recordUpdateEditor = createComponentForTest(recordUpdateNode);
            });
            it('entity resource picker should be visible & sObject picker should not be visible', () => {
                const entityResourcePicker = getEntityResourcePicker(recordUpdateEditor);
                const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                expect(sObjectOrSObjectCollectionPicker).toBeNull();
                expect(entityResourcePicker).not.toBeNull();
            });
            it('should only display editable fields in "inputOutputAssignments"', () => {
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
            describe('Handle Events', () => {
                it('"RecordStoreOptionChangedEvent" change number record to store to All records, sObject picker should changed', async () => {
                    getRecordStoreOption(recordUpdateEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(true, '', false)
                    );
                    await ticks(1);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordUpdateEditor);
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                it('"UpdateRecordFilterEvent" should update the filter element', async () => {
                    const [filterElement] = updateAccountWithFilter.filters;
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new UpdateRecordFilterEvent(0, filterElement));
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters[0]).toMatchObject(filterElement);
                });
                it('"AddRecordFilterEvent" should add a filter element', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new AddRecordFilterEvent());
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters).toHaveLength(4);
                });
                it('"DeleteRecordFilterEvent" fired by record filter', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(new DeleteRecordFilterEvent(0));
                    await ticks(1);
                    expect(recordUpdateEditor.node.filters).toHaveLength(2);
                });
                it('"AddRecordFieldAssignmentEvent" should add an input assignments element', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(new AddRecordFieldAssignmentEvent());
                    await ticks(1);
                    expect(recordUpdateEditor.node.inputAssignments).toHaveLength(2);
                });
                it('"UpdateRecordFieldAssignmentEvent" should update the input assignments element', async () => {
                    const [inputAssignmentElement] = updateAccountWithFilter.inputAssignments;
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new UpdateRecordFieldAssignmentEvent(0, inputAssignmentElement, null)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.node.inputAssignments[0]).toMatchObject(inputAssignmentElement);
                });
                it('"DeleteRecordFieldAssignmentEvent" should delete the input assignments', async () => {
                    getInputOutputAssignments(recordUpdateEditor).dispatchEvent(
                        new DeleteRecordFieldAssignmentEvent(0)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.getNode().inputAssignments).toHaveLength(0);
                });
                it('record filter logic change event ("PropertyChangedEvent")', async () => {
                    getRecordFilter(recordUpdateEditor).dispatchEvent(
                        new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.OR)
                    );
                    await ticks(1);
                    expect(recordUpdateEditor.getNode().filterLogic.value).toBe(CONDITION_LOGIC.OR);
                });
            });
        });
    });
});
