import { ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

/* Labels */
import actionTypeLabel from "@salesforce/label/FlowBuilderActionCallEditor.actionTypeLabel";
import actionTypeOption from "@salesforce/label/FlowBuilderActionCallEditor.actionTypeOption";
import actionComboboxLabel from "@salesforce/label/FlowBuilderActionCallEditor.actionComboboxLabel";
import actionComboboxPlaceholder from "@salesforce/label/FlowBuilderActionCallEditor.actionComboboxPlaceholder";
import apexPluginTypeOption from "@salesforce/label/FlowBuilderActionCallEditor.apexPluginTypeOption";
import apexPluginComboboxLabel from "@salesforce/label/FlowBuilderActionCallEditor.apexPluginComboboxLabel";
import apexPluginComboboxPlaceholder from "@salesforce/label/FlowBuilderActionCallEditor.apexPluginComboboxPlaceholder";
import apexTypeOption from "@salesforce/label/FlowBuilderActionCallEditor.apexTypeOption";
import apexComboboxLabel from "@salesforce/label/FlowBuilderActionCallEditor.apexComboboxLabel";
import apexComboboxPlaceholder from "@salesforce/label/FlowBuilderActionCallEditor.apexComboboxPlaceholder";
import emailAlertTypeOption from "@salesforce/label/FlowBuilderActionCallEditor.emailAlertTypeOption";
import emailAlertComboboxLabel from "@salesforce/label/FlowBuilderActionCallEditor.emailAlertComboboxLabel";
import emailAlertComboboxPlaceholder from "@salesforce/label/FlowBuilderActionCallEditor.emailAlertComboboxPlaceholder";
import subflowTypeOption from "@salesforce/label/FlowBuilderActionCallEditor.subflowTypeOption";
import subflowComboboxLabel from "@salesforce/label/FlowBuilderActionCallEditor.subflowComboboxLabel";
import subflowComboboxPlaceholder from "@salesforce/label/FlowBuilderActionCallEditor.subflowComboboxPlaceholder";
import globalQuickActionSubTextPrefix from "@salesforce/label/FlowBuilderActionCallEditor.globalQuickActionSubTextPrefix";

export const LABELS = {
    actionTypeLabel,
    globalQuickActionSubTextPrefix,
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