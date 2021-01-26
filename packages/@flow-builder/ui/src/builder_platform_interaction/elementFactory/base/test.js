export default {
    elements: {
        '31d7a3cb-05cb-4cc8-9b19-b762298a6a1e': {
            guid: '31d7a3cb-05cb-4cc8-9b19-b762298a6a1e',
            description: '',
            locationX: 50,
            locationY: 50,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterLogic: 'and',
            object: '',
            objectIndex: 'e65bb8c9-4da4-41d2-bd6f-f46586dd4039',
            filters: [
                {
                    rowIndex: '7fc9f580-0558-4b50-9f0f-0f7ddb1b2ff7',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            childReferences: [],
            availableConnections: [
                {
                    type: 'REGULAR'
                }
            ],
            prev: null,
            parent: 'root',
            childIndex: 0,
            isTerminal: true,
            next: '9c6a177b-5097-40be-8752-4604325a39c9'
        },
        '44c13361-aa62-4141-b5c7-70ed06e914b0': {
            guid: '44c13361-aa62-4141-b5c7-70ed06e914b0',
            name: 'END_ELEMENT',
            description: '',
            label: 'End',
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
            elementType: 'END_ELEMENT',
            value: 'END_ELEMENT',
            text: 'END_ELEMENT',
            prev: '9c6a177b-5097-40be-8752-4604325a39c9'
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
            children: ['31d7a3cb-05cb-4cc8-9b19-b762298a6a1e']
        },
        '9c6a177b-5097-40be-8752-4604325a39c9': {
            guid: '9c6a177b-5097-40be-8752-4604325a39c9',
            name: 'd1',
            description: '',
            label: 'd1',
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
            elementSubtype: null,
            children: [null, null],
            defaultConnectorLabel: 'Default Outcome',
            childReferences: [
                {
                    childReference: 'ba520a41-0fb0-48b0-8580-9469c6ca1d74'
                }
            ],
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    childReference: 'ba520a41-0fb0-48b0-8580-9469c6ca1d74',
                    type: 'REGULAR'
                },
                {
                    type: 'DEFAULT'
                }
            ],
            next: '44c13361-aa62-4141-b5c7-70ed06e914b0',
            prev: '31d7a3cb-05cb-4cc8-9b19-b762298a6a1e'
        },
        'ba520a41-0fb0-48b0-8580-9469c6ca1d74': {
            guid: 'ba520a41-0fb0-48b0-8580-9469c6ca1d74',
            name: 'd1o',
            label: 'd1o',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '28cbfa22-ff92-4c3d-909f-23e0f232b508',
                    leftHandSide: '$Flow.CurrentRecord',
                    rightHandSide: 'a',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        }
    }
};
