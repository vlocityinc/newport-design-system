export default {
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            elementType: 'START_ELEMENT',
            nodeType: 'start',
            maxConnections: 1,
            triggerType: 'None',
            filterType: 'all',
            object: '',
            objectIndex: '2832cafc-39fc-41bf-95b1-c6d3881f6705',
            filters: [
                {
                    rowIndex: 'e7f9f0cf-3953-43b3-a578-3ddc8a10e4df',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            prev: null,
            next: 'decision-element-guid',
            parent: 'root',
            childIndex: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            isTerminal: true
        },
        'decision-element-guid': {
            guid: 'decision-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 2,
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [
                {
                    childReference: 'outcome-element-guid'
                }
            ],
            elementType: 'Decision',
            nodeType: 'branch',
            maxConnections: 2,
            availableConnections: [],
            next: 'screen-after-decision-element-guid',
            prev: 'start-element-guid',
            children: [null, 'decision-right-element-guid'],
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },

        'decision-right-element-guid': {
            guid: 'decision-right-element-guid',
            name: 'decision-right-element-guid',
            description: '',
            label: 'decision-right-element-guid',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 2,
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [
                {
                    childReference: 'outcome2-element-guid'
                }
            ],
            elementType: 'Decision',
            nodeType: 'branch',
            maxConnections: 2,
            availableConnections: [],
            next: null,
            prev: null,
            children: ['loop-element-guid', null],
            childIndex: 1,
            parent: 'decision-element-guid',
            isTerminal: false,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'loop-element-guid': {
            guid: 'loop-element-guid',
            name: 'loop',
            description: '',
            label: 'loop',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 2,
            config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
            assignNextValueToReferenceIndex: 'a908350c-409c-4d2f-bbd3-b9c61e5932b9',
            collectionReference: '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac',
            collectionReferenceIndex: '2b392712-4f34-45b1-8816-2b32ddfec6fc',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [],
            elementType: 'Loop',
            nodeType: 'loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account',
            prev: null,
            next: null,
            children: ['decision-in-loop-element-guid'],
            childIndex: 0,
            isTerminal: false,
            parent: 'decision-right-element-guid'
        },
        'decision-in-loop-element-guid': {
            guid: 'decision-in-loop-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
            connectorCount: 2,
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            nodeType: 'branch',
            maxConnections: 2,
            childReferences: [
                {
                    childReference: 'outcome3-element-guid'
                }
            ],
            availableConnections: [],
            next: null,
            prev: null,
            isTerminal: false,
            childIndex: 0,
            parent: 'loop-element-guid',
            children: [null, null]
        },

        'screen-after-decision-element-guid': {
            guid: 'screen-after-decision-element-guid',
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
            elementType: 'Screen',
            nodeType: 'default',
            maxConnections: 1,
            triggerType: 'None',
            filterType: 'all',
            object: '',
            objectIndex: '12c23e8e-4104-40ba-86e0-feb73e787792',
            filters: [
                {
                    rowIndex: 'cda83bda-2840-470c-aa57-1a8cfedee523',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            prev: 'decision-element-guid',
            next: 'end-element-guid (screen-after-decision-element-guid)'
        },
        'end-element-guid (screen-after-decision-element-guid)': {
            guid: 'end-element-guid (screen-after-decision-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'screen-after-decision-element-guid',
            next: null,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'outcome-element-guid': {
            guid: 'outcome-element-guid',
            name: 'd1out',
            label: 'd1out',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'cbf949b8-cb9c-4f36-931f-1b128912360d',
                    leftHandSide: '$Flow.CurrentRecord',
                    rightHandSide: 'a',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        'outcome2-element-guid': {
            guid: 'outcome2-element-guid',
            name: 'd2out',
            label: 'd2out',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'cbf949b8-cb9c-4f36-931f-1b128912360d',
                    leftHandSide: '$Flow.CurrentRecord',
                    rightHandSide: 'a',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        'outcome3-element-guid': {
            guid: 'outcome3-element-guid',
            name: 'd23out',
            label: 'd3out',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'cbf949b8-cb9c-4f36-931f-1b128912360d',
                    leftHandSide: '$Flow.CurrentRecord',
                    rightHandSide: 'a',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        root: {
            elementType: 'root',
            nodeType: 'root',
            guid: 'root',
            label: 'root',
            value: 'root',
            text: 'root',
            name: 'root',
            prev: null,
            next: null,
            children: ['start-element-guid']
        }
    },
    connectors: [],
    canvasElements: []
};
