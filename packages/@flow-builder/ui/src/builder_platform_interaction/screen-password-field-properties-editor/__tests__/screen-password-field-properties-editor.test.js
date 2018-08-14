import { createElement } from "lwc";
import ScreenPasswordFieldPropertiesEditor from '../screen-password-field-properties-editor';
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
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-ferov-resource-picker',
    VALIDATION_ERROR_MESSAGE: 'builder_platform_interaction-screen-property-field[name="validationRule.errorMessage"]',
    VALIDATION_FORMULA: 'builder_platform_interaction-screen-property-field[name="validationRule.formulaExpression"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
};

const fieldName = 'input1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-password-field-properties-editor', {
        is: ScreenPasswordFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-password-field-properties-editor', () => {
    let screenPasswordFieldPropEditor;
    beforeEach(() => {
        screenPasswordFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Password', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenPasswordFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenPasswordFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenPasswordFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Property changed on name field', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenPasswordFieldPropEditor, SELECTORS.NAME_FIELD);
            const callback = jest.fn();
            renderedNameField.addEventListener('propertychanged', callback);
            renderedNameField.dispatchEvent(new PropertyChangedEvent('name', 'new name'));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Property changed on label field', () => {
        return Promise.resolve().then(() => {
            const renderedLabelField = getShadowRoot(screenPasswordFieldPropEditor).querySelector(SELECTORS.LABEL_FIELD);
            const callback = jest.fn();
            renderedLabelField.addEventListener('comboboxstatechanged', callback);
            renderedLabelField.dispatchEvent(new ComboboxStateChangedEvent({ value: null, displayText: 'New Label' }));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenPasswordFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenPasswordFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenPasswordFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenPasswordFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenPasswordFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
        });
    });
});

describe('screen-password-field-properties-editor with default value', () => {
    const defaultVal = 'Basic Answer';
    let screenPasswordFieldPropEditor;
    beforeEach(() => {
        screenPasswordFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Password', defaultVal),
        });
    });
    it('Default value is rendered', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = getShadowRoot(screenPasswordFieldPropEditor).querySelector(SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
        });
    });
});

describe('screen-password-field-properties-editor for field that is set to required', () => {
    let screenInputFieldPropEditor;
    beforeEach(() => {
        screenInputFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {required: true}),
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox.value).toBeTruthy();
        });
    });
});

describe('screen-password-field-properties-editor with help text', () => {
    let screenPasswordFieldPropEditor;
    beforeEach(() => {
        screenPasswordFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Password', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Help text is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenPasswordFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
});