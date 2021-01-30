import actionFlowComponentDescription  from '@salesforce/label/FlowBuilderLeftPanelElements.actionFlowComponentDescription';
import createDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.createDataOperationDescription';
import deleteDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.deleteDataOperationDescription';
import updateDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.updateDataOperationDescription';
import lookupDataOperationDescription from '@salesforce/label/FlowBuilderLeftPanelElements.lookupDataOperationDescription';
import decisionLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicDescription';
import decisionLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.decisionLogicLabel';
import newActionLabel  from '@salesforce/label/FlowBuilderElementConfig.newActionLabel';
import screenComponentDescription from '@salesforce/label/FlowBuilderLeftPanelElements.screenComponentDescription';
import screenComponentLabel from '@salesforce/label/FlowBuilderLeftPanelElements.screenComponentLabel';
import waitLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.waitLogicDescription';
import waitLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.waitLogicLabel';
import loopLogicDescription from '@salesforce/label/FlowBuilderLeftPanelElements.loopLogicDescription';
import loopLogicLabel from '@salesforce/label/FlowBuilderLeftPanelElements.loopLogicLabel';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';


export default [
    {
        section: 'Interaction',
        type: NodeType.DEFAULT,
        icon: 'standard:screen',
        label: screenComponentLabel,
        value: ELEMENT_TYPE.SCREEN,
        elementType: ELEMENT_TYPE.SCREEN,
        description: screenComponentDescription,
        canHaveFaultConnector: false,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Interaction',
        type: NodeType.DEFAULT,
        icon: 'standard:lightning_component',
        iconBackgroundColor: 'background-navy',
        label: newActionLabel,
        value: ELEMENT_TYPE.ACTION_CALL,
        elementType: ELEMENT_TYPE.ACTION_CALL,
        description: actionFlowComponentDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Flow Control',
        type: NodeType.BRANCH,
        icon: 'standard:decision',
        iconShape: 'diamond',
        label: decisionLogicLabel,
        value: ELEMENT_TYPE.DECISION,
        elementType: ELEMENT_TYPE.DECISION,
        description: decisionLogicDescription,
        canHaveFaultConnector: false,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Flow Control',
        type: NodeType.BRANCH,
        icon: 'standard:waits',
        label: waitLogicLabel,
        value: ELEMENT_TYPE.WAIT,
        elementType: ELEMENT_TYPE.WAIT,
        description: waitLogicDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Flow Control',
        type: NodeType.LOOP,
        icon: 'standard:loop',
        label: loopLogicLabel,
        value: ELEMENT_TYPE.LOOP,
        elementType: ELEMENT_TYPE.LOOP,
        description: loopLogicDescription,
        canHaveFaultConnector: false,
        supportsMenu: true,
        isSupported: true,
    },
    {
        section: 'Data Operation',
        type: ELEMENT_TYPE.RECORD_CREATE,
        icon: 'standard:record_create',
        label: ELEMENT_TYPE.RECORD_CREATE,
        value: ELEMENT_TYPE.RECORD_CREATE,
        elementType: ELEMENT_TYPE.RECORD_CREATE,
        description: createDataOperationDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Data Operation',
        type: ELEMENT_TYPE.RECORD_UPDATE,
        icon: 'standard:record_update',
        label: ELEMENT_TYPE.RECORD_UPDATE,
        value: ELEMENT_TYPE.RECORD_UPDATE,
        elementType: ELEMENT_TYPE.RECORD_UPDATE,
        description: lookupDataOperationDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Data Operation',
        type: ELEMENT_TYPE.RECORD_LOOKUP,
        icon: 'standard:record_lookup',
        label: ELEMENT_TYPE.RECORD_LOOKUP,
        value: ELEMENT_TYPE.RECORD_LOOKUP,
        elementType: ELEMENT_TYPE.RECORD_LOOKUP,
        description: updateDataOperationDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: 'Data Operation',
        type: ELEMENT_TYPE.RECORD_DELETE,
        icon: 'standard:record_delete',
        label: ELEMENT_TYPE.RECORD_DELETE,
        value: ELEMENT_TYPE.RECORD_DELETE,
        elementType: ELEMENT_TYPE.RECORD_DELETE,
        description: deleteDataOperationDescription,
        canHaveFaultConnector: true,
        supportsMenu: true,
        isSupported: true
    },
    {
        section: null,
        type: NodeType.START,
        icon: 'standard:default',
        label: 'Start',
        value: ELEMENT_TYPE.START_ELEMENT,
        elementType: ELEMENT_TYPE.START_ELEMENT,
        description: null,
        canHaveFaultConnector: false
    },
    // Technically not allowed in a screen flow. Added so we can work on App Processes
    // off-core
    // TODO: Support different process types off-core
    {
        section: 'Interaction',
        type: NodeType.ORCHESTRATED_STAGE,
        icon: 'standard:sales_path',
        label: 'orchestratedStage',
        value: ELEMENT_TYPE.ORCHESTRATED_STAGE,
        elementType: ELEMENT_TYPE.ORCHESTRATED_STAGE,
        description: screenComponentDescription,
        canHaveFaultConnector: false,
        supportsMenu: true,
        isSupported: true,
        dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode',
    },
];
