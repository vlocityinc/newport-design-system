export default {
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
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
            elementType: 'START_ELEMENT',
            nodeType: 'start',
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
            prev: null,
            next: 'record-create-element-guid',
            parent: 'root',
            childIndex: 0,
            isTerminal: true
        },
        'record-create-element-guid': {
            guid: 'record-create-element-guid',
            description: '',
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
            elementType: 'RecordCreate',
            nodeType: 'default',
            maxConnections: 2,
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
            availableConnections: [],
            fault: 'fault-element-guid',
            prev: 'start-element-guid',
            next: 'end-element-guid (record-create-element-guid)'
        },
        'fault-element-guid': {
            guid: 'fault-element-guid',
            parent: 'record-create-element-guid',
            childIndex: -1,
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
            elementType: 'RecordCreate',
            nodeType: 'default',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            triggerType: 'None',
            filterType: 'all',
            object: '',
            objectIndex: '92c23e8e-4104-40ba-86e0-feb73e787792',
            filters: [
                {
                    rowIndex: 'dda83bda-2840-470c-aa57-1a8cfedee523',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            prev: null,
            next: 'end-element-guid (fault-element-guid)',
            isTerminal: true
        },
        'end-element-guid (fault-element-guid)': {
            guid: 'end-element-guid (fault-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'fault-element-guid',
            next: null,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'end-element-guid (record-create-element-guid)': {
            guid: 'end-element-guid (record-create-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'record-create-element-guid',
            next: null,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
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
