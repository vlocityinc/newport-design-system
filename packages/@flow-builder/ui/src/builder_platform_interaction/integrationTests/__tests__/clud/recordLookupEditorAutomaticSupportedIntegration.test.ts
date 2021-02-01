import { createElement } from 'lwc';
import RecordLookupEditor from 'builder_platform_interaction/recordLookupEditor';
import { resetState, setupStateForFlow } from '../integrationTestUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { EditElementEvent, AddElementEvent } from 'builder_platform_interaction/events';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import {
    NUMBER_RECORDS_TO_STORE,
    SORT_ORDER,
    VARIABLE_AND_FIELD_MAPPING_VALUES
} from 'builder_platform_interaction/recordEditorLib';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    changeEvent,
    ticks,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { getEntityResourcePicker, getRecordQueryFields, getRecordSort } from './cludEditorTestUtils';

const MOCK_PROCESS_TYPE_SUPPORTING_AUTOMATIC_MODE = 'Flow';

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

const getVariableAndFieldMappingRadioButtonGroup = (recordLookupEditor) =>
    deepQuerySelector(recordLookupEditor, [
        INTERACTION_COMPONENTS_SELECTORS.VARIABLE_AND_FIELD_MAPPING_COMPONENT,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
    ]);

const getAutomaticRecordStoreOptionsRadioGroup = (recordLookupEditor) =>
    deepQuerySelector(recordLookupEditor, [
        INTERACTION_COMPONENTS_SELECTORS.RECORD_NUMBER_RECORD_TO_STORE,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP
    ]);

describe('Record Lookup Editor (automatic support)', () => {
    let recordLookupNode, recordLookupElement;
    beforeAll(async () => {
        await setupStateForFlow(flowWithAllElements);
    });
    afterAll(() => {
        resetState();
    });
    describe('Add new element', () => {
        beforeAll(() => {
            recordLookupNode = getElementForPropertyEditor({
                elementType: ELEMENT_TYPE.RECORD_LOOKUP
            });
        });
        beforeEach(() => {
            recordLookupElement = createComponentForTest(recordLookupNode, AddElementEvent.EVENT_NAME);
        });
        it('entity picker should be displayed and no "displayText"', async () => {
            const entityResourcePicker = getEntityResourcePicker(recordLookupElement);
            expect(entityResourcePicker).not.toBeNull();
            expect(entityResourcePicker.value.displayText).toBeUndefined();
        });
    });
    describe('Working with automatic output handling', () => {
        beforeAll(() => {
            const element = getElementByDevName('lookupRecordAutomaticOutput');
            recordLookupNode = getElementForPropertyEditor(element);
        });
        beforeEach(() => {
            recordLookupElement = createComponentForTest(recordLookupNode, EditElementEvent.EVENT_NAME);
        });
        it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
            const variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                recordLookupElement
            );
            expect(variableAndFieldMappingRadioButtonGroup).not.toBeNull();
            expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC);
        });
        it('"recordQuery" fields should not be visible', () => {
            const recordQueryFields = getRecordQueryFields(recordLookupElement);
            expect(recordQueryFields).toBeNull();
        });
        it('record store option should have "Only the first record"', () => {
            const recordStoreOptionsRadioGroup = getAutomaticRecordStoreOptionsRadioGroup(recordLookupElement);
            expect(recordStoreOptionsRadioGroup.value).toBe(NUMBER_RECORDS_TO_STORE.FIRST_RECORD);
        });
        it('sortField and SortOrder should be correctly displayed', () => {
            const recordSortElement = getRecordSort(recordLookupElement);
            expect(recordSortElement.sortOrder).toBe(SORT_ORDER.NOT_SORTED);
        });
        describe('Select Automatic with flow on the variable And Field Mapping Radio Button Group', () => {
            let variableAndFieldMappingRadioButtonGroup;
            beforeEach(async () => {
                variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupElement
                );
                variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                    changeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS)
                );
                await ticks(1);
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', () => {
                expect(variableAndFieldMappingRadioButtonGroup).not.toBeNull();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(
                    VARIABLE_AND_FIELD_MAPPING_VALUES.AUTOMATIC_WITH_FIELDS
                );
            });
            it('Query fields should be displayed', () => {
                const recordQueryFields = getRecordQueryFields(recordLookupElement);
                expect(recordQueryFields.queriedFields[0].field.value).toBe('Id');
                expect(recordQueryFields.queriedFields[1].field.value).toBe('');
                expect(recordQueryFields.queriedFields[2]).toBeUndefined();
            });
        });
        describe('Select Manual on the variable And Field Mapping Radio Button Group', () => {
            let variableAndFieldMappingRadioButtonGroup;
            beforeEach(async () => {
                variableAndFieldMappingRadioButtonGroup = getVariableAndFieldMappingRadioButtonGroup(
                    recordLookupElement
                );
                variableAndFieldMappingRadioButtonGroup.dispatchEvent(
                    changeEvent(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL)
                );
                await ticks(1);
            });
            it('Variable and Field Mapping radiobutton group: Automatic should be selected', async () => {
                expect(variableAndFieldMappingRadioButtonGroup).not.toBeNull();
                expect(variableAndFieldMappingRadioButtonGroup.value).toBe(VARIABLE_AND_FIELD_MAPPING_VALUES.MANUAL);
            });
        });
    });
});
