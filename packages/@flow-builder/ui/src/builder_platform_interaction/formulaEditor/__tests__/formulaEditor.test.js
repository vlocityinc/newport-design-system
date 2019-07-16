import { createElement } from 'lwc';
import FormulaEditor from '../formulaEditor';
import { createFormula } from 'builder_platform_interaction/elementFactory';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const createComponentUnderTest = node => {
    const el = createElement('builder_platform_interaction-formula-editor', {
        is: FormulaEditor
    });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    dataTypePicker: 'builder_platform_interaction-data-type-picker',
    resourcedTextArea: 'builder_platform_interaction-resourced-textarea',
    richTextPlainTextSwitch:
        'builder_platform_interaction-rich-text-plain-text-switch'
};

const getDataTypePicker = formulaEditor => {
    return formulaEditor.shadowRoot.querySelector(SELECTORS.dataTypePicker);
};

const getFormulaTextArea = formulaEditor => {
    return formulaEditor.shadowRoot.querySelector(SELECTORS.resourcedTextArea);
};

const getRichTextPlainTextSwitch = rexourdedTextArea =>
    rexourdedTextArea.shadowRoot.querySelector(
        SELECTORS.richTextPlainTextSwitch
    );

describe('formula-editor', () => {
    let formulaResource;
    beforeEach(() => {});
    describe('Edit existing formula', () => {
        let formulaEditor;
        beforeEach(() => {
            formulaResource = {
                dataType: {
                    value: 'Number',
                    error: null
                },
                expression: {
                    value: '2+2',
                    error: null
                },
                name: {
                    value: 'myFormula',
                    error: null
                },
                processMetadataValues: [],
                scale: 1,
                elementType: 'FORMULA',
                guid: 'FORMULA_11',
                isCanvasElement: false
            };
            formulaEditor = createComponentUnderTest(formulaResource);
        });
        it('Number should be selected, scale should be 1', () => {
            const dataTypePicker = getDataTypePicker(formulaEditor);
            expect(dataTypePicker.value.dataType).toBe('Number');
            expect(dataTypePicker.value.scale).toBe(1);
        });
        it('Expression textarea should have the proper value', () => {
            const formulaTextArea = getFormulaTextArea(formulaEditor);
            expect(formulaTextArea.value.value).toBe('2+2');
        });
        it('"Rich text plain text selection menu" should not be displayed as no plain text supported', () => {
            const richTextPlainTextComponent = getRichTextPlainTextSwitch(
                getFormulaTextArea(formulaEditor)
            );
            expect(richTextPlainTextComponent).toBeNull();
        });
    });
    describe('Edit new formula', () => {
        let formulaEditor;
        beforeEach(() => {
            formulaResource = createFormula();
            formulaResource = hydrateWithErrors(formulaResource);
            formulaEditor = createComponentUnderTest(formulaResource);
        });
        it('No DataType should be selected', () => {
            const dataTypePicker = getDataTypePicker(formulaEditor);
            expect(dataTypePicker.value.dataType).toBe(null);
        });
        it('Expression textarea should be empty', () => {
            const formulaTextArea = getFormulaTextArea(formulaEditor);
            expect(formulaTextArea.value.value).toBe('');
        });
    });
});
