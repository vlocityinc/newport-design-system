import { createElement } from 'lwc';
import ScreenChoiceFieldPropertiesEditor from "../screenChoiceFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';
import { createScreenField } from "builder_platform_interaction/elementFactory";

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByDevName(devName) {
                return {
                    name: devName,
                    choiceText: devName,
                    guid: devName + 'testGuid',
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

const createAndMutateField = (name, fieldType, defaultValue, config) => {
    const field = createTestScreenField(name, fieldType, defaultValue, config);
    const mutatedField = createScreenField(field);
    return mutatedField;
};

describe('screen-choice-field-properties-editor for radio field, type String', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createAndMutateField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false}),
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
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
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

describe('screen-choice-field-properties-editor for multi-select picklist, type Date', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createAndMutateField(fieldName, 'MultiSelectPicklist', SCREEN_NO_DEF_VALUE, {dataType: 'Date', validation: false, helpText: false}),
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
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
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
            expect(dataTypeDropDown.value.dataType).toBe('Date');
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
            field: createAndMutateField(fieldName, 'MultiSelectCheckboxes', SCREEN_NO_DEF_VALUE, {dataType: 'Number', validation: false, helpText: false}),
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
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
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

describe('screen-choice-field-properties-editor for picklist, type DateTime', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: createAndMutateField(fieldName, 'DropdownBox', SCREEN_NO_DEF_VALUE, {dataType: 'DateTime', validation: false, helpText: false}),
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
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
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
            expect(dataTypeDropDown.value.dataType).toBe('DateTime');
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
            field: createAndMutateField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE,
                                        {dataType: 'String', createChoices: true}),

        });
    });
    it('Correct number of choice selectors are present', () => {
        return Promise.resolve().then(() => {
            const choiceSelectors = query(screenChoiceFieldPropEditor, SELECTORS.CHOICE_SELECTOR, true);
            expect(choiceSelectors).toBeDefined();
            expect(choiceSelectors).toHaveLength(3);
            expect(choiceSelectors[0].required).toBeTruthy();
            expect(choiceSelectors[0].value).toMatch('choice0');
            expect(choiceSelectors[1].value).toMatch('choice1');
            expect(choiceSelectors[2].value).toMatch('choice2');
        });
    });
});

describe('screen-choice-field-properties-editor defaultValue', () => {
    let screenChoiceFieldPropEditor;
    beforeEach(() => {
        const field = createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE,
                                            {dataType: 'String', createChoices: true});
        field.defaultValue = 'choice1';
        field.defaultValueDataType = 'reference';
        const mutatedField = createScreenField(field);
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: mutatedField
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
            field: createAndMutateField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE, {required: true}),
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
            field: createAndMutateField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE),
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
            field: createAndMutateField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE),
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
        const field = createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE);
        field.isNewField = true;
        field.dataType = null;
        const mutatedField = createScreenField(field);
        screenChoiceFieldPropEditor = createComponentUnderTest({
            field: mutatedField
        });
    });
    it('DataType drop down is enabled', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenChoiceFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.typeAndCollectionDisabled).toBeFalsy();
        });
    });
    it('Default value is disabled because dataType is not yet set', () => {
        return Promise.resolve().then(() => {
            const defaultValue = query(screenChoiceFieldPropEditor, SELECTORS.DEFAULT_SELECTED_CHOICE_REFERENCE_FIELD);
            expect(defaultValue).toBeDefined();
            expect(defaultValue.disabled).toBeTruthy();
        });
    });
});

