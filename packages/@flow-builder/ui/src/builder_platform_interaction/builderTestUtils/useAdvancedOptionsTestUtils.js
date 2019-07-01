const SELECTORS = {
    useAdvancedOptionsCheckboxComponent:
        'builder_platform_interaction-use-advanced-options-checkbox',
    lightningInput: 'lightning-input'
};

export const getUseAdvancedOptionComponent = parentElement => {
    return parentElement.shadowRoot.querySelector(
        SELECTORS.useAdvancedOptionsCheckboxComponent
    );
};

export const getAdvancedOptionCheckbox = parentElement => {
    const useAdvancedOptionComponent = getUseAdvancedOptionComponent(
        parentElement
    );
    return useAdvancedOptionComponent.shadowRoot.querySelector(
        SELECTORS.lightningInput
    );
};
