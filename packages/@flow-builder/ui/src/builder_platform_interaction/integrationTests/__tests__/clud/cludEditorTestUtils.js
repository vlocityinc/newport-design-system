import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

export const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

export const getResourceGroupedCombobox = recordEditor => {
    return deepQuerySelector(recordEditor, [
        SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
        SELECTORS.FEROV_RESOURCE_PICKER,
        SELECTORS.BASE_RESOURCE_PICKER,
        SELECTORS.INTERACTION_COMBOBOX,
        SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);
};
