import comboBoxLabel from '@salesforce/label/FlowBuilderFieldInputBox.comboboxLabel';
import placeholderText from '@salesforce/label/FlowBuilderFieldInputBox.placeholderText';
import searchAltText from '@salesforce/label/FlowBuilderFieldInputBox.searchAltText';

export const labelsMap = {
    comboBoxLabel,
    placeholderText,
    searchAltText
};

export const LABELS: Labels<typeof labelsMap> = labelsMap;
