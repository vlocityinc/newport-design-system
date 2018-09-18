import { createElement } from 'lwc';
import ScreenInputFieldPropertiesEditor from "../screenInputFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';

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
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]'
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
            field: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {helpText: false})
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
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
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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

    it('Scale field should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
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
    it('Required checkbox should not be present', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenInputFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeNull();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenInputFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
    it('Scale field should be present', () => {
        return Promise.resolve().then(() => {
            const renderedScaleField = query(screenInputFieldPropEditor, SELECTORS.SCALE_FIELD);
            expect(renderedScaleField).toBeDefined();
        });
    });
    it('Help text is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedHelpTextField = query(screenInputFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(renderedHelpTextField).toBeDefined();
            expect(renderedHelpTextField.value).toBeNull();
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
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
            const renderedDefaultValueField = query(screenInputFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
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
