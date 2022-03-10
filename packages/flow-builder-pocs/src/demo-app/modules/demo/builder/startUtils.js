import { NodeType } from 'builder_platform_interaction/autoLayoutCanvas';

export const autolaunchedFlowStart = {
    canHaveFaultConnector: false,
    description: 'Autolaunched Flow',
    elementType: 'START_ELEMENT',
    hasContext: false,
    hasTrigger: false,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT',
    guid: 'startGuid'
};

export const platformEventStart = {
    canHaveFaultConnector: false,
    description: 'Platform Event—Triggered Flow',
    elementType: 'START_ELEMENT',
    hasContext: false,
    hasTrigger: true,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT'
};

export const screenFlowStart = {
    canHaveFaultConnector: false,
    description: 'Screen Flow',
    elementType: 'START_ELEMENT',
    hasContext: false,
    hasTrigger: false,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT'
};

export const recordTriggeredFlowStart = {
    canHaveFaultConnector: false,
    description: 'Record-Triggered Flow',
    elementType: 'START_ELEMENT',
    hasContext: true,
    hasTrigger: true,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT'
};

export const scheduledTriggeredFlowStart = {
    canHaveFaultConnector: false,
    description: 'Schedule-Triggered Flow',
    elementType: 'START_ELEMENT',
    hasContext: true,
    hasTrigger: true,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT'
};

export const recordTriggeredOrchestrationStart = {
    canHaveFaultConnector: false,
    description: 'Record-Triggered Orchestration',
    elementType: 'START_ELEMENT',
    hasContext: true,
    hasTrigger: true,
    icon: 'utility:right',
    iconBackgroundColor: 'background-green',
    iconShape: 'circle',
    iconSize: 'medium',

    label: 'Start',
    type: NodeType.START,
    value: 'START_ELEMENT'
};

export const platformEventStartData = {
    childIndex: 0,
    childReferences: [],
    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
    connectorCount: 0,
    description: '',
    elementType: 'START_ELEMENT',
    filterLogic: 'and',
    guid: '6de7bd7c-261e-4df3-a4cc-548e9c7f85ef',
    isCanvasElement: true,
    isTerminal: true,
    locationX: 50,
    locationY: 50,
    maxConnections: 1,
    next: 'ede8b21a-5d71-46b2-a583-156cfc390d3c',
    object: '',
    objectIndex: '8b6dc32e-a495-4c5f-95de-e9c861eee7b7',
    parent: 'root',
    prev: null,
    triggerType: 'PlatformEvent'
};

export const screenFlowStartData = {
    guid: 'c5b9fadf-5789-42ab-bdfc-b987fdb5f34c',
    description: '',
    locationX: 50,
    locationY: 50,
    isCanvasElement: true,
    connectorCount: 0,
    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
    canHaveFaultConnector: false,
    elementType: 'START_ELEMENT',
    maxConnections: 1,
    triggerType: 'None',
    filterLogic: 'and',
    object: '',
    objectIndex: '4c01aa39-736b-4b98-8c2f-0a38dcac3243',
    filters: [
        {
            rowIndex: '98cca8a2-a5b4-4616-b403-65df606d57b9',
            leftHandSide: '',
            leftHandSideDataType: 'String',
            rightHandSide: '',
            rightHandSideDataType: '',
            operator: ''
        }
    ],
    childReferences: [],
    availableConnections: [{ type: 'REGULAR' }],
    shouldSupportScheduledPaths: false,
    nodeType: 'start',
    prev: null,
    parent: 'root',
    childIndex: 0,
    isTerminal: true,
    next: '9ce841da-f791-41aa-a689-a16d0ff41a15'
};

export const recordTriggeredStartData = {
    availableConnections: [{ 0: { type: 'REGULAR' } }],
    childIndex: 0,
    childReferences: [],
    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
    connectorCount: 0,
    description: '',
    elementType: 'START_ELEMENT',
    filterLogic: 'and',
    filters: [
        {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: '',
            rowIndex: '9ac859a2-c6c8-4af3-80b3-7f55e812d2fa'
        }
    ],
    guid: 'c98408d0-e567-4211-b102-0d7e3ecbc671',
    isCanvasElement: true,
    isTerminal: true,
    locationX: 50,
    locationY: 50,
    maxConnections: 1,
    next: '3ed26255-254c-4d1c-a87b-470335f6c53b',
    object: '',
    objectIndex: '4c87d839-ec1a-4abc-b1ba-56d1e13c7e3e',
    parent: 'root',
    prev: null,
    hasContext: true,
    hasTrigger: true,
    recordTriggerType: 'Create',
    triggerType: 'RecordAfterSave'
};

export const scheduledTriggeredStartData = {
    availableConnections: [{ 0: { type: 'REGULAR' } }],
    childIndex: 0,
    childReferences: [],
    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
    connectorCount: 0,
    description: '',
    elementType: 'START_ELEMENT',
    filterLogic: 'and',
    filters: [
        {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: '',
            rowIndex: '9ac859a2-c6c8-4af3-80b3-7f55e812d2fa'
        }
    ],
    frequency: 'Once',
    guid: '8ce5df6b-b784-4cda-80bc-63a592825e3b',
    isCanvasElement: true,
    isTerminal: true,
    locationX: 50,
    locationY: 50,
    maxConnections: 1,
    next: '0d94fe83-122d-4aa7-b42b-8182cbec27e1',
    object: '',
    objectIndex: 'ba9ed2f9-2aa8-4d94-8941-99a2b3263a0f',
    parent: 'root',
    prev: null,
    triggerType: 'Scheduled'
};

export const recordTriggeredOrchestrationStartData = {
    availableConnections: [{ 0: { type: 'REGULAR' } }],
    childIndex: 0,
    childReferences: [],
    config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
    connectorCount: 0,
    description: '',
    elementType: 'START_ELEMENT',
    filterLogic: 'and',
    filters: [
        {
            leftHandSide: '',
            operator: '',
            rightHandSide: '',
            rightHandSideDataType: '',
            rowIndex: '9ac859a2-c6c8-4af3-80b3-7f55e812d2fa'
        }
    ],
    guid: 'c98408d0-e567-4211-b102-0d7e3ecbc671',
    isCanvasElement: true,
    isTerminal: true,
    locationX: 50,
    locationY: 50,
    maxConnections: 1,
    next: '3ed26255-254c-4d1c-a87b-470335f6c53b',
    object: '',
    objectIndex: '4c87d839-ec1a-4abc-b1ba-56d1e13c7e3e',
    parent: 'root',
    prev: null,
    recordTriggerType: 'Create',
    triggerType: 'RecordAfterSave'
};
