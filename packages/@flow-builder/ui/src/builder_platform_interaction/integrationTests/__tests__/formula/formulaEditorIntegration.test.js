import { createElement } from 'lwc';
import FormulaEditor from 'builder_platform_interaction/formulaEditor';
import { ticks } from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { getElementByDevName } from 'builder_platform_interaction/storeUtils';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { getElementForPropertyEditor } from 'builder_platform_interaction/propertyEditorFactory';
import { updateFlow } from 'builder_platform_interaction/actions';
import {
    setGlobalVariables,
    setSystemVariables
} from 'builder_platform_interaction/systemLib';
import {
    FLOW_BUILDER_VALIDATION_ERROR_MESSAGES,
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    getLabelDescriptionNameElement,
    focusoutEvent,
    blurEvent,
    selectEvent,
    expectGroupedComboboxItem,
    expectGroupedComboboxItemInGroup,
    getGroupedComboboxItemInGroup,
    getGroupedComboboxItem,
    auraFetch
} from '../../integrationTestUtils';
import {
    setEntities,
    fetchFieldsForEntity
} from 'builder_platform_interaction/sobjectLib';
import {
    setAuraFetch,
    resetFetchOnceCache
} from 'builder_platform_interaction/serverDataLib';
import { flowWithFormula } from 'mock/flows/flowWithFormula';
import {
    globalVariableTypes,
    globalVariables,
    systemVariables
} from 'mock/systemGlobalVars';
import { mockEntities } from 'mock/serverEntityData';
import { mockAccountFields } from 'mock/serverEntityData';

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

const getDataTypePickerElement = editor => {
    return editor.shadowRoot.querySelector(SELECTORS.DATA_TYPE_PICKER);
};

const getDataTypeComboboxElement = editor => {
    return getDataTypePickerElement(editor).shadowRoot.querySelector(
        SELECTORS.LIGHTNING_COMBOBOX
    );
};

const getResourcedTextArea = editor => {
    return editor.shadowRoot.querySelector(SELECTORS.RESOURCED_TEXTAREA);
};

const getFormulaTextArea = editor => {
    return getResourcedTextArea(editor).shadowRoot.querySelector(
        SELECTORS.TEXTAREA
    );
};

const getFerovResourcePicker = editor => {
    return getResourcedTextArea(editor).shadowRoot.querySelector(
        SELECTORS.FEROV_RESOURCE_PICKER
    );
};

const getResourceGroupedCombobox = editor => {
    const baseResourcePicker = getFerovResourcePicker(
        editor
    ).shadowRoot.querySelector(SELECTORS.BASE_RESOURCE_PICKER);
    const interactionCombobox = baseResourcePicker.shadowRoot.querySelector(
        SELECTORS.INTERACTION_COMBOBOX
    );
    return interactionCombobox.shadowRoot.querySelector(
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    );
};

