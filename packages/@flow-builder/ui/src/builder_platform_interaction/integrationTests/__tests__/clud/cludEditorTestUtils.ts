import {
    LIGHTNING_COMPONENTS_SELECTORS,
    INTERACTION_COMPONENTS_SELECTORS,
    deepQuerySelector
} from 'builder_platform_interaction/builderTestUtils';
import EntityResourcePicker from 'builder_platform_interaction/entityResourcePicker';
import { ComboboxTestComponent } from '../comboboxTestUtils';
import { GroupedComboboxTestComponent } from '../groupedComboboxTestUtils';

export const getBaseResourcePickerCombobox = (element) => {
    return new ComboboxTestComponent(
        deepQuerySelector(element, [
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
        ])
    );
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

export const getRadioGroups = (parentElement) =>
    parentElement.shadowRoot.querySelectorAll(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

export const getLightningRadioGroup = (editor) =>
    editor.shadowRoot.querySelector(LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_RADIO_GROUP);

export const getRecordVariablePickerChildComboboxComponent = (parentComponent) =>
    new ComboboxTestComponent(
        deepQuerySelector(parentComponent, [
            INTERACTION_COMPONENTS_SELECTORS.FEROV_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX
        ])
    );
export const getEntityResourcePickerChildGroupedComboboxComponent = (parentPickerComponent) =>
    new GroupedComboboxTestComponent(
        deepQuerySelector(parentPickerComponent, [
            INTERACTION_COMPONENTS_SELECTORS.BASE_RESOURCE_PICKER,
            INTERACTION_COMPONENTS_SELECTORS.COMBOBOX,
            LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_GROUPED_COMBOBOX
        ])
    );

export const getEntityResourcePicker = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.ENTITY_RESOURCE_PICKER) as EntityResourcePicker &
        HTMLElement;

export const getRecordStoreOption = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_STORE_OPTION);

export const getSObjectOrSObjectCollectionPicker = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.SOBJECT_OR_SOBJECT_COLLECTION_PICKER);

export const getRecordFilter = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_FILTER);

export const getRecordInputOutputAssignments = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_INPUT_OUTPUT_ASSIGNMENTS);

export const getRecordSobjectAndQueryFields = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_SOBJECT_AND_QUERY_FIELDS_COMPONENT);

export const getRecordSort = (editor) => editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_SORT);

export const getRecordQueryFields = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_QUERY_FIELDS_COMPONENT);

export const getRecordNumberRecordToStore = (editor) =>
    editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.RECORD_NUMBER_RECORD_TO_STORE);

export const removePillAndGetGroupedCombobox = async (element, extraParentSelectors: string[] = []) => {
    const combobox = getResourceCombobox(element, extraParentSelectors);
    await combobox.removePill();
    return combobox.getGroupedCombobox();
};
