// @ts-nocheck
import { getDefaultLayoutConfig } from 'builder_platform_interaction/autoLayoutCanvas';

const flowRenderInfo = {
    geometry: { x: 0, y: 0, w: 264, h: 144 },
    nodes: [
        {
            guid: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
            geometry: { x: 0, y: 0, w: 48, h: 144 },
            metadata: {
                section: null,
                icon: 'utility:right',
                label: 'Start',
                value: 'START_ELEMENT',
                elementType: 'START_ELEMENT',
                type: 'start',
                canHaveFaultConnector: false
            },
            config: { isSelected: false, isHighlighted: false, canSelect: true },
            flows: [],
            isNew: false,
            logicConnectors: [],
            isTerminal: false,
            node: {},
            nextConnector: {
                geometry: { x: 0, y: 0, w: 6, h: 144 },
                addInfo: { offsetY: 72, menuOpened: false },
                source: {
                    guid: 'eb01a710-d341-4ba0-81d2-f7ef03300db5'
                },
                svgInfo: { geometry: { x: -3, y: 0, w: 6, h: 144 }, path: 'M 3, 24\nL 3, 144' },
                labelOffsetY: 24,
                type: 'straight'
            }
        },
        {
            guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
            geometry: { x: 0, y: 144, w: 48, h: 0 },
            metadata: {
                section: 'Logic',
                icon: 'standard:first_non_empty',
                description: 'End Description',
                label: 'End',
                value: 'END_ELEMENT',
                elementType: 'END_ELEMENT',
                type: 'end',
                canHaveFaultConnector: false
            },
            config: { isSelected: false, isHighlighted: false, canSelect: true },
            flows: [],
            isNew: false,
            logicConnectors: [],
            isTerminal: true
        }
    ],
    isTerminal: true,
    layoutConfig: getDefaultLayoutConfig()
};

