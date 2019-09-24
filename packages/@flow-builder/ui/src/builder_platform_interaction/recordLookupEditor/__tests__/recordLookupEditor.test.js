import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';
import {
    SORT_ORDER,
    NUMBER_RECORDS_TO_STORE,
    RECORD_FILTER_CRITERIA,
    WAY_TO_STORE_FIELDS
} from 'builder_platform_interaction/recordEditorLib';
import {
    AddElementEvent,
    EditElementEvent,
    RecordStoreOptionChangedEvent,
    AddRecordFilterEvent,
    DeleteRecordFilterEvent,
    UpdateRecordFilterEvent,
    RecordFilterTypeChangedEvent,
    AddRecordFieldAssignmentEvent,
    DeleteRecordFieldAssignmentEvent,
    UpdateRecordFieldAssignmentEvent,
    SObjectReferenceChangedEvent,
    NumberRecordToStoreChangedEvent
} from 'builder_platform_interaction/events';
import {
    getAdvancedOptionCheckbox,
    getUseAdvancedOptionComponent
} from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () =>
    require('builder_platform_interaction_mocks/fieldPicker')
);
jest.mock('builder_platform_interaction/storeLib', () =>
    require('builder_platform_interaction_mocks/storeLib')
);

const MOCK_GUID = '515fa22c-c633-48fe-a97e-4fd3c272cc24';
const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'flow';
const MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE = 'other';

class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}

function createComponentForTest(
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
) {
    const el = createElement(
        'builder_platform_interaction-record-lookup-editor',
        { is: RecordLookupEditor }
    );
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
}

const defaultValueItem = { item: { value: 'guid1', displayText: 'var 1' } };
const eventDetailObjectWithError = (displayText, error) => ({
    item: null,
    displayText,
    error
});
const getComboboxStateChangedEvent = (detail = defaultValueItem) => {
    return new CustomEvent('comboboxstatechanged', {
        detail
    });
};

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = require.requireActual(
        '../../processTypeLib/processTypeLib.js'
    );
    const FLOW_AUTOMATIC_OUTPUT_HANDLING =
        actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn(processType => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
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
        getSecondLevelItems: actual.getSecondLevelItems,
        filterMatches: actual.filterMatches
    };
});

const SELECTORS = {
    entityResourcePicker: 'builder_platform_interaction-entity-resource-picker',
    fieldToFerovExBuilder:
        'builder_platform_interaction-field-to-ferov-expression-builder',
    inputOutputAssignments:
        'builder_platform_interaction-record-input-output-assignments',
    interactionList: 'builder_platform_interaction-list',
    interactionRow: 'builder_platform_interaction-row',
    lightningInput: 'lightning-input',
    lightningRadioGroup: 'lightning-radio-group',
    recordFilter: 'builder_platform_interaction-record-filter',
    recordQueryFields: 'builder_platform_interaction-record-query-fields',
    recordNumberOfRecordToStore:
        'builder_platform_interaction-record-number-record-to-store',
    recordSobjectAndQueryFields:
        'builder_platform_interaction-record-sobject-and-query-fields',
    recordSort: 'builder_platform_interaction-record-sort',
    recordStoreOption: 'builder_platform_interaction-record-store-options',
    sObjectOrSObjectCollectionPicker:
        'builder_platform_interaction-sobject-or-sobject-collection-picker',
    useAdvancedOptionsCheckboxComponent:
        'builder_platform_interaction-use-advanced-options-checkbox',
    assignNullIfNoRecordFoundsInput:
        'lightning-input.test-assign-null-if-no-records-found'
};

const filterElement = {
    leftHandSide: { value: 'Account.Id', error: null },
    operator: { value: 'EqualTo', error: null },
    rightHandSide: { value: '{!myFormula1}', error: null },
    rightHandSideDataType: { value: 'reference', error: null },
    rightHandSideGuid: { value: 'FORMULA_8', error: null }
};

const lookupField = {
    leftHandSide: { error: null, value: 'Account.BillingCity' },
    rightHandSide: { error: null, value: 'vCity' },
    rowIndex: 'f972abcb-1df5-41f1-9d31-f5076cbc8'
};

const defaultNewRecordLookupElement = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    name: { value: '', error: null },
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: false,
    outputAssignments: [],
    queriedFields: [],
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [
        {
            rowIndex: 'a0e8a02d-60fb-4481-8165-10a01fe7031c',
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
    getFirstRecordOnly: true
});

