// @ts-nocheck
/* Labels */
import filterDescription from '@salesforce/label/CollectionFilter.Description';
import filterSingularLabel from '@salesforce/label/CollectionFilter.Label';
import filterPluralLabel from '@salesforce/label/CollectionFilter.LabelPlural';
import mapDescription from '@salesforce/label/CollectionMap.Description';
import mapSingularLabel from '@salesforce/label/CollectionMap.Label';
import mapPluralLabel from '@salesforce/label/CollectionMap.LabelPlural';
import collectionProcessorSingularLabel from '@salesforce/label/CollectionProcessor.Label';
import collectionProcessorPluralLabel from '@salesforce/label/CollectionProcessor.LabelPlural';
import sortDescription from '@salesforce/label/CollectionSort.Description';
import sortSingularLabel from '@salesforce/label/CollectionSort.Label';
import sortPluralLabel from '@salesforce/label/CollectionSort.LabelPlural';
import newElementHeaderPrefix from '@salesforce/label/FlowBuilderCommonPropertyEditor.newElementHeaderPrefix';
import decisionConnectorPickerBodyText from '@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerBodyText';
import decisionConnectorPickerComboBoxLabel from '@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerComboBoxLabel';
import decisionConnectorPickerHeader from '@salesforce/label/FlowBuilderConnectorPicker.decisionConnectorPickerHeader';
import loopConnectorPickerBodyText from '@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerBodyText';
import loopConnectorPickerComboBoxLabel from '@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerComboBoxLabel';
import loopConnectorPickerHeader from '@salesforce/label/FlowBuilderConnectorPicker.loopConnectorPickerHeader';
import startConnectorPickerBodyText from '@salesforce/label/FlowBuilderConnectorPicker.startConnectorPickerBodyText';
import startConnectorPickerComboBoxLabel from '@salesforce/label/FlowBuilderConnectorPicker.startConnectorPickerComboBoxLabel';
import startConnectorPickerHeader from '@salesforce/label/FlowBuilderConnectorPicker.startConnectorPickerHeader';
import waitConnectorPickerBodyText from '@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerBodyText';
import waitConnectorPickerComboBoxLabel from '@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerComboBoxLabel';
import waitConnectorPickerHeader from '@salesforce/label/FlowBuilderConnectorPicker.waitConnectorPickerHeader';
import emptyDefaultOutcomeLabel from '@salesforce/label/FlowBuilderDecisionEditor.emptyDefaultOutcomeLabel';
import actionPluralLabel from '@salesforce/label/FlowBuilderElementConfig.actionPluralLabel';
import actionSingularLabel from '@salesforce/label/FlowBuilderElementConfig.actionSingularLabel';
import apexCollectionVariablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.apexCollectionVariablePluralLabel';
import apexPluginPluralLabel from '@salesforce/label/FlowBuilderElementConfig.apexPluginPluralLabel';
import apexPluginSingularLabel from '@salesforce/label/FlowBuilderElementConfig.apexPluginSingularLabel';
import apexPluralLabel from '@salesforce/label/FlowBuilderElementConfig.apexPluralLabel';
import apexSingularLabel from '@salesforce/label/FlowBuilderElementConfig.apexSingularLabel';
import apexVariablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.apexVariablePluralLabel';
import assignmentPluralLabel from '@salesforce/label/FlowBuilderElementConfig.assignmentPluralLabel';
import assignmentSingularLabel from '@salesforce/label/FlowBuilderElementConfig.assignmentSingularLabel';
import choicePluralLabel from '@salesforce/label/FlowBuilderElementConfig.choicePluralLabel';
import choiceSingularLabel from '@salesforce/label/FlowBuilderElementConfig.choiceSingularLabel';
import collectionChoiceSetPluralLabel from '@salesforce/label/FlowBuilderElementConfig.collectionChoiceSetPluralLabel';
import collectionChoiceSetSingularLabel from '@salesforce/label/FlowBuilderElementConfig.collectionChoiceSetSingularLabel';
import collectionVariablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.collectionVariablePluralLabel';
import constantPluralLabel from '@salesforce/label/FlowBuilderElementConfig.constantPluralLabel';
import constantSingularLabel from '@salesforce/label/FlowBuilderElementConfig.constantSingularLabel';
import decisionPluralLabel from '@salesforce/label/FlowBuilderElementConfig.decisionPluralLabel';
import decisionSingularLabel from '@salesforce/label/FlowBuilderElementConfig.decisionSingularLabel';
import editActionLabel from '@salesforce/label/FlowBuilderElementConfig.editActionLabel';
import editApexActionLabel from '@salesforce/label/FlowBuilderElementConfig.editApexActionLabel';
import editApexActionPluginLabel from '@salesforce/label/FlowBuilderElementConfig.editApexActionPluginLabel';
import editAssignmentLabel from '@salesforce/label/FlowBuilderElementConfig.editAssignmentLabel';
import editChoiceLabel from '@salesforce/label/FlowBuilderElementConfig.editChoiceLabel';
import editCollectionChoiceSetLabel from '@salesforce/label/FlowBuilderElementConfig.editCollectionChoiceSetLabel';
import editConstantLabel from '@salesforce/label/FlowBuilderElementConfig.editConstantLabel';
import editDecisionLabel from '@salesforce/label/FlowBuilderElementConfig.editDecisionLabel';
import editEmailAlertLabel from '@salesforce/label/FlowBuilderElementConfig.editEmailAlertLabel';
import editFlowProperties from '@salesforce/label/FlowBuilderElementConfig.editFlowProperties';
import editFormulaLabel from '@salesforce/label/FlowBuilderElementConfig.editFormulaLabel';
import editLoopLabel from '@salesforce/label/FlowBuilderElementConfig.editLoopLabel';
import editObjectAndFiltersLabel from '@salesforce/label/FlowBuilderElementConfig.editObjectAndFiltersLabel';
import editObjectLabel from '@salesforce/label/FlowBuilderElementConfig.editObjectLabel';
import editOrchestratedStageLabel from '@salesforce/label/FlowBuilderElementConfig.editOrchestratedStageLabel';
import editPicklistChoiceSetLabel from '@salesforce/label/FlowBuilderElementConfig.editPicklistChoiceSetLabel';
import editPlatformLabel from '@salesforce/label/FlowBuilderElementConfig.editPlatformLabel';
import editRecordChoiceSetLabel from '@salesforce/label/FlowBuilderElementConfig.editRecordChoiceSetLabel';
import editRecordCreateLabel from '@salesforce/label/FlowBuilderElementConfig.editRecordCreateLabel';
import editRecordDeleteLabel from '@salesforce/label/FlowBuilderElementConfig.editRecordDeleteLabel';
import editRecordLookupLabel from '@salesforce/label/FlowBuilderElementConfig.editRecordLookupLabel';
import editRecordUpdateLabel from '@salesforce/label/FlowBuilderElementConfig.editRecordUpdateLabel';
import editRollbackLabel from '@salesforce/label/FlowBuilderElementConfig.editRollbackLabel';
import editScheduledPathLabel from '@salesforce/label/FlowBuilderElementConfig.editScheduledPathLabel';
import editScheduleLabel from '@salesforce/label/FlowBuilderElementConfig.editScheduleLabel';
import editScreenLabel from '@salesforce/label/FlowBuilderElementConfig.editScreenLabel';
import editStageLabel from '@salesforce/label/FlowBuilderElementConfig.editStageLabel';
import editStageStepLabel from '@salesforce/label/FlowBuilderElementConfig.editStageStepLabel';
import editStartElementLabel from '@salesforce/label/FlowBuilderElementConfig.editStartElementLabel';
import editStepLabel from '@salesforce/label/FlowBuilderElementConfig.editStepLabel';
import editSubflowLabel from '@salesforce/label/FlowBuilderElementConfig.editSubflowLabel';
import editTextTemplateLabel from '@salesforce/label/FlowBuilderElementConfig.editTextTemplateLabel';
import editTriggerObjectLabel from '@salesforce/label/FlowBuilderElementConfig.editTriggerObjectLabel';
import editVariableLabel from '@salesforce/label/FlowBuilderElementConfig.editVariableLabel';
import editWaitLabel from '@salesforce/label/FlowBuilderElementConfig.editWaitLabel';
import emailAlertPluralLabel from '@salesforce/label/FlowBuilderElementConfig.emailAlertPluralLabel';
import emailAlertSingularLabel from '@salesforce/label/FlowBuilderElementConfig.emailAlertSingularLabel';
import endElementPluralLabel from '@salesforce/label/FlowBuilderElementConfig.endElementPluralLabel';
import endElementSingularLabel from '@salesforce/label/FlowBuilderElementConfig.endElementSingularLabel';
import flowPropertiesSingularLabel from '@salesforce/label/FlowBuilderElementConfig.flowPropertiesSingularLabel';
import formulaPluralLabel from '@salesforce/label/FlowBuilderElementConfig.formulaPluralLabel';
import formulaSingularLabel from '@salesforce/label/FlowBuilderElementConfig.formulaSingularLabel';
import loopPluralLabel from '@salesforce/label/FlowBuilderElementConfig.loopPluralLabel';
import loopSingularLabel from '@salesforce/label/FlowBuilderElementConfig.loopSingularLabel';
import newActionLabel from '@salesforce/label/FlowBuilderElementConfig.newActionLabel';
import newApexActionLabel from '@salesforce/label/FlowBuilderElementConfig.newApexActionLabel';
import newApexActionPluginLabel from '@salesforce/label/FlowBuilderElementConfig.newApexActionPluginLabel';
import newAssignmentLabel from '@salesforce/label/FlowBuilderElementConfig.newAssignmentLabel';
import newDecisionLabel from '@salesforce/label/FlowBuilderElementConfig.newDecisionLabel';
import newEmailAlertLabel from '@salesforce/label/FlowBuilderElementConfig.newEmailAlertLabel';
import newLoopLabel from '@salesforce/label/FlowBuilderElementConfig.newLoopLabel';
import newOrchestratedStageLabel from '@salesforce/label/FlowBuilderElementConfig.newOrchestratedStageLabel';
import newRecordCreateLabel from '@salesforce/label/FlowBuilderElementConfig.newRecordCreateLabel';
import newRecordDeleteLabel from '@salesforce/label/FlowBuilderElementConfig.newRecordDeleteLabel';
import newRecordLookupLabel from '@salesforce/label/FlowBuilderElementConfig.newRecordLookupLabel';
import newRecordUpdateLabel from '@salesforce/label/FlowBuilderElementConfig.newRecordUpdateLabel';
import newRollbackLabel from '@salesforce/label/FlowBuilderElementConfig.newRollbackLabel';
import newScreenLabel from '@salesforce/label/FlowBuilderElementConfig.newScreenLabel';
import newStageLabel from '@salesforce/label/FlowBuilderElementConfig.newStageLabel';
import newStageStepLabel from '@salesforce/label/FlowBuilderElementConfig.newStageStepLabel';
import newStepLabel from '@salesforce/label/FlowBuilderElementConfig.newStepLabel';
import newSubflowLabel from '@salesforce/label/FlowBuilderElementConfig.newSubflowLabel';
import newWaitLabel from '@salesforce/label/FlowBuilderElementConfig.newWaitLabel';
import orchestratedStagePluralLabel from '@salesforce/label/FlowBuilderElementConfig.orchestratedStagePluralLabel';
import orchestratedStageSingularLabel from '@salesforce/label/FlowBuilderElementConfig.orchestratedStageSingularLabel';
import outcomePluralLabel from '@salesforce/label/FlowBuilderElementConfig.outcomePluralLabel';
import outcomeShortLabel from '@salesforce/label/FlowBuilderElementConfig.outcomeShortLabel';
import outcomeSingularLabel from '@salesforce/label/FlowBuilderElementConfig.outcomeSingularLabel';
import picklistChoiceSetPluralLabel from '@salesforce/label/FlowBuilderElementConfig.picklistChoiceSetPluralLabel';
import picklistChoiceSetSingularLabel from '@salesforce/label/FlowBuilderElementConfig.picklistChoiceSetSingularLabel';
import recordChoiceSetPluralLabel from '@salesforce/label/FlowBuilderElementConfig.recordChoiceSetPluralLabel';
import recordChoiceSetSingularLabel from '@salesforce/label/FlowBuilderElementConfig.recordChoiceSetSingularLabel';
import recordCreatePluralLabel from '@salesforce/label/FlowBuilderElementConfig.recordCreatePluralLabel';
import recordCreateSingularLabel from '@salesforce/label/FlowBuilderElementConfig.recordCreateSingularLabel';
import recordDeletePluralLabel from '@salesforce/label/FlowBuilderElementConfig.recordDeletePluralLabel';
import recordDeleteSingularLabel from '@salesforce/label/FlowBuilderElementConfig.recordDeleteSingularLabel';
import recordLookupPluralLabel from '@salesforce/label/FlowBuilderElementConfig.recordLookupPluralLabel';
import recordLookupSingularLabel from '@salesforce/label/FlowBuilderElementConfig.recordLookupSingularLabel';
import recordUpdatePluralLabel from '@salesforce/label/FlowBuilderElementConfig.recordUpdatePluralLabel';
import recordUpdateSingularLabel from '@salesforce/label/FlowBuilderElementConfig.recordUpdateSingularLabel';
import rollbackPluralLabel from '@salesforce/label/FlowBuilderElementConfig.rollbackPluralLabel';
import rollbackSingularLabel from '@salesforce/label/FlowBuilderElementConfig.rollbackSingularLabel';
import scheduledPathPluralLabel from '@salesforce/label/FlowBuilderElementConfig.scheduledPathPluralLabel';
import scheduledPathSingularLabel from '@salesforce/label/FlowBuilderElementConfig.scheduledPathSingularLabel';
import screenFieldPluralLabel from '@salesforce/label/FlowBuilderElementConfig.screenFieldPluralLabel';
import screenFieldSingularLabel from '@salesforce/label/FlowBuilderElementConfig.screenFieldSingularLabel';
import screenPluralLabel from '@salesforce/label/FlowBuilderElementConfig.screenPluralLabel';
import screenSingularLabel from '@salesforce/label/FlowBuilderElementConfig.screenSingularLabel';
import sObjectCollectionPluralLabel from '@salesforce/label/FlowBuilderElementConfig.sObjectCollectionPluralLabel';
import sObjectPluralLabel from '@salesforce/label/FlowBuilderElementConfig.sObjectPluralLabel';
import stagePluralLabel from '@salesforce/label/FlowBuilderElementConfig.stagePluralLabel';
import stageSingularLabel from '@salesforce/label/FlowBuilderElementConfig.stageSingularLabel';
import stageStepComponentLabel from '@salesforce/label/FlowBuilderElementConfig.stageStepComponentLabel';
import stageStepPluralLabel from '@salesforce/label/FlowBuilderElementConfig.stageStepPluralLabel';
import stageStepSingularLabel from '@salesforce/label/FlowBuilderElementConfig.stageStepSingularLabel';
import startElementSingularLabel from '@salesforce/label/FlowBuilderElementConfig.startElementSingularLabel';
import stepPluralLabel from '@salesforce/label/FlowBuilderElementConfig.stepPluralLabel';
import stepSingularLabel from '@salesforce/label/FlowBuilderElementConfig.stepSingularLabel';
import subflowPluralLabel from '@salesforce/label/FlowBuilderElementConfig.subflowPluralLabel';
import subflowSingularLabel from '@salesforce/label/FlowBuilderElementConfig.subflowSingularLabel';
import textTemplatePluralLabel from '@salesforce/label/FlowBuilderElementConfig.textTemplatePluralLabel';
import textTemplateSingularLabel from '@salesforce/label/FlowBuilderElementConfig.textTemplateSingularLabel';
import variablePluralLabel from '@salesforce/label/FlowBuilderElementConfig.variablePluralLabel';
import variableSingularLabel from '@salesforce/label/FlowBuilderElementConfig.variableSingularLabel';
import waitEventPluralLabel from '@salesforce/label/FlowBuilderElementConfig.waitEventPluralLabel';
import waitEventSingularLabel from '@salesforce/label/FlowBuilderElementConfig.waitEventSingularLabel';
import waitPluralLabel from '@salesforce/label/FlowBuilderElementConfig.waitPluralLabel';
import waitSingularLabel from '@salesforce/label/FlowBuilderElementConfig.waitSingularLabel';
import actionFlowComponentDescription from '@salesforce/label/FlowBuilderLeftPanelElements.actionFlowComponentDescription';
import actionFlowComponentLabel from '@salesforce/label/FlowBuilderLeftPanelElements.actionFlowComponentLabel';
import assignmentLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.assignmentLogicDescription';
import assignmentLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.assignmentLogicLabel';
import collectionProcessorLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.collectionProcessorLogicLabel';
import createDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationDescription';
import createDataOperationLabel from '@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationLabel';
import decisionLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicDescription';
import decisionLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicLabel';
import deleteDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationDescription';
import deleteDataOperationLabel from '@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationLabel';
import endElementDescription from '@salesforce/label/FlowBuilderLeftPanelElements.endElementDescription';
import flowControlDataOperationsLabel from '@salesforce/label/FlowBuilderLeftPanelElements.flowControlDataOperationsLabel';
import flowControlFlowComponentsLabel from '@salesforce/label/FlowBuilderLeftPanelElements.flowControlFlowComponentsLabel';
import flowControlLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.flowControlLogicLabel';
import flowInteractionComponentsLabel from '@salesforce/label/FlowBuilderLeftPanelElements.flowInteractionComponentsLabel';
import lookupDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationDescription';
import lookupDataOperationLabel from '@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationLabel';
import loopLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.loopLogicDescription';
import loopLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.loopLogicLabel';
import orchestratedStageComponentDescription from '@salesforce/label/FlowBuilderLeftPanelElements.orchestratedStageComponentDescription';
import orchestratedStageComponentLabel from '@salesforce/label/FlowBuilderLeftPanelElements.orchestratedStageComponentLabel';
import orchestratorDecisionLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.orchestratorDecisionLogicDescription';
import rollbackDataLabel from '@salesforce/label/FlowBuilderLeftPanelElements.rollbackDataLabel';
import rollbackDescription from '@salesforce/label/FlowBuilderLeftPanelElements.rollbackDescription';
import screenComponentDescription from '@salesforce/label/FlowBuilderLeftPanelElements.screenComponentDescription';
import screenComponentLabel from '@salesforce/label/FlowBuilderLeftPanelElements.screenComponentLabel';
import subflowFlowComponentDescription from '@salesforce/label/FlowBuilderLeftPanelElements.subflowFlowComponentDescription';
import subflowFlowComponentLabel from '@salesforce/label/FlowBuilderLeftPanelElements.subflowFlowComponentLabel';
import updateDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationDescription';
import updateDataOperationLabel from '@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationLabel';
import waitLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.waitLogicDescription';
import waitLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.waitLogicLabel';
import choiceDesc from '@salesforce/label/FlowBuilderNewResource.choiceDesc';
import choiceLabel from '@salesforce/label/FlowBuilderNewResource.choiceLabel';
import constantDesc from '@salesforce/label/FlowBuilderNewResource.constantDesc';
import constantLabel from '@salesforce/label/FlowBuilderNewResource.constantLabel';
import dynamicCollectionChoiceDesc from '@salesforce/label/FlowBuilderNewResource.dynamicCollectionChoiceDesc';
import dynamicCollectionChoiceLabel from '@salesforce/label/FlowBuilderNewResource.dynamicCollectionChoiceLabel';
import dynamicRecordChoiceDesc from '@salesforce/label/FlowBuilderNewResource.dynamicRecordChoiceDesc';
import dynamicRecordChoiceLabel from '@salesforce/label/FlowBuilderNewResource.dynamicRecordChoiceLabel';
import formulaDesc from '@salesforce/label/FlowBuilderNewResource.formulaDesc';
import formulaLabel from '@salesforce/label/FlowBuilderNewResource.formulaLabel';
import picklistChoiceDesc from '@salesforce/label/FlowBuilderNewResource.picklistChoiceDesc';
import picklistChoiceLabel from '@salesforce/label/FlowBuilderNewResource.picklistChoiceLabel';
import resourceTypeLabel from '@salesforce/label/FlowBuilderNewResource.resourceTypeLabel';
import resourceTypePlaceholderLabel from '@salesforce/label/FlowBuilderNewResource.resourceTypePlaceholderLabel';
import stageDesc from '@salesforce/label/FlowBuilderNewResource.stageDesc';
import stageLabel from '@salesforce/label/FlowBuilderNewResource.stageLabel';
import textTemplateDesc from '@salesforce/label/FlowBuilderNewResource.textTemplateDesc';
import textTemplateLabel from '@salesforce/label/FlowBuilderNewResource.textTemplateLabel';
import variableDesc from '@salesforce/label/FlowBuilderNewResource.variableDesc';
import variableLabel from '@salesforce/label/FlowBuilderNewResource.variableLabel';
import editButtonLabel from '@salesforce/label/FlowBuilderResourceDetailsPanel.editButtonLabel';
import recordChangeTriggerEditorHeader from '@salesforce/label/FlowBuilderStartEditor.recordChangeTriggerEditorHeader';
import emptyDefaultWaitPathLabel from '@salesforce/label/FlowBuilderWaitEditor.emptyDefaultWaitPathLabel';

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
    decisionConnectorPickerHeader,
    decisionConnectorPickerBodyText,
    decisionConnectorPickerComboBoxLabel,
    waitSingularLabel,
    waitPluralLabel,
    waitEventSingularLabel,
    waitEventPluralLabel,
    waitConnectorPickerHeader,
    waitConnectorPickerBodyText,
    waitConnectorPickerComboBoxLabel,
    loopSingularLabel,
    loopPluralLabel,
    loopConnectorPickerHeader,
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
    outcomeShortLabel,
    scheduledPathSingularLabel,
    scheduledPathPluralLabel,
    flowPropertiesSingularLabel,
    stageSingularLabel,
    stagePluralLabel,
    emptyDefaultOutcomeLabel,
    emptyDefaultWaitPathLabel,
    sObjectPluralLabel,
    sObjectCollectionPluralLabel,
    apexVariablePluralLabel,
    apexCollectionVariablePluralLabel,
    collectionVariablePluralLabel,
    choiceSingularLabel,
    choicePluralLabel,
    stepSingularLabel,
    stepPluralLabel,
    recordChoiceSetSingularLabel,
    recordChoiceSetPluralLabel,
    collectionChoiceSetSingularLabel,
    collectionChoiceSetPluralLabel,
    picklistChoiceSetSingularLabel,
    picklistChoiceSetPluralLabel,
    screenFieldSingularLabel,
    screenFieldPluralLabel,
    endElementSingularLabel,
    endElementPluralLabel,
    startElementSingularLabel,
    flowControlLogicLabel,
    flowControlDataOperationsLabel,
    flowControlFlowComponentsLabel,
    flowInteractionComponentsLabel,
    screenComponentLabel,
    assignmentLogicLabel,
    decisionLogicLabel,
    waitLogicLabel,
    loopLogicLabel,
    collectionProcessorLogicLabel,
    createDataOperationLabel,
    updateDataOperationLabel,
    lookupDataOperationLabel,
    deleteDataOperationLabel,
    actionFlowComponentLabel,
    subflowFlowComponentLabel,
    decisionLogicDescription,
    orchestratorDecisionLogicDescription,
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
    endElementDescription,
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
    dynamicCollectionChoiceLabel,
    dynamicCollectionChoiceDesc,
    picklistChoiceLabel,
    picklistChoiceDesc,
    stageLabel,
    stageDesc,
    editScreenLabel,
    editActionLabel,
    editSubflowLabel,
    editAssignmentLabel,
    editDecisionLabel,
    editLoopLabel,
    editRecordCreateLabel,
    editRecordDeleteLabel,
    editRecordUpdateLabel,
    editRecordLookupLabel,
    editEmailAlertLabel,
    editApexActionLabel,
    editApexActionPluginLabel,
    editStageLabel,
    editWaitLabel,
    editStepLabel,
    editFlowProperties,
    editVariableLabel,
    editConstantLabel,
    editFormulaLabel,
    editTextTemplateLabel,
    editChoiceLabel,
    editRecordChoiceSetLabel,
    editCollectionChoiceSetLabel,
    editPicklistChoiceSetLabel,
    editStartElementLabel,
    editScheduledPathLabel,
    editObjectLabel,
    editTriggerObjectLabel,
    editObjectAndFiltersLabel,
    editScheduleLabel,
    editPlatformLabel,
    newScreenLabel,
    newActionLabel,
    newSubflowLabel,
    newAssignmentLabel,
    newDecisionLabel,
    newLoopLabel,
    newRecordCreateLabel,
    newRecordDeleteLabel,
    newRecordUpdateLabel,
    newRecordLookupLabel,
    newEmailAlertLabel,
    newApexActionLabel,
    newApexActionPluginLabel,
    newStageLabel,
    newWaitLabel,
    newStepLabel,
    newElementHeaderPrefix,
    editButtonLabel,
    orchestratedStageComponentDescription,
    orchestratedStageSingularLabel,
    orchestratedStagePluralLabel,
    orchestratedStageComponentLabel,
    newOrchestratedStageLabel,
    editOrchestratedStageLabel,
    stageStepSingularLabel,
    stageStepPluralLabel,
    stageStepComponentLabel,
    newStageStepLabel,
    editStageStepLabel,
    startConnectorPickerHeader,
    startConnectorPickerBodyText,
    startConnectorPickerComboBoxLabel,
    sortSingularLabel,
    sortPluralLabel,
    sortDescription,
    filterSingularLabel,
    filterPluralLabel,
    filterDescription,
    mapSingularLabel,
    mapPluralLabel,
    mapDescription,
    collectionProcessorSingularLabel,
    collectionProcessorPluralLabel,
    rollbackSingularLabel,
    rollbackPluralLabel,
    rollbackDataLabel,
    editRollbackLabel,
    newRollbackLabel,
    rollbackDescription,
    recordChangeTriggerEditorHeader
};
