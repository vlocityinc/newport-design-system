// To update recordTriggeredFlowUIModel from recordTriggeredFlow, run flowTranslator.test.js and follow instructions
export const recordTriggeredFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            name: '$Record',
            description: '',
            locationX: 170,
            locationY: 53,
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
            maxConnections: 3,
            triggerType: 'RecordAfterSave',
            filterLogic: 'and',
            recordTriggerType: 'Update',
            object: 'Account',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            haveSystemVariableFields: true,
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true,
            doesRequireRecordChangedToMeetCriteria: true,
            childReferences: [
                {
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                },
                {
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                }
            ],
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                },
                {
                    type: 'REGULAR',
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                },
                {
                    type: 'IMMEDIATE'
                }
            ],
            shouldSupportScheduledPaths: true,
            defaultConnectorLabel: 'FlowBuilderConnectorLabels.immediateConnectorLabel'
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'myScheduledPath2DaysBefore',
            label: 'myScheduledPath2DaysBefore',
            elementType: 'ScheduledPath',
            dataType: 'Boolean',
            timeSource: 'CreatedDate',
            offsetUnit: 'DaysBefore',
            offsetNumber: '2',
            maxBatchSize: 0
        },
        'fc408daa-3152-46bf-8733-c1083018292b': {
            guid: 'fc408daa-3152-46bf-8733-c1083018292b',
            name: 'myScheduledPathHoursAfter',
            label: 'myScheduledPathHoursAfter',
            elementType: 'ScheduledPath',
            dataType: 'Boolean',
            timeSource: 'LastModifiedDate',
            offsetUnit: 'HoursAfter',
            offsetNumber: '4',
            maxBatchSize: 0
        },
        '6d690706-908c-4d94-9513-1b219301b4c5': {
            guid: '6d690706-908c-4d94-9513-1b219301b4c5',
            name: 'Post_to_Chatter_Action',
            description: '',
            label: 'Post to Chatter Action',
            locationX: 94,
            locationY: 555,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
                    name: 'text',
                    value: 'Foo',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
                    name: 'subjectNameOrId',
                    value: 'Bar',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputParameters: [],
            availableConnections: [
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
            flowTransactionModel: 'CurrentTransaction'
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            name: 'assign',
            description: '',
            label: 'assign',
            locationX: 623,
            locationY: 403,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
                    leftHandSide: '$Record.Description',
                    rightHandSide: '$Record__Prior.AnnualRevenue',
                    rightHandSideDataType: 'reference',
                    operator: 'Add'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'cc0381a7-0c64-4935-bc0c-25ecc2e958f1': {
            guid: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 815,
            locationY: 408,
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
                    childReference: '4968239c-5e3d-45ee-9339-f575c917e223'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '4968239c-5e3d-45ee-9339-f575c917e223'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '4968239c-5e3d-45ee-9339-f575c917e223': {
            guid: '4968239c-5e3d-45ee-9339-f575c917e223',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
                    leftHandSide: '$Record__Prior.Name',
                    rightHandSide: 'theAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '0ecd3000-0adc-4d34-bdc1-acd331740de0': {
            guid: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '7f4ddba5-e41b-456b-b686-94b257cc9914',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be'
        },
        '53329036-32e6-4965-a1d2-b12cd0344f99': {
            guid: '53329036-32e6-4965-a1d2-b12cd0344f99',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '04e1c283-fc0b-4928-a495-89d956368769',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8'
        },
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            name: 'create_account_from_an_account',
            description: '',
            label: 'create account from an account',
            locationX: 105,
            locationY: 361,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: '',
            objectIndex: '85d76151-9bec-4869-b691-791baf964b4f',
            getFirstRecordOnly: true,
            inputReference: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            inputReferenceIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            maxConnections: 2,
            elementType: 'RecordCreate',
            assignRecordIdToReferenceIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
            dataType: 'Boolean'
        },
        '2f00ca0d-743f-4639-a084-272bbc548f8b': {
            guid: '2f00ca0d-743f-4639-a084-272bbc548f8b',
            name: 'create_account_manual_output',
            description: '',
            label: 'create account manual output',
            locationX: 337,
            locationY: 373,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            inputAssignments: [
                {
                    rowIndex: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'accountName',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            maxConnections: 2,
            elementType: 'RecordCreate',
            assignRecordIdToReference: '53329036-32e6-4965-a1d2-b12cd0344f99',
            assignRecordIdToReferenceIndex: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'cc44cf67-84c7-4dc5-b851-44d57be8fa66': {
            guid: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
            name: 'Update_Triggering_Record',
            description: '',
            label: 'Update Triggering Record',
            locationX: 491,
            locationY: 673,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            inputReference: '$Record',
            inputReferenceIndex: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordUpdate',
            inputAssignments: [
                {
                    rowIndex: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
                    leftHandSide: '.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'Trigg',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
            dataType: 'Boolean',
            wayToFindRecords: 'triggeringRecord'
        }
    },
    connectors: [],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '6d690706-908c-4d94-9513-1b219301b4c5',
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
        'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
        '2f00ca0d-743f-4639-a084-272bbc548f8b',
        'cc44cf67-84c7-4dc5-b851-44d57be8fa66'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000cENNAA2',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'RecordTriggeredFlow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'RecordTriggeredFlow',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2021-07-20T12:50:11.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'RecordTriggeredFlow',
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'InvalidDraft',
        versionNumber: 1,
        apiVersion: 51,
        isAutoLayoutCanvas: false,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Default']
    }
};