const recordLookupElementWithSObject = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    dataType: { value: 'Boolean', error: null },
    guid: '426e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    name: { value: 'testRecord', error: null },
    outputReference: { value: store.accountSObjectVariable.guid, error: null },
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: true,
    outputAssignments: [],
    queriedFields: [
        {
            field: { value: 'Id', error: null },
            rowIndex: 1
        },
        {
            field: { value: 'Name', error: null },
            rowIndex: 2
        }
    ],
    object: { value: 'Account', error: '' },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    getFirstRecordOnly: true,
    storeOutputAutomatically: false
});

const recordLookupElementWithSObjectAndFilters = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    guid: '7326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    name: { value: 'testRecord', error: null },
    outputReference: { value: store.accountSObjectVariable.guid, error: null },
    outputReferenceIndex: { value: 'guid', error: null },
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: false,
    outputAssignments: [],
    queriedFields: [],
    object: { value: 'Account', error: null },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.ALL,
    filters: [
        {
            leftHandSide: { value: 'Account.billingAddress', error: null },
            operator: { value: 'EqualTo', error: null },
            rightHandSide: { value: 'my address', error: null },
            rightHandSideDataType: { value: 'String', error: null },
            rowIndex: 'RECORDLOOKUPFILTERITEM_122'
        }
    ],
    getFirstRecordOnly: true
});

const recordLookupElementWithFields = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    dataType: { value: 'Boolean', error: null },
    guid: '8326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecordWithFields', error: null },
    name: { value: 'testRecordWithFields', error: null },
    outputReferenceIndex: { value: 'guid', error: null },
    outputAssignments: [lookupField],
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: true,
    object: { value: 'Account', error: '' },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    getFirstRecordOnly: true,
    storeOutputAutomatically: false
});

const recordLookupElementAutomaticSingleRecord = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    guid: '9326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    name: { value: 'testRecord', error: null },
    outputReference: undefined,
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: false,
    queriedFields: [
        {
            field: { value: 'Id', error: null },
            rowIndex: 3
        },
        {
            field: { value: 'Name', error: null },
            rowIndex: 4
        }
    ],
    object: { value: 'Account', error: '' },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    getFirstRecordOnly: true,
    storeOutputAutomatically: true,
    isCollection: false,
    subType: 'Account'
});

const recordLookupElementAutomaticSCollectionRecord = () => ({
    guid: '8aae1ef5-4508-4b5f-8c3e-58667ce1758e',
    name: {
        value: 'accounts_auto',
        error: null
    },
    description: {
        value: '',
        error: null
    },
    label: {
        value: 'accounts auto',
        error: null
    },
    locationX: 231,
    locationY: 63,
    isCanvasElement: true,
    connectorCount: 0,
    config: {
        isSelected: true,
        isHighlighted: false
    },
    object: {
        value: 'Account',
        error: null
    },
    objectIndex: {
        value: 'b65d14d1-3db0-4682-b56f-5a8f752ad441',
        error: null
    },
    filterType: 'all',
    filters: [
        {
            rowIndex: '91c24311-2f5b-4bc0-9ca0-7e20d46231b1',
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
            },
            operator: {
                value: 'EqualTo',
                error: null
            }
        },
        {
            rowIndex: 'e3ea4c10-6da4-44c9-8203-3d94da8fa3c9',
            leftHandSide: {
                value: 'Account.BillingPostalCode',
                error: null
            },
            rightHandSide: {
                value: '75015',
                error: null
            },
            rightHandSideDataType: {
                value: 'String',
                error: null
            },
            operator: {
                value: 'EqualTo',
                error: null
            }
        }
    ],
    queriedFields: [
        {
            field: {
                value: 'Id',
                error: null
            },
            rowIndex: '937120eb-0cdd-460d-9ee4-8602c047423d'
        },
        {
            field: {
                value: 'Name',
                error: null
            },
            rowIndex: 'bcf38351-19d7-47bd-ba41-1dd2ace65eb4'
        }
    ],
    sortOrder: 'Desc',
    sortField: {
        value: 'BillingCity',
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
        value: '70c9b8c3-d474-4bae-a9cd-b54bffedd792',
        error: null
    },
    dataType: {
        value: 'SObject',
        error: null
    },
    isCollection: true,
    subtype: {
        value: 'Account',
        error: null
    },
    storeOutputAutomatically: true,
    getFirstRecordOnly: false
});

