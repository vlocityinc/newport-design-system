import {
    blurEvent,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { ELEMENT_TYPE, FLOW_PROCESS_TYPE, FLOW_TRIGGER_TYPE } from 'builder_platform_interaction/flowMetadata';
import { validateTextWithMergeFields } from 'builder_platform_interaction/mergeFieldLib';
import { createElement } from 'lwc';
import { formulaFunctionsForNoTrigger as mockFormulaFunctions } from 'serverData/GetFormulaFunctions/formulaFunctionsForNoTrigger.json';
import { formulaFunctionsForRecordBeforeSave as mockFormulaFunctionsRecordBeforeSave } from 'serverData/GetFormulaFunctions/formulaFunctionsForRecordBeforeSave.json';
import { formulaOperators as mockFormulaOperators } from 'serverData/GetFormulaOperators/formulaOperators.json';
import FormulaBuilder from '../formulaBuilder';

jest.mock('builder_platform_interaction/ferovResourcePicker', () =>
    require('builder_platform_interaction_mocks/ferovResourcePicker')
);

const createComponentUnderTest = (props) => {
    const el = createElement('builder_platform_interaction-formula-builder', {
        is: FormulaBuilder
    });
    Object.assign(el, props);
    setDocumentBodyChildren(el);
    return el;
};

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    const SERVER_ACTION_TYPE = actual.SERVER_ACTION_TYPE;
    return {
        SERVER_ACTION_TYPE,
        fetchOnce: (serverActionType, params) => {
            switch (serverActionType) {
                case SERVER_ACTION_TYPE.GET_FORMULA_FUNCTIONS:
                    if (params.flowTriggerType === 'RecordBeforeSave' || params.flowTriggerType === 'RecordAfterSave') {
                        return Promise.resolve(mockFormulaFunctionsRecordBeforeSave);
                    }
                    return Promise.resolve(mockFormulaFunctions);
                case SERVER_ACTION_TYPE.GET_FORMULA_OPERATORS:
                    return Promise.resolve(mockFormulaOperators);
                default:
                    return Promise.reject(new Error('Unexpected server action ' + serverActionType));
            }
        }
    };
});

jest.mock('builder_platform_interaction/mergeFieldLib', () => {
    return {
        validateTextWithMergeFields: jest.fn().mockReturnValue([])
    };
});

const selectors = {
    label: 'label',
    abbr: 'abbr',
    textarea: 'textarea',
    functionPicker: 'formula-function-picker',
    operatorPicker: 'formula-operator-picker',
    syntaxValidation: 'formula-syntax-validation',
    ferovResourcePicker: INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
    groupedCombobox: LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX,
    errorMessage: '.slds-has-error'
};

const getResourcePicker = (formulaBuilder) =>
    formulaBuilder.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER);
const getFunctionPicker = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(selectors.functionPicker);
const getOperatorPicker = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(selectors.operatorPicker);
const getSyntaxValidation = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(selectors.syntaxValidation);
const getTextArea = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(selectors.textarea);
const getErrorMessage = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(selectors.errorMessage);

const flowProcessType = FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW;

async function verifyInsertion(
    existingText,
    cmpName,
    itemSelectedEvent,
    selectionStart,
    selectionEnd,
    expectedFinalText,
    expectedFinalCursorPosition
) {
    const element = createComponentUnderTest({
        flowProcessType,
        required: true,
        value: { value: existingText, error: null }
    });
    const textarea = element.shadowRoot.querySelector(selectors.textarea);
    textarea.setSelectionRange(selectionStart, selectionEnd);
    const changeEventCallback = jest.fn();
    element.addEventListener('formulachanged', changeEventCallback);
    const fromCmp = element.shadowRoot.querySelector(cmpName);
    fromCmp.dispatchEvent(itemSelectedEvent);
    await ticks(1);
    expect(element.value.value).toBe(existingText);
    expect(textarea.value).toBe(expectedFinalText);
    expect(textarea.selectionStart).toBe(expectedFinalCursorPosition);
    expect(textarea.selectionEnd).toBe(expectedFinalCursorPosition);
    if (cmpName !== selectors.functionPicker) {
        expect(fromCmp.value).toBeNull();
    } else {
        expect(fromCmp.functionData).toEqual(mockFormulaFunctions);
    }
    expect(changeEventCallback).toHaveBeenCalled();
    expect(changeEventCallback.mock.calls[0][0]).toMatchObject({
        detail: {
            value: expectedFinalText,
            error: null
        }
    });
}

