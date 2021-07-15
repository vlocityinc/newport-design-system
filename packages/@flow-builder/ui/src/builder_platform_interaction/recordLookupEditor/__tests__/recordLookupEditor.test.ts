import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import { SORT_ORDER, NUMBER_RECORDS_TO_STORE, WAY_TO_STORE_FIELDS } from 'builder_platform_interaction/recordEditorLib';
import {
    AddElementEvent,
    AddRecordFieldAssignmentEvent,
    AddRecordFilterEvent,
    ComboboxStateChangedEvent,
    DeleteRecordFieldAssignmentEvent,
    DeleteRecordFilterEvent,
    EditElementEvent,
    PropertyChangedEvent,
    RecordStoreOptionChangedEvent,
    SObjectReferenceChangedEvent,
    UpdateRecordFieldAssignmentEvent,
    UpdateRecordFilterEvent
} from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    fieldServiceMobileFlowUIModel,
    getAccountWithFields,
    getAccountWithSObject
} from 'mock/storeDataFieldServiceMobile';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import {
    getEntityResourcePicker,
    getRecordFilter,
    getRecordInputOutputAssignments,
    getRecordSobjectAndQueryFields,
    getRecordSort,
    getRecordStoreOption,
    getSObjectOrSObjectCollectionPicker
} from '../../integrationTests/__tests__/clud/cludEditorTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest
            .fn()
            .mockReturnValue(FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED)
    };
});
jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getChildrenItemsPromise: actual.getChildrenItemsPromise,
        filterMatches: actual.filterMatches
    };
});

const PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_OUTPUT = 'FieldServiceMobile';
const createComponentForTest = (node: {}, mode = EditElementEvent.EVENT_NAME) => {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, {
        node,
        PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_OUTPUT,
        mode
    });
    setDocumentBodyChildren(el);
    return el;
};

const entityCaseItemDetailEvent = {
    type: 'option-card',
    text: [
        {
            highlight: true,
            text: 'Case'
        }
    ],
    subText: [
        {
            highlight: true,
            text: 'Case'
        }
    ],
    displayText: 'Case',
    iconSize: 'xx-small',
    value: 'Case',
    dataType: 'SObject',
    subtype: 'Case',
    textNoHighlight: 'Case',
    subTextNoHighlight: 'Case'
};

const getComboboxStateChangedEvent = (
    item: any = entityCaseItemDetailEvent,
    displayText = 'Account',
    error: string | null = null
) =>
    // @ts-ignore
    new ComboboxStateChangedEvent(item, displayText, error);

