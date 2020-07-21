import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';

const getBaseResourcePickerCombobox = element => {
    return deepQuerySelector(element, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    ]);
};

export const getOutputResourcePickerCombobox = outputResourcePicker =>
    getBaseResourcePickerCombobox(outputResourcePicker);

export const getResourceCombobox = recordEditor =>
    getBaseResourcePickerCombobox(
        deepQuerySelector(recordEditor, [
            INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER
        ])
    );

export const getResourceGroupedCombobox = recordEditor =>
    deepQuerySelector(getResourceCombobox(recordEditor), [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);

export const getRadioGroups = parentElement =>
    parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

export const getRecordVariablePickerChildGroupedComboboxComponent = parentPickerComponent =>
    deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePickerChildGroupedComboboxComponent = parentPickerComponent =>
    deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePicker = editor =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

export const getRecordStoreOption = editor =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);
