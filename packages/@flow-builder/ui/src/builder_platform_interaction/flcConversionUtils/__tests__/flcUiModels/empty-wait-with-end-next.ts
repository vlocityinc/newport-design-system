export default {
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 0,
            elementType: 'START_ELEMENT',
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
            next: 'wait-element-guid',
            parent: 'root',
            childIndex: 0,
            isTerminal: false
        },
        'wait-element-guid': {
            guid: 'wait-element-guid',
            name: 'WAIT',
            description: '',
            label: 'WAIT',
            locationX: 459,
            locationY: 267,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false
            },
            childReferences: [
                {
                    childReference: 'outcome-element-guid'
                }
            ],
            elementType: 'Wait',
            defaultConnectorLabel: 'Default Path',
            maxConnections: 3,
            availableConnections: [
                {
                    type: 'FAULT'
                },
                {
                    type: 'REGULAR',
                    childReference: 'outcome-element-guid'
                },
                {
                    type: 'DEFAULT'
                }
            ],
            next: 'end-element-guid (wait-element-guid)',
            prev: 'start-element-guid',
            children: [null, null]
        },
        'end-element-guid (wait-element-guid)': {
            guid: 'end-element-guid (wait-element-guid)',
            elementType: 'END_ELEMENT',
            prev: 'wait-element-guid',
            next: null,
            isCanvasElement: true
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
        root: {
            elementType: 'root',
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
