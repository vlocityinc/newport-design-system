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
            next: 'loop-element-guid',
            parent: 'root',
            childIndex: 0,
            isTerminal: true
        },
        '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac': {
            guid: '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac',
            name: 'loopvar',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'feb3aafe-8c4a-41f0-a5ba-eb4369d407b6',
            scale: 2,
            defaultValueDataType: 'SObject',
            defaultValueIndex: '03ca68a5-efd6-4aa0-94a0-6fb9b4a92578'
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
            availableConnections: [],
            elementType: 'Loop',
            nodeType: 'loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account',
            prev: 'start-element-guid',
            next: 'end-element-guid (loop-element-guid)',
            children: ['loop-for-each-screen-element-guid']
        },
        'loop-for-each-screen-element-guid': {
            guid: 'loop-for-each-screen-element-guid',
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
            parent: 'loop-element-guid',
            childIndex: 0,
            isTerminal: false,
            prev: null,
            next: null
        },

        'end-element-guid (loop-element-guid)': {
            guid: 'end-element-guid (loop-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'loop-element-guid',
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
