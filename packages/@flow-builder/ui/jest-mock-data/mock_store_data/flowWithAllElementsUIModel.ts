// @ts-nocheck
// To update flowWithAllElementsUIModel from flowWithAllElements, run flowTranslator.test.js and follow instructions
export const flowWithAllElementsUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 66,
            locationY: 50,
            isCanvasElement: true,
            connectorCount: 0,
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
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3': {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            name: 'actionCall1',
            description: '',
            label: 'actionCall1',
            locationX: 500,
            locationY: 652,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'quickAction',
            actionName: 'LogACall',
            dataTypeMappings: [],
            inputParameters: [],
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
            storeOutputAutomatically: false
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'actionCallAutomaticOutput',
            description: '',
            label: 'actionCallAutomaticOutput',
            locationX: 327,
            locationY: 649,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
                    name: 'subjectNameOrId',
                    value: 'jsmith@salesforce.com',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
                    name: 'text',
                    value: 'This is my message',
                    valueDataType: 'String'
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'localAction',
            description: 'this is a sample local action',
            label: 'localAction',
            locationX: 667,
            locationY: 661,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'component',
            actionName: 'c:localActionSample',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
                    name: 'subject',
                    value: 'team',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
                    name: 'greeting',
                    value: 'hello',
                    valueDataType: 'String'
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
            storeOutputAutomatically: false
        },
        '4968239c-5e3d-45ee-9339-f575c917e223': {
            guid: '4968239c-5e3d-45ee-9339-f575c917e223',
            name: 'caseLogACallAutomatic',
            description: '',
            label: 'caseLogACallAutomatic',
            locationX: 832,
            locationY: 670.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'quickAction',
            actionName: 'Case.LogACall',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
                    name: 'contextId',
                    value: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
                    valueDataType: 'reference'
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '7f4ddba5-e41b-456b-b686-94b257cc9914': {
            guid: '7f4ddba5-e41b-456b-b686-94b257cc9914',
            name: 'apexCall_anonymous_account',
            description: '',
            label: 'apexCall anonymous account',
            locationX: 571,
            locationY: 34,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'getAccounts',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'SObject',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: 'Account',
            isCollection: false,
            apexClass: null
        },
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be': {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            name: 'addAccountExternalService',
            description: '',
            label: 'addAccountExternalService',
            locationX: 754,
            locationY: 47,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'externalService',
            actionName: 'BankServiceNew.addAccount',
            dataTypeMappings: [],
            inputParameters: [],
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '53329036-32e6-4965-a1d2-b12cd0344f99': {
            guid: '53329036-32e6-4965-a1d2-b12cd0344f99',
            name: 'emailAlertOnAccount',
            description: '',
            label: 'emailAlertOnAccount',
            locationX: 406,
            locationY: 39,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'emailAlert',
            actionName: 'Account.my_email_alert',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
                    name: 'SObjectRowId',
                    value: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2.Id',
                    valueDataType: 'reference'
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
            elementType: 'EMAIL_ALERT',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        '41c6da8a-c6e0-418b-8b23-9906b4adab11': {
            guid: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
            name: 'apexCall_anonymous_string',
            description: '',
            label: 'apexCall anonymous string',
            locationX: 742,
            locationY: 186,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'InvocableGetAccountName',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
                    name: 'accountIds',
                    value: '',
                    valueDataType: ''
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
            elementType: 'APEX_CALL',
            dataType: 'String',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: null,
            isCollection: false,
            apexClass: null
        },
        '3f1c4d9a-ea88-4c6c-85ac-6aa009601964': {
            guid: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
            name: 'apexCall_action_account_manual_output',
            description: '',
            label: 'apexCall action account manual output',
            locationX: 533,
            locationY: 183,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
            outputParameters: [
                {
                    rowIndex: '2f00ca0d-743f-4639-a084-272bbc548f8b',
                    name: 'generatedAccount',
                    value: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    valueDataType: 'reference'
                }
            ],
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            maxConnections: 2,
            elementType: 'APEX_CALL',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'a18b3d06-504c-4e47-9f44-6663c42703cf': {
            guid: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            name: 'apexCall_account_automatic_output',
            description: '',
            label: 'apexCall account automatic output',
            locationX: 867,
            locationY: 182.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '5383bf9b-8314-42bd-a51e-cbee56ec3570': {
            guid: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            name: 'apexCall_String_automatic_output',
            description: '',
            label: 'apexCall String automatic output',
            locationX: 926,
            locationY: 57.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'GetAccountName',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8': {
            guid: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
            name: 'apexCall_anonymous_accounts',
            description: '',
            label: 'apexCall anonymous accounts',
            locationX: 1125,
            locationY: 49.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'GetAccounts',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'SObject',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: 'Account',
            isCollection: true,
            apexClass: null
        },
        '787fd564-24db-448c-ba59-ef88c8a5cbd9': {
            guid: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
            name: 'apexCall_anonymous_strings',
            description: '',
            label: 'apexCall anonymous strings',
            locationX: 1106,
            locationY: 209.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'InvocableGetAccountsNames',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'String',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: null,
            isCollection: true,
            apexClass: null
        },
        'cc44cf67-84c7-4dc5-b851-44d57be8fa66': {
            guid: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
            name: 'apexCall_Car_automatic_output',
            description: '',
            label: 'apexCall Car automatic output',
            locationX: 1310,
            locationY: 72.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'GetCarAction',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
                    name: 'names',
                    value: 'Clio',
                    valueDataType: 'String'
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
            elementType: 'APEX_CALL',
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '86f9f34d-e2e4-45e3-a574-78ddcd669ebf': {
            guid: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
            name: 'apexCall_anonymous_apex_collection',
            description: '',
            label: 'apexCall anonymous apex collection',
            locationX: 1235,
            locationY: 218.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'ApexTypeCollectionAction',
            dataTypeMappings: [],
            inputParameters: [],
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
            elementType: 'APEX_CALL',
            dataType: 'Apex',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: null,
            isCollection: true,
            apexClass: 'InvocableGetCars$GetCarResult'
        },
        'a6849bcb-05b6-4898-8cc1-12ff825524c5': {
            guid: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            name: 'actionCallLC_apex_no_sobject_auto',
            description: '',
            label: 'actionCallLC apex no sobject auto',
            locationX: 1128,
            locationY: 367.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'component',
            actionName: 'c:LightningComponentWithApexNoSObject',
            dataTypeMappings: [],
            inputParameters: [],
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            name: 'actionCallLC_apex_with_sobject_auto',
            description: '',
            label: 'actionCallLC apex with sobject auto',
            locationX: 1248,
            locationY: 367.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            actionType: 'component',
            actionName: 'c:LightningWithApexContainsSObject',
            dataTypeMappings: [],
            inputParameters: [],
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true
        },
        '7ab29c0c-3dbf-4f99-a94c-311ef891973f': {
            guid: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            name: 'assignment1',
            description: '',
            label: 'assignment1Label',
            locationX: 369,
            locationY: 177,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignmentItems: [
                {
                    rowIndex: '85d76151-9bec-4869-b691-791baf964b4f',
                    leftHandSide: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
                    rightHandSide: '9d11ba05-33c4-4893-87b8-9560be9557d2',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'bb597c66-db1e-4636-85b6-31f89b320bd4': {
            guid: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
            name: 'assign_W_7251820',
            description: '',
            label: 'assign-W-7251820',
            locationX: 1479,
            locationY: 216.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignmentItems: [
                {
                    rowIndex: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
                    leftHandSide: 'ac66cdf6-9167-4628-8faa-079f39e2e32b.AccountNumber',
                    rightHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2.AccountNumber',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
                    leftHandSide: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
                    rightHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
            name: 'decision1',
            description: '',
            label: 'decision1',
            locationX: 313,
            locationY: 801,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            childReferences: [
                {
                    childReference: '69030d84-1e7f-49c3-ad89-ddc4db69050a'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '69030d84-1e7f-49c3-ad89-ddc4db69050a'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '69030d84-1e7f-49c3-ad89-ddc4db69050a': {
            guid: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
                    leftHandSide: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2': {
            guid: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 1050,
            locationY: 472.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            childReferences: [
                {
                    childReference: 'a8368340-a386-4406-9118-02389237ad54'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a8368340-a386-4406-9118-02389237ad54'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
                    leftHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    rightHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '6e77e9cf-2492-44ca-a088-ee4b8159d478': {
            guid: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!d1fda889-4f3a-48cd-ba79-be4fbca04da2.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 2,
            elementType: 'Formula'
        },
        '90da6513-4272-44d6-9f80-4cfc29acc5a3': {
            guid: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5c075fad-735a-4628-9e51-495d3292d153'
        },
        'd1fda889-4f3a-48cd-ba79-be4fbca04da2': {
            guid: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '40c11213-36c0-451e-a5aa-8790aee02559',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0'
        },
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6'
        },
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
        },
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07': {
            guid: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
        },
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9': {
            guid: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87'
        },
        '6afc7b95-a112-4bd0-99e6-4114704080f2': {
            guid: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
        },
        '3147a31d-26a3-408c-b00b-a31983df0da5': {
            guid: '3147a31d-26a3-408c-b00b-a31983df0da5',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: 'eb19f518-e185-488c-a5b2-9107036766f4',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
        },
        '34eaa6ff-765e-4c12-8635-b00f6c7f2c34': {
            guid: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: 'ba8a8e41-3944-4099-9655-065f054e811f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e'
        },
        '97a7048c-7323-4356-93c4-30995cf2c8c7': {
            guid: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '56095468-2459-481d-b084-04a05babcb22'
        },
        '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9': {
            guid: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796'
        },
        '88a32528-0dfa-4237-b9dd-a14c1a6d6d10': {
            guid: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd'
        },
        '2635dcd9-5d1d-4d46-b683-eabd7059690c': {
            guid: '2635dcd9-5d1d-4d46-b683-eabd7059690c',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '54aae715-8881-4a52-b7a9-25c385d1488e',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b'
        },
        'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9': {
            guid: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922'
        },
        '9d11ba05-33c4-4893-87b8-9560be9557d2': {
            guid: '9d11ba05-33c4-4893-87b8-9560be9557d2',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49'
        },
        '5e2803c7-a184-465c-92e3-1d29634f2114': {
            guid: '5e2803c7-a184-465c-92e3-1d29634f2114',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd'
        },
        '2d1ada73-88e9-4cf4-a814-dcba8d517104': {
            guid: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            name: 'stringCollectionVariable2',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4'
        },
        '756e3b06-1ee6-4f8e-82b2-ce141c9405db': {
            guid: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab'
        },
        'c518ac20-1202-42a6-ac3d-cfc8b707f4c3': {
            guid: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: '1283ede6-414b-45a2-851a-1b113f26bffd',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc'
        },
        'd7b1d0e5-68d7-4734-b1d1-01247631d93f': {
            guid: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32'
        },
        '97e556fe-63c0-4426-9421-b3dc0d5a74aa': {
            guid: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '8e3cf25f-1ce2-48c8-9634-b192b94ae230',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6'
        },
        'e502e40a-7dfc-4e71-8a42-c491f86a560a': {
            guid: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '3d47c47d-df60-4f92-85c8-71982afd9938',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78'
        },
        'b2eef3a8-57d5-42b7-ad31-c9923cd8a782': {
            guid: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '0883ba56-46a4-4420-8105-c9d17ad0183b'
        },
        'f79b5397-57f9-426b-aa00-5ef1b8b8f75d': {
            guid: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: '42afe63b-0744-4dec-a7e6-20c67691dd81',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '02504510-b361-4fb3-878e-81925a76160f'
        },
        '26b1d461-e66e-41c7-bb0e-5c86b04280db': {
            guid: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
            name: 'apexComplexTypeTwoVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestTwo216',
            subtypeIndex: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe'
        },
        '41a189ff-01f4-4018-b75c-3f363b65cc42': {
            guid: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            name: 'vAccountId',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '796969f1-a892-4b16-836e-209180057a2b',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b3a76739-4414-41d2-984e-e44bca6402c6'
        },
        '6160bbc3-c247-458e-b1b8-abc60b4d3d39': {
            guid: '6160bbc3-c247-458e-b1b8-abc60b4d3d39',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '38f77648-3c7e-4431-8403-239492238623'
        },
        '65909adb-0efe-4743-b4a7-ca6e93d71c92': {
            guid: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!756e3b06-1ee6-4f8e-82b2-ce141c9405db}</p>',
            dataType: 'String',
            isViewedAsPlainText: false
        },
        'd66cf236-ca0a-4351-952d-b12df4abdaf8': {
            guid: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
            name: 'textTemplate2',
            description: '',
            elementType: 'TextTemplate',
            text: 'This text template is in plain text mode.',
            dataType: 'String',
            isViewedAsPlainText: true
        },
        '2e02687e-41a2-42eb-ba74-81c130218b86': {
            guid: '2e02687e-41a2-42eb-ba74-81c130218b86',
            name: 'subflowAutomaticOutput',
            description: '',
            label: 'subflowAutomaticOutput',
            locationX: 1170,
            locationY: 507.1062469482422,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            flowName: 'flowWithActiveAndLatest',
            inputAssignments: [
                {
                    rowIndex: '52bc2460-8775-417b-a692-f72725a8f6b0',
                    name: 'input1',
                    value: 'a string',
                    valueDataType: 'String'
                }
            ],
            outputAssignments: [],
            maxConnections: 1,
            elementType: 'Subflow',
            storeOutputAutomatically: true,
            dataType: 'SubflowOutput'
        },
        '013c0515-5f96-493f-bf5b-3d261350a4e6': {
            guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            name: 'createAccountWithAutomaticOutput',
            description: '',
            label: 'createAccountWithAutomaticOutput',
            locationX: 1350,
            locationY: 530,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'cf176378-9ab0-436f-a161-079057c789f4',
            inputAssignments: [
                {
                    rowIndex: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
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
            assignRecordIdToReference: '',
            assignRecordIdToReferenceIndex: '27cfbe21-2aa1-4503-aa13-3677c687153d',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        '58d4a602-1abb-46e4-8c10-54c225dd56af': {
            guid: '58d4a602-1abb-46e4-8c10-54c225dd56af',
            name: 'createAccountWithAdvancedOptions',
            description: '',
            label: 'createAccountWithAdvancedOptions',
            locationX: 1059,
            locationY: 669,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635',
            inputAssignments: [
                {
                    rowIndex: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '048203c3-6751-4189-b9ab-939f0ef6d7d3',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7',
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
            assignRecordIdToReference: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            assignRecordIdToReferenceIndex: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        '1fa12c04-abe3-44d7-87d2-132178cb5c70': {
            guid: '1fa12c04-abe3-44d7-87d2-132178cb5c70',
            name: 'createFromAnAccount',
            description: '',
            label: 'createFromAnAccount',
            locationX: 1501,
            locationY: 533,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: '9598b9ad-7b8d-4a74-bf1b-32020d902af1',
            getFirstRecordOnly: true,
            inputReference: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            inputReferenceIndex: '0596012b-9bd5-4182-87ce-0e1f231967ef',
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
            assignRecordIdToReferenceIndex: '02209f51-9747-443f-8b81-87d5ee84cfd7',
            dataType: 'Boolean'
        },
        'b6131670-d12f-4df5-9560-2a476767e9e4': {
            guid: 'b6131670-d12f-4df5-9560-2a476767e9e4',
            name: 'createFromMultipleAccounts',
            description: '',
            label: 'createFromMultipleAccounts',
            locationX: 1508,
            locationY: 662,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: '247e0c32-5050-4a90-977f-f33c989ad9f9',
            getFirstRecordOnly: false,
            inputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            inputReferenceIndex: 'a0d930b7-520b-48e7-844e-df473e4214b7',
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
            assignRecordIdToReferenceIndex: '8ee25bae-66aa-4c1d-bf28-938976a1d25b',
            dataType: 'Boolean'
        },
        '79c59df8-63ef-4817-8939-4951da8d22c9': {
            guid: '79c59df8-63ef-4817-8939-4951da8d22c9',
            name: 'withApexDefSingleSObjectVariable',
            description: '',
            label: 'withApexDefSingleSObjectVariable',
            locationX: 1211,
            locationY: 668.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: 'c27e44ab-6e20-496f-80c0-623c207ab098',
            getFirstRecordOnly: true,
            inputReference: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782.account',
            inputReferenceIndex: '3a823f11-0023-4a28-bca2-2331299c86f7',
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
            assignRecordIdToReferenceIndex: 'c133671f-83c0-486e-aafc-faed91142185',
            dataType: 'Boolean'
        },
        '38e03c17-22d6-403f-91bf-6d9bd0caa696': {
            guid: '38e03c17-22d6-403f-91bf-6d9bd0caa696',
            name: 'withApexDefSObjectCollectionVariable',
            description: '',
            label: 'withApexDefSObjectCollectionVariable',
            locationX: 1363,
            locationY: 665,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: '060e2e3d-c798-4c96-b7c8-4b694bbcb5d5',
            getFirstRecordOnly: false,
            inputReference: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d.accounts',
            inputReferenceIndex: '64576cb6-0939-475e-8e1b-76feee5be4be',
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
            assignRecordIdToReferenceIndex: 'a91df44d-d786-4ab8-be03-9211069ed720',
            dataType: 'Boolean'
        },
        'b9810123-08cd-465b-ae9a-ca0c2afb3a9a': {
            guid: 'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
            name: 'create_multiple_from_apex_two_level_traversal',
            description: '',
            label: 'create multiple from apex two level traversal',
            locationX: 177,
            locationY: 297.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            object: '',
            objectIndex: '31ac8e99-5705-49f2-a2ef-bf2f6a4a22e0',
            getFirstRecordOnly: false,
            inputReference: '26b1d461-e66e-41c7-bb0e-5c86b04280db.testOne.acctListField',
            inputReferenceIndex: '90712d11-6f61-40e4-97ff-72f835ca759c',
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
            assignRecordIdToReferenceIndex: 'b15d6409-4439-4dc2-8a3d-4956e56ba21a',
            dataType: 'Boolean'
        },
        'ac66cdf6-9167-4628-8faa-079f39e2e32b': {
            guid: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
            name: 'lookupRecordAutomaticOutput',
            description: '',
            label: 'lookupRecordAutomaticOutput',
            locationX: 467,
            locationY: 984,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '9fa9376a-5212-49a1-980b-ddca1dd82388',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '26774e1d-4c9f-45f1-a426-89bad7c78eef',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: null,
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: 'b3ab254b-af11-4c5e-b0c5-949f27d4bccb',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '777c097c-f3b9-4845-9418-b50d40eb2550': {
            guid: '777c097c-f3b9-4845-9418-b50d40eb2550',
            name: 'lookupRecordCollectionAutomaticOutput',
            description: '',
            label: 'lookupRecordCollectionAutomaticOutput',
            locationX: 616,
            locationY: 987,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '16a960f8-b2e1-4481-aac8-cf744c4bf266',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: null,
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: 'f6526a3c-c24b-49e8-a910-d99a8c8342b5',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '23ae0ea4-4d33-4dcc-a579-013e91fd4159': {
            guid: '23ae0ea4-4d33-4dcc-a579-013e91fd4159',
            name: 'lookupRecordOutputReference',
            description: '',
            label: 'lookupRecordOutputReference',
            locationX: 313,
            locationY: 983,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '46c2961d-5cf6-443b-95d4-91d406c02a37',
            outputReference: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'df72b5ae-20df-4ebf-9c93-3f87b91d7791',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'b0d41663-ba7b-4020-8f88-6c83151e3a83'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '652434b1-40e0-404e-9e4d-e6864e4f8bdb'
                }
            ],
            sortOrder: 'Asc',
            sortField: 'AnnualRevenue',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: 'e713f058-3d86-43ff-9da6-c8cd70863c95',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '8574a485-6312-4e06-820d-4b7a5f030f3a': {
            guid: '8574a485-6312-4e06-820d-4b7a5f030f3a',
            name: 'getAccountAutoWithFields',
            description: '',
            label: 'getAccountAutoWithFields',
            locationX: 762,
            locationY: 987,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'c7027d6d-66ae-440f-b340-0c652eaebe79',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'd65a9682-db73-4ea7-8a38-9e2d8ee50d43',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '553332e6-c579-49e7-8757-8044dd8b530f',
                    leftHandSide: 'Account.BillingPostalCode',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'cb13b620-ebec-4c72-aff0-beebd24ef0c2'
                },
                {
                    field: 'Name',
                    rowIndex: '9f2723ee-84ae-473a-b265-ebee9afa6697'
                }
            ],
            sortOrder: 'Desc',
            sortField: 'BillingCity',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: '5a8a33e6-d476-45dc-b263-b3bae11ee715',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '8d06ba06-b0e4-4a15-ab56-651dc35a83a8': {
            guid: '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
            name: 'getAccountSeparateFieldsWithFilters',
            description: 'Get account with filters, ordered by name and assign separate fields',
            label: 'getAccountSeparateFieldsWithFilters',
            locationX: 307,
            locationY: 1125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'd6542367-8e40-4576-95aa-3baa12d98ac7',
            outputAssignments: [
                {
                    rowIndex: '123b2338-5cb1-4a98-966f-58a56114c1f6',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Los Angeles'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '3606994f-008f-4e3a-a353-cc4f7fa75086',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '3ce2bd36-67b8-4bc3-b144-1ba05ee7dafe',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [],
            sortOrder: 'Asc',
            sortField: 'Name',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: '0a3d0031-d1de-4f69-9a41-c302eecc0ea5',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '49bf649f-45c0-4d54-8533-93b51f9b557e': {
            guid: '49bf649f-45c0-4d54-8533-93b51f9b557e',
            name: 'getAccountsAutomaticWithFieldsAndFilters',
            description: 'Get Account Automatic output, with fields and filter',
            label: 'getAccountsAutomaticWithFieldsAndFilters',
            locationX: 460,
            locationY: 1135,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'd51b4de8-82af-4bac-a2ec-3780738278d4',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '5889818c-cb99-4524-a6fb-79c576f21d26',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '7b9fc3ec-7a4b-4382-bd6b-b72405aece1f',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'NotEqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '80b66606-d59f-4c14-a74e-c98a050c84bc'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '63212bdb-c6a5-4e99-85cf-9921d6fc834b'
                },
                {
                    field: 'Name',
                    rowIndex: '7b238465-d71b-489c-8223-425066aaf928'
                },
                {
                    field: 'CreatedDate',
                    rowIndex: '6f408b05-42aa-4ee2-8bbc-7756dcf10eac'
                }
            ],
            sortOrder: 'Desc',
            sortField: 'Name',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: '37cfa784-b1db-4323-8baa-51d1da0c010f',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        'a339198f-0294-4416-a67a-2782d735acad': {
            guid: 'a339198f-0294-4416-a67a-2782d735acad',
            name: 'get_account_into_apex_variable',
            description: '',
            label: 'get account into apex variable',
            locationX: 157,
            locationY: 465,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            object: 'Account',
            objectIndex: '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
            outputReference: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f.acct',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '0d21d5a2-6e85-4023-8e2b-846d05bfb367',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'e12fdd35-1aeb-4465-b52c-73a201e704a7'
                }
            ],
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: '4be9885e-987b-4fab-b204-58dd28d0829c',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '55c07deb-dcd5-45e2-ad9a-c80b7bc17362': {
            guid: '55c07deb-dcd5-45e2-ad9a-c80b7bc17362',
            name: 'get_accounts_into_apex_variable',
            description: '',
            label: 'get accounts into apex variable',
            locationX: 166,
            locationY: 175,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            object: 'Account',
            objectIndex: 'f8d71fe5-b8d5-4def-b47b-dd4aef4b47dc',
            outputReference: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f.acctListField',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '09238073-9b8a-4280-9f23-e44be298f4b0',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'df134372-8b3c-4bbd-875a-7513e76bec39'
                }
            ],
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: '096f6fc9-8bb1-4738-9365-5e8fd66eaa14',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'fd3f7f93-d285-4327-ad6d-2b080ee334b2': {
            guid: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
            name: 'lookupAccountsManual',
            description: '',
            label: 'lookupAccountsManual',
            locationX: 745,
            locationY: 352.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            object: 'Account',
            objectIndex: 'ba867a87-724c-4775-963b-2fc43169444f',
            outputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'ffdc5988-95d5-483c-b1ba-6b2adb5e8df7',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '2e27b2ec-9bb9-493d-9151-d9022471680f'
                }
            ],
            sortOrder: 'NotSorted',
            sortField: '',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordQuery',
            outputReferenceIndex: 'd5a45e74-78b4-41c3-844d-b0536f90c54b',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309': {
            guid: 'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
            name: 'deleteAccount',
            description: '',
            label: 'deleteAccount',
            locationX: 955,
            locationY: 469.359375,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            inputReferenceIndex: '3b362fa9-ea82-47fe-85f4-25406e719a72',
            object: '',
            objectIndex: '7d45ed5b-7cfd-40e1-8028-23a7e1026335',
            filterLogic: 'and',
            filters: [],
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordDelete',
            dataType: 'Boolean',
            useSobject: true
        },
        'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b': {
            guid: 'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b',
            name: 'deleteAccountWithFilters',
            description: '',
            label: 'deleteAccountWithFilters',
            locationX: 1213,
            locationY: 832,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '',
            inputReferenceIndex: '494033a5-d654-4f68-9c22-7712eaa87073',
            object: 'Account',
            objectIndex: 'c85e0459-8b6f-4540-99e7-d388a35ee4ba',
            filterLogic: '1 AND 2 OR 3',
            filters: [
                {
                    rowIndex: '336b0818-ff06-47c3-9e85-3b6fe4a10c5b',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '1a934031-6241-4115-9514-61184d4c5b75',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '48d95e2c-7c52-4423-b36a-86c4790064a5',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'SalesForce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordDelete',
            dataType: 'Boolean',
            useSobject: false
        },
        'fda10f1b-f93e-46d5-99f0-e09f9c52c147': {
            guid: 'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
            name: 'updateSObject',
            description: '',
            label: 'updateSObject',
            locationX: 744,
            locationY: 831,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            inputReferenceIndex: 'af83b78a-15c7-4381-b2a8-e254552cfeab',
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
            inputAssignments: [],
            useSobject: true,
            filters: [
                {
                    rowIndex: 'c9ebe244-887a-4821-811c-f9f17a670037',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'and',
            object: '',
            objectIndex: 'dbfccfa4-49b4-4385-a998-4ac4e9d630aa',
            dataType: 'Boolean'
        },
        'ed46d2ed-f940-4fbe-9b66-fba94ae66e70': {
            guid: 'ed46d2ed-f940-4fbe-9b66-fba94ae66e70',
            name: 'updateAccountWithFilter',
            description: '',
            label: 'updateAccountWithFilter',
            locationX: 881,
            locationY: 833,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '',
            inputReferenceIndex: '7f3aa0ed-17d0-4a43-b89a-395d3d6e609d',
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
                    rowIndex: '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'salesforce',
                    rightHandSideDataType: 'String'
                }
            ],
            useSobject: false,
            filters: [
                {
                    rowIndex: '29e3dc08-e7d7-4435-9b47-cf2a6ce41cb3',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '5a93e09a-856a-4540-a62f-239f61d7de50',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'e46d1655-6558-4c7b-b828-b040906115b0',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'Salesforce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: '1 AND 2 OR 3',
            object: 'Account',
            objectIndex: '42935e07-8378-4994-9dfe-34d987e80fac',
            dataType: 'Boolean'
        },
        '363280ef-e5f4-414b-9988-1200b330e5cb': {
            guid: '363280ef-e5f4-414b-9988-1200b330e5cb',
            name: 'loopOnAccountAutoOutput',
            description: '',
            label: 'loopOnAccountAutoOutput',
            locationX: 454,
            locationY: 342,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe',
            collectionReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            collectionReferenceIndex: '2aacf35d-91f7-42cc-a668-f0b682615d6b',
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
            dataType: 'SObject',
            subtype: 'Account'
        },
        '9abf51ab-a289-45b0-853c-040be0ed9eb7': {
            guid: '9abf51ab-a289-45b0-853c-040be0ed9eb7',
            name: 'loopOnTextCollectionAutoOutput',
            description: '',
            label: 'loopOnTextCollectionAutoOutput',
            locationX: 592,
            locationY: 336,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'd99d05ca-bae7-459a-9551-10f32d89aeb9',
            collectionReference: '5e2803c7-a184-465c-92e3-1d29634f2114',
            collectionReferenceIndex: '5a93c395-dd94-498e-9383-50caf96c6748',
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
            dataType: 'String',
            subtype: null
        },
        'db83d1da-0f30-4796-8075-843918cf6c01': {
            guid: 'db83d1da-0f30-4796-8075-843918cf6c01',
            name: 'loopOnApexAutoOutput',
            description: '',
            label: 'loopOnApexAutoOutput',
            locationX: 583,
            locationY: 503,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'ec3a2e92-54b4-4cc1-aa0b-2026ce47d2ff',
            collectionReference: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            collectionReferenceIndex: '9aba628e-835b-448a-ac6b-a3764ac735b4',
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
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216'
        },
        '3ce6eb05-97e4-467f-b821-11dfa2cdccf0': {
            guid: '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
            name: 'loopOnTextCollection',
            description: 'This is a test without automatic Output',
            label: 'loopOnTextCollection',
            locationX: 446,
            locationY: 501,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            assignNextValueToReferenceIndex: '30a1ebac-fff2-4a83-b844-7f0a8faf33b9',
            collectionReference: '5e2803c7-a184-465c-92e3-1d29634f2114',
            collectionReferenceIndex: '611f9934-04ec-47a9-8a9f-ade6f3b66435',
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
            storeOutputAutomatically: false
        },
        '016e92d2-b409-4a9d-89c0-50e637967cbc': {
            guid: '016e92d2-b409-4a9d-89c0-50e637967cbc',
            name: 'loopOnNestedApexTypeAutoOutput',
            description: '',
            label: 'loopOnNestedApexTypeAutoOutput',
            locationX: 327,
            locationY: 306.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '0dfdcc2f-0bb7-4357-80ed-337890bd89e6',
            collectionReference: '26b1d461-e66e-41c7-bb0e-5c86b04280db.testOne.acctListField',
            collectionReferenceIndex: '0918a8eb-38a1-4294-b329-39aa5b0bbd13',
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
            dataType: 'SObject',
            subtype: 'Account'
        },
        '91280889-13e2-4de0-8390-32d05b8918e5': {
            guid: '91280889-13e2-4de0-8390-32d05b8918e5',
            name: 'loopOnSobjectCollectionInApexTypeAutoOutput',
            description: '',
            label: 'loopOnSobjectCollectionInApexTypeAutoOutput',
            locationX: 735,
            locationY: 506.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8',
            collectionReference: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f.acctListField',
            collectionReferenceIndex: '91f8d923-79e4-4a85-9621-3334fac4abe5',
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
            dataType: 'SObject',
            subtype: 'Account'
        },
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da': {
            guid: '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
            name: 'loopOnScreenCompSObjectCollAutoOutput',
            description: '',
            label: 'loopOnScreenCompSObjectCollAutoOutput',
            locationX: 884,
            locationY: 334.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c',
            collectionReference: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c.accounts',
            collectionReferenceIndex: '9b6b8f63-fff0-477e-92b7-3e315551288b',
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
            dataType: 'SObject',
            subtype: 'Account'
        },
        'd6ff3600-dcdb-404b-8a8b-8a90226a575b': {
            guid: 'd6ff3600-dcdb-404b-8a8b-8a90226a575b',
            name: 'loopOnLocalActionSobjectCollInApexAutoOutput',
            description: '',
            label: 'loopOnLocalActionSobjectCollInApexAutoOutput',
            locationX: 1032,
            locationY: 333.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'a5b1853e-6b7e-4568-9b24-37414be4b4d7',
            collectionReference: '3e57f4c5-fecd-4be0-83a2-3238cdda979c.apexWithSObject.acctListField',
            collectionReferenceIndex: '90845b6c-c12e-4689-adaf-19d8127d9f99',
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
            dataType: 'SObject',
            subtype: 'Account'
        },
        'da79895d-9af9-45c9-b626-fe0fc43f4952': {
            guid: 'da79895d-9af9-45c9-b626-fe0fc43f4952',
            name: 'screen1',
            description: '',
            label: 'screen1',
            locationX: 308,
            locationY: 485,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            childReferences: [
                {
                    childReference: '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6'
                },
                {
                    childReference: 'ee652516-7b62-402f-88a2-1ab887b55072'
                },
                {
                    childReference: 'd59e0052-78b7-4ec0-bf89-27757c00baed'
                },
                {
                    childReference: 'e2363ac3-537d-4b28-afac-ae787b18687e'
                },
                {
                    childReference: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6': {
            guid: '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '960c344c-31bb-41b5-ad56-63ba96f239d8',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:email',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: 'fa417651-1251-4c86-8200-30dc2ed6849c',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
                    name: 'placeholder',
                    value: 'your email address',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:email',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:email',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'ee652516-7b62-402f-88a2-1ab887b55072': {
            guid: 'ee652516-7b62-402f-88a2-1ab887b55072',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '0fa2da7a-22de-4045-ab83-711522e52bb6',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:email',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '27851956-e853-43e1-8349-bc22d62aa5a4',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
                    name: 'placeholder',
                    value: 'your email',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:email',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:email',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: false,
            childReferences: []
        },
        'd59e0052-78b7-4ec0-bf89-27757c00baed': {
            guid: 'd59e0052-78b7-4ec0-bf89-27757c00baed',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '474faea1-942d-4f0f-8c81-8429fc131dcf',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'c:HelloWorld',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'c:HelloWorld',
                fieldType: 'ComponentInstance',
                label: 'c:HelloWorld',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'e2363ac3-537d-4b28-afac-ae787b18687e': {
            guid: 'e2363ac3-537d-4b28-afac-ae787b18687e',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'bf865980-57a7-4599-a65e-2e37eb0263a4',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'c:noSobjectOutputComp',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'c:noSobjectOutputComp',
                fieldType: 'ComponentInstance',
                label: 'c:noSobjectOutputComp',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c': {
            guid: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'e7f854a4-bb08-4fe7-9528-5f6686e56286',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'c:sobjectCollectionOutputComp',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'c:sobjectCollectionOutputComp',
                fieldType: 'ComponentInstance',
                label: 'c:sobjectCollectionOutputComp',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '217c9285-27c0-4130-b6f2-a92ee3b10177': {
            guid: '217c9285-27c0-4130-b6f2-a92ee3b10177',
            name: 'screenWithAddress',
            description: '',
            label: 'screenWithAddress',
            locationX: 873,
            locationY: 483.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            childReferences: [
                {
                    childReference: '338c0e28-a7d7-44c0-907a-0fd6aef99d83'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83': {
            guid: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '162ea6d1-7389-419d-b8c2-133462029981',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:address',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:address',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:address',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '2aa5e67a-9cdb-45da-a597-a0d24c80188c': {
            guid: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
            name: 'ScreenWithSection',
            description: '',
            label: 'ScreenWithSection',
            locationX: 161,
            locationY: 637,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            childReferences: [
                {
                    childReference: '0e7a1251-a491-43d2-8828-b61652438009'
                },
                {
                    childReference: 'f9efafa3-d83f-41a6-92e8-487eadb228c0'
                },
                {
                    childReference: 'acbbb552-1389-4ec3-9807-d8c3aa378d70'
                },
                {
                    childReference: 'e2de9f05-aae8-4dc3-a061-e5d17e4562e1'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '6f3f842a-e289-48ee-b18b-6820e87cee94': {
            guid: '6f3f842a-e289-48ee-b18b-6820e87cee94',
            name: 'slider_1',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '030e4398-87bd-4390-a8fd-a348fcd3b323',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:slider',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
                    name: 'label',
                    value: 'slider_1',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:slider',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:slider',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '2a4b3b65-06a5-4679-bac9-98dc536c68d4': {
            guid: '2a4b3b65-06a5-4679-bac9-98dc536c68d4',
            name: 'ScreenWithSection_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '865e456d-2e1d-410f-8c62-8f686238b197',
                    name: 'width',
                    value: '12',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Column',
                fieldType: 'Region'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: [
                {
                    childReference: '6f3f842a-e289-48ee-b18b-6820e87cee94'
                }
            ]
        },
        '0e7a1251-a491-43d2-8828-b61652438009': {
            guid: '0e7a1251-a491-43d2-8828-b61652438009',
            name: 'ScreenWithSection_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'RegionContainer',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Section',
                fieldType: 'RegionContainer',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
                icon: 'standard:section',
                category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
                description: 'FlowBuilderScreenEditor.fieldTypeDescriptionSection'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: [
                {
                    childReference: '2a4b3b65-06a5-4679-bac9-98dc536c68d4'
                }
            ]
        },
        'f9efafa3-d83f-41a6-92e8-487eadb228c0': {
            guid: 'f9efafa3-d83f-41a6-92e8-487eadb228c0',
            name: 'number_2',
            choiceReferences: [],
            dataType: 'Number',
            defaultValue: '',
            defaultValueIndex: 'c3ba5281-2d20-4596-99d0-94b9368c1d70',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'InputField',
            fieldText: 'number_2',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Number',
                fieldType: 'InputField',
                dataType: 'Number',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelNumber',
                icon: 'standard:number_input',
                category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                type: 'Number'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: []
        },
        '5a6a3791-5930-4c22-9f5d-ed090b53f8e6': {
            guid: '5a6a3791-5930-4c22-9f5d-ed090b53f8e6',
            name: 'text_2',
            choiceReferences: [],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: 'b8a65817-59f3-4fa9-a0a8-73602ab6a45a',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'InputField',
            fieldText: 'text_2',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'TextBox',
                fieldType: 'InputField',
                dataType: 'String',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelTextField',
                icon: 'standard:textbox',
                category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                type: 'String'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: []
        },
        'ac2ad112-16a7-4f97-bb41-7d5a0a41679f': {
            guid: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
            name: 'ScreenWithSection_Section2_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '4899e1df-446e-4158-a942-9b376323c325',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '7f18c878-eb8d-49d8-8b87-8d8ddcdf4daa',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Column',
                fieldType: 'Region'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: [
                {
                    childReference: '5a6a3791-5930-4c22-9f5d-ed090b53f8e6'
                }
            ]
        },
        '57402670-a93f-4621-a8e4-6045f765731b': {
            guid: '57402670-a93f-4621-a8e4-6045f765731b',
            name: 'email_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'e4b8d861-0407-4edd-8002-1b887499cd44',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:email',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: 'aca838b1-ea76-436d-a081-732171fdbc11',
                    name: 'label',
                    value: 'email_2',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:email',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:email',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b': {
            guid: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b',
            name: 'accounts',
            choiceReferences: [
                {
                    choiceReference: 'c046997e-c0ed-4c78-a861-05be31e4d0ac'
                },
                {
                    choiceReference: 'f4b19fd9-74ef-4f38-aa3b-549f6d105a77'
                }
            ],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: '7ba5860c-9e90-4a76-a600-591f1c42fa54',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'DropdownBox',
            fieldText: 'Accounts',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'DropdownBox',
                fieldType: 'DropdownBox',
                dataType: 'String',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelPicklist',
                icon: 'standard:picklist_type',
                category: 'FlowBuilderScreenEditor.fieldCategoryInput'
            },
            elementType: 'SCREEN_FIELD',
            defaultSelectedChoiceReference: null,
            visibilityRule: {
                conditions: [
                    {
                        rowIndex: '975adb96-3950-4767-8f2a-47e2958202f2',
                        leftHandSide: '6f3f842a-e289-48ee-b18b-6820e87cee94.value',
                        rightHandSide: '50',
                        rightHandSideDataType: 'Number',
                        operator: 'GreaterThanOrEqualTo'
                    }
                ],
                conditionLogic: 'and'
            },
            fields: [],
            childReferences: []
        },
        '78207ca6-8bba-401b-a2e8-1c279842b990': {
            guid: '78207ca6-8bba-401b-a2e8-1c279842b990',
            name: 'ScreenWithSection_Section2_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '026b8ee9-572a-40c0-9442-00e58400855d',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String'
                }
            ],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Column',
                fieldType: 'Region'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: [
                {
                    childReference: '57402670-a93f-4621-a8e4-6045f765731b'
                },
                {
                    childReference: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b'
                }
            ]
        },
        'acbbb552-1389-4ec3-9807-d8c3aa378d70': {
            guid: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
            name: 'ScreenWithSection_Section2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'RegionContainer',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'Section',
                fieldType: 'RegionContainer',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
                icon: 'standard:section',
                category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
                description: 'FlowBuilderScreenEditor.fieldTypeDescriptionSection'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: [
                {
                    childReference: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f'
                },
                {
                    childReference: '78207ca6-8bba-401b-a2e8-1c279842b990'
                }
            ]
        },
        'e2de9f05-aae8-4dc3-a061-e5d17e4562e1': {
            guid: 'e2de9f05-aae8-4dc3-a061-e5d17e4562e1',
            name: 'address_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '1ab5b2e1-0763-4cb4-a106-f1dcf5920728',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'flowruntime:address',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'flowruntime:address',
                fieldType: 'ComponentInstance',
                label: 'flowruntime:address',
                icon: 'standard:lightning_component',
                source: 'local'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'c5488001-ae8b-4364-984a-57778117437b': {
            guid: 'c5488001-ae8b-4364-984a-57778117437b',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '5c56f33d-c558-409b-837d-a835f74010ae': {
            guid: '5c56f33d-c558-409b-837d-a835f74010ae',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '8994b409-64e9-438f-8532-1c5f0ed172af',
            isShowInputSelected: false,
            isValidateSelected: false
        },
        'f4b19fd9-74ef-4f38-aa3b-549f6d105a77': {
            guid: 'f4b19fd9-74ef-4f38-aa3b-549f6d105a77',
            name: 'other',
            description: '',
            elementType: 'Choice',
            dataType: 'String',
            choiceText: 'Other',
            storedValue: 'other',
            storedValueDataType: 'String',
            storedValueIndex: 'efbed9ce-b23f-43d3-bbe8-f9ddc2234909',
            isShowInputSelected: true,
            isValidateSelected: false,
            userInput: {
                isRequired: false,
                promptText: 'Please specify'
            }
        },
        'c046997e-c0ed-4c78-a861-05be31e4d0ac': {
            guid: 'c046997e-c0ed-4c78-a861-05be31e4d0ac',
            name: 'recordChoiceSet',
            description: '',
            limit: '5',
            displayField: 'Name',
            valueField: 'Name',
            dataType: 'String',
            sortOrder: 'Asc',
            elementType: 'DynamicChoice',
            object: 'Account',
            objectIndex: '4e231f09-fd41-4fa3-8f1e-8515f6376c61',
            sortField: 'AccountSource',
            filterLogic: 'or',
            filters: [
                {
                    rowIndex: 'beff1133-9fcb-4002-a540-e0740e0f3633',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '8574a485-6312-4e06-820d-4b7a5f030f3a.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'b1d673a1-a2cd-4106-ae02-5d184d3aaa37',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2.BillingCountry',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '13071101-a221-4af9-a430-5d6a2e4c7f28',
                    leftHandSide: 'Account.Name',
                    rightHandSide: '8574a485-6312-4e06-820d-4b7a5f030f3a.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Contains'
                }
            ],
            outputAssignments: [
                {
                    rowIndex: '523f076c-5b60-402f-8617-d93833186fbe',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '41a189ff-01f4-4018-b75c-3f363b65cc42'
                }
            ]
        }
    },
    connectors: [],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
        'a4451815-988d-4f17-883d-64b6ad9fab7e',
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
        '4968239c-5e3d-45ee-9339-f575c917e223',
        '7f4ddba5-e41b-456b-b686-94b257cc9914',
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
        '53329036-32e6-4965-a1d2-b12cd0344f99',
        '41c6da8a-c6e0-418b-8b23-9906b4adab11',
        '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
        'a18b3d06-504c-4e47-9f44-6663c42703cf',
        '5383bf9b-8314-42bd-a51e-cbee56ec3570',
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
        '787fd564-24db-448c-ba59-ef88c8a5cbd9',
        'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
        '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
        'a6849bcb-05b6-4898-8cc1-12ff825524c5',
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
        '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
        'bb597c66-db1e-4636-85b6-31f89b320bd4',
        '956ee0bf-ff21-44f4-9917-65676160e094',
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
        '2e02687e-41a2-42eb-ba74-81c130218b86',
        '013c0515-5f96-493f-bf5b-3d261350a4e6',
        '58d4a602-1abb-46e4-8c10-54c225dd56af',
        '1fa12c04-abe3-44d7-87d2-132178cb5c70',
        'b6131670-d12f-4df5-9560-2a476767e9e4',
        '79c59df8-63ef-4817-8939-4951da8d22c9',
        '38e03c17-22d6-403f-91bf-6d9bd0caa696',
        'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
        'ac66cdf6-9167-4628-8faa-079f39e2e32b',
        '777c097c-f3b9-4845-9418-b50d40eb2550',
        '23ae0ea4-4d33-4dcc-a579-013e91fd4159',
        '8574a485-6312-4e06-820d-4b7a5f030f3a',
        '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
        '49bf649f-45c0-4d54-8533-93b51f9b557e',
        'a339198f-0294-4416-a67a-2782d735acad',
        '55c07deb-dcd5-45e2-ad9a-c80b7bc17362',
        'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
        'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
        'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b',
        'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
        'ed46d2ed-f940-4fbe-9b66-fba94ae66e70',
        '363280ef-e5f4-414b-9988-1200b330e5cb',
        '9abf51ab-a289-45b0-853c-040be0ed9eb7',
        'db83d1da-0f30-4796-8075-843918cf6c01',
        '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
        '016e92d2-b409-4a9d-89c0-50e637967cbc',
        '91280889-13e2-4de0-8390-32d05b8918e5',
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
        'd6ff3600-dcdb-404b-8a8b-8a90226a575b',
        'da79895d-9af9-45c9-b626-fe0fc43f4952',
        '217c9285-27c0-4130-b6f2-a92ee3b10177',
        '2aa5e67a-9cdb-45da-a597-a0d24c80188c'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000brKrAAI',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'mockFlow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'flowWithAllElements',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2019-09-27T09:08:08.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'flowWithAllElements',
        processType: 'Flow',
        runInMode: null,
        status: null,
        versionNumber: 1,
        apiVersion: 50,
        isAutoLayoutCanvas: false
    }
};
