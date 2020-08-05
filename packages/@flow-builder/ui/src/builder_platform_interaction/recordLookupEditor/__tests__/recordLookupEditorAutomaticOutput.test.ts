// @ts-nocheck
import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import * as expressionUtilsMock from 'builder_platform_interaction/expressionUtils';
import * as store from 'mock/storeData';
import {
    SORT_ORDER,
    NUMBER_RECORDS_TO_STORE,
    WAY_TO_STORE_FIELDS,
    VARIABLE_AND_FIELD_MAPPING_VALUES
} from 'builder_platform_interaction/recordEditorLib';
import { AddElementEvent, EditElementEvent, SObjectReferenceChangedEvent } from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    lookupRecordAutomaticOutput,
    lookupRecordAutomaticOutputWithFields,
    lookupRecordOutputReference as lookupRecordManual
} from 'mock/storeData';
import {
    deepQuerySelector,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { flowWithAllElementsUIModel } from 'mock/storeData';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';

jest.mock('builder_platform_interaction/fieldToFerovExpressionBuilder', () =>
    require('builder_platform_interaction_mocks/fieldToFerovExpressionBuilder')
);
jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/fieldPicker', () => require('builder_platform_interaction_mocks/fieldPicker'));
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const MOCK_GUID = '515fa22c-c633-48fe-a97e-4fd3c272cc24';
const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'flow';
const MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE = 'other';

class OnChangeEvent extends CustomEvent {
    constructor(value) {
        super('change', { detail: { value } });
    }
}

function createComponentForTest(
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
) {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, { node, processType, mode });
    document.body.appendChild(el);
    return el;
}

const defaultValueItem = { item: { value: 'guid1', displayText: 'var 1' } };

const getComboboxStateChangedEvent = (detail = defaultValueItem) => {
    return new CustomEvent('comboboxstatechanged', {
        detail
    });
};

jest.mock('builder_platform_interaction/processTypeLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/processTypeLib');
    const FLOW_AUTOMATIC_OUTPUT_HANDLING = actual.FLOW_AUTOMATIC_OUTPUT_HANDLING;
    return {
        FLOW_AUTOMATIC_OUTPUT_HANDLING,
        getProcessTypeAutomaticOutPutHandlingSupport: jest.fn((processType) => {
            return processType === MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
                ? FLOW_AUTOMATIC_OUTPUT_HANDLING.SUPPORTED
                : FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
        })
    };
});

jest.mock('builder_platform_interaction/expressionUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/expressionUtils');
    return {
        getResourceByUniqueIdentifier: jest.fn(),
        getEntitiesMenuData: actual.getEntitiesMenuData,
        EXPRESSION_PROPERTY_TYPE: actual.EXPRESSION_PROPERTY_TYPE,
        getChildrenItems: actual.getChildrenItems,
        filterMatches: actual.filterMatches
    };
});

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const defaultNewRecordLookupElement = () => ({
    assignNullValuesIfNoRecordsFound: false,
    config: { isSelected: false, isHighlighted: false },
    connectorCount: 0,
    dataType: { value: 'Boolean', error: null },
    description: { value: '', error: null },
    elementType: 'RecordQuery',
    guid: '326e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: '', error: null },
    locationX: 300,
    locationY: 303.3125,
    maxConnections: 2,
    name: { value: '', error: null },
    object: { value: '', error: null },
    objectIndex: { value: 'guid', error: null },
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    outputAssignments: [],
    outputReference: undefined,
    queriedFields: [],
    sortField: { value: '', error: null },
    sortOrder: SORT_ORDER.NOT_SORTED,
    filterLogic: { value: CONDITION_LOGIC.AND, error: null },
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
    getFirstRecordOnly: true,
    storeOutputAutomatically: false,
    variableAndFieldMapping: VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
});

const recordLookupElementWithoutOutputRefNorOutputAssignment = () => ({
    config: { isSelected: true, isHighlighted: false },
    connectorCount: 0,
    dataType: { value: 'SObject', error: null },
    description: { value: '', error: null },
    filterLogic: { value: CONDITION_LOGIC.NO_CONDITIONS, error: null },
    filters: [],
    elementType: 'RecordQuery',
    getFirstRecordOnly: true,
    guid: '426e1b1a-7235-487f-9b44-38db56af4a45',
    isCanvasElement: true,
    label: { value: 'testRecord', error: null },
    name: { value: 'testRecord', error: null },
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
    object: { value: 'Account', error: null },
    objectIndex: { value: 'guid', error: null },
    outputReference: undefined,
    outputReferenceIndex: { value: MOCK_GUID, error: null },
    subtype: {
        value: 'Account',
        error: null
    },
    storeOutputAutomatically: true,
    variableAndFieldMapping: 'automatic'
});

