import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

export const SELECTORS = {
    ...INTERACTION_COMPONENTS_SELECTORS,
    ...LIGHTNING_COMPONENTS_SELECTORS
};

const getBaseResourcePickerCombobox = element => {
    return deepQuerySelector(element, [SELECTORS.BASE_RESOURCE_PICKER, SELECTORS.INTERACTION_COMBOBOX]);
};

export const getOutputResourcePickerCombobox = outputResourcePicker => {
    return getBaseResourcePickerCombobox(outputResourcePicker);
};

export const getResourceCombobox = recordEditor => {
    return getBaseResourcePickerCombobox(
        deepQuerySelector(recordEditor, [
            SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
            SELECTORS.FEROV_RESOURCE_PICKER
        ])
    );
};

export const getResourceGroupedCombobox = recordEditor => {
    return deepQuerySelector(getResourceCombobox(recordEditor), [SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);
};
