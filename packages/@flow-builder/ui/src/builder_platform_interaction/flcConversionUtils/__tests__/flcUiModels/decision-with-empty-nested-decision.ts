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
            isTerminal: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'decision-element-guid': {
            guid: 'decision-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            childReferences: [
                {
                    childReference: 'outcome-element-guid'
                }
            ],
            availableConnections: [
                {
                    type: 'DEFAULT'
                }
            ],
            next: 'end-element-guid (decision-element-guid)',
            prev: 'start-element-guid',
            children: ['nested-decision-element-guid', null],
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'nested-decision-element-guid': {
            guid: 'nested-decision-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 0,
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            childReferences: [
                {
                    childReference: 'outcome2-element-guid'
                }
            ],
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'outcome2-element-guid'
                },
                {
                    type: 'DEFAULT'
                }
            ],
            next: null,
            prev: null,
            parent: 'decision-element-guid',
            childIndex: 0,
            isTerminal: false,
            children: [null, null],
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'end-element-guid (decision-element-guid)': {
            guid: 'end-element-guid (decision-element-guid)',
            elementType: 'END_ELEMENT',
            prev: 'decision-element-guid',
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
