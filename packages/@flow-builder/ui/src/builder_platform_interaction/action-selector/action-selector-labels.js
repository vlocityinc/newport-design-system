import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

/* Labels */
import retrieveInvocableActionsError from '@label/FlowBuilderActionCallEditor.retrieveInvocableActionsError';
import retrieveApexPluginsError from '@label/FlowBuilderActionCallEditor.retrievApexPluginsError';
import retrieveSubflowsError from '@label/FlowBuilderActionCallEditor.retrieveSubflowsError';
import actionTypeOption from '@label/FlowBuilderActionCallEditor.actionTypeOption';
import actionComboboxLabel from '@label/FlowBuilderActionCallEditor.actionComboboxLabel';
import actionComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.actionComboboxPlaceholder';
import apexPluginTypeOption from '@label/FlowBuilderActionCallEditor.apexPluginTypeOption';
import apexPluginComboboxLabel from '@label/FlowBuilderActionCallEditor.apexPluginComboboxLabel';
import apexPluginComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.apexPluginComboboxPlaceholder';
import apexTypeOption from '@label/FlowBuilderActionCallEditor.apexTypeOption';
import apexComboboxLabel from '@label/FlowBuilderActionCallEditor.apexComboboxLabel';
import apexComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.apexComboboxPlaceholder';
import emailAlertTypeOption from '@label/FlowBuilderActionCallEditor.emailAlertTypeOption';
import emailAlertComboboxLabel from '@label/FlowBuilderActionCallEditor.emailAlertComboboxLabel';
import emailAlertComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.emailAlertComboboxPlaceholder';
import localActionTypeOption from '@label/FlowBuilderActionCallEditor.localActionTypeOption';
import localActionComboboxLabel from '@label/FlowBuilderActionCallEditor.localActionComboboxLabel';
import localActionComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.localActionComboboxPlaceholder';
import subflowTypeOption from '@label/FlowBuilderActionCallEditor.subflowTypeOption';
import subflowComboboxLabel from '@label/FlowBuilderActionCallEditor.subflowComboboxLabel';
import subflowComboboxPlaceholder from '@label/FlowBuilderActionCallEditor.subflowComboboxPlaceholder';

export const LABELS = {
    CANNOT_GET_INVOCABLE_ACTIONS: retrieveInvocableActionsError,
    CANNOT_GET_APEX_PLUGINS: retrieveApexPluginsError,
    CANNOT_GET_SUBFLOWS: retrieveSubflowsError,
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
    [ELEMENT_TYPE.LOCAL_ACTION_CALL] : {
        TYPE_OPTION_LABEL : localActionTypeOption,
        ACTION_COMBO_LABEL : localActionComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : localActionComboboxPlaceholder
    },
    [ELEMENT_TYPE.SUBFLOW] : {
        TYPE_OPTION_LABEL : subflowTypeOption,
        ACTION_COMBO_LABEL : subflowComboboxLabel,
        ACTION_COMBO_PLACEHOLDER : subflowComboboxPlaceholder
    }
};