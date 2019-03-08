import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

/* Labels */
import actionTypeLabel from "@salesforce/label/FlowBuilderActionSelector.actionTypeLabel";
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
import subflowTypeOption from "@salesforce/label/FlowBuilderActionSelector.subflowTypeOption";
import subflowComboboxLabel from "@salesforce/label/FlowBuilderActionSelector.subflowComboboxLabel";
import subflowComboboxPlaceholder from "@salesforce/label/FlowBuilderActionSelector.subflowComboboxPlaceholder";
import globalQuickActionSubTextPrefix from "@salesforce/label/FlowBuilderActionSelector.globalQuickActionSubTextPrefix";
import allInvocableActions from "@salesforce/label/FlowBuilderActionSelector.allInvocableActions";
import unCategorizedInvocableActions from "@salesforce/label/FlowBuilderActionSelector.unCategorizedInvocableActions";
import filterByCategoryOption from '@salesforce/label/FlowBuilderActionSelector.filterByCategoryOption';
import filterByTypeOption from '@salesforce/label/FlowBuilderActionSelector.filterByTypeOption';

export const LABELS = {
    actionTypeLabel,
    globalQuickActionSubTextPrefix,
    allInvocableActions,
    unCategorizedInvocableActions,
    filterByCategoryOption,
    filterByTypeOption,
    [ELEMENT_TYPE.ACTION_CALL] : {
        TYPE_OPTION_LABEL : actionTypeOption,
        ACTION_COMBO_LABEL : actionComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : actionComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL] : {
        TYPE_OPTION_LABEL : apexPluginTypeOption,
        ACTION_COMBO_LABEL : apexPluginComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : apexPluginComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_CALL] : {
        TYPE_OPTION_LABEL : apexTypeOption,
        ACTION_COMBO_LABEL : apexComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : apexComboboxPlaceholder
    },
    [ELEMENT_TYPE.EMAIL_ALERT] : {
        TYPE_OPTION_LABEL : emailAlertTypeOption,
        ACTION_COMBO_LABEL : emailAlertComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : emailAlertComboboxPlaceholder
    },
    [ELEMENT_TYPE.SUBFLOW] : {
        TYPE_OPTION_LABEL : subflowTypeOption,
        ACTION_COMBO_LABEL : subflowComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : subflowComboboxPlaceholder
    }
};