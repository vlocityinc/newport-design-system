import { createElement } from 'lwc';
import ScreenPasswordFieldPropertiesEditor from "../screenPasswordFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    REQUIRED_CHECKBOX: 'builder_platform_interaction-screen-property-field[name="isRequired"]',
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-screen-property-field[name="defaultValue"]',
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenPasswordFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenPasswordFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField).toBeDefined();
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenPasswordFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
            const renderedDefaultValueField = query(screenPasswordFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
            expect(renderedRequiredCheckbox).toBeDefined();
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