const recordLookupElementWithoutOutputRefNorOutputAssignment = () => ({
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    dataType: { value: 'SObject', error: null },
    guid: '426e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    name: { value: 'testRecord', error: null },
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    assignNullValuesIfNoRecordsFound: true,
    queriedFields: [
        {
            field: { value: 'Id', error: null },
            rowIndex: 1
        },
        {
            field: { value: 'Name', error: null },
            rowIndex: 2
        }
    ],
    object: { value: 'Account', error: '' },
    objectIndex: { value: 'guid', error: null },
    filterType: RECORD_FILTER_CRITERIA.NONE,
    filters: [],
    getFirstRecordOnly: true,
    subtype: {
        value: 'Account',
        error: null
    },
    storeOutputAutomatically: true,
});

const outputAssignmentElement = {
    leftHandSide: { value: 'Account.Address', error: null },
    rightHandSide: { value: 'myAddress', error: null },
    rowIndex: '724cafc2-7744-4e46-8eaa-f2df29539d2e'
};

const getRecordStoreOption = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.recordStoreOption
    );
};

const getEntityResourcePicker = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.entityResourcePicker
    );
};

const getRecordFilter = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.recordFilter);
};

const getRecordSort = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.recordSort);
};

const getRecordSobjectAndQueryFields = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.recordSobjectAndQueryFields
    );
};

const getsObjectOrSObjectCollectionPicker = recordSobjectAndQueryFields => {
    return recordSobjectAndQueryFields.shadowRoot.querySelector(
        SELECTORS.sObjectOrSObjectCollectionPicker
    );
};

const getInputOutputAssignments = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.inputOutputAssignments
    );
};

const getNumberRecordToStoreComponent = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.recordNumberOfRecordToStore
    );
};

const getAutomaticRecordStoreOptionsRadioGroup = recordLookupEditor => {
    return getNumberRecordToStoreComponent(
        recordLookupEditor
    ).shadowRoot.querySelector(SELECTORS.lightningRadioGroup);
};

const getAutomaticWayToStoresRadioGroup = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.lightningRadioGroup
    );
};

const getAutomaticQueryFields = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.recordQueryFields
    );
};

const getAutomaticWayToStoreFields = recordLookupEditor => {
    return recordLookupEditor.shadowRoot.querySelector(
        SELECTORS.lightningRadioGroup
    );
};

