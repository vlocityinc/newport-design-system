import { LIGHTNING_COMPONENTS_SELECTORS, INTERACTION_COMPONENTS_SELECTORS } from './builderTestUtils';

export const getUseAdvancedOptionComponent = (parentElement) => {
    return parentElement.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.USE_ADVANCED_OPTIONS_CHECKBOX);
};

export const getAdvancedOptionCheckbox = (parentElement) => {
    const useAdvancedOptionComponent = getUseAdvancedOptionComponent(parentElement);
    return useAdvancedOptionComponent.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
};
