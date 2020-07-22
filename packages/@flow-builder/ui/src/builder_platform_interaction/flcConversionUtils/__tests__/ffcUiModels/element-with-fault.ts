export default {
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 368,
            locationY: 48,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: false, isHighlighted: false, isSelectable: true },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterType: 'all',
            object: '',
            objectIndex: '12c23e8e-4104-40ba-86e0-feb73e787792',
            filters: []
        },
        'record-create-element-guid': {
            guid: 'record-create-element-guid',
            description: '',
            locationX: 488,
            locationY: 144,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: false, isHighlighted: false, isSelectable: true },
            elementType: 'RecordCreate',
            maxConnections: 2,
            triggerType: 'None',
            filterType: 'all',
            object: '',
            objectIndex: '12c23e8e-4104-40ba-86e0-feb73e787792',
            filters: [],
            availableConnections: []
        },
        'fault-element-guid': {
            guid: 'fault-element-guid',
            description: '',
            locationX: 752,
            locationY: 264,
            isCanvasElement: true,
            connectorCount: 0,
            config: { isSelected: false, isHighlighted: false, isSelectable: true },
            elementType: 'RecordCreate',
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
            filters: []
        }
    },
    connectors: [
        {
            guid: 'start-element-guid -> record-create-element-guid',
            source: 'start-element-guid',
            target: 'record-create-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'record-create-element-guid -> fault-element-guid',
            source: 'record-create-element-guid',
            target: 'fault-element-guid',
            label: 'FAULT',
            type: 'FAULT',
            config: { isSelected: false }
        }
    ],
    canvasElements: ['fault-element-guid', 'record-create-element-guid', 'start-element-guid']
};
