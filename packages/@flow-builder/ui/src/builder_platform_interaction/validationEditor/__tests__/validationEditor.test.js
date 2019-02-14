import { createElement } from 'lwc';
import ValidationEditor from "../validationEditor";
import { query } from "builder_platform_interaction/builderTestUtils";

jest.mock('builder_platform_interaction/ferovResourcePicker', () => require('builder_platform_interaction_mocks/ferovResourcePicker'));

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements)),
    };
});

const SELECTORS = {
    ERROR_MESSAGE: 'builder_platform_interaction-resourced-rich-text-editor',
    FORMULA_EXPRESSION: 'builder_platform_interaction-resourced-textarea[name="formulaExpression"]',
};

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
            element: {formulaExpression: {value: null, error: null}, errorMessage: {value: null, error: null}}
        });
    });
    it('Error message should be empty', () => {
        return Promise.resolve().then(() => {
            const errorMessageInput = query(validationEditorElement, SELECTORS.ERROR_MESSAGE);
            expect(errorMessageInput).toBeDefined();
            expect(errorMessageInput.value.value).toBeNull();
        });
    });
    it('Formula expression should be empty', () => {
        return Promise.resolve().then(() => {
            const formulaExpressionField = query(validationEditorElement, SELECTORS.FORMULA_EXPRESSION);
            expect(formulaExpressionField).toBeDefined();
            expect(formulaExpressionField.value.value).toBeNull();
        });
    });
});

describe('validationEditor with validation rule', () => {
    const ERROR_MESSAGE = "The value you entered doesn't meet the validation criteria for this input field.";
    const FORMULA_EXPRESSION = "{!Var1} == 'text'";
    let validationEditorElement;
    beforeEach(() => {
        validationEditorElement = createComponentUnderTest({
            element: {
                formulaExpression: {value: FORMULA_EXPRESSION, error: null},
                errorMessage: {value: ERROR_MESSAGE, error: null}
            }
        });
    });
    it('Error message should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const errorMessageInput = query(validationEditorElement, SELECTORS.ERROR_MESSAGE);
            expect(errorMessageInput).toBeDefined();
            expect(errorMessageInput.value.value).toBe(ERROR_MESSAGE);
        });
    });
    it('Formula expression should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const formulaExpressionField = query(validationEditorElement, SELECTORS.FORMULA_EXPRESSION);
            expect(formulaExpressionField).toBeDefined();
            expect(formulaExpressionField.value.value).toBe(FORMULA_EXPRESSION);
        });
    });
});

