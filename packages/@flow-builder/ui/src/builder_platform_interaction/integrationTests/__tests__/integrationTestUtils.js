import { setEntities, clearEntityFieldsCache } from 'builder_platform_interaction/sobjectLib';
import { setAuraFetch, resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { setGlobalVariables, resetSystemVariables } from 'builder_platform_interaction/systemLib';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    focusoutEvent,
    textInputEvent,
    blurEvent
} from 'builder_platform_interaction/builderTestUtils';
import { clearExtensionsCache } from 'builder_platform_interaction/flowExtensionLib';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import { initializeAuraFetch } from './serverDataTestUtils';
import {
    initializeLoader,
    loadOnStart,
    loadOnProcessTypeChange,
    clearLoader,
    loadApexClasses
} from 'builder_platform_interaction/preloadLib';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';
import { loadFieldsForComplexTypesInFlow } from 'builder_platform_interaction/preloadLib';

export const FLOW_BUILDER_VALIDATION_ERROR_MESSAGES = {
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage'
};

export const expectGroupedComboboxItem = (groupedCombobox, itemText) => {
    expect(groupedCombobox.items).toEqual(expect.arrayContaining([expect.objectContaining({ text: itemText })]));
};
export const expectGroupedComboboxItemInGroup = (groupedCombobox, groupLabel, value, property = 'text') => {
    expect(groupedCombobox.items).toEqual(
        expect.arrayContaining([
            expect.objectContaining({
                label: groupLabel,
                items: expect.arrayContaining([expect.objectContaining({ [property]: value })])
            })
        ])
    );
};
export const getGroupedComboboxItemInGroup = (groupedCombobox, groupLabel, itemText) => {
    for (const item of groupedCombobox.items) {
        if (item.label === groupLabel && item.items) {
            for (const subItem of item.items) {
                if (subItem.text === itemText) {
                    return subItem;
                }
            }
        }
    }
    return undefined;
};

export const getGroupedComboboxItemInGroupByDisplayText = (groupedCombobox, groupLabel, displayText) => {
    for (const item of groupedCombobox.items) {
        if (item.label === groupLabel && item.items) {
            for (const subItem of item.items) {
                if (subItem.displayText === displayText) {
                    return subItem;
                }
            }
        }
    }
    return undefined;
};

export const getGroupedComboboxItem = (groupedCombobox, itemText) => {
    for (const item of groupedCombobox.items) {
        if (item.text === itemText) {
            return item;
        }
    }
    return undefined;
};

export const getFieldToFerovExpressionBuilders = parentElement => {
    return parentElement.shadowRoot.querySelectorAll(
        INTERACTION_COMPONENTS_SELECTORS.FIELD_TO_FEROV_EXPRESSION_BUILDER
    );
};

export const getBaseExpressionBuilder = parentElement => {
    return parentElement.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.BASE_EXPRESSION_BUILDER);
};

export const getEntityResourcePicker = editor => {
    return editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);
};

export const getRadioGroup = parentElement => {
    return parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);
};

export const getChildComponent = (parentComponent, childComponentSelector) => {
    return parentComponent.shadowRoot.querySelector(childComponentSelector);
};

export const getRecordVariablePickerChildGroupedComboboxComponent = parentPickerComponent => {
    return deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.INTERACTION_COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

export const getEntityResourcePickerChildGroupedComboboxComponent = parentPickerComponent => {
    return deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};

export const changeComboboxValue = (combobox, newValue) => {
    combobox.dispatchEvent(textInputEvent(newValue));
    combobox.dispatchEvent(blurEvent);
};

export const changeInputValue = (input, newValue) => {
    input.value = newValue;
    input.dispatchEvent(focusoutEvent);
};

export const newFilterItem = (lhsValue = '', operatorValue = '', rhsValue = '', rhsDataType = '') => ({
    leftHandSide: {
        value: lhsValue,
        error: null
    },
    rightHandSide: {
        value: rhsValue,
        error: null
    },
    rightHandSideDataType: {
        value: rhsDataType,
        error: null
    },
    operator: {
        value: operatorValue,
        error: null
    }
});

export const setupStateForProcessType = async processType => {
    const store = Store.getStore(reducer);
    initializeAuraFetch();
    initializeLoader(store);
    loadOnStart();
    await loadOnProcessTypeChange(processType);
    await loadApexClasses();
    return store;
};

export const setupStateForFlow = async flow => {
    const store = await setupStateForProcessType(flow.processType);
    const uiFlow = translateFlowToUIModel(flow);
    store.dispatch(updateFlow(uiFlow));
    await loadFieldsForComplexTypesInFlow(uiFlow);
    return store;
};

/**
 * Reset the state (to be called in afterAll)
 */
export const resetState = () => {
    setEntities();
    clearEntityFieldsCache();
    setGlobalVariables({ globalVariableTypes: [], globalVariables: [] });
    setAuraFetch();
    resetFetchOnceCache();
    const store = Store.getStore(reducer);
    store.dispatch({ type: 'INIT' });
    setRules();
    setOperators();
    setResourceTypes();
    resetCacheTemplates();
    clearExtensionsCache();
    resetSystemVariables();
    setApexClasses(null);
    clearLoader();
};

export class ToggleOnChangeEvent extends CustomEvent {
    constructor() {
        super('change', { detail: { checked: true } });
    }
}