const flowModel = {
    'eb01a710-d341-4ba0-81d2-f7ef03300db5': {
        guid: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
        description: '',
        next: '837e0692-6f17-4d5c-ba5d-854851d31f99',
        prev: null,
        locationX: 50,
        locationY: 50,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'None',
        filterType: 'all',
        object: '',
        objectIndex: '7b70630f-6fb3-44a4-a5ac-095f55f7a007',
        filters: [
            {
                rowIndex: '423543d4-dbc7-46eb-9266-0be65fb4fde8',
                leftHandSide: '',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: ''
            }
        ],
        parent: 'root',
        childIndex: 0,
        isTerminal: false
    },
    root: {
        elementType: 'root',
        guid: 'root',
        label: 'root',
        value: 'root',
        text: 'root',
        name: 'root',
        prev: null,
        next: null,
        children: ['eb01a710-d341-4ba0-81d2-f7ef03300db5']
    },
    '837e0692-6f17-4d5c-ba5d-854851d31fcb': {
        guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
        name: 'END_ELEMENT',
        description: '',
        next: null,
        prev: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
        label: null,
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT'
    },
    '837e0692-6f17-4d5c-ba5d-854851d31f99': {
        guid: '837e0692-6f17-4d5c-ba5d-854851d31f99',
        name: 'ORCHESTRATED_STAGE',
        childReferences: [
            { childReference: '369e5cef-f661-460a-a0ae-ab2ed95fed03' },
            { childReference: 'f509c9e4-32a6-47cb-aa7a-9b02fe3c9715' }
        ],
        description: '',
        next: '1c397973-762d-443f-9780-2b9777b6d6a3',
        prev: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
        label: null,
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: { isSelected: false, isHighlighted: false, canSelect: true },
        elementType: 'orchestratedstage',
        value: 'orchestratedstage',
        text: 'orchestratedstage'
    },
    '369e5cef-f661-460a-a0ae-ab2ed95fed03': {
        guid: '369e5cef-f661-460a-a0ae-ab2ed95fed03',
        name: 'STAGE_STEP',
        elementType: 'STAGE_STEP',
        dataType: 'STAGE_STEP',
        label: 'Step 1 of Stage 1'
    },
    'f509c9e4-32a6-47cb-aa7a-9b02fe3c9715': {
        guid: 'f509c9e4-32a6-47cb-aa7a-9b02fe3c9715',
        name: 'STAGE_STEP_2',
        elementType: 'STAGE_STEP',
        dataType: 'STAGE_STEP',
        label: 'Step 2 of Stage 1'
    },
    '1c397973-762d-443f-9780-2b9777b6d6a3': {
        availableConnections: [],
        childReferences: [
            { childReference: 'ab8019d9-98fd-445e-9726-a08f6ec545f2' },
            { childReference: '58263090-23c4-4531-b670-ef13fa3412c0' }
        ],
        children: ['4b54cd8b-6bba-407b-a02b-c2129290162e', null, null],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 3,
        defaultConnectorLabel: 'Default Outcome',
        description: '',
        elementType: 'Decision',
        guid: '1c397973-762d-443f-9780-2b9777b6d6a3',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 'd1',
        locationX: 0,
        locationY: 0,
        maxConnections: 3,
        name: 'd1',
        next: '4b54cd8b-6bba-407b-a02b-c2129290162e',
        nodeType: 'branch',
        prev: '993322be-f3a9-4f14-94ba-1f7876a3bc5d'
    },
    '4b54cd8b-6bba-407b-a02b-c2129290162e': {
        availableConnections: [],
        childReferences: [
            { childReference: 'f1b4e6eb-b13d-4db4-b89b-6ed0213e9449' },
            { childReference: '4a5eb4ef-b35c-47f3-ae22-aa5d59ae2ac1' }
        ],
        children: [
            'fc08cac6-a5e3-4a0c-8c5e-c19c450fcfae',
            'fb4c2394-d6fb-4d0a-8d79-69ee3d4f1706',
            '4abdffa3-0ae6-4ea9-bdbc-a1dd6402b629'
        ],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 3,
        defaultConnectorLabel: 'Default Outcome',
        description: '',
        elementType: 'Decision',
        guid: '4b54cd8b-6bba-407b-a02b-c2129290162e',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 'd2',
        locationX: 0,
        locationY: 0,
        maxConnections: 3,
        name: 'd2',
        next: null,
        nodeType: 'branch',
        parent: '1c397973-762d-443f-9780-2b9777b6d6a3',
        prev: null,
        isTerminal: true
    },
    '993322be-f3a9-4f14-94ba-1f7876a3bc5d': {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        childReferences: [],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 1,
        description: '',
        elementType: 'Screen',
        guid: '993322be-f3a9-4f14-94ba-1f7876a3bc5d',
        helpText: '',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 's1',
        locationX: 0,
        locationY: 0,
        maxConnections: 1,
        name: 's1',
        next: '1a58efd4-a3fc-414d-9b51-589fa2bede7a',
        nodeType: 'default',
        pausedText: '',
        prev: '1c397973-762d-443f-9780-2b9777b6d6a3',
        showFooter: true,
        showHeader: true
    },
    '4a5eb4ef-b35c-47f3-ae22-aa5d59ae2ac1': {
        conditionLogic: 'and',
        conditions: [],
        dataType: 'Boolean',
        doesRequireRecordChangedToMeetCriteria: false,
        elementType: 'OUTCOME',
        guid: '4a5eb4ef-b35c-47f3-ae22-aa5d59ae2ac1',
        label: 'o4',
        name: 'o4'
    },
    '58263090-23c4-4531-b670-ef13fa3412c0': {
        conditionLogic: 'and',
        conditions: [],
        dataType: 'Boolean',
        doesRequireRecordChangedToMeetCriteria: false,
        elementType: 'OUTCOME',
        guid: '58263090-23c4-4531-b670-ef13fa3412c0',
        label: 'o2',
        name: 'o2'
    },
    'ab8019d9-98fd-445e-9726-a08f6ec545f2': {
        conditionLogic: 'and',
        conditions: [],
        dataType: 'Boolean',
        doesRequireRecordChangedToMeetCriteria: false,
        elementType: 'OUTCOME',
        guid: 'ab8019d9-98fd-445e-9726-a08f6ec545f2',
        label: 'o1',
        name: 'o1'
    },
    'f1b4e6eb-b13d-4db4-b89b-6ed0213e9449': {
        conditionLogic: 'and',
        conditions: [],
        dataType: 'Boolean',
        doesRequireRecordChangedToMeetCriteria: false,
        elementType: 'OUTCOME',
        guid: 'f1b4e6eb-b13d-4db4-b89b-6ed0213e9449',
        label: 'o3',
        name: 'o3'
    },
    '1a58efd4-a3fc-414d-9b51-589fa2bede7a': {
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 0,
        description: '',
        elementType: 'END_ELEMENT',
        guid: '1a58efd4-a3fc-414d-9b51-589fa2bede7a',
        isCanvasElement: true,
        label: 'End',
        locationX: 0,
        locationY: 0,
        name: 'END_ELEMENT',
        nodeType: 'end',
        prev: '993322be-f3a9-4f14-94ba-1f7876a3bc5d',
        text: 'END_ELEMENT',
        value: 'END_ELEMENT'
    },
    '9731c397-443f-9780-762d-d6a32b9777b6': {
        availableConnections: [],
        childReferences: [{ childReference: 'a1dd6402b629-4abdffa3-0ae6-4ea9-bdbc' }],
        children: ['a1dd6402b629-4abdffa3-0ae6-4ea9-bdbc', null, null],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 3,
        defaultConnectorLabel: 'Default Outcome',
        description: '',
        elementType: 'Decision',
        guid: '9731c397-443f-9780-762d-d6a32b9777b6',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 'd3',
        locationX: 0,
        locationY: 0,
        maxConnections: 3,
        name: 'd3',
        next: 'a1dd6402b629-4abdffa3-0ae6-4ea9-bdbc',
        nodeType: 'branch',
        prev: '1a58efd4-a3fc-414d-9b51-589fa2bede7a'
    },
    'a1dd6402b629-4abdffa3-0ae6-4ea9-bdbc': {
        childIndex: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 0,
        description: '',
        elementType: 'END_ELEMENT',
        guid: 'a1dd6402b629-4abdffa3-0ae6-4ea9-bdbc',
        isCanvasElement: true,
        isTerminal: true,
        label: 'End',
        locationX: 0,
        locationY: 0,
        name: 'END_ELEMENT',
        nodeType: 'end',
        parent: '9731c397-443f-9780-762d-d6a32b9777b6',
        prev: null,
        text: 'END_ELEMENT',
        value: 'END_ELEMENT'
    },
    '4abdffa3-0ae6-4ea9-bdbc-a1dd6402b629': {
        childIndex: 2,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 0,
        description: '',
        elementType: 'END_ELEMENT',
        guid: '4abdffa3-0ae6-4ea9-bdbc-a1dd6402b629',
        isCanvasElement: true,
        isTerminal: true,
        label: 'End',
        locationX: 0,
        locationY: 0,
        name: 'END_ELEMENT',
        nodeType: 'end',
        parent: '4b54cd8b-6bba-407b-a02b-c2129290162e',
        prev: null,
        text: 'END_ELEMENT',
        value: 'END_ELEMENT'
    },
    'fb4c2394-d6fb-4d0a-8d79-69ee3d4f1706': {
        childIndex: 1,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 0,
        description: '',
        elementType: 'END_ELEMENT',
        guid: 'fb4c2394-d6fb-4d0a-8d79-69ee3d4f1706',
        isCanvasElement: true,
        isTerminal: true,
        label: 'End',
        locationX: 0,
        locationY: 0,
        name: 'END_ELEMENT',
        nodeType: 'end',
        parent: '4b54cd8b-6bba-407b-a02b-c2129290162e',
        prev: null,
        text: 'END_ELEMENT',
        value: 'END_ELEMENT'
    },
    'fc08cac6-a5e3-4a0c-8c5e-c19c450fcfae': {
        childIndex: 0,
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 0,
        description: '',
        elementType: 'END_ELEMENT',
        guid: 'fc08cac6-a5e3-4a0c-8c5e-c19c450fcfae',
        isCanvasElement: true,
        isTerminal: true,
        label: 'End',
        locationX: 0,
        locationY: 0,
        name: 'END_ELEMENT',
        nodeType: 'end',
        parent: '4b54cd8b-6bba-407b-a02b-c2129290162e',
        prev: null,
        text: 'END_ELEMENT',
        value: 'END_ELEMENT'
    },
    'screen-one': {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        childReferences: [],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 1,
        description: '',
        elementType: 'Screen',
        guid: 'screen-one',
        helpText: '',
        incomingGoTo: ['decision', 'decision:default'],
        isCanvasElement: true,
        label: 'screen-one',
        locationX: 0,
        locationY: 0,
        maxConnections: 1,
        name: 'screen-one',
        next: 'decision',
        nodeType: 'default',
        pausedText: '',
        prev: null,
        showFooter: true,
        showHeader: true,
        parent: 'root'
    },
    decision: {
        availableConnections: [],
        childReferences: [{ childReference: 'o1' }, { childReference: 'o2' }],
        children: [null, 'screen-two', 'screen-one'],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 3,
        defaultConnectorLabel: 'Default Outcome',
        description: '',
        elementType: 'Decision',
        guid: 'decision',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 'decision',
        locationX: 0,
        locationY: 0,
        maxConnections: 3,
        name: 'decision',
        next: 'screen-one',
        nodeType: 'branch',
        prev: 'screen-one'
    },
    'screen-two': {
        allowBack: true,
        allowFinish: true,
        allowPause: true,
        childReferences: [],
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        connectorCount: 1,
        description: '',
        elementType: 'Screen',
        guid: 'screen-two',
        helpText: '',
        incomingGoTo: [],
        isCanvasElement: true,
        label: 'screen-two',
        locationX: 0,
        locationY: 0,
        maxConnections: 1,
        name: 'screen-two',
        next: null,
        nodeType: 'default',
        pausedText: '',
        prev: null,
        parent: 'decision',
        childIndex: 1,
        isTerminal: false,
        showFooter: true,
        showHeader: true
    }
};

