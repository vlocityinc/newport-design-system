// @ts-nocheck
import startElementLabel from '@salesforce/label/FlowBuilderCanvas.startElementLabel';
import startElementRecordCreated from '@salesforce/label/FlowBuilderCanvasElement.startElementRecordCreated';
import startElementRecordCreatedUpdated from '@salesforce/label/FlowBuilderCanvasElement.startElementRecordCreatedUpdated';
import startElementRecordUpdated from '@salesforce/label/FlowBuilderCanvasElement.startElementRecordUpdated';
import faultConnectorLabel from '@salesforce/label/FlowBuilderConnectorLabels.faultConnectorLabel';
import immediateConnectorLabel from '@salesforce/label/FlowBuilderConnectorLabels.immediateConnectorLabel';
import loopEndConnectorLabel from '@salesforce/label/FlowBuilderConnectorLabels.loopEndConnectorLabel';
import loopNextConnectorLabel from '@salesforce/label/FlowBuilderConnectorLabels.loopNextConnectorLabel';
import loopEndComboBoxOption from '@salesforce/label/FlowBuilderConnectorPicker.loopEndComboBoxOption';
import loopNextComboBoxOption from '@salesforce/label/FlowBuilderConnectorPicker.loopNextComboBoxOption';
import emptyDefaultOutcomeLabel from '@salesforce/label/FlowBuilderDecisionEditor.emptyDefaultOutcomeLabel';
import backgroundStepLabel from '@salesforce/label/FlowBuilderElementConfig.backgroundStepLabel';
import endElementSingularLabel from '@salesforce/label/FlowBuilderElementConfig.endElementSingularLabel';
import interactiveStepLabel from '@salesforce/label/FlowBuilderElementConfig.interactiveStepLabel';
import orchestratedStageStatus from '@salesforce/label/FlowBuilderElementConfig.orchestratedStageStatus';
import stageStepOutput from '@salesforce/label/FlowBuilderElementConfig.stageStepOutput';
import stageStepStatus from '@salesforce/label/FlowBuilderElementConfig.stageStepStatus';
import recurring from '@salesforce/label/FlowBuilderStartEditor.recurring';
import runAsyncScheduledPathLabel from '@salesforce/label/FlowBuilderStartEditor.runAsyncScheduledPathLabel';
import triggerFrequencyDaily from '@salesforce/label/FlowBuilderStartEditor.triggerFrequencyDaily';
import triggerFrequencyOnce from '@salesforce/label/FlowBuilderStartEditor.triggerFrequencyOnce';
import triggerFrequencyWeekly from '@salesforce/label/FlowBuilderStartEditor.triggerFrequencyWeekly';
import emptyDefaultWaitPathLabel from '@salesforce/label/FlowBuilderWaitEditor.emptyDefaultWaitPathLabel';

export const LABELS = {
    emptyDefaultOutcomeLabel,
    emptyDefaultWaitPathLabel,
    startElementLabel,
    faultConnectorLabel,
    loopNextConnectorLabel,
    loopEndConnectorLabel,
    loopNextComboBoxOption,
    loopEndComboBoxOption,
    triggerFrequencyOnce,
    triggerFrequencyDaily,
    triggerFrequencyWeekly,
    runAsyncScheduledPathLabel,
    startElementRecordCreated,
    startElementRecordUpdated,
    startElementRecordCreatedUpdated,
    endElementSingularLabel,
    interactiveStepLabel,
    backgroundStepLabel,
    immediateConnectorLabel,
    stageStepStatus,
    stageStepOutput,
    orchestratedStageStatus,
    recurring
};
