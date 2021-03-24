// To update flowWithAllElementsUIModel from flowWithAllElements, run flowTranslator.test.js and follow instructions
export const flowWithAllElementsUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 58,
            locationY: 51,
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
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: [
                {
                    type: 'REGULAR'
                }
            ]
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
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: false,
            flowTransactionModel: 'CurrentTransaction'
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
                    name: 'subjectNameOrId',
                    value: 'jsmith@salesforce.com',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
                    name: 'text',
                    value: 'This is my message',
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'actionCallLC_apex_no_sobject_auto',
            description: '',
            label: 'actionCallLC apex no sobject auto',
            locationX: 1128,
            locationY: 367,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '2e01b9c4-5144-4db2-9543-7899c5c34329': {
            guid: '2e01b9c4-5144-4db2-9543-7899c5c34329',
            name: 'actionCallLC_apex_with_sobject_auto',
            description: '',
            label: 'actionCallLC apex with sobject auto',
            locationX: 1248,
            locationY: 367,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
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
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717': {
            guid: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            name: 'allTypesApexAction',
            description: '',
            label: 'allTypesApexAction',
            locationX: 643,
            locationY: 187,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            actionType: 'apex',
            actionName: 'AllTypesApexAction',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '4968239c-5e3d-45ee-9339-f575c917e223',
                    name: 'accountParam',
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
                    name: 'idParam',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
                    name: 'numberParam',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '04e1c283-fc0b-4928-a495-89d956368769',
                    name: 'stringParam',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputParameters: [
                {
                    rowIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
                    name: 'outputNumberParam',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
                    name: 'outputStringParam',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
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
            storeOutputAutomatically: false,
            flowTransactionModel: 'Automatic'
        },
        'a35e28e0-3d3b-44b1-9638-9caba6ef3820': {
            guid: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
            name: 'apexCall_account_automatic_output',
            description: '',
            label: 'apexCall account automatic output',
            locationX: 867,
            locationY: 182,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1': {
            guid: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
            outputParameters: [
                {
                    rowIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
                    name: 'generatedAccount',
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
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
            storeOutputAutomatically: false,
            flowTransactionModel: 'CurrentTransaction'
        },
        '2f00ca0d-743f-4639-a084-272bbc548f8b': {
            guid: '2f00ca0d-743f-4639-a084-272bbc548f8b',
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'apex',
            actionName: 'GetAccount',
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
            apexClass: null,
            flowTransactionModel: 'CurrentTransaction'
        },
        'a18b3d06-504c-4e47-9f44-6663c42703cf': {
            guid: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            name: 'apexCall_anonymous_accounts',
            description: '',
            label: 'apexCall anonymous accounts',
            locationX: 1125,
            locationY: 49,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            apexClass: null,
            flowTransactionModel: 'CurrentTransaction'
        },
        '5383bf9b-8314-42bd-a51e-cbee56ec3570': {
            guid: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            name: 'apexCall_anonymous_apex_collection',
            description: '',
            label: 'apexCall anonymous apex collection',
            locationX: 1235,
            locationY: 218,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            apexClass: 'InvocableGetCars$GetCarResult',
            flowTransactionModel: 'CurrentTransaction'
        },
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8': {
            guid: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'apex',
            actionName: 'InvocableGetAccountName',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
                    name: 'accountIds',
                    value: '',
                    valueDataType: '',
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
            elementType: 'APEX_CALL',
            dataType: 'String',
            storeOutputAutomatically: true,
            isSystemGeneratedOutput: true,
            subtype: null,
            isCollection: false,
            apexClass: null,
            flowTransactionModel: 'CurrentTransaction'
        },
        'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1': {
            guid: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
            name: 'apexCall_anonymous_strings',
            description: '',
            label: 'apexCall anonymous strings',
            locationX: 1106,
            locationY: 209,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            apexClass: null,
            flowTransactionModel: 'CurrentTransaction'
        },
        'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c': {
            guid: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
            name: 'apexCall_Car_automatic_output',
            description: '',
            label: 'apexCall Car automatic output',
            locationX: 1310,
            locationY: 72,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            actionType: 'apex',
            actionName: 'GetCarAction',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
                    name: 'names',
                    value: 'Clio',
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
            elementType: 'APEX_CALL',
            dataType: 'ActionOutput',
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            name: 'apexCall_String_automatic_output',
            description: '',
            label: 'apexCall String automatic output',
            locationX: 926,
            locationY: 57,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '7ab29c0c-3dbf-4f99-a94c-311ef891973f': {
            guid: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            name: 'caseLogACallAutomatic',
            description: '',
            label: 'caseLogACallAutomatic',
            locationX: 832,
            locationY: 670,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            actionType: 'quickAction',
            actionName: 'Case.LogACall',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
                    name: 'contextId',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '700b8f1c-98eb-48ea-90f0-35e1a864a1a8': {
            guid: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'emailAlert',
            actionName: 'Account.my_email_alert',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '956ee0bf-ff21-44f4-9917-65676160e094',
                    name: 'SObjectRowId',
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.Id',
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
            elementType: 'EMAIL_ALERT',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            flowTransactionModel: 'CurrentTransaction'
        },
        '69030d84-1e7f-49c3-ad89-ddc4db69050a': {
            guid: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
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
                isSelectable: true,
                hasError: false
            },
            actionType: 'component',
            actionName: 'c:localActionSample',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
                    name: 'subject',
                    value: 'team',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
                    name: 'greeting',
                    value: 'hello',
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
        '6e77e9cf-2492-44ca-a088-ee4b8159d478': {
            guid: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            name: 'submitForApproval',
            description: '',
            label: 'submitForApproval',
            locationX: 674,
            locationY: 49,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            actionType: 'submit',
            actionName: 'submit',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
                    name: 'nextApproverIds',
                    value: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    name: 'objectId',
                    value: '$GlobalConstant.EmptyString',
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
            dataType: 'ActionOutput',
            storeOutputAutomatically: true,
            flowTransactionModel: 'CurrentTransaction'
        },
        '40c11213-36c0-451e-a5aa-8790aee02559': {
            guid: '40c11213-36c0-451e-a5aa-8790aee02559',
            name: 'assign_W_7251820',
            description: '',
            label: 'assign-W-7251820',
            locationX: 1479,
            locationY: 216,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignmentItems: [
                {
                    rowIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
                    leftHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693.AccountNumber',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.AccountNumber',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
                    leftHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'ade42d1f-d120-4ff9-9888-c202b289571c': {
            guid: 'ade42d1f-d120-4ff9-9888-c202b289571c',
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
                isSelectable: true,
                hasError: false
            },
            assignmentItems: [
                {
                    rowIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
                    leftHandSide: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    rightHandSide: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 1050,
            locationY: 472,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            childReferences: [
                {
                    childReference: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b': {
            guid: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
                    leftHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07': {
            guid: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
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
                isSelectable: true,
                hasError: false
            },
            childReferences: [
                {
                    childReference: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'b93ea139-c9df-49cb-a42e-52c5f496ab07': {
            guid: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
                    leftHandSide: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9': {
            guid: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 0,
            elementType: 'Formula'
        },
        '3f70f36b-030f-4b90-ba09-866642ba5d4b': {
            guid: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2'
        },
        '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929': {
            guid: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3147a31d-26a3-408c-b00b-a31983df0da5'
        },
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34'
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7'
        },
        '9b2579d0-01d3-45b0-b6b2-bb016b085511': {
            guid: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            name: 'apexComplexTypeTwoVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestTwo216',
            subtypeIndex: '56095468-2459-481d-b084-04a05babcb22',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9'
        },
        '48cb0159-3cde-48ad-9877-644e3cc4b5e9': {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10'
        },
        'e5b4998c-a36e-407f-afb7-2301eda53b8d': {
            guid: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c'
        },
        '54aae715-8881-4a52-b7a9-25c385d1488e': {
            guid: '54aae715-8881-4a52-b7a9-25c385d1488e',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9'
        },
        '8d53a0e4-6541-42d0-9ea1-665b504fd150': {
            guid: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9d11ba05-33c4-4893-87b8-9560be9557d2'
        },
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2': {
            guid: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5e2803c7-a184-465c-92e3-1d29634f2114'
        },
        'd050fa16-f494-4685-a87f-3c68666d1ba8': {
            guid: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            name: 'booleanVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Boolean',
            subtype: null,
            subtypeIndex: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104'
        },
        '76bbf8c2-9a5e-4a03-a84f-a518866d7963': {
            guid: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db'
        },
        'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7': {
            guid: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3'
        },
        '1283ede6-414b-45a2-851a-1b113f26bffd': {
            guid: '1283ede6-414b-45a2-851a-1b113f26bffd',
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f'
        },
        '37c4575e-32f8-46d9-aeea-737953c256b2': {
            guid: '37c4575e-32f8-46d9-aeea-737953c256b2',
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa'
        },
        '8e3cf25f-1ce2-48c8-9634-b192b94ae230': {
            guid: '8e3cf25f-1ce2-48c8-9634-b192b94ae230',
            name: 'contractSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contract',
            subtypeIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e502e40a-7dfc-4e71-8a42-c491f86a560a'
        },
        '3d47c47d-df60-4f92-85c8-71982afd9938': {
            guid: '3d47c47d-df60-4f92-85c8-71982afd9938',
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782'
        },
        '1f6554e7-ca93-491c-979c-1e2b8fcc563f': {
            guid: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d'
        },
        '42afe63b-0744-4dec-a7e6-20c67691dd81': {
            guid: '42afe63b-0744-4dec-a7e6-20c67691dd81',
            name: 'dateTimeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'DateTime',
            subtype: null,
            subtypeIndex: '02504510-b361-4fb3-878e-81925a76160f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db'
        },
        '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e': {
            guid: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '41a189ff-01f4-4018-b75c-3f363b65cc42'
        },
        '796969f1-a892-4b16-836e-209180057a2b': {
            guid: '796969f1-a892-4b16-836e-209180057a2b',
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39'
        },
        '38f77648-3c7e-4431-8403-239492238623': {
            guid: '38f77648-3c7e-4431-8403-239492238623',
            name: 'numberCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd66cf236-ca0a-4351-952d-b12df4abdaf8'
        },
        '2e02687e-41a2-42eb-ba74-81c130218b86': {
            guid: '2e02687e-41a2-42eb-ba74-81c130218b86',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '52bc2460-8775-417b-a692-f72725a8f6b0'
        },
        '013c0515-5f96-493f-bf5b-3d261350a4e6': {
            guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            name: 'objectWithAllPossiblFieldsVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Object_with_all_possible_fields__c',
            subtypeIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cf176378-9ab0-436f-a161-079057c789f4'
        },
        '27cfbe21-2aa1-4503-aa13-3677c687153d': {
            guid: '27cfbe21-2aa1-4503-aa13-3677c687153d',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1'
        },
        '58d4a602-1abb-46e4-8c10-54c225dd56af': {
            guid: '58d4a602-1abb-46e4-8c10-54c225dd56af',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635'
        },
        'd385d33b-7ce5-4c7a-a867-690dfb63ea97': {
            guid: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '048203c3-6751-4189-b9ab-939f0ef6d7d3'
        },
        'f317c423-f755-4d64-bd4a-e218107b57db': {
            guid: 'f317c423-f755-4d64-bd4a-e218107b57db',
            name: 'stringCollectionVariable2',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '794b3296-5246-473a-b618-584b8956809c',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1669c1f5-9872-461f-a826-b4fa64d902dd'
        },
        '9c51615d-c61a-46f7-b26a-7157f6908b21': {
            guid: '9c51615d-c61a-46f7-b26a-7157f6908b21',
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'f94a6136-8394-445d-a2f1-1ef06f109cb5',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '1a279fff-8bfc-4714-bc0f-2d7a203c6b16'
        },
        '4197d875-e006-4afc-844f-753d75b8c4d1': {
            guid: '4197d875-e006-4afc-844f-753d75b8c4d1',
            name: 'vAccountId',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '0c77e4b9-7c32-4ce0-862d-ab58bb5b7553',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8f88fc57-1b46-4e64-8821-bd1e1bcc6de6'
        },
        '20719b7b-1961-4eda-a3f3-b42d939e604a': {
            guid: '20719b7b-1961-4eda-a3f3-b42d939e604a',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fff17adf-4565-4360-91b9-64f7fd54a9d7'
        },
        '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0': {
            guid: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'ed78dc90-dad8-4f67-b39a-59d06fa41665'
        },
        '1875750b-574e-40d4-adff-7aa4f06fc0fe': {
            guid: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!9c51615d-c61a-46f7-b26a-7157f6908b21}</p>',
            dataType: 'String',
            isViewedAsPlainText: false
        },
        '8ca8f838-4af4-4ae6-89fd-abdcc075a85e': {
            guid: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
            name: 'textTemplate2',
            description: '',
            elementType: 'TextTemplate',
            text: 'This text template is in plain text mode.',
            dataType: 'String',
            isViewedAsPlainText: true
        },
        '5abbcb4e-faba-4750-91f2-46c9509713ea': {
            guid: '5abbcb4e-faba-4750-91f2-46c9509713ea',
            name: 'subflow_with_all_type_variables',
            description: '',
            label: 'subflow with all type variables',
            locationX: 1043,
            locationY: 543,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            flowName: 'flowWithAllTypesVariables',
            inputAssignments: [
                {
                    rowIndex: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    name: 'inputOutputAccountColVar',
                    value: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
                    name: 'inputOutputAccountVar',
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'b3ab254b-af11-4c5e-b0c5-949f27d4bccb',
                    name: 'inputOutputBoolVar',
                    value: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '777c097c-f3b9-4845-9418-b50d40eb2550',
                    name: 'inputOutputCurrencyVar',
                    value: '3d47c47d-df60-4f92-85c8-71982afd9938',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'f6526a3c-c24b-49e8-a910-d99a8c8342b5',
                    name: 'inputOutputDateTimeVar',
                    value: '42afe63b-0744-4dec-a7e6-20c67691dd81',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'e7dfb0f5-be90-4dcd-9841-da7bd989dee5',
                    name: 'inputOutputDateVar',
                    value: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
                    name: 'inputOutputNumberVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '5041d41a-0822-4ddc-9685-8a09b840bb0d',
                    name: 'inputOutputNumberVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c',
                    name: 'inputOutputStringVar',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'c7027d6d-66ae-440f-b340-0c652eaebe79',
                    name: 'inputNotAvailableParam',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputAssignments: [
                {
                    rowIndex: '5a8a33e6-d476-45dc-b263-b3bae11ee715',
                    name: 'inputOutputAccountColVar',
                    value: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '0d02ed31-ffad-42ba-967f-5ebbbdb83dd5',
                    name: 'inputOutputAccountVar',
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'd65a9682-db73-4ea7-8a38-9e2d8ee50d43',
                    name: 'inputOutputBoolVar',
                    value: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '553332e6-c579-49e7-8757-8044dd8b530f',
                    name: 'inputOutputCurrencyVar',
                    value: '3d47c47d-df60-4f92-85c8-71982afd9938',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'cb13b620-ebec-4c72-aff0-beebd24ef0c2',
                    name: 'inputOutputDateTimeVar',
                    value: '42afe63b-0744-4dec-a7e6-20c67691dd81',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '9f2723ee-84ae-473a-b265-ebee9afa6697',
                    name: 'inputOutputDateVar',
                    value: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '8d06ba06-b0e4-4a15-ab56-651dc35a83a8',
                    name: 'inputOutputNumberVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'd6542367-8e40-4576-95aa-3baa12d98ac7',
                    name: 'inputOutputNumberVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '0a3d0031-d1de-4f69-9a41-c302eecc0ea5',
                    name: 'inputOutputStringColVar',
                    value: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '76a209b0-66ab-4a14-ad73-56b02b937714',
                    name: 'inputOutputStringVar',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '3606994f-008f-4e3a-a353-cc4f7fa75086',
                    name: 'latestOutputStringColVar',
                    value: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '3ce2bd36-67b8-4bc3-b144-1ba05ee7dafe',
                    name: 'latestOutputStringVar',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '123b2338-5cb1-4a98-966f-58a56114c1f6',
                    name: 'outputNotAvailableParam',
                    value: '9c51615d-c61a-46f7-b26a-7157f6908b21',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            maxConnections: 1,
            elementType: 'Subflow',
            storeOutputAutomatically: false
        },
        '49bf649f-45c0-4d54-8533-93b51f9b557e': {
            guid: '49bf649f-45c0-4d54-8533-93b51f9b557e',
            name: 'subflowAutomaticOutput',
            description: '',
            label: 'subflowAutomaticOutput',
            locationX: 1170,
            locationY: 507,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            flowName: 'flowWithActiveAndLatest',
            inputAssignments: [
                {
                    rowIndex: '37cfa784-b1db-4323-8baa-51d1da0c010f',
                    name: 'input1',
                    value: 'a string',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputAssignments: [],
            maxConnections: 1,
            elementType: 'Subflow',
            storeOutputAutomatically: true,
            dataType: 'SubflowOutput'
        },
        '875f212c-ce7a-482e-900a-5a11b9e83a62': {
            guid: '875f212c-ce7a-482e-900a-5a11b9e83a62',
            name: 'create_multiple_from_apex_two_level_traversal',
            description: '',
            label: 'create multiple from apex two level traversal',
            locationX: 177,
            locationY: 297,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            object: '',
            objectIndex: 'c9c2a575-1e1a-4bb4-a78d-0f8c2f56610f',
            getFirstRecordOnly: false,
            inputReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511.testOne.acctListField',
            inputReferenceIndex: 'a4523c0d-9291-4c0a-b5ba-1168e4d17d99',
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
            assignRecordIdToReferenceIndex: '6fe68205-b480-4ba1-abfd-ce650b968aa8',
            dataType: 'Boolean'
        },
        '63212bdb-c6a5-4e99-85cf-9921d6fc834b': {
            guid: '63212bdb-c6a5-4e99-85cf-9921d6fc834b',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '6f408b05-42aa-4ee2-8bbc-7756dcf10eac',
            inputAssignments: [
                {
                    rowIndex: '46a0552e-a492-4f1a-8870-500c1a3feea3',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '807ef621-63b9-43a5-abf0-4c3b81726be3',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '7b238465-d71b-489c-8223-425066aaf928',
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
            assignRecordIdToReference: '20719b7b-1961-4eda-a3f3-b42d939e604a',
            assignRecordIdToReferenceIndex: 'aef5864b-0e6b-4c61-9fe8-a2db15831cd6',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        '2a67f70a-85a0-4423-b788-60a8e66dd245': {
            guid: '2a67f70a-85a0-4423-b788-60a8e66dd245',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '876ef3ea-e716-462e-af8d-aa632dbfc72e',
            inputAssignments: [
                {
                    rowIndex: '79801a91-e263-46a7-9e2a-83a6e156dda0',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'aa2ec166-4d80-47f5-8492-ec14cbf5003e',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '42992316-8b74-4ffc-a6af-a48845db0e95',
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
            assignRecordIdToReferenceIndex: '8d846e45-cc1d-4e65-b9c5-35c5436a3252',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        '291464ff-dda0-4384-a6b0-1cee49e14879': {
            guid: '291464ff-dda0-4384-a6b0-1cee49e14879',
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
                isSelectable: true,
                hasError: false
            },
            object: '',
            objectIndex: '12fb3b06-c2c3-46a8-99e6-0fd31f08d028',
            getFirstRecordOnly: true,
            inputReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            inputReferenceIndex: '05c643f6-c379-43eb-80e9-ed2b9ea5dac8',
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
            assignRecordIdToReferenceIndex: '88b31e32-25ee-4d52-83f0-4b9c4b23af08',
            dataType: 'Boolean'
        },
        '232488b7-0f88-4cfc-88c4-0d5f4b2a4373': {
            guid: '232488b7-0f88-4cfc-88c4-0d5f4b2a4373',
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
                isSelectable: true,
                hasError: false
            },
            object: '',
            objectIndex: 'd7127657-00e8-4d96-b56d-3b7126ec9692',
            getFirstRecordOnly: false,
            inputReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            inputReferenceIndex: '6e2691cf-2d89-4ee4-8c99-b95971c49da0',
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
            assignRecordIdToReferenceIndex: '4371db38-52ba-4a94-b31b-75848b050e63',
            dataType: 'Boolean'
        },
        '10a13e6e-f0be-4491-8148-7dc7bcfc3ded': {
            guid: '10a13e6e-f0be-4491-8148-7dc7bcfc3ded',
            name: 'withApexDefSingleSObjectVariable',
            description: '',
            label: 'withApexDefSingleSObjectVariable',
            locationX: 1211,
            locationY: 668,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            object: '',
            objectIndex: '1d77fcef-86db-4398-9e95-fe10f1554ab7',
            getFirstRecordOnly: true,
            inputReference: '54aae715-8881-4a52-b7a9-25c385d1488e.account',
            inputReferenceIndex: '6bd7fb1e-1f4f-4420-8ad4-0641e859d182',
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
            assignRecordIdToReferenceIndex: '86488742-59ae-41c6-81c5-df64825d4c6b',
            dataType: 'Boolean'
        },
        'e8244d51-bc66-4700-831a-9bfeb05fc5a7': {
            guid: 'e8244d51-bc66-4700-831a-9bfeb05fc5a7',
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
                isSelectable: true,
                hasError: false
            },
            object: '',
            objectIndex: '2c880f0a-391e-4655-8b5c-9f39c0c36a92',
            getFirstRecordOnly: false,
            inputReference: 'e5b4998c-a36e-407f-afb7-2301eda53b8d.accounts',
            inputReferenceIndex: 'd2f9a0fc-fe13-46d4-8916-ff2aafd35cda',
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
            assignRecordIdToReferenceIndex: '8b35de0b-9d89-4f4e-86d6-96ff4e5d9a5c',
            dataType: 'Boolean'
        },
        '9d9cf957-471a-49d1-bf9c-6d93f9edd2ab': {
            guid: '9d9cf957-471a-49d1-bf9c-6d93f9edd2ab',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '3660398c-f1e3-4895-89be-f3cb2ec4e840',
            outputReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.acct',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '8828cb76-9deb-4765-bba0-b3291b1303e6',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '8da17fa9-310c-41d0-af09-f9bd81fc0c17'
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
            outputReferenceIndex: 'f6fc43a4-837b-48db-801e-da5c8062dd75',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '039af026-5477-46fa-87ab-09bf0f1e57a3': {
            guid: '039af026-5477-46fa-87ab-09bf0f1e57a3',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: 'c0b8d69f-4607-479a-b09c-55b8be96503f',
            outputReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.acctListField',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '1c1e6a2c-d292-49f3-ab11-1c6cf365e135',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'a4aa233d-13fb-431d-afb2-7f2388ca6010'
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
            outputReferenceIndex: '33155916-197a-4b4e-b108-bbdf3aef4e41',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'e46d1655-6558-4c7b-b828-b040906115b0': {
            guid: 'e46d1655-6558-4c7b-b828-b040906115b0',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '134b1c72-cb94-4987-806d-155a8cc0f736',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '2c2b6727-f892-4a27-802c-8414e7f162de',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'fde9b89d-7177-4303-889d-5293eaeb58aa',
                    leftHandSide: 'Account.BillingPostalCode',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '1219bee3-aea6-4567-b155-e5ddb4a543bd'
                },
                {
                    field: 'Name',
                    rowIndex: '35837efc-fe6e-4096-8de3-a00443b93527'
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
            outputReferenceIndex: '3980ef9a-c9c0-4635-a6af-13682830ba4b',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '130d845a-9aeb-42e7-acbc-cdea13693b85': {
            guid: '130d845a-9aeb-42e7-acbc-cdea13693b85',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: 'ab66a6a8-98df-47cd-9948-1c2390f02139',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '611f9934-04ec-47a9-8a9f-ade6f3b66435',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'NotEqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'ea5338a4-7109-4d3a-819a-d5e994a18d60'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37'
                },
                {
                    field: 'Name',
                    rowIndex: '4a3a792e-8129-48dd-bfa5-07916dc37180'
                },
                {
                    field: 'CreatedDate',
                    rowIndex: '69591af2-800b-499b-af80-25f60583d5f2'
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
            outputReferenceIndex: '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        'af2f244a-5bc6-4c40-b630-3d597ba1cbdc': {
            guid: 'af2f244a-5bc6-4c40-b630-3d597ba1cbdc',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '56c614fb-7f1e-4bb7-9939-ccbaa690b419',
            outputAssignments: [
                {
                    rowIndex: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Los Angeles'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '9b2a7f10-e00e-4965-9d61-c67108ad5c57',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'a6604def-64ac-4b18-bd52-cb642444eb2d',
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
            outputReferenceIndex: 'de99983e-4f45-4dbd-b0e1-c38008ec2c44',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '79d6481a-0bc2-4248-9e0b-19c4c632280b': {
            guid: '79d6481a-0bc2-4248-9e0b-19c4c632280b',
            name: 'lookupAccountsManual',
            description: '',
            label: 'lookupAccountsManual',
            locationX: 745,
            locationY: 352,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '11a2e3b4-ce6e-4642-9530-17c47cbcc909',
            outputReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '7b6dd177-4174-48fd-9c2a-59274e1ec3dd',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '34c1a55f-5058-4668-aee3-1d987573638e'
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
            outputReferenceIndex: '2f787ad6-32ec-4d66-a34e-a2131ffbee92',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        '5a7f1472-d64c-4b45-adde-b52b93262693': {
            guid: '5a7f1472-d64c-4b45-adde-b52b93262693',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '0fa2da7a-22de-4045-ab83-711522e52bb6',
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
            outputReferenceIndex: 'ee652516-7b62-402f-88a2-1ab887b55072',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '98a764f1-b847-44c2-b27c-b1d15f4857ca': {
            guid: '98a764f1-b847-44c2-b27c-b1d15f4857ca',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '27851956-e853-43e1-8349-bc22d62aa5a4',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
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
            outputReferenceIndex: '452941fc-4972-44df-b34d-a821bb32e800',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '18bab1b9-dd42-4e70-acd9-b4a37b979156': {
            guid: '18bab1b9-dd42-4e70-acd9-b4a37b979156',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '6077af99-1c4d-4f4e-a5a1-6ff145d789a6',
            outputReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '3cbaaea5-5255-411e-ba40-724b7b88ab91',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '38af1059-deb3-4044-8912-d7f91e2cf66d'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '6a8d379d-409e-419f-b6b0-e91ab1a73398'
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
            outputReferenceIndex: 'aa454085-b38e-45f6-b63b-d15d8579357c',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83': {
            guid: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
            name: 'deleteAccount',
            description: '',
            label: 'deleteAccount',
            locationX: 955,
            locationY: 469,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            inputReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            inputReferenceIndex: '162ea6d1-7389-419d-b8c2-133462029981',
            object: '',
            objectIndex: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
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
        '0e7a1251-a491-43d2-8828-b61652438009': {
            guid: '0e7a1251-a491-43d2-8828-b61652438009',
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
                isSelectable: true,
                hasError: false
            },
            inputReference: '',
            inputReferenceIndex: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
            object: 'Account',
            objectIndex: '2a4b3b65-06a5-4679-bac9-98dc536c68d4',
            filterLogic: '(1 AND 2) OR 3',
            filters: [
                {
                    rowIndex: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '2bf0c2e0-c04d-43a6-84ce-49009b740a1b',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '865e456d-2e1d-410f-8c62-8f686238b197',
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
        '6f3f842a-e289-48ee-b18b-6820e87cee94': {
            guid: '6f3f842a-e289-48ee-b18b-6820e87cee94',
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
                isSelectable: true,
                hasError: false
            },
            inputReference: '',
            inputReferenceIndex: '030e4398-87bd-4390-a8fd-a348fcd3b323',
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
                    rowIndex: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.BillingCity',
                    rightHandSideDataType: 'reference'
                },
                {
                    rowIndex: 'f9efafa3-d83f-41a6-92e8-487eadb228c0',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'salesforce',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'Salesforce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: '(1 AND 2) OR 3',
            object: 'Account',
            objectIndex: 'f876df5e-ccc8-43a5-921f-4730c6c8052b',
            dataType: 'Boolean',
            wayToFindRecords: 'recordLookup'
        },
        '4899e1df-446e-4158-a942-9b376323c325': {
            guid: '4899e1df-446e-4158-a942-9b376323c325',
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
                isSelectable: true,
                hasError: false
            },
            inputReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            inputReferenceIndex: 'fd06f9e3-6e63-4d89-b441-ca4c0594deb5',
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
                    rowIndex: '5a6a3791-5930-4c22-9f5d-ed090b53f8e6',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: ''
                }
            ],
            filters: [
                {
                    rowIndex: 'b8a65817-59f3-4fa9-a0a8-73602ab6a45a',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: '7f18c878-eb8d-49d8-8b87-8d8ddcdf4daa',
            dataType: 'Boolean',
            wayToFindRecords: 'sObjectReference'
        },
        '344d842e-e73f-4ea4-96ea-2ddaff5152f9': {
            guid: '344d842e-e73f-4ea4-96ea-2ddaff5152f9',
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
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'a14520b8-aaca-4c29-a9f7-b1569a9a68fe',
            collectionReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            collectionReferenceIndex: 'b8a432c5-c98e-4ccd-b5fe-b399e14090ae',
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
        'c3c5d29f-b56c-48b8-a249-9765017a7d37': {
            guid: 'c3c5d29f-b56c-48b8-a249-9765017a7d37',
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
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '52736a70-f96b-4c6f-803b-355bff915424',
            collectionReference: 'ba8a8e41-3944-4099-9655-065f054e811f',
            collectionReferenceIndex: '99dc6278-41a6-44c2-b316-c76f639232c4',
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
        '19362806-09c5-46a5-b274-bebe980379cf': {
            guid: '19362806-09c5-46a5-b274-bebe980379cf',
            name: 'loopOnComplexMergeFieldManualOutput',
            description: '',
            label: 'loopOnComplexMergeFieldManualOutput',
            locationX: 666,
            locationY: 455,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            assignNextValueToReferenceIndex: 'aca838b1-ea76-436d-a081-732171fdbc11',
            collectionReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.acctListField',
            collectionReferenceIndex: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b',
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
        '9cd671ee-af98-49b1-b58f-5e022bc554a4': {
            guid: '9cd671ee-af98-49b1-b58f-5e022bc554a4',
            name: 'loopOnLocalActionSobjectCollInApexAutoOutput',
            description: '',
            label: 'loopOnLocalActionSobjectCollInApexAutoOutput',
            locationX: 1032,
            locationY: 333,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'b5a9adff-b0ce-403c-9016-dc59e7047f6a',
            collectionReference: '2e01b9c4-5144-4db2-9543-7899c5c34329.apexWithSObject.acctListField',
            collectionReferenceIndex: '15fef33a-a826-43bb-9095-7266eebb74b0',
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
        'c7bb47cd-f402-49d5-963b-681d7987ff13': {
            guid: 'c7bb47cd-f402-49d5-963b-681d7987ff13',
            name: 'loopOnNestedApexTypeAutoOutput',
            description: '',
            label: 'loopOnNestedApexTypeAutoOutput',
            locationX: 327,
            locationY: 306,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '7ad9e640-173f-47e3-a650-3831db508294',
            collectionReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511.testOne.acctListField',
            collectionReferenceIndex: '2f16ad0b-a4ea-4062-833a-bc2250adc79e',
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
        '13eb88dc-26bf-40d3-b2b1-f9f61326d119': {
            guid: '13eb88dc-26bf-40d3-b2b1-f9f61326d119',
            name: 'loopOnScreenCompInSectionColl',
            description: '',
            label: 'loopOnScreenCompInSectionColl',
            locationX: 846,
            locationY: 510,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '9d2938f4-6dda-4492-b06f-5009cc1e6f3f',
            collectionReference: '4297d5ea-aed3-421e-a33b-e988e84d10ac.accounts',
            collectionReferenceIndex: '76e934ba-572c-48aa-9c08-848447c2eef8',
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
        'e8074486-47d5-4c8a-8d2b-e331bbddce46': {
            guid: 'e8074486-47d5-4c8a-8d2b-e331bbddce46',
            name: 'loopOnScreenCompSObjectCollAutoOutput',
            description: '',
            label: 'loopOnScreenCompSObjectCollAutoOutput',
            locationX: 884,
            locationY: 334,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '4712fdfc-e7e0-4ca0-88ab-ad976993a58b',
            collectionReference: '17d626e2-e27c-4bf0-9670-5abc582a22fb.accounts',
            collectionReferenceIndex: '1d676afa-a7f0-4eb0-96fb-baa6543ade08',
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
        'aa87e8e6-9d87-40f8-9b92-a859533f7143': {
            guid: 'aa87e8e6-9d87-40f8-9b92-a859533f7143',
            name: 'loopOnSobjectCollectionInApexTypeAutoOutput',
            description: '',
            label: 'loopOnSobjectCollectionInApexTypeAutoOutput',
            locationX: 735,
            locationY: 506,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '96d93d3e-c114-4a50-b092-726601411e37',
            collectionReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.acctListField',
            collectionReferenceIndex: '45246681-1c9f-4123-8d02-d2fa844e6e79',
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
        '1fa12c04-abe3-44d7-87d2-132178cb5c70': {
            guid: '1fa12c04-abe3-44d7-87d2-132178cb5c70',
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
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: '9c51615d-c61a-46f7-b26a-7157f6908b21',
            assignNextValueToReferenceIndex: '0596012b-9bd5-4182-87ce-0e1f231967ef',
            collectionReference: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            collectionReferenceIndex: '9598b9ad-7b8d-4a74-bf1b-32020d902af1',
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
        '2685a4c3-eb23-434b-bc14-c57ca6ab70ce': {
            guid: '2685a4c3-eb23-434b-bc14-c57ca6ab70ce',
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
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '8ffc4a7e-4528-4782-8ee5-7b5d2ac6f27f',
            collectionReference: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            collectionReferenceIndex: 'f5b5d205-8109-4989-bb5a-05678f04ec69',
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
        '247e0c32-5050-4a90-977f-f33c989ad9f9': {
            guid: '247e0c32-5050-4a90-977f-f33c989ad9f9',
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
                isSelectable: true,
                hasError: false
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
                    childReference: '8ee25bae-66aa-4c1d-bf28-938976a1d25b'
                },
                {
                    childReference: '64576cb6-0939-475e-8e1b-76feee5be4be'
                },
                {
                    childReference: 'b15d6409-4439-4dc2-8a3d-4956e56ba21a'
                },
                {
                    childReference: '46c2961d-5cf6-443b-95d4-91d406c02a37'
                },
                {
                    childReference: '17d626e2-e27c-4bf0-9670-5abc582a22fb'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '8ee25bae-66aa-4c1d-bf28-938976a1d25b': {
            guid: '8ee25bae-66aa-4c1d-bf28-938976a1d25b',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '79c59df8-63ef-4817-8939-4951da8d22c9',
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
                    rowIndex: 'c27e44ab-6e20-496f-80c0-623c207ab098',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '38e03c17-22d6-403f-91bf-6d9bd0caa696',
                    name: 'placeholder',
                    value: 'your email address',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '64576cb6-0939-475e-8e1b-76feee5be4be': {
            guid: '64576cb6-0939-475e-8e1b-76feee5be4be',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '060e2e3d-c798-4c96-b7c8-4b694bbcb5d5',
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
                    rowIndex: 'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '31ac8e99-5705-49f2-a2ef-bf2f6a4a22e0',
                    name: 'placeholder',
                    value: 'your email',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: false,
            childReferences: []
        },
        'b15d6409-4439-4dc2-8a3d-4956e56ba21a': {
            guid: 'b15d6409-4439-4dc2-8a3d-4956e56ba21a',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '23ae0ea4-4d33-4dcc-a579-013e91fd4159',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '46c2961d-5cf6-443b-95d4-91d406c02a37': {
            guid: '46c2961d-5cf6-443b-95d4-91d406c02a37',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'e713f058-3d86-43ff-9da6-c8cd70863c95',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '17d626e2-e27c-4bf0-9670-5abc582a22fb': {
            guid: '17d626e2-e27c-4bf0-9670-5abc582a22fb',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'df72b5ae-20df-4ebf-9c93-3f87b91d7791',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'b0d41663-ba7b-4020-8f88-6c83151e3a83': {
            guid: 'b0d41663-ba7b-4020-8f88-6c83151e3a83',
            name: 'screenUsingResources',
            description: '',
            label: 'screenUsingResources',
            locationX: 181,
            locationY: 788,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                    childReference: '652434b1-40e0-404e-9e4d-e6864e4f8bdb'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '652434b1-40e0-404e-9e4d-e6864e4f8bdb': {
            guid: '652434b1-40e0-404e-9e4d-e6864e4f8bdb',
            name: 'displayTextUsingResources',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'a339198f-0294-4416-a67a-2782d735acad',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'DisplayText',
            fieldText:
                '<p>address : {!d08b12f4-ac7b-4cb4-a3ff-621131fc450f.street}</p><p>email : {!337b5789-e021-4e7b-ab5d-582c80803cca.value}</p>',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'DisplayText',
                fieldType: 'DisplayText',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelDisplayText',
                icon: 'standard:display_text',
                category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
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
        '5bd09db6-7e3f-41e3-a0c7-dbef33840655': {
            guid: '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
            name: 'screenWithAddress',
            description: '',
            label: 'screenWithAddress',
            locationX: 873,
            locationY: 483,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                    childReference: '4be9885e-987b-4fab-b204-58dd28d0829c'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '4be9885e-987b-4fab-b204-58dd28d0829c': {
            guid: '4be9885e-987b-4fab-b204-58dd28d0829c',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '0d21d5a2-6e85-4023-8e2b-846d05bfb367',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        'e12fdd35-1aeb-4465-b52c-73a201e704a7': {
            guid: 'e12fdd35-1aeb-4465-b52c-73a201e704a7',
            name: 'screenWithAutomaticFields',
            description: '',
            label: 'screenWithAutomaticFields',
            locationX: 1030,
            locationY: 1018,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                    childReference: '55c07deb-dcd5-45e2-ad9a-c80b7bc17362'
                },
                {
                    childReference: '09238073-9b8a-4280-9f23-e44be298f4b0'
                },
                {
                    childReference: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2'
                },
                {
                    childReference: 'd5a45e74-78b4-41c3-844d-b0536f90c54b'
                },
                {
                    childReference: '2e27b2ec-9bb9-493d-9151-d9022471680f'
                },
                {
                    childReference: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe'
                },
                {
                    childReference: '9abf51ab-a289-45b0-853c-040be0ed9eb7'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '55c07deb-dcd5-45e2-ad9a-c80b7bc17362': {
            guid: '55c07deb-dcd5-45e2-ad9a-c80b7bc17362',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'f8d71fe5-b8d5-4def-b47b-dd4aef4b47dc',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditions: [
                    {
                        rowIndex: '096f6fc9-8bb1-4738-9365-5e8fd66eaa14',
                        leftHandSide: 'b3226572-8133-4f57-a49e-b9863ea7da7b.value',
                        rightHandSide: '50',
                        rightHandSideDataType: 'Number',
                        operator: 'GreaterThanOrEqualTo'
                    }
                ],
                conditionLogic: 'and'
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.Name',
            childReferences: []
        },
        '09238073-9b8a-4280-9f23-e44be298f4b0': {
            guid: '09238073-9b8a-4280-9f23-e44be298f4b0',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'df134372-8b3c-4bbd-875a-7513e76bec39',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.NumberOfEmployees',
            childReferences: []
        },
        'fd3f7f93-d285-4327-ad6d-2b080ee334b2': {
            guid: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'ba867a87-724c-4775-963b-2fc43169444f',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '5a7f1472-d64c-4b45-adde-b52b93262693.Name',
            childReferences: []
        },
        'd5a45e74-78b4-41c3-844d-b0536f90c54b': {
            guid: 'd5a45e74-78b4-41c3-844d-b0536f90c54b',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'ffdc5988-95d5-483c-b1ba-6b2adb5e8df7',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.Description',
            childReferences: []
        },
        '2e27b2ec-9bb9-493d-9151-d9022471680f': {
            guid: '2e27b2ec-9bb9-493d-9151-d9022471680f',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '363280ef-e5f4-414b-9988-1200b330e5cb',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '013c0515-5f96-493f-bf5b-3d261350a4e6.Text_Field__c',
            childReferences: []
        },
        'fd01968e-736a-4bbf-9324-f6e7f915b6fe': {
            guid: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe',
            name: 'numberScreenField1',
            choiceReferences: [],
            dataType: 'Number',
            defaultValue: '',
            defaultValueIndex: '2aacf35d-91f7-42cc-a668-f0b682615d6b',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'InputField',
            fieldText: 'numberScreenField1',
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
        '9abf51ab-a289-45b0-853c-040be0ed9eb7': {
            guid: '9abf51ab-a289-45b0-853c-040be0ed9eb7',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'd99d05ca-bae7-459a-9551-10f32d89aeb9',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '8e3cf25f-1ce2-48c8-9634-b192b94ae230.ActivatedDate',
            childReferences: []
        },
        '5a93c395-dd94-498e-9383-50caf96c6748': {
            guid: '5a93c395-dd94-498e-9383-50caf96c6748',
            name: 'screenWithAutomaticFieldsInSection',
            description: '',
            label: 'screenWithAutomaticFieldsInSection',
            locationX: 1164,
            locationY: 1025,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                    childReference: 'db83d1da-0f30-4796-8075-843918cf6c01'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '91280889-13e2-4de0-8390-32d05b8918e5': {
            guid: '91280889-13e2-4de0-8390-32d05b8918e5',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.Name',
            childReferences: []
        },
        '91f8d923-79e4-4a85-9621-3334fac4abe5': {
            guid: '91f8d923-79e4-4a85-9621-3334fac4abe5',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.NumberOfEmployees',
            childReferences: []
        },
        'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c': {
            guid: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '9b6b8f63-fff0-477e-92b7-3e315551288b',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '013c0515-5f96-493f-bf5b-3d261350a4e6.Text_Field__c',
            childReferences: []
        },
        '9aba628e-835b-448a-ac6b-a3764ac735b4': {
            guid: '9aba628e-835b-448a-ac6b-a3764ac735b4',
            name: 'screenWithAutomaticFieldsInSection_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '016e92d2-b409-4a9d-89c0-50e637967cbc',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '0918a8eb-38a1-4294-b329-39aa5b0bbd13',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: '91280889-13e2-4de0-8390-32d05b8918e5'
                },
                {
                    childReference: '91f8d923-79e4-4a85-9621-3334fac4abe5'
                },
                {
                    childReference: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c'
                }
            ]
        },
        '13cd8d8c-6bf4-4f50-95bb-32adde864b80': {
            guid: '13cd8d8c-6bf4-4f50-95bb-32adde864b80',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '483bad31-107e-420d-8598-721d6db44c47',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.SicDesc',
            childReferences: []
        },
        '8f54aa39-0bda-422e-a4ad-3e2ac0155234': {
            guid: '8f54aa39-0bda-422e-a4ad-3e2ac0155234',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'a5dd0d8d-9a71-4f0f-9ad0-573d34041554',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'ObjectProvided',
            fieldText: '',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            objectFieldReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.Description',
            childReferences: []
        },
        'd6ff3600-dcdb-404b-8a8b-8a90226a575b': {
            guid: 'd6ff3600-dcdb-404b-8a8b-8a90226a575b',
            name: 'screenWithAutomaticFieldsInSection_Section1_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'a5b1853e-6b7e-4568-9b24-37414be4b4d7',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '888dc04a-b0c7-49af-804a-8af6951151a0',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: '13cd8d8c-6bf4-4f50-95bb-32adde864b80'
                },
                {
                    childReference: '8f54aa39-0bda-422e-a4ad-3e2ac0155234'
                }
            ]
        },
        'db83d1da-0f30-4796-8075-843918cf6c01': {
            guid: 'db83d1da-0f30-4796-8075-843918cf6c01',
            name: 'screenWithAutomaticFieldsInSection_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'ec3a2e92-54b4-4cc1-aa0b-2026ce47d2ff',
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
                    childReference: '9aba628e-835b-448a-ac6b-a3764ac735b4'
                },
                {
                    childReference: 'd6ff3600-dcdb-404b-8a8b-8a90226a575b'
                }
            ]
        },
        '1ce942af-1f5f-421c-b55b-07edf0fb0401': {
            guid: '1ce942af-1f5f-421c-b55b-07edf0fb0401',
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
                isSelectable: true,
                hasError: false
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
                    childReference: 'bf86df65-a565-4f4c-9a88-3785f2785230'
                },
                {
                    childReference: 'fa63fff1-36e9-4574-9586-72f3ef2b334d'
                },
                {
                    childReference: 'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814'
                },
                {
                    childReference: 'd08b12f4-ac7b-4cb4-a3ff-621131fc450f'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'b3226572-8133-4f57-a49e-b9863ea7da7b': {
            guid: 'b3226572-8133-4f57-a49e-b9863ea7da7b',
            name: 'slider_1',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'c0582ee6-8e57-4803-a24a-55004897c2c5',
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
                    rowIndex: '57776352-a679-4bdc-876b-77d987c29fc5',
                    name: 'label',
                    value: 'slider_1',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '1936abb6-dc8c-4180-a4dd-7172ba4841df': {
            guid: '1936abb6-dc8c-4180-a4dd-7172ba4841df',
            name: 'ScreenWithSection_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '9dfb762b-b721-4ac5-b787-edcdd6f02574',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: 'f4b58a0a-045d-49d4-b1c7-888e895a4484',
                    name: 'width',
                    value: '12',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: 'b3226572-8133-4f57-a49e-b9863ea7da7b'
                }
            ]
        },
        'bf86df65-a565-4f4c-9a88-3785f2785230': {
            guid: 'bf86df65-a565-4f4c-9a88-3785f2785230',
            name: 'ScreenWithSection_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'b1594536-54c8-4f1d-96fc-ebfd501ca433',
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
                    childReference: '1936abb6-dc8c-4180-a4dd-7172ba4841df'
                }
            ]
        },
        'fa63fff1-36e9-4574-9586-72f3ef2b334d': {
            guid: 'fa63fff1-36e9-4574-9586-72f3ef2b334d',
            name: 'number_2',
            choiceReferences: [],
            dataType: 'Number',
            defaultValue: '',
            defaultValueIndex: 'd6b5b39e-c834-4449-9ade-38629b8676d9',
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
        'a084e300-bca6-4e92-b8c8-9b2490b3cc5c': {
            guid: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c',
            name: 'text_2',
            choiceReferences: [],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: 'ddd9900e-25a1-4ef5-825f-bde05b6231ae',
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
        '12adeaa5-22e0-4adf-9cc9-10762c6ac494': {
            guid: '12adeaa5-22e0-4adf-9cc9-10762c6ac494',
            name: 'dateTimeInSection',
            choiceReferences: [],
            dataType: 'DateTime',
            defaultValue: '$System.OriginDateTime',
            defaultValueDataType: 'reference',
            defaultValueIndex: '1aeb52b7-9963-431b-a046-e41cfd1f5ef9',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'InputField',
            fieldText: 'dateTimeInSection',
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'DateTime',
                fieldType: 'InputField',
                dataType: 'DateTime',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelDateTime',
                icon: 'standard:date_time',
                category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                type: 'DateTime'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: []
        },
        '0d5c72c9-56a2-49e9-81cf-d0552a8d968c': {
            guid: '0d5c72c9-56a2-49e9-81cf-d0552a8d968c',
            name: 'ScreenWithSection_Section2_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '5e649f27-18a2-47ae-abad-c0f33d2e2a1b',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '1f5acf67-1b31-46ba-b0a5-42c9c27510f7',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c'
                },
                {
                    childReference: '12adeaa5-22e0-4adf-9cc9-10762c6ac494'
                }
            ]
        },
        '337b5789-e021-4e7b-ab5d-582c80803cca': {
            guid: '337b5789-e021-4e7b-ab5d-582c80803cca',
            name: 'email_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'fd6ee2ac-fe05-4c7b-9b70-bc611c531126',
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
                    rowIndex: 'cb2c1f94-a09d-4690-9c2b-1a2f37e16dbb',
                    name: 'label',
                    value: 'email_2',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '23a963ec-f168-4151-804b-9541689dc879': {
            guid: '23a963ec-f168-4151-804b-9541689dc879',
            name: 'accounts',
            choiceReferences: [
                {
                    choiceReference: '452ba7ae-00a1-46ea-a315-a63aa41d1b32'
                },
                {
                    choiceReference: 'babb725d-f89c-45e7-bf59-453c06cbfff1'
                }
            ],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: '131babab-443d-4e7f-99dc-3b2ecd50baa5',
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
            visibilityRule: {
                conditions: [
                    {
                        rowIndex: '2329aa7a-2605-400b-b066-a773bd8633f6',
                        leftHandSide: 'b3226572-8133-4f57-a49e-b9863ea7da7b.value',
                        rightHandSide: '50',
                        rightHandSideDataType: 'Number',
                        operator: 'GreaterThanOrEqualTo'
                    }
                ],
                conditionLogic: 'and'
            },
            fields: [],
            singleOrMultiSelect: 'SingleSelect',
            childReferences: []
        },
        '5114b9f1-31d0-4d80-a988-50fa057294c1': {
            guid: '5114b9f1-31d0-4d80-a988-50fa057294c1',
            name: 'ScreenWithSection_Section2_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '5a519501-1819-4874-a19d-3f964a138b2b',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '12a6ba74-604b-4f52-b6ea-56a3eece9919',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: '337b5789-e021-4e7b-ab5d-582c80803cca'
                },
                {
                    childReference: '23a963ec-f168-4151-804b-9541689dc879'
                }
            ]
        },
        'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814': {
            guid: 'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814',
            name: 'ScreenWithSection_Section2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '66372d1b-81f8-4269-b7f8-80f1723485ca',
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
                    childReference: '0d5c72c9-56a2-49e9-81cf-d0552a8d968c'
                },
                {
                    childReference: '5114b9f1-31d0-4d80-a988-50fa057294c1'
                }
            ]
        },
        'd08b12f4-ac7b-4cb4-a3ff-621131fc450f': {
            guid: 'd08b12f4-ac7b-4cb4-a3ff-621131fc450f',
            name: 'address_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '83d39edd-dc5c-43e8-b58b-999c0c6efcbc',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '1ac79856-9d88-4a1f-b51b-099537bd458c': {
            guid: '1ac79856-9d88-4a1f-b51b-099537bd458c',
            name: 'screenWithSectionAndLightningComp',
            description: '',
            label: 'screenWithSectionAndLightningComp',
            locationX: 954,
            locationY: 633,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
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
                    childReference: '497e601c-a901-4061-86c7-0852b1c9dd33'
                },
                {
                    childReference: '8eff1e35-f996-490c-b2f1-f981186f4092'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '497e601c-a901-4061-86c7-0852b1c9dd33': {
            guid: '497e601c-a901-4061-86c7-0852b1c9dd33',
            name: 'someText',
            choiceReferences: [],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: 'b1ccd7d0-6210-4c95-a3c8-1e01ef242a3f',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'InputField',
            fieldText: 'someText',
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
        '8712ca46-d9c0-49ba-9641-bd15e2d1dcbe': {
            guid: '8712ca46-d9c0-49ba-9641-bd15e2d1dcbe',
            name: 'screenCompInSectionColumnWithSingleSObjectAutoOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '5bea7404-f581-4e0a-8ff3-701b3bfa7e5c',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '44c3a9ec-e8ee-43ce-9f4e-71048c744dfb': {
            guid: '44c3a9ec-e8ee-43ce-9f4e-71048c744dfb',
            name: 'screenWithSectionAndLightningComp_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '1562fcaa-21e3-4ab7-9950-bd34c7c5c444',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '51dd4b43-d68c-4aee-a601-12c30e7c926f',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: '8712ca46-d9c0-49ba-9641-bd15e2d1dcbe'
                }
            ]
        },
        '4297d5ea-aed3-421e-a33b-e988e84d10ac': {
            guid: '4297d5ea-aed3-421e-a33b-e988e84d10ac',
            name: 'screenCompInSectionColumnWithSObjectCollAutoOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '4bd9ced3-d8dc-454b-9c6a-07e747528517',
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            dynamicTypeMappings: [],
            storeOutputAutomatically: true,
            childReferences: []
        },
        '1181502b-7460-4f6a-b7ef-6e4851d39430': {
            guid: '1181502b-7460-4f6a-b7ef-6e4851d39430',
            name: 'screenWithSectionAndLightningComp_Section1_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'bb8b3e41-169b-442e-83e3-240cd49b7032',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '073edaa5-eb09-4bc8-9f20-43c320d56d18',
                    name: 'width',
                    value: '6',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
                    childReference: '4297d5ea-aed3-421e-a33b-e988e84d10ac'
                }
            ]
        },
        '8eff1e35-f996-490c-b2f1-f981186f4092': {
            guid: '8eff1e35-f996-490c-b2f1-f981186f4092',
            name: 'screenWithSectionAndLightningComp_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'e2a97477-cbab-4d4f-9f9f-f5c57cc6500f',
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
                    childReference: '44c3a9ec-e8ee-43ce-9f4e-71048c744dfb'
                },
                {
                    childReference: '1181502b-7460-4f6a-b7ef-6e4851d39430'
                }
            ]
        },
        '4b0617d9-3abe-42ab-8ed4-ab1e5944d884': {
            guid: '4b0617d9-3abe-42ab-8ed4-ab1e5944d884',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '852e1dd4-eb4e-48a7-8319-977137281a8d': {
            guid: '852e1dd4-eb4e-48a7-8319-977137281a8d',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '329f0584-f250-4be0-a094-4060ca2ca6f3',
            isShowInputSelected: false,
            isValidateSelected: false
        },
        'babb725d-f89c-45e7-bf59-453c06cbfff1': {
            guid: 'babb725d-f89c-45e7-bf59-453c06cbfff1',
            name: 'other',
            description: '',
            elementType: 'Choice',
            dataType: 'String',
            choiceText: 'Other',
            storedValue: 'other',
            storedValueDataType: 'String',
            storedValueIndex: '35467ed7-75b9-4c62-b04a-6a0df25679a5',
            isShowInputSelected: true,
            isValidateSelected: false,
            userInput: {
                isRequired: false,
                promptText: 'Please specify'
            }
        },
        '452ba7ae-00a1-46ea-a315-a63aa41d1b32': {
            guid: '452ba7ae-00a1-46ea-a315-a63aa41d1b32',
            name: 'recordChoiceSet',
            description: '',
            limit: '5',
            displayField: 'Name',
            valueField: 'Name',
            dataType: 'String',
            sortOrder: 'Asc',
            elementType: 'DynamicChoice',
            object: 'Account',
            objectIndex: '5e35bc6f-e544-486e-b90b-81e885e849c8',
            sortField: 'AccountSource',
            filterLogic: 'or',
            filters: [
                {
                    rowIndex: '4bdae41a-fbb6-487f-9507-275c854fbc3c',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'e46d1655-6558-4c7b-b828-b040906115b0.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '926b62ad-1eae-4dea-972c-40fa752c46e4',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.BillingCountry',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'ded1ecdb-e998-4c3b-a729-344d44e9c3d4',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'e46d1655-6558-4c7b-b828-b040906115b0.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Contains'
                }
            ],
            outputAssignments: [
                {
                    rowIndex: 'c9474ff0-3abd-469e-8923-91825f843f9f',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '4197d875-e006-4afc-844f-753d75b8c4d1'
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
        '2e01b9c4-5144-4db2-9543-7899c5c34329',
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
        'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
        '2f00ca0d-743f-4639-a084-272bbc548f8b',
        'a18b3d06-504c-4e47-9f44-6663c42703cf',
        '5383bf9b-8314-42bd-a51e-cbee56ec3570',
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
        'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
        'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
        '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
        '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
        '69030d84-1e7f-49c3-ad89-ddc4db69050a',
        '6e77e9cf-2492-44ca-a088-ee4b8159d478',
        '40c11213-36c0-451e-a5aa-8790aee02559',
        'ade42d1f-d120-4ff9-9888-c202b289571c',
        'a733e74b-1a25-43dc-b43c-d126c849023d',
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
        '5abbcb4e-faba-4750-91f2-46c9509713ea',
        '49bf649f-45c0-4d54-8533-93b51f9b557e',
        '875f212c-ce7a-482e-900a-5a11b9e83a62',
        '63212bdb-c6a5-4e99-85cf-9921d6fc834b',
        '2a67f70a-85a0-4423-b788-60a8e66dd245',
        '291464ff-dda0-4384-a6b0-1cee49e14879',
        '232488b7-0f88-4cfc-88c4-0d5f4b2a4373',
        '10a13e6e-f0be-4491-8148-7dc7bcfc3ded',
        'e8244d51-bc66-4700-831a-9bfeb05fc5a7',
        '9d9cf957-471a-49d1-bf9c-6d93f9edd2ab',
        '039af026-5477-46fa-87ab-09bf0f1e57a3',
        'e46d1655-6558-4c7b-b828-b040906115b0',
        '130d845a-9aeb-42e7-acbc-cdea13693b85',
        'af2f244a-5bc6-4c40-b630-3d597ba1cbdc',
        '79d6481a-0bc2-4248-9e0b-19c4c632280b',
        '5a7f1472-d64c-4b45-adde-b52b93262693',
        '98a764f1-b847-44c2-b27c-b1d15f4857ca',
        '18bab1b9-dd42-4e70-acd9-b4a37b979156',
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
        '0e7a1251-a491-43d2-8828-b61652438009',
        '6f3f842a-e289-48ee-b18b-6820e87cee94',
        '4899e1df-446e-4158-a942-9b376323c325',
        '344d842e-e73f-4ea4-96ea-2ddaff5152f9',
        'c3c5d29f-b56c-48b8-a249-9765017a7d37',
        '19362806-09c5-46a5-b274-bebe980379cf',
        '9cd671ee-af98-49b1-b58f-5e022bc554a4',
        'c7bb47cd-f402-49d5-963b-681d7987ff13',
        '13eb88dc-26bf-40d3-b2b1-f9f61326d119',
        'e8074486-47d5-4c8a-8d2b-e331bbddce46',
        'aa87e8e6-9d87-40f8-9b92-a859533f7143',
        '1fa12c04-abe3-44d7-87d2-132178cb5c70',
        '2685a4c3-eb23-434b-bc14-c57ca6ab70ce',
        '247e0c32-5050-4a90-977f-f33c989ad9f9',
        'b0d41663-ba7b-4020-8f88-6c83151e3a83',
        '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
        'e12fdd35-1aeb-4465-b52c-73a201e704a7',
        '5a93c395-dd94-498e-9383-50caf96c6748',
        '1ce942af-1f5f-421c-b55b-07edf0fb0401',
        '1ac79856-9d88-4a1f-b51b-099537bd458c'
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
        status: 'InvalidDraft',
        versionNumber: 1,
        apiVersion: 50,
        isAutoLayoutCanvas: false
    }
};
