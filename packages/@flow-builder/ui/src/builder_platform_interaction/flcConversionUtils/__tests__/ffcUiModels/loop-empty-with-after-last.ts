export default {
    connectors: [
        {
            guid: 'start-element-guid -> loop-element-guid',
            source: 'start-element-guid',
            target: 'loop-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'loop-element-guid -> screen-after-last-element-guid',
            source: 'loop-element-guid',
            target: 'screen-after-last-element-guid',
            label: 'LOOP_END',
            type: 'LOOP_END',
            config: { isSelected: false }
        }
    ],
    canvasElements: ['loop-element-guid', 'screen-after-last-element-guid', 'start-element-guid'],
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 362,
            locationY: 48,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: false, isHighlighted: false },
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
            ]
        },
        'loop-element-guid': {
            guid: 'loop-element-guid',
            name: 'loop',
            description: '',
            label: 'loop',
            locationX: 488,
            locationY: 206,
            isCanvasElement: true,
            connectorCount: 1,
            config: { isSelected: true, isHighlighted: false },
            assignNextValueToReferenceIndex: 'a908350c-409c-4d2f-bbd3-b9c61e5932b9',
            collectionReference: '9b6730a5-ad83-46b9-80f0-f8bc2acb22ac',
            collectionReferenceIndex: '2b392712-4f34-45b1-8816-2b32ddfec6fc',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [{ type: 'LOOP_NEXT' }],
            elementType: 'Loop',
            storeOutputAutomatically: true,
            dataType: 'SObject',
            subtype: 'Account'
        },
        'screen-after-last-element-guid': {
            guid: 'screen-after-last-element-guid',
            description: '',
            locationX: 488,
            locationY: 422,
            isCanvasElement: true,
            connectorCount: 0,
            config: { isSelected: false, isHighlighted: false, isSelectable: true },
            elementType: 'Screen',
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
            ]
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
        }
    }
};
