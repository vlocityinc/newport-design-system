import { createElement } from 'lwc';
import RecordLookupEditor from '../recordLookupEditor';
import { getResourceByUniqueIdentifier } from 'builder_platform_interaction/expressionUtils';
import {
    SORT_ORDER,
    NUMBER_RECORDS_TO_STORE,
    WAY_TO_STORE_FIELDS,
    VARIABLE_AND_FIELD_MAPPING_VALUES
} from 'builder_platform_interaction/recordEditorLib';
import {
    AddElementEvent,
    ComboboxStateChangedEvent,
    EditElementEvent,
    SObjectReferenceChangedEvent
} from 'builder_platform_interaction/events';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    flowWithAllElementsUIModel,
    lookupRecordAutomaticOutput,
    lookupRecordAutomaticOutputWithFields,
    lookupRecordOutputReference as lookupRecordManual
} from 'mock/storeData';
import {
    changeEvent,
    checkboxChangeEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import {
    getEntityResourcePicker,
    getRecordNumberRecordToStore,
    getRecordQueryFields,
    getRecordSobjectAndQueryFields,
    getRecordStoreOption,
    getSObjectOrSObjectCollectionPicker
} from '../../integrationTests/__tests__/clud/cludEditorTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'Flow';
const MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE = 'other';

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

const createComponentForTest = (
    node,
    mode = EditElementEvent.EVENT_NAME,
    processType = MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE
) => {
    const el = createElement('builder_platform_interaction-record-lookup-editor', { is: RecordLookupEditor });
    Object.assign(el, { node, processType, mode });
    setDocumentBodyChildren(el);
    return el;
};

const comboboxStateChangedEventDetailEntityCaseItem = {
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
    item = comboboxStateChangedEventDetailEntityCaseItem,
    displayText = comboboxStateChangedEventDetailEntityCaseItem.displayText,
    error = null
) =>
    // @ts-ignore
    new ComboboxStateChangedEvent(item, displayText, error);

const defaultNewRecordLookupElement = {
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
    outputReferenceIndex: { value: '515fa22c-c633-48fe-a97e-4fd3c272cc24', error: null },
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
};

const getAutomaticRecordStoreOptionsRadioGroup = (recordLookupEditor) =>
    getRecordNumberRecordToStore(recordLookupEditor).shadowRoot.querySelector(
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
    );

const getManualWayToStoreFields = (recordLookupEditor) =>
    recordLookupEditor.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

const getVariableAndFieldMappingComponent = (recordLookupEditor) =>
    recordLookupEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.VARIABLE_AND_FIELD_MAPPING_COMPONENT);

const getVariableAndFieldMappingRadioButtonGroup = (recordLookupEditor) =>
    getVariableAndFieldMappingComponent(recordLookupEditor).shadowRoot.querySelector(
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
    );

