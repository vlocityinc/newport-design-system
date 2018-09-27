import { createElement } from 'lwc';
import ValidationEditor from "../validationEditor";
import { query, createTestScreenField, SCREEN_NO_DEF_VALUE } from "builder_platform_interaction/builderTestUtils";

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    ERROR_MESSAGE: 'builder_platform_interaction-resourced-textarea[name="errorMessage"]',
    FORMULA_EXPRESSION: 'builder_platform_interaction-resourced-textarea[name="formulaExpression"]',
};

const fieldName = 'input1';

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-validation-editor', {
        is: ValidationEditor
    });
    if (props) {
        Object.assign(el, props);
    }
    document.body.appendChild(el);
    return el;
};

describe('validationEditor with no validation rule', () => {
    let validationEditorElement;
    beforeEach(() => {
        validationEditorElement = createComponentUnderTest({
            element: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {validation: false})
        });
    });
    it('Error message should be empty', () => {
        return Promise.resolve().then(() => {
            const errorMessageInput = query(validationEditorElement, SELECTORS.ERROR_MESSAGE);
            expect(errorMessageInput).toBeDefined();
            expect(errorMessageInput.value.value).toBeUndefined();
        });
    });
    it('Formula expression should be empty', () => {
        return Promise.resolve().then(() => {
            const formulaExpressionField = query(validationEditorElement, SELECTORS.FORMULA_EXPRESSION);
            expect(formulaExpressionField).toBeDefined();
            expect(formulaExpressionField.value.value).toBeUndefined();
        });
    });
});

describe('validationEditor with validation rule', () => {
    let validationEditorElement;
    beforeEach(() => {
        validationEditorElement = createComponentUnderTest({
            element: createTestScreenField(fieldName, 'TextBox', SCREEN_NO_DEF_VALUE, {validation: true})
        });
    });
    it('Error message should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const errorMessageInput = query(validationEditorElement, SELECTORS.ERROR_MESSAGE);
            expect(errorMessageInput).toBeDefined();
            expect(errorMessageInput.value.value).toBe("The value you entered doesn't meet the validation criteria for this input field.");
        });
    });
    it('Formula expression should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const formulaExpressionField = query(validationEditorElement, SELECTORS.FORMULA_EXPRESSION);
            expect(formulaExpressionField).toBeDefined();
            expect(formulaExpressionField.value.value).toBe("{!Var1} == 'text'");
        });
    });
});

