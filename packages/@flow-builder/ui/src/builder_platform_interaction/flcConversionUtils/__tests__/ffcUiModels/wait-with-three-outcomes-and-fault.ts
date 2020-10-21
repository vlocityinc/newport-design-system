export default {
    connectors: [
        {
            guid: 'start-element-guid -> wait-element-guid',
            source: 'start-element-guid',
            target: 'wait-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'wait-element-guid -> screen-for-outcome1-guid',
            source: 'wait-element-guid',
            childSource: 'outcome1-element-guid',
            target: 'screen-for-outcome1-guid',
            label: 'outcome1',
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'wait-element-guid -> screen-for-outcome2-guid',
            source: 'wait-element-guid',
            childSource: 'outcome2-element-guid',
            target: 'screen-for-outcome2-guid',
            label: 'outcome2',
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'wait-element-guid -> decision-for-outcome3-guid',
            source: 'wait-element-guid',
            target: 'decision-for-outcome3-guid',
            label: 'DEFAULT',
            type: 'DEFAULT',
            config: { isSelected: false }
        },
        {
            guid: 'wait-element-guid -> fault-guid',
            source: 'wait-element-guid',
            target: 'fault-guid',
            label: 'FAULT',
            type: 'FAULT',
            config: { isSelected: false }
        }
    ],
    canvasElements: [
        'wait-element-guid',
        'decision-for-outcome3-guid',
        'screen-for-outcome2-guid',
        'screen-for-outcome1-guid',
        'fault-guid',
        'start-element-guid'
    ],
    elements: {
        'start-element-guid': {
            guid: 'start-element-guid',
            description: '',
            locationX: 362,
            locationY: 48,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
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
            ]
        },
        'wait-element-guid': {
            guid: 'wait-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 488,
            locationY: 206,
            isCanvasElement: true,
            connectorCount: 4,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Wait',
            maxConnections: 4,
            childReferences: [{ childReference: 'outcome1-element-guid' }, { childReference: 'outcome2-element-guid' }],
            availableConnections: []
        },
        'screen-for-outcome1-guid': {
            guid: 'screen-for-outcome1-guid',
            description: '',
            locationX: 158,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
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
        'screen-for-outcome2-guid': {
            guid: 'screen-for-outcome2-guid',
            name: 'screen-for-outcome2',
            description: '',
            label: 'screen-for-outcome2',
            locationX: 422,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Screen',
            maxConnections: 1
        },
        'decision-for-outcome3-guid': {
            guid: 'decision-for-outcome3-guid',
            description: '',
            locationX: 818,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            availableConnections: [{ type: 'REGULAR', childReference: 'decision-outcome1-guid' }, { type: 'DEFAULT' }],
            childReferences: [{ childReference: 'decision-outcome1-guid' }],
            elementType: 'Decision',
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
            ]
        },
        'fault-guid': {
            guid: 'fault-guid',
            description: '',
            locationX: 1214,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
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
        'decision-outcome1-guid': {
            guid: 'decision-outcome1-guid',
            name: 'outcome1',
            label: 'outcome1',
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
        'outcome1-element-guid': {
            guid: 'outcome1-element-guid',
            name: 'outcome1',
            label: 'outcome1',
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
            name: 'outcome2',
            label: 'outcome2',
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
        }
    }
};
