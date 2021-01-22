import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FlowScreenFieldType, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createComponentUnderTest,
    getComponentsPaletteInFirstTab,
    getAutomaticFieldsPaletteInSecondTab,
    getScreenField,
    getScreenFieldInSection,
    getSectionElementInScreenEditorCanvas
} from '../../screenEditorTestUtils';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

describe('ScreenEditor automatic fields', () => {
    let screenNode;
    let screenEditor;
    let screenWithAutomaticFieldsNotInSectionEditor;
    describe('Existing flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
            const element = getElementByDevName('screenWithAutomaticFields');
            screenNode = getElementForPropertyEditor(element);
            screenWithAutomaticFieldsNotInSectionEditor = createComponentUnderTest({
                node: screenNode,
                processType: FLOW_PROCESS_TYPE.FLOW
            });
        });
        afterAll(() => {
            resetState();
        });
        describe('Screen editor tabs', () => {
            it('should contain in first tab the components palette', () => {
                expect(getComponentsPaletteInFirstTab(screenWithAutomaticFieldsNotInSectionEditor)).not.toBeNull();
            });
            it('should contain in second tab the automatic field palette', () => {
                expect(
                    getAutomaticFieldsPaletteInSecondTab(screenWithAutomaticFieldsNotInSectionEditor)
                ).not.toBeNull();
            });
        });
        describe('Automatic field in canvas', () => {
            describe('No section', () => {
                it('displays a TextBox for text field', () => {
                    const accountNameField = getScreenField(
                        screenWithAutomaticFieldsNotInSectionEditor,
                        'Account Name'
                    );
                    expect(accountNameField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.TextBox,
                        dataType: FLOW_DATA_TYPE.STRING.value,
                        icon: 'standard:textbox',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                        type: 'String',
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        label: 'Account Name'
                    });
                });
                it('displays a Number for numeric field', () => {
                    const accountEmployeesField = getScreenField(
                        screenWithAutomaticFieldsNotInSectionEditor,
                        'Employees'
                    );
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.Number,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        dataType: FLOW_DATA_TYPE.NUMBER.value,
                        label: 'Employees',
                        icon: 'standard:number_input',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
            });
            describe('In section', () => {
                beforeAll(() => {
                    const element = getElementByDevName('screenWithAutomaticFieldsInSection');
                    screenNode = getElementForPropertyEditor(element);
                    screenEditor = createComponentUnderTest({
                        node: screenNode,
                        processType: FLOW_PROCESS_TYPE.FLOW
                    });
                });
                it('displays a TextBox for text field', () => {
                    const accountNameField = getScreenFieldInSection(
                        getSectionElementInScreenEditorCanvas(
                            screenEditor,
                            'screenWithAutomaticFieldsInSection_Section1'
                        ),
                        'Account Name'
                    );
                    expect(accountNameField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.TextBox,
                        dataType: FLOW_DATA_TYPE.STRING.value,
                        icon: 'standard:textbox',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                        type: 'String',
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        label: 'Account Name'
                    });
                });
                it('displays a Number for numeric field', () => {
                    const accountEmployeesField = getScreenFieldInSection(
                        getSectionElementInScreenEditorCanvas(
                            screenEditor,
                            'screenWithAutomaticFieldsInSection_Section1'
                        ),
                        'Employees'
                    );
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.Number,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        dataType: FLOW_DATA_TYPE.NUMBER.value,
                        label: 'Employees',
                        icon: 'standard:number_input',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
            });
        });
    });
});
