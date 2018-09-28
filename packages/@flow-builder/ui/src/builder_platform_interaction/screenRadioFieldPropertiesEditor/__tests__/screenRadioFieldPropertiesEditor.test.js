import { createElement } from 'lwc';
import ScreenRadioFieldPropertiesEditor from "../screenRadioFieldPropertiesEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";
import { getShadowRoot } from 'lwc-test-utils';

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
    DEFAULT_VALUE_FIELD: 'builder_platform_interaction-screen-property-field[name="defaultValue"]',
    CHOICE_SELECTOR: 'builder_platform_interaction-screen-property-field[name="choice"]',
    HELP_TEXT: 'builder_platform_interaction-screen-property-field[name="helpText"]',
    VALIDATION_ERROR_MESSAGE: 'builder_platform_interaction-resourced-textarea[name="errorMessage"]',
    VALIDATION_FORMULA: 'builder_platform_interaction-resourced-textarea[name="formulaExpression"]',
};

const fieldName = 'radio1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-screen-radio-field-properties-editor', {
        is: ScreenRadioFieldPropertiesEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('screen-radio-field-properties-editor', () => {
    let screenRadioFieldPropEditor;
    beforeEach(() => {
        screenRadioFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE, {dataType: 'String', validation: false, helpText: false}),
        });
    });
    it('API Name field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenRadioFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField.devName.value).toBe(fieldName);
        });
    });
    it('Label field should be filled in', () => {
        return Promise.resolve().then(() => {
            const nameAndLabelField = getShadowRoot(screenRadioFieldPropEditor).querySelector(SELECTORS.NAME_AND_LABEL_FIELD);
            expect(nameAndLabelField).toBeDefined();
            expect(nameAndLabelField.label.value).toBe(fieldName);
        });
    });
    it('Default value is empty when there is no default value', () => {
        return Promise.resolve().then(() => {
            const renderedDefaultValueField = query(screenRadioFieldPropEditor, SELECTORS.DEFAULT_VALUE_FIELD);
            expect(renderedDefaultValueField).toBeDefined();
            expect(renderedDefaultValueField.value).toBeUndefined();
        });
    });
    it('Required checkbox is present and not checked', () => {
        return Promise.resolve().then(() => {
            const renderedRequiredCheckbox = query(screenRadioFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(renderedRequiredCheckbox).toBeDefined();
            expect(renderedRequiredCheckbox.value).toBeFalsy();
        });
    });
    it('Datatype drop down is set to required', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenRadioFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.required).toBeTruthy();
        });
    });
    it('Datatype drop down and set', () => {
        return Promise.resolve().then(() => {
            const dataTypeDropDown = getShadowRoot(screenRadioFieldPropEditor).querySelector(SELECTORS.DATA_TYPE);
            expect(dataTypeDropDown).toBeDefined();
            expect(dataTypeDropDown.value).toBeDefined();
            expect(dataTypeDropDown.value.dataType).toBe('TextBox');
        });
    });
    it('Help text is present and filled in', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenRadioFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe("Screen field radio1 help text");
        });
    });
    it('Validation rule error message is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationError = query(screenRadioFieldPropEditor, SELECTORS.VALIDATION_ERROR_MESSAGE);
            expect(renderedValidationError).toBeNull();
        });
    });
    it('Validation rule formula is present but empty', () => {
        return Promise.resolve().then(() => {
            const renderedValidationFormula = query(screenRadioFieldPropEditor, SELECTORS.VALIDATION_FORMULA);
            expect(renderedValidationFormula).toBeNull();
        });
    });
});

describe('screen-radio-field-properties-editor choice selectors', () => {
    let screenRadioFieldPropEditor;
    beforeEach(() => {
        screenRadioFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE,
                                         {dataType: 'String', createChoices: true}),
        });
    });
    it('Correct number of choice selectors are present', () => {
        return Promise.resolve().then(() => {
            const choiceSelectors = query(screenRadioFieldPropEditor, SELECTORS.CHOICE_SELECTOR, true);
            expect(choiceSelectors).toBeDefined();
            expect(choiceSelectors).toHaveLength(3);
            expect(choiceSelectors[0].required).toBeTruthy();
            expect(choiceSelectors[0].value).toMatch('choice0');
            expect(choiceSelectors[1].value).toMatch('choice1');
            expect(choiceSelectors[2].value).toMatch('choice2');
        });
    });
});

// TODO Cannot test default value yet, currently broken.

describe('screen-radio-field-properties-editor for field that is set to required', () => {
    let screenRadioFieldPropEditor;
    beforeEach(() => {
        screenRadioFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE, {required: true}),
        });
    });
    it('Required checkbox is present and checked', () => {
        return Promise.resolve().then(() => {
            const requiredCheckbox = query(screenRadioFieldPropEditor, SELECTORS.REQUIRED_CHECKBOX);
            expect(requiredCheckbox).toBeDefined();
            expect(requiredCheckbox.value).toBeTruthy();
        });
    });
});

describe('screen-radio-field-properties-editor with help text', () => {
    let screenRadioFieldPropEditor;
    beforeEach(() => {
        screenRadioFieldPropEditor = createComponentUnderTest({
            field: createTestScreenField(fieldName, 'Radio', SCREEN_NO_DEF_VALUE),
        });
    });
    it('Help text is displayed', () => {
        return Promise.resolve().then(() => {
            const helpTextField = query(screenRadioFieldPropEditor, SELECTORS.HELP_TEXT);
            expect(helpTextField).toBeDefined();
            expect(helpTextField.value.value).toBe('Screen field radio1 help text');
        });
    });
});