describe('Formula builder', () => {
    describe('With default configurations', () => {
        let formulaBuilder;
        beforeAll(() => {
            formulaBuilder = createComponentUnderTest({
                flowProcessType
            });
        });
        it('Should have the asterisk when required', () => {
            const fullLabel = formulaBuilder.shadowRoot.querySelector(selectors.label);
            expect(fullLabel.textContent).toEqual('FlowBuilderFormulaBuilder.formulaLabel');
            const asterisk = fullLabel.querySelector(selectors.abbr);
            expect(asterisk).toBeNull();
        });
        it('Should have ferovResourcePicker component', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker).not.toBeNull();
        });
        it('Should have forFormula set to false by default', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.forFormula).toBeFalsy();
        });
        it('Should have hideNewResource set to false by default', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.hideNewResource).toBeFalsy();
        });
        it('Should have hideFlowSystemVariable set to false by default', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.hideFlowSystemVariable).toBeFalsy();
        });
        it('Should have functionPicker component', () => {
            const functionPicker = getFunctionPicker(formulaBuilder);
            expect(functionPicker).not.toBeNull();
            expect(functionPicker.functionData).toEqual(mockFormulaFunctions);
        });
        it('Should have operatorPicker component', () => {
            const operatorPicker = getOperatorPicker(formulaBuilder);
            expect(operatorPicker).not.toBeNull();
            expect(operatorPicker.operatorData).toEqual(mockFormulaOperators);
        });
        it('Should have text area input without value', () => {
            const textArea = getTextArea(formulaBuilder);
            expect(textArea).not.toBeNull();
            expect(textArea.value).toEqual('');
        });
        it('Should have syntaxValidation component', () => {
            expect(getSyntaxValidation(formulaBuilder)).not.toBeNull();
        });
    });
    describe('In record triggered flows', () => {
        const formulaValue = 'my formula';
        let formulaBuilder;
        beforeAll(() => {
            formulaBuilder = createComponentUnderTest({
                flowProcessType,
                flowTriggerType: FLOW_TRIGGER_TYPE.BEFORE_SAVE,
                resourcePickerConfig: {
                    filterOptions: {
                        forFormula: true,
                        hideNewResource: true,
                        hideFlowSystemVariable: true
                    },
                    elementConfig: {
                        elementType: ELEMENT_TYPE.START_ON_DML
                    }
                },
                required: true,
                value: { value: formulaValue, error: null }
            });
        });
        it('Should have the asterisk when required', () => {
            const fullLabel = formulaBuilder.shadowRoot.querySelector(selectors.label);
            expect(fullLabel.textContent).toEqual('*FlowBuilderFormulaBuilder.formulaLabel');
            const asterisk = fullLabel.querySelector(selectors.abbr);
            expect(asterisk.textContent).toEqual('*');
        });
        it('Should have ferovResourcePicker component', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker).not.toBeNull();
        });
        it('Should have forFormula set to true', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.forFormula).toBeTruthy();
        });
        it('Should have hideNewResource set to true', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.hideNewResource).toBeTruthy();
        });
        it('Should have hideFlowSystemVariable set to true by default', () => {
            const resourcePicker = getResourcePicker(formulaBuilder);
            expect(resourcePicker.hideFlowSystemVariable).toBeTruthy();
        });
        it('Should load functions for trigger RecordBeforeSave', () => {
            const functionPicker = getFunctionPicker(formulaBuilder);
            expect(functionPicker).not.toBeNull();
            expect(functionPicker.functionData).toEqual(mockFormulaFunctionsRecordBeforeSave);
        });
        it('Should have operatorPicker component', () => {
            const operatorPicker = getOperatorPicker(formulaBuilder);
            expect(operatorPicker).not.toBeNull();
            expect(operatorPicker.operatorData).toEqual(mockFormulaOperators);
        });
        it('Should have text area input with value', () => {
            const textArea = getTextArea(formulaBuilder);
            expect(textArea).not.toBeNull();
            expect(textArea.value).toEqual(formulaValue);
        });
        it('Should have syntaxValidation component', () => {
            expect(getSyntaxValidation(formulaBuilder)).not.toBeNull();
        });
    });
    describe('Item selection from the resource picker', () => {
        const selectedResource = '{!var}';
        const resourceSelectedEvent = new CustomEvent('itemselected', {
            detail: { item: { displayText: selectedResource } }
        });
        it('Should insert the item when there is no text', () => {
            return verifyInsertion(
                '',
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                0,
                0,
                selectedResource,
                selectedResource.length
            );
        });
        it('Should insert the item when the cursor is at the beginning of text', () => {
            verifyInsertion(
                'Sample Text',
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                0,
                0,
                '{!var}Sample Text',
                selectedResource.length
            );
        });
        it('Should insert the item when the cursor is in the middle of text', () => {
            verifyInsertion(
                'Sample Text',
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                6,
                6,
                'Sample{!var} Text',
                12
            );
        });
        it('Should insert the item when the cursor is at the end of text', () => {
            const existingText = 'Sample Text';
            const finalText = existingText + selectedResource;
            verifyInsertion(
                existingText,
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should insert the item when the cursor is on a new line', () => {
            const existingText = 'Sample Text\n';
            const finalText = existingText + selectedResource;
            verifyInsertion(
                existingText,
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should replace selected text with the inserted item', () => {
            const existingText = 'Sample Text';
            const finalText = 'Sample {!var}';
            verifyInsertion(
                existingText,
                selectors.ferovResourcePicker,
                resourceSelectedEvent,
                7,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should not do anything if it has a next item', async () => {
            const existingText = 'Sample Text';
            const element = createComponentUnderTest({ value: { value: existingText, error: null } });
            const textarea = element.shadowRoot.querySelector(selectors.textarea);
            textarea.setSelectionRange(0, 0);
            const itemSelectedEvent2 = new CustomEvent('itemselected', {
                detail: { item: { hasNext: true } }
            });
            const ferovResourcePicker = element.shadowRoot.querySelector(selectors.ferovResourcePicker);
            const changeEventCallback = jest.fn();
            element.addEventListener('name', changeEventCallback);
            ferovResourcePicker.value = 'initialValue';
            ferovResourcePicker.dispatchEvent(itemSelectedEvent2);
            await ticks(1);
            expect(element.value.value).toBe(existingText);
            expect(textarea.value).toBe(existingText);
            expect(textarea.selectionStart).toBe(0);
            expect(textarea.selectionEnd).toBe(0);
            expect(ferovResourcePicker.value).toBe('initialValue');
            expect(changeEventCallback).not.toHaveBeenCalled();
        });
    });
    describe('Item selection from the function picker', () => {
        const selectedFunction = 'ABS(number)';
        const functionSelectedEvent = new CustomEvent('functionselected', {
            detail: { value: selectedFunction }
        });
        it('Should insert the item when there is no text', () => {
            return verifyInsertion(
                '',
                selectors.functionPicker,
                functionSelectedEvent,
                0,
                0,
                selectedFunction,
                selectedFunction.length
            );
        });
        it('Should insert the item when the cursor is at the beginning of text', () => {
            verifyInsertion(
                'Sample Text',
                selectors.functionPicker,
                functionSelectedEvent,
                0,
                0,
                'ABS(number)Sample Text',
                selectedFunction.length
            );
        });
        it('Should insert the item when the cursor is in the middle of text', () => {
            verifyInsertion(
                'Sample Text',
                selectors.functionPicker,
                functionSelectedEvent,
                6,
                6,
                'SampleABS(number) Text',
                17
            );
        });
        it('Should insert the item when the cursor is at the end of text', () => {
            const existingText = 'Sample Text';
            const finalText = existingText + selectedFunction;
            verifyInsertion(
                existingText,
                selectors.functionPicker,
                functionSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should insert the item when the cursor is on a new line', () => {
            const existingText = 'Sample Text\n';
            const finalText = existingText + selectedFunction;
            verifyInsertion(
                existingText,
                selectors.functionPicker,
                functionSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should replace selected text with the inserted item', () => {
            const existingText = 'Sample Text';
            const finalText = 'Sample ABS(number)';
            verifyInsertion(
                existingText,
                selectors.functionPicker,
                functionSelectedEvent,
                7,
                existingText.length,
                finalText,
                finalText.length
            );
        });
    });
    describe('Item selection from the operator picker', () => {
        const selectedOperator = '>=';
        const operatorSelectedEvent = new CustomEvent('operatorselected', {
            detail: { value: selectedOperator }
        });
        it('Should insert the item when there is no text', () => {
            return verifyInsertion(
                '',
                selectors.operatorPicker,
                operatorSelectedEvent,
                0,
                0,
                selectedOperator,
                selectedOperator.length
            );
        });
        it('Should insert the item when the cursor is at the beginning of text', () => {
            verifyInsertion(
                'Sample Text',
                selectors.operatorPicker,
                operatorSelectedEvent,
                0,
                0,
                '>=Sample Text',
                selectedOperator.length
            );
        });
        it('Should insert the item when the cursor is in the middle of text', () => {
            verifyInsertion('Sample Text', selectors.operatorPicker, operatorSelectedEvent, 6, 6, 'Sample>= Text', 8);
        });
        it('Should insert the item when the cursor is at the end of text', () => {
            const existingText = 'Sample Text';
            const finalText = existingText + selectedOperator;
            verifyInsertion(
                existingText,
                selectors.operatorPicker,
                operatorSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should insert the item when the cursor is on a new line', () => {
            const existingText = 'Sample Text\n';
            const finalText = existingText + selectedOperator;
            verifyInsertion(
                existingText,
                selectors.operatorPicker,
                operatorSelectedEvent,
                existingText.length,
                existingText.length,
                finalText,
                finalText.length
            );
        });
        it('Should replace selected text with the inserted item', () => {
            const existingText = 'Sample Text';
            const finalText = 'Sample >=';
            verifyInsertion(
                existingText,
                selectors.operatorPicker,
                operatorSelectedEvent,
                7,
                existingText.length,
                finalText,
                finalText.length
            );
        });
    });
    describe('Validation', () => {
        let eventCallback;
        const expectValueChangedEventWithValue = (value, error) => {
            expect(eventCallback).toHaveBeenCalled();
            expect(eventCallback.mock.calls[0][0]).toMatchObject({
                detail: { value, error }
            });
        };
        const validationError = {
            errorType: 'errorType',
            message: 'errorMessage',
            startIndex: 0,
            endIndex: 0
        };
        beforeEach(() => {
            eventCallback = jest.fn();
            validateTextWithMergeFields.mockReturnValue([validationError]);
        });
        it('Should validate global variables by default', () => {
            const formulaBuilder = createComponentUnderTest({
                flowProcessType,
                required: true,
                value: { value: '{!unknownMergeField}', error: null }
            });
            formulaBuilder.addEventListener('change', eventCallback);
            const textarea = getTextArea(formulaBuilder);
            textarea.dispatchEvent(new CustomEvent('blur'));
            expect(validateTextWithMergeFields).toHaveBeenCalledWith('{!unknownMergeField}', {
                allowCollectionVariables: true,
                allowGlobalConstants: true,
                ignoreGlobalVariables: false
            });
        });
        it('Should not validate global variables in the formula editor', () => {
            const formulaBuilder = createComponentUnderTest({
                flowProcessType,
                required: true,
                resourcePickerConfig: {
                    filterOptions: {
                        forFormula: true
                    }
                },
                value: { value: '{!unknownMergeField}', error: null }
            });
            formulaBuilder.addEventListener('change', eventCallback);
            const textarea = getTextArea(formulaBuilder);
            textarea.dispatchEvent(new CustomEvent('blur'));
            expect(validateTextWithMergeFields).toHaveBeenCalledWith('{!unknownMergeField}', {
                allowCollectionVariables: true,
                allowGlobalConstants: true,
                ignoreGlobalVariables: true
            });
        });
        it('Should fire formulachanged event on blur text area with validation errors', async () => {
            const formulaBuilder = createComponentUnderTest({
                flowProcessType,
                required: true,
                value: { value: '{!unknownMergeField}', error: null }
            });
            formulaBuilder.addEventListener('formulachanged', eventCallback);
            const textArea = getTextArea(formulaBuilder);
            textArea.dispatchEvent(blurEvent);
            await ticks(1);
            expectValueChangedEventWithValue('{!unknownMergeField}', validationError.message);
            const errorMsg = getErrorMessage(formulaBuilder);
            expect(errorMsg.textContent).toEqual(validationError.message);
        });
        it('Should fire formulachanged event on click syntax validation button with validation errors', async () => {
            const formulaBuilder = createComponentUnderTest({
                flowProcessType,
                required: true,
                value: { value: '{!unknownMergeField}', error: null }
            });
            formulaBuilder.addEventListener('formulachanged', eventCallback);
            const syntaxBtn = getSyntaxValidation(formulaBuilder);
            syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
            await ticks(1);
            expectValueChangedEventWithValue('{!unknownMergeField}', validationError.message);
            expect(syntaxBtn.validationResult.isValidSyntax).toBeFalsy();
            expect(getErrorMessage(formulaBuilder).textContent).toEqual(validationError.message);
        });
        it('Should fire formulachanged event on click syntax validation button without errors', async () => {
            const formulaBuilder = createComponentUnderTest({
                flowProcessType,
                required: true,
                value: { value: 'valid formula', error: null }
            });
            validateTextWithMergeFields.mockReturnValue([]);
            formulaBuilder.addEventListener('formulachanged', eventCallback);
            const syntaxBtn = getSyntaxValidation(formulaBuilder);
            syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
            await ticks(1);
            expectValueChangedEventWithValue('valid formula', null);
            expect(syntaxBtn.validationResult.isValidSyntax).toBeTruthy();
            expect(getErrorMessage(formulaBuilder)).toBeNull();
        });
    });
});
