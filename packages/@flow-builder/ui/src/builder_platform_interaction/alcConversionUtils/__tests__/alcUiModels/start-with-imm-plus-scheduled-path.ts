// @ts-nocheck
export default {
    elements: {
        'scheduled-path-start-element-guid': {
            guid: 'scheduled-path-start-element-guid',
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
            elementType: 'START_ELEMENT',
            nodeType: 'start',
            maxConnections: 2,
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
            childReferences: [
                {
                    childReference: 'scheduled-path-element-guid'
                }
            ],
            children: ['assignment-imm-element-guid', 'assignment-async-element-guid'],
            availableConnections: [],
            prev: null,
            next: null,
            parent: 'root',
            childIndex: 0,
            isTerminal: true
        },
        'scheduled-path-element-guid': {
            guid: 'scheduled-path-element-guid',
            elementType: 'ScheduledPath',
            offsetNumber: '1',
            offsetUnit: 'HoursBefore',
            timeSource: 'SLAExpirationDate__c',
            name: 'd1out',
            label: 'd1out'
        },
        'assignment-async-element-guid': {
            guid: 'assignment-async-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            childIndex: 1,
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
            prev: null,
            parent: 'scheduled-path-start-element-guid',
            next: 'end-element-guid (assignment-async-element-guid)',
            isTerminal: true
        },
        'end-element-guid (assignment-async-element-guid)': {
            guid: 'end-element-guid (assignment-async-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'assignment-async-element-guid',
            next: null,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'assignment-imm-element-guid': {
            guid: 'assignment-imm-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 1,
            childIndex: 0,
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
            prev: null,
            parent: 'scheduled-path-start-element-guid',
            next: 'end-element-guid (assignment-imm-element-guid)',
            isTerminal: true
        },
        'end-element-guid (assignment-imm-element-guid)': {
            guid: 'end-element-guid (assignment-imm-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'assignment-imm-element-guid',
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
            children: ['scheduled-path-start-element-guid']
        }
    },
    connectors: [],
    canvasElements: []
};