describe('Formula Editor', () => {
    let store;
    beforeAll(() => {
        setGlobalVariables({ globalVariableTypes, globalVariables });
        setSystemVariables(systemVariables);
        setEntities(JSON.stringify(mockEntities));
        store = Store.getStore(reducer);
        setAuraFetch(
            auraFetch({
                'c.getFieldsForEntity': () => ({
                    data: mockAccountFields
                })
            })
        );
    });
    afterAll(() => {
        // TODO : fix setEntities (currently does not reset)
        setEntities();
        setSystemVariables();
        setGlobalVariables({ globalVariableTypes: [], globalVariables: [] });
        setAuraFetch();
    });
    describe('Edit mode', () => {
        let formulaNode;
        let propertyEditor;
        beforeAll(async () => {
            const uiFlow = translateFlowToUIModel(flowWithFormula);
            store.dispatch(updateFlow(uiFlow));
            await fetchFieldsForEntity('Account');
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
                const devNameInput = getLabelDescriptionNameElement(
                    propertyEditor
                );
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(propertyEditor.node.name.value).toBe(newDevName);
            });
            it('display error if devName is cleared', async () => {
                const newDevName = '';
                const devNameInput = getLabelDescriptionNameElement(
                    propertyEditor
                );
                devNameInput.mockUserInput(newDevName);
                devNameInput.dispatchEvent(focusoutEvent);
                await ticks();
                expect(propertyEditor.node.name.error).toBe(
                    VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
        });
        describe('Data Type', () => {
            it('is set to Text', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(
                    propertyEditor
                );
                expect(dataTypeCombobox.value).toBe('String');
            });
            it('is disabled', () => {
                const dataTypeCombobox = getDataTypeComboboxElement(
                    propertyEditor
                );
                expect(dataTypeCombobox.disabled).toBe(true);
            });
        });
        describe('Formula text area', () => {
            it('contains the formula', () => {
                const textArea = getFormulaTextArea(propertyEditor);
                expect(textArea.value).toBe(
                    'IF({!accountVar.AnnualRevenue} < 1000000,"Small", "Big")'
                );
            });
            it('valides the formula on blur', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value = '';
                textArea.dispatchEvent(blurEvent);
                await ticks();
                expect(propertyEditor.node.expression.error).toBe(
                    VALIDATION_ERROR_MESSAGES.CANNOT_BE_BLANK
                );
            });
            it('displays an error if the formula contains invalid merge fields', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.value =
                    'IF({!accountVar.invalidProp} < 1000000,"Small", "Big")';
                textArea.dispatchEvent(blurEvent);
                await ticks();
                expect(propertyEditor.node.expression.error).toBe(
                    VALIDATION_ERROR_MESSAGES.UNKNOWN_RECORD_FIELD
                );
            });
        });
        describe('Resource picker', () => {
            const GROUP_LABELS = {
                RECORD_VARIABLES: 'FLOWBUILDERELEMENTCONFIG.SOBJECTPLURALLABEL',
                GLOBAL_VARIABLES:
                    'FlowBuilderSystemGlobalVariables.systemGlobalVariableCategory'
            };
            it('contains "New Resource"', () => {
                const groupedCombobox = getResourceGroupedCombobox(
                    propertyEditor
                );
                expectGroupedComboboxItem(
                    groupedCombobox,
                    'FlowBuilderExpressionUtils.newResourceLabel'
                );
            });
            it('contains a "Record Variables" group containing "accountVar"', () => {
                const groupedCombobox = getResourceGroupedCombobox(
                    propertyEditor
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.RECORD_VARIABLES,
                    'accountVar'
                );
            });
            it('contains a "Global Variables" group containing $Flow, $Api, $Organization, $Profile, $System, $User', () => {
                const groupedCombobox = getResourceGroupedCombobox(
                    propertyEditor
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$Flow'
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$Api'
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$Organization'
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$Profile'
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$System'
                );
                expectGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.GLOBAL_VARIABLES,
                    '$User'
                );
            });
            it('displays the record properties when selecting a record variable', async () => {
                const groupedCombobox = getResourceGroupedCombobox(
                    propertyEditor
                );
                const item = getGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.RECORD_VARIABLES,
                    'accountVar'
                );
                groupedCombobox.dispatchEvent(selectEvent(item.value));
                await ticks();
                expectGroupedComboboxItem(groupedCombobox, 'Description');
                expectGroupedComboboxItem(groupedCombobox, 'ShippingLongitude');
            });
            it('inserts the resource in the textarea when we select a resource', async () => {
                const textArea = getFormulaTextArea(propertyEditor);
                textArea.setSelectionRange(3, 3);
                const groupedCombobox = getResourceGroupedCombobox(
                    propertyEditor
                );
                const item = getGroupedComboboxItemInGroup(
                    groupedCombobox,
                    GROUP_LABELS.RECORD_VARIABLES,
                    'accountVar'
                );
                groupedCombobox.dispatchEvent(selectEvent(item.value));
                await ticks();
                const subItem = getGroupedComboboxItem(
                    groupedCombobox,
                    'Description'
                );
                groupedCombobox.dispatchEvent(selectEvent(subItem.value));
                await ticks();
                expect(textArea.value).toEqual(
                    'IF({!accountVar.Description}{!accountVar.AnnualRevenue} < 1000000,"Small", "Big")'
                );
            });
        });
    });
});
