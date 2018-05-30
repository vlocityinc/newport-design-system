import { createElement } from 'engine';
import FormulaEditor from '../formula-editor';

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-formula-editor', { is: FormulaEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    dataTypeCombobox: 'lightning-combobox',
    scaleInput: 'lightning-input.scale',
    expressionTextArea : 'lightning-textarea.expression'
};

describe('formula-editor', () => {
    let formulaResource;
    beforeEach(() => {
        formulaResource = {
            "dataType": {
                "value": "Number",
                "error": null
            },
            "expression": {
                "value": "2+2",
                "error": null
            },
            "name": {
                "value": "myFormula",
                "error": null
            },
            "processMetadataValues": [],
            "scale": 1,
            "elementType": "FORMULA",
            "guid": "FORMULA_11",
            "isCanvasElement": false
        };
    });
    describe('Edit existing formula', () => {
        let formulaEditor;
        beforeEach(() => {
            formulaEditor = createComponentUnderTest(formulaResource);
        });
        it('Number should be selected', () => {
            const dataTypeCombobox = formulaEditor.querySelector(selectors.dataTypeCombobox);
            expect(dataTypeCombobox.value).toBe('Number');
        });
        it('Scale input should have the proper value', () => {
            const scaleInput = formulaEditor.querySelector(selectors.scaleInput);
            expect(scaleInput.value).toBe(1);
        });
        it('Expression textarea should have the proper value', () => {
            const expressionTextArea = formulaEditor.querySelector(selectors.expressionTextArea);
            expect(expressionTextArea.value).toBe('2+2');
        });
    });
});