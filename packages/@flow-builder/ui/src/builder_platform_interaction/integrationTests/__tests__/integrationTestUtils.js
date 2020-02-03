import { setEntities, clearEntityFieldsCache } from 'builder_platform_interaction/sobjectLib';
import { setAuraFetch, resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { setGlobalVariables, resetSystemVariables } from 'builder_platform_interaction/systemLib';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import { focusoutEvent, textInputEvent, blurEvent } from 'builder_platform_interaction/builderTestUtils';
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

export const getChildComponent = (parentComponent, childComponentSelector) => {
    return parentComponent.shadowRoot.querySelector(childComponentSelector);
};

export const changeComboboxValue = (combobox, newValue) => {
    combobox.dispatchEvent(textInputEvent(newValue));
    combobox.dispatchEvent(blurEvent);
};

export const changeInputValue = (input, newValue) => {
    input.value = newValue;
    input.dispatchEvent(focusoutEvent);
};

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
