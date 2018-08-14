import { createElement } from "lwc";
import ScreenTextareaFieldPropertiesEditor from '../screen-textarea-field-properties-editor';
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
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-screen-property-field[type="long_string"]',
    VALIDATION_ERROR_MESSAGE: 'builder_platform_interaction-screen-property-field[name="validationRule.errorMessage"]',
    VALIDATION_FORMULA: 'builder_platform_interaction-screen-property-field[name="validationRule.formulaExpression"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
};

const fieldName = 'input1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-textarea-field-properties-editor', {
        is: ScreenTextareaFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-textarea-field-properties-editor', () => {
    let screenTextAreaFieldPropEditor;
    beforeEach(() => {
        screenTextAreaFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE, {helpText: false}),
        });
    });
    it('Unique Name field should be required', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenTextAreaFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.required).toBeTruthy();
        });
    });
    it('Unique Name field should be a string type input', () => {
        return Promise.resolve().then(() => {
            const nameField = query(screenTextAreaFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(nameField.type).toBe('string');
        });
    });
    it('Unique Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenTextAreaFieldPropEditor, SELECTORS.NAME_FIELD);
            expect(renderedNameField.value.value).toBe(fieldName);
        });
    });
    it('Property changed on name field', () => {
        return Promise.resolve().then(() => {
            const renderedNameField = query(screenTextAreaFieldPropEditor, SELECTORS.NAME_FIELD);
            const callback = jest.fn();
            renderedNameField.addEventListener('propertychanged', callback);
            renderedNameField.dispatchEvent(new PropertyChangedEvent('name', 'new name'));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Property changed on label field', () => {
        return Promise.resolve().then(() => {
            const renderedLabelField = getShadowRoot(screenTextAreaFieldPropEditor).querySelector(SELECTORS.LABEL_FIELD);
            const callback = jest.fn();
            renderedLabelField.addEventListener('comboboxstatechanged', callback);
            renderedLabelField.dispatchEvent(new ComboboxStateChangedEvent({ value: null, displayText: 'New Label' }));
            expect(callback).toHaveBeenCalled();
        });
    });
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenTextAreaFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenTextAreaFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeDefined();
            expect(renderedValidationError.value).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenTextAreaFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeDefined();
            expect(renderedValidationFormula.value).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenTextAreaFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
        });
    });
});

describe('screen-textarea-field-properties-editor with default value', () => {
    const defaultVal = 'Basic Answer';
    let screenTextAreaFieldPropEditor;
    beforeEach(() => {
        screenTextAreaFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'LargeTextArea', defaultVal),
        });
    });
    it('Default value is rendered', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenTextAreaFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toEqual(defaultVal);
        });
    });
});

describe('screen-textarea-field-properties-editor with help text', () => {
    let screenTextAreaFieldPropEditor;
    beforeEach(() => {
        screenTextAreaFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'LargeTextArea', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Help text is displayed', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenTextAreaFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value.value).toBe('Screen field input1 help text');
        });
    });
});