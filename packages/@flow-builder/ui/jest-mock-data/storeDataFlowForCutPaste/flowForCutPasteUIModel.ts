export const flowForCutPasteUIModel = {
    elements: {
        '9d216bb2-34fa-49cc-a598-2317eb581b42': {
            guid: '9d216bb2-34fa-49cc-a598-2317eb581b42',
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
            canHaveFaultConnector: false,
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterLogic: 'and',
            object: '',
            objectIndex: '687b06b7-7612-4201-a464-d590cf1a5b8d',
            filters: [
                {
                    rowIndex: '26d25ec5-5141-4846-b627-137bda7ab0c7',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: [],
            shouldSupportScheduledPaths: false,
            nodeType: 'start',
            parent: 'root',
            childIndex: 0,
            isTerminal: true,
            prev: null,
            next: '2a06bca1-8acc-431f-a602-8440fd343af6'
        },
        'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc': {
            guid: 'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc',
            name: 'as3',
            description: '',
            prev: 'cec5841b-465a-41d7-a918-7e40b788a017',
            incomingGoTo: [],
            nodeType: 'default',
            label: 'as3',
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
            isNew: false,
            assignmentItems: [
                {
                    rowIndex: 'c5c7e1db-0ed8-400e-a644-6a6e88ee2aa8',
                    leftHandSide: '58a9f754-cce1-4222-a36f-8d6fcb6dece3',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            isInlineEditingResource: false
        },
        '2a06bca1-8acc-431f-a602-8440fd343af6': {
            guid: '2a06bca1-8acc-431f-a602-8440fd343af6',
            name: 'as1',
            description: '',
            next: 'cd26c02a-a6cf-4682-845b-a6de4e65bbdb',
            prev: '9d216bb2-34fa-49cc-a598-2317eb581b42',
            incomingGoTo: [],
            nodeType: 'default',
            label: 'as1',
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
            isNew: false,
            assignmentItems: [
                {
                    rowIndex: '8d94cb11-49a5-464b-b65d-9f9f4402cff9',
                    leftHandSide: '$Flow.CurrentStage',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            isInlineEditingResource: false
        },
        'f0d1ca98-ff56-452f-bb65-2f7f3891202d': {
            guid: 'f0d1ca98-ff56-452f-bb65-2f7f3891202d',
            name: 'as4',
            description: '',
            incomingGoTo: [],
            parent: 'cd26c02a-a6cf-4682-845b-a6de4e65bbdb',
            childIndex: 2,
            isTerminal: false,
            nodeType: 'default',
            label: 'as4',
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
            isNew: false,
            assignmentItems: [
                {
                    rowIndex: '77c5ef3c-91e8-4972-9bba-2a9b9f3adc4f',
                    leftHandSide: '$Flow.CurrentStage',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            isInlineEditingResource: false
        },
        'bf9dd006-2532-45fb-b5a0-703b227ea2f1': {
            guid: 'bf9dd006-2532-45fb-b5a0-703b227ea2f1',
            name: 'as2',
            description: '',
            next: '34f6b62e-a22e-4273-93a3-931b563c22bf',
            incomingGoTo: [],
            parent: 'cec5841b-465a-41d7-a918-7e40b788a017',
            childIndex: 0,
            isTerminal: true,
            nodeType: 'default',
            label: 'as2',
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
            isNew: false,
            assignmentItems: [
                {
                    rowIndex: '06dcda05-d47c-434f-9b22-56b81df699d4',
                    leftHandSide: '$Flow.CurrentStage',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            isInlineEditingResource: false
        },
        'cd26c02a-a6cf-4682-845b-a6de4e65bbdb': {
            guid: 'cd26c02a-a6cf-4682-845b-a6de4e65bbdb',
            name: 'd1',
            description: '',
            label: 'd1',
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
            childReferences: [
                {
                    childReference: '2e677de1-8d08-4c47-b245-63f22a0dac17'
                },
                {
                    childReference: '1054e601-1a92-4b9e-90ef-b4b8b73d476f'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 3,
            availableConnections: [],
            nodeType: 'branch',
            prev: '2a06bca1-8acc-431f-a602-8440fd343af6',
            incomingGoTo: [],
            next: 'dee72c6a-b48e-411f-a844-ae593d34da12',
            children: ['cec5841b-465a-41d7-a918-7e40b788a017', null, 'f0d1ca98-ff56-452f-bb65-2f7f3891202d']
        },
        '2e677de1-8d08-4c47-b245-63f22a0dac17': {
            guid: '2e677de1-8d08-4c47-b245-63f22a0dac17',
            name: 'X1',
            label: '1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'a3a324c6-6b27-4ecd-ae55-16bad4f15617',
                    leftHandSide: 'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc',
                    rightHandSide: '$GlobalConstant.False',
                    rightHandSideDataType: 'Boolean',
                    operator: 'WasVisited'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '1054e601-1a92-4b9e-90ef-b4b8b73d476f': {
            guid: '1054e601-1a92-4b9e-90ef-b4b8b73d476f',
            name: 'X2',
            label: '2',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '8be05255-ed3a-4fbb-bdf5-b64b9fb8fbab',
                    leftHandSide: '$Flow.InterviewStartTime',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'cec5841b-465a-41d7-a918-7e40b788a017': {
            guid: 'cec5841b-465a-41d7-a918-7e40b788a017',
            name: 'd2',
            description: '',
            label: 'd2',
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
            childReferences: [
                {
                    childReference: '823b6e62-9de2-484a-82f1-c65298231591'
                },
                {
                    childReference: '32f64b96-4fd4-4644-887b-62ca9e04dba5'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 3,
            availableConnections: [],
            nodeType: 'branch',
            parent: 'cd26c02a-a6cf-4682-845b-a6de4e65bbdb',
            childIndex: 0,
            isTerminal: false,
            prev: null,
            incomingGoTo: [],
            next: 'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc',
            children: ['bf9dd006-2532-45fb-b5a0-703b227ea2f1', null, null],
            isNew: false
        },
        '823b6e62-9de2-484a-82f1-c65298231591': {
            guid: '823b6e62-9de2-484a-82f1-c65298231591',
            name: 'X1_0',
            label: '1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '7ef73f49-d992-417e-9ba2-8c1440e8227e',
                    leftHandSide: 'd34f57b3-86d9-48ed-9e4e-7b59e27a22bc',
                    rightHandSide: '$GlobalConstant.False',
                    rightHandSideDataType: 'Boolean',
                    operator: 'WasVisited'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '32f64b96-4fd4-4644-887b-62ca9e04dba5': {
            guid: '32f64b96-4fd4-4644-887b-62ca9e04dba5',
            name: 'X2_0',
            label: '2',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '2ea2e4fa-ab14-4144-bc65-7b798d5137b5',
                    leftHandSide: '$Flow.InterviewStartTime',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '58a9f754-cce1-4222-a36f-8d6fcb6dece3': {
            guid: '58a9f754-cce1-4222-a36f-8d6fcb6dece3',
            name: 'loopvar',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ab2869bc-c392-4c14-94d3-8e8a5280247b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2e6cc7d4-943e-46b7-a22b-eb2ab26c8b38'
        },
        '76336d67-00f7-4d6a-b91d-bbe46fac6cdd': {
            guid: '76336d67-00f7-4d6a-b91d-bbe46fac6cdd',
            name: 'END_ELEMENT_2',
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
            prev: 'dee72c6a-b48e-411f-a844-ae593d34da12'
        },
        '34f6b62e-a22e-4273-93a3-931b563c22bf': {
            guid: '34f6b62e-a22e-4273-93a3-931b563c22bf',
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
            prev: 'bf9dd006-2532-45fb-b5a0-703b227ea2f1'
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
            children: ['9d216bb2-34fa-49cc-a598-2317eb581b42']
        },
        'dee72c6a-b48e-411f-a844-ae593d34da12': {
            guid: 'dee72c6a-b48e-411f-a844-ae593d34da12',
            name: 'as5',
            description: '',
            next: '76336d67-00f7-4d6a-b91d-bbe46fac6cdd',
            prev: 'cd26c02a-a6cf-4682-845b-a6de4e65bbdb',
            incomingGoTo: [],
            nodeType: 'default',
            label: 'as5',
            locationX: 75,
            locationY: 75,
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
            assignmentItems: [
                {
                    rowIndex: 'c5c7e1db-0ed8-400e-a644-6a6e88ee2aa8',
                    leftHandSide: '58a9f754-cce1-4222-a36f-8d6fcb6dece3',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment',
            isInlineEditingResource: false
        }
    },
    connectors: [],
    canvasElements: [],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000brazAAA',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'autolaunchedflow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'autolaunchedflow',
        lastModifiedBy: 'Admin User',
        lastModifiedDate: '2022-07-21T18:27:37.000Z',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'autolaunchedflow',
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'Draft',
        versionNumber: 1,
        apiVersion: 56,
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Default'],
        timeZoneSidKey: null
    }
};
