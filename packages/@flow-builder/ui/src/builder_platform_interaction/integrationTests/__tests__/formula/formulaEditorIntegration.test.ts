import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import FormulaEditor from 'builder_platform_interaction/formulaEditor';
import { loadFieldsForComplexTypesInFlow } from 'builder_platform_interaction/preloadLib';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { createElement } from 'lwc';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    resetState,
    setupStateForProcessType,
    translateFlowToUIAndDispatch
} from '../integrationTestUtils';
import { getLabelDescriptionElement, LabelDescriptionComponentTest } from '../labelDescriptionTestUtils';

const createComponentForTest = (node, { isNewMode = false } = {}) => {
    const el = createElement('builder_platform_interaction-formula-editor', {
        is: FormulaEditor
    });
    Object.assign(el, { node, isNewMode });
    setDocumentBodyChildren(el);
    return el;
};

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    TEXTAREA: 'textarea',
    SYNTAXVALIDARION: 'formula-syntax-validation',
    ERRORMESSAGE: '.slds-has-error'
};

const VALIDATION_ERROR_MESSAGES = {
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    UNKNOWN_RECORD_FIELD: 'FlowBuilderMergeFieldValidation.unknownRecordField'
};

const getDataTypePickerElement = (editor) => editor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);

const getDataTypeComboboxElement = (editor) =>
    getDataTypePickerElement(editor).shadowRoot.querySelector(SELECTORS.LIGHTNING_COMBOBOX);

const getFormulaBuilder = (editor) => editor.shadowRoot.querySelector(SELECTORS.FORMULA_BUILDER);

const getFormulaTextArea = (editor) => getFormulaBuilder(editor).shadowRoot.querySelector(SELECTORS.TEXTAREA);

const getFerovResourcePicker = (editor) =>
    getFormulaBuilder(editor).shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);

const getResourceCombobox = (editor) => {
    const baseResourcePicker = getFerovResourcePicker(editor).shadowRoot.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    return new ComboboxTestComponent(baseResourcePicker.shadowRoot.querySelector(SELECTORS.COMBOBOX));
};

const getSyntaxValidation = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(SELECTORS.SYNTAXVALIDARION);

const getErrorMessage = (formulaBuilder) => formulaBuilder.shadowRoot.querySelector(SELECTORS.ERRORMESSAGE);

