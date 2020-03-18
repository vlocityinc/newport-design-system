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
    loadApexClasses,
    loadFieldsForComplexTypesInFlow
} from 'builder_platform_interaction/preloadLib';
import { setApexClasses } from 'builder_platform_interaction/apexTypeLib';
import { translateFlowToUIModel } from 'builder_platform_interaction/translatorLib';
import { updateFlow } from 'builder_platform_interaction/actions';

export const FLOW_BUILDER_VALIDATION_ERROR_MESSAGES = {
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage'
};

/**
 * Translate the flow to UI model and dispatches it twice due to changes to editor.js made as part of W-7281973
 * @param {*} flow the flow metadata
 * @param {*} store the store
 * @returns the flow translated to UI model
 */
export const translateFlowToUIAndDispatch = (flow, store) => {
    let uiFlow = translateFlowToUIModel(flow);
    store.dispatch(updateFlow(uiFlow));
    uiFlow = translateFlowToUIModel(flow);
    store.dispatch(updateFlow(uiFlow));
    return uiFlow;
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

export const setupState = () => {
    const store = Store.getStore(reducer);
    initializeAuraFetch();
    initializeLoader(store);
    loadOnStart();
    return store;
};

export const setupStateForProcessType = async processType => {
    const store = setupState();
    await loadOnProcessTypeChange(processType).loadPeripheralMetadataPromise;
    await loadApexClasses();
    return store;
};

export const loadFlow = async (flow, store) => {
    await loadOnProcessTypeChange(flow.processType).loadPeripheralMetadataPromise;
    const uiFlow = translateFlowToUIModel(flow);
    store.dispatch(updateFlow(uiFlow));
    await loadFieldsForComplexTypesInFlow(uiFlow);
};

export const setupStateForFlow = async flow => {
    const store = await setupState();
    await loadFlow(flow, store);
    await loadApexClasses();
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