const getRecordStoreOption = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_STORE_OPTION);
};

const getEntityResourcePicker = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.ENTITY_RESOURCE_PICKER);
};

const getRecordSobjectAndQueryFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT);
};

const getsObjectOrSObjectCollectionPicker = (recordSobjectAndQueryFields) => {
    return recordSobjectAndQueryFields.shadowRoot.querySelector(SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);
};

const getNumberRecordToStoreComponent = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_NUMBER_RECORD_TO_STORE);
};

const getAutomaticRecordStoreOptionsRadioGroup = (recordLookupEditor) => {
    return getNumberRecordToStoreComponent(recordLookupEditor).shadowRoot.querySelector(
        SELECTORS.LIGHTNING_RADIO_GROUP
    );
};

const getAutomaticQueryFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.RECORD_QUERY_FIELDS_COMPONENT);
};

const getManualWayToStoreFields = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.LIGHTNING_RADIO_GROUP);
};

const getVariableAndFieldMappingComponent = (recordLookupEditor) => {
    return recordLookupEditor.shadowRoot.querySelector(SELECTORS.VARIABLE_AND_FIELD_MAPPING_COMPONENT);
};

const getVariableAndFieldMappingRadioButtonGroup = (recordLookupEditor) => {
    return deepQuerySelector(recordLookupEditor, [
        SELECTORS.VARIABLE_AND_FIELD_MAPPING_COMPONENT,
        SELECTORS.LIGHTNING_RADIO_GROUP
    ]);
};

