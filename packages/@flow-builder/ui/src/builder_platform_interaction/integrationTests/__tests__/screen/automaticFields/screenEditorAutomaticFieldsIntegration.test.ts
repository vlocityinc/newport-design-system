import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FlowScreenFieldType, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import { createComponentUnderTest, ScreenEditorTestComponent } from '../../screenEditorTestUtils';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { INTERACTION_COMPONENTS_SELECTORS, ticks } from 'builder_platform_interaction/builderTestUtils';
import { setContext } from 'builder_platform_interaction/contextLib';
import { context } from 'serverData/GetContext/context.json';

jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeNumber', () => ({ default: 'Number({0}, {1})' }), {
    virtual: true
});
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeText', () => ({ default: 'Text({0})' }), {
    virtual: true
});
jest.mock(
    '@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeLongTextArea',
    () => ({ default: 'Long Text Area({0})' }),
    {
        virtual: true
    }
);

describe('ScreenEditor automatic fields', () => {
    let screenEditor: ScreenEditorTestComponent;
    const createScreenEditor = async (elementName) => {
        const element = getElementByDevName(elementName);
        const screenNode = getElementForPropertyEditor(element);
        const screenEditor = createComponentUnderTest({
            node: screenNode,
            processType: FLOW_PROCESS_TYPE.FLOW
        });
        const editor = new ScreenEditorTestComponent(screenEditor);
        await ticks(50);
        return editor;
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
            it('should contain in third tab the automatic field property editor', () => {
                expect(
                    screenEditor.getPropertiesEditorContainerElement().getAutomaticFieldPropertiesEditorElement
                ).toBeTruthy();
            });
        });
        describe('Screen field selection', () => {
            let canvas;
            describe.each`
                testTitlePart | screenName                              | componentName
                ${' NO'}      | ${'screenWithAutomaticFields'}          | ${'numberScreenField1'}
                ${''}         | ${'screenWithAutomaticFieldsInSection'} | ${'screenWithAutomaticFieldsInSection_Section1'}
            `('Screen with$testTitlePart sections', ({ screenName, componentName }) => {
                beforeAll(async () => {
                    screenEditor = await createScreenEditor(screenName);
                    canvas = screenEditor.getCanvas();
                });
                it('should switch to the field tab when an automatic field is selected on canvas', async () => {
                    expect(screenEditor.isComponentsTabActive()).toEqual(true);
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    expect(screenEditor.isFieldsTabActive()).toEqual(true);
                });
                it('should switch to the components tab when a field that is not an automatic field is selected on canvas', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    await canvas.getScreenEditorHighlightForScreenFieldWithName(componentName)!.click();
                    expect(screenEditor.isComponentsTabActive()).toEqual(true);
                });
                it('should display the record object (with correct value and pill icon/label) and fields when an automatic field is selected on canvas', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    const comboboxElement = sobjectPickerCombobox.element;
                    expect(comboboxElement.value.displayText).toBe('{!accountSObjectVariable}');
                    expect(comboboxElement.hasPill).toBe(true);
                    expect(comboboxElement.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'accountSObjectVariable'
                    });
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Account Number');
                });
                it('should display the record object (with correct value and  pill icon/label) and fields when 2 different automatic fields from same Object are selected on canvas', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.Description'
                        )!
                        .click();
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await ticks(1);
                    const comboboxElement = sobjectPickerCombobox.element;
                    expect(comboboxElement.value.displayText).toBe('{!accountSObjectVariable}');
                    expect(comboboxElement.hasPill).toBe(true);
                    expect(comboboxElement.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'accountSObjectVariable'
                    });
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Account Number');
                });
                it('should change accordingly the record object (with correct value and  pill icon/label) and fields when automatic fields from different Objects are selected on canvas', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'objectWithAllPossiblFieldsVariable.Text_Field__c'
                        )!
                        .click();
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await ticks(1);
                    const comboboxElement = sobjectPickerCombobox.element;
                    expect(comboboxElement.value.displayText).toBe('{!objectWithAllPossiblFieldsVariable}');
                    expect(comboboxElement.hasPill).toBe(true);
                    expect(comboboxElement.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'objectWithAllPossiblFieldsVariable'
                    });
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Text Field');
                });

                it('Display the correct pill and value (no error message) for the record object, and fields after removing pill on first record object and new record object selection', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();

                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await sobjectPickerCombobox.removePill();
                    const comboboxElement = sobjectPickerCombobox.element;
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'objectWithAllPossiblFieldsVariable.Text_Field__c'
                        )!
                        .click();
                    await ticks(1);
                    expect(comboboxElement.value.displayText).toBe('{!objectWithAllPossiblFieldsVariable}');
                    expect(comboboxElement.errorMessage).toBeNull();
                    expect(comboboxElement.hasPill).toBe(true);
                    expect(comboboxElement.pill).toEqual({
                        iconName: 'utility:sobject',
                        label: 'objectWithAllPossiblFieldsVariable'
                    });
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Text Field');
                });
            });
        });
        describe('Automatic field in canvas', () => {
            describe('No sections', () => {
                beforeAll(async () => {
                    screenEditor = await createScreenEditor('screenWithAutomaticFields');
                });
                it('displays a TextBox for text field', () => {
                    const accountNameField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .getScreenField().element;
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
                        .getScreenField().element;
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
                        .getScreenField().element;
                    expect(accountEmployeesField.screenfield.type).toMatchObject({
                        name: ScreenFieldName.LargeTextArea,
                        fieldType: FlowScreenFieldType.ObjectProvided,
                        label: 'Account Description',
                        icon: 'standard:textarea',
                        category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                    });
                });
                it('displays info bubble when record field has help text', () => {
                    const screenFieldWithHelp = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'objectWithAllPossiblFieldsVariable.Text_Field__c'
                        )!
                        .getScreenField();
                    const inputElement = screenFieldWithHelp.getScreenInputField()!.getInputElement() as any;
                    expect(inputElement.fieldLevelHelp).toBe('the help text for this field');
                });
                it('displays required indication if record field is required', () => {
                    const requiredScreenField = screenEditor
                        .getCanvas()
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'objectWithAllPossiblFieldsVariable.Text_Field__c'
                        )!
                        .getScreenField();
                    const inputElement = requiredScreenField.getScreenInputField()!.getInputElement() as any;
                    expect(inputElement.required).toBe(true);
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
                        .getScreenField().element;
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
                        .getScreenField().element;
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
                        .getScreenField().element;
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
        describe('Automatic field property editor', () => {
            beforeAll(async () => {
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
            });
            describe.each`
                description                                                            | fieldReference                                        | expectedName           | expectedLabel            | expectedDataType           | expectedObject                          | expectedIsRequired                                   | expectedHelptext
                ${'variable and text field'}                                           | ${'accountSObjectVariable.Name'}                      | ${'Name'}              | ${'Account Name'}        | ${'Text(255)'}             | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${null}
                ${'variable and number field'}                                         | ${'accountSObjectVariable.NumberOfEmployees'}         | ${'NumberOfEmployees'} | ${'Employees'}           | ${'Number(8, 0)'}          | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${null}
                ${'automatic output and text field'}                                   | ${'lookupRecordAutomaticOutput.Name'}                 | ${'Name'}              | ${'Account Name'}        | ${'Text(255)'}             | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${null}
                ${'variable and long text area'}                                       | ${'accountSObjectVariable.Description'}               | ${'Description'}       | ${'Account Description'} | ${'Long Text Area(32000)'} | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${null}
                ${'variable and required text field with helptext from custom object'} | ${'objectWithAllPossiblFieldsVariable.Text_Field__c'} | ${'Text_Field__c'}     | ${'Text Field'}          | ${'Text(128)'}             | ${'Object_with_all_possible_fields__c'} | ${'FlowBuilderAutomaticFieldEditor.isRequiredTrue'}  | ${'the help text for this field'}
            `(
                'Using $description',
                ({
                    fieldReference,
                    expectedName,
                    expectedLabel,
                    expectedDataType,
                    expectedObject,
                    expectedIsRequired,
                    expectedHelptext
                }) => {
                    beforeAll(() => {
                        screenEditor
                            .getCanvas()
                            .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(fieldReference)!
                            .click();
                    });
                    it('field name matches', () => {
                        expect(
                            screenEditor
                                .getPropertiesEditorContainerElement()
                                .getAutomaticFieldPropertiesEditorElement()!
                                .getAutomaticFieldName().value
                        ).toEqual(expectedName);
                    });
                    it('field label matches', () => {
                        expect(
                            screenEditor
                                .getPropertiesEditorContainerElement()
                                .getAutomaticFieldPropertiesEditorElement()!
                                .getAutomaticFieldLabel().value
                        ).toEqual(expectedLabel);
                    });
                    it('data type matches', () => {
                        expect(
                            screenEditor
                                .getPropertiesEditorContainerElement()
                                .getAutomaticFieldPropertiesEditorElement()!
                                .getAutomaticFieldDataType().value
                        ).toEqual(expectedDataType);
                    });
                    it('object matches', () => {
                        expect(
                            screenEditor
                                .getPropertiesEditorContainerElement()
                                .getAutomaticFieldPropertiesEditorElement()!
                                .getAutomaticFieldObject().value
                        ).toEqual(expectedObject);
                    });
                    it('required matches', () => {
                        expect(
                            screenEditor
                                .getPropertiesEditorContainerElement()
                                .getAutomaticFieldPropertiesEditorElement()!
                                .getAutomaticFieldIsRequired().value
                        ).toEqual(expectedIsRequired);
                    });
                    it('helptext matches', () => {
                        const helptext = screenEditor
                            .getPropertiesEditorContainerElement()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getAutomaticFieldHelptext();
                        if (expectedHelptext === null) {
                            expect(helptext).toBeNull();
                        } else {
                            expect(helptext.content).toEqual(expectedHelptext);
                        }
                    });
                }
            );
        });
        describe('FlowBuilderAutomaticFields org perm is off', () => {
            beforeAll(async () => {
                Object.assign(context, { access: { orgHasFlowBuilderAutomaticFields: false } });
                setContext(context);
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
            });
            it('should not have a tabset', () => {
                expect(screenEditor.getTabset()).toBeNull();
            });
            it('should contain a palette with proper CSS class', () => {
                const palette = screenEditor.getEditorPalette();
                expect(palette).toBeTruthy();
                expect(palette!.shadowRoot!.querySelector('div')!.className).toContain('slds-panel_docked-left');
            });
            it('should contain a palette with a button to open AppExchange', () => {
                const palette = screenEditor.getEditorPalette();
                expect(palette).toBeTruthy();
                expect(palette!.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.BUTTON_BANNER)).toBeTruthy();
            });
        });
    });
});
