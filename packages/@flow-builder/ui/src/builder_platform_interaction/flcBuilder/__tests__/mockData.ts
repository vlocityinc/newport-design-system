// @ts-nocheck
import { getDefaultLayoutConfig } from 'builder_platform_interaction/flowUtils';

const flowRenderInfo = {
    geometry: { x: 0, y: 0, w: 264, h: 144 },
    nodes: [
        {
            guid: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
            geometry: { x: 0, y: 0, w: 48, h: 144 },
            menuOpened: false,
            label: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
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
            nextConnector: {
                geometry: { x: 0, y: 0, w: 6, h: 144 },
                addInfo: { offsetY: 72, menuOpened: false },
                connectionInfo: {
                    prev: 'eb01a710-d341-4ba0-81d2-f7ef03300db5',
                    next: '837e0692-6f17-4d5c-ba5d-854851d31fcb'
                },
                svgInfo: { geometry: { x: -3, y: 0, w: 6, h: 144 }, path: 'M 3, 24\nL 3, 144' },
                labelOffsetY: 24,
                type: 'straight'
            }
        },
        {
            guid: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
            geometry: { x: 0, y: 144, w: 48, h: 0 },
            menuOpened: false,
            label: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
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
        next: '837e0692-6f17-4d5c-ba5d-854851d31fcb',
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
        canHaveFaultConnector: false
    },
    {
        section: 'Interaction',
        type: 'default',
        icon: 'standard:lightning_component',
        label: 'New Action',
        value: 'ActionCall',
        elementType: 'ActionCall',
        description:
            'Perform an action outside of the flow. Choose from your org’s custom create and update actions or an out-of-the-box action, like Post to Chatter or Submit for Approval.',
        canHaveFaultConnector: true
    },
    {
        section: 'Flow Control',
        type: 'branch',
        icon: 'standard:decision',
        label: 'Decision',
        value: 'Decision',
        elementType: 'Decision',
        description: 'Create paths for the flow to take based on conditions you set.',
        canHaveFaultConnector: false
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
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_create',
        label: 'RecordCreate',
        value: 'RecordCreate',
        elementType: 'RecordCreate',
        description: 'Create Salesforce records using values from the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_update',
        label: 'RecordUpdate',
        value: 'RecordUpdate',
        elementType: 'RecordUpdate',
        description: 'Find Salesforce records, and store their field values to use later in the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_lookup',
        label: 'RecordQuery',
        value: 'RecordQuery',
        elementType: 'RecordQuery',
        description: 'Update Salesforce records using values from the flow.',
        canHaveFaultConnector: true
    },
    {
        section: 'Data Operation',
        type: 'default',
        icon: 'standard:record_delete',
        label: 'RecordDelete',
        value: 'RecordDelete',
        elementType: 'RecordDelete',
        description: 'Delete Salesforce records.',
        canHaveFaultConnector: true
    },
    {
        section: null,
        icon: 'utility:right',
        label: 'Start',
        value: 'START_ELEMENT',
        elementType: 'START_ELEMENT',
        type: 'start',
        canHaveFaultConnector: false
    },
    {
        section: null,
        icon: '',
        label: '',
        elementType: 'root',
        value: 'root',
        type: 'root',
        canHaveFaultConnector: false
    },
    {
        section: 'Logic',
        icon: 'standard:first_non_empty',
        description: 'End Description',
        label: 'End',
        value: 'END_ELEMENT',
        elementType: 'END_ELEMENT',
        type: 'end',
        canHaveFaultConnector: false
    }
];

const nodeLayoutMap = {
    'root:0': {
        prevLayout: { x: 0, y: 0, w: 0, h: 0, joinOffsetY: 0, offsetX: 0 },
        layout: { x: 0, y: 0, w: 264, h: 144, joinOffsetY: 0, offsetX: 88 }
    },
    'eb01a710-d341-4ba0-81d2-f7ef03300db5': { layout: { w: 264, h: 144, y: 0, x: 0, joinOffsetY: 0, offsetX: 88 } },
    '837e0692-6f17-4d5c-ba5d-854851d31fcb': { layout: { w: 264, h: 0, y: 144, x: 0, joinOffsetY: 0, offsetX: 88 } }
};

export { flowRenderInfo, flowModel, elementsMetadata, nodeLayoutMap };