const sortFieldAccountBillingCountryComboboxStateChangeEventDetail = {
    item: {
        type: 'option-card',
        text: [
            {
                highlight: true,
                text: 'BillingCountry'
            }
        ],
        subText: [
            {
                highlight: false,
                text: 'Billing Country'
            }
        ],
        displayText: 'BillingCountry',
        iconName: 'utility:text',
        iconAlternativeText: 'String',
        iconSize: 'xx-small',
        value: 'BillingCountry',
        parent: null,
        dataType: 'String',
        textNoHighlight: 'BillingCountry',
        subTextNoHighlight: 'Billing Country'
    },
    displayText: 'BillingCountry',
    error: null,
    isMergeField: false
};
const defaultNewRecordLookupElement = {
    guid: '4f79d37c-548f-4ceb-97a7-15a4bdc42bac',
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
    locationX: 458,
    locationY: 69,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: false,
        isHighlighted: false,
        isSelectable: true,
        hasError: false
    },
    elementSubtype: {
        value: null,
        error: null
    },
    object: {
        value: '',
        error: null
    },
    objectIndex: {
        value: 'fa82bcd7-822b-49cb-a9d3-1dc81be4cde3',
        error: null
    },
    outputAssignments: [],
    assignNullValuesIfNoRecordsFound: false,
    filterLogic: {
        value: 'and',
        error: null
    },
    filters: [
        {
            rowIndex: 'bb97b3a9-f548-4434-a060-66970b9ee47b',
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
    queriedFields: [],
    sortOrder: 'NotSorted',
    sortField: {
        value: '',
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
    elementType: 'RecordQuery',
    outputReferenceIndex: {
        value: 'cec46dce-c852-4bd1-bc81-5604f4cf9c64',
        error: null
    },
    dataType: {
        value: 'Boolean',
        error: null
    },
    storeOutputAutomatically: false,
    getFirstRecordOnly: true,
    variableAndFieldMapping: 'manual'
};

describe('record-lookup-editor (Process type NOT supporting automatic mode)', () => {
    let recordLookupEditor, entityResourcePicker, recordLookupNode;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(fieldServiceMobileFlowUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('Adding element', () => {
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(defaultNewRecordLookupElement, AddElementEvent.EVENT_NAME);
        });
        it('check UI - child components displayed or not (snapshot)', () => {
            expect(recordLookupEditor).toMatchSnapshot();
        });
        describe('After entity (object) is selected', () => {
            beforeEach(() => {
                entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
            });
            it('check UI - child components displayed or not (snapshot)', async () => {
                entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                await ticks(1);
                expect(recordLookupEditor).toMatchSnapshot();
            });
            it(`entity picker (object) value should be "${entityCaseItemDetailEvent.value}"`, async () => {
                entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                await ticks(1);
                expect(entityResourcePicker.value).toBe(entityCaseItemDetailEvent.value);
            });
            it('should clear error on node.object if any', async () => {
                entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent(null, '', 'A value is required'));
                await ticks(1);
                expect(recordLookupEditor.node.object.error).toBe('A value is required');
                entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                await ticks(1);
                expect(recordLookupEditor.node.object.error).toBeNull();
            });
        });
    });
    describe('Existing element', () => {
        describe('with sobject', () => {
            beforeAll(() => {
                recordLookupNode = getElementForPropertyEditor(getAccountWithSObject);
            });
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            it('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            it('entity picker (object) value should be "Account" ', () => {
                expect(getEntityResourcePicker(recordLookupEditor).value).toBe('Account');
            });
            it('Store options (nuber of records) should be "firstRecord"', () => {
                expect(getRecordStoreOption(recordLookupEditor).numberOfRecordsToStore).toBe(
                    NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                );
            });
            it('Store options (Way to store) should be "sObjectVariable"', () => {
                expect(getRecordStoreOption(recordLookupEditor).wayToStoreFields).toBe(
                    WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                );
            });
            it('assign null if no records found should be "false" ', () => {
                expect(getRecordStoreOption(recordLookupEditor).assignNullValuesIfNoRecordsFound).toBe(false);
            });
            it('sortOrder should NOT be sorted', () => {
                expect(getRecordSort(recordLookupEditor).sortOrder).toBe(SORT_ORDER.NOT_SORTED);
            });
            it('record filter logic should be "and" ', () => {
                expect(getRecordFilter(recordLookupEditor).filterLogic.value).toBe(CONDITION_LOGIC.AND);
            });
            describe('Handle Events', () => {
                describe('remove "object"', () => {
                    it('check UI - child components displayed or not (snapshot)', async () => {
                        entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                        entityResourcePicker.dispatchEvent(
                            new ComboboxStateChangedEvent(
                                // @ts-ignore
                                null,
                                '',
                                'A value is required.'
                            )
                        );
                        await ticks(1);
                        expect(recordLookupEditor).toMatchSnapshot();
                    });
                });
                describe('invalid "object"', () => {
                    beforeEach(() => {
                        entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                        entityResourcePicker.dispatchEvent(
                            // @ts-ignore
                            getComboboxStateChangedEvent(null, 'invalidEntityName', 'Enter a valid value.')
                        );
                    });
                    it('check UI - child components displayed or not (snapshot)', () => {
                        expect(recordLookupEditor).toMatchSnapshot();
                    });
                    it('"object" picker value should be set to empty string', () => {
                        expect(entityResourcePicker.value).toBe('');
                    });
                });
                it('"entityResourcePicker" value changed event', async () => {
                    entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                    entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                    await ticks(1);
                    expect(entityResourcePicker.value).toBe('Case');
                });
                it('"sortOrder" change should update the record lookup sortOrder value', async () => {
                    const event = new CustomEvent('change', {
                        detail: {
                            sortOrder: SORT_ORDER.ASC,
                            fieldApiName: ''
                        }
                    });
                    getRecordSort(recordLookupEditor).dispatchEvent(event);
                    await ticks(1);
                    const recordSort = getRecordSort(recordLookupEditor);
                    expect(recordSort.sortOrder).toBe(SORT_ORDER.ASC);
                    expect(recordLookupEditor.node.sortOrder).toBe(SORT_ORDER.ASC);
                });
                it('"RecordStoreOptionChangedEvent" change to All records, sObject picker placeholder and value should change', async () => {
                    getRecordStoreOption(recordLookupEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(false, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, false)
                    );
                    await ticks(1);
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                        'FlowBuilderRecordEditor.searchRecordCollections'
                    );
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                it('"RecordStoreOptionChangedEvent" changes assignNullValuesIfNoRecordsFound', async () => {
                    getRecordStoreOption(recordLookupEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(true, WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE, true)
                    );
                    await ticks(1);
                    expect(recordLookupEditor.node.assignNullValuesIfNoRecordsFound).toBe(true);
                });
                describe('filters', () => {
                    it('"UpdateRecordFilterEvent" should update the filters', async () => {
                        const filter = getAccountWithFields.filters[0];
                        getRecordFilter(recordLookupEditor).dispatchEvent(new UpdateRecordFilterEvent(0, filter));
                        await ticks(1);
                        expect(recordLookupEditor.node.filters[0]).toMatchObject(filter);
                    });
                    it('"AddRecordFilterEvent" should add a filter', async () => {
                        getRecordFilter(recordLookupEditor).dispatchEvent(new AddRecordFilterEvent());
                        await ticks(1);
                        expect(recordLookupEditor.node.filters).toHaveLength(2);
                    });
                    it('"DeleteRecordFilterEvent" deletes filter', async () => {
                        getRecordFilter(recordLookupEditor).dispatchEvent(new DeleteRecordFilterEvent(0));
                        await ticks(1);
                        expect(recordLookupEditor.node.filters).toHaveLength(0);
                    });
                    it('"PropertyChangedEvent" for record filter logic change', async () => {
                        const propertyChangeEvent = new PropertyChangedEvent('filterLogic', CONDITION_LOGIC.OR);
                        getRecordFilter(recordLookupEditor).dispatchEvent(propertyChangeEvent);
                        await ticks(1);
                        expect(recordLookupEditor.node.filterLogic.value).toBe(CONDITION_LOGIC.OR);
                    });
                });
                it('"SObjectReferenceChangedEvent" reselect same "outputReference" should not reset query fields', async () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(recordLookupEditor.node.outputReference.value)
                    );
                    await ticks(1);
                    expect(recordSobjectAndQueryFields.queriedFields[1].field.value).toBe('BillingAddress');
                });
                it('record filter logic criteria should be "and" ', () => {
                    const recordFilter = getRecordFilter(recordLookupEditor);
                    expect(recordFilter.filterLogic).toMatchObject({ error: null, value: 'and' });
                });
            });
        });
        describe('with fields', () => {
            beforeAll(() => {
                recordLookupNode = getElementForPropertyEditor(getAccountWithFields);
            });
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            it('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            it('entity picker (object) value should be "Account" ', () => {
                expect(getEntityResourcePicker(recordLookupEditor).value).toBe('Account');
            });
            it('Store options (number of records to store) value should be "firstRecord"', () => {
                expect(getRecordStoreOption(recordLookupEditor).numberOfRecordsToStore).toBe(
                    NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                );
            });
            it('Store options (way to store) should be "separateVariables"', () => {
                expect(getRecordStoreOption(recordLookupEditor).wayToStoreFields).toBe(
                    WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES
                );
            });
            it('Store options (assign null if records not found) should be "false"', () => {
                expect(getRecordStoreOption(recordLookupEditor).assignNullValuesIfNoRecordsFound).toBe(false);
            });
            describe('"RecordSort"', () => {
                let recordSort;
                beforeEach(() => {
                    recordSort = getRecordSort(recordLookupEditor);
                });
                it('displays the sortOrder, should be ASC sorted', () => {
                    expect(recordSort.sortOrder).toBe(SORT_ORDER.ASC);
                });
                it('displays the sortField, should be "Id"', () => {
                    expect(recordSort.selectedField).toBe('Id');
                });
            });
            it('record filterLogic should be "and" ', () => {
                expect(getRecordFilter(recordLookupEditor).filterLogic.value).toBe(CONDITION_LOGIC.AND);
            });
            describe('Handle Events', () => {
                it('"RecordStoreOptionChangedEvent": changes number record to store to All records, sObject picker should be displayed with empty value', async () => {
                    getRecordStoreOption(recordLookupEditor).dispatchEvent(
                        new RecordStoreOptionChangedEvent(false, WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES)
                    );
                    await ticks(1);
                    const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(
                        getRecordSobjectAndQueryFields(recordLookupEditor)
                    );
                    expect(sObjectOrSObjectCollectionPicker).not.toBeNull();
                    expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                });
                it('handles change of the sort field', async () => {
                    const comboboxFieldPicker = getRecordSort(recordLookupEditor).shadowRoot.querySelector(
                        INTERACTION_COMPONENTS_SELECTORS.FIELD_PICKER
                    );

                    comboboxFieldPicker.dispatchEvent(
                        new ComboboxStateChangedEvent(
                            // @ts-ignore
                            ...Object.values(sortFieldAccountBillingCountryComboboxStateChangeEventDetail)
                        )
                    );
                    await ticks(1);
                    expect(recordLookupEditor.node.sortField).toMatchObject({
                        error: null,
                        value: 'BillingCountry'
                    });
                });
                describe('"RecordInputOutputAssignments"', () => {
                    it('"AddRecordFieldAssignmentEvent" should add an output assignment', async () => {
                        getRecordInputOutputAssignments(recordLookupEditor).dispatchEvent(
                            new AddRecordFieldAssignmentEvent()
                        );
                        await ticks(1);
                        expect(recordLookupEditor.node.outputAssignments).toHaveLength(3);
                    });
                    it('"UpdateRecordFieldAssignmentEvent" should update output assignment', async () => {
                        const outputAssignment = getAccountWithFields.outputAssignments[0];
                        getRecordInputOutputAssignments(recordLookupEditor).dispatchEvent(
                            new UpdateRecordFieldAssignmentEvent(0, outputAssignment, null)
                        );
                        await ticks(1);
                        expect(recordLookupEditor.node.outputAssignments[0]).toMatchObject(outputAssignment);
                    });
                    it('"DeleteRecordFieldAssignmentEvent" should delete the output assignment', async () => {
                        const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(0); // This is using the numerical rowIndex not the property rowIndex
                        getRecordInputOutputAssignments(recordLookupEditor).dispatchEvent(
                            deleteRecordFieldAssignmentEvent
                        );
                        await ticks(1);
                        expect(recordLookupEditor.node.outputAssignments).toHaveLength(1);
                    });
                });
            });
        });
    });
});
