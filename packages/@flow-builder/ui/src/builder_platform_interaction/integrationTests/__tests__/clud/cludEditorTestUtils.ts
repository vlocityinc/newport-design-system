import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector,
    removePill
} from 'builder_platform_interaction/builderTestUtils';

export const getBaseResourcePickerCombobox = (element) => {
    return deepQuerySelector(element, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    ]);
};

export const getOutputResourcePicker = (recordEditor) =>
    recordEditor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.OUTPUT_RESOURCE_PICKER);

export const getOutputBaseResourcePickerCombobox = (recordEditor) =>
    getBaseResourcePickerCombobox(getOutputResourcePicker(recordEditor));

export const getResourceCombobox = (recordEditor, extraParentSelectors: string[] = []) =>
    getBaseResourcePickerCombobox(
        deepQuerySelector(recordEditor, [
            ...extraParentSelectors,
            INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER
        ])
    );

export const getResourceGroupedCombobox = (recordEditor) =>
    deepQuerySelector(getResourceCombobox(recordEditor), [LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX]);

export const getRadioGroups = (parentElement) =>
    parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

export const getRecordVariablePickerChildComboboxComponent = (parentComponent) =>
    deepQuerySelector(parentComponent, [
        INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
    ]);

export const getRecordVariablePickerChildGroupedComboboxComponent = (parentPickerComponent) =>
    deepQuerySelector(getRecordVariablePickerChildComboboxComponent(parentPickerComponent), [
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePickerChildGroupedComboboxComponent = (parentPickerComponent) =>
    deepQuerySelector(parentPickerComponent, [
        INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
        INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
        LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
    ]);

export const getEntityResourcePicker = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER);

export const getRecordStoreOption = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);

export const getSObjectOrSObjectCollectionPicker = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);

export const getRecordFilter = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

export const getRecordInputOutputAssignments = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);

export const removePillAndGetSObjectOrSObjectCollectionPickerGroupedCombobox = async (element) => {
    const combobox = getResourceCombobox(element);
    await removePill(combobox);
    return getResourceGroupedCombobox(element);
};
