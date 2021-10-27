const flowModelData = {
    'c2238db9-67bc-466b-9a5e-d66d48dcc1a6': {
        guid: 'c2238db9-67bc-466b-9a5e-d66d48dcc1a6',
        connectorCount: 1,
        elementType: 'START_ELEMENT',
        childReferences: [],
        nodeType: 'start',
        parent: 'root',
        childIndex: 0,
        prev: null,
        next: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a'
    },
    'e1cdea64-32aa-4197-8c91-e30afd1d3b0f': {
        guid: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
        name: 'd1',
        label: 'd1',
        connectorCount: 4,
        childReferences: [
            {
                childReference: '3b6a0ec3-4304-4254-8223-2d22d24e15e9'
            },
            {
                childReference: '9cf6890d-8e18-46b9-9d6f-e20b48c317b7'
            },
            {
                childReference: '14646bb6-f634-4ee3-931b-ef107a3c0d40'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        nodeType: 'branch',
        prev: '60b466f1-6589-4352-8603-51e225b70b36',
        incomingGoTo: [],
        next: 'd8323004-4915-4580-a056-08b7b1f32d18',
        children: ['051e3653-5a6e-43b5-9438-33bb3ebae28b', '272558a5-9d21-457d-8209-7bb42f6498e2', null, null]
    },
    '3b6a0ec3-4304-4254-8223-2d22d24e15e9': {
        guid: '3b6a0ec3-4304-4254-8223-2d22d24e15e9',
        name: 'o1',
        label: 'o1',
        elementType: 'OUTCOME'
    },
    '9cf6890d-8e18-46b9-9d6f-e20b48c317b7': {
        guid: '9cf6890d-8e18-46b9-9d6f-e20b48c317b7',
        name: 'o2',
        label: 'o2',
        elementType: 'OUTCOME'
    },
    '14646bb6-f634-4ee3-931b-ef107a3c0d40': {
        guid: '14646bb6-f634-4ee3-931b-ef107a3c0d40',
        name: 'o3',
        label: 'o3',
        elementType: 'OUTCOME'
    },
    '272558a5-9d21-457d-8209-7bb42f6498e2': {
        guid: '272558a5-9d21-457d-8209-7bb42f6498e2',
        name: 'd2',
        label: 'd2',
        connectorCount: 3,
        childReferences: [
            {
                childReference: 'bea9f355-987d-4601-aba7-476d07783282'
            },
            {
                childReference: 'b73a8345-3692-4fc5-a97b-9ad5fef93c82'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        availableConnections: [],
        nodeType: 'branch',
        parent: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
        childIndex: 1,
        prev: null,
        incomingGoTo: [],
        isTerminal: true,
        next: '48897c86-23e7-42d7-8653-2b2b0dd73679',
        children: ['29bc4524-3140-4f41-8312-040733d7bb7d', '82481b50-0114-43ca-bf17-c70a1bb19260', null]
    },
    'bea9f355-987d-4601-aba7-476d07783282': {
        guid: 'bea9f355-987d-4601-aba7-476d07783282',
        name: 'out1',
        label: 'o1',
        elementType: 'OUTCOME'
    },
    'b73a8345-3692-4fc5-a97b-9ad5fef93c82': {
        guid: 'b73a8345-3692-4fc5-a97b-9ad5fef93c82',
        name: 'out2',
        label: 'o2',
        elementType: 'OUTCOME'
    },
    '1f94a9ce-8029-4a02-9633-05abd127c43f': {
        guid: '1f94a9ce-8029-4a02-9633-05abd127c43f',
        name: 'd3',
        label: 'd3',
        connectorCount: 2,
        childReferences: [
            {
                childReference: '5c93b920-241b-4c86-a0ec-533b699bf46b'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        availableConnections: [],
        nodeType: 'branch',
        parent: '051e3653-5a6e-43b5-9438-33bb3ebae28b',
        childIndex: 0,
        prev: null,
        incomingGoTo: [],
        next: null,
        children: [null, null]
    },
    '5c93b920-241b-4c86-a0ec-533b699bf46b': {
        guid: '5c93b920-241b-4c86-a0ec-533b699bf46b',
        name: 'ou1',
        label: 'o1',
        elementType: 'OUTCOME'
    },
    'fda8f30e-7772-4665-a9ff-a7cb12d5646a': {
        guid: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a',
        name: 'd4',
        label: 'd4',
        connectorCount: 2,
        childReferences: [
            {
                childReference: '68cd9289-6912-44a5-8b2f-092d8349ad1e'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        availableConnections: [],
        nodeType: 'branch',
        prev: 'c2238db9-67bc-466b-9a5e-d66d48dcc1a6',
        incomingGoTo: [],
        next: null,
        children: ['60b466f1-6589-4352-8603-51e225b70b36', 'd8323004-4915-4580-a056-08b7b1f32d18']
    },
    '68cd9289-6912-44a5-8b2f-092d8349ad1e': {
        guid: '68cd9289-6912-44a5-8b2f-092d8349ad1e',
        name: 'outcome1',
        label: 'o1',
        elementType: 'OUTCOME'
    },
    '2651e766-0b3b-4274-8540-267e0cc3045d': {
        guid: '2651e766-0b3b-4274-8540-267e0cc3045d',
        name: 'var',
        elementType: 'Variable'
    },
    'affd0c85-1432-4630-a385-02a4fec9f6da': {
        guid: 'affd0c85-1432-4630-a385-02a4fec9f6da',
        name: 'const',
        elementType: 'Constant'
    },
    'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8': {
        guid: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8',
        name: 'updateRecord_0_0',
        label: 'updateRecord',
        connectorCount: 2,
        availableConnections: [],
        elementType: 'RecordUpdate',
        nodeType: 'default',
        prev: '29bc4524-3140-4f41-8312-040733d7bb7d',
        incomingGoTo: [],
        next: 'a1d32ecb-797c-4a3e-85cf-dc293b4720f1',
        fault: 'dfde7274-19e2-4257-86cf-c7377f88ba7a'
    },
    '60b466f1-6589-4352-8603-51e225b70b36': {
        guid: '60b466f1-6589-4352-8603-51e225b70b36',
        name: 'loop1',
        label: 'loop1',
        connectorCount: 2,
        maxConnections: 2,
        availableConnections: [],
        elementType: 'Loop',
        nodeType: 'loop',
        parent: 'fda8f30e-7772-4665-a9ff-a7cb12d5646a',
        childIndex: 0,
        prev: null,
        incomingGoTo: [],
        next: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
        children: ['d8323004-4915-4580-a056-08b7b1f32d18']
    },
    '051e3653-5a6e-43b5-9438-33bb3ebae28b': {
        guid: '051e3653-5a6e-43b5-9438-33bb3ebae28b',
        name: 'loop2',
        label: 'loop2',
        connectorCount: 2,
        availableConnections: [],
        elementType: 'Loop',
        nodeType: 'loop',
        parent: 'e1cdea64-32aa-4197-8c91-e30afd1d3b0f',
        childIndex: 0,
        prev: null,
        incomingGoTo: [],
        isTerminal: true,
        next: '471cf4df-0a7e-470e-b586-ad778fce8a31',
        children: ['1f94a9ce-8029-4a02-9633-05abd127c43f']
    },
    '29bc4524-3140-4f41-8312-040733d7bb7d': {
        guid: '29bc4524-3140-4f41-8312-040733d7bb7d',
        name: 'loop3',
        label: 'loop3',
        connectorCount: 1,
        availableConnections: [
            {
                type: 'LOOP_NEXT'
            }
        ],
        elementType: 'Loop',
        nodeType: 'loop',
        parent: '272558a5-9d21-457d-8209-7bb42f6498e2',
        childIndex: 0,
        prev: null,
        incomingGoTo: [],
        isTerminal: true,
        next: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8',
        children: [null]
    },
    'd8323004-4915-4580-a056-08b7b1f32d18': {
        guid: 'd8323004-4915-4580-a056-08b7b1f32d18',
        name: 's1',
        label: 's1',
        connectorCount: 1,
        childReferences: [],
        elementType: 'Screen',
        nodeType: 'default',
        parent: '60b466f1-6589-4352-8603-51e225b70b36',
        childIndex: 0,
        prev: null,
        incomingGoTo: [
            'dfde7274-19e2-4257-86cf-c7377f88ba7a',
            'fda8f30e-7772-4665-a9ff-a7cb12d5646a:default',
            'e1cdea64-32aa-4197-8c91-e30afd1d3b0f'
        ],
        next: null
    },
    'dfde7274-19e2-4257-86cf-c7377f88ba7a': {
        guid: 'dfde7274-19e2-4257-86cf-c7377f88ba7a',
        name: 's2',
        label: 's2',
        connectorCount: 1,
        childReferences: [],
        elementType: 'Screen',
        nodeType: 'default',
        parent: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8',
        childIndex: -1,
        prev: null,
        incomingGoTo: [],
        next: 'd8323004-4915-4580-a056-08b7b1f32d18'
    },
    '82481b50-0114-43ca-bf17-c70a1bb19260': {
        guid: '82481b50-0114-43ca-bf17-c70a1bb19260',
        name: 's3',
        label: 's3',
        connectorCount: 1,
        childReferences: [],
        elementType: 'Screen',
        nodeType: 'default',
        parent: '272558a5-9d21-457d-8209-7bb42f6498e2',
        childIndex: 1,
        prev: null,
        incomingGoTo: [],
        next: null
    },
    '48897c86-23e7-42d7-8653-2b2b0dd73679': {
        guid: '48897c86-23e7-42d7-8653-2b2b0dd73679',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: '272558a5-9d21-457d-8209-7bb42f6498e2'
    },
    'a1d32ecb-797c-4a3e-85cf-dc293b4720f1': {
        guid: 'a1d32ecb-797c-4a3e-85cf-dc293b4720f1',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'c5c84fb8-e0f1-41bf-a7fd-385e4dea54a8'
    },
    '471cf4df-0a7e-470e-b586-ad778fce8a31': {
        guid: '471cf4df-0a7e-470e-b586-ad778fce8a31',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: '051e3653-5a6e-43b5-9438-33bb3ebae28b'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['c2238db9-67bc-466b-9a5e-d66d48dcc1a6']
    }
};

const recordTriggeredFlowModelData = {
    '80e0340e-67ba-4bb7-bf11-f2696aa8043f': {
        guid: '80e0340e-67ba-4bb7-bf11-f2696aa8043f',
        name: '$Record',
        connectorCount: 0,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        childReferences: [],
        availableConnections: [
            {
                type: 'IMMEDIATE'
            }
        ],
        nodeType: 'start',
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: '280fcb7c-478d-485e-981a-0301412dbc75',
        defaultConnectorLabel: 'Run Immediately',
        object: 'Account',
        recordTriggerType: 'Create',
        subtype: 'Account',
        triggerType: 'RecordAfterSave',
        shouldSupportScheduledPaths: true
    },
    '1f32d18d8323004-4915-4580-a056-08b7b': {
        guid: '1f32d18d8323004-4915-4580-a056-08b7b',
        name: 'a1',
        label: 'a1',
        connectorCount: 1,
        childReferences: [],
        elementType: 'Assignment',
        nodeType: 'default',
        parent: null,
        childIndex: null,
        prev: '80e0340e-67ba-4bb7-bf11-f2696aa8043f',
        incomingGoTo: [],
        next: '280fcb7c-478d-485e-981a-0301412dbc75'
    },
    '280fcb7c-478d-485e-981a-0301412dbc75': {
        guid: '280fcb7c-478d-485e-981a-0301412dbc75',
        name: 'END_ELEMENT',
        label: 'End',
        connectorCount: 0,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: '1f32d18d8323004-4915-4580-a056-08b7b'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['80e0340e-67ba-4bb7-bf11-f2696aa8043f']
    }
};

const recordTriggerFlowModel2 = {
    '08e1f541-0000-4ab3-83e1-3fb4faea9e02': {
        guid: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
        name: '$Record',
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
        canHaveFaultConnector: false,
        elementType: 'START_ELEMENT',
        maxConnections: 3,
        triggerType: 'RecordAfterSave',
        filterLogic: 'no_conditions',
        recordTriggerType: 'Create',
        object: 'Account',
        objectIndex: '13bbf5ad-217e-4796-94ef-b076a1548763',
        filters: [
            {
                rowIndex: '8bf7722b-f25f-4268-8108-9c0ae8a8616c',
                leftHandSide: '',
                leftHandSideDataType: 'String',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: ''
            }
        ],
        haveSystemVariableFields: true,
        dataType: 'SObject',
        subtype: 'Account',
        isCollection: false,
        isAssignable: true,
        doesRequireRecordChangedToMeetCriteria: false,
        childReferences: [
            {
                childReference: 'd81c1655-8f50-42ac-a86a-830b94e04680'
            },
            {
                childReference: 'fb32cce6-9fdf-4c6c-9001-ee2780637f44'
            }
        ],
        availableConnections: [],
        defaultConnectorLabel: 'Run Immediately',
        nodeType: 'start',
        parent: 'root',
        childIndex: 0,
        isTermina: true,
        prev: null,
        next: '0e00c865-9dc5-4b0e-ad67-2b90c3634f23',
        children: [
            '1ed584cb-f6dd-43b8-9f54-f1e11e41af54',
            '735111d7-add2-4e2b-9303-3eeb344ac8ab',
            '72ddaa69-4267-4993-a08c-3843b62883b9'
        ]
    },
    'd81c1655-8f50-42ac-a86a-830b94e04680': {
        guid: 'd81c1655-8f50-42ac-a86a-830b94e04680',
        name: 'p1',
        label: 'p1',
        elementType: 'ScheduledPath',
        dataType: 'Boolean',
        timeSource: 'RecordTriggerEvent',
        offsetUnit: 'DaysAfter',
        offsetNumber: '1',
        maxBatchSize: 0
    },
    'fb32cce6-9fdf-4c6c-9001-ee2780637f44': {
        guid: 'fb32cce6-9fdf-4c6c-9001-ee2780637f44',
        name: 'p2',
        label: 'p2',
        elementType: 'ScheduledPath',
        dataType: 'Boolean',
        timeSource: 'LastModifiedDate',
        offsetUnit: 'DaysAfter',
        offsetNumber: '1',
        maxBatchSize: 0
    },
    'be23e463-d352-446d-9d3f-18be35f045b4': {
        guid: 'be23e463-d352-446d-9d3f-18be35f045b4',
        name: 'a1',
        description: '',
        label: 'a1',
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
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: '6d7585b7-1851-4da8-a0a5-e29178b88af4',
                leftHandSide: '$Record.Active__c',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        parent: '20233c57-8b4e-40cb-801a-3209e2ccfb15',
        childIndex: 0,
        isTermina: false,
        prev: null,
        incomingGoTo: [],
        next: 'd715a7a8-1ff9-4b54-bc33-96d6cb95aeaf'
    },
    '18e7b5e2-dd97-4c97-946d-e583a3cfd9fc': {
        guid: '18e7b5e2-dd97-4c97-946d-e583a3cfd9fc',
        name: 'a2',
        description: '',
        label: 'a2',
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
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: 'c63c417e-eda7-40f1-bcfc-71fd7f612dd4',
                leftHandSide: '$Record.BillingLatitude',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        prev: '1ed584cb-f6dd-43b8-9f54-f1e11e41af54',
        incomingGoTo: [],
        next: null
    },
    '0e00c865-9dc5-4b0e-ad67-2b90c3634f23': {
        guid: '0e00c865-9dc5-4b0e-ad67-2b90c3634f23',
        name: 'a3',
        description: '',
        label: 'a3',
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
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: '80ee3f5f-821e-4e20-acfa-5e4bfdcd2997',
                leftHandSide: '$Record.BillingLatitude',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        prev: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
        incomingGoTo: [],
        next: '735111d7-add2-4e2b-9303-3eeb344ac8ab'
    },
    'd715a7a8-1ff9-4b54-bc33-96d6cb95aeaf': {
        guid: 'd715a7a8-1ff9-4b54-bc33-96d6cb95aeaf',
        name: 'a4',
        description: '',
        label: 'a4',
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
        canHaveFaultConnector: false,
        assignmentItems: [
            {
                rowIndex: 'd916cb8b-7963-4da3-b845-bdef9b9b9ef4',
                leftHandSide: '$Record.AccountNumber',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        nodeType: 'default',
        prev: 'be23e463-d352-446d-9d3f-18be35f045b4',
        incomingGoTo: [],
        next: null
    },
    '462e385e-99d4-415a-8c88-8cbff7edb452': {
        guid: '462e385e-99d4-415a-8c88-8cbff7edb452',
        name: 'd1',
        description: '',
        label: 'd1',
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
        canHaveFaultConnector: false,
        childReferences: [
            {
                childReference: '9b144f7e-a1fa-4a99-8e31-9b63b8ba8965'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        maxConnections: 2,
        availableConnections: [],
        nodeType: 'branch',
        parent: '1ed584cb-f6dd-43b8-9f54-f1e11e41af54',
        childIndex: 0,
        isTermina: false,
        prev: null,
        incomingGoTo: [],
        next: null,
        children: ['b2267797-7475-4922-a325-c2879c6ba7c3', null]
    },
    '9b144f7e-a1fa-4a99-8e31-9b63b8ba8965': {
        guid: '9b144f7e-a1fa-4a99-8e31-9b63b8ba8965',
        name: 'o1',
        label: 'o1',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: '26dc5cfa-76c5-4766-9686-476aba2ce890',
                leftHandSide: '$System.OriginDateTime',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'EqualTo'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    'b2267797-7475-4922-a325-c2879c6ba7c3': {
        guid: 'b2267797-7475-4922-a325-c2879c6ba7c3',
        name: 'd2',
        description: '',
        label: 'd2',
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
        canHaveFaultConnector: false,
        childReferences: [
            {
                childReference: '19f44b89-84f2-4f9a-8100-b5d7a5a2827b'
            }
        ],
        defaultConnectorLabel: 'Default Outcome',
        elementType: 'Decision',
        maxConnections: 2,
        availableConnections: [],
        nodeType: 'branch',
        parent: '462e385e-99d4-415a-8c88-8cbff7edb452',
        childIndex: 0,
        isTermina: false,
        prev: null,
        incomingGoTo: [],
        next: null,
        children: [null, null]
    },
    '19f44b89-84f2-4f9a-8100-b5d7a5a2827b': {
        guid: '19f44b89-84f2-4f9a-8100-b5d7a5a2827b',
        name: 'o2',
        label: 'o2',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: '57dcae06-f945-43dc-8217-294d33502c19',
                leftHandSide: '$User.Division',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'EqualTo'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    '83d3d25c-916c-4e52-8f4d-06f5382e767c': {
        guid: '83d3d25c-916c-4e52-8f4d-06f5382e767c',
        name: 'var',
        description: '',
        elementType: 'Variable',
        isCollection: true,
        isInput: false,
        isOutput: false,
        dataType: 'Apex',
        subtype: 'ConnectApi__OrderSummaryOutputRepresentation',
        subtypeIndex: '6801ddc3-8679-401b-8133-fa281ac02680',
        scale: 0,
        defaultValue: null,
        defaultValueDataType: null,
        defaultValueIndex: 'd69d53b3-0542-48e4-8aae-75fcd2d18877'
    },
    '1ed584cb-f6dd-43b8-9f54-f1e11e41af54': {
        guid: '1ed584cb-f6dd-43b8-9f54-f1e11e41af54',
        name: 'l1',
        description: '',
        label: 'l1',
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
        canHaveFaultConnector: false,
        assignNextValueToReference: null,
        assignNextValueToReferenceIndex: '58db97b5-cfa8-4307-91c2-11db6439ec2d',
        collectionReference: '83d3d25c-916c-4e52-8f4d-06f5382e767c',
        collectionReferenceIndex: '90841b88-c47c-4d0a-ae97-942cecdacd88',
        iterationOrder: 'Asc',
        maxConnections: 2,
        availableConnections: [],
        elementType: 'Loop',
        storeOutputAutomatically: true,
        dataType: 'Apex',
        subtype: 'ConnectApi__OrderSummaryOutputRepresentation',
        nodeType: 'loop',
        parent: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
        childIndex: 0,
        isTermina: false,
        prev: null,
        incomingGoTo: [],
        next: '18e7b5e2-dd97-4c97-946d-e583a3cfd9fc',
        children: ['462e385e-99d4-415a-8c88-8cbff7edb452']
    },
    '735111d7-add2-4e2b-9303-3eeb344ac8ab': {
        guid: '735111d7-add2-4e2b-9303-3eeb344ac8ab',
        name: 'l2',
        description: '',
        label: 'l2',
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
        canHaveFaultConnector: false,
        assignNextValueToReference: null,
        assignNextValueToReferenceIndex: 'cf4889c6-52f6-464c-bacd-f1dbd1c523c3',
        collectionReference: '83d3d25c-916c-4e52-8f4d-06f5382e767c',
        collectionReferenceIndex: '9792acb8-9c7f-45f1-be48-4b894795b26c',
        iterationOrder: 'Asc',
        maxConnections: 2,
        availableConnections: [],
        elementType: 'Loop',
        storeOutputAutomatically: true,
        dataType: 'Apex',
        subtype: 'ConnectApi__OrderSummaryOutputRepresentation',
        nodeType: 'loop',
        parent: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
        childIndex: 1,
        isTermina: false,
        prev: null,
        incomingGoTo: ['0e00c865-9dc5-4b0e-ad67-2b90c3634f23'],
        next: null,
        children: ['20233c57-8b4e-40cb-801a-3209e2ccfb15']
    },
    '20233c57-8b4e-40cb-801a-3209e2ccfb15': {
        guid: '20233c57-8b4e-40cb-801a-3209e2ccfb15',
        name: 'l3',
        description: '',
        label: 'l3',
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
        canHaveFaultConnector: false,
        assignNextValueToReference: null,
        assignNextValueToReferenceIndex: '3b6ef5fc-f14b-4d30-afa6-b94925332206',
        collectionReference: '83d3d25c-916c-4e52-8f4d-06f5382e767c',
        collectionReferenceIndex: '95daef18-d48c-4499-a1f9-4b108ce9e991',
        iterationOrder: 'Asc',
        maxConnections: 2,
        availableConnections: [],
        elementType: 'Loop',
        storeOutputAutomatically: true,
        dataType: 'Apex',
        subtype: 'ConnectApi__OrderSummaryOutputRepresentation',
        nodeType: 'loop',
        parent: '735111d7-add2-4e2b-9303-3eeb344ac8ab',
        childIndex: 0,
        isTermina: false,
        prev: null,
        incomingGoTo: [],
        next: null,
        children: ['be23e463-d352-446d-9d3f-18be35f045b4']
    },
    '72ddaa69-4267-4993-a08c-3843b62883b9': {
        guid: '72ddaa69-4267-4993-a08c-3843b62883b9',
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
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        parent: '08e1f541-0000-4ab3-83e1-3fb4faea9e02',
        childIndex: 2,
        isTermina: true,
        prev: null
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['08e1f541-0000-4ab3-83e1-3fb4faea9e02']
    }
};

const scheduleTriggerFlowModel = {
    '6fb7d8c9-e859-43f5-8efb-52927012be22': {
        guid: '6fb7d8c9-e859-43f5-8efb-52927012be22',
        description: '',
        label: 'Wed, Oct 20, 2021, 12:15:00 AM, Once',
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
        canHaveFaultConnector: false,
        isNew: false,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'Scheduled',
        filterLogic: 'and',
        startDate: '2021-10-20',
        startTime: '00:15:00.000',
        frequency: 'Once',
        objec: 'Account',
        objectIndex: '3e159634-b660-4740-a158-b535701eea84',
        filters: [
            {
                rowIndex: 'ba74212b-fd3f-4e40-a144-e7dc073fe8ee',
                leftHandSide: 'Account.BillingLatitude',
                leftHandSideDataType: 'String',
                rightHandSide: '0',
                rightHandSideDataType: 'Number',
                operator: 'EqualTo'
            }
        ],
        childReferences: [],
        availableConnections: [
            {
                type: 'REGULAR'
            }
        ],
        nodeType: 'start',
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
        name: '$Record',
        haveSystemVariableFields: true,
        dataType: 'SObject',
        subtype: 'Account',
        isCollection: false,
        isAssignable: true
    },
    '92de18cc-c18d-4d5f-af5f-3f176e43fe92': {
        guid: '92de18cc-c18d-4d5f-af5f-3f176e43fe92',
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
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'e03f0a0a-f5cc-4db3-be81-f922967fae89'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['6fb7d8c9-e859-43f5-8efb-52927012be22']
    },
    'e03f0a0a-f5cc-4db3-be81-f922967fae89': {
        guid: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
        name: 'pause1',
        description: '',
        label: 'pause1',
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
        canHaveFaultConnector: true,
        isNew: false,
        childReferences: [
            {
                childReference: '5a3f4ae5-d57e-4200-9f8c-c7aed8a543ce'
            },
            {
                childReference: 'f23cac65-8e96-4c15-b7d0-44c19e53e4d7'
            }
        ],
        elementType: 'Wait',
        defaultConnectorLabel: 'Default Path',
        maxConnections: 4,
        availableConnections: [
            {
                childReference: '5a3f4ae5-d57e-4200-9f8c-c7aed8a543ce',
                type: 'REGULAR'
            },
            {
                childReference: 'f23cac65-8e96-4c15-b7d0-44c19e53e4d7',
                type: 'REGULAR'
            },
            {
                type: 'DEFAULT'
            },
            {
                type: 'FAULT'
            }
        ],
        children: ['2db7f1ac-47c2-481e-9995-9212baabb475', null, '038bbd41-06b8-4c21-a728-0491f1d4040d'],
        nodeType: 'branch',
        incomingGoTo: [],
        prev: '6fb7d8c9-e859-43f5-8efb-52927012be22',
        next: '92de18cc-c18d-4d5f-af5f-3f176e43fe92'
    },
    '5a3f4ae5-d57e-4200-9f8c-c7aed8a543ce': {
        guid: '5a3f4ae5-d57e-4200-9f8c-c7aed8a543ce',
        name: 'p1',
        label: 'p1',
        elementType: 'WAIT_EVENT',
        dataType: 'Boolean',
        conditions: [],
        conditionLogic: 'no_conditions',
        eventType: 'AlarmEvent',
        eventTypeIndex: '39b52964-dd20-4126-9212-5cb54e78b6dc',
        inputParameters: [],
        outputParameters: {}
    },
    'f23cac65-8e96-4c15-b7d0-44c19e53e4d7': {
        guid: 'f23cac65-8e96-4c15-b7d0-44c19e53e4d7',
        name: 'p5',
        label: 'p5',
        elementType: 'WAIT_EVENT',
        dataType: 'Boolean',
        conditions: [],
        conditionLogic: 'no_conditions',
        eventType: 'AlarmEvent',
        eventTypeIndex: 'eff1d99f-daec-4d08-bfe9-9eddae809a59',
        inputParameters: [],
        outputParameters: {}
    },
    '2db7f1ac-47c2-481e-9995-9212baabb475': {
        guid: '2db7f1ac-47c2-481e-9995-9212baabb475',
        name: 'a1',
        description: '',
        label: 'a1',
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
        canHaveFaultConnector: false,
        isNew: true,
        assignmentItems: [
            {
                rowIndex: '2b810ada-a181-4a92-be90-53a8e4c397a7',
                leftHandSide: '$Record.BillingLatitude',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'Assign'
            }
        ],
        maxConnections: 1,
        elementType: 'Assignment',
        isAddingResourceViaLeftPanel: false,
        alcConnectionSource: {
            guid: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
            childIndex: 0
        },
        nodeType: 'default',
        incomingGoTo: [],
        parent: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
        childIndex: 0,
        prev: null,
        isTerminal: false
    },
    '038bbd41-06b8-4c21-a728-0491f1d4040d': {
        guid: '038bbd41-06b8-4c21-a728-0491f1d4040d',
        name: 'pause2',
        description: '',
        label: 'pause2',
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
        canHaveFaultConnector: true,
        isNew: true,
        childReferences: [
            {
                childReference: '43b746cb-cddc-4409-8d46-0ddecf434a11'
            },
            {
                childReference: 'c663e43d-461f-465b-93b5-ad238c233721'
            },
            {
                childReference: '9962ac1c-1c75-4647-ab36-11b531b263a6'
            }
        ],
        elementType: 'Wait',
        defaultConnectorLabel: 'Default Path',
        maxConnections: 5,
        availableConnections: [
            {
                childReference: '43b746cb-cddc-4409-8d46-0ddecf434a11',
                type: 'REGULAR'
            },
            {
                childReference: 'c663e43d-461f-465b-93b5-ad238c233721',
                type: 'REGULAR'
            },
            {
                childReference: '9962ac1c-1c75-4647-ab36-11b531b263a6',
                type: 'REGULAR'
            },
            {
                type: 'DEFAULT'
            },
            {
                type: 'FAULT'
            }
        ],
        children: [null, null, null, null],
        nodeType: 'branch',
        incomingGoTo: [],
        parent: 'e03f0a0a-f5cc-4db3-be81-f922967fae89',
        childIndex: 2,
        prev: null,
        isTerminal: false
    },
    '43b746cb-cddc-4409-8d46-0ddecf434a11': {
        guid: '43b746cb-cddc-4409-8d46-0ddecf434a11',
        name: 'p2',
        label: 'p2',
        elementType: 'WAIT_EVENT',
        dataType: 'Boolean',
        conditions: [],
        conditionLogic: 'no_conditions',
        eventType: 'AlarmEvent',
        eventTypeIndex: 'b8d9cae7-a125-4a94-be7b-150fba91f1f3',
        inputParameters: [],
        outputParameters: {}
    },
    'c663e43d-461f-465b-93b5-ad238c233721': {
        guid: 'c663e43d-461f-465b-93b5-ad238c233721',
        name: 'p3',
        label: 'p3',
        elementType: 'WAIT_EVENT',
        dataType: 'Boolean',
        conditions: [],
        conditionLogic: 'no_conditions',
        eventType: 'AlarmEvent',
        eventTypeIndex: '811632db-1ac0-414f-97df-4ba0709702ac',
        inputParameters: [],
        outputParameters: {}
    },
    '9962ac1c-1c75-4647-ab36-11b531b263a6': {
        guid: '9962ac1c-1c75-4647-ab36-11b531b263a6',
        name: 'p4',
        label: 'p4',
        elementType: 'WAIT_EVENT',
        dataType: 'Boolean',
        conditions: [],
        conditionLogic: 'no_conditions',
        eventType: 'AlarmEvent',
        eventTypeIndex: '0f9a8940-c1cc-4f06-a598-71cb237ec001',
        inputParameters: [],
        outputParameters: {}
    }
};

const flowModelWithOneDecision = {
    '11b0b54c-5d39-429b-a23d-beb14d718c00': {
        guid: '11b0b54c-5d39-429b-a23d-beb14d718c00',
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
        canHaveFaultConnector: false,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'None',
        filterLogic: 'and',
        object: '',
        objectIndex: 'bce9db1e-30c9-4587-8907-6ec7e0da56ca',
        filters: [
            {
                rowIndex: '81d2dc18-12c5-49bf-aa31-d3b3ba98cf48',
                leftHandSide: '',
                leftHandSideDataType: 'String',
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
        nodeType: 'start',
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c'
    },
    '85d9163a-a2ec-4137-8a7e-7716d6ce414d': {
        guid: '85d9163a-a2ec-4137-8a7e-7716d6ce414d',
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
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: null,
        parent: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c',
        childIndex: 1,
        isTerminal: true
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['11b0b54c-5d39-429b-a23d-beb14d718c00']
    },
    'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c': {
        guid: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c',
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
        canHaveFaultConnector: false,
        isNew: true,
        defaultConnectorLabel: 'Default Outcome',
        childReferences: [
            {
                childReference: 'b1c93c47-26a0-426c-a4ce-b2c4da4c48d7'
            }
        ],
        elementType: 'Decision',
        maxConnections: 2,
        availableConnections: [
            {
                childReference: 'b1c93c47-26a0-426c-a4ce-b2c4da4c48d7',
                type: 'REGULAR'
            },
            {
                type: 'DEFAULT'
            }
        ],
        children: ['6b34f960-12ac-4d2d-8625-37d5c94b8ed2', '85d9163a-a2ec-4137-8a7e-7716d6ce414d'],
        nodeType: 'branch',
        incomingGoTo: [],
        prev: '11b0b54c-5d39-429b-a23d-beb14d718c00',
        next: null
    },
    'b1c93c47-26a0-426c-a4ce-b2c4da4c48d7': {
        guid: 'b1c93c47-26a0-426c-a4ce-b2c4da4c48d7',
        name: 'o1',
        label: 'o1',
        elementType: 'OUTCOME',
        dataType: 'Boolean',
        conditionLogic: 'and',
        conditions: [
            {
                rowIndex: '5cc25a91-b80c-4fad-91dc-505dc2501cd4',
                leftHandSide: '$Organization.Longitude',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: 'EqualTo'
            }
        ],
        doesRequireRecordChangedToMeetCriteria: false
    },
    '6b34f960-12ac-4d2d-8625-37d5c94b8ed2': {
        guid: '6b34f960-12ac-4d2d-8625-37d5c94b8ed2',
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
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        alcConnectionSource: {
            guid: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c',
            childIndex: 0
        },
        parent: 'fe1ac336-dfab-4978-a60e-ca9f9e5ffa5c',
        childIndex: 0,
        prev: null,
        isTerminal: true
    }
};

const flowModelWithGoToInLoop = {
    'b855e97c-7626-4f6f-8a7c-8a072e68a560': {
        guid: 'b855e97c-7626-4f6f-8a7c-8a072e68a560',
        description: '',
        locationX: 50,
        locationY: 50,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        canHaveFaultConnector: false,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'None',
        filterLogic: 'and',
        object: '',
        objectIndex: '17ed1d25-9903-4dd6-8b13-330a8cb80714',
        filters: [
            {
                rowIndex: '5a61e2cf-635e-4007-94bd-94249d78b42d',
                leftHandSide: '',
                leftHandSideDataType: 'String',
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
        nodeType: 'start',
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: '50d9eb22-a654-48e9-9bc3-59563f11a71f'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['b855e97c-7626-4f6f-8a7c-8a072e68a560']
    },
    '00fa379e-e45c-4eb0-a617-6f34942f9043': {
        guid: '00fa379e-e45c-4eb0-a617-6f34942f9043',
        name: 'v',
        description: '',
        elementType: 'Variable',
        isCollection: true,
        isInput: false,
        isOutput: false,
        dataType: 'Date',
        subtype: null,
        subtypeIndex: '2d9799e2-c957-4296-bcb0-f322cf895230',
        scale: 2,
        defaultValue: null,
        defaultValueDataType: 'Date',
        defaultValueIndex: 'db6937c9-5b2f-424d-9800-6392db786a28',
        isAddingResourceViaLeftPanel: false
    },
    'd2b55833-ce47-4fb5-bf33-17816885c486': {
        guid: 'd2b55833-ce47-4fb5-bf33-17816885c486',
        name: 'loop',
        description: '',
        label: 'loop',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        elementSubtype: null,
        canHaveFaultConnector: false,
        isNew: true,
        assignNextValueToReference: null,
        assignNextValueToReferenceIndex: '1344a01e-e568-4821-8d1a-f1a4b7b9f92e',
        collectionReference: '00fa379e-e45c-4eb0-a617-6f34942f9043',
        collectionReferenceIndex: '2a1bda7b-c7bd-4c4b-b0a5-c92307e1e0f0',
        iterationOrder: 'Asc',
        maxConnections: 2,
        availableConnections: [
            {
                type: 'LOOP_NEXT'
            },
            {
                type: 'LOOP_END'
            }
        ],
        elementType: 'Loop',
        storeOutputAutomatically: true,
        dataType: 'Date',
        subtype: null,
        isAddingResourceViaLeftPanel: false,
        alcConnectionSource: {
            guid: 'b855e97c-7626-4f6f-8a7c-8a072e68a560'
        },
        children: ['50d9eb22-a654-48e9-9bc3-59563f11a71f'],
        nodeType: 'loop',
        incomingGoTo: [],
        prev: '50d9eb22-a654-48e9-9bc3-59563f11a71f',
        next: '50d9eb22-a654-48e9-9bc3-59563f11a71f'
    },
    '50d9eb22-a654-48e9-9bc3-59563f11a71f': {
        guid: '50d9eb22-a654-48e9-9bc3-59563f11a71f',
        name: 's1',
        description: '',
        label: 's1',
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
        canHaveFaultConnector: false,
        isNew: true,
        allowHelp: false,
        pauseMessageType: 'standard',
        helpText: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        nextOrFinishLabel: null,
        nextOrFinishLabelType: 'standard',
        backLabel: null,
        backLabelType: 'standard',
        pauseLabel: null,
        pauseLabelType: 'standard',
        childReferences: [],
        elementType: 'Screen',
        maxConnections: 1,
        nodeType: 'default',
        incomingGoTo: ['d2b55833-ce47-4fb5-bf33-17816885c486:forEach', 'd2b55833-ce47-4fb5-bf33-17816885c486'],
        prev: 'b855e97c-7626-4f6f-8a7c-8a072e68a560',
        next: 'd2b55833-ce47-4fb5-bf33-17816885c486'
    }
};

const flowModelWithGoToOnFault = {
    '549a2833-cf30-4062-a821-512c21a4b5bb': {
        guid: '549a2833-cf30-4062-a821-512c21a4b5bb',
        description: '',
        locationX: 50,
        locationY: 50,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        canHaveFaultConnector: false,
        elementType: 'START_ELEMENT',
        maxConnections: 1,
        triggerType: 'None',
        filterLogic: 'and',
        object: '',
        objectIndex: '7fe2bdd3-872a-48a9-8d90-36dfcf4d008f',
        filters: [
            {
                rowIndex: '64cc9e9a-59fd-438f-bf54-8fe650de812c',
                leftHandSide: '',
                leftHandSideDataType: 'String',
                rightHandSide: '',
                rightHandSideDataType: '',
                operator: ''
            }
        ],
        childReferences: [],
        availableConnection: [
            {
                type: 'REGULAR'
            }
        ],
        nodeType: 'start',
        prev: null,
        parent: 'root',
        childIndex: 0,
        isTerminal: true,
        next: '90121ae1-3edc-499c-8561-d833b43352dd'
    },
    '202a0ca0-1f09-4695-99d0-2060f77aa702': {
        guid: '202a0ca0-1f09-4695-99d0-2060f77aa702',
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
            hasError: false,
            isSelectable: true
        },
        canHaveFaultConnector: false,
        elementType: 'END_ELEMENT',
        value: 'END_ELEMENT',
        text: 'END_ELEMENT',
        nodeType: 'end',
        prev: 'b58b6184-7f6e-4f7d-89bc-2e0e6e03912d'
    },
    root: {
        elementType: 'root',
        nodeType: 'root',
        guid: 'root',
        name: 'root',
        label: 'root',
        text: 'root',
        value: 'root',
        prev: null,
        next: null,
        children: ['549a2833-cf30-4062-a821-512c21a4b5bb']
    },
    'b58b6184-7f6e-4f7d-89bc-2e0e6e03912d': {
        guid: 'b58b6184-7f6e-4f7d-89bc-2e0e6e03912d',
        name: 'ac1',
        description: '',
        label: 'ac1',
        locationX: 0,
        locationY: 0,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            hasError: false,
            isSelectable: true
        },
        canHaveFaultConnector: true,
        actionType: 'quickAction',
        actionName: 'CollaborationGroup.NewGroupMember',
        dataTypeMappings: [],
        inputParameters: [
            {
                rowIndex: '212ca5ea-0dd8-402a-b86c-7004304114a4',
                name: 'MemberId',
                value: '$User.Division',
                valueDataType: 'reference',
                subtype: '',
                isCollection: false
            },
            {
                rowIndex: '277cb2b4-411a-4e9f-8d8a-6b501e2988d4',
                name: 'contextId',
                value: '$User.Division',
                valueDataType: 'reference',
                subtype: '',
                isCollection: false
            }
        ],
        outputParameters: [],
        availableConnection: [
            {
                type: 'REGULAR'
            },
            {
                type: 'FAULT'
            }
        ],
        maxConnections: 2,
        elementType: 'ActionCall',
        dataType: 'Boolean',
        storeOutputAutomatically: false,
        isAddingResourceViaLeftPanel: false,
        alcConnectionSource: {
            guid: '549a2833-cf30-4062-a821-512c21a4b5bb'
        },
        nodeType: 'default',
        incomingGoTo: [],
        prev: '90121ae1-3edc-499c-8561-d833b43352dd',
        next: '202a0ca0-1f09-4695-99d0-2060f77aa702',
        fault: '90121ae1-3edc-499c-8561-d833b43352dd'
    },
    '90121ae1-3edc-499c-8561-d833b43352dd': {
        guid: '90121ae1-3edc-499c-8561-d833b43352dd',
        name: 's1',
        description: '',
        label: 's1',
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
        canHaveFaultConnector: false,
        isNew: true,
        allowHelp: false,
        pauseMessageType: 'standard',
        helpText: '',
        pausedText: '',
        showFooter: true,
        showHeader: true,
        nextOrFinishLabel: null,
        nextOrFinishLabelType: 'standard',
        backLabel: null,
        backLabelType: 'standard',
        pauseLabel: null,
        pauseLabelType: 'standard',
        childReferences: [],
        elementType: 'Screen',
        maxConnections: 1,
        nodeType: 'default',
        incomingGoTo: ['b58b6184-7f6e-4f7d-89bc-2e0e6e03912d:fault'],
        prev: '549a2833-cf30-4062-a821-512c21a4b5bb',
        next: 'b58b6184-7f6e-4f7d-89bc-2e0e6e03912d'
    }
};

export {
    flowModelData,
    recordTriggeredFlowModelData,
    recordTriggerFlowModel2,
    scheduleTriggerFlowModel,
    flowModelWithOneDecision,
    flowModelWithGoToInLoop,
    flowModelWithGoToOnFault
};
