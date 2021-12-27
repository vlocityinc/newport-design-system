// @ts-nocheck
import actionComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.actionComboboxPlaceholder';
import actionSearchInputLabel from '@salesforce/label/FlowBuilderActionSelector.actionSearchInputLabel';
/* Labels */
import actionTypeLabel from '@salesforce/label/FlowBuilderActionSelector.actionTypeLabel';
import actionTypeOption from '@salesforce/label/FlowBuilderActionSelector.actionTypeOption';
import allInvocableActions from '@salesforce/label/FlowBuilderActionSelector.allInvocableActions';
import apexComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.apexComboboxPlaceholder';
import apexPluginComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.apexPluginComboboxPlaceholder';
import apexPluginTypeOption from '@salesforce/label/FlowBuilderActionSelector.apexPluginTypeOption';
import apexTypeOption from '@salesforce/label/FlowBuilderActionSelector.apexTypeOption';
import categoryComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.categoryComboboxPlaceholder';
import emailAlertComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.emailAlertComboboxPlaceholder';
import emailAlertTypeOption from '@salesforce/label/FlowBuilderActionSelector.emailAlertTypeOption';
import externalServiceComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.externalServiceComboboxPlaceholder';
import externalServiceTypeOption from '@salesforce/label/FlowBuilderActionSelector.externalServiceTypeOption';
import flowSearchInputLabel from '@salesforce/label/FlowBuilderActionSelector.flowSearchInputLabel';
import globalQuickActionSubTextPrefix from '@salesforce/label/FlowBuilderActionSelector.globalQuickActionSubTextPrefix';
import loading from '@salesforce/label/FlowBuilderActionSelector.loading';
import orchestratorActionComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.orchestratorActionComboboxPlaceholder';
import subflowComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.subflowComboboxPlaceholder';
import subflowTypeOption from '@salesforce/label/FlowBuilderActionSelector.subflowTypeOption';
import unCategorizedInvocableActions from '@salesforce/label/FlowBuilderActionSelector.unCategorizedInvocableActions';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

export const LABELS = {
    loading,
    actionTypeLabel,
    globalQuickActionSubTextPrefix,
    allInvocableActions,
    unCategorizedInvocableActions,
    categoryComboboxPlaceholder,
    flowSearchInputLabel,
    actionSearchInputLabel,
    orchestratorActionComboboxPlaceholder,
    [ELEMENT_TYPE.ACTION_CALL]: {
        TYPE_OPTION_LABEL: actionTypeOption,
        ACTION_COMBO_PLACEHOLDER: actionComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_PLUGIN_CALL]: {
        TYPE_OPTION_LABEL: apexPluginTypeOption,
        ACTION_COMBO_PLACEHOLDER: apexPluginComboboxPlaceholder
    },
    [ELEMENT_TYPE.APEX_CALL]: {
        TYPE_OPTION_LABEL: apexTypeOption,
        ACTION_COMBO_PLACEHOLDER: apexComboboxPlaceholder
    },
    [ELEMENT_TYPE.EMAIL_ALERT]: {
        TYPE_OPTION_LABEL: emailAlertTypeOption,
        ACTION_COMBO_PLACEHOLDER: emailAlertComboboxPlaceholder
    },
    [ELEMENT_TYPE.SUBFLOW]: {
        TYPE_OPTION_LABEL: subflowTypeOption,
        ACTION_COMBO_PLACEHOLDER: subflowComboboxPlaceholder
    },
    [ELEMENT_TYPE.EXTERNAL_SERVICE]: {
        TYPE_OPTION_LABEL: externalServiceTypeOption,
        ACTION_COMBO_PLACEHOLDER: externalServiceComboboxPlaceholder
    }
};
