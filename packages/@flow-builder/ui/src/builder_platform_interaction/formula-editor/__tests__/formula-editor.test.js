import { createElement } from 'engine';
import FormulaEditor from '../formula-editor';

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-formula-editor', { is: FormulaEditor });
    el.node = node;
    document.body.appendChild(el);
    return el;
};

const selectors = {
    dataTypePicker: 'builder_platform_interaction-data-type-picker',
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
        it('Number should be selected, scale should be 1', () => {
            const dataTypePicker = formulaEditor.querySelector(selectors.dataTypePicker);
            expect(dataTypePicker.value.dataType).toBe('Number');
            expect(dataTypePicker.value.scale).toBe(1);
        });
        it('Expression textarea should have the proper value', () => {
            const expressionTextArea = formulaEditor.querySelector(selectors.expressionTextArea);
            expect(expressionTextArea.value).toBe('2+2');
        });
    });
});