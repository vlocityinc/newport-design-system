import { createElement } from 'lwc';
import ScreenTextareaFieldPropertiesEditor from "../screenTextareaFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    NAME_AND_LABEL_FIELD: 'builder_platform_interaction-label-description',
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-screen-property-field[type="long_string"]',
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenTextAreaFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenTextAreaFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenTextAreaFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField.value).toBeUndefined();
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