describe('record-lookup-editor', () => {
    let recordLookupEditor, entityResourcePicker;
    describe('Process type NOT supporting the automatic mode', () => {
        describe('Adding element', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    defaultNewRecordLookupElement(),
                    AddElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                );
            });
            test('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            describe('After entity (object) is selected', () => {
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent()
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it(`entity picker (object) value should be "${defaultValueItem.item.value}"`, () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe(defaultValueItem.item.value);
                });
            });
        });
        describe('Edit element (Sobject mode)', () => {
            describe('No actions', () => {
                beforeEach(() => {
                    expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                        store.accountSObjectVariable
                    );
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('entity picker (object) value should be "Account" ', () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe('Account');
                });
                it('Store options (nuber of records) should be "firstRecord"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .numberOfRecordsToStore
                    ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('Store options (Way to store) should be "sObjectVariable"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .wayToStoreFields
                    ).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                });
                it('assign null if no records found should be "true" ', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .assignNullValuesIfNoRecordsFound
                    ).toBe(true);
                });
                it('sortOrder should NOT be sorted', () => {
                    expect(getRecordSort(recordLookupEditor).sortOrder).toBe(
                        SORT_ORDER.NOT_SORTED
                    );
                });
                it('record filter type should be "none" ', () => {
                    expect(getRecordFilter(recordLookupEditor).filterType).toBe(
                        RECORD_FILTER_CRITERIA.NONE
                    );
                });
            });
            describe('remove "object"', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );

                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent(
                            eventDetailObjectWithError(
                                '',
                                'A value is required.'
                            )
                        )
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
            });
            describe('invalid "object"', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent(
                            eventDetailObjectWithError(
                                'invalidEntityName',
                                'Enter a valid value.'
                            )
                        )
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('"object" picker value should be set to empty string', () => {
                    expect(entityResourcePicker.value).toBe('');
                });
            });
            describe('Handle Events', () => {
                beforeEach(() => {
                    expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                        store.accountSObjectVariable
                    );
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );
                });
                it('handles "entityResourcePicker" value changed event', () => {
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent()
                    );
                    return Promise.resolve().then(() => {
                        expect(entityResourcePicker.value).toBe('guid1');
                    });
                });
                it('handle "sortOrder" Changed should changed the record lookup sortOrder value', () => {
                    const event = new CustomEvent('change', {
                        detail: {
                            sortOrder: SORT_ORDER.ASC,
                            fieldApiName: ''
                        }
                    });
                    getRecordSort(recordLookupEditor).dispatchEvent(event);
                    return Promise.resolve().then(() => {
                        const recordSort = getRecordSort(recordLookupEditor);
                        expect(recordSort.sortOrder).toBe(SORT_ORDER.ASC);
                        expect(recordLookupEditor.node.sortOrder).toBe(
                            SORT_ORDER.ASC
                        );
                    });
                });
                it('change number record to store to All records, sObject picker should changed', () => {
                    const event = new RecordStoreOptionChangedEvent(
                        false,
                        '',
                        false
                    );
                    getRecordStoreOption(recordLookupEditor).dispatchEvent(
                        event
                    );
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        expect(
                            sObjectOrSObjectCollectionPicker.placeholder
                        ).toBe(
                            'FlowBuilderRecordEditor.sObjectCollectionVariablePlaceholder'
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                });
                it('handle UpdateRecordFilterEvent should update the filter element', () => {
                    const updateRecordFilterEvent = new UpdateRecordFilterEvent(
                        0,
                        filterElement,
                        null
                    );
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        updateRecordFilterEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.filters[0]
                        ).toMatchObject(filterElement);
                    });
                });
                it('handle AddRecordFilterEvent should add a filter element', () => {
                    const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        addRecordFilterEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor.node.filters).toHaveLength(1);
                    });
                });
                it('handle record filter type Change event', () => {
                    const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(
                        RECORD_FILTER_CRITERIA.ALL
                    );
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        recordFilterTypeChangedEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor.node.filterType).toBe(
                            RECORD_FILTER_CRITERIA.ALL
                        );
                    });
                });
                it('reselect same "outputReference" should not reset query fields', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                        recordLookupEditor
                    );
                    const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(
                            store.accountSObjectVariable.guid
                        )
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordSobjectAndQueryFields.queriedFields[1].field
                                .value
                        ).toBe('Name');
                    });
                });
                describe('Filters', () => {
                    beforeEach(() => {
                        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                            store.accountSObjectVariable
                        );
                        recordLookupEditor = createComponentForTest(
                            recordLookupElementWithSObjectAndFilters()
                        );
                    });
                    it('record filter criteria should be all ', () => {
                        const recordFilter = getRecordFilter(
                            recordLookupEditor
                        );
                        expect(recordFilter.filterType).toBe(
                            RECORD_FILTER_CRITERIA.ALL
                        );
                    });
                    it('record filter fire DeleteRecordFilterEvent', () => {
                        const deleteRecordFilterEvent = new DeleteRecordFilterEvent(
                            0
                        ); // This is using the numerical rowIndex not the property rowIndex
                        getRecordFilter(recordLookupEditor).dispatchEvent(
                            deleteRecordFilterEvent
                        );
                        return Promise.resolve().then(() => {
                            expect(
                                recordLookupEditor.node.filters
                            ).toHaveLength(0);
                        });
                    });
                });
            });
        });
        describe('Edit element (Fields mode)', () => {
            describe('no actions', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithFields(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('entity picker (object) value should be "Account" ', () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe('Account');
                });
                it('Store options (number of records to store) value should be "firstRecord"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .numberOfRecordsToStore
                    ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('Store options (way to store) should be "separateVariables"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .wayToStoreFields
                    ).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
                });
                it('Store options (assign null if records not found) should be "true"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .assignNullValuesIfNoRecordsFound
                    ).toBe(true);
                });
                it('sortOrder should be Not sorted', () => {
                    expect(getRecordSort(recordLookupEditor).sortOrder).toBe(
                        SORT_ORDER.NOT_SORTED
                    );
                });
                it('record filterType should be "none" ', () => {
                    expect(getRecordFilter(recordLookupEditor).filterType).toBe(
                        RECORD_FILTER_CRITERIA.NONE
                    );
                });
            });
            describe('Handle Events', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithFields()
                    );
                });
                it('change number record to store to All records, sObject picker should changed', () => {
                    getNumberRecordToStoreComponent(
                        recordLookupEditor
                    ).dispatchEvent(new NumberRecordToStoreChangedEvent(false));
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                });
                it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', () => {
                    const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        addRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments
                        ).toHaveLength(2);
                    });
                });
                it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', () => {
                    const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                        0,
                        outputAssignmentElement,
                        null
                    );
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        updateRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments[0]
                        ).toMatchObject(outputAssignmentElement);
                    });
                });
                it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', () => {
                    const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(
                        0
                    ); // This is using the numerical rowIndex not the property rowIndex
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        deleteRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments
                        ).toHaveLength(0);
                    });
                });
            });
        });
    });
    describe('Process type supporting the automatic mode', () => {
        describe('Adding element', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    defaultNewRecordLookupElement(),
                    AddElementEvent.EVENT_NAME
                );
            });
            test('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            describe('After entity (object) is selected', () => {
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent()
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it(`entity picker (object) value should be "${defaultValueItem.item.value}"`, () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe(defaultValueItem.item.value);
                });
                it('"useAdvancedOptionsCheckbox" should be unchecked', () => {
                    return Promise.resolve().then(() => {
                        const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                            recordLookupEditor
                        );
                        expect(advancedOptionCheckbox).toBeDefined();
                        expect(advancedOptionCheckbox.type).toBe('checkbox');
                        expect(advancedOptionCheckbox.checked).toBe(false);
                    });
                });
            });
        });
        describe('Edit element (sobject mode)', () => {
            describe('No actions', () => {
                beforeEach(() => {
                    expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                        store.accountSObjectVariable
                    );
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject()
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('entity picker (object) value should be "Account" ', () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe('Account');
                });
                it('Number of records to store should be "firstRecord"', () => {
                    expect(
                        getNumberRecordToStoreComponent(recordLookupEditor)
                            .numberRecordsToStoreValue
                    ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('Way to store fields should be "sObjectVariable"', () => {
                    expect(
                        getAutomaticWayToStoresRadioGroup(recordLookupEditor)
                            .value
                    ).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                });
                it('sortOrder should NOT be sorted', () => {
                    expect(getRecordSort(recordLookupEditor).sortOrder).toBe(
                        SORT_ORDER.NOT_SORTED
                    );
                });
                it('record filter type should be "none" ', () => {
                    expect(getRecordFilter(recordLookupEditor).filterType).toBe(
                        RECORD_FILTER_CRITERIA.NONE
                    );
                });
                it('"useAdvancedOptionsCheckbox" should be checked', () => {
                    const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                        recordLookupEditor
                    );
                    expect(advancedOptionCheckbox).toBeDefined();
                    expect(advancedOptionCheckbox.checked).toBe(true);
                });
                it('Should display the sobject placeholder and value', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                        recordLookupEditor
                    );
                    const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    expect(sObjectOrSObjectCollectionPicker.placeholder).toBe(
                        'FlowBuilderRecordEditor.sObjectVariablePlaceholder'
                    );
                    expect(sObjectOrSObjectCollectionPicker.value).toBe(
                        store.accountSObjectVariable.guid
                    );
                });
                it('should display the 2 query fields', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                        recordLookupEditor
                    );
                    expect(
                        recordSobjectAndQueryFields.queriedFields[0].field.value
                    ).toBe('Id');
                    expect(
                        recordSobjectAndQueryFields.queriedFields[1].field.value
                    ).toBe('Name');
                });
            });
            describe('remove "object"', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject()
                    );

                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent(
                            eventDetailObjectWithError(
                                '',
                                'A value is required.'
                            )
                        )
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
            });
            describe('invalid "object"', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject()
                    );
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent(
                            eventDetailObjectWithError(
                                'invalidEntityName',
                                'Enter a valid value.'
                            )
                        )
                    );
                });
                it('"recordFilter" should NOT be visible', () => {
                    const recordFilter = getRecordFilter(recordLookupEditor);
                    expect(recordFilter).toBeNull();
                });
                it('"recordStoreOption" should NOT be visible', () => {
                    const recordStoreOption = getRecordStoreOption(
                        recordLookupEditor
                    );
                    expect(recordStoreOption).toBeNull();
                });
                it('"recordSort" should NOT be visible', () => {
                    const recordSort = getRecordSort(recordLookupEditor);
                    expect(recordSort).toBeNull();
                });
                it('"recordQueryField" should NOT be visible', () => {
                    const recordQueryField = getRecordSobjectAndQueryFields(
                        recordLookupEditor
                    );
                    expect(recordQueryField).toBeNull();
                });
                it('"recordInputOutputAssignments" should NOT be visible', () => {
                    const recordOutputAssignments = getInputOutputAssignments(
                        recordLookupEditor
                    );
                    expect(recordOutputAssignments).toBeNull();
                });
                it('"object" picker value should be set to empty string', () => {
                    expect(entityResourcePicker.value).toBe('');
                });
            });

            describe('Handle Events', () => {
                beforeEach(() => {
                    expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                        store.accountSObjectVariable
                    );
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithSObject()
                    );
                });
                it('handles "entityResourcePicker" value changed event', () => {
                    entityResourcePicker = getEntityResourcePicker(
                        recordLookupEditor
                    );
                    entityResourcePicker.dispatchEvent(
                        getComboboxStateChangedEvent()
                    );
                    return Promise.resolve().then(() => {
                        expect(entityResourcePicker.value).toBe('guid1');
                    });
                });
                it('handle "sortOrder" Changed should changed the record lookup sortOrder value', () => {
                    const event = new CustomEvent('change', {
                        detail: {
                            sortOrder: SORT_ORDER.ASC,
                            fieldApiName: ''
                        }
                    });
                    getRecordSort(recordLookupEditor).dispatchEvent(event);
                    return Promise.resolve().then(() => {
                        const recordSort = getRecordSort(recordLookupEditor);
                        expect(recordSort.sortOrder).toBe(SORT_ORDER.ASC);
                        expect(recordLookupEditor.node.sortOrder).toBe(
                            SORT_ORDER.ASC
                        );
                    });
                });
                it('change number record to store to "All records", sObject picker should change and storing radio group hidden', () => {
                    getNumberRecordToStoreComponent(
                        recordLookupEditor
                    ).dispatchEvent(new NumberRecordToStoreChangedEvent(false));
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        expect(
                            sObjectOrSObjectCollectionPicker.placeholder
                        ).toBe(
                            'FlowBuilderRecordEditor.sObjectCollectionVariablePlaceholder'
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                        expect(
                            getAutomaticWayToStoresRadioGroup(
                                recordLookupEditor
                            )
                        ).toBeNull();
                    });
                });
                it('handle UpdateRecordFilterEvent should update the filter element', () => {
                    const updateRecordFilterEvent = new UpdateRecordFilterEvent(
                        0,
                        filterElement,
                        null
                    );
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        updateRecordFilterEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.filters[0]
                        ).toMatchObject(filterElement);
                    });
                });
                it('handle AddRecordFilterEvent should add a filter element', () => {
                    const addRecordFilterEvent = new AddRecordFilterEvent(); // This is using the numerical rowIndex not the property rowIndex
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        addRecordFilterEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor.node.filters).toHaveLength(1);
                    });
                });
                it('handle record filter type Change event', () => {
                    const recordFilterTypeChangedEvent = new RecordFilterTypeChangedEvent(
                        RECORD_FILTER_CRITERIA.ALL
                    );
                    getRecordFilter(recordLookupEditor).dispatchEvent(
                        recordFilterTypeChangedEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor.node.filterType).toBe(
                            RECORD_FILTER_CRITERIA.ALL
                        );
                    });
                });
                it('reselect same "outputReference" should not reset query fields', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                        recordLookupEditor
                    );
                    const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(
                            store.accountSObjectVariable.guid
                        )
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordSobjectAndQueryFields.queriedFields[1].field
                                .value
                        ).toBe('Name');
                    });
                });
                describe('Filters', () => {
                    beforeEach(() => {
                        expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                            store.accountSObjectVariable
                        );
                        recordLookupEditor = createComponentForTest(
                            recordLookupElementWithSObjectAndFilters()
                        );
                    });
                    it('record filter criteria should be all ', () => {
                        const recordFilter = getRecordFilter(
                            recordLookupEditor
                        );
                        expect(recordFilter.filterType).toBe(
                            RECORD_FILTER_CRITERIA.ALL
                        );
                    });
                    it('record filter fire DeleteRecordFilterEvent', () => {
                        const deleteRecordFilterEvent = new DeleteRecordFilterEvent(
                            0
                        ); // This is using the numerical rowIndex not the property rowIndex
                        getRecordFilter(recordLookupEditor).dispatchEvent(
                            deleteRecordFilterEvent
                        );
                        return Promise.resolve().then(() => {
                            expect(
                                recordLookupEditor.node.filters
                            ).toHaveLength(0);
                        });
                    });
                });
            });
        });
        describe('Edit element (fields mode)', () => {
            describe('no actions', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithFields(),
                        EditElementEvent.EVENT_NAME,
                        MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('entity picker (object) value should be "Account" ', () => {
                    expect(
                        getEntityResourcePicker(recordLookupEditor).value
                    ).toBe('Account');
                });
                it('Store options (number of records) value should be "firstRecord"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .numberOfRecordsToStore
                    ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
                });
                it('Store options (way to store) should be "separateVariables"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .wayToStoreFields
                    ).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
                });
                it('Store options (assign null if records not found) should be "true"', () => {
                    expect(
                        getRecordStoreOption(recordLookupEditor)
                            .assignNullValuesIfNoRecordsFound
                    ).toBe(true);
                });
                it('sortOrder should be Not sorted', () => {
                    expect(getRecordSort(recordLookupEditor).sortOrder).toBe(
                        SORT_ORDER.NOT_SORTED
                    );
                });
                it('record filterType should be "none" ', () => {
                    expect(getRecordFilter(recordLookupEditor).filterType).toBe(
                        RECORD_FILTER_CRITERIA.NONE
                    );
                });
                it('Output assignments', () => {
                    expect(
                        getInputOutputAssignments(recordLookupEditor)
                            .inputOutputAssignmentsItems
                    ).toEqual([lookupField]);
                });
            });
            describe('Handle Events', () => {
                beforeEach(() => {
                    recordLookupEditor = createComponentForTest(
                        recordLookupElementWithFields()
                    );
                });
                it('change number record to store to All records, sObject picker should changed', () => {
                    getNumberRecordToStoreComponent(
                        recordLookupEditor
                    ).dispatchEvent(new NumberRecordToStoreChangedEvent(false));
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        expect(sObjectOrSObjectCollectionPicker.value).toBe('');
                    });
                });
                it('handle AddRecordFieldAssignmentEvent should add an input Assignments element', () => {
                    const addRecordFieldAssignmentEvent = new AddRecordFieldAssignmentEvent();
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        addRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments
                        ).toHaveLength(2);
                    });
                });
                it('handle UpdateRecordFieldAssignmentEvent should update the input Assignments element', () => {
                    const updateRecordFieldAssignmentEvent = new UpdateRecordFieldAssignmentEvent(
                        0,
                        outputAssignmentElement,
                        null
                    );
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        updateRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments[0]
                        ).toMatchObject(outputAssignmentElement);
                    });
                });
                it('handle DeleteRecordFieldAssignmentEvent should delete the input assignment', () => {
                    const deleteRecordFieldAssignmentEvent = new DeleteRecordFieldAssignmentEvent(
                        0
                    ); // This is using the numerical rowIndex not the property rowIndex
                    getInputOutputAssignments(recordLookupEditor).dispatchEvent(
                        deleteRecordFieldAssignmentEvent
                    );
                    return Promise.resolve().then(() => {
                        expect(
                            recordLookupEditor.node.outputAssignments
                        ).toHaveLength(0);
                    });
                });
            });
        });
        describe('Edit element (automatic mode - single record)', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    recordLookupElementAutomaticSingleRecord(),
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                );
            });
            test('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            it('Number of record to store should be "firstRecord"', () => {
                expect(
                    getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor)
                        .value
                ).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
            });
            it('Use advanced mode checkbox should be unchecked', () => {
                const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                    recordLookupEditor
                );
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.checked).toBe(false);
            });
            it('"recordQuery" fields', () => {
                const recordQueryFields = getAutomaticQueryFields(
                    recordLookupEditor
                );
                expect(recordQueryFields.queriedFields[0].field.value).toBe(
                    'Id'
                );
                expect(recordQueryFields.queriedFields[1].field.value).toBe(
                    'Name'
                );
            });
            describe('Check Use Advanced Options checkbox', () => {
                let advancedOptionCheckbox;
                beforeEach(() => {
                    advancedOptionCheckbox = getAdvancedOptionCheckbox(
                        recordLookupEditor
                    );
                    advancedOptionCheckbox.dispatchEvent(
                        new ToggleOnChangeEvent()
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor).toMatchSnapshot();
                    });
                });
                it('Use adavanced checkbox should be checked', () => {
                    return Promise.resolve().then(() => {
                        expect(advancedOptionCheckbox.checked).toBe(true);
                    });
                });
                describe('re uncheck "use advanced mode" checkbox to move back to automatic mode ', () => {
                    beforeEach(() => {
                        advancedOptionCheckbox.dispatchEvent(
                            new ToggleOnChangeEvent()
                        );
                    });
                    test('check UI - child components displayed or not (snapshot)', () => {
                        return Promise.resolve().then(() => {
                            expect(recordLookupEditor).toMatchSnapshot();
                        });
                    });
                    it('Use adavanced checkbox should be unchecked', () => {
                        return Promise.resolve().then(() => {
                            expect(advancedOptionCheckbox.checked).toBe(false);
                        });
                    });
                });
                it('should not reset query fields in place once you select an sobject variable', () => {
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        sObjectOrSObjectCollectionPicker.dispatchEvent(
                            new SObjectReferenceChangedEvent(
                                store.accountSObjectVariable.guid
                            )
                        );
                        return Promise.resolve().then(() => {
                            expect(
                                recordSobjectAndQueryFields.queriedFields[1]
                                    .field.value
                            ).toBe('Name');
                        });
                    });
                });
                it('"way to store" value should be "sobjectvariable"', () => {
                    return Promise.resolve().then(() => {
                        const wayToStoreFields = getAutomaticWayToStoreFields(
                            recordLookupEditor
                        );
                        expect(wayToStoreFields).toBeDefined();
                        expect(wayToStoreFields.value).toBe(
                            WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                        );
                    });
                });
            });
        });
        describe('Edit element (automatic mode - collection record)', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    recordLookupElementAutomaticSCollectionRecord(),
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                );
            });
            test('check UI - child components displayed or not (snapshot)', () => {
                expect(recordLookupEditor).toMatchSnapshot();
            });
            it('Number of record to store should be "AllRecords"', () => {
                expect(
                    getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor)
                        .value
                ).toBe(NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
            });
            it('Use advanced mode checkbox should be unchecked', () => {
                const advancedOptionCheckbox = getAdvancedOptionCheckbox(
                    recordLookupEditor
                );
                expect(advancedOptionCheckbox).toBeDefined();
                expect(advancedOptionCheckbox.checked).toBe(false);
            });
            it('"recordQuery" fields', () => {
                const recordQueryFields = getAutomaticQueryFields(
                    recordLookupEditor
                );
                expect(recordQueryFields.queriedFields[0].field.value).toBe(
                    'Id'
                );
                expect(recordQueryFields.queriedFields[1].field.value).toBe(
                    'Name'
                );
            });
            describe('Check Use Advanced Options checkbox', () => {
                let advancedOptionCheckbox;
                beforeEach(() => {
                    advancedOptionCheckbox = getAdvancedOptionCheckbox(
                        recordLookupEditor
                    );
                    advancedOptionCheckbox.dispatchEvent(
                        new ToggleOnChangeEvent()
                    );
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    return Promise.resolve().then(() => {
                        expect(recordLookupEditor).toMatchSnapshot();
                    });
                });
                it('Use adavanced checkbox should be checked', () => {
                    return Promise.resolve().then(() => {
                        expect(advancedOptionCheckbox.checked).toBe(true);
                    });
                });
                describe('re uncheck "use advanced mode" checkbox to move back to automatic mode ', () => {
                    beforeEach(() => {
                        advancedOptionCheckbox.dispatchEvent(
                            new ToggleOnChangeEvent()
                        );
                    });
                    test('check UI - child components displayed or not (snapshot)', () => {
                        return Promise.resolve().then(() => {
                            expect(recordLookupEditor).toMatchSnapshot();
                        });
                    });
                    it('Use adavanced checkbox should be unchecked', () => {
                        return Promise.resolve().then(() => {
                            expect(advancedOptionCheckbox.checked).toBe(false);
                        });
                    });
                });
                it('should not reset query fields in place once you select an sobject variable', () => {
                    return Promise.resolve().then(() => {
                        const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                            recordLookupEditor
                        );
                        const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                            recordSobjectAndQueryFields
                        );
                        sObjectOrSObjectCollectionPicker.dispatchEvent(
                            new SObjectReferenceChangedEvent(
                                store.accountSObjectVariable.guid
                            )
                        );
                        return Promise.resolve().then(() => {
                            expect(
                                recordSobjectAndQueryFields.queriedFields[1]
                                    .field.value
                            ).toBe('Name');
                        });
                    });
                });
                it('store option (number to store) value should be "AllRecords"', () => {
                    return Promise.resolve().then(() => {
                        const numberRecordToStoreComponent = getNumberRecordToStoreComponent(
                            recordLookupEditor
                        );
                        expect(numberRecordToStoreComponent).toBeDefined();
                        expect(
                            numberRecordToStoreComponent.numberRecordsToStoreValue
                        ).toBe(NUMBER_RECORDS_TO_STORE.ALL_RECORDS);
                    });
                });
            });
        });
        describe('Flow using Automatic output handling saved with a process type that does not support Automatic output handling ', () => {
            beforeEach(() => {
                expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(
                    store.accountSObjectVariable
                );
                recordLookupEditor = createComponentForTest(
                    recordLookupElementWithoutOutputRefNorOutputAssignment(),
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                );
            });
            test('Advanced Option Component should not be visible', () => {
                expect(
                    getUseAdvancedOptionComponent(recordLookupEditor)
                ).toBeNull();
            });
            test('Store options (Way to store) should be "sObjectVariable"', () => {
                expect(
                    getRecordStoreOption(recordLookupEditor).wayToStoreFields
                ).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
            });
            test('sObject picker should be visible"', () => {
                const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(
                    recordLookupEditor
                );
                expect(
                    getsObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    )
                ).not.toBeNull();
            });
        });
    });
});
