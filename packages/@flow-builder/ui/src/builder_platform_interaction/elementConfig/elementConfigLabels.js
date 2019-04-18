/* Labels */
import subflowSingularLabel from "@salesforce/label/FlowBuilderElementConfig.subflowSingularLabel";
import subflowPluralLabel from "@salesforce/label/FlowBuilderElementConfig.subflowPluralLabel";
import actionSingularLabel from "@salesforce/label/FlowBuilderElementConfig.actionSingularLabel";
import actionPluralLabel from "@salesforce/label/FlowBuilderElementConfig.actionPluralLabel";
import apexPluginSingularLabel from "@salesforce/label/FlowBuilderElementConfig.apexPluginSingularLabel";
import apexPluginPluralLabel from "@salesforce/label/FlowBuilderElementConfig.apexPluginPluralLabel";
import apexSingularLabel from "@salesforce/label/FlowBuilderElementConfig.apexSingularLabel";
import apexPluralLabel from "@salesforce/label/FlowBuilderElementConfig.apexPluralLabel";
import emailAlertSingularLabel from "@salesforce/label/FlowBuilderElementConfig.emailAlertSingularLabel";
import emailAlertPluralLabel from "@salesforce/label/FlowBuilderElementConfig.emailAlertPluralLabel";
import assignmentSingularLabel from "@salesforce/label/FlowBuilderElementConfig.assignmentSingularLabel";
import assignmentPluralLabel from "@salesforce/label/FlowBuilderElementConfig.assignmentPluralLabel";
import screenSingularLabel from "@salesforce/label/FlowBuilderElementConfig.screenSingularLabel";
import screenPluralLabel from "@salesforce/label/FlowBuilderElementConfig.screenPluralLabel";
import decisionSingularLabel from "@salesforce/label/FlowBuilderElementConfig.decisionSingularLabel";
import decisionPluralLabel from "@salesforce/label/FlowBuilderElementConfig.decisionPluralLabel";
import decisionConnectorPickerHeaderSuffix from "@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerHeaderSuffix";
import decisionConnectorPickerBodyText from "@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerBodyText";
import decisionConnectorPickerComboBoxLabel from "@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerComboBoxLabel";
import waitSingularLabel from "@salesforce/label/FlowBuilderElementConfig.waitSingularLabel";
import waitPluralLabel from "@salesforce/label/FlowBuilderElementConfig.waitPluralLabel";
import waitEventSingularLabel from "@salesforce/label/FlowBuilderElementConfig.waitEventSingularLabel";
import waitEventPluralLabel from "@salesforce/label/FlowBuilderElementConfig.waitEventPluralLabel";
import waitConnectorPickerHeaderSuffix from "@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerHeaderSuffix";
import waitConnectorPickerBodyText from "@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerBodyText";
import waitConnectorPickerComboBoxLabel from "@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerComboBoxLabel";
import loopSingularLabel from "@salesforce/label/FlowBuilderElementConfig.loopSingularLabel";
import loopPluralLabel from "@salesforce/label/FlowBuilderElementConfig.loopPluralLabel";
import loopConnectorPickerHeaderSuffix from "@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerHeaderSuffix";
import loopConnectorPickerBodyText from "@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerBodyText";
import loopConnectorPickerComboBoxLabel from "@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerComboBoxLabel";
import recordCreateSingularLabel from "@salesforce/label/FlowBuilderElementConfig.recordCreateSingularLabel";
import recordCreatePluralLabel from "@salesforce/label/FlowBuilderElementConfig.recordCreatePluralLabel";
import recordLookupSingularLabel from "@salesforce/label/FlowBuilderElementConfig.recordLookupSingularLabel";
import recordLookupPluralLabel from "@salesforce/label/FlowBuilderElementConfig.recordLookupPluralLabel";
import recordDeleteSingularLabel from "@salesforce/label/FlowBuilderElementConfig.recordDeleteSingularLabel";
import recordDeletePluralLabel from "@salesforce/label/FlowBuilderElementConfig.recordDeletePluralLabel";
import recordUpdateSingularLabel from "@salesforce/label/FlowBuilderElementConfig.recordUpdateSingularLabel";
import recordUpdatePluralLabel from "@salesforce/label/FlowBuilderElementConfig.recordUpdatePluralLabel";
import variableSingularLabel from "@salesforce/label/FlowBuilderElementConfig.variableSingularLabel";
import variablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.variablePluralLabel";
import constantSingularLabel from "@salesforce/label/FlowBuilderElementConfig.constantSingularLabel";
import constantPluralLabel from "@salesforce/label/FlowBuilderElementConfig.constantPluralLabel";
import textTemplateSingularLabel from "@salesforce/label/FlowBuilderElementConfig.textTemplateSingularLabel";
import textTemplatePluralLabel from "@salesforce/label/FlowBuilderElementConfig.textTemplatePluralLabel";
import formulaSingularLabel from "@salesforce/label/FlowBuilderElementConfig.formulaSingularLabel";
import formulaPluralLabel from "@salesforce/label/FlowBuilderElementConfig.formulaPluralLabel";
import outcomeSingularLabel from "@salesforce/label/FlowBuilderElementConfig.outcomeSingularLabel";
import outcomePluralLabel from "@salesforce/label/FlowBuilderElementConfig.outcomePluralLabel";
import flowPropertiesSingularLabel from "@salesforce/label/FlowBuilderElementConfig.flowPropertiesSingularLabel";
import stageSingularLabel from "@salesforce/label/FlowBuilderElementConfig.stageSingularLabel";
import stagePluralLabel from "@salesforce/label/FlowBuilderElementConfig.stagePluralLabel";
import emptyDefaultOutcomeLabel from "@salesforce/label/FlowBuilderDecisionEditor.emptyDefaultOutcomeLabel";
import emptyDefaultWaitPathLabel from '@salesforce/label/FlowBuilderWaitEditor.emptyDefaultWaitPathLabel';
import sObjectVariablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.sObjectVariablePluralLabel";
import sObjectCollectionVariablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.sObjectCollectionVariablePluralLabel";
import apexVariablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.apexVariablePluralLabel";
import apexCollectionVariablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.apexCollectionVariablePluralLabel";
import collectionVariablePluralLabel from "@salesforce/label/FlowBuilderElementConfig.collectionVariablePluralLabel";
import choiceSingularLabel from "@salesforce/label/FlowBuilderElementConfig.choiceSingularLabel";
import choicePluralLabel from "@salesforce/label/FlowBuilderElementConfig.choicePluralLabel";
import stepSingularLabel from "@salesforce/label/FlowBuilderElementConfig.stepSingularLabel";
import stepPluralLabel from "@salesforce/label/FlowBuilderElementConfig.stepPluralLabel";
import recordChoiceSetSingularLabel from "@salesforce/label/FlowBuilderElementConfig.recordChoiceSetSingularLabel";
import recordChoiceSetPluralLabel from "@salesforce/label/FlowBuilderElementConfig.recordChoiceSetPluralLabel";
import picklistChoiceSetSingularLabel from "@salesforce/label/FlowBuilderElementConfig.picklistChoiceSetSingularLabel";
import picklistChoiceSetPluralLabel from "@salesforce/label/FlowBuilderElementConfig.picklistChoiceSetPluralLabel";
import screenFieldSingularLabel from "@salesforce/label/FlowBuilderElementConfig.screenFieldSingularLabel";
import screenFieldPluralLabel from "@salesforce/label/FlowBuilderElementConfig.screenFieldPluralLabel";
import flowInteractionComponentsLabel from "@salesforce/label/FlowBuilderLeftPanelElements.flowInteractionComponentsLabel";
import flowControlLogicLabel from "@salesforce/label/FlowBuilderLeftPanelElements.flowControlLogicLabel";
import flowControlDataOperationsLabel from "@salesforce/label/FlowBuilderLeftPanelElements.flowControlDataOperationsLabel";
import flowControlFlowComponentsLabel from "@salesforce/label/FlowBuilderLeftPanelElements.flowControlFlowComponentsLabel";
import screenComponentLabel from "@salesforce/label/FlowBuilderLeftPanelElements.screenComponentLabel";
import assignmentLogicLabel from "@salesforce/label/FlowBuilderLeftPanelElements.assignmentLogicLabel";
import decisionLogicLabel from "@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicLabel";
import waitLogicLabel from "@salesforce/label/FlowBuilderLeftPanelElements.waitLogicLabel";
import loopLogicLabel from "@salesforce/label/FlowBuilderLeftPanelElements.loopLogicLabel";
import createDataOperationLabel from "@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationLabel";
import updateDataOperationLabel from "@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationLabel";
import lookupDataOperationLabel from "@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationLabel";
import deleteDataOperationLabel from "@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationLabel";
import actionFlowComponentLabel from "@salesforce/label/FlowBuilderLeftPanelElements.actionFlowComponentLabel";
import subflowFlowComponentLabel from "@salesforce/label/FlowBuilderLeftPanelElements.subflowFlowComponentLabel";
import decisionLogicDescription from "@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicDescription";
import waitLogicDescription from "@salesforce/label/FlowBuilderLeftPanelElements.waitLogicDescription";
import assignmentLogicDescription from "@salesforce/label/FlowBuilderLeftPanelElements.assignmentLogicDescription";
import loopLogicDescription from "@salesforce/label/FlowBuilderLeftPanelElements.loopLogicDescription";
import createDataOperationDescription from "@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationDescription";
import updateDataOperationDescription from "@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationDescription";
import lookupDataOperationDescription from "@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationDescription";
import deleteDataOperationDescription from "@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationDescription";
import actionFlowComponentDescription from "@salesforce/label/FlowBuilderLeftPanelElements.actionFlowComponentDescription";
import subflowFlowComponentDescription from "@salesforce/label/FlowBuilderLeftPanelElements.subflowFlowComponentDescription";
import screenComponentDescription from "@salesforce/label/FlowBuilderLeftPanelElements.screenComponentDescription";
import resourceTypeLabel from "@salesforce/label/FlowBuilderNewResource.resourceTypeLabel";
import resourceTypePlaceholderLabel from "@salesforce/label/FlowBuilderNewResource.resourceTypePlaceholderLabel";
import variableLabel from "@salesforce/label/FlowBuilderNewResource.variableLabel";
import variableDesc from "@salesforce/label/FlowBuilderNewResource.variableDesc";
import constantLabel from "@salesforce/label/FlowBuilderNewResource.constantLabel";
import constantDesc from "@salesforce/label/FlowBuilderNewResource.constantDesc";
import formulaLabel from "@salesforce/label/FlowBuilderNewResource.formulaLabel";
import formulaDesc from "@salesforce/label/FlowBuilderNewResource.formulaDesc";
import textTemplateLabel from "@salesforce/label/FlowBuilderNewResource.textTemplateLabel";
import textTemplateDesc from "@salesforce/label/FlowBuilderNewResource.textTemplateDesc";
import choiceLabel from "@salesforce/label/FlowBuilderNewResource.choiceLabel";
import choiceDesc from "@salesforce/label/FlowBuilderNewResource.choiceDesc";
import dynamicRecordChoiceLabel from "@salesforce/label/FlowBuilderNewResource.dynamicRecordChoiceLabel";
import dynamicRecordChoiceDesc from "@salesforce/label/FlowBuilderNewResource.dynamicRecordChoiceDesc";
import picklistChoiceLabel from "@salesforce/label/FlowBuilderNewResource.picklistChoiceLabel";
import picklistChoiceDesc from "@salesforce/label/FlowBuilderNewResource.picklistChoiceDesc";
import stageLabel from "@salesforce/label/FlowBuilderNewResource.stageLabel";
import stageDesc from "@salesforce/label/FlowBuilderNewResource.stageDesc";

