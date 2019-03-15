import newActionPropertyEditorTitle from "@salesforce/label/FlowBuilderCalloutEditor.newActionPropertyEditorTitle";
import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

import filterByTitle from '@salesforce/label/FlowBuilderActionSelector.filterByTitle';
import filterByCategoryOption from '@salesforce/label/FlowBuilderActionSelector.filterByCategoryOption';
import filterByTypeOption from '@salesforce/label/FlowBuilderActionSelector.filterByTypeOption';
import actionTypeOption from "@salesforce/label/FlowBuilderActionSelector.actionTypeOption";
import actionComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.actionComboboxLabel";
import actionComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.actionComboboxPlaceholder";
import apexPluginTypeOption from "@salesforce/label/FlowBuilderActionSelector.apexPluginTypeOption";
import apexPluginComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.apexPluginComboboxLabel";
import apexPluginComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.apexPluginComboboxPlaceholder";
import apexTypeOption from "@salesforce/label/FlowBuilderActionSelector.apexTypeOption";
import apexComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.apexComboboxLabel";
import apexComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.apexComboboxPlaceholder";
import emailAlertTypeOption from "@salesforce/label/FlowBuilderActionSelector.emailAlertTypeOption";
import emailAlertComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.emailAlertComboboxLabel";
import emailAlertComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.emailAlertComboboxPlaceholder";
import allInvocableActions from "@salesforce/label/FlowBuilderActionSelector.allInvocableActions";
import unCategorizedInvocableActions from "@salesforce/label/FlowBuilderActionSelector.unCategorizedInvocableActions";
import externalServiceTypeOption from "@salesforce/label/FlowBuilderActionSelector.externalServiceTypeOption";
import externalServiceComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.externalServiceComboboxLabel";
import externalServiceComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.externalServiceComboboxPlaceholder";

export const LABELS = {
    filterByTitle,
    filterByCategoryOption,
    filterByTypeOption,
    newActionPropertyEditorTitle,
    allInvocableActions,
    unCategorizedInvocableActions,
    [ELEMENT_TYPE.ACTION_CALL]: {
        TYPE_OPTION_LABEL: actionTypeOption,
        ACTION_COMBO_LABEL: actionComboboxLabel,
        ACTION_COMBO_PLACEHOLDER: actionComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        TYPE_OPTION_LABEL: apexPluginTypeOption,
        ACTION_COMBO_LABEL: apexPluginComboboxLabel,
        ACTION_COMBO_PLACEHOLDER: apexPluginComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        TYPE_OPTION_LABEL: apexTypeOption,
        ACTION_COMBO_LABEL: apexComboboxLabel,
        ACTION_COMBO_PLACEHOLDER: apexComboboxPlaceholder
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        TYPE_OPTION_LABEL: emailAlertTypeOption,
        ACTION_COMBO_LABEL: emailAlertComboboxLabel,
        ACTION_COMBO_PLACEHOLDER: emailAlertComboboxPlaceholder
    },
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: {
        TYPE_OPTION_LABEL: externalServiceTypeOption,
        ACTION_COMBO_LABEL: externalServiceComboboxLabel,
        ACTION_COMBO_PLACEHOLDER: externalServiceComboboxPlaceholder
    }
};