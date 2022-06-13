import collectionDataType from '@salesforce/label/FlowBuilderDataTypes.collectionDataType';
import actionAnonymousPrimitiveAsResourceText from '@salesforce/label/FlowBuilderElementLabels.actionAnonymousPrimitiveAsResourceText';
import actionAsResourceText from '@salesforce/label/FlowBuilderElementLabels.actionAsResourceText';
import lightningComponentScreenFieldAsResourceText from '@salesforce/label/FlowBuilderElementLabels.lightningComponentScreenFieldAsResourceText';
import loopAsResourceText from '@salesforce/label/FlowBuilderElementLabels.loopAsResourceText';
import recordCreateIdAsResourceText from '@salesforce/label/FlowBuilderElementLabels.recordCreateIdAsResourceText';
import recordLookupAsResourceText from '@salesforce/label/FlowBuilderElementLabels.recordLookupAsResourceText';
import subflowAsResourceText from '@salesforce/label/FlowBuilderElementLabels.subflowAsResourceText';
import globalApiDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalApiDescription';
import globalApiLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalApiLabel';
import globalFlowDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalFlowDescription';
import globalFlowLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalFlowLabel';
import globalOrchestrationDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalOrchestrationDescription';
import globalOrchestrationLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalOrchestrationLabel';
import globalOrgDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalOrgDescription';
import globalOrgLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalOrgLabel';
import globalRecordDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordDescription';
import globalRecordLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordLabel';
import globalRecordPriorValueDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordPriorValueDescription';
import globalRecordPriorValueLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalRecordPriorValueLabel';
import globalSystemDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalSystemDescription';
import globalSystemLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalSystemLabel';
import globalUserDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserDescription';
import globalUserLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserLabel';
import globalUserProfileDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserProfileDescription';
import globalUserProfileLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserProfileLabel';
import globalUserRoleDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserRoleDescription';
import globalUserRoleLabel from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalUserRoleLabel';
import globalValueNull from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalValueNull';
import globalValueNullDescription from '@salesforce/label/FlowBuilderFieldInputGlobalResources.globalValueNullDescription';
import globalValueEmptyString from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueEmptyString';
import globalValueEmptyStringDescription from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueEmptyStringDescription';
import globalValueFalse from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueFalse';
import globalValueFalseDescription from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueFalseDescription';
import globalValueTrue from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueTrue';
import globalValueTrueDescription from '@salesforce/label/FlowBuilderFieldInputGlobalValues.globalValueTrueDescription';
import actions from '@salesforce/label/FlowBuilderFieldInputMenuCategories.actions';
import apexCollections from '@salesforce/label/FlowBuilderFieldInputMenuCategories.apexCollections';
import apexVariables from '@salesforce/label/FlowBuilderFieldInputMenuCategories.apexVariables';
import assignments from '@salesforce/label/FlowBuilderFieldInputMenuCategories.assignments';
import choices from '@salesforce/label/FlowBuilderFieldInputMenuCategories.choices';
import constants from '@salesforce/label/FlowBuilderFieldInputMenuCategories.constants';
import decisions from '@salesforce/label/FlowBuilderFieldInputMenuCategories.decisions';
import filter from '@salesforce/label/FlowBuilderFieldInputMenuCategories.filter';
import formulas from '@salesforce/label/FlowBuilderFieldInputMenuCategories.formulas';
import globalResources from '@salesforce/label/FlowBuilderFieldInputMenuCategories.globalResources';
import globalValues from '@salesforce/label/FlowBuilderFieldInputMenuCategories.globalValues';
import loops from '@salesforce/label/FlowBuilderFieldInputMenuCategories.loops';
import map from '@salesforce/label/FlowBuilderFieldInputMenuCategories.map';
import orchestratedStages from '@salesforce/label/FlowBuilderFieldInputMenuCategories.orchestratedStages';
import orchestratedSteps from '@salesforce/label/FlowBuilderFieldInputMenuCategories.orchestratedSteps';
import outcomes from '@salesforce/label/FlowBuilderFieldInputMenuCategories.outcomes';
import recordCollections from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordCollections';
import recordCreate from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordCreate';
import recordDelete from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordDelete';
import recordLookup from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordLookup';
import recordUpdate from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordUpdate';
import recordVariables from '@salesforce/label/FlowBuilderFieldInputMenuCategories.recordVariables';
import rollBack from '@salesforce/label/FlowBuilderFieldInputMenuCategories.rollBack';
import screenFields from '@salesforce/label/FlowBuilderFieldInputMenuCategories.screenFields';
import screens from '@salesforce/label/FlowBuilderFieldInputMenuCategories.screens';
import simpleCollections from '@salesforce/label/FlowBuilderFieldInputMenuCategories.simpleCollections';
import simpleVariables from '@salesforce/label/FlowBuilderFieldInputMenuCategories.simpleVariables';
import sort from '@salesforce/label/FlowBuilderFieldInputMenuCategories.sort';
import stages from '@salesforce/label/FlowBuilderFieldInputMenuCategories.stages';
import subflows from '@salesforce/label/FlowBuilderFieldInputMenuCategories.subflows';
import textTemplates from '@salesforce/label/FlowBuilderFieldInputMenuCategories.textTemplates';
import waitEvents from '@salesforce/label/FlowBuilderFieldInputMenuCategories.waitEvents';
import waits from '@salesforce/label/FlowBuilderFieldInputMenuCategories.waits';

export const LABELS = {
    simpleVariables,
    simpleCollections,
    recordVariables,
    recordCollections,
    apexCollections,
    apexVariables,
    actions,
    assignments,
    decisions,
    choices,
    constants,
    formulas,
    globalValues,
    stages,
    textTemplates,
    loops,
    outcomes,
    recordCreate,
    recordDelete,
    recordLookup,
    recordUpdate,
    rollBack,
    screens,
    subflows,
    waits,
    waitEvents,
    screenFields,
    orchestratedStages,
    orchestratedSteps,
    actionAnonymousPrimitiveAsResourceText,
    actionAsResourceText,
    collectionDataType,
    lightningComponentScreenFieldAsResourceText,
    loopAsResourceText,
    recordCreateIdAsResourceText,
    recordLookupAsResourceText,
    subflowAsResourceText,
    globalResources,
    globalRecordLabel,
    globalRecordDescription,
    globalRecordPriorValueLabel,
    globalRecordPriorValueDescription,
    globalFlowLabel,
    globalFlowDescription,
    globalOrgLabel,
    globalOrgDescription,
    globalUserLabel,
    globalUserDescription,
    globalUserRoleLabel,
    globalUserRoleDescription,
    globalUserProfileLabel,
    globalUserProfileDescription,
    globalOrchestrationLabel,
    globalOrchestrationDescription,
    globalApiLabel,
    globalApiDescription,
    globalSystemLabel,
    globalSystemDescription,
    globalValueTrue,
    globalValueTrueDescription,
    globalValueFalse,
    globalValueFalseDescription,
    globalValueEmptyString,
    globalValueEmptyStringDescription,
    globalValueNull,
    globalValueNullDescription,
    filter,
    map,
    sort
};
