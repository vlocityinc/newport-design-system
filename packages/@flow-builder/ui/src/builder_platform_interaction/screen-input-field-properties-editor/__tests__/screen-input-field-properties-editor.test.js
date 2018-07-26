import { createElement } from 'engine';
import ScreenInputFieldPropertiesEditor from '../screen-input-field-properties-editor';
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from 'builder_platform_interaction-builder-test-utils';
import { PropertyChangedEvent, ComboboxStateChangedEvent } from 'builder_platform_interaction-events';
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction-selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    NAME_FIELD: 'builder_platform_interaction-screen-property-field[name="name"]',
    LABEL_FIELD: 'builder_platform_interaction-combobox',
    SCALE_FIELD: 'builder_platform_interaction-screen-property-field[name="scale"]',
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-ferov-resource-picker',
    DATA_TYPE_PICKER: 'builder_platform_interaction-data-type-picker',
    VALIDATION_ERROR_MESSAGE: 'builder_platform_interaction-screen-property-field[name="validationRule.errorMessage"]',
    VALIDATION_FORMULA: 'builder_platform_interaction-screen-property-field[name="validationRule.formulaExpression"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
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
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('TextBox');
        });
    });
    it('Property changed on name field', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            const callback = jest.fn();
            renderedNameField.addEventListener('propertychanged', callback);
            renderedNameField.dispatchEvent(new PropertyChangedEvent('name', 'new name'));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
    it('Property changed on label field', () => {
        return Promise.resolve().then(() => {
            const renderedLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.LABEL_FIELD);
            const callback = jest.fn();
            renderedLabelField.addEventListener('comboboxstatechanged', callback);
            renderedLabelField.dispatchEvent(new ComboboxStateChangedEvent({ value: null, displayText: 'New Label' }));
            expect(callback).toHaveBeenCalled();
        });
    });
});

describe('screen-input-field-properties-editor for Number', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Number', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name is filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
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
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker).toBeDefined();
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('Number');
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
});

describe('screen-input-field-properties-editor for Date', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Date', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name is filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('Date');
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
});

describe('screen-input-field-properties-editor for DateTime', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'DateTime', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name is filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox.value).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('DateTime');
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
});

describe('screen-input-field-properties-editor for Checkbox', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Checkbox', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name is filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('Checkbox');
        });
    });
    it('Required checkbox should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeNull();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
});

describe('screen-input-field-properties-editor for Currency', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Currency', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name is filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenInputFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Data type picker is disabled', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.typeAndCollectionDisabled).toBeTruthy();
        });
    });
    it('Data type picker value is set correctly', () => {
        return Promise.resolve().then(() => {
            const renderedDataTypePicker = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DATA_TYPE_PICKER);
            expect(renderedDataTypePicker.value.dataType).toBe('Currency');
        });
    });
    it('Scale field should be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenInputFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).not.toBeDefined();
        });
    });
});

describe('screen-input-field-properties-editor for Number with default value', () => {
    const defaultVal = 42;
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Number', defaultVal),
        });
    });
    it('Default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
        });
    });
});

describe('screen-input-field-properties-editor for Currency with default value', () => {
    const defaultVal = 1000;
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Currency', defaultVal),
        });
    });
    it('Default value is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
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
            const renderedDefaultValueField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
        });
    });
});

describe('screen-input-field-properties-editor for TextBox that set to required', () => {
    const defaultVal = 'Basic Answer';
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', defaultVal, {required: true}),
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
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
});