describe('Formula Builder', () => {
    let store, uiFlow;
    beforeAll(async () => {
        store = await setupStateForProcessType(FLOW_PROCESS_TYPE.AUTO_LAUNCHED_FLOW);
    });
    afterAll(() => {
        resetState();
    });
    describe('Edit mode', () => {
        let formulaNode;
        let propertyEditor;
        beforeAll(async () => {
            uiFlow = translateFlowToUIAndDispatch(flowWithAllElements, store);
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
            resetFetchOnceCache();
            // TODO : add a function to reset cachedEntityFields
        });
        beforeEach(async () => {
            const element = getElementByDevName('textFormula');
            formulaNode = getElementForPropertyEditor(element);
            propertyEditor = createComponentForTest(formulaNode);
            await ticks();
        });
        it('has no validation error', () => {
            expect(propertyEditor.validate()).toEqual([]);
        });
        describe('dev name', () => {
            let labelDescription: LabelDescriptionComponentTest;
            beforeEach(() => {
                labelDescription = new LabelDescriptionComponentTest(getLabelDescriptionElement(propertyEditor));
            });

            it('modify the dev name', async () => {
                const newDevName = 'newName';
                await labelDescription.setName(newDevName);
                expect(propertyEditor.node.name.value).toBe(newDevName);
            });
            it('display error if devName is cleared', async () => {
                const newDevName = '';
                await labelDescription.setName(newDevName);
                expect(propertyEditor.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
        });
        describe('Data Type', () => {
            it('is set to Text', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(propertyEditor);
                expect(dataTypeCombobox.value).toBe('String');
            });
            it('is disabled', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(propertyEditor);
                expect(dataTypeCombobox.disabled).toBe(true);
            });
        });
        describe('Formula text area', () => {
            it('contains the formula', () => {
                const textArea = getFormulaTextArea(propertyEditor);
                expect(textArea.value).toBe('IF({!accountSObjectVariable.AnnualRevenue} < 1000000,"Small", "Big")');
            });
            it('validates blank formula', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = '';

                const formulaBuilder = getFormulaBuilder(propertyEditor);
                const syntaxBtn = getSyntaxValidation(formulaBuilder);
                syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
                await ticks();
                expect(syntaxBtn.validationResult.isValidSyntax).toBeFalsy();
                expect(getErrorMessage(formulaBuilder).textContent).toEqual(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
            it('displays an error if the formula contains invalid merge fields', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = 'IF({!accountSObjectVariable.invalidProp} < 1000000,"Small", "Big")';

                const formulaBuilder = getFormulaBuilder(propertyEditor);
                const syntaxBtn = getSyntaxValidation(formulaBuilder);
                syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
                await ticks();
                expect(getErrorMessage(formulaBuilder).textContent).toEqual(
                    VALIDATION_ERROR_MESSAGES.UNKNOWN_RECORD_FIELD
                );
            });
        });
        describe('Resource picker', () => {
            const GROUP_LABELS = {
                RECORD_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                GLOBAL_VARIABLES: 'FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory'
            };
            it('contains "New Resource"', () => {
                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                expect(groupedCombobox.getItemBy('text', 'FlowBuilderExpressionUtils.newResourceLabel')).toBeDefined();
            });
            it('contains a "Record Variables" group containing "accountSObjectVariable"', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                expect(
                    groupedCombobox.getItemInGroup(GROUP_LABELS.RECORD_VARIABLES, 'text', 'accountSObjectVariable')
                ).toBeDefined();
            });
            // it('contains a "Global Variables" group containing $Flow, $Api, $Organization, $Profile, $System, $User', async () => {
            //     // disable render-incrementally on combobox so groupedCombobox gets full menu data
            //     const comboxbox = getResourceCombobox(propertyEditor);
            //     comboxbox.element.renderIncrementally = false;
            //     await ticks(1);

            //     const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Flow')).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Api')).toBeDefined();
            //     expect(
            //         groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Organization')
            //     ).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Profile')).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$User')).toBeDefined();
            // });
            it('displays the record properties when selecting a record variable', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                const item = groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                await groupedCombobox.select(item.value, { blur: false });
                expect(groupedCombobox.getItemBy('text', 'Description')).toBeDefined();
                expect(groupedCombobox.getItemBy('text', 'ShippingLongitude')).toBeDefined();
            });
            it('inserts the resource in the textarea when we select a resource', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const textArea = getFormulaTextArea(propertyEditor);
                textArea.setSelectionRange(3, 3);
                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                const item = groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                await groupedCombobox.select(item.value, { blur: false });
                const subItem = groupedCombobox.getItemBy('text', 'Description');
                await groupedCombobox.select(subItem.value, { blur: false });
                expect(textArea.value).toEqual(
                    'IF({!accountSObjectVariable.Description}{!accountSObjectVariable.AnnualRevenue} < 1000000,"Small", "Big")'
                );
            });
        });
    });

    describe('New mode', () => {
        let formulaNode;
        let propertyEditor;
        beforeAll(async () => {
            uiFlow = translateFlowToUIAndDispatch(flowWithAllElements, store);
            await loadFieldsForComplexTypesInFlow(uiFlow);
        });
        afterAll(() => {
            store.dispatch({ type: 'INIT' });
            resetFetchOnceCache();
            // TODO : add a function to reset cachedEntityFields
        });
        beforeEach(async () => {
            const element = getElementByDevName('textFormula');
            formulaNode = getElementForPropertyEditor(element);
            propertyEditor = createComponentForTest(formulaNode, { isNewMode: true });
            await ticks();
        });
        it('has no validation error', () => {
            expect(propertyEditor.validate()).toEqual([]);
        });
        describe('dev name', () => {
            let labelDescription: LabelDescriptionComponentTest;
            beforeEach(() => {
                labelDescription = new LabelDescriptionComponentTest(getLabelDescriptionElement(propertyEditor));
            });

            it('modify the dev name', async () => {
                const newDevName = 'newName';
                await labelDescription.setName(newDevName);
                expect(propertyEditor.node.name.value).toBe(newDevName);
            });
            it('display error if devName is cleared', async () => {
                const newDevName = '';
                await labelDescription.setName(newDevName);
                expect(propertyEditor.node.name.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
        });
        describe('Data Type', () => {
            it('is set to Text', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(propertyEditor);
                expect(dataTypeCombobox.value).toBe('String');
            });
            it('is enabled', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(propertyEditor);
                expect(dataTypeCombobox.disabled).toBe(false);
            });
        });
        describe('Formula text area', () => {
            it('contains the formula', () => {
                const textArea = getFormulaTextArea(propertyEditor);
                expect(textArea.value).toBe('IF({!accountSObjectVariable.AnnualRevenue} < 1000000,"Small", "Big")');
            });
            it('validates blank formula', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = '';

                const formulaBuilder = getFormulaBuilder(propertyEditor);
                const syntaxBtn = getSyntaxValidation(formulaBuilder);
                syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
                await ticks();
                expect(syntaxBtn.validationResult.isValidSyntax).toBeFalsy();
                expect(getErrorMessage(formulaBuilder).textContent).toEqual(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
            it('displays an error if the formula contains invalid merge fields', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = 'IF({!accountSObjectVariable.invalidProp} < 1000000,"Small", "Big")';

                const formulaBuilder = getFormulaBuilder(propertyEditor);
                const syntaxBtn = getSyntaxValidation(formulaBuilder);
                syntaxBtn.dispatchEvent(new CustomEvent('checksyntax'));
                await ticks();
                expect(getErrorMessage(formulaBuilder).textContent).toEqual(
                    VALIDATION_ERROR_MESSAGES.UNKNOWN_RECORD_FIELD
                );
            });
        });
        describe('Resource picker', () => {
            const GROUP_LABELS = {
                RECORD_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                GLOBAL_VARIABLES: 'FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory'
            };
            it('does not contain "New Resource"', () => {
                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                expect(
                    groupedCombobox.getItemBy('text', 'FlowBuilderExpressionUtils.newResourceLabel')
                ).toBeUndefined();
            });
            it('contains a "Record Variables" group containing "accountSObjectVariable"', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                expect(
                    groupedCombobox.getItemInGroup(GROUP_LABELS.RECORD_VARIABLES, 'text', 'accountSObjectVariable')
                ).toBeDefined();
            });
            // it('contains a "Global Variables" group containing $Flow, $Api, $Organization, $Profile, $System, $User', async () => {
            //     // disable render-incrementally on combobox so groupedCombobox gets full menu data
            //     const comboxbox = getResourceCombobox(propertyEditor);
            //     comboxbox.element.renderIncrementally = false;
            //     await ticks(1);

            //     const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Flow')).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Api')).toBeDefined();
            //     expect(
            //         groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Organization')
            //     ).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Profile')).toBeDefined();
            //     expect(groupedCombobox.getItemInGroup(GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$User')).toBeDefined();
            // });
            it('displays the record properties when selecting a record variable', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                const item = groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                await groupedCombobox.select(item.value, { blur: false });
                expect(groupedCombobox.getItemBy('text', 'Description')).toBeDefined();
                expect(groupedCombobox.getItemBy('text', 'ShippingLongitude')).toBeDefined();
            });
            it('inserts the resource in the textarea when we select a resource', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.element.renderIncrementally = false;
                await ticks(1);

                const textArea = getFormulaTextArea(propertyEditor);
                textArea.setSelectionRange(3, 3);
                const groupedCombobox = getResourceCombobox(propertyEditor).getGroupedCombobox();
                const item = groupedCombobox.getItemInGroup(
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                await groupedCombobox.select(item.value, { blur: false });
                const subItem = groupedCombobox.getItemBy('text', 'Description');
                await groupedCombobox.select(subItem.value, { blur: false });
                expect(textArea.value).toEqual(
                    'IF({!accountSObjectVariable.Description}{!accountSObjectVariable.AnnualRevenue} < 1000000,"Small", "Big")'
                );
            });
        });
    });
});
