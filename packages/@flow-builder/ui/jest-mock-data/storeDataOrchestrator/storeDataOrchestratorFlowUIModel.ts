// @ts-nocheck
// To update orchestratorFlowUIModel from orchestratorFlow.json, run flowTranslator.test.js and follow instructions
export const orchestratorFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 122,
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
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
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
            shouldSupportScheduledPaths: false
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'Decision1',
            description: 'This is the first Decision',
            label: 'Decision1',
            locationX: 248,
            locationY: 158,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            childReferences: [
                {
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'fc408daa-3152-46bf-8733-c1083018292b': {
            guid: 'fc408daa-3152-46bf-8733-c1083018292b',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
                    leftHandSide: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
                    rightHandSide: '$GlobalConstant.EmptyString',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'e682f03e-925a-4d84-adc3-f1c5ceea0201': {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            name: 'Decision2',
            description: '',
            label: 'Decision2',
            locationX: 50,
            locationY: 278,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            childReferences: [
                {
                    childReference: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'outcome2',
            label: 'outcome2',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
                    leftHandSide: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
                    rightHandSide: '$GlobalConstant.EmptyString',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            name: 'vText',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1'
        }
    },
    connectors: [
        {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '90246d76-2818-4059-b0fd-425e241f8708',
            source: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            childSource: 'fc408daa-3152-46bf-8733-c1083018292b',
            target: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            label: 'outcome1',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        'a4451815-988d-4f17-883d-64b6ad9fab7e',
        'e682f03e-925a-4d84-adc3-f1c5ceea0201'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000c0RNAAY',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'orchestratorFlow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'orchestratorFlow',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2021-06-08T13:31:53.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'orchestratorFlow',
        processType: 'Orchestrator',
        runInMode: null,
        status: 'Draft',
        versionNumber: 1,
        apiVersion: 53,
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null
    }
};
