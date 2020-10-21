export default {
    connectors: [
        {
            guid: 'start-element-guid -> decision-element-guid',
            source: 'start-element-guid',
            target: 'decision-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'screen-right-element-guid -> screen-after-decision-element-guid',
            source: 'screen-right-element-guid',
            target: 'screen-after-decision-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'screen-left-element-guid -> screen-after-decision-element-guid',
            source: 'screen-left-element-guid',
            target: 'screen-after-decision-element-guid',
            label: null,
            type: 'REGULAR',
            config: { isSelected: false }
        },
        {
            guid: 'decision-element-guid -> screen-right-element-guid',
            source: 'decision-element-guid',
            target: 'screen-right-element-guid',
            label: 'DEFAULT',
            type: 'DEFAULT',
            config: { isSelected: false }
        },
        {
            guid: 'decision-element-guid -> screen-left-element-guid',
            source: 'decision-element-guid',
            childSource: 'outcome-element-guid',
            target: 'screen-left-element-guid',
            label: 'd1out',
            type: 'REGULAR',
            config: { isSelected: false }
        }
    ],
    canvasElements: [
        'decision-element-guid',
        'screen-after-decision-element-guid',
        'screen-left-element-guid',
        'screen-right-element-guid',
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
        'decision-element-guid': {
            guid: 'decision-element-guid',
            name: 'd1',
            description: '',
            label: 'd1',
            locationX: 488,
            locationY: 206,
            isCanvasElement: true,
            connectorCount: 2,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [{ childReference: 'outcome-element-guid' }],
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: []
        },
        'screen-left-element-guid': {
            guid: 'screen-left-element-guid',
            description: '',
            locationX: 356,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 1,
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
        'screen-right-element-guid': {
            guid: 'screen-right-element-guid',
            description: '',
            locationX: 620,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 1,
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
        'screen-after-decision-element-guid': {
            guid: 'screen-after-decision-element-guid',
            description: '',
            locationX: 488,
            locationY: 542,
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
        }
    }
};