describe('record-lookup-editor', () => {
    let recordLookupEditor, entityResourcePicker, recordLookupNode;
    beforeAll(() => {
        // @ts-ignore
        Store.setMockState(flowWithAllElementsUIModel);
    });
    afterAll(() => {
        // @ts-ignore
        Store.resetStore();
    });
    describe('Process type supporting the automatic mode', () => {
        describe('Adding element', () => {
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(defaultNewRecordLookupElement, AddElementEvent.EVENT_NAME);
            });
            it('default storeOutputAutomatically should be true', () => {
                expect(recordLookupEditor.node.storeOutputAutomatically).toBe(true);
            });
            it('sets the "processType"', () => {
                expect(recordLookupEditor.processType).toBe(MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE);
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
                it(`entity picker (object) value should be "${comboboxStateChangedEventDetailEntityCaseItem.value}"`, () => {
                    expect(getEntityResourcePicker(recordLookupEditor).value).toBe(
                        comboboxStateChangedEventDetailEntityCaseItem.value
                    );
                });
                it('Variable and Field Mapping radiobutton group should be visible and Automatic should be selected', async () => {
                    await ticks(1);
                    const variableAndFieldMappingRadioButtonGroup =
                        getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
                    expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC
                    );
                });
            });
        });
        describe('Edit element (automatic mode)', () => {
            beforeAll(() => {
                recordLookupNode = getElementForPropertyEditor(lookupRecordAutomaticOutput);
            });
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
            });
            describe('"RecordNumberRecordToStore"', () => {
                it('Number of record to store should be "firstRecord"', () => {
                    expect(getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor).value).toBe(
                        NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                    );
                });
                it('handles "NumberRecordToStoreChanged" event', async () => {
                    const recordNumberToStoreRadioGroup = getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor);
                    recordNumberToStoreRadioGroup.dispatchEvent(changeEvent(NUMBER_RECORDS_TO_STORE.ALL_RECORDS));
                    await ticks(1);
                    expect(recordLookupEditor.node.getFirstRecordOnly).toBe(false);
                });
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
                const variableAndFieldMappingRadioButtonGroup =
                    getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
                expect(variableAndFieldMappingRadioButtonGroup).not.toBeNull();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC);
            });
            it('"recordQuery" fields should not be visible', () => {
                const recordQueryFields = getRecordQueryFields(recordLookupEditor);
                expect(recordQueryFields).toBeNull();
            });
            describe('Select Manual on the variable And Field Mapping Radio Button Group', () => {
                let variableAndFieldMappingRadioButtonGroup;
                beforeEach(() => {
                    variableAndFieldMappingRadioButtonGroup =
                        getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
                    variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                        changeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                    );
                });
                it('check UI - child components displayed or not (snapshot)', async () => {
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
                const variableAndFieldMappingRadioButtonGroup =
                    getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
                expect(variableAndFieldMappingRadioButtonGroup).toBeDefined();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                    VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                );
            });
            it('"recordQuery" fields', () => {
                const recordQueryFields = getRecordQueryFields(recordLookupEditor);
                expect(recordQueryFields.queriedFields[0].field.value).toBe('Id');
                expect(recordQueryFields.queriedFields[1].field.value).toBe('Name');
            });
            describe('Select Manual', () => {
                let variableAndFieldMappingRadioButtonGroup;
                beforeEach(async () => {
                    variableAndFieldMappingRadioButtonGroup =
                        getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
                    variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                        changeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                    );
                    await ticks(1);
                });
                it('check UI - child components displayed or not (snapshot)', () => {
                    expect(recordLookupEditor).toMatchSnapshot();
                });
                it('Selected value should be Manual (advanced)', () => {
                    expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                        VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL
                    );
                });
                it('should not reset query fields in place once you select an sobject variable', () => {
                    const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                    const sObjectOrSObjectCollectionPicker =
                        getSObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
                    sObjectOrSObjectCollectionPicker.dispatchEvent(
                        new SObjectReferenceChangedEvent(lookupRecordAutomaticOutput.outputReference)
                    );
                    expect(recordSobjectAndQueryFields.queriedFields[1].field.value).toBe('Name');
                });
                it('store option (number to store) value should be "FirstRecord"', async () => {
                    const numberRecordToStoreComponent = getRecordNumberRecordToStore(recordLookupEditor);
                    expect(numberRecordToStoreComponent).not.toBeNull();
                    expect(numberRecordToStoreComponent.numberRecordsToStoreValue).toBe(
                        NUMBER_RECORDS_TO_STORE.FIRST_RECORD
                    );
                });
            });
        });
        describe('Flow using Automatic output handling saved with a process type that does not support Automatic output handling ', () => {
            let recordLookupElementWithoutOutputRefNorOutputAssignment;
            beforeAll(() => {
                recordLookupElementWithoutOutputRefNorOutputAssignment =
                    getElementForPropertyEditor(lookupRecordAutomaticOutput);
                // @ts-ignore
                getResourceByUniqueIdentifier.mockReturnValue(lookupRecordAutomaticOutput);
            });
            beforeEach(() => {
                recordLookupEditor = createComponentForTest(
                    recordLookupElementWithoutOutputRefNorOutputAssignment,
                    EditElementEvent.EVENT_NAME,
                    MOCK_PROCESS_TYPE_NOT_SUPPORTING_AUTOMATIC_MODE
                );
            });
            it('should NOT display "RecordLookupVariableAndFieldMapping"', () => {
                expect(getVariableAndFieldMappingComponent(recordLookupEditor)).toBeNull();
            });
            it('Store options (Way to store) should be "sObjectVariable"', () => {
                expect(getRecordStoreOption(recordLookupEditor).wayToStoreFields).toBe(
                    WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE
                );
            });
            it('should display "RecordSobjectAndQueryFields"', () => {
                const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
                expect(getSObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields)).not.toBeNull();
            });
        });
    });
    describe('Edit element (manual mode)', () => {
        beforeAll(() => {
            recordLookupNode = getElementForPropertyEditor(lookupRecordManual);
        });
        beforeEach(() => {
            recordLookupEditor = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
        });
        it('Number of record to store should be "firstRecord"', () => {
            expect(getAutomaticRecordStoreOptionsRadioGroup(recordLookupEditor).value).toBe(
                NUMBER_RECORDS_TO_STORE.FIRST_RECORD
            );
        });
        describe('"WayToStoreFields"', () => {
            let wayToStoreFieldsRadioGroup;
            beforeEach(() => {
                wayToStoreFieldsRadioGroup = recordLookupEditor.shadowRoot.querySelector(
                    LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
                );
            });
            it('displays "sObjectVariable" as checked ', () => {
                expect(wayToStoreFieldsRadioGroup).not.toBeNull();
                expect(wayToStoreFieldsRadioGroup.value).toBe(WAY_TO_STORE_FIELDS.SOBJECT_VARIABLE);
            });
            it('change event handled ', async () => {
                wayToStoreFieldsRadioGroup.dispatchEvent(changeEvent(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES));
                await ticks(1);
                expect(recordLookupEditor.getNode().wayToStoreFields).toBe(WAY_TO_STORE_FIELDS.SEPARATE_VARIABLES);
            });
        });
        describe('"assignNullValuesIfNoRecordsFound"', () => {
            let assignNullValuesIfNoRecordsFound;
            beforeEach(() => {
                assignNullValuesIfNoRecordsFound = recordLookupEditor.shadowRoot.querySelector(
                    LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT
                );
            });
            it('is checked', () => {
                expect(assignNullValuesIfNoRecordsFound).not.toBeNull();
                expect(assignNullValuesIfNoRecordsFound.checked).toBe(true);
            });
            it('change event handled', async () => {
                assignNullValuesIfNoRecordsFound.dispatchEvent(checkboxChangeEvent(false));
                await ticks(1);
                expect(recordLookupEditor.getNode().assignNullValuesIfNoRecordsFound).toBe(false);
            });
        });

        it('Variable and Field Mapping radiobutton group: Manual (advanced) should be selected', () => {
            const variableAndFieldMappingRadioButtonGroup =
                getVariableAndFieldMappingRadioButtonGroup(recordLookupEditor);
            expect(variableAndFieldMappingRadioButtonGroup).not.toBeNull();
            expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL);
        });
        it('Should display the sobject placeholder and value', () => {
            const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
            const sObjectOrSObjectCollectionPicker = getSObjectOrSObjectCollectionPicker(recordSobjectAndQueryFields);
            expect(sObjectOrSObjectCollectionPicker.placeholder).toBe('FlowBuilderRecordEditor.searchRecords');
            expect(sObjectOrSObjectCollectionPicker.value).toBe(lookupRecordManual.outputReference);
        });
        it('should display the 1 query fields', () => {
            const recordSobjectAndQueryFields = getRecordSobjectAndQueryFields(recordLookupEditor);
            expect(recordSobjectAndQueryFields.queriedFields[0].field.value).toBe('Id');
        });
    });
});