const elementsMetadata = [
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:screen',
        label: 'Screen',
        value: 'Screen',
        elementType: 'Screen',
        description: 'Collect information from users who run the flow or show them some information.',
        canHaveFaultConnector: false,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:lightning_component',
        label: 'New Action',
        value: 'ActionCall',
        elementType: 'ActionCall',
        description:
            'Perform an action outside of the flow. Choose from your orgs custom create and update actions or an out-of-the-box action, like Post to Chatter or Submit for Approval.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:custom_notification',
        label: 'Send Email',
        value: 'ActionCall',
        actionIsStandard: true,
        actionName: 'emailSimple',
        actionType: 'emailSimple',
        elementType: 'ActionCall',
        description: 'Send an email where you specify the subject, body, and recipients.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:custom_notification',
        label: 'Send Email',
        value: 'ActionCall',
        actionIsStandard: false,
        actionName: 'emailAlert',
        actionType: 'emailAlert',
        elementType: 'ActionCall',
        description:
            "Perform an action outside of the flow. Choose from your org's custom create and update actions or an out-of-the-box action, like Post to Chatter or Submit for Approval.",
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Flow Control',
        type: 'branch',
        icon: 'standard:decision',
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create paths for the flow to take based on conditions you set.',
        canHaveFaultConnector: false,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Flow Control',
        type: 'branch',
        icon: 'standard:waits',
        label: 'Pause',
        value: 'Wait',
        elementType: 'Wait',
        description:
            'Pause the flow. Resume the flow when the org receives a platform event message or a specified day, date, or time occurs.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_create',
        label: 'RecordCreate',
        value: 'RecordCreate',
        elementType: 'RecordCreate',
        description: 'Create Salesforce records using values from the flow.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_update',
        label: 'RecordUpdate',
        value: 'RecordUpdate',
        elementType: 'RecordUpdate',
        description: 'Find Salesforce records, and store their field values to use later in the flow.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_lookup',
        label: 'RecordQuery',
        value: 'RecordQuery',
        elementType: 'RecordQuery',
        description: 'Update Salesforce records using values from the flow.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_delete',
        label: 'RecordDelete',
        value: 'RecordDelete',
        elementType: 'RecordDelete',
        description: 'Delete Salesforce records.',
        canHaveFaultConnector: true,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: null,
        icon: 'utility:right',
        label: 'Start',
        value: 'START_ELEMENT',
        elementType: 'START_ELEMENT',
        type: 'start',
        canHaveFaultConnector: false,
        menuComponent: 'builder_platform_interaction/alcStartMenu'
    },
    {
        section: null,
        icon: '',
        label: '',
        elementType: 'root',
        value: 'root',
        type: 'root',
        canHaveFaultConnector: false,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Logic',
        icon: 'standard:first_non_empty',
        description: 'End Description',
        label: 'End',
        value: 'END_ELEMENT',
        elementType: 'END_ELEMENT',
        type: 'end',
        canHaveFaultConnector: false,
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    },
    {
        section: 'Interaction',
        type: 'orchestratedstage',
        icon: 'standard:screen',
        label: 'orchestratedStage',
        value: 'orchestratedstage',
        elementType: 'orchestratedstage',
        description: 'stepped stage desc',
        canHaveFaultConnector: false,

        dynamicNodeComponent: 'builder_platform_interaction/orchestratedStageNode',
        menuComponent: 'builder_platform_interaction/alcNodeMenu'
    }
];

