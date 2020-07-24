export default {
    elements: {
        'e35c2063-cb84-4765-a091-9ac3d27138a3': {
            guid: 'e35c2063-cb84-4765-a091-9ac3d27138a3',
            description: '',
            locationX: 362,
            locationY: 48,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterLogic: 'and',
            object: '',
            objectIndex: '38ba8f9e-1005-4074-8b2d-9486da04f93f',
            filters: [
                {
                    rowIndex: '88879acd-671a-4029-bac4-8dcc9ebe7269',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '74e4035c-c724-4ed5-a283-796b1765e6f4': {
            guid: '74e4035c-c724-4ed5-a283-796b1765e6f4',
            name: '',
            description: '',
            label: '',
            locationX: 488,
            locationY: 206,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'cb5b3c0b-7368-4435-bba9-129d3723c932',
            collectionReference: null,
            collectionReferenceIndex: '694b7877-498b-4326-bb06-3d348f972277',
            iterationOrder: 'Asc',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'LOOP_END'
                }
            ],
            elementType: 'Loop',
            storeOutputAutomatically: true
        },
        'b9e0dccc-8648-4063-8a1e-56f8b32a17e2': {
            guid: 'b9e0dccc-8648-4063-8a1e-56f8b32a17e2',
            name: '',
            description: '',
            label: '',
            locationX: 752,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [
                {
                    childReference: '0baa6a98-e8af-4abf-a958-cbeffa4b032c'
                }
            ],
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '0baa6a98-e8af-4abf-a958-cbeffa4b032c'
                }
            ]
        },
        'b6754f72-a64b-4ecf-802f-da114318d74a': {
            guid: 'b6754f72-a64b-4ecf-802f-da114318d74a',
            name: '',
            description: '',
            label: '',
            locationX: 928,
            locationY: 446,
            isCanvasElement: true,
            connectorCount: 2,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [
                {
                    childReference: 'deaaa777-2964-413f-9c16-ca34037872cc'
                }
            ],
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: []
        },
        '0baa6a98-e8af-4abf-a958-cbeffa4b032c': {
            guid: '0baa6a98-e8af-4abf-a958-cbeffa4b032c',
            name: '',
            label: '',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '042cf693-62d2-4272-a0a1-76b49942b012',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'deaaa777-2964-413f-9c16-ca34037872cc': {
            guid: 'deaaa777-2964-413f-9c16-ca34037872cc',
            name: '',
            label: '',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '383bf7a8-fcf5-4082-8f09-64b480facd16',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        }
    },

    canvasElements: [
        'e35c2063-cb84-4765-a091-9ac3d27138a3',
        '74e4035c-c724-4ed5-a283-796b1765e6f4',
        'b9e0dccc-8648-4063-8a1e-56f8b32a17e2',
        'b6754f72-a64b-4ecf-802f-da114318d74a'
    ],
    connectors: [
        {
            guid: 'e35c2063-cb84-4765-a091-9ac3d27138a3 -> 74e4035c-c724-4ed5-a283-796b1765e6f4',
            source: 'e35c2063-cb84-4765-a091-9ac3d27138a3',
            target: '74e4035c-c724-4ed5-a283-796b1765e6f4',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },

        {
            guid: 'b9e0dccc-8648-4063-8a1e-56f8b32a17e2 -> b6754f72-a64b-4ecf-802f-da114318d74a',
            source: 'b9e0dccc-8648-4063-8a1e-56f8b32a17e2',
            target: 'b6754f72-a64b-4ecf-802f-da114318d74a',
            label: 'DEFAULT',
            type: 'DEFAULT',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'b6754f72-a64b-4ecf-802f-da114318d74a -> 74e4035c-c724-4ed5-a283-796b1765e6f4',
            source: 'b6754f72-a64b-4ecf-802f-da114318d74a',
            childSource: 'deaaa777-2964-413f-9c16-ca34037872cc',
            target: '74e4035c-c724-4ed5-a283-796b1765e6f4',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'b6754f72-a64b-4ecf-802f-da114318d74a -> 74e4035c-c724-4ed5-a283-796b1765e6f4',
            source: 'b6754f72-a64b-4ecf-802f-da114318d74a',
            target: '74e4035c-c724-4ed5-a283-796b1765e6f4',
            label: 'DEFAULT',
            type: 'DEFAULT',
            config: {
                isSelected: false
            }
        },
        {
            guid: '74e4035c-c724-4ed5-a283-796b1765e6f4 -> b9e0dccc-8648-4063-8a1e-56f8b32a17e2',
            source: '74e4035c-c724-4ed5-a283-796b1765e6f4',
            target: 'b9e0dccc-8648-4063-8a1e-56f8b32a17e2',
            label: 'LOOP_NEXT',
            type: 'LOOP_NEXT',
            config: {
                isSelected: false
            }
        }
    ]
};
