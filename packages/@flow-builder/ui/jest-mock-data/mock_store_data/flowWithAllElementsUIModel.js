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
                canSelect: true
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'None',
            filterType: 'all',
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
            ]
        },
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3': {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            name: 'actionCall1',
            description: '',
            label: 'actionCall1',
            locationX: 296,
            locationY: 652,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 123,
            locationY: 649,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 463,
            locationY: 661,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 628,
            locationY: 670.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            actionType: 'quickAction',
            actionName: 'Case.LogACall',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
                    name: 'contextId',
                    value: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
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
            locationX: 367,
            locationY: 34,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 550,
            locationY: 47,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 202,
            locationY: 39,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            actionType: 'emailAlert',
            actionName: 'Account.my_email_alert',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
                    name: 'SObjectRowId',
                    value: '90da6513-4272-44d6-9f80-4cfc29acc5a3.Id',
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
            locationX: 538,
            locationY: 186,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 329,
            locationY: 183,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
            outputParameters: [
                {
                    rowIndex: '2f00ca0d-743f-4639-a084-272bbc548f8b',
                    name: 'generatedAccount',
                    value: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
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
            locationX: 663,
            locationY: 182.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 722,
            locationY: 57.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 921,
            locationY: 49.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 902,
            locationY: 209.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 1106,
            locationY: 72.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 1031,
            locationY: 218.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 924,
            locationY: 367.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 1044,
            locationY: 367.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
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
            locationX: 165,
            locationY: 177,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignmentItems: [
                {
                    rowIndex: '85d76151-9bec-4869-b691-791baf964b4f',
                    leftHandSide: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
                    rightHandSide: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'bb597c66-db1e-4636-85b6-31f89b320bd4': {
            guid: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
            name: 'decision1',
            description: '',
            label: 'decision1',
            locationX: 109,
            locationY: 801,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '700b8f1c-98eb-48ea-90f0-35e1a864a1a8': {
            guid: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
                    leftHandSide: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 846,
            locationY: 472.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '69030d84-1e7f-49c3-ad89-ddc4db69050a'
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
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
                    leftHandSide: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
                    rightHandSide: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ]
        },
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2': {
            guid: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!90da6513-4272-44d6-9f80-4cfc29acc5a3.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 2,
            elementType: 'Formula'
        },
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478'
        },
        '90da6513-4272-44d6-9f80-4cfc29acc5a3': {
            guid: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
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
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '40c11213-36c0-451e-a5aa-8790aee02559',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0'
        },
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
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
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
        },
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07': {
            guid: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
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
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87'
        },
        '6afc7b95-a112-4bd0-99e6-4114704080f2': {
            guid: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
        },
        '3147a31d-26a3-408c-b00b-a31983df0da5': {
            guid: '3147a31d-26a3-408c-b00b-a31983df0da5',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: 'eb19f518-e185-488c-a5b2-9107036766f4',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
        },
        '34eaa6ff-765e-4c12-8635-b00f6c7f2c34': {
            guid: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
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
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '56095468-2459-481d-b084-04a05babcb22'
        },
        '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9': {
            guid: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796'
        },
        '88a32528-0dfa-4237-b9dd-a14c1a6d6d10': {
            guid: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
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
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: '54aae715-8881-4a52-b7a9-25c385d1488e',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b'
        },
        'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9': {
            guid: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922'
        },
        '9d11ba05-33c4-4893-87b8-9560be9557d2': {
            guid: '9d11ba05-33c4-4893-87b8-9560be9557d2',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49'
        },
        '5e2803c7-a184-465c-92e3-1d29634f2114': {
            guid: '5e2803c7-a184-465c-92e3-1d29634f2114',
            name: 'stringCollectionVariable2',
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
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4'
        },
        '756e3b06-1ee6-4f8e-82b2-ce141c9405db': {
            guid: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab'
        },
        'c518ac20-1202-42a6-ac3d-cfc8b707f4c3': {
            guid: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '1283ede6-414b-45a2-851a-1b113f26bffd',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc'
        },
        'd7b1d0e5-68d7-4734-b1d1-01247631d93f': {
            guid: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32'
        },
        '97e556fe-63c0-4426-9421-b3dc0d5a74aa': {
            guid: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '8e3cf25f-1ce2-48c8-9634-b192b94ae230',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6'
        },
        'e502e40a-7dfc-4e71-8a42-c491f86a560a': {
            guid: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: '3d47c47d-df60-4f92-85c8-71982afd9938',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78'
        },
        'b2eef3a8-57d5-42b7-ad31-c9923cd8a782': {
            guid: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '0883ba56-46a4-4420-8105-c9d17ad0183b'
        },
        'f79b5397-57f9-426b-aa00-5ef1b8b8f75d': {
            guid: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '42afe63b-0744-4dec-a7e6-20c67691dd81'
        },
        '02504510-b361-4fb3-878e-81925a76160f': {
            guid: '02504510-b361-4fb3-878e-81925a76160f',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!2d1ada73-88e9-4cf4-a814-dcba8d517104}</p>',
            dataType: 'String'
        },
        '26b1d461-e66e-41c7-bb0e-5c86b04280db': {
            guid: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
            name: 'subflowAutomaticOutput',
            description: '',
            label: 'subflowAutomaticOutput',
            locationX: 966,
            locationY: 507.1062469482422,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            flowName: 'flowWithActiveAndLatest',
            inputAssignments: [
                {
                    rowIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
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
        '41a189ff-01f4-4018-b75c-3f363b65cc42': {
            guid: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            name: 'createAccountWithAutomaticOutput',
            description: '',
            label: 'createAccountWithAutomaticOutput',
            locationX: 302,
            locationY: 512.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            inputAssignments: [
                {
                    rowIndex: '38f77648-3c7e-4431-8403-239492238623',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '796969f1-a892-4b16-836e-209180057a2b',
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
            assignRecordIdToReferenceIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        'd66cf236-ca0a-4351-952d-b12df4abdaf8': {
            guid: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
            name: 'createAccountWithAdvancedOptions',
            description: '',
            label: 'createAccountWithAdvancedOptions',
            locationX: 430,
            locationY: 483,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
            inputAssignments: [
                {
                    rowIndex: '013c0515-5f96-493f-bf5b-3d261350a4e6',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '2e02687e-41a2-42eb-ba74-81c130218b86',
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
            assignRecordIdToReference: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            assignRecordIdToReferenceIndex: '52bc2460-8775-417b-a692-f72725a8f6b0',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'cf176378-9ab0-436f-a161-079057c789f4': {
            guid: 'cf176378-9ab0-436f-a161-079057c789f4',
            name: 'createFromAnAccount',
            description: '',
            label: 'createFromAnAccount',
            locationX: 196,
            locationY: 486.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: '',
            objectIndex: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
            getFirstRecordOnly: true,
            inputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            inputReferenceIndex: '27cfbe21-2aa1-4503-aa13-3677c687153d',
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
            assignRecordIdToReferenceIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1',
            dataType: 'Boolean'
        },
        '58d4a602-1abb-46e4-8c10-54c225dd56af': {
            guid: '58d4a602-1abb-46e4-8c10-54c225dd56af',
            name: 'createFromMultipleAccounts',
            description: '',
            label: 'createFromMultipleAccounts',
            locationX: 566,
            locationY: 486,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: '',
            objectIndex: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635',
            getFirstRecordOnly: true,
            inputReference: 'a8368340-a386-4406-9118-02389237ad54',
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
            assignRecordIdToReferenceIndex: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            dataType: 'Boolean'
        },
        '9189cb3c-2245-4cfb-aabe-c2e979f15c6d': {
            guid: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
            name: 'withApexDefSingleSObjectVariable',
            description: '',
            label: 'withApexDefSingleSObjectVariable',
            locationX: 1007,
            locationY: 668.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: '',
            objectIndex: 'f317c423-f755-4d64-bd4a-e218107b57db',
            getFirstRecordOnly: true,
            inputReference: 'e502e40a-7dfc-4e71-8a42-c491f86a560a.account',
            inputReferenceIndex: '048203c3-6751-4189-b9ab-939f0ef6d7d3',
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
            assignRecordIdToReferenceIndex: '794b3296-5246-473a-b618-584b8956809c',
            dataType: 'Boolean'
        },
        '1669c1f5-9872-461f-a826-b4fa64d902dd': {
            guid: '1669c1f5-9872-461f-a826-b4fa64d902dd',
            name: 'withApexDefSObjectCollectionVariable',
            description: '',
            label: 'withApexDefSObjectCollectionVariable',
            locationX: 1159,
            locationY: 665,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: '',
            objectIndex: 'f94a6136-8394-445d-a2f1-1ef06f109cb5',
            getFirstRecordOnly: true,
            inputReference: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782.accounts',
            inputReferenceIndex: '9c51615d-c61a-46f7-b26a-7157f6908b21',
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
            assignRecordIdToReferenceIndex: '1a279fff-8bfc-4714-bc0f-2d7a203c6b16',
            dataType: 'Boolean'
        },
        '4197d875-e006-4afc-844f-753d75b8c4d1': {
            guid: '4197d875-e006-4afc-844f-753d75b8c4d1',
            name: 'lookupRecordAutomaticOutput',
            description: '',
            label: 'lookupRecordAutomaticOutput',
            locationX: 362,
            locationY: 326,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: '0c77e4b9-7c32-4ce0-862d-ab58bb5b7553',
            filterType: 'none',
            filters: [
                {
                    rowIndex: '20719b7b-1961-4eda-a3f3-b42d939e604a',
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
            outputReferenceIndex: '8f88fc57-1b46-4e64-8821-bd1e1bcc6de6',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7': {
            guid: '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7',
            name: 'lookupRecordCollectionAutomaticOutput',
            description: '',
            label: 'lookupRecordCollectionAutomaticOutput',
            locationX: 577,
            locationY: 334,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: 'fff17adf-4565-4360-91b9-64f7fd54a9d7',
            filterType: 'none',
            filters: [
                {
                    rowIndex: 'ed78dc90-dad8-4f67-b39a-59d06fa41665',
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
            outputReferenceIndex: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '1875750b-574e-40d4-adff-7aa4f06fc0fe': {
            guid: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
            name: 'lookupRecordOutputReference',
            description: '',
            label: 'lookupRecordOutputReference',
            locationX: 158,
            locationY: 321,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
            outputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'none',
            filters: [
                {
                    rowIndex: 'a709dfe7-af21-4c63-a373-38ee99bcbf73',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '97ff27bc-bc3f-49cd-b600-abec79e81e50'
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
            outputReferenceIndex: '5abbcb4e-faba-4750-91f2-46c9509713ea',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6': {
            guid: 'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6',
            name: 'getAccountAutoWithFields',
            description: '',
            label: 'getAccountAutoWithFields',
            locationX: 747,
            locationY: 332,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
            filterType: 'all',
            filters: [
                {
                    rowIndex: '26774e1d-4c9f-45f1-a426-89bad7c78eef',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '777c097c-f3b9-4845-9418-b50d40eb2550',
                    leftHandSide: 'Account.BillingPostalCode',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '16a960f8-b2e1-4481-aac8-cf744c4bf266'
                },
                {
                    field: 'Name',
                    rowIndex: 'f6526a3c-c24b-49e8-a910-d99a8c8342b5'
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
            outputReferenceIndex: '9fa9376a-5212-49a1-980b-ddca1dd82388',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14': {
            guid: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
            name: 'deleteAccount',
            description: '',
            label: 'deleteAccount',
            locationX: 751,
            locationY: 469.359375,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            inputReference: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            inputReferenceIndex: 'e7dfb0f5-be90-4dcd-9841-da7bd989dee5',
            object: '',
            objectIndex: '1b13e911-67d9-409a-abee-fc6663dd4108',
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
        'b689132a-b516-47d0-9e51-03ea751c7cc9': {
            guid: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
            name: 'screen1',
            description: '',
            label: 'screen1',
            locationX: 104,
            locationY: 485,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            fieldReferences: [
                {
                    fieldReference: '2ca03260-0885-4ffb-bb88-cf862f5d2cb4'
                },
                {
                    fieldReference: '5a8a33e6-d476-45dc-b263-b3bae11ee715'
                },
                {
                    fieldReference: '8d06ba06-b0e4-4a15-ab56-651dc35a83a8'
                },
                {
                    fieldReference: '0a3d0031-d1de-4f69-9a41-c302eecc0ea5'
                },
                {
                    fieldReference: '3606994f-008f-4e3a-a353-cc4f7fa75086'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '2ca03260-0885-4ffb-bb88-cf862f5d2cb4': {
            guid: '2ca03260-0885-4ffb-bb88-cf862f5d2cb4',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '5041d41a-0822-4ddc-9685-8a09b840bb0d',
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
                    rowIndex: 'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'c7027d6d-66ae-440f-b340-0c652eaebe79',
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
            fieldReferences: []
        },
        '5a8a33e6-d476-45dc-b263-b3bae11ee715': {
            guid: '5a8a33e6-d476-45dc-b263-b3bae11ee715',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '0d02ed31-ffad-42ba-967f-5ebbbdb83dd5',
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
                    rowIndex: '553332e6-c579-49e7-8757-8044dd8b530f',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '9f2723ee-84ae-473a-b265-ebee9afa6697',
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
            fieldReferences: []
        },
        '8d06ba06-b0e4-4a15-ab56-651dc35a83a8': {
            guid: '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'd6542367-8e40-4576-95aa-3baa12d98ac7',
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
            fieldReferences: []
        },
        '0a3d0031-d1de-4f69-9a41-c302eecc0ea5': {
            guid: '0a3d0031-d1de-4f69-9a41-c302eecc0ea5',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '76a209b0-66ab-4a14-ad73-56b02b937714',
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
            fieldReferences: []
        },
        '3606994f-008f-4e3a-a353-cc4f7fa75086': {
            guid: '3606994f-008f-4e3a-a353-cc4f7fa75086',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '3ce2bd36-67b8-4bc3-b144-1ba05ee7dafe',
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
            fieldReferences: []
        },
        '123b2338-5cb1-4a98-966f-58a56114c1f6': {
            guid: '123b2338-5cb1-4a98-966f-58a56114c1f6',
            name: 'screenWithAddress',
            description: '',
            label: 'screenWithAddress',
            locationX: 669,
            locationY: 483.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            allowBack: true,
            allowFinish: true,
            allowPause: true,
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            fieldReferences: [
                {
                    fieldReference: '49bf649f-45c0-4d54-8533-93b51f9b557e'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '49bf649f-45c0-4d54-8533-93b51f9b557e': {
            guid: '49bf649f-45c0-4d54-8533-93b51f9b557e',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'd51b4de8-82af-4bac-a2ec-3780738278d4',
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
            fieldReferences: []
        },
        '37cfa784-b1db-4323-8baa-51d1da0c010f': {
            guid: '37cfa784-b1db-4323-8baa-51d1da0c010f',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        'e89486d4-cd00-4c09-b4f4-539075ae4924': {
            guid: 'e89486d4-cd00-4c09-b4f4-539075ae4924',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '5889818c-cb99-4524-a6fb-79c576f21d26',
            isShowInputSelected: false,
            isValidateSelected: false
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
        '26b1d461-e66e-41c7-bb0e-5c86b04280db',
        '41a189ff-01f4-4018-b75c-3f363b65cc42',
        'd66cf236-ca0a-4351-952d-b12df4abdaf8',
        'cf176378-9ab0-436f-a161-079057c789f4',
        '58d4a602-1abb-46e4-8c10-54c225dd56af',
        '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
        '1669c1f5-9872-461f-a826-b4fa64d902dd',
        '4197d875-e006-4afc-844f-753d75b8c4d1',
        '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7',
        '1875750b-574e-40d4-adff-7aa4f06fc0fe',
        'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6',
        '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
        'b689132a-b516-47d0-9e51-03ea751c7cc9',
        '123b2338-5cb1-4a98-966f-58a56114c1f6'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
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
        status: 'InvalidDraft',
        versionNumber: 1
    }
};
