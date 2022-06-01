// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    setDocumentBodyChildren
} from 'builder_platform_interaction/builderTestUtils';
import { hydrateWithErrors } from 'builder_platform_interaction/dataMutationLib';
import { createFormula } from 'builder_platform_interaction/elementFactory';
import { createElement } from 'lwc';
import FormulaEditor from '../formulaEditor';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);
jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));
jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getProcessType: jest.fn(),
        getTriggerType: jest.fn(),
        getRecordTriggerType: jest.fn()
    };
});
const mockedContextLib = require('builder_platform_interaction_mocks/contextLib');
jest.mock('builder_platform_interaction/contextLib', () => require('builder_platform_interaction_mocks/contextLib'));

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-formula-editor', {
        is: FormulaEditor
    });
    el.node = node;
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    dataTypePicker: INTERACTION_COMPONENTS_SELECTORS.DATA_TYPE_PICKER,
    formulaBuilder: INTERACTION_COMPONENTS_SELECTORS.FORMULA_BUILDER,
    resourcedTextArea: INTERACTION_COMPONENTS_SELECTORS.RESOURCED_TEXTAREA,
    richTextPlainTextSwitch: INTERACTION_COMPONENTS_SELECTORS.RICH_TEXT_PLAIN_TEXT_SWITCH
};

const getDataTypePicker = (formulaEditor) => {
    return formulaEditor.shadowRoot.querySelector(SELECTORS.dataTypePicker);
};

const getFormulaTextArea = (formulaEditor) => {
    return formulaEditor.shadowRoot.querySelector(SELECTORS.resourcedTextArea);
};

const getFormulaBuilder = (formulaEditor) => {
    return formulaEditor.shadowRoot.querySelector(SELECTORS.formulaBuilder);
};

const getRichTextPlainTextSwitch = (rexourdedTextArea) =>
    rexourdedTextArea.shadowRoot.querySelector(SELECTORS.richTextPlainTextSwitch);

describe('formula-editor', () => {
    let formulaResource;
    let formulaEditor;
    let formulaBuilder;
    let formulaTextArea;

    beforeEach(() => {
        jest.clearAllMocks();
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
        mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(false);
        formulaEditor = createComponentUnderTest(formulaResource);
    });

    describe('Edit existing formula', () => {
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
            const richTextPlainTextComponent = getRichTextPlainTextSwitch(getFormulaTextArea(formulaEditor));
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

    describe('Org does not have FlowFormulaBuilder perm enabled', () => {
        beforeEach(() => {
            mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(false);
            formulaBuilder = getFormulaBuilder(formulaEditor);
            formulaTextArea = getFormulaTextArea(formulaEditor);
        });

        it('should render resourced textarea component with expression value', () => {
            expect(formulaTextArea).not.toBeNull();
            expect(formulaTextArea.value.value).toBe('2+2');
        });

        it('should NOT render formual builder component', () => {
            expect(formulaBuilder).toBeNull();
        });
    });

    describe('Org has FlowFormulaBuilder perm enabled', () => {
        beforeEach(() => {
            mockedContextLib.orgHasFlowFormulaBuilder = jest.fn().mockReturnValue(true);
            formulaEditor = createComponentUnderTest(formulaResource);
            formulaBuilder = getFormulaBuilder(formulaEditor);
            formulaTextArea = getFormulaTextArea(formulaEditor);
        });

        it('should render formula builder with expression value', () => {
            expect(formulaBuilder.value.value).toBe('2+2');
            expect(formulaTextArea).toBeNull();
        });

        it('should NOT render resourced textarea component', () => {
            expect(formulaTextArea).toBeNull();
        });
    });
});
