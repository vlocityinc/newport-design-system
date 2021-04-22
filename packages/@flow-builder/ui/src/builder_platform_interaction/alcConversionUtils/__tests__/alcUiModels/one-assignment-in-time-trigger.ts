// @ts-nocheck
export default {
    elements: {
        'time-trigger-start-element-guid': {
            guid: 'time-trigger-start-element-guid',
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
            triggerType: 'RecordAfterSave',
            recordTriggerType: 'Create',
            filterType: 'all',
            object: 'Account',
            objectIndex: '12c23e8e-4104-40ba-86e0-feb73e787792',
            subtype: 'Account',
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
            next: 'assignment-element-guid',
            parent: 'root',
            childIndex: 0,
            isTerminal: true
        },
        'assignment-element-guid': {
            guid: 'assignment-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignmentItems: [
                {
                    rowIndex: 'cda83bda-2840-470c-aa57-1a8cfedee523',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            nodeType: 'default',
            prev: 'time-trigger-start-element-guid',
            next: 'end-element-guid (assignment-element-guid)'
        },
        'end-element-guid (assignment-element-guid)': {
            guid: 'end-element-guid (assignment-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'assignment-element-guid',
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
            children: ['time-trigger-start-element-guid']
        }
    },
    connectors: [],
    canvasElements: []
};
