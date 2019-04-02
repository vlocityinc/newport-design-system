import { createElement } from 'lwc';
import ScreenInputFieldPropertiesEditor from "../screenInputFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    SCALE_FIELD: 'builder_platform_interaction-screen-property-field[name="scale"]',
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-screen-property-field[name="defaultValue"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
    VALIDATION_ERROR_MESSAGE: 'builder_platform_interaction-resourced-rich-text-editor',
    VALIDATION_FORMULA: 'builder_platform_interaction-resourced-textarea[name="formulaExpression"]',
    VALIDATION_EDITOR: 'builder_platform_interaction-validation-editor',
};

const fieldName = 'input1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-input-field-properties-editor', {
        is: ScreenInputFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-input-field-properties-editor for TextBox', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false})
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for Number', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Number', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Scale field is present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for Date', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Date', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for DateTime', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'DateTime', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox.value).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });

    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for Checkbox', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Checkbox', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Required checkbox should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeNull();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for Currency', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Currency', SCREEN_NO_DEF_VALUE,
                {validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual('');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Scale field should be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
        });
    });
    it('Help text should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBeNull();
        });
    });
});

describe('screen-input-field-properties-editor for Number with default value', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Number', 42),
        });
    });
    it('Default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual("42");
        });
    });
});

describe('screen-input-field-properties-editor for Currency with default value', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Currency', 1000),
        });
    });
    it('Default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual("1000");
        });
    });
});

describe('screen-input-field-properties-editor for TextBox with default value', () => {
    const defaultVal = 'Basic Answer';
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', defaultVal),
        });
    });
    it('Default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
        });
    });
});

describe('screen-input-field-properties-editor for TextBox that set to required', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE,
                {required: true}),
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox.value).toBeTruthy();
        });
    });
});

describe('screen-input-field-properties-editor for TextBox with help text', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Help text is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).not.toBeNull();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
});

describe('screen-input-field-properties-editor with validationRule', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE,
                {validation: true, helpText: false}),
        });
    });

    it('Validation rule error message is present and displayed', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationError = query(validationEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).not.toBeNull();
            expect(renderedValidationError.value.value).toBe("The value you entered doesn't meet the validation criteria for this input field.");
        });
    });
    it('Validation rule formula is present and displayed', () => {
        return Promise.resolve().then(() => {
            const validationEditor = screenInputFieldPropEditor.shadowRoot.querySelector(SELECTORS.VALIDATION_EDITOR);
            const renderedValidationFormula = query(validationEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).not.toBeNull();
            expect(renderedValidationFormula.value.value).toBe("{!Var1} == 'text'");
        });
    });
});
