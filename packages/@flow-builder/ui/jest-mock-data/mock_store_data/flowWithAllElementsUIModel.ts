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
            isPlainTextMode: false
        },
        'd66cf236-ca0a-4351-952d-b12df4abdaf8': {
            guid: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
            name: 'textTemplate2',
            description: '',
            elementType: 'TextTemplate',
            text: 'This text template is in plain text mode.',
            dataType: 'String',
            isPlainTextMode: true
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
        'fa417651-1251-4c86-8200-30dc2ed6849c': {
            guid: 'fa417651-1251-4c86-8200-30dc2ed6849c',
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
            objectIndex: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
            getFirstRecordOnly: true,
            inputReference: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            inputReferenceIndex: '5a7f1472-d64c-4b45-adde-b52b93262693',
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
            assignRecordIdToReferenceIndex: 'ee652516-7b62-402f-88a2-1ab887b55072',
            dataType: 'Boolean'
        },
        '0fa2da7a-22de-4045-ab83-711522e52bb6': {
            guid: '0fa2da7a-22de-4045-ab83-711522e52bb6',
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
            objectIndex: '27851956-e853-43e1-8349-bc22d62aa5a4',
            getFirstRecordOnly: false,
            inputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            inputReferenceIndex: '98a764f1-b847-44c2-b27c-b1d15f4857ca',
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
            assignRecordIdToReferenceIndex: '452941fc-4972-44df-b34d-a821bb32e800',
            dataType: 'Boolean'
        },
        'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71': {
            guid: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
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
            objectIndex: '474faea1-942d-4f0f-8c81-8429fc131dcf',
            getFirstRecordOnly: true,
            inputReference: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782.account',
            inputReferenceIndex: 'd59e0052-78b7-4ec0-bf89-27757c00baed',
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
            assignRecordIdToReferenceIndex: 'e2363ac3-537d-4b28-afac-ae787b18687e',
            dataType: 'Boolean'
        },
        'bf865980-57a7-4599-a65e-2e37eb0263a4': {
            guid: 'bf865980-57a7-4599-a65e-2e37eb0263a4',
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
            objectIndex: 'e7f854a4-bb08-4fe7-9528-5f6686e56286',
            getFirstRecordOnly: true,
            inputReference: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d.accounts',
            inputReferenceIndex: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c',
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
            assignRecordIdToReferenceIndex: '217c9285-27c0-4130-b6f2-a92ee3b10177',
            dataType: 'Boolean'
        },
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83': {
            guid: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
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
            objectIndex: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
            getFirstRecordOnly: true,
            inputReference: '26b1d461-e66e-41c7-bb0e-5c86b04280db.testOne.acctListField',
            inputReferenceIndex: '162ea6d1-7389-419d-b8c2-133462029981',
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
            assignRecordIdToReferenceIndex: '0e7a1251-a491-43d2-8828-b61652438009',
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
        '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b': {
            guid: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
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
            objectIndex: '2a4b3b65-06a5-4679-bac9-98dc536c68d4',
            outputReference: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '865e456d-2e1d-410f-8c62-8f686238b197',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '6f3f842a-e289-48ee-b18b-6820e87cee94'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '030e4398-87bd-4390-a8fd-a348fcd3b323'
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
            outputReferenceIndex: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
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
        'aef5864b-0e6b-4c61-9fe8-a2db15831cd6': {
            guid: 'aef5864b-0e6b-4c61-9fe8-a2db15831cd6',
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
            inputReferenceIndex: '46a0552e-a492-4f1a-8870-500c1a3feea3',
            object: '',
            objectIndex: '807ef621-63b9-43a5-abf0-4c3b81726be3',
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
        '2a67f70a-85a0-4423-b788-60a8e66dd245': {
            guid: '2a67f70a-85a0-4423-b788-60a8e66dd245',
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
            inputReferenceIndex: '42992316-8b74-4ffc-a6af-a48845db0e95',
            object: 'Account',
            objectIndex: '876ef3ea-e716-462e-af8d-aa632dbfc72e',
            filterLogic: '1 AND 2 OR 3',
            filters: [
                {
                    rowIndex: '8d846e45-cc1d-4e65-b9c5-35c5436a3252',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '79801a91-e263-46a7-9e2a-83a6e156dda0',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'aa2ec166-4d80-47f5-8492-ec14cbf5003e',
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
        'c5af56a6-a978-408f-966c-3db2f473cbe9': {
            guid: 'c5af56a6-a978-408f-966c-3db2f473cbe9',
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
            inputReferenceIndex: '90eda190-3bb2-4db1-92c4-d0c1b52d26b1',
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
                    rowIndex: '4b1e528d-7a33-40c3-862d-1eb9dda0633f',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'and',
            object: '',
            objectIndex: '56f09f71-a9c4-4235-83a9-803f922b80e5',
            dataType: 'Boolean'
        },
        'e3034ac1-888c-4595-bd9b-6903c99aa590': {
            guid: 'e3034ac1-888c-4595-bd9b-6903c99aa590',
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
            inputReferenceIndex: '3b8a948e-5bf7-4e8b-b340-3f79c7986cf6',
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
                    rowIndex: '3b362fa9-ea82-47fe-85f4-25406e719a72',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'salesforce',
                    rightHandSideDataType: 'String'
                }
            ],
            useSobject: false,
            filters: [
                {
                    rowIndex: 'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '494033a5-d654-4f68-9c22-7712eaa87073',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'c85e0459-8b6f-4540-99e7-d388a35ee4ba',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'Salesforce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: '1 AND 2 OR 3',
            object: 'Account',
            objectIndex: 'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
            dataType: 'Boolean'
        },
        'f876df5e-ccc8-43a5-921f-4730c6c8052b': {
            guid: 'f876df5e-ccc8-43a5-921f-4730c6c8052b',
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
            assignNextValueToReferenceIndex: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
            collectionReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            collectionReferenceIndex: 'f9efafa3-d83f-41a6-92e8-487eadb228c0',
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
        'c3ba5281-2d20-4596-99d0-94b9368c1d70': {
            guid: 'c3ba5281-2d20-4596-99d0-94b9368c1d70',
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
            assignNextValueToReferenceIndex: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
            collectionReference: '5e2803c7-a184-465c-92e3-1d29634f2114',
            collectionReferenceIndex: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
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
        'ac2ad112-16a7-4f97-bb41-7d5a0a41679f': {
            guid: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
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
            assignNextValueToReferenceIndex: '4899e1df-446e-4158-a942-9b376323c325',
            collectionReference: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            collectionReferenceIndex: 'fd06f9e3-6e63-4d89-b441-ca4c0594deb5',
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
        '42935e07-8378-4994-9dfe-34d987e80fac': {
            guid: '42935e07-8378-4994-9dfe-34d987e80fac',
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
            assignNextValueToReferenceIndex: '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
            collectionReference: '5e2803c7-a184-465c-92e3-1d29634f2114',
            collectionReferenceIndex: '4ca8549b-0128-4a7d-91a6-e86a9a6b18ec',
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
        '29e3dc08-e7d7-4435-9b47-cf2a6ce41cb3': {
            guid: '29e3dc08-e7d7-4435-9b47-cf2a6ce41cb3',
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
                    childReference: '5a93e09a-856a-4540-a62f-239f61d7de50'
                },
                {
                    childReference: 'fde9b89d-7177-4303-889d-5293eaeb58aa'
                },
                {
                    childReference: '30a1ebac-fff2-4a83-b844-7f0a8faf33b9'
                },
                {
                    childReference: '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74'
                },
                {
                    childReference: '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '5a93e09a-856a-4540-a62f-239f61d7de50': {
            guid: '5a93e09a-856a-4540-a62f-239f61d7de50',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'e46d1655-6558-4c7b-b828-b040906115b0',
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
                    rowIndex: '3980ef9a-c9c0-4635-a6af-13682830ba4b',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '2c2b6727-f892-4a27-802c-8414e7f162de',
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
        'fde9b89d-7177-4303-889d-5293eaeb58aa': {
            guid: 'fde9b89d-7177-4303-889d-5293eaeb58aa',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '1219bee3-aea6-4567-b155-e5ddb4a543bd',
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
                    rowIndex: '130d845a-9aeb-42e7-acbc-cdea13693b85',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
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
        '30a1ebac-fff2-4a83-b844-7f0a8faf33b9': {
            guid: '30a1ebac-fff2-4a83-b844-7f0a8faf33b9',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '611f9934-04ec-47a9-8a9f-ade6f3b66435',
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
        '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74': {
            guid: '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'ea5338a4-7109-4d3a-819a-d5e994a18d60',
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
        '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37': {
            guid: '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '4a3a792e-8129-48dd-bfa5-07916dc37180',
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
        '69591af2-800b-499b-af80-25f60583d5f2': {
            guid: '69591af2-800b-499b-af80-25f60583d5f2',
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
                    childReference: 'af2f244a-5bc6-4c40-b630-3d597ba1cbdc'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'af2f244a-5bc6-4c40-b630-3d597ba1cbdc': {
            guid: 'af2f244a-5bc6-4c40-b630-3d597ba1cbdc',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '56c614fb-7f1e-4bb7-9939-ccbaa690b419',
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
        'de99983e-4f45-4dbd-b0e1-c38008ec2c44': {
            guid: 'de99983e-4f45-4dbd-b0e1-c38008ec2c44',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '596820f5-a4db-43e2-bd41-6880327aca98': {
            guid: '596820f5-a4db-43e2-bd41-6880327aca98',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '9b2a7f10-e00e-4965-9d61-c67108ad5c57',
            isShowInputSelected: false,
            isValidateSelected: false
        },
        'a6604def-64ac-4b18-bd52-cb642444eb2d': {
            guid: 'a6604def-64ac-4b18-bd52-cb642444eb2d',
            name: 'recordChoiceSet',
            description: '',
            limit: '5',
            displayField: 'Name',
            valueField: 'Name',
            dataType: 'String',
            sortOrder: 'Asc',
            elementType: 'DynamicChoice',
            object: 'Account',
            objectIndex: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72',
            sortField: 'AccountSource',
            filterLogic: 'or',
            filters: [
                {
                    rowIndex: '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '8574a485-6312-4e06-820d-4b7a5f030f3a.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '960c344c-31bb-41b5-ad56-63ba96f239d8',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2.BillingCountry',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '664aa30f-60f2-4b8a-96f0-ad8795bcba07',
                    leftHandSide: 'Account.Name',
                    rightHandSide: '8574a485-6312-4e06-820d-4b7a5f030f3a.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Contains'
                }
            ],
            outputAssignments: [
                {
                    rowIndex: 'da79895d-9af9-45c9-b626-fe0fc43f4952',
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
        'fa417651-1251-4c86-8200-30dc2ed6849c',
        '0fa2da7a-22de-4045-ab83-711522e52bb6',
        'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
        'bf865980-57a7-4599-a65e-2e37eb0263a4',
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
        'ac66cdf6-9167-4628-8faa-079f39e2e32b',
        '777c097c-f3b9-4845-9418-b50d40eb2550',
        '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
        '8574a485-6312-4e06-820d-4b7a5f030f3a',
        '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
        '49bf649f-45c0-4d54-8533-93b51f9b557e',
        'aef5864b-0e6b-4c61-9fe8-a2db15831cd6',
        '2a67f70a-85a0-4423-b788-60a8e66dd245',
        'c5af56a6-a978-408f-966c-3db2f473cbe9',
        'e3034ac1-888c-4595-bd9b-6903c99aa590',
        'f876df5e-ccc8-43a5-921f-4730c6c8052b',
        'c3ba5281-2d20-4596-99d0-94b9368c1d70',
        'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
        '42935e07-8378-4994-9dfe-34d987e80fac',
        '29e3dc08-e7d7-4435-9b47-cf2a6ce41cb3',
        '69591af2-800b-499b-af80-25f60583d5f2'
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
        isAutoLayoutCanvas: false
    }
};
