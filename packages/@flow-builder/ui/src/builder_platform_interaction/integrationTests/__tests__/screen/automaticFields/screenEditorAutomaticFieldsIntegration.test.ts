import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FlowScreenFieldType, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';

describe('ScreenEditor automatic fields', () => {
    let screenEditor: ScreenEditorTestComponent;
    const createScreenEditor = async (elementName) => {
        const element = getElementByDevName(elementName);
        const screenNode = getElementForPropertyEditor(element);
        const screenEditor = createComponentUnderTest({
            node: screenNode,
            processType: FLOW_PROCESS_TYPE.FLOW
        });
        return new ScreenEditorTestComponent(screenEditor);
    };
    describe('Existing flow', () => {
        beforeAll(async () => {
            await setupStateForFlow(flowWithAllElements);
        });
        afterAll(() => {
            resetState();
        });
        describe('Screen editor tabs', () => {
            beforeAll(async () => {
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
            });
            it('should contain in first tab the components palette', () => {
                expect(screenEditor.getComponentsPalette()).not.toEqual(null);
            });
            it('should contain in second tab the automatic field palette', () => {
                expect(screenEditor.getAutomaticFieldsPalette()).not.toEqual(null);
            });
        });
        describe('Automatic field in canvas', () => {
            describe('No section', () => {
                beforeAll(async () => {
                    screenEditor = await createScreenEditor('screenWithAutomaticFields');
                });
                it('displays a TextBox for text field', () => {
                    const accountNameField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .getScreenFieldElement();
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
                    const accountEmployeesField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.NumberOfEmployees'
                        )!
                        .getScreenFieldElement();
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.Number,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        dataType: FLOW_DATA_TYPE.NUMBER.value,
                        label: 'Employees',
                        icon: 'standard:number_input',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
                it('displays a LargeTextArea for Text Area field', () => {
                    const accountEmployeesField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.Description'
                        )!
                        .getScreenFieldElement();
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.LargeTextArea,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        label: 'Account Description',
                        icon: 'standard:textarea',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
            });
            describe('In section', () => {
                beforeAll(async () => {
                    screenEditor = await createScreenEditor('screenWithAutomaticFieldsInSection');
                });
                it('displays a TextBox for text field', () => {
                    const accountNameField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .getScreenFieldElement();
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
                    const accountEmployeesField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.NumberOfEmployees'
                        )!
                        .getScreenFieldElement();
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.Number,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        dataType: FLOW_DATA_TYPE.NUMBER.value,
                        label: 'Employees',
                        icon: 'standard:number_input',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
                it('displays a LargeTextArea for Text Area field', () => {
                    const accountEmployeesField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.Description'
                        )!
                        .getScreenFieldElement();
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.LargeTextArea,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        label: 'Account Description',
                        icon: 'standard:textarea',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
            });
        });
    });
});
