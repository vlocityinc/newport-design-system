import { createElement } from 'lwc';
import ScreenChoiceFieldPropertiesEditor from "../screenChoiceFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid(guid) {
            let elementType;
            if (guid.includes('RCS')) {
                elementType = 'RECORD_CHOICE_SET';
            } else if (guid.includes('PICKLIST')) {
                elementType = 'PICKLIST_CHOICE_SET';
            } else {
                elementType = 'CHOICE';
            }
                return {
                    name: guid,
                    choiceText: 'choice text ' + guid,
                    guid,
                    elementType
                };
        }
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DATA_TYPE: 'builder_platform_interaction-data-type-picker',
    DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD: 'builder_platform_interaction-screen-property-field[name="defaultSelectedChoiceReference"]',
    CHOICE_SELECTOR: 'builder_platform_interaction-screen-property-field[name="choice"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]'
};

const fieldName = 'field1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-choice-field-properties-editor', {
        is: ScreenChoiceFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-choice-field-properties-editor for radio field, type String', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField).toBeDefined();
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is nothing', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value.value).toBe('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Datatype drop down is set to required', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.required).toBeTruthy();
        });
    });
    it('Datatype drop down and set', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.value).toBeDefined();
            expect(dataTypeDropDown.value.dataType).toBe('TextBox');
        });
    });
    it('Help text is present and filled in', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe("Screen field field1 help text");
        });
    });
});

describe('screen-choice-field-properties-editor for multi-select picklist', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'MultiSelectPicklist', SCREEN_NO_DEF_VALUE, {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField).toBeDefined();
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is nothing', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value.value).toBe('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Datatype drop down is set to not required', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.required).toBeFalsy();
        });
    });
    it('Datatype drop down is set to Text', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.value).toBeDefined();
            expect(dataTypeDropDown.value.dataType).toBe('TextBox');
        });
    });
    it('Datatype drop down is disabled', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Help text is present and filled in', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe("Screen field field1 help text");
        });
    });
});

describe('screen-choice-field-properties-editor for multi-select checkboxes, type Number', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'MultiSelectCheckboxes', SCREEN_NO_DEF_VALUE, {dataType: 'Number', validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField).toBeDefined();
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is set to nothing', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value.value).toBe('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Datatype drop down is set to not required', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.required).toBeFalsy();
        });
    });
    it('Datatype drop down and set', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.value).toBeDefined();
            expect(dataTypeDropDown.value.dataType).toBe('Number');
        });
    });
    it('Help text is present and filled in', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe("Screen field field1 help text");
        });
    });
});

describe('screen-choice-field-properties-editor choice selectors', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE,
                                        {dataType: 'String', createChoices: true}),

        });
    });
    it('Correct number of choice selectors are present', () => {
        return Promise.resolve().then(() => {
            const choiceSelectors = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR, true);
            expect(choiceSelectors).toBeDefined();
            expect(choiceSelectors).toHaveLength(3);
            expect(choiceSelectors[0].required).toBeTruthy();
            expect(choiceSelectors[0].value.value).toMatch('choice0');
            expect(choiceSelectors[1].value.value).toMatch('choice1');
            expect(choiceSelectors[2].value.value).toMatch('choice2');
        });
    });
    it('Default choice drop down shows all choices associated with the field', () => {
        return Promise.resolve().then(() => {
            const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(defaultValueProp).toBeDefined();
            expect(defaultValueProp.listChoices).toBeDefined();
            expect(defaultValueProp.listChoices).toHaveLength(4);
            expect(defaultValueProp.listChoices[0].value).toMatch('');
            expect(defaultValueProp.listChoices[1].value).toMatch('choice0');
            expect(defaultValueProp.listChoices[2].value).toMatch('choice1');
            expect(defaultValueProp.listChoices[3].value).toMatch('choice2');
        });
    });
});

describe('DefaultValue options based on choice type', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const testField = createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE,
            {dataType: 'String', createChoices: true});
        testField.choiceReferences[0] = {choiceReference: {value: 'choice-RCS', error: null}};
        testField.choiceReferences[1] = {choiceReference: {value: 'choice1', error: null}};
        testField.choiceReferences[2] = {choiceReference: {value: 'choice-PICKLIST', error: null}};
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('DefaultValue drop down does not include record or picklist choice sets', () => {
        return Promise.resolve().then(() => {
            const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(defaultValueProp).toBeDefined();
            expect(defaultValueProp.listChoices).toBeDefined();
            expect(defaultValueProp.listChoices).toHaveLength(2);
            expect(defaultValueProp.listChoices[0].value).toMatch('');
            expect(defaultValueProp.listChoices[1].value).toMatch('choice1');
        });
    });
});

describe('defaultValue combobox for choice based field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        // Create a radio field with 3 choices, plus a placeholder, which indicates that
        // the user wants to add another choice, but hasn't set it yet.
        const testField = createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE,
                                            {dataType: 'String', createChoices: true});
        testField.choiceReferences.push({choiceReference: {value: '', error: null}});
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: testField
        });
    });
    it('Default choice drop down shows only the configured choices', () => {
        return Promise.resolve().then(() => {
            const defaultValueProp = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(defaultValueProp).toBeDefined();
            expect(defaultValueProp.listChoices).toBeDefined();
            expect(defaultValueProp.listChoices).toHaveLength(4);
            expect(defaultValueProp.listChoices[0].value).toMatch('');
            expect(defaultValueProp.listChoices[1].value).toMatch('choice0');
            expect(defaultValueProp.listChoices[2].value).toMatch('choice1');
            expect(defaultValueProp.listChoices[3].value).toMatch('choice2');
        });
    });
});

describe('screen-choice-field-properties-editor defaultValue', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const field = createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE,
                                            {dataType: 'String', createChoices: true});
        field.defaultSelectedChoiceReference = 'choice1';
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field
        });
    });
    it('When default value is set', () => {
        return Promise.resolve().then(() => {
            const defaultValue = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(defaultValue).toBeDefined();
            expect(defaultValue.value).toBeDefined();

            // Because the field has 3 choices assocaited with it, it should have 4 options.
            // The 3 choices, plus no default selected.
            expect(defaultValue.listChoices).toHaveLength(4);
        });
    });
});

describe('screen-choice-field-properties-editor for field that is set to required', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE, {required: true}),
        });
    });
    it('Required checkbox is present and checked', () => {
        return Promise.resolve().then(() => {
            const requiredCheckbox = query(screenChoiceFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(requiredCheckbox).toBeDefined();
            expect(requiredCheckbox.value).toBeTruthy();
        });
    });
});

describe('screen-choice-field-properties-editor with help text', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Help text is displayed', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenChoiceFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe('Screen field field1 help text');
        });
    });
});

describe('screen-choice-field-properties-editor for existing field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE),
        });
    });
    it('DataType drop down is disabled', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.typeAndCollectionDisabled).toBeTruthy();
        });
    });
});

describe('screen-choice-field-properties-editor for new field', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const field = createTestScreenField(fieldName, 'RadioButtons', SCREEN_NO_DEF_VALUE);
        field.isNewField = true;
        field.dataType = null;
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field
        });
    });
    it('DataType drop down is enabled', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.typeAndCollectionDisabled).toBeFalsy();
        });
    });
});