export const LABELS = {
    subflowSingularLabel,
    subflowPluralLabel,
    actionSingularLabel,
    actionPluralLabel,
    apexPluginSingularLabel,
    apexPluginPluralLabel,
    apexSingularLabel,
    apexPluralLabel,
    emailAlertSingularLabel,
    emailAlertPluralLabel,
    assignmentSingularLabel,
    assignmentPluralLabel,
    screenSingularLabel,
    screenPluralLabel,
    decisionSingularLabel,
    decisionPluralLabel,
    decisionConnectorPickerHeaderSuffix,
    decisionConnectorPickerBodyText,
    decisionConnectorPickerComboBoxLabel,
    waitSingularLabel,
    waitPluralLabel,
    waitEventSingularLabel,
    waitEventPluralLabel,
    waitConnectorPickerHeaderSuffix,
    waitConnectorPickerBodyText,
    waitConnectorPickerComboBoxLabel,
    loopSingularLabel,
    loopPluralLabel,
    loopConnectorPickerHeaderSuffix,
    loopConnectorPickerBodyText,
    loopConnectorPickerComboBoxLabel,
    recordCreateSingularLabel,
    recordCreatePluralLabel,
    recordLookupSingularLabel,
    recordLookupPluralLabel,
    recordDeleteSingularLabel,
    recordDeletePluralLabel,
    recordUpdateSingularLabel,
    recordUpdatePluralLabel,
    variableSingularLabel,
    variablePluralLabel,
    constantSingularLabel,
    constantPluralLabel,
    textTemplateSingularLabel,
    textTemplatePluralLabel,
    formulaSingularLabel,
    formulaPluralLabel,
    outcomeSingularLabel,
    outcomePluralLabel,
    flowPropertiesSingularLabel,
    stageSingularLabel,
    stagePluralLabel,
    emptyDefaultOutcomeLabel,
    emptyDefaultWaitPathLabel,
    sObjectVariablePluralLabel,
    sObjectCollectionVariablePluralLabel,
    apexVariablePluralLabel,
    apexCollectionVariablePluralLabel,
    collectionVariablePluralLabel,
    choiceSingularLabel,
    choicePluralLabel,
    stepSingularLabel,
    stepPluralLabel,
    recordChoiceSetSingularLabel,
    recordChoiceSetPluralLabel,
    picklistChoiceSetSingularLabel,
    picklistChoiceSetPluralLabel,
    screenFieldSingularLabel,
    screenFieldPluralLabel,
    flowControlLogicLabel,
    flowControlDataOperationsLabel,
    flowControlFlowComponentsLabel,
    flowInteractionComponentsLabel,
    screenComponentLabel,
    assignmentLogicLabel,
    decisionLogicLabel,
    waitLogicLabel,
    loopLogicLabel,
    createDataOperationLabel,
    updateDataOperationLabel,
    lookupDataOperationLabel,
    deleteDataOperationLabel,
    actionFlowComponentLabel,
    subflowFlowComponentLabel,
    decisionLogicDescription,
    waitLogicDescription,
    assignmentLogicDescription,
    loopLogicDescription,
    createDataOperationDescription,
    updateDataOperationDescription,
    lookupDataOperationDescription,
    deleteDataOperationDescription,
    actionFlowComponentDescription,
    subflowFlowComponentDescription,
    screenComponentDescription,
    resourceTypeLabel,
    resourceTypePlaceholderLabel,
    variableLabel,
    variableDesc,
    constantLabel,
    constantDesc,
    formulaLabel,
    formulaDesc,
    textTemplateLabel,
    textTemplateDesc,
    choiceLabel,
    choiceDesc,
    dynamicRecordChoiceLabel,
    dynamicRecordChoiceDesc,
    picklistChoiceLabel,
    picklistChoiceDesc,
    stageLabel,
    stageDesc
};
