import { createElement } from 'lwc';
import ValidationEditor from '../validationEditor';
import { query } from 'builder_platform_interaction/builderTestUtils';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

jest.mock('builder_platform_interaction/selectors', () => {
    return {
        readableElementsSelector: jest.fn(data => Object.values(data.elements))
    };
});

const SELECTORS = {
    RESOURCED_RICH_TEXT_EDITOR:
        'builder_platform_interaction-resourced-rich-text-editor',
    RESOURCED_TEXTAREA: 'builder_platform_interaction-resourced-textarea',
    RICH_TEXT_PLAIN_TEXT_SWITCH:
        'builder_platform_interaction-rich-text-plain-text-switch'
};

const createComponentUnderTest = props => {
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
            element: {
                formulaExpression: { value: null, error: null },
                errorMessage: { value: null, error: null }
            }
        });
    });
    it('Error message should be empty', () => {
        return Promise.resolve().then(() => {
            const resourcedRichTextEditorComponent = query(
                validationEditorElement,
                SELECTORS.RESOURCED_RICH_TEXT_EDITOR
            );
            expect(resourcedRichTextEditorComponent).not.toBeNull();
            expect(resourcedRichTextEditorComponent.value.value).toBeNull();
        });
    });
    it('Formula expression should be empty', () => {
        return Promise.resolve().then(() => {
            const resourcedTextareaComponent = query(
                validationEditorElement,
                SELECTORS.RESOURCED_TEXTAREA
            );
            expect(resourcedTextareaComponent).not.toBeNull();
            expect(resourcedTextareaComponent.value.value).toBeNull();
        });
    });
});

describe('validationEditor with validation rule', () => {
    const ERROR_MESSAGE =
        "The value you entered doesn't meet the validation criteria for this input field.";
    const FORMULA_EXPRESSION = "{!Var1} == 'text'";
    let validationEditorElement;
    beforeEach(() => {
        validationEditorElement = createComponentUnderTest({
            element: {
                formulaExpression: { value: FORMULA_EXPRESSION, error: null },
                errorMessage: { value: ERROR_MESSAGE, error: null }
            }
        });
    });
    it('Error message should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const resourcedRichTextEditorComponent = query(
                validationEditorElement,
                SELECTORS.RESOURCED_RICH_TEXT_EDITOR
            );
            expect(resourcedRichTextEditorComponent).not.toBeNull();
            expect(resourcedRichTextEditorComponent.value.value).toBe(
                ERROR_MESSAGE
            );
        });
    });
    it('"rich text/plain text switch" NOT displayed inside the resourced rich text editor', () => {
        return Promise.resolve().then(() => {
            const resourcedRichTextEditorComponent = query(
                validationEditorElement,
                SELECTORS.RESOURCED_RICH_TEXT_EDITOR
            );
            expect(resourcedRichTextEditorComponent).not.toBeNull();
            expect(resourcedRichTextEditorComponent.value.value).toBe(
                ERROR_MESSAGE
            );
            expect(
                resourcedRichTextEditorComponent.shadowRoot.querySelector(
                    SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH
                )
            ).toBeNull();
        });
    });
    it('Formula expression should be displayed correctly', () => {
        return Promise.resolve().then(() => {
            const resourcedTextareaComponent = query(
                validationEditorElement,
                SELECTORS.RESOURCED_TEXTAREA
            );
            expect(resourcedTextareaComponent).not.toBeNull();
            expect(resourcedTextareaComponent.value.value).toBe(
                FORMULA_EXPRESSION
            );
        });
    });
    it('"rich text/plain text switch" NOT displayed inside the resourced text area', () => {
        const resourcedTextareaComponent = query(
            validationEditorElement,
            SELECTORS.RESOURCED_TEXTAREA
        );
        expect(
            resourcedTextareaComponent.shadowRoot.querySelector(
                SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH
            )
        ).toBeNull();
    });
});
