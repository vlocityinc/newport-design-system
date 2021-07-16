// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/* Labels */
import actionTypeLabel from '@salesforce/label/FlowBuilderActionSelector.actionTypeLabel';
import actionTypeOption from '@salesforce/label/FlowBuilderActionSelector.actionTypeOption';
import actionComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.actionComboboxPlaceholder';
import orchestratorActionComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.orchestratorActionComboboxPlaceholder';
import apexPluginTypeOption from '@salesforce/label/FlowBuilderActionSelector.apexPluginTypeOption';
import apexPluginComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.apexPluginComboboxPlaceholder';
import apexTypeOption from '@salesforce/label/FlowBuilderActionSelector.apexTypeOption';
import apexComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.apexComboboxPlaceholder';
import emailAlertTypeOption from '@salesforce/label/FlowBuilderActionSelector.emailAlertTypeOption';
import emailAlertComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.emailAlertComboboxPlaceholder';
import subflowTypeOption from '@salesforce/label/FlowBuilderActionSelector.subflowTypeOption';
import subflowComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.subflowComboboxPlaceholder';
import globalQuickActionSubTextPrefix from '@salesforce/label/FlowBuilderActionSelector.globalQuickActionSubTextPrefix';
import allInvocableActions from '@salesforce/label/FlowBuilderActionSelector.allInvocableActions';
import unCategorizedInvocableActions from '@salesforce/label/FlowBuilderActionSelector.unCategorizedInvocableActions';
import filterByCategoryOption from '@salesforce/label/FlowBuilderActionSelector.filterByCategoryOption';
import filterByTypeOption from '@salesforce/label/FlowBuilderActionSelector.filterByTypeOption';
import externalServiceTypeOption from '@salesforce/label/FlowBuilderActionSelector.externalServiceTypeOption';
import externalServiceComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.externalServiceComboboxPlaceholder';
import loading from '@salesforce/label/FlowBuilderActionSelector.loading';
import categoryComboboxPlaceholder from '@salesforce/label/FlowBuilderActionSelector.categoryComboboxPlaceholder';
import flowSearchInputLabel from '@salesforce/label/FlowBuilderActionSelector.flowSearchInputLabel';
import actionSearchInputLabel from '@salesforce/label/FlowBuilderActionSelector.actionSearchInputLabel';

export const LABELS = {
    loading,
    actionTypeLabel,
    globalQuickActionSubTextPrefix,
    allInvocableActions,
    unCategorizedInvocableActions,
    filterByCategoryOption,
    filterByTypeOption,
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