const flowModelForCutPaste = {
    '120d0803-8a95-4426-a94c-d05ccd659a30': {
        guid: '120d0803-8a95-4426-a94c-d05ccd659a30',
        description: '',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'None',
        filterLogic: 'and',
        object: '',
        objectIndex: '07fb6364-1095-4289-b1ec-14927be543e7',
        filters: [
            {
                rowIndex: '107175d6-9671-43b8-ad19-e24e60fd718c',
                leftHandSide: '',
                leftHandSideDataType: 'String',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: ''
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false,
        childReferences: [],
        availableConnections: [],
        shouldSupportScheduledPaths: false,
        nodeType: 'start',
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        prev: null,
        next: '18aba28f-2c12-4b91-8c2f-6ad072f965d5'
    },
    '1607fa9e-b891-4561-8c3a-010d1b28b961': {
        guid: '1607fa9e-b891-4561-8c3a-010d1b28b961',
        name: 'action1',
        description: '',
        label: 'action1',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 2,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: true,
        actionType: 'activateSessionPermSet',
        actionName: 'activateSessionPermSet',
        dataTypeMappings: [],
        inputParameters: [
            {
                rowIndex: '170c704d-cd2f-4e64-a534-aa607b7a2774',
                name: 'PermSetName',
                value: '$GlobalConstant.EmptyString',
                valueDataType: 'String',
                subtype: '',
                isCollection: false
            }
        ],
        outputParameters: [],
        availableConnections: [],
        maxConnections: 2,
        elementType: 'ActionCall',
        dataType: 'Boolean',
        storeOutputAutomatically: false,
        flowTransactionModel: 'CurrentTransaction',
        nodeType: 'default',
        prev: '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1',
        incomingGoTo: [],
        next: '5bd5d9f3-24e1-4229-a189-8f64b348c1c6',
        fault: '251d5bef-93da-4c9f-9633-836627ddc435'
    },
    '16d19a1c-8586-4ef7-9df0-0d1fde6bbf43': {
        guid: '16d19a1c-8586-4ef7-9df0-0d1fde6bbf43',
        name: 'as12',
        description: '',
        label: 'as12',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: '4069ac58-c4d2-49b6-8c46-476bb497e68d',
                leftHandSide: 'ffbc8991-fe13-4610-aaf4-2825ec1161cf',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        prev: 'cedbc6ae-5fb1-4dd0-b3f6-38588bb9d340',
        incomingGoTo: [],
        next: null
    },
    '18aba28f-2c12-4b91-8c2f-6ad072f965d5': {
        guid: '18aba28f-2c12-4b91-8c2f-6ad072f965d5',
        name: 'as14',
        description: '',
        label: 'as14',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: '54e65720-e1ff-4739-b24a-19ea190182f6',
                leftHandSide: '$Flow.CurrentStage',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        prev: '120d0803-8a95-4426-a94c-d05ccd659a30',
        incomingGoTo: ['251d5bef-93da-4c9f-9633-836627ddc435'],
        next: '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1'
    },
    '312230b4-e05c-4959-8037-b7e705be9f90': {
        guid: '312230b4-e05c-4959-8037-b7e705be9f90',
        name: 'as14_0',
        description: '',
        label: 'as14',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: 'e7487dda-d2d6-4751-83c1-116676a6cdab',
                leftHandSide: '$Flow.CurrentStage',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        parent: '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1',
        childIndex: 2,
        isTerminal: false,
        prev: null,
        incomingGoTo: [],
        next: null
    },
    '251d5bef-93da-4c9f-9633-836627ddc435': {
        guid: '251d5bef-93da-4c9f-9633-836627ddc435',
        name: 'as91',
        description: '',
        label: 'as91',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: 'e64c083c-9025-415f-8eca-39d805981df7',
                leftHandSide: '$Flow.ActiveStages',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        parent: '1607fa9e-b891-4561-8c3a-010d1b28b961',
        childIndex: -1,
        isTerminal: true,
        prev: null,
        incomingGoTo: [],
        next: '18aba28f-2c12-4b91-8c2f-6ad072f965d5'
    },
    'fcacb788-0d60-4408-b2ee-653d13b69879': {
        guid: 'fcacb788-0d60-4408-b2ee-653d13b69879',
        name: 'Copy_1_of_as14',
        description: '',
        label: 'Copy 1 of as14',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 1,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: '0af463e4-60f2-4a8f-b6bb-a6c3c339dcbc',
                leftHandSide: '$Flow.CurrentStage',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        parent: 'cedbc6ae-5fb1-4dd0-b3f6-38588bb9d340',
        childIndex: 0,
        isTerminal: true,
        prev: null,
        incomingGoTo: [],
        next: '8c4fd6fc-1212-470b-b804-0bc94e980bb2'
    },
    '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1': {
        guid: '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1',
        name: 'd1',
        description: '',
        label: 'd1',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 3,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        childReferences: [
            {
                childReference: 'df5ef5a2-4fef-479d-afa8-c900612c129c'
            },
            {
                childReference: '7eda467b-bea9-409c-be0b-c6435ee2de7c'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        maxConnections: 3,
        availableConnections: [],
        nodeType: 'branch',
        prev: '18aba28f-2c12-4b91-8c2f-6ad072f965d5',
        incomingGoTo: [],
        next: '1607fa9e-b891-4561-8c3a-010d1b28b961',
        children: ['cedbc6ae-5fb1-4dd0-b3f6-38588bb9d340', null, '312230b4-e05c-4959-8037-b7e705be9f90']
    },
    'df5ef5a2-4fef-479d-afa8-c900612c129c': {
        guid: 'df5ef5a2-4fef-479d-afa8-c900612c129c',
        name: 'X1',
        label: '1',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: '8841c5e7-567c-4537-93ce-678611c08857',
                leftHandSide: '16d19a1c-8586-4ef7-9df0-0d1fde6bbf43',
                rightHandSide: '$GlobalConstant.False',
                rightHandSideDataType: 'Boolean',
                operator: 'WasVisited'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    '7eda467b-bea9-409c-be0b-c6435ee2de7c': {
        guid: '7eda467b-bea9-409c-be0b-c6435ee2de7c',
        name: 'X2',
        label: '2',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: 'e7a31405-641f-4a46-9e32-04c694946e3f',
                leftHandSide: '$Flow.InterviewStartTime',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'EqualTo'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    'cedbc6ae-5fb1-4dd0-b3f6-38588bb9d340': {
        guid: 'cedbc6ae-5fb1-4dd0-b3f6-38588bb9d340',
        name: 'd1_0',
        description: '',
        label: 'd1',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 3,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        childReferences: [
            {
                childReference: '703fb1e3-b85a-40b1-bda5-010f5a416237'
            },
            {
                childReference: '93555080-06ef-4fc6-8a57-d7070b301e26'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        maxConnections: 3,
        availableConnections: [],
        nodeType: 'branch',
        parent: '9b9b2768-ff4f-4b6d-8027-bdb47e8afdc1',
        childIndex: 0,
        isTerminal: false,
        prev: null,
        incomingGoTo: [],
        next: '16d19a1c-8586-4ef7-9df0-0d1fde6bbf43',
        children: ['fcacb788-0d60-4408-b2ee-653d13b69879', null, null]
    },
    '703fb1e3-b85a-40b1-bda5-010f5a416237': {
        guid: '703fb1e3-b85a-40b1-bda5-010f5a416237',
        name: 'X1_0',
        label: '1',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: 'f44c5a7e-0f19-4ddb-b8d0-a2426b4d4f9c',
                leftHandSide: '16d19a1c-8586-4ef7-9df0-0d1fde6bbf43',
                rightHandSide: '$GlobalConstant.False',
                rightHandSideDataType: 'Boolean',
                operator: 'WasVisited'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    '93555080-06ef-4fc6-8a57-d7070b301e26': {
        guid: '93555080-06ef-4fc6-8a57-d7070b301e26',
        name: 'X2_0',
        label: '2',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: '14fa3f2e-a62a-4ae3-9459-abbac51b1b97',
                leftHandSide: '$Flow.InterviewStartTime',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'EqualTo'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    'ffbc8991-fe13-4610-aaf4-2825ec1161cf': {
        guid: 'ffbc8991-fe13-4610-aaf4-2825ec1161cf',
        name: 'loopvar',
        description: '',
        elementType: 'Variable',
        isCollection: true,
        isInput: false,
        isOutput: false,
        dataType: 'String',
        subtype: null,
        subtypeIndex: 'e23e75dd-6aff-4d34-8c28-570a12f2b49a',
        scale: 0,
        defaultValue: null,
        defaultValueDataType: null,
        defaultValueIndex: '94f56de9-808f-4f2a-8057-6c8b018ed550'
    },
    '5bd5d9f3-24e1-4229-a189-8f64b348c1c6': {
        guid: '5bd5d9f3-24e1-4229-a189-8f64b348c1c6',
        name: 'END_ELEMENT',
        description: '',
        label: 'End',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: '1607fa9e-b891-4561-8c3a-010d1b28b961'
    },
    '8c4fd6fc-1212-470b-b804-0bc94e980bb2': {
        guid: '8c4fd6fc-1212-470b-b804-0bc94e980bb2',
        name: 'END_ELEMENT',
        description: '',
        label: 'End',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'fcacb788-0d60-4408-b2ee-653d13b69879'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['120d0803-8a95-4426-a94c-d05ccd659a30']
    }
};

const nodeLayoutMap = {
    'root:0': {
        prevLayout: { x: 0, y: 0, w: 0, h: 0, joinOffsetY: 0, offsetX: 0 },
        layout: { x: 0, y: 0, w: 264, h: 144, joinOffsetY: 0, offsetX: 88 }
    },
    'eb01a710-d341-4ba0-81d2-f7ef03300db5': { layout: { w: 264, h: 144, y: 0, x: 0, joinOffsetY: 0, offsetX: 88 } },
    '837e0692-6f17-4d5c-ba5d-854851d31fcb': { layout: { w: 264, h: 0, y: 144, x: 0, joinOffsetY: 0, offsetX: 88 } }
};

export { flowRenderInfo, flowModel, flowModelForCutPaste, elementsMetadata, nodeLayoutMap };
