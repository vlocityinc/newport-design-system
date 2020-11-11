export default {
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
            elementType: 'START_ELEMENT',
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

        'loop-element-guid': {
            guid: 'loop-element-guid',
            name: 'loop',
            description: '',
            label: 'loop',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
            assignNextValueToReferenceIndex: 'a908350c-409c-4d2f-bbd3-b9c61e5932b9',
            collectionReference: '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac',
            collectionReferenceIndex: '2b392712-4f34-45b1-8816-2b32ddfec6fc',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [],
            elementType: 'Loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account',
            prev: 'start-element-guid',
            next: 'end-element-guid (loop-element-guid)',
            children: ['nested-decision-element-guid']
        },
        'nested-decision-element-guid': {
            guid: 'nested-decision-element-guid',
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
            maxConnections: 2,
            childReferences: [
                {
                    childReference: 'outcome-element-guid'
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
        'end-element-guid (loop-element-guid)': {
            guid: 'end-element-guid (loop-element-guid)',
            elementType: 'END_ELEMENT',
            prev: 'loop-element-guid',
            next: null,
            isCanvasElement: true,
            config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
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
