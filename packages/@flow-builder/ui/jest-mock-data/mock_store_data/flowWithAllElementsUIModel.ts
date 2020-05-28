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
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: []
        },
        '703162a5-d48f-40b6-b52e-ec4e1944ba34': {
            guid: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
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
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3': {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
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
                isSelectable: true
            },
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'fc408daa-3152-46bf-8733-c1083018292b',
                    name: 'subjectNameOrId',
                    value: 'jsmith@salesforce.com',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '90246d76-2818-4059-b0fd-425e241f8708',
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
        'e682f03e-925a-4d84-adc3-f1c5ceea0201': {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
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
                isSelectable: true
            },
            actionType: 'component',
            actionName: 'c:localActionSample',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
                    name: 'subject',
                    value: 'team',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
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
        'cc0381a7-0c64-4935-bc0c-25ecc2e958f1': {
            guid: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
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
                isSelectable: true
            },
            actionType: 'quickAction',
            actionName: 'Case.LogACall',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
                    name: 'contextId',
                    value: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
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
        '0ecd3000-0adc-4d34-bdc1-acd331740de0': {
            guid: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
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
        '7f4ddba5-e41b-456b-b686-94b257cc9914': {
            guid: '7f4ddba5-e41b-456b-b686-94b257cc9914',
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
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be': {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
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
                isSelectable: true
            },
            actionType: 'emailAlert',
            actionName: 'Account.my_email_alert',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '04e1c283-fc0b-4928-a495-89d956368769',
                    name: 'SObjectRowId',
                    value: '5c075fad-735a-4628-9e51-495d3292d153.Id',
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
        'a193d56e-2ee7-422d-a3ff-664fc82a0fd8': {
            guid: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
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
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'InvocableGetAccountName',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
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
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1': {
            guid: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
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
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
            outputParameters: [
                {
                    rowIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
                    name: 'generatedAccount',
                    value: '5c075fad-735a-4628-9e51-495d3292d153',
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
        '2f00ca0d-743f-4639-a084-272bbc548f8b': {
            guid: '2f00ca0d-743f-4639-a084-272bbc548f8b',
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
        'a18b3d06-504c-4e47-9f44-6663c42703cf': {
            guid: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
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
        '5383bf9b-8314-42bd-a51e-cbee56ec3570': {
            guid: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
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
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8': {
            guid: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
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
        '787fd564-24db-448c-ba59-ef88c8a5cbd9': {
            guid: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
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
                isSelectable: true
            },
            actionType: 'apex',
            actionName: 'GetCarAction',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
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
        'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c': {
            guid: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
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
        '86f9f34d-e2e4-45e3-a574-78ddcd669ebf': {
            guid: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
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
        'a6849bcb-05b6-4898-8cc1-12ff825524c5': {
            guid: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
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
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
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
                isSelectable: true
            },
            assignmentItems: [
                {
                    rowIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
                    leftHandSide: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
                    rightHandSide: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '85d76151-9bec-4869-b691-791baf964b4f': {
            guid: '85d76151-9bec-4869-b691-791baf964b4f',
            name: 'assign_W_7251820',
            description: '',
            label: 'assign-W-7251820',
            locationX: 1275,
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
                    rowIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
                    leftHandSide: '1875750b-574e-40d4-adff-7aa4f06fc0fe.AccountNumber',
                    rightHandSide: '5c075fad-735a-4628-9e51-495d3292d153.AccountNumber',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
                    leftHandSide: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
                    rightHandSide: '5c075fad-735a-4628-9e51-495d3292d153',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'e653d56e-898d-4e69-87c3-07338d100647': {
            guid: 'e653d56e-898d-4e69-87c3-07338d100647',
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
                isSelectable: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '956ee0bf-ff21-44f4-9917-65676160e094'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '956ee0bf-ff21-44f4-9917-65676160e094'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
                    leftHandSide: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        'dd4270aa-df83-4942-ac0f-37ce8072ccaa': {
            guid: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
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
                isSelectable: true
            },
            outcomeReferences: [
                {
                    outcomeReference: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2': {
            guid: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'a8368340-a386-4406-9118-02389237ad54',
                    leftHandSide: '5c075fad-735a-4628-9e51-495d3292d153',
                    rightHandSide: '5c075fad-735a-4628-9e51-495d3292d153',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ]
        },
        '2bf626b1-9430-49ca-ad02-a75241931b16': {
            guid: '2bf626b1-9430-49ca-ad02-a75241931b16',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!5c075fad-735a-4628-9e51-495d3292d153.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 2,
            elementType: 'Formula'
        },
        '6e77e9cf-2492-44ca-a088-ee4b8159d478': {
            guid: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f'
        },
        '5c075fad-735a-4628-9e51-495d3292d153': {
            guid: '5c075fad-735a-4628-9e51-495d3292d153',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '40c11213-36c0-451e-a5aa-8790aee02559'
        },
        'e62ce284-ccf2-46af-8446-c0a110a4bba0': {
            guid: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c'
        },
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6': {
            guid: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b'
        },
        'be979456-fe7c-4fa6-be9f-e388ea78dd33': {
            guid: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
        },
        '8573e2d4-ccfb-4701-be66-e38b54ba7375': {
            guid: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b'
        },
        'cf5e6188-117a-47c0-a493-7ed460484c87': {
            guid: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929'
        },
        'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40': {
            guid: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: '3147a31d-26a3-408c-b00b-a31983df0da5',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'eb19f518-e185-488c-a5b2-9107036766f4'
        },
        '70926b3b-6a78-4e62-a62b-0c6d4c4ca910': {
            guid: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ba8a8e41-3944-4099-9655-065f054e811f'
        },
        '4afdbe2b-6b5a-4da3-887d-5b755f53b64e': {
            guid: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511'
        },
        '56095468-2459-481d-b084-04a05babcb22': {
            guid: '56095468-2459-481d-b084-04a05babcb22',
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9'
        },
        'f35bd1d9-bafd-4fc9-b682-2d2557f8f796': {
            guid: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e5b4998c-a36e-407f-afb7-2301eda53b8d'
        },
        '7bbacaec-c6f9-4188-9af4-a32993e0abbd': {
            guid: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '54aae715-8881-4a52-b7a9-25c385d1488e'
        },
        '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b': {
            guid: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8d53a0e4-6541-42d0-9ea1-665b504fd150'
        },
        'f35b9254-9177-4813-84c0-92bc3dd1e922': {
            guid: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: '9d11ba05-33c4-4893-87b8-9560be9557d2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2'
        },
        '458ac1c7-23e7-49cc-a518-5eaf4f218a49': {
            guid: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '5e2803c7-a184-465c-92e3-1d29634f2114',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8'
        },
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd': {
            guid: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            name: 'stringCollectionVariable2',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963'
        },
        'f08f384a-8e8f-40d3-8009-f8e1fb16eac4': {
            guid: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7'
        },
        'fcf61595-af2e-4982-9607-5de1c2819fab': {
            guid: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1283ede6-414b-45a2-851a-1b113f26bffd'
        },
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc': {
            guid: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '37c4575e-32f8-46d9-aeea-737953c256b2'
        },
        '476ffd9b-6322-4bfa-969e-0d63bce36f32': {
            guid: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8e3cf25f-1ce2-48c8-9634-b192b94ae230'
        },
        'e9417fd7-2e24-495f-a4af-6ca687957ef6': {
            guid: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3d47c47d-df60-4f92-85c8-71982afd9938'
        },
        'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78': {
            guid: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1f6554e7-ca93-491c-979c-1e2b8fcc563f'
        },
        '0883ba56-46a4-4420-8105-c9d17ad0183b': {
            guid: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '42afe63b-0744-4dec-a7e6-20c67691dd81'
        },
        '02504510-b361-4fb3-878e-81925a76160f': {
            guid: '02504510-b361-4fb3-878e-81925a76160f',
            name: 'apexComplexTypeTwoVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestTwo216',
            subtypeIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e'
        },
        '4d5723fe-7d36-4044-8f59-1f6da02eacbe': {
            guid: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
            name: 'vAccountId',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '796969f1-a892-4b16-836e-209180057a2b'
        },
        'b3a76739-4414-41d2-984e-e44bca6402c6': {
            guid: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39'
        },
        '38f77648-3c7e-4431-8403-239492238623': {
            guid: '38f77648-3c7e-4431-8403-239492238623',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!f08f384a-8e8f-40d3-8009-f8e1fb16eac4}</p>',
            dataType: 'String'
        },
        '65909adb-0efe-4743-b4a7-ca6e93d71c92': {
            guid: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
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
                isSelectable: true
            },
            flowName: 'flowWithActiveAndLatest',
            inputAssignments: [
                {
                    rowIndex: '2e02687e-41a2-42eb-ba74-81c130218b86',
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
        'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56': {
            guid: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
            name: 'createAccountWithAutomaticOutput',
            description: '',
            label: 'createAccountWithAutomaticOutput',
            locationX: 1146,
            locationY: 530,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            inputAssignments: [
                {
                    rowIndex: 'cf176378-9ab0-436f-a161-079057c789f4',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '27cfbe21-2aa1-4503-aa13-3677c687153d',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '52bc2460-8775-417b-a692-f72725a8f6b0',
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
            assignRecordIdToReferenceIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        '583e40d5-e735-4d8c-8f30-097d48de7ec8': {
            guid: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
            name: 'createAccountWithAdvancedOptions',
            description: '',
            label: 'createAccountWithAdvancedOptions',
            locationX: 855,
            locationY: 669,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '58d4a602-1abb-46e4-8c10-54c225dd56af',
            inputAssignments: [
                {
                    rowIndex: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1',
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
            assignRecordIdToReference: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
            assignRecordIdToReferenceIndex: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'a6604def-64ac-4b18-bd52-cb642444eb2d': {
            guid: 'a6604def-64ac-4b18-bd52-cb642444eb2d',
            name: 'createFromAnAccount',
            description: '',
            label: 'createFromAnAccount',
            locationX: 1297,
            locationY: 533,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: 'da79895d-9af9-45c9-b626-fe0fc43f4952',
            getFirstRecordOnly: true,
            inputReference: '5c075fad-735a-4628-9e51-495d3292d153',
            inputReferenceIndex: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72',
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
            assignRecordIdToReferenceIndex: '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6',
            dataType: 'Boolean'
        },
        '960c344c-31bb-41b5-ad56-63ba96f239d8': {
            guid: '960c344c-31bb-41b5-ad56-63ba96f239d8',
            name: 'createFromMultipleAccounts',
            description: '',
            label: 'createFromMultipleAccounts',
            locationX: 1304,
            locationY: 662,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: '',
            objectIndex: 'fa417651-1251-4c86-8200-30dc2ed6849c',
            getFirstRecordOnly: false,
            inputReference: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            inputReferenceIndex: '664aa30f-60f2-4b8a-96f0-ad8795bcba07',
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
            assignRecordIdToReferenceIndex: '5a7f1472-d64c-4b45-adde-b52b93262693',
            dataType: 'Boolean'
        },
        '7e331ab0-6782-4244-93b3-5bbcdad069e4': {
            guid: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
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
                isSelectable: true
            },
            object: '',
            objectIndex: '0fa2da7a-22de-4045-ab83-711522e52bb6',
            getFirstRecordOnly: true,
            inputReference: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78.account',
            inputReferenceIndex: 'ee652516-7b62-402f-88a2-1ab887b55072',
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
            assignRecordIdToReferenceIndex: '98a764f1-b847-44c2-b27c-b1d15f4857ca',
            dataType: 'Boolean'
        },
        '27851956-e853-43e1-8349-bc22d62aa5a4': {
            guid: '27851956-e853-43e1-8349-bc22d62aa5a4',
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
                isSelectable: true
            },
            object: '',
            objectIndex: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
            getFirstRecordOnly: true,
            inputReference: '0883ba56-46a4-4420-8105-c9d17ad0183b.accounts',
            inputReferenceIndex: '452941fc-4972-44df-b34d-a821bb32e800',
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
            assignRecordIdToReferenceIndex: 'd59e0052-78b7-4ec0-bf89-27757c00baed',
            dataType: 'Boolean'
        },
        '1875750b-574e-40d4-adff-7aa4f06fc0fe': {
            guid: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
            name: 'lookupRecordAutomaticOutput',
            description: '',
            label: 'lookupRecordAutomaticOutput',
            locationX: 263,
            locationY: 984,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'a709dfe7-af21-4c63-a373-38ee99bcbf73',
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
            outputReferenceIndex: '5abbcb4e-faba-4750-91f2-46c9509713ea',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '97ff27bc-bc3f-49cd-b600-abec79e81e50': {
            guid: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
            name: 'lookupRecordCollectionAutomaticOutput',
            description: '',
            label: 'lookupRecordCollectionAutomaticOutput',
            locationX: 412,
            locationY: 987,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '9fa9376a-5212-49a1-980b-ddca1dd82388',
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
            outputReferenceIndex: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '474faea1-942d-4f0f-8c81-8429fc131dcf': {
            guid: '474faea1-942d-4f0f-8c81-8429fc131dcf',
            name: 'lookupRecordOutputReference',
            description: '',
            label: 'lookupRecordOutputReference',
            locationX: 109,
            locationY: 983,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'e2363ac3-537d-4b28-afac-ae787b18687e',
            outputReference: '5c075fad-735a-4628-9e51-495d3292d153',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'e7f854a4-bb08-4fe7-9528-5f6686e56286',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '217c9285-27c0-4130-b6f2-a92ee3b10177'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '338c0e28-a7d7-44c0-907a-0fd6aef99d83'
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
            outputReferenceIndex: 'bf865980-57a7-4599-a65e-2e37eb0263a4',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '1b13e911-67d9-409a-abee-fc6663dd4108': {
            guid: '1b13e911-67d9-409a-abee-fc6663dd4108',
            name: 'getAccountAutoWithFields',
            description: '',
            label: 'getAccountAutoWithFields',
            locationX: 558,
            locationY: 987,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'de8efb2a-4b75-4a44-a3c9-3a78018a2207',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c',
                    leftHandSide: 'Account.BillingPostalCode',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '8574a485-6312-4e06-820d-4b7a5f030f3a'
                },
                {
                    field: 'Name',
                    rowIndex: 'c7027d6d-66ae-440f-b340-0c652eaebe79'
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
            outputReferenceIndex: '2ca03260-0885-4ffb-bb88-cf862f5d2cb4',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '5a8a33e6-d476-45dc-b263-b3bae11ee715': {
            guid: '5a8a33e6-d476-45dc-b263-b3bae11ee715',
            name: 'getAccountSeparateFieldsWithFilters',
            description: 'Get account with filters, ordered by name and assign separate fields',
            label: 'getAccountSeparateFieldsWithFilters',
            locationX: 103,
            locationY: 1125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '0d02ed31-ffad-42ba-967f-5ebbbdb83dd5',
            outputAssignments: [
                {
                    rowIndex: '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Los Angeles'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'cb13b620-ebec-4c72-aff0-beebd24ef0c2',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '9f2723ee-84ae-473a-b265-ebee9afa6697',
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
            outputReferenceIndex: 'd65a9682-db73-4ea7-8a38-9e2d8ee50d43',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'd6542367-8e40-4576-95aa-3baa12d98ac7': {
            guid: 'd6542367-8e40-4576-95aa-3baa12d98ac7',
            name: 'getAccountsAutomaticWithFieldsAndFilters',
            description: 'Get Account Automatic output, with fields and filter',
            label: 'getAccountsAutomaticWithFieldsAndFilters',
            locationX: 256,
            locationY: 1135,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '0a3d0031-d1de-4f69-9a41-c302eecc0ea5',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '3ce2bd36-67b8-4bc3-b144-1ba05ee7dafe',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '123b2338-5cb1-4a98-966f-58a56114c1f6',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'NotEqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '49bf649f-45c0-4d54-8533-93b51f9b557e'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: 'd51b4de8-82af-4bac-a2ec-3780738278d4'
                },
                {
                    field: 'Name',
                    rowIndex: '37cfa784-b1db-4323-8baa-51d1da0c010f'
                },
                {
                    field: 'CreatedDate',
                    rowIndex: 'e89486d4-cd00-4c09-b4f4-539075ae4924'
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
            outputReferenceIndex: '76a209b0-66ab-4a14-ad73-56b02b937714',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '5889818c-cb99-4524-a6fb-79c576f21d26': {
            guid: '5889818c-cb99-4524-a6fb-79c576f21d26',
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
                isSelectable: true
            },
            inputReference: '5c075fad-735a-4628-9e51-495d3292d153',
            inputReferenceIndex: '7b9fc3ec-7a4b-4382-bd6b-b72405aece1f',
            object: '',
            objectIndex: '80b66606-d59f-4c14-a74e-c98a050c84bc',
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
        '63212bdb-c6a5-4e99-85cf-9921d6fc834b': {
            guid: '63212bdb-c6a5-4e99-85cf-9921d6fc834b',
            name: 'deleteAccountWithFilters',
            description: '',
            label: 'deleteAccountWithFilters',
            locationX: 1009,
            locationY: 832,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '',
            inputReferenceIndex: '7b238465-d71b-489c-8223-425066aaf928',
            object: 'Account',
            objectIndex: '6f408b05-42aa-4ee2-8bbc-7756dcf10eac',
            filterLogic: '1 AND 2 OR 3',
            filters: [
                {
                    rowIndex: 'aef5864b-0e6b-4c61-9fe8-a2db15831cd6',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '46a0552e-a492-4f1a-8870-500c1a3feea3',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '807ef621-63b9-43a5-abf0-4c3b81726be3',
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
        '2a67f70a-85a0-4423-b788-60a8e66dd245': {
            guid: '2a67f70a-85a0-4423-b788-60a8e66dd245',
            name: 'updateSObject',
            description: '',
            label: 'updateSObject',
            locationX: 540,
            locationY: 831,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            inputReferenceIndex: '42992316-8b74-4ffc-a6af-a48845db0e95',
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
                    rowIndex: '8d846e45-cc1d-4e65-b9c5-35c5436a3252',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'and',
            object: '',
            objectIndex: '876ef3ea-e716-462e-af8d-aa632dbfc72e',
            dataType: 'Boolean'
        },
        '79801a91-e263-46a7-9e2a-83a6e156dda0': {
            guid: '79801a91-e263-46a7-9e2a-83a6e156dda0',
            name: 'updateAccountWithFilter',
            description: '',
            label: 'updateAccountWithFilter',
            locationX: 677,
            locationY: 833,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            inputReference: '',
            inputReferenceIndex: 'aa2ec166-4d80-47f5-8492-ec14cbf5003e',
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
                    rowIndex: '90eda190-3bb2-4db1-92c4-d0c1b52d26b1',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'salesforce',
                    rightHandSideDataType: 'String'
                }
            ],
            useSobject: false,
            filters: [
                {
                    rowIndex: '4b1e528d-7a33-40c3-862d-1eb9dda0633f',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'e3034ac1-888c-4595-bd9b-6903c99aa590',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '3b8a948e-5bf7-4e8b-b340-3f79c7986cf6',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'Salesforce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: '1 AND 2 OR 3',
            object: 'Account',
            objectIndex: 'c5af56a6-a978-408f-966c-3db2f473cbe9',
            dataType: 'Boolean'
        },
        '162ea6d1-7389-419d-b8c2-133462029981': {
            guid: '162ea6d1-7389-419d-b8c2-133462029981',
            name: 'loopOnAccountAutoOutput',
            description: '',
            label: 'loopOnAccountAutoOutput',
            locationX: 250,
            locationY: 342,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
            collectionReference: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            collectionReferenceIndex: '0e7a1251-a491-43d2-8828-b61652438009',
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
        '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b': {
            guid: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
            name: 'loopOnTextCollectionAutoOutput',
            description: '',
            label: 'loopOnTextCollectionAutoOutput',
            locationX: 388,
            locationY: 336,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '2a4b3b65-06a5-4679-bac9-98dc536c68d4',
            collectionReference: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            collectionReferenceIndex: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
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
        '2bf0c2e0-c04d-43a6-84ce-49009b740a1b': {
            guid: '2bf0c2e0-c04d-43a6-84ce-49009b740a1b',
            name: 'loopOnApexAutoOutput',
            description: '',
            label: 'loopOnApexAutoOutput',
            locationX: 379,
            locationY: 503,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '865e456d-2e1d-410f-8c62-8f686238b197',
            collectionReference: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
            collectionReferenceIndex: '6f3f842a-e289-48ee-b18b-6820e87cee94',
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
        'fda10f1b-f93e-46d5-99f0-e09f9c52c147': {
            guid: 'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
            name: 'loopOnTextCollection',
            description: 'This is a test without automatic Output',
            label: 'loopOnTextCollection',
            locationX: 242,
            locationY: 501,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            assignNextValueToReferenceIndex: 'af83b78a-15c7-4381-b2a8-e254552cfeab',
            collectionReference: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            collectionReferenceIndex: 'dbfccfa4-49b4-4385-a998-4ac4e9d630aa',
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
        'c9ebe244-887a-4821-811c-f9f17a670037': {
            guid: 'c9ebe244-887a-4821-811c-f9f17a670037',
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
                isSelectable: true
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
                    fieldReference: 'ed46d2ed-f940-4fbe-9b66-fba94ae66e70'
                },
                {
                    fieldReference: '5a93e09a-856a-4540-a62f-239f61d7de50'
                },
                {
                    fieldReference: 'fde9b89d-7177-4303-889d-5293eaeb58aa'
                },
                {
                    fieldReference: '35837efc-fe6e-4096-8de3-a00443b93527'
                },
                {
                    fieldReference: 'ab66a6a8-98df-47cd-9948-1c2390f02139'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'ed46d2ed-f940-4fbe-9b66-fba94ae66e70': {
            guid: 'ed46d2ed-f940-4fbe-9b66-fba94ae66e70',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '7f3aa0ed-17d0-4a43-b89a-395d3d6e609d',
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
                    rowIndex: '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '29e3dc08-e7d7-4435-9b47-cf2a6ce41cb3',
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
        '5a93e09a-856a-4540-a62f-239f61d7de50': {
            guid: '5a93e09a-856a-4540-a62f-239f61d7de50',
            name: 'emailScreenField',
            choiceReferences: [],
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
                    value: 'emailScreenField',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '2c2b6727-f892-4a27-802c-8414e7f162de',
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
        'fde9b89d-7177-4303-889d-5293eaeb58aa': {
            guid: 'fde9b89d-7177-4303-889d-5293eaeb58aa',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '1219bee3-aea6-4567-b155-e5ddb4a543bd',
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
        '35837efc-fe6e-4096-8de3-a00443b93527': {
            guid: '35837efc-fe6e-4096-8de3-a00443b93527',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '130d845a-9aeb-42e7-acbc-cdea13693b85',
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
        'ab66a6a8-98df-47cd-9948-1c2390f02139': {
            guid: 'ab66a6a8-98df-47cd-9948-1c2390f02139',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
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
        '30a1ebac-fff2-4a83-b844-7f0a8faf33b9': {
            guid: '30a1ebac-fff2-4a83-b844-7f0a8faf33b9',
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
                isSelectable: true
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
                    fieldReference: '611f9934-04ec-47a9-8a9f-ade6f3b66435'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '611f9934-04ec-47a9-8a9f-ade6f3b66435': {
            guid: '611f9934-04ec-47a9-8a9f-ade6f3b66435',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74',
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
        'ea5338a4-7109-4d3a-819a-d5e994a18d60': {
            guid: 'ea5338a4-7109-4d3a-819a-d5e994a18d60',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37': {
            guid: '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '4a3a792e-8129-48dd-bfa5-07916dc37180',
            isShowInputSelected: false,
            isValidateSelected: false
        },
        '69591af2-800b-499b-af80-25f60583d5f2': {
            guid: '69591af2-800b-499b-af80-25f60583d5f2',
            name: 'recordChoiceSet',
            description: '',
            limit: '5',
            displayField: 'Name',
            valueField: 'Name',
            dataType: 'String',
            sortOrder: 'Asc',
            elementType: 'DynamicChoice',
            object: 'Account',
            objectIndex: 'af2f244a-5bc6-4c40-b630-3d597ba1cbdc',
            sortField: 'AccountSource',
            filterLogic: 'or',
            filters: [
                {
                    rowIndex: 'de99983e-4f45-4dbd-b0e1-c38008ec2c44',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '1b13e911-67d9-409a-abee-fc6663dd4108.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '596820f5-a4db-43e2-bd41-6880327aca98',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: '5c075fad-735a-4628-9e51-495d3292d153.BillingCountry',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '9b2a7f10-e00e-4965-9d61-c67108ad5c57',
                    leftHandSide: 'Account.Name',
                    rightHandSide: '1b13e911-67d9-409a-abee-fc6663dd4108.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Contains'
                }
            ],
            outputAssignments: [
                {
                    rowIndex: '56c614fb-7f1e-4bb7-9939-ccbaa690b419',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '4d5723fe-7d36-4044-8f59-1f6da02eacbe'
                }
            ]
        }
    },
    connectors: [],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '703162a5-d48f-40b6-b52e-ec4e1944ba34',
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
        'e682f03e-925a-4d84-adc3-f1c5ceea0201',
        'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
        '0ecd3000-0adc-4d34-bdc1-acd331740de0',
        '7f4ddba5-e41b-456b-b686-94b257cc9914',
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
        'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
        '2f00ca0d-743f-4639-a084-272bbc548f8b',
        'a18b3d06-504c-4e47-9f44-6663c42703cf',
        '5383bf9b-8314-42bd-a51e-cbee56ec3570',
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
        '787fd564-24db-448c-ba59-ef88c8a5cbd9',
        'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
        '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
        'a6849bcb-05b6-4898-8cc1-12ff825524c5',
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
        '85d76151-9bec-4869-b691-791baf964b4f',
        'e653d56e-898d-4e69-87c3-07338d100647',
        'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
        '65909adb-0efe-4743-b4a7-ca6e93d71c92',
        'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
        '583e40d5-e735-4d8c-8f30-097d48de7ec8',
        'a6604def-64ac-4b18-bd52-cb642444eb2d',
        '960c344c-31bb-41b5-ad56-63ba96f239d8',
        '7e331ab0-6782-4244-93b3-5bbcdad069e4',
        '27851956-e853-43e1-8349-bc22d62aa5a4',
        '1875750b-574e-40d4-adff-7aa4f06fc0fe',
        '97ff27bc-bc3f-49cd-b600-abec79e81e50',
        '474faea1-942d-4f0f-8c81-8429fc131dcf',
        '1b13e911-67d9-409a-abee-fc6663dd4108',
        '5a8a33e6-d476-45dc-b263-b3bae11ee715',
        'd6542367-8e40-4576-95aa-3baa12d98ac7',
        '5889818c-cb99-4524-a6fb-79c576f21d26',
        '63212bdb-c6a5-4e99-85cf-9921d6fc834b',
        '2a67f70a-85a0-4423-b788-60a8e66dd245',
        '79801a91-e263-46a7-9e2a-83a6e156dda0',
        '162ea6d1-7389-419d-b8c2-133462029981',
        '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
        '2bf0c2e0-c04d-43a6-84ce-49009b740a1b',
        'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
        'c9ebe244-887a-4821-811c-f9f17a670037',
        '30a1ebac-fff2-4a83-b844-7f0a8faf33b9'
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
        versionNumber: 1
    }
};
