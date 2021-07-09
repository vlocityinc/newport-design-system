import { setEntities, clearEntityFieldsCache } from 'builder_platform_interaction/sobjectLib';
import { setAuraFetch, resetFetchOnceCache } from 'builder_platform_interaction/serverDataLib';
import { setGlobalVariables, resetSystemVariables } from 'builder_platform_interaction/systemLib';
import { setRules, setOperators } from 'builder_platform_interaction/ruleLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { reducer } from 'builder_platform_interaction/reducers';
import { resetCacheTemplates } from 'builder_platform_interaction/processTypeLib';
import {
    focusoutEvent,
    textInputEvent,
    blurEvent,
    lightningRadioGroupChangeEvent,
    ticks,
    LIGHTNING_COMPONENTS_SELECTORS
} from 'builder_platform_interaction/builderTestUtils';
import { clearExtensionsCache } from 'builder_platform_interaction/flowExtensionLib';
import { setResourceTypes } from 'builder_platform_interaction/dataTypeLib';
import { initializeAuraFetch, initializeContext } from './serverDataTestUtils';
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
import type { StoreReducer } from 'builder_platform_interaction/storeLib';
import LegalPopover from 'src/builder_platform_interaction/legalPopover/legalPopover';
import { TestComponent } from './testComponent';

export const FLOW_BUILDER_VALIDATION_ERROR_MESSAGES = {
    CANNOT_BE_BLANK: 'FlowBuilderValidation.cannotBeBlank',
    GENERIC: 'FlowBuilderCombobox.genericErrorMessage',
    MERGE_FIELD_INVALID_DATA_TYPE: 'FlowBuilderMergeFieldValidation.invalidDataType',
    MERGE_FIELD_CANNOT_BE_USED: 'FlowBuilderMergeFieldValidation.resourceCannotBeUsedAsMergeField',
    MERGE_FIELD_NOT_VALID: 'FlowBuilderMergeFieldValidation.notAValidMergeField'
};

/**
 * Translate the flow to UI model and dispatches it
 *
 * @param {*} flow the flow metadata
 * @param {*} store the store
 * @returns the flow translated to UI model
 */
export const translateFlowToUIAndDispatch = (flow, store) => {
    const uiFlow = translateFlowToUIModel(flow);
    store.dispatch(updateFlow(uiFlow));
    return uiFlow;
};

export const getChildComponent = (parentComponent, childComponentSelector) =>
    parentComponent.shadowRoot.querySelector(childComponentSelector);

export const changeComboboxValue = (combobox, newValue) => {
    combobox.dispatchEvent(textInputEvent(newValue));
    combobox.dispatchEvent(blurEvent);
};

export const changeInputValue = async (input, newValue) => {
    input.value = newValue;
    input.dispatchEvent(focusoutEvent);
    await ticks(1);
};

export const changeLightningRadioGroupValue = (lightningRadioGroup, newValue) => {
    lightningRadioGroup.dispatchEvent(lightningRadioGroupChangeEvent(newValue));
};

export const setupState = () => {
    initializeContext();
    const store = Store.getStore(reducer as StoreReducer);
    initializeAuraFetch();
    initializeLoader(store);
    loadOnStart();
    return store;
};

export const setupStateForProcessType = async (processType) => {
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

export const setupStateForFlow = async (flow) => {
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
    const store = Store.getStore(reducer as StoreReducer);
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

export class LegalPopoverTestComponent extends TestComponent<LegalPopover> {
    public getPopupElement() {
        return this.element.shadowRoot!.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_POPUP) as HTMLElement & {
            isVisible: () => boolean;
        };
    }

    private getLastHeaderElement() {
        return this.getPopupElement().querySelectorAll('h2.slds-popover_prompt__heading')[
            this.getNumberOfNoticesInPopup() - 1
        ] as HTMLElement;
    }

    public getLastNoticeHeading() {
        return this.getLastHeaderElement().textContent;
    }

    public getNumberOfNoticesInPopup() {
        return this.getPopupElement().querySelectorAll('div.popover-item').length;
    }

    public isVisible() {
        return this.getPopupElement().isVisible();
    }

    public async clickOnCloseButton() {
        const popupElement = this.getPopupElement();
        const closeButton = popupElement.querySelector(
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_BUTTON_ICON
        ) as HTMLElement;
        closeButton.click();
        await ticks();
    }

    public getFormattedUrlElement() {
        const popupElement = this.getPopupElement();
        return (
            (popupElement.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_FORMATTED_URL) as HTMLElement & {
                value: string;
                label: string;
            }) || null
        );
    }

    public getAgreementUrl() {
        return this.getFormattedUrlElement()?.value;
    }
}
