// To update recordTriggeredFlowUIModel from recordTriggeredFlow, run flowTranslator.test.js and follow instructions
export const recordTriggeredFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            name: '$Record',
            description: '',
            locationX: 254,
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
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                },
                {
                    childReference: '90246d76-2818-4059-b0fd-425e241f8708'
                }
            ],
            availableConnections: [],
            shouldSupportScheduledPaths: true,
            defaultConnectorLabel: 'FlowBuilderConnectorLabels.immediateConnectorLabel'
        },
        'fc408daa-3152-46bf-8733-c1083018292b': {
            guid: 'fc408daa-3152-46bf-8733-c1083018292b',
            name: 'myScheduledPath2DaysBefore',
            label: 'myScheduledPath2DaysBefore',
            elementType: 'ScheduledPath',
            dataType: 'Boolean',
            timeSource: 'CreatedDate',
            offsetUnit: 'DaysBefore',
            offsetNumber: '2',
            maxBatchSize: 0
        },
        '90246d76-2818-4059-b0fd-425e241f8708': {
            guid: '90246d76-2818-4059-b0fd-425e241f8708',
            name: 'myScheduledPathHoursAfter',
            label: 'myScheduledPathHoursAfter',
            elementType: 'ScheduledPath',
            dataType: 'Boolean',
            timeSource: 'LastModifiedDate',
            offsetUnit: 'HoursAfter',
            offsetNumber: '4',
            maxBatchSize: 0
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'Post_to_Chatter_Action',
            description: '',
            label: 'Post to Chatter Action',
            locationX: 578,
            locationY: 528,
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
                    rowIndex: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
                    name: 'text',
                    value: 'Foo',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
                    name: 'subjectNameOrId',
                    value: 'Bar',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
                    name: 'type',
                    value: '$GlobalConstant.EmptyString',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '7f4ddba5-e41b-456b-b686-94b257cc9914',
                    name: 'visibility',
                    value: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1.Owner.IsActive',
                    valueDataType: 'reference',
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
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be': {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            name: 'assign',
            description: '',
            label: 'assign',
            locationX: 380,
            locationY: 1103,
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
                    rowIndex: '53329036-32e6-4965-a1d2-b12cd0344f99',
                    leftHandSide: '$Record.Description',
                    rightHandSide: '$Record__Prior.AnnualRevenue',
                    rightHandSideDataType: 'reference',
                    operator: 'Add'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '04e1c283-fc0b-4928-a495-89d956368769': {
            guid: '04e1c283-fc0b-4928-a495-89d956368769',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 710,
            locationY: 408,
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
                    childReference: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8'
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
        'a193d56e-2ee7-422d-a3ff-664fc82a0fd8': {
            guid: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
                    leftHandSide: '$Record__Prior.Name',
                    rightHandSide: 'theAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1': {
            guid: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2f00ca0d-743f-4639-a084-272bbc548f8b'
        },
        'a18b3d06-504c-4e47-9f44-6663c42703cf': {
            guid: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '20336b8d-01e4-49eb-bb24-87deba5f6ef8'
        },
        'e62ce284-ccf2-46af-8446-c0a110a4bba0': {
            guid: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            name: 'create_account_from_an_account',
            description: '',
            label: 'create account from an account',
            locationX: 50,
            locationY: 288,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: '',
            objectIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            getFirstRecordOnly: true,
            inputReference: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
            inputReferenceIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            maxConnections: 2,
            elementType: 'RecordCreate',
            assignRecordIdToReferenceIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
            dataType: 'Boolean'
        },
        'a6849bcb-05b6-4898-8cc1-12ff825524c5': {
            guid: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            name: 'create_account_manual_output',
            description: '',
            label: 'create account manual output',
            locationX: 314,
            locationY: 288,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            inputAssignments: [
                {
                    rowIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'accountName',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            maxConnections: 2,
            elementType: 'RecordCreate',
            assignRecordIdToReference: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            assignRecordIdToReferenceIndex: '85d76151-9bec-4869-b691-791baf964b4f',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'e653d56e-898d-4e69-87c3-07338d100647': {
            guid: 'e653d56e-898d-4e69-87c3-07338d100647',
            name: 'Update_Triggering_Record',
            description: '',
            label: 'Update Triggering Record',
            locationX: 710,
            locationY: 288,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            inputReference: '$Record',
            inputReferenceIndex: '956ee0bf-ff21-44f4-9917-65676160e094',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordUpdate',
            inputAssignments: [
                {
                    rowIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
                    leftHandSide: '.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'Trigg',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            dataType: 'Boolean',
            wayToFindRecords: 'triggeringRecord'
        },
        '2bf626b1-9430-49ca-ad02-a75241931b16': {
            guid: '2bf626b1-9430-49ca-ad02-a75241931b16',
            name: 'updateTriggerRecordWithRelatedFields',
            description:
                '$Record is an Account and the related entity is Assets\nThere is only 1 filter, and 1 assignment.\nThe assignment is the price.',
            label: 'updateTriggerRecordWithRelatedFields',
            locationX: 380,
            locationY: 983,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            inputReference: '$Record.Parent.Contacts',
            inputReferenceIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordUpdate',
            inputAssignments: [
                {
                    rowIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
                    leftHandSide: '.Description',
                    leftHandSideDataType: 'String',
                    rightHandSide: '$User.Signature',
                    rightHandSideDataType: 'reference'
                }
            ],
            filters: [
                {
                    rowIndex: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    leftHandSide: '.MailingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: '$Record.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: 'and',
            object: '',
            objectIndex: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            dataType: 'Boolean',
            wayToFindRecords: 'relatedRecordLookup'
        }
    },
    connectors: [
        {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            label: 'FlowBuilderConnectorLabels.immediateConnectorLabel',
            type: 'IMMEDIATE',
            config: {
                isSelected: false
            }
        },
        {
            guid: '6d690706-908c-4d94-9513-1b219301b4c5',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: 'fc408daa-3152-46bf-8733-c1083018292b',
            target: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            label: 'myScheduledPath2DaysBefore',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: '90246d76-2818-4059-b0fd-425e241f8708',
            target: 'e653d56e-898d-4e69-87c3-07338d100647',
            label: 'myScheduledPathHoursAfter',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
            source: '04e1c283-fc0b-4928-a495-89d956368769',
            childSource: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
            target: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            label: 'outcome',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            source: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            childSource: null,
            target: '2bf626b1-9430-49ca-ad02-a75241931b16',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            source: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            childSource: null,
            target: '2bf626b1-9430-49ca-ad02-a75241931b16',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
            source: 'e653d56e-898d-4e69-87c3-07338d100647',
            childSource: null,
            target: '04e1c283-fc0b-4928-a495-89d956368769',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '40c11213-36c0-451e-a5aa-8790aee02559',
            source: '2bf626b1-9430-49ca-ad02-a75241931b16',
            childSource: null,
            target: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
        '04e1c283-fc0b-4928-a495-89d956368769',
        'e62ce284-ccf2-46af-8446-c0a110a4bba0',
        'a6849bcb-05b6-4898-8cc1-12ff825524c5',
        'e653d56e-898d-4e69-87c3-07338d100647',
        '2bf626b1-9430-49ca-ad02-a75241931b16'
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
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Default'],
        timeZoneSidKey: null
    }
};