describe('record-lookup-editor', () => {
    let recordLookupEditor, entityResourcePicker, recordLookupNode;
    beforeAll(() => {
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        Store.resetStore();
    });
    describe('Process type supporting the automatic mode', () => {
        describe('Adding element', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    defaultNewRecordLookupElement(),
                    AddElementEvent.EVENT_NAME
                );
            });
            it('default storeOutputAutomatically should be true', () => {
                expect(recordLookupEditor.node.storeOutputAutomatically).toBe(true);
            });
            it('default variableAndFieldMapping should be Automatic', () => {
                expect(recordLookupEditor.node.variableAndFieldMapping).toBe(
                    VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
                );
            });
            it('default queryFields should be Null', () => {
                expect(recordLookupEditor.node.queriedFields).toBeNull();
            });
            describe('After entity (object) is selected', () => {
                beforeEach(() => {
                    entityResourcePicker = getEntityResourcePicker(recordLookupEditor);
                    entityResourcePicker.dispatchEvent(getComboboxStateChangedEvent());
                });
                test('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it(`entity picker (object) value should be "${defaultValueItem.item.value}"`, () => {
                    expect(getEntityResourcePicker(recordLookupEditor).value).toBe(defaultValueItem.item.value);
                });
                it('Variable and Field Mapping radiobutton group should be visible and Automatic should be selected', async () => {
                    await ticks(1);
                    const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                        recordLookupEditor
                    );
                    expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
                    );
                });
            });
        });
        describe('Edit element (automatic mode)', () => {
            beforeEach(() => {
                recordLookupNode = getElementForPropertyEditor(lookupRecordAutomaticOutput);
                recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            it('Number of record to store should be "firstRecord"', () => {
                expect(getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor).value).toBe(
                    NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                );
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
                const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupEditor
                );
                expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC);
            });
            it('"recordQuery" fields should not be visible', () => {
                const recordQueryFields = getAutomaticQueryFields(recordLookupEditor);
                expect(recordQueryFields).toBeNull();
            });
            describe('Select Manual on the variable And Field Mapping Radio Button Group', () => {
                let variableAndFieldMappingRadioButtonGroup;
                beforeEach(() => {
                    variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                        recordLookupEditor
                    );
                    variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                        new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                    );
                });
                test('check UI - child components displayed or not (snapshot)', async () => {
                    await ticks(1);
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('Use adavanced checkbox should be checked', async () => {
                    await ticks(1);
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                    );
                });
                it('recordSobjectAndQueryFields should be displayed', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    expect(recordSobjectAndQueryFields).toBeDefined();
                });
                it('"way to store" value should be "sobjectvariable"', async () => {
                    await ticks(1);
                    const wayToStoreFields = getManualWayToStoreFields(recordLookupEditor);
                    expect(wayToStoreFields).toBeDefined();
                    expect(wayToStoreFields.value).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
                });
            });
        });
        describe('Edit element (automatic with fields mode)', () => {
            beforeEach(() => {
                recordLookupNode = getElementForPropertyEditor(lookupRecordAutomaticOutputWithFields);
                recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            it('Number of record to store should be "firstRecord"', () => {
                expect(getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor).value).toBe(
                    NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                );
            });
            it('Variable and Field Mapping radiobutton group: Automatic Variable, Manual Fields (advanced) should be selected', () => {
                const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupEditor
                );
                expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                    VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                );
            });
            it('"recordQuery" fields', () => {
                const recordQueryFields = getAutomaticQueryFields(recordLookupEditor);
                expect(recordQueryFields.queriedFields[0].field.value).toBe('Id');
                expect(recordQueryFields.queriedFields[1].field.value).toBe('Name');
            });
            describe('Select Manual', () => {
                let variableAndFieldMappingRadioButtonGroup;
                beforeEach(() => {
                    variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                        recordLookupEditor
                    );
                    variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                        new OnChangeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                    );
                });
                test('check UI - child components displayed or not (snapshot)', async () => {
                    await ticks(1);
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('Selected value should be Manual (advanced)', async () => {
                    await ticks(1);
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                    );
                });
                it('should not reset query fields in place once you select an sobject variable', async () => {
                    await ticks(2);
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(
                        recordSobjectAndQueryFields
                    );
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(store.accountSObjectVariable.guid)
                    );
                    await ticks(1);
                    expect(recordSobjectAndQueryFields.queriedFields[1].field.value).toBe('Name');
                });
                it('store option (number to store) value should be "FirstRecord"', async () => {
                    await ticks(1);
                    const numberRecordToStoreComponent = getNumberRecordToStoreComponent(recordLookupEditor);
                    expect(numberRecordToStoreComponent).toBeDefined();
                    expect(numberRecordToStoreComponent.numberRecordsToStoreValue).toBe(
                        NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                    );
                });
            });
        });
        describe('Flow using Automatic output handling saved with a process type that does not support Automatic output handling ', () => {
            beforeEach(() => {
                expressionUtilsMock.getResourceByUniqueIdentifier.mockReturnValue(store.accountSObjectVariable);
                recordLookupEditor = createComponentForTest(
                    recordLookupElementWithoutOutputRefNorOutputAssignment(),
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                );
            });
            it('Selected value should be Manual (advanced)', async () => {
                await ticks(1);
                expect(getVariableAndFieldMappingComponent(recordLookupEditor)).toBeNull();
            });
            test('Store options (Way to store) should be "sObjectVariable"', () => {
                expect(getRecordStoreOption(recordLookupEditor).wayToStoreFields).toBe(
                    WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                );
            });
            test('sObject picker should be visible"', () => {
                const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                expect(getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields)).not.toBeNull();
            });
        });
    });
    describe('Edit element (manual mode)', () => {
        beforeEach(() => {
            recordLookupNode = getElementForPropertyEditor(lookupRecordManual);
            recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
        });
        it('Number of record to store should be "firstRecord"', () => {
            expect(getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor).value).toBe(
                NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            );
        });
        it('Variable and Field Mapping radiobutton group: Manual (advanced) should be selected', () => {
            const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                recordLookupEditor
            );
            expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
            expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL);
        });
        it('Should display the sobject placeholder and value', () => {
            const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
            const sObjectOrSObjectCollectionPicker = getsObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
            expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.searchRecords');
            expect(sObjectOrSObjectCollectionPicker.value).toBe(store.accountSObjectVariable.guid);
        });
        it('should display the 1 query fields', () => {
            const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
            expect(recordSobjectAndQueryFields.queriedFields[0].field.value).toBe('Id');
        });
    });
});
