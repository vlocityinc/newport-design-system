// @ts-nocheck
export default {
    elements: {
        'scheduled-path-start-element-guid': {
            guid: 'scheduled-path-start-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            isCanvasElement: true,
            connectorCount: 3,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementType: 'START_ELEMENT',
            nodeType: 'start',
            maxConnections: 3,
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
                },
                {
                    childReference: 'scheduled-path2-element-guid'
                }
            ],
            availableConnections: [],
            children: [
                'assignment-async-element-guid',
                'assignment-async-element-guid',
                'assignment-async2-element-guid'
            ],
            prev: null,
            next: 'end-element-guid (scheduled-path-start-element-guid)',
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
        'scheduled-path2-element-guid': {
            guid: 'scheduled-path2-element-guid',
            elementType: 'ScheduledPath',
            offsetNumber: '1',
            offsetUnit: 'HoursBefore',
            timeSource: 'SLAExpirationDate__c',
            name: 'd2out',
            label: 'd2out'
        },
        'assignment-async-element-guid': {
            guid: 'assignment-async-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            childIndex: 1,
            isCanvasElement: true,
            connectorCount: 1,
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
            isTerminal: false,
            parent: 'scheduled-path-start-element-guid',
            next: null,
            incomingGoTo: ['scheduled-path-start-element-guid:immediate']
        },
        'end-element-guid (scheduled-path-start-element-guid)': {
            guid: 'end-element-guid (scheduled-path-start-element-guid)',
            elementType: 'END_ELEMENT',
            nodeType: 'end',
            prev: 'scheduled-path-start-element-guid',
            next: null,
            isCanvasElement: true,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            }
        },
        'assignment-async2-element-guid': {
            guid: 'assignment-async2-element-guid',
            description: '',
            locationX: 0,
            locationY: 0,
            childIndex: 2,
            isCanvasElement: true,
            connectorCount: 1,
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
            isTerminal: false,
            parent: 'scheduled-path-start-element-guid',
            next: null
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
