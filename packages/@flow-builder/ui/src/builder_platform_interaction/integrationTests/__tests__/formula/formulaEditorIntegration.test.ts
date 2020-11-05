import { createElement } from 'lwc';
import FormulaEditor from 'builder_platform_interaction/formulaEditor';
import {
    ticks,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    focusoutEvent,
    blurEvent,
    selectEvent
} from 'builder_platform_interaction/builderTestUtils';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    resetState,
    setupStateForProcessType,
    translateFlowToUIAndDispatch
} from '../integrationTestUtils';
import { getLabelDescriptionNameElement } from '../labelDescriptionTestUtils';
import { resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { FLOW_PROCESS_TYPE } from 'builder_platform_interaction/flowMetadata';
import * as flowWithAllElements from 'mock/flows/flowWithAllElements.json';
import { loadFieldsForComplexTypesInFlow } from 'builder_platform_interaction/preloadLib';
import { getGroupedComboboxItemInGroup, getGroupedComboboxItemBy } from '../groupedComboboxTestUtils';

const createComponentForTest = (node, { isNewMode = false } = {}) => {
    const el = createElement('builder_platform_interaction-formula-editor', {
        is: FormulaEditor
    });
    Object.assign(el, { node, isNewMode });
    document.body.appendChild(el);
    return el;
};

const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS,
    TEXTAREA: 'textarea'
};

const VALIDATION_ERROR_MESSAGES = {
    ...FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    UNKNOWN_RECORD_FIELD: 'FlowBuilderMergeFieldValidation.unknownRecordField'
};

const getDataTypePickerElement = (editor) => editor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);

const getDataTypeComboboxElement = (editor) =>
    getDataTypePickerElement(editor).shadowRoot.querySelector(SELECTORS.LIGHTNING_COMBOBOX);

const getResourcedTextArea = (editor) => editor.shadowRoot.querySelector(SELECTORS.RESOURCED_TEXTAREA);

const getFormulaTextArea = (editor) => getResourcedTextArea(editor).shadowRoot.querySelector(SELECTORS.TEXTAREA);

const getFerovResourcePicker = (editor) =>
    getResourcedTextArea(editor).shadowRoot.querySelector(SELECTORS.FEROV_RESOURCE_PICKER);

const getResourceCombobox = (editor) => {
    const baseResourcePicker = getFerovResourcePicker(editor).shadowRoot.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    return baseResourcePicker.shadowRoot.querySelector(SELECTORS.COMBOBOX);
};

const getResourceGroupedCombobox = (editor) => {
    const interactionCombobox = getResourceCombobox(editor);
    return interactionCombobox.shadowRoot.querySelector(SELECTORS.LIGHTNING_GROUPED_COMBOBOX);
};

describe('Formula Editor', () => {
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
            it('modify the dev name', async () => {
                const newDevName = 'newName';
                const devNameInput = getLabelDescriptionNameElement(propertyEditor);
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(propertyEditor.node.name.value).toBe(newDevName);
            });
            it('display error if devName is cleared', async () => {
                const newDevName = '';
                const devNameInput = getLabelDescriptionNameElement(propertyEditor);
                devNameInput.value = newDevName;
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
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
            it('valides the formula on blur', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = '';
                textArea.dispatchEvent(blurEvent);
                await ticks();
                expect(propertyEditor.node.expression.error).toBe(VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK);
            });
            it('displays an error if the formula contains invalid merge fields', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = 'IF({!accountSObjectVariable.invalidProp} < 1000000,"Small", "Big")';
                textArea.dispatchEvent(blurEvent);
                await ticks();
                expect(propertyEditor.node.expression.error).toBe(VALIDATION_ERROR_MESSAGES.UNKNOWN_RECORD_FIELD);
            });
            it('does not display an error if the formula contains invalid global variables', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = 'IF({!$accountSObjectVariable.invalidProp} < 1000000,"Small", "Big")';
                textArea.dispatchEvent(blurEvent);
                await ticks();
                expect(propertyEditor.node.expression.error).toBe(null);
            });
        });
        describe('Resource picker', () => {
            const GROUP_LABELS = {
                RECORD_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                GLOBAL_VARIABLES: 'FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory'
            };
            it('contains "New Resource"', () => {
                const groupedCombobox = getResourceGroupedCombobox(propertyEditor);
                expect(
                    getGroupedComboboxItemBy(groupedCombobox, 'text', 'FlowBuilderExpressionUtils.newResourceLabel')
                ).toBeDefined();
            });
            it('contains a "Record Variables" group containing "accountSObjectVariable"', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceGroupedCombobox(propertyEditor);
                expect(
                    getGroupedComboboxItemInGroup(
                        groupedCombobox,
                        GROUP_LABELS.RECORD_VARIABLES,
                        'text',
                        'accountSObjectVariable'
                    )
                ).toBeDefined();
            });
            it('contains a "Global Variables" group containing $Flow, $Api, $Organization, $Profile, $System, $User', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceGroupedCombobox(propertyEditor);
                expect(
                    getGroupedComboboxItemInGroup(groupedCombobox, GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Flow')
                ).toBeDefined();
                expect(
                    getGroupedComboboxItemInGroup(groupedCombobox, GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Api')
                ).toBeDefined();
                expect(
                    getGroupedComboboxItemInGroup(
                        groupedCombobox,
                        GROUP_LABELS.GLOBAL_VARIABLES,
                        'text',
                        '$Organization'
                    )
                ).toBeDefined();
                expect(
                    getGroupedComboboxItemInGroup(groupedCombobox, GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$Profile')
                ).toBeDefined();
                expect(
                    getGroupedComboboxItemInGroup(groupedCombobox, GROUP_LABELS.GLOBAL_VARIABLES, 'text', '$User')
                ).toBeDefined();
            });
            it('displays the record properties when selecting a record variable', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.renderIncrementally = false;
                await ticks(1);

                const groupedCombobox = getResourceGroupedCombobox(propertyEditor);
                const item = getGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                groupedCombobox.dispatchEvent(selectEvent(item.value));
                await ticks();
                expect(getGroupedComboboxItemBy(groupedCombobox, 'text', 'Description')).toBeDefined();
                expect(getGroupedComboboxItemBy(groupedCombobox, 'text', 'ShippingLongitude')).toBeDefined();
            });
            it('inserts the resource in the textarea when we select a resource', async () => {
                // disable render-incrementally on combobox so groupedCombobox gets full menu data
                const comboxbox = getResourceCombobox(propertyEditor);
                comboxbox.renderIncrementally = false;
                await ticks(1);

                const textArea = getFormulaTextArea(propertyEditor);
                textArea.setSelectionRange(3, 3);
                const groupedCombobox = getResourceGroupedCombobox(propertyEditor);
                const item = getGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.RECORD_VARIABLES,
                    'text',
                    'accountSObjectVariable'
                );
                groupedCombobox.dispatchEvent(selectEvent(item.value));
                await ticks();
                const subItem = getGroupedComboboxItemBy(groupedCombobox, 'text', 'Description');
                groupedCombobox.dispatchEvent(selectEvent(subItem.value));
                await ticks();
                expect(textArea.value).toEqual(
                    'IF({!accountSObjectVariable.Description}{!accountSObjectVariable.AnnualRevenue} < 1000000,"Small", "Big")'
                );
            });
        });
    });
});
