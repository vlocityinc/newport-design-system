import { INTERACTION_COMPONENTS_SELECTORS, LIGHTNING_COMPONENTS_SELECTORS } from './builderTestUtils';

export const getManuallyAssignVariablesCheckbox = (parentElement) => {
    return parentElement.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.MANUALLY_ASSIGN_VARIABLES_CHECKBOX);
};

export const getManuallyAssignVariablesCheckboxInputElement = (parentElement) => {
    const component = getManuallyAssignVariablesCheckbox(parentElement);
    return component.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_INPUT);
};
