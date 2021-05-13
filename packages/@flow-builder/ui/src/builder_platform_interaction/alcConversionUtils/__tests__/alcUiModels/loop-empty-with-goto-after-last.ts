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
            filterLogic: 'and',
            object: '',
            objectIndex: '302495a2-9a77-4bc5-9d7d-3c950b3f3ed6',
            filters: [
                {
                    rowIndex: 'de73a395-bf22-4788-b72d-c01ce7e2ed4d',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            prev: null,
            next: 'screen-element-guid',
            parent: 'root',
            childIndex: 0,
            isTerminal: true
        },
        'screen-element-guid': {
            guid: 'screen-element-guid',
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
            prev: 'start-element-guid',
            next: 'loop-element-guid',
            incomingGoTo: ['loop-element-guid']
        },
        'loop-element-guid': {
            guid: 'loop-element-guid',
            name: 'loop',
            description: '',
            label: 'loop',
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
            assignNextValueToReferenceIndex: 'a908350c-409c-4d2f-bbd3-b9c61e5932b9',
            collectionReference: '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac',
            collectionReferenceIndex: '2b392712-4f34-45b1-8816-2b32ddfec6fc',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [{ type: 'LOOP_NEXT' }],
            elementType: 'Loop',
            nodeType: 'loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account',
            prev: 'start-element-guid',
            next: 'screen-element-guid',
            children: [null]
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
