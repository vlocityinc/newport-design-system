import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { resetState, setupStateForFlow } from '../../integrationTestUtils';
import { FlowScreenFieldType, FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    createComponentUnderTest,
    ScreenCanvasTestComponent,
    ScreenEditorAutomaticFieldBetaDisclaimerTestComponent,
    ScreenEditorTestComponent
} from '../../screenEditorTestUtils';
import { ScreenFieldName } from 'builder_platform_interaction/screenEditorUtils';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { blurEvent, INTERACTION_COMPONENTS_SELECTORS, ticks } from 'builder_platform_interaction/builderTestUtils';
import { ComboboxTestComponent } from '../../comboboxTestUtils';
import {
    addRecordVariable,
    deleteVariableWithName,
    setNextInlineResource,
    addNewResourceEventListener,
    removeNewResourceEventListener
} from '../../resourceTestUtils';
import { setContext } from 'builder_platform_interaction/contextLib';
import { context } from 'serverData/GetContext/context.json';
import { createVariable } from 'builder_platform_interaction/elementFactory';

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
jest.mock('@salesforce/label/FlowBuilderAutomaticFieldEditor.datatypeDateTime', () => ({ default: 'Date/Time' }), {
    virtual: true
});

jest.mock('@salesforce/label/FlowBuilderExpressionUtils.newResourceLabel', () => ({ default: 'New Resource' }), {
    virtual: true
});

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
        const expectSObjectPickerContainsSObjectVariableWithPillAndNoError = (variableName) => {
            const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
            const comboboxElement = sobjectPickerCombobox.element;
            expect(comboboxElement.value.displayText).toBe(`{!${variableName}}`);
            expect(comboboxElement.errorMessage).toBeNull();
            expect(comboboxElement.hasPill).toBe(true);
            expect(comboboxElement.pill).toEqual({
                iconName: 'utility:sobject',
                label: variableName
            });
        };
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
                expect(screenEditor.getComponentsPaletteElement()).not.toEqual(null);
            });
            it('should contain in second tab the automatic field palette', () => {
                expect(screenEditor.getAutomaticFieldsPalette()).not.toEqual(null);
            });
            it('should contain in third tab the automatic field property editor', () => {
                expect(
                    screenEditor.getPropertiesEditorContainer().getAutomaticFieldPropertiesEditorElement
                ).toBeTruthy();
            });
        });
        describe('Beta status disclaimer', () => {
            let disclaimer: ScreenEditorAutomaticFieldBetaDisclaimerTestComponent;
            beforeAll(async () => {
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
                disclaimer = screenEditor.getAutomaticFieldBetaDisclaimer();
            });
            it('should be displayed in the Fields palette', () => {
                expect(disclaimer).toBeTruthy();
            });
            it('should have its popup visible when its trigger is clicked', async () => {
                await disclaimer.clickOnTriggerButton();
                expect(disclaimer.isPopupVisible()).toEqual(true);
            });
            it('should have its popup hidden when its close button is clicked', async () => {
                await disclaimer.clickOnCloseButton();
                expect(disclaimer.isPopupVisible()).toEqual(false);
            });
        });
        describe('"Select Object" combobox', () => {
            let combobox: ComboboxTestComponent;
            beforeAll(async () => {
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
                combobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                addRecordVariable('onlyCreateableRecordVar', 'ProcessExceptionEvent');
                addRecordVariable('onlyQueryableRecordVar', 'Community');
                addRecordVariable('updateableAndQueryableRecordVar', 'Organization');
                addRecordVariable('deletableAndQueryableRecordVar', 'AccountFeed');
            });
            afterAll(() => {
                deleteVariableWithName('onlyCreateableRecordVar');
                deleteVariableWithName('onlyQueryableRecordVar');
                deleteVariableWithName('updateableAndQueryableRecordVar');
                deleteVariableWithName('deletableAndQueryableRecordVar');
            });
            it('should only display createable or updateable record resources', async () => {
                // account is createable, queryable, updateable, deletable
                await expect(combobox).canSelectInCombobox('text', ['accountSObjectVariable']);
                // this record var is only createable
                await expect(combobox).canSelectInCombobox('text', ['onlyCreateableRecordVar']);
                // this record var is updateable and queryable
                await expect(combobox).canSelectInCombobox('text', ['updateableAndQueryableRecordVar']);
                // this record var is only queryable
                await expect(combobox).not.canSelectInCombobox('text', ['onlyQueryableRecordVar']);
                // this record var is queryable and deletable
                await expect(combobox).not.canSelectInCombobox('text', ['deletableAndQueryableRecordVar']);
            });
        });
        describe('Screen field selection', () => {
            let canvas: ScreenCanvasTestComponent;
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
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('accountSObjectVariable');
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
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('accountSObjectVariable');
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
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('objectWithAllPossiblFieldsVariable');
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Text Field');
                });

                it('Displays the correct pill and value (no error message) for the record object, and fields after removing pill on first record object and new record object selection', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();

                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await sobjectPickerCombobox.removePill();
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'objectWithAllPossiblFieldsVariable.Text_Field__c'
                        )!
                        .click();
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('objectWithAllPossiblFieldsVariable');
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Text Field');
                });
                it('Displays the correct pill and value (no error message) for the record object, and fields after removing pill on first record object and automatic field with same object is selected on canvas', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await sobjectPickerCombobox.removePill();
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.NumberOfEmployees'
                        )!
                        .click();
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('accountSObjectVariable');
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Account Number');
                });
                test('Set an incorrect value in the combobox, select another autofield : should display pill for the autofield, with no error', async () => {
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await sobjectPickerCombobox.typeReferenceOrValue('{!accountSObjectVariable.Name}sdkjjk', true);
                    expect(sobjectPickerCombobox.element.errorMessage).toEqual(
                        'FlowBuilderCombobox.genericErrorMessage'
                    );
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(
                            'accountSObjectVariable.Description'
                        )!
                        .click();
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('accountSObjectVariable');
                    expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Account Number');
                });
                test('Select existing autofield, remove pill, select distinct object from combobox, add autofield from this object, reselect first autofield: should display pill', async () => {
                    // Select existing autofield "accountSObjectVariable.name" on the canvas
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();

                    // remove pill for record variable "accountSObjectVariable"
                    const sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                    await sobjectPickerCombobox.removePill();

                    // select "objectWithAllPossiblFieldsVariable" record variable through the autofield palette combobox
                    await sobjectPickerCombobox.selectItemBy('text', ['objectWithAllPossiblFieldsVariable']);

                    // add new "objectWithAllPossiblFieldsVariable" autofield (ie: "Checkbox Field") to the screen
                    await screenEditor.getAutomaticFieldsPalette().clickOnFieldByLabel('Checkbox Field');

                    // reselect 'accountSObjectVariable.Name' autofield on the canvas
                    await canvas
                        .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                        .click();
                    expectSObjectPickerContainsSObjectVariableWithPillAndNoError('accountSObjectVariable');
                });
            });
        });
        describe('Inline Resource creation', () => {
            let canvas: ScreenCanvasTestComponent;
            let sobjectPickerCombobox: ComboboxTestComponent;
            beforeAll(async () => {
                screenEditor = await createScreenEditor('screenWithAutomaticFields');
                canvas = screenEditor.getCanvas();
                sobjectPickerCombobox = screenEditor.getAutomaticFieldsPalette().getSObjectPickerCombobox();
                addNewResourceEventListener();
            });
            afterAll(() => {
                removeNewResourceEventListener();
            });
            it('Displays the fields of the new record variable even if there was an error on the combobox before', async () => {
                // See W-8901087
                await canvas
                    .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                    .click();
                await sobjectPickerCombobox.typeReferenceOrValue('', true);
                expect(sobjectPickerCombobox.element.errorMessage).toEqual('FlowBuilderValidation.cannotBeBlank');
                const inlineVariable = createVariable({
                    name: 'newVariable',
                    dataType: FLOW_DATA_TYPE.SOBJECT.value,
                    subtype: 'Object_with_all_possible_fields__c'
                });
                setNextInlineResource(inlineVariable);
                await sobjectPickerCombobox.selectItemBy('text', ['New Resource']);
                await sobjectPickerCombobox.getGroupedCombobox().element.dispatchEvent(blurEvent);
                await ticks(50);
                expect(screenEditor.getAutomaticFieldsPalette().getFieldsLabels()).toContainEqual('Text Field');
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
                description                                                            | fieldReference                                        | expectedName           | expectedLabel            | expectedDataType           | expectedObject                          | expectedIsRequired                                   | expectedIsCreateable                                   | expectedIsUpdateable                                  | expectedHelptext
                ${'variable and text field'}                                           | ${'accountSObjectVariable.Name'}                      | ${'Name'}              | ${'Account Name'}        | ${'Text(255)'}             | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${'FlowBuilderAutomaticFieldEditor.isCreateableTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${null}
                ${'variable and number field'}                                         | ${'accountSObjectVariable.NumberOfEmployees'}         | ${'NumberOfEmployees'} | ${'Employees'}           | ${'Number(8, 0)'}          | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${'FlowBuilderAutomaticFieldEditor.isCreateableTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${null}
                ${'automatic output and text field'}                                   | ${'lookupRecordAutomaticOutput.Name'}                 | ${'Name'}              | ${'Account Name'}        | ${'Text(255)'}             | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${'FlowBuilderAutomaticFieldEditor.isCreateableTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${null}
                ${'variable and long text area'}                                       | ${'accountSObjectVariable.Description'}               | ${'Description'}       | ${'Account Description'} | ${'Long Text Area(32000)'} | ${'Account'}                            | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${'FlowBuilderAutomaticFieldEditor.isCreateableTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${null}
                ${'variable and required text field with helptext from custom object'} | ${'objectWithAllPossiblFieldsVariable.Text_Field__c'} | ${'Text_Field__c'}     | ${'Text Field'}          | ${'Text(128)'}             | ${'Object_with_all_possible_fields__c'} | ${'FlowBuilderAutomaticFieldEditor.isRequiredTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isCreateableTrue'}  | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${'the help text for this field'}
                ${'field that is not createable'}                                      | ${'contractSObjectVariable.ActivatedDate'}            | ${'ActivatedDate'}     | ${'Activated Date'}      | ${'Date/Time'}             | ${'Contract'}                           | ${'FlowBuilderAutomaticFieldEditor.isRequiredFalse'} | ${'FlowBuilderAutomaticFieldEditor.isCreateableFalse'} | ${'FlowBuilderAutomaticFieldEditor.isUpdateableTrue'} | ${null}
            `(
                'Using $description',
                ({
                    fieldReference,
                    expectedName,
                    expectedLabel,
                    expectedDataType,
                    expectedObject,
                    expectedIsRequired,
                    expectedIsCreateable,
                    expectedIsUpdateable,
                    expectedHelptext
                }) => {
                    beforeAll(() => {
                        screenEditor
                            .getCanvas()
                            .getScreenEditorHighlightForScreenFieldWithObjectFieldReference(fieldReference)!
                            .click();
                    });
                    it('field name matches', () => {
                        const fieldNameElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldNameFormattedTextElement();
                        expect(fieldNameElement).toBeTruthy();
                        expect(fieldNameElement!.value).toEqual(expectedName);
                    });
                    it('field label matches', () => {
                        const fieldLabelElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldLabelFormattedTextElement();
                        expect(fieldLabelElement).toBeTruthy();
                        expect(fieldLabelElement!.value).toEqual(expectedLabel);
                    });
                    it('data type matches', () => {
                        const fieldDatatypeElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldDataTypeFormattedTextElement();
                        expect(fieldDatatypeElement).toBeTruthy();
                        expect(fieldDatatypeElement!.value).toEqual(expectedDataType);
                    });
                    it('object matches', () => {
                        const objectElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldObjectFormattedTextElement();
                        expect(objectElement).toBeTruthy();
                        expect(objectElement!.value).toEqual(expectedObject);
                    });
                    it('required matches', () => {
                        const requiredElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldIsRequiredFormattedTextElement();
                        expect(requiredElement).toBeTruthy();
                        expect(requiredElement!.value).toEqual(expectedIsRequired);
                    });
                    it('createable matches', () => {
                        const createableElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldIsCreateableFormattedTextElement();
                        expect(createableElement).toBeTruthy();
                        expect(createableElement!.value).toEqual(expectedIsCreateable);
                    });
                    it('updateable matches', () => {
                        const updateableElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldIsUpdateableFormattedTextElement();
                        expect(updateableElement).toBeTruthy();
                        expect(updateableElement!.value).toEqual(expectedIsUpdateable);
                    });
                    it('helptext matches', () => {
                        const helptextElement = screenEditor
                            .getPropertiesEditorContainer()
                            .getAutomaticFieldPropertiesEditorElement()!
                            .getFieldHelptextElement();
                        if (expectedHelptext === null) {
                            expect(helptextElement).toBeNull();
                        } else {
                            expect(helptextElement).toBeTruthy();
                            expect(helptextElement!.content).toEqual(expectedHelptext);
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
                expect(screenEditor.getTabsetElement()).toBeNull();
            });
            it('should contain a palette with proper CSS class', () => {
                const palette = screenEditor.getComponentsPaletteElement();
                expect(palette).toBeTruthy();
                expect(palette!.shadowRoot!.querySelector('div')!.className).toContain('slds-panel_docked-left');
            });
            it('should contain a palette with a button to open AppExchange', () => {
                const palette = screenEditor.getComponentsPaletteElement();
                expect(palette).toBeTruthy();
                expect(palette!.shadowRoot!.querySelector(INTERACTION_COMPONENTS_SELECTORS.BUTTON_BANNER)).toBeTruthy();
            });
            it('should display the automatic field properties when we click on an automatic field on canvas', async () => {
                await screenEditor
                    .getCanvas()
                    .getScreenEditorHighlightForScreenFieldWithObjectFieldReference('accountSObjectVariable.Name')!
                    .click();
                const automaticFieldPropertiesEditor = screenEditor
                    .getPropertiesEditorContainer()
                    .getAutomaticFieldPropertiesEditorElement();
                expect(automaticFieldPropertiesEditor!.getFieldNameFormattedTextElement()!.value).toEqual('Name');
            });
        });
    });
});
