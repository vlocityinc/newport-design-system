// To update flowWithAllElementsUIModel from flowWithAllElements, run flowTranslator.test.js and follow instructions
export const flowWithAllElementsUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 59,
            locationY: 51,
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
            availableConnections: [
                {
                    type: 'REGULAR'
                }
            ],
            shouldSupportScheduledPaths: false
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
            actionType: 'apex',
            actionName: 'AllTypesApexAction',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '4968239c-5e3d-45ee-9339-f575c917e223',
                    name: 'accountParam',
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
                    name: 'idParam',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
                    name: 'numberParam',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '04e1c283-fc0b-4928-a495-89d956368769',
                    name: 'stringParam',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputParameters: [
                {
                    rowIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
                    name: 'outputNumberParam',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
                    name: 'outputStringParam',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
            actionType: 'apex',
            actionName: 'generateDraftAccount',
            dataTypeMappings: [],
            inputParameters: [],
            outputParameters: [
                {
                    rowIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
                    name: 'generatedAccount',
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
            actionType: 'quickAction',
            actionName: 'Case.LogACall',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
                    name: 'contextId',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
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
            canHaveFaultConnector: true,
            actionType: 'emailAlert',
            actionName: 'Account.my_email_alert',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '956ee0bf-ff21-44f4-9917-65676160e094',
                    name: 'SObjectRowId',
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.Id',
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
            canHaveFaultConnector: true,
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
            canHaveFaultConnector: true,
            actionType: 'submit',
            actionName: 'submit',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
                    name: 'nextApproverIds',
                    value: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
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
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
                    leftHandSide: '865e456d-2e1d-410f-8c62-8f686238b197.AccountNumber',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.AccountNumber',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
                    leftHandSide: '865e456d-2e1d-410f-8c62-8f686238b197',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
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
            canHaveFaultConnector: false,
            assignmentItems: [
                {
                    rowIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
                    leftHandSide: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    rightHandSide: 'f317c423-f755-4d64-bd4a-e218107b57db',
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
            locationY: 471,
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
                    leftHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
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
            canHaveFaultConnector: false,
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
                    leftHandSide: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9': {
            guid: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            name: 'decisionWithOneOutcomeWithTwoConditions',
            description: '',
            label: 'decisionWithOneOutcomeWithTwoConditions',
            locationX: 568,
            locationY: 789,
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
                    childReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '3f70f36b-030f-4b90-ba09-866642ba5d4b'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '3f70f36b-030f-4b90-ba09-866642ba5d4b': {
            guid: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            name: 'outcomeWithTwoConditions',
            label: 'outcomeWithTwoConditions',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87',
                    leftHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2',
                    leftHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSideDataType: 'reference',
                    operator: 'NotEqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929': {
            guid: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            name: 'decisionWithTwoOutComes',
            description: '',
            label: 'decisionWithTwoOutComes',
            locationX: 426,
            locationY: 799,
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
                    childReference: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
                },
                {
                    childReference: 'eb19f518-e185-488c-a5b2-9107036766f4'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 3,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
                },
                {
                    type: 'REGULAR',
                    childReference: 'eb19f518-e185-488c-a5b2-9107036766f4'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40': {
            guid: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            name: 'firstOutcome',
            label: 'firstOutcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '3147a31d-26a3-408c-b00b-a31983df0da5',
                    leftHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
            name: 'secondOutome',
            label: 'secondOutome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
                    leftHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSide: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '34eaa6ff-765e-4c12-8635-b00f6c7f2c34': {
            guid: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!48cb0159-3cde-48ad-9877-644e3cc4b5e9.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 0,
            elementType: 'Formula'
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
            name: 'Account',
            description: 'Variable with same name as record Object',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7'
        },
        '9b2579d0-01d3-45b0-b6b2-bb016b085511': {
            guid: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '56095468-2459-481d-b084-04a05babcb22',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9'
        },
        '48cb0159-3cde-48ad-9877-644e3cc4b5e9': {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10'
        },
        'e5b4998c-a36e-407f-afb7-2301eda53b8d': {
            guid: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c'
        },
        '54aae715-8881-4a52-b7a9-25c385d1488e': {
            guid: '54aae715-8881-4a52-b7a9-25c385d1488e',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9'
        },
        '8d53a0e4-6541-42d0-9ea1-665b504fd150': {
            guid: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            name: 'apexComplexTypeTwoVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestTwo216',
            subtypeIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9d11ba05-33c4-4893-87b8-9560be9557d2'
        },
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2': {
            guid: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5e2803c7-a184-465c-92e3-1d29634f2114'
        },
        'd050fa16-f494-4685-a87f-3c68666d1ba8': {
            guid: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104'
        },
        '76bbf8c2-9a5e-4a03-a84f-a518866d7963': {
            guid: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db'
        },
        'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7': {
            guid: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3'
        },
        '1283ede6-414b-45a2-851a-1b113f26bffd': {
            guid: '1283ede6-414b-45a2-851a-1b113f26bffd',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f'
        },
        '37c4575e-32f8-46d9-aeea-737953c256b2': {
            guid: '37c4575e-32f8-46d9-aeea-737953c256b2',
            name: 'booleanVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Boolean',
            subtype: null,
            subtypeIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa'
        },
        '8e3cf25f-1ce2-48c8-9634-b192b94ae230': {
            guid: '8e3cf25f-1ce2-48c8-9634-b192b94ae230',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e502e40a-7dfc-4e71-8a42-c491f86a560a'
        },
        '3d47c47d-df60-4f92-85c8-71982afd9938': {
            guid: '3d47c47d-df60-4f92-85c8-71982afd9938',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782'
        },
        '1f6554e7-ca93-491c-979c-1e2b8fcc563f': {
            guid: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: '0883ba56-46a4-4420-8105-c9d17ad0183b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d'
        },
        '42afe63b-0744-4dec-a7e6-20c67691dd81': {
            guid: '42afe63b-0744-4dec-a7e6-20c67691dd81',
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '02504510-b361-4fb3-878e-81925a76160f',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db'
        },
        '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e': {
            guid: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
            name: 'contractSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contract',
            subtypeIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '41a189ff-01f4-4018-b75c-3f363b65cc42'
        },
        '796969f1-a892-4b16-836e-209180057a2b': {
            guid: '796969f1-a892-4b16-836e-209180057a2b',
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39'
        },
        '38f77648-3c7e-4431-8403-239492238623': {
            guid: '38f77648-3c7e-4431-8403-239492238623',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd66cf236-ca0a-4351-952d-b12df4abdaf8'
        },
        '2e02687e-41a2-42eb-ba74-81c130218b86': {
            guid: '2e02687e-41a2-42eb-ba74-81c130218b86',
            name: 'dateTimeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'DateTime',
            subtype: null,
            subtypeIndex: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '52bc2460-8775-417b-a692-f72725a8f6b0'
        },
        '013c0515-5f96-493f-bf5b-3d261350a4e6': {
            guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '201c3554-f05a-4fff-8482-1495f16e2f8b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cf176378-9ab0-436f-a161-079057c789f4'
        },
        '27cfbe21-2aa1-4503-aa13-3677c687153d': {
            guid: '27cfbe21-2aa1-4503-aa13-3677c687153d',
            name: 'doNotUseThisVar',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '583e40d5-e735-4d8c-8f30-097d48de7ec8',
            scale: 0,
            defaultValue: 'doNotUseThisVariable',
            defaultValueDataType: 'String',
            defaultValueIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1'
        },
        '58d4a602-1abb-46e4-8c10-54c225dd56af': {
            guid: '58d4a602-1abb-46e4-8c10-54c225dd56af',
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635'
        },
        'd385d33b-7ce5-4c7a-a867-690dfb63ea97': {
            guid: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
            name: 'numberCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '048203c3-6751-4189-b9ab-939f0ef6d7d3'
        },
        'f317c423-f755-4d64-bd4a-e218107b57db': {
            guid: 'f317c423-f755-4d64-bd4a-e218107b57db',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: '794b3296-5246-473a-b618-584b8956809c',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1669c1f5-9872-461f-a826-b4fa64d902dd'
        },
        '9c51615d-c61a-46f7-b26a-7157f6908b21': {
            guid: '9c51615d-c61a-46f7-b26a-7157f6908b21',
            name: 'objectWithAllPossiblFieldsVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Object_with_all_possible_fields__c',
            subtypeIndex: 'f94a6136-8394-445d-a2f1-1ef06f109cb5',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1a279fff-8bfc-4714-bc0f-2d7a203c6b16'
        },
        '4197d875-e006-4afc-844f-753d75b8c4d1': {
            guid: '4197d875-e006-4afc-844f-753d75b8c4d1',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '0c77e4b9-7c32-4ce0-862d-ab58bb5b7553',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8f88fc57-1b46-4e64-8821-bd1e1bcc6de6'
        },
        '20719b7b-1961-4eda-a3f3-b42d939e604a': {
            guid: '20719b7b-1961-4eda-a3f3-b42d939e604a',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fff17adf-4565-4360-91b9-64f7fd54a9d7'
        },
        '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0': {
            guid: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ed78dc90-dad8-4f67-b39a-59d06fa41665',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1875750b-574e-40d4-adff-7aa4f06fc0fe'
        },
        '8ca8f838-4af4-4ae6-89fd-abdcc075a85e': {
            guid: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
            name: 'stringCollectionVariable2',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '5abbcb4e-faba-4750-91f2-46c9509713ea',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'a709dfe7-af21-4c63-a373-38ee99bcbf73'
        },
        '97ff27bc-bc3f-49cd-b600-abec79e81e50': {
            guid: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'ac66cdf6-9167-4628-8faa-079f39e2e32b'
        },
        '9fa9376a-5212-49a1-980b-ddca1dd82388': {
            guid: '9fa9376a-5212-49a1-980b-ddca1dd82388',
            name: 'vAccountId',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'b3ab254b-af11-4c5e-b0c5-949f27d4bccb',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '26774e1d-4c9f-45f1-a426-89bad7c78eef'
        },
        '777c097c-f3b9-4845-9418-b50d40eb2550': {
            guid: '777c097c-f3b9-4845-9418-b50d40eb2550',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '16a960f8-b2e1-4481-aac8-cf744c4bf266',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f6526a3c-c24b-49e8-a910-d99a8c8342b5'
        },
        '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14': {
            guid: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
            name: 'varForDecisionEditorTest',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'e7dfb0f5-be90-4dcd-9841-da7bd989dee5',
            scale: 0,
            defaultValue: 'varForDecisionEditorTest',
            defaultValueDataType: 'String',
            defaultValueIndex: '1b13e911-67d9-409a-abee-fc6663dd4108'
        },
        'b689132a-b516-47d0-9e51-03ea751c7cc9': {
            guid: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '2ca03260-0885-4ffb-bb88-cf862f5d2cb4'
        },
        '5041d41a-0822-4ddc-9685-8a09b840bb0d': {
            guid: '5041d41a-0822-4ddc-9685-8a09b840bb0d',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!97ff27bc-bc3f-49cd-b600-abec79e81e50}</p>',
            dataType: 'String',
            isViewedAsPlainText: false
        },
        'de8efb2a-4b75-4a44-a3c9-3a78018a2207': {
            guid: 'de8efb2a-4b75-4a44-a3c9-3a78018a2207',
            name: 'textTemplate2',
            description: '',
            elementType: 'TextTemplate',
            text: 'This text template is in plain text mode.',
            dataType: 'String',
            isViewedAsPlainText: true
        },
        'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c': {
            guid: 'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c',
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
            canHaveFaultConnector: false,
            flowName: 'flowWithAllTypesVariables',
            inputAssignments: [
                {
                    rowIndex: 'c7027d6d-66ae-440f-b340-0c652eaebe79',
                    name: 'inputOutputAccountColVar',
                    value: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '0d02ed31-ffad-42ba-967f-5ebbbdb83dd5',
                    name: 'inputOutputAccountVar',
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '553332e6-c579-49e7-8757-8044dd8b530f',
                    name: 'inputOutputBoolVar',
                    value: '37c4575e-32f8-46d9-aeea-737953c256b2',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '9f2723ee-84ae-473a-b265-ebee9afa6697',
                    name: 'inputOutputCurrencyVar',
                    value: '796969f1-a892-4b16-836e-209180057a2b',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'd6542367-8e40-4576-95aa-3baa12d98ac7',
                    name: 'inputOutputDateTimeVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '76a209b0-66ab-4a14-ad73-56b02b937714',
                    name: 'inputOutputDateVar',
                    value: '013c0515-5f96-493f-bf5b-3d261350a4e6',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '3ce2bd36-67b8-4bc3-b144-1ba05ee7dafe',
                    name: 'inputOutputNumberVar',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '49bf649f-45c0-4d54-8533-93b51f9b557e',
                    name: 'inputOutputNumberVar',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '37cfa784-b1db-4323-8baa-51d1da0c010f',
                    name: 'inputOutputStringVar',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '5889818c-cb99-4524-a6fb-79c576f21d26',
                    name: 'inputNotAvailableParam',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            outputAssignments: [
                {
                    rowIndex: '7b9fc3ec-7a4b-4382-bd6b-b72405aece1f',
                    name: 'inputOutputAccountColVar',
                    value: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '80b66606-d59f-4c14-a74e-c98a050c84bc',
                    name: 'inputOutputAccountVar',
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '63212bdb-c6a5-4e99-85cf-9921d6fc834b',
                    name: 'inputOutputBoolVar',
                    value: '37c4575e-32f8-46d9-aeea-737953c256b2',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '7b238465-d71b-489c-8223-425066aaf928',
                    name: 'inputOutputCurrencyVar',
                    value: '796969f1-a892-4b16-836e-209180057a2b',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '6f408b05-42aa-4ee2-8bbc-7756dcf10eac',
                    name: 'inputOutputDateTimeVar',
                    value: '2e02687e-41a2-42eb-ba74-81c130218b86',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'aef5864b-0e6b-4c61-9fe8-a2db15831cd6',
                    name: 'inputOutputDateVar',
                    value: '013c0515-5f96-493f-bf5b-3d261350a4e6',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '46a0552e-a492-4f1a-8870-500c1a3feea3',
                    name: 'inputOutputNumberVar',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '807ef621-63b9-43a5-abf0-4c3b81726be3',
                    name: 'inputOutputNumberVar',
                    value: 'f317c423-f755-4d64-bd4a-e218107b57db',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '2a67f70a-85a0-4423-b788-60a8e66dd245',
                    name: 'inputOutputStringColVar',
                    value: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '42992316-8b74-4ffc-a6af-a48845db0e95',
                    name: 'inputOutputStringVar',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '876ef3ea-e716-462e-af8d-aa632dbfc72e',
                    name: 'latestOutputStringColVar',
                    value: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '8d846e45-cc1d-4e65-b9c5-35c5436a3252',
                    name: 'latestOutputStringVar',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '79801a91-e263-46a7-9e2a-83a6e156dda0',
                    name: 'outputNotAvailableParam',
                    value: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            ],
            maxConnections: 1,
            elementType: 'Subflow',
            storeOutputAutomatically: false
        },
        'aa2ec166-4d80-47f5-8492-ec14cbf5003e': {
            guid: 'aa2ec166-4d80-47f5-8492-ec14cbf5003e',
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
            canHaveFaultConnector: false,
            flowName: 'flowWithActiveAndLatest',
            inputAssignments: [
                {
                    rowIndex: '90eda190-3bb2-4db1-92c4-d0c1b52d26b1',
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
        'a4aa233d-13fb-431d-afb2-7f2388ca6010': {
            guid: 'a4aa233d-13fb-431d-afb2-7f2388ca6010',
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
            canHaveFaultConnector: true,
            object: '',
            objectIndex: '11a2e3b4-ce6e-4642-9530-17c47cbcc909',
            getFirstRecordOnly: false,
            inputReference: '8d53a0e4-6541-42d0-9ea1-665b504fd150.testOne.acctListField',
            inputReferenceIndex: '79d6481a-0bc2-4248-9e0b-19c4c632280b',
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
            assignRecordIdToReferenceIndex: '2f787ad6-32ec-4d66-a34e-a2131ffbee92',
            dataType: 'Boolean'
        },
        'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309': {
            guid: 'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
            name: 'createAccountFromLiteralValues',
            description: '',
            label: 'createAccountFromLiteralValues',
            locationX: 1601,
            locationY: 385,
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
            objectIndex: '7d45ed5b-7cfd-40e1-8028-23a7e1026335',
            inputAssignments: [
                {
                    rowIndex: '494033a5-d654-4f68-9c22-7712eaa87073',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'a value',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '3b362fa9-ea82-47fe-85f4-25406e719a72',
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
            assignRecordIdToReferenceIndex: 'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        'c85e0459-8b6f-4540-99e7-d388a35ee4ba': {
            guid: 'c85e0459-8b6f-4540-99e7-d388a35ee4ba',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '1a934031-6241-4115-9514-61184d4c5b75',
            inputAssignments: [
                {
                    rowIndex: 'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'af83b78a-15c7-4381-b2a8-e254552cfeab',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '336b0818-ff06-47c3-9e85-3b6fe4a10c5b',
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
            assignRecordIdToReference: '777c097c-f3b9-4845-9418-b50d40eb2550',
            assignRecordIdToReferenceIndex: '48d95e2c-7c52-4423-b36a-86c4790064a5',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        'dbfccfa4-49b4-4385-a998-4ac4e9d630aa': {
            guid: 'dbfccfa4-49b4-4385-a998-4ac4e9d630aa',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'ed46d2ed-f940-4fbe-9b66-fba94ae66e70',
            inputAssignments: [
                {
                    rowIndex: '42935e07-8378-4994-9dfe-34d987e80fac',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: 'c9ebe244-887a-4821-811c-f9f17a670037',
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
            assignRecordIdToReferenceIndex: '7f3aa0ed-17d0-4a43-b89a-395d3d6e609d',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        '7b6dd177-4174-48fd-9c2a-59274e1ec3dd': {
            guid: '7b6dd177-4174-48fd-9c2a-59274e1ec3dd',
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
            canHaveFaultConnector: true,
            object: '',
            objectIndex: '18bab1b9-dd42-4e70-acd9-b4a37b979156',
            getFirstRecordOnly: true,
            inputReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            inputReferenceIndex: '34c1a55f-5058-4668-aee3-1d987573638e',
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
            assignRecordIdToReferenceIndex: '6077af99-1c4d-4f4e-a5a1-6ff145d789a6',
            dataType: 'Boolean'
        },
        'aa454085-b38e-45f6-b63b-d15d8579357c': {
            guid: 'aa454085-b38e-45f6-b63b-d15d8579357c',
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
            canHaveFaultConnector: true,
            object: '',
            objectIndex: '3cbaaea5-5255-411e-ba40-724b7b88ab91',
            getFirstRecordOnly: false,
            inputReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            inputReferenceIndex: 'cdf95c21-cb2b-4178-bf7d-a7408432a2a9',
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
            assignRecordIdToReferenceIndex: '38af1059-deb3-4044-8912-d7f91e2cf66d',
            dataType: 'Boolean'
        },
        '6a8d379d-409e-419f-b6b0-e91ab1a73398': {
            guid: '6a8d379d-409e-419f-b6b0-e91ab1a73398',
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
            canHaveFaultConnector: true,
            object: '',
            objectIndex: 'a14520b8-aaca-4c29-a9f7-b1569a9a68fe',
            getFirstRecordOnly: true,
            inputReference: '76bbf8c2-9a5e-4a03-a84f-a518866d7963.account',
            inputReferenceIndex: '344d842e-e73f-4ea4-96ea-2ddaff5152f9',
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
            assignRecordIdToReferenceIndex: 'b8a432c5-c98e-4ccd-b5fe-b399e14090ae',
            dataType: 'Boolean'
        },
        'c3c5d29f-b56c-48b8-a249-9765017a7d37': {
            guid: 'c3c5d29f-b56c-48b8-a249-9765017a7d37',
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
            canHaveFaultConnector: true,
            object: '',
            objectIndex: '99dc6278-41a6-44c2-b316-c76f639232c4',
            getFirstRecordOnly: false,
            inputReference: 'd050fa16-f494-4685-a87f-3c68666d1ba8.accounts',
            inputReferenceIndex: '52736a70-f96b-4c6f-803b-355bff915424',
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
            assignRecordIdToReferenceIndex: '9cd671ee-af98-49b1-b58f-5e022bc554a4',
            dataType: 'Boolean'
        },
        'b5a9adff-b0ce-403c-9016-dc59e7047f6a': {
            guid: 'b5a9adff-b0ce-403c-9016-dc59e7047f6a',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '15fef33a-a826-43bb-9095-7266eebb74b0',
            outputReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2.acct',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '7ad9e640-173f-47e3-a650-3831db508294',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '2f16ad0b-a4ea-4062-833a-bc2250adc79e'
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
            outputReferenceIndex: 'c7bb47cd-f402-49d5-963b-681d7987ff13',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '13eb88dc-26bf-40d3-b2b1-f9f61326d119': {
            guid: '13eb88dc-26bf-40d3-b2b1-f9f61326d119',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '9d2938f4-6dda-4492-b06f-5009cc1e6f3f',
            outputReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2.acctListField',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'e8074486-47d5-4c8a-8d2b-e331bbddce46',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '4712fdfc-e7e0-4ca0-88ab-ad976993a58b'
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
            outputReferenceIndex: '76e934ba-572c-48aa-9c08-848447c2eef8',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'a6604def-64ac-4b18-bd52-cb642444eb2d': {
            guid: 'a6604def-64ac-4b18-bd52-cb642444eb2d',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '960c344c-31bb-41b5-ad56-63ba96f239d8',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '664aa30f-60f2-4b8a-96f0-ad8795bcba07',
                    leftHandSide: 'Account.BillingPostalCode',
                    leftHandSideDataType: 'String',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'fa417651-1251-4c86-8200-30dc2ed6849c'
                },
                {
                    field: 'Name',
                    rowIndex: '5a7f1472-d64c-4b45-adde-b52b93262693'
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
            outputReferenceIndex: 'da79895d-9af9-45c9-b626-fe0fc43f4952',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '7e331ab0-6782-4244-93b3-5bbcdad069e4': {
            guid: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'ee652516-7b62-402f-88a2-1ab887b55072',
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '27851956-e853-43e1-8349-bc22d62aa5a4',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '452941fc-4972-44df-b34d-a821bb32e800',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'NotEqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: 'd59e0052-78b7-4ec0-bf89-27757c00baed'
                },
                {
                    field: 'Name',
                    rowIndex: '474faea1-942d-4f0f-8c81-8429fc131dcf'
                },
                {
                    field: 'CreatedDate',
                    rowIndex: 'e2363ac3-537d-4b28-afac-ae787b18687e'
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
            outputReferenceIndex: '0fa2da7a-22de-4045-ab83-711522e52bb6',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        'bf865980-57a7-4599-a65e-2e37eb0263a4': {
            guid: 'bf865980-57a7-4599-a65e-2e37eb0263a4',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c',
            outputAssignments: [
                {
                    rowIndex: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'Los Angeles'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '162ea6d1-7389-419d-b8c2-133462029981',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
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
            outputReferenceIndex: 'e7f854a4-bb08-4fe7-9528-5f6686e56286',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '1d676afa-a7f0-4eb0-96fb-baa6543ade08': {
            guid: '1d676afa-a7f0-4eb0-96fb-baa6543ade08',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'aa87e8e6-9d87-40f8-9b92-a859533f7143',
            outputReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '45246681-1c9f-4123-8d02-d2fa844e6e79',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '2685a4c3-eb23-434b-bc14-c57ca6ab70ce'
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
            outputReferenceIndex: '96d93d3e-c114-4a50-b092-726601411e37',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        '865e456d-2e1d-410f-8c62-8f686238b197': {
            guid: '865e456d-2e1d-410f-8c62-8f686238b197',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '6f3f842a-e289-48ee-b18b-6820e87cee94',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'f876df5e-ccc8-43a5-921f-4730c6c8052b',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
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
            outputReferenceIndex: '030e4398-87bd-4390-a8fd-a348fcd3b323',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        'a198d5b1-0303-44f8-9d32-59611aba0a07': {
            guid: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'f9efafa3-d83f-41a6-92e8-487eadb228c0',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
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
            outputReferenceIndex: 'c3ba5281-2d20-4596-99d0-94b9368c1d70',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '8ffc4a7e-4528-4782-8ee5-7b5d2ac6f27f': {
            guid: '8ffc4a7e-4528-4782-8ee5-7b5d2ac6f27f',
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
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: 'f5b5d205-8109-4989-bb5a-05678f04ec69',
            outputReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '94b7fffa-2f05-49c9-be3a-4e3b89ea336f',
                    leftHandSide: 'Account.BillingAddress',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '7346a406-b38a-4d38-8c73-988b2c09b304'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '869aee06-20ed-4841-b1b7-51a3691cfb0c'
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
            outputReferenceIndex: 'd44fb666-25db-471b-a28a-d7708dc097e6',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '78207ca6-8bba-401b-a2e8-1c279842b990': {
            guid: '78207ca6-8bba-401b-a2e8-1c279842b990',
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
            canHaveFaultConnector: true,
            inputReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            inputReferenceIndex: 'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59',
            object: '',
            objectIndex: 'd3d400b8-db5e-4704-8b34-3dc777de7ab2',
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
        '026b8ee9-572a-40c0-9442-00e58400855d': {
            guid: '026b8ee9-572a-40c0-9442-00e58400855d',
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
            canHaveFaultConnector: true,
            inputReference: '',
            inputReferenceIndex: '57402670-a93f-4621-a8e4-6045f765731b',
            object: 'Account',
            objectIndex: 'e4b8d861-0407-4edd-8002-1b887499cd44',
            filterLogic: '(1 AND 2) OR 3',
            filters: [
                {
                    rowIndex: '19362806-09c5-46a5-b274-bebe980379cf',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'aca838b1-ea76-436d-a081-732171fdbc11',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
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
        '7ba5860c-9e90-4a76-a600-591f1c42fa54': {
            guid: '7ba5860c-9e90-4a76-a600-591f1c42fa54',
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
            canHaveFaultConnector: true,
            inputReference: '',
            inputReferenceIndex: '975adb96-3950-4767-8f2a-47e2958202f2',
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
                    rowIndex: '1ab5b2e1-0763-4cb4-a106-f1dcf5920728',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.BillingCity',
                    rightHandSideDataType: 'reference'
                },
                {
                    rowIndex: 'c5488001-ae8b-4364-984a-57778117437b',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'salesforce',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: '8994b409-64e9-438f-8532-1c5f0ed172af',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'f4b19fd9-74ef-4f38-aa3b-549f6d105a77',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'USA',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: 'efbed9ce-b23f-43d3-bbe8-f9ddc2234909',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'Salesforce',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: '(1 AND 2) OR 3',
            object: 'Account',
            objectIndex: 'e2de9f05-aae8-4dc3-a061-e5d17e4562e1',
            dataType: 'Boolean',
            wayToFindRecords: 'recordLookup'
        },
        'c046997e-c0ed-4c78-a861-05be31e4d0ac': {
            guid: 'c046997e-c0ed-4c78-a861-05be31e4d0ac',
            name: 'updateRecordSetFieldsIndividually',
            description: '',
            label: 'updateRecordSetFieldsIndividually',
            locationX: 1691,
            locationY: 584,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            inputReference: '',
            inputReferenceIndex: '4e231f09-fd41-4fa3-8f1e-8515f6376c61',
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
                    rowIndex: 'beff1133-9fcb-4002-a540-e0740e0f3633',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'newValue',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: '13071101-a221-4af9-a430-5d6a2e4c7f28',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'value',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: 'and',
            object: 'Account',
            objectIndex: '523f076c-5b60-402f-8617-d93833186fbe',
            dataType: 'Boolean',
            wayToFindRecords: 'recordLookup'
        },
        '1fa12c04-abe3-44d7-87d2-132178cb5c70': {
            guid: '1fa12c04-abe3-44d7-87d2-132178cb5c70',
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
            canHaveFaultConnector: true,
            inputReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            inputReferenceIndex: '0596012b-9bd5-4182-87ce-0e1f231967ef',
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
                    rowIndex: '02209f51-9747-443f-8b81-87d5ee84cfd7',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: ''
                }
            ],
            filters: [
                {
                    rowIndex: 'b6131670-d12f-4df5-9560-2a476767e9e4',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: '9598b9ad-7b8d-4a74-bf1b-32020d902af1',
            dataType: 'Boolean',
            wayToFindRecords: 'sObjectReference'
        },
        'c54f0bd8-c848-49e5-8d98-26755e4209d4': {
            guid: 'c54f0bd8-c848-49e5-8d98-26755e4209d4',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'b7dec202-0dd1-4482-bdd5-def041e8a338',
            collectionReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            collectionReferenceIndex: 'b323d4a2-9e47-4394-915a-a5fd01e2b488',
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
        '0f87ddc3-6c7c-495c-9724-eecb9e8052c4': {
            guid: '0f87ddc3-6c7c-495c-9724-eecb9e8052c4',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '2ac02099-a26f-4091-802a-155b60d4c11b',
            collectionReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
            collectionReferenceIndex: 'eebcfc0b-08a2-4cbc-ac6f-2fa406c3f71e',
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
        'c133671f-83c0-486e-aafc-faed91142185': {
            guid: 'c133671f-83c0-486e-aafc-faed91142185',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            assignNextValueToReferenceIndex: '38e03c17-22d6-403f-91bf-6d9bd0caa696',
            collectionReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2.acctListField',
            collectionReferenceIndex: '64576cb6-0939-475e-8e1b-76feee5be4be',
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
        'e958aa23-0684-4b37-b545-265713075671': {
            guid: 'e958aa23-0684-4b37-b545-265713075671',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'dec3627d-e116-43d9-902e-91068f18e81f',
            collectionReference: '2e01b9c4-5144-4db2-9543-7899c5c34329.apexWithSObject.acctListField',
            collectionReferenceIndex: 'b38a3bfa-a6b4-4cf2-a2a7-ec0d97553b1e',
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
        '6a668fab-9307-456a-946b-d99571178895': {
            guid: '6a668fab-9307-456a-946b-d99571178895',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '70ab3d3a-2830-41af-b238-804b594fb793',
            collectionReference: '8d53a0e4-6541-42d0-9ea1-665b504fd150.testOne.acctListField',
            collectionReferenceIndex: '86256acb-fec6-4c46-9725-46a5e4e7c5de',
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
        '41627c6c-feab-458a-b712-f3a70c81f494': {
            guid: '41627c6c-feab-458a-b712-f3a70c81f494',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'a7343a33-0dc2-49db-8bd0-c5191a05d12f',
            collectionReference: 'e8244d51-bc66-4700-831a-9bfeb05fc5a7.accounts',
            collectionReferenceIndex: '72749ca0-aefe-41c8-8fde-9be984951d21',
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
        '91cf9111-78af-4908-954c-40bc5db171b7': {
            guid: '91cf9111-78af-4908-954c-40bc5db171b7',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'beeca777-ad6b-493d-b368-cba672b07094',
            collectionReference: '0dfdcc2f-0bb7-4357-80ed-337890bd89e6.accounts',
            collectionReferenceIndex: '4c189336-3181-448f-91a2-71dc72a8f0cf',
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
        '20fab551-8b0c-43b7-878f-cb26c9379324': {
            guid: '20fab551-8b0c-43b7-878f-cb26c9379324',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '80feb07b-8923-4f75-85bc-fa131f7f6361',
            collectionReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2.acctListField',
            collectionReferenceIndex: '58855a54-1b3f-4468-af97-2403978da0b4',
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
        '4be9885e-987b-4fab-b204-58dd28d0829c': {
            guid: '4be9885e-987b-4fab-b204-58dd28d0829c',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
            assignNextValueToReferenceIndex: '0d21d5a2-6e85-4023-8e2b-846d05bfb367',
            collectionReference: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
            collectionReferenceIndex: 'e12fdd35-1aeb-4465-b52c-73a201e704a7',
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
        '3a479ed2-0003-46e5-95f4-7094b96e5a16': {
            guid: '3a479ed2-0003-46e5-95f4-7094b96e5a16',
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
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '7bc37e68-414c-42cd-9d5b-b5a9b5876a35',
            collectionReference: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
            collectionReferenceIndex: '9b0882a6-16c9-44c6-b07c-e3d6facb537c',
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
        '09238073-9b8a-4280-9f23-e44be298f4b0': {
            guid: '09238073-9b8a-4280-9f23-e44be298f4b0',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'df134372-8b3c-4bbd-875a-7513e76bec39'
                },
                {
                    childReference: '363280ef-e5f4-414b-9988-1200b330e5cb'
                },
                {
                    childReference: 'db83d1da-0f30-4796-8075-843918cf6c01'
                },
                {
                    childReference: '9aba628e-835b-448a-ac6b-a3764ac735b4'
                },
                {
                    childReference: '0dfdcc2f-0bb7-4357-80ed-337890bd89e6'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'df134372-8b3c-4bbd-875a-7513e76bec39': {
            guid: 'df134372-8b3c-4bbd-875a-7513e76bec39',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
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
                    rowIndex: 'd5a45e74-78b4-41c3-844d-b0536f90c54b',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '2e27b2ec-9bb9-493d-9151-d9022471680f',
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
        '363280ef-e5f4-414b-9988-1200b330e5cb': {
            guid: '363280ef-e5f4-414b-9988-1200b330e5cb',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe',
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
                    rowIndex: '9abf51ab-a289-45b0-853c-040be0ed9eb7',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: '5a93c395-dd94-498e-9383-50caf96c6748',
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
        'db83d1da-0f30-4796-8075-843918cf6c01': {
            guid: 'db83d1da-0f30-4796-8075-843918cf6c01',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'ec3a2e92-54b4-4cc1-aa0b-2026ce47d2ff',
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
        '9aba628e-835b-448a-ac6b-a3764ac735b4': {
            guid: '9aba628e-835b-448a-ac6b-a3764ac735b4',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '016e92d2-b409-4a9d-89c0-50e637967cbc',
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
        '0dfdcc2f-0bb7-4357-80ed-337890bd89e6': {
            guid: '0dfdcc2f-0bb7-4357-80ed-337890bd89e6',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '0918a8eb-38a1-4294-b329-39aa5b0bbd13',
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
        '91280889-13e2-4de0-8390-32d05b8918e5': {
            guid: '91280889-13e2-4de0-8390-32d05b8918e5',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8': {
            guid: '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8',
            name: 'displayTextUsingResources',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '91f8d923-79e4-4a85-9621-3334fac4abe5',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'DisplayText',
            fieldText:
                '<p>address : {!ded1ecdb-e998-4c3b-a729-344d44e9c3d4.street}</p><p>email : {!babb725d-f89c-45e7-bf59-453c06cbfff1.value}</p>',
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
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da': {
            guid: '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c': {
            guid: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '9b6b8f63-fff0-477e-92b7-3e315551288b',
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
        'd6ff3600-dcdb-404b-8a8b-8a90226a575b': {
            guid: 'd6ff3600-dcdb-404b-8a8b-8a90226a575b',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'a5b1853e-6b7e-4568-9b24-37414be4b4d7'
                },
                {
                    childReference: '13cd8d8c-6bf4-4f50-95bb-32adde864b80'
                },
                {
                    childReference: '8f54aa39-0bda-422e-a4ad-3e2ac0155234'
                },
                {
                    childReference: '1ce942af-1f5f-421c-b55b-07edf0fb0401'
                },
                {
                    childReference: 'b1594536-54c8-4f1d-96fc-ebfd501ca433'
                },
                {
                    childReference: '9dfb762b-b721-4ac5-b787-edcdd6f02574'
                },
                {
                    childReference: 'f4b58a0a-045d-49d4-b1c7-888e895a4484'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'a5b1853e-6b7e-4568-9b24-37414be4b4d7': {
            guid: 'a5b1853e-6b7e-4568-9b24-37414be4b4d7',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '90845b6c-c12e-4689-adaf-19d8127d9f99',
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
                conditions: [
                    {
                        rowIndex: '888dc04a-b0c7-49af-804a-8af6951151a0',
                        leftHandSide: '1ac79856-9d88-4a1f-b51b-099537bd458c.value',
                        rightHandSide: '50',
                        rightHandSideDataType: 'Number',
                        operator: 'GreaterThanOrEqualTo'
                    }
                ],
                conditionLogic: 'and'
            },
            fields: [],
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.Name',
            childReferences: []
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.NumberOfEmployees',
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
            objectFieldReference: '865e456d-2e1d-410f-8c62-8f686238b197.Name',
            childReferences: []
        },
        '1ce942af-1f5f-421c-b55b-07edf0fb0401': {
            guid: '1ce942af-1f5f-421c-b55b-07edf0fb0401',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'bf86df65-a565-4f4c-9a88-3785f2785230',
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.Description',
            childReferences: []
        },
        'b1594536-54c8-4f1d-96fc-ebfd501ca433': {
            guid: 'b1594536-54c8-4f1d-96fc-ebfd501ca433',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '1936abb6-dc8c-4180-a4dd-7172ba4841df',
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
            objectFieldReference: '9c51615d-c61a-46f7-b26a-7157f6908b21.Text_Field__c',
            childReferences: []
        },
        '9dfb762b-b721-4ac5-b787-edcdd6f02574': {
            guid: '9dfb762b-b721-4ac5-b787-edcdd6f02574',
            name: 'numberScreenField1',
            choiceReferences: [],
            dataType: 'Number',
            defaultValue: '',
            defaultValueIndex: '1a024e7c-0ada-4ab4-8211-9e3b1a4e9836',
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
        'f4b58a0a-045d-49d4-b1c7-888e895a4484': {
            guid: 'f4b58a0a-045d-49d4-b1c7-888e895a4484',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'b3226572-8133-4f57-a49e-b9863ea7da7b',
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
            objectFieldReference: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e.ActivatedDate',
            childReferences: []
        },
        'c0582ee6-8e57-4803-a24a-55004897c2c5': {
            guid: 'c0582ee6-8e57-4803-a24a-55004897c2c5',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'c11af199-2852-4caa-b90c-7c763d1480d4'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '0d5c72c9-56a2-49e9-81cf-d0552a8d968c': {
            guid: '0d5c72c9-56a2-49e9-81cf-d0552a8d968c',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '5e649f27-18a2-47ae-abad-c0f33d2e2a1b',
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.Name',
            childReferences: []
        },
        '4683e0c5-8dd8-4426-88dc-d280167ca0e4': {
            guid: '4683e0c5-8dd8-4426-88dc-d280167ca0e4',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '1f5acf67-1b31-46ba-b0a5-42c9c27510f7',
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.NumberOfEmployees',
            childReferences: []
        },
        'a084e300-bca6-4e92-b8c8-9b2490b3cc5c': {
            guid: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'ddd9900e-25a1-4ef5-825f-bde05b6231ae',
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
            objectFieldReference: '9c51615d-c61a-46f7-b26a-7157f6908b21.Text_Field__c',
            childReferences: []
        },
        'fa63fff1-36e9-4574-9586-72f3ef2b334d': {
            guid: 'fa63fff1-36e9-4574-9586-72f3ef2b334d',
            name: 'screenWithAutomaticFieldsInSection_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'd6b5b39e-c834-4449-9ade-38629b8676d9',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '66372d1b-81f8-4269-b7f8-80f1723485ca',
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
                    childReference: '0d5c72c9-56a2-49e9-81cf-d0552a8d968c'
                },
                {
                    childReference: '4683e0c5-8dd8-4426-88dc-d280167ca0e4'
                },
                {
                    childReference: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c'
                }
            ]
        },
        '34c2635d-312f-482e-8354-6074fccf7fa8': {
            guid: '34c2635d-312f-482e-8354-6074fccf7fa8',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '12a6ba74-604b-4f52-b6ea-56a3eece9919',
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.SicDesc',
            childReferences: []
        },
        '337b5789-e021-4e7b-ab5d-582c80803cca': {
            guid: '337b5789-e021-4e7b-ab5d-582c80803cca',
            name: '',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'fd6ee2ac-fe05-4c7b-9b70-bc611c531126',
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
            objectFieldReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.Description',
            childReferences: []
        },
        '12adeaa5-22e0-4adf-9cc9-10762c6ac494': {
            guid: '12adeaa5-22e0-4adf-9cc9-10762c6ac494',
            name: 'screenWithAutomaticFieldsInSection_Section1_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '1aeb52b7-9963-431b-a046-e41cfd1f5ef9',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '5a519501-1819-4874-a19d-3f964a138b2b',
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
                    childReference: '34c2635d-312f-482e-8354-6074fccf7fa8'
                },
                {
                    childReference: '337b5789-e021-4e7b-ab5d-582c80803cca'
                }
            ]
        },
        'c11af199-2852-4caa-b90c-7c763d1480d4': {
            guid: 'c11af199-2852-4caa-b90c-7c763d1480d4',
            name: 'screenWithAutomaticFieldsInSection_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '57776352-a679-4bdc-876b-77d987c29fc5',
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
                    childReference: 'fa63fff1-36e9-4574-9586-72f3ef2b334d'
                },
                {
                    childReference: '12adeaa5-22e0-4adf-9cc9-10762c6ac494'
                }
            ]
        },
        '402e3689-0dfb-44a0-8fea-b43c63293cd6': {
            guid: '402e3689-0dfb-44a0-8fea-b43c63293cd6',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'cb2c1f94-a09d-4690-9c2b-1a2f37e16dbb'
                },
                {
                    childReference: 'e2a97477-cbab-4d4f-9f9f-f5c57cc6500f'
                },
                {
                    childReference: '1562fcaa-21e3-4ab7-9950-bd34c7c5c444'
                },
                {
                    childReference: 'ded1ecdb-e998-4c3b-a729-344d44e9c3d4'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '1ac79856-9d88-4a1f-b51b-099537bd458c': {
            guid: '1ac79856-9d88-4a1f-b51b-099537bd458c',
            name: 'slider_1',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '497e601c-a901-4061-86c7-0852b1c9dd33',
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
                    rowIndex: '8eff1e35-f996-490c-b2f1-f981186f4092',
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
        '131babab-443d-4e7f-99dc-3b2ecd50baa5': {
            guid: '131babab-443d-4e7f-99dc-3b2ecd50baa5',
            name: 'ScreenWithSection_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '2329aa7a-2605-400b-b066-a773bd8633f6',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '83d39edd-dc5c-43e8-b58b-999c0c6efcbc',
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
                    childReference: '1ac79856-9d88-4a1f-b51b-099537bd458c'
                }
            ]
        },
        'cb2c1f94-a09d-4690-9c2b-1a2f37e16dbb': {
            guid: 'cb2c1f94-a09d-4690-9c2b-1a2f37e16dbb',
            name: 'ScreenWithSection_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '23a963ec-f168-4151-804b-9541689dc879',
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
                    childReference: '131babab-443d-4e7f-99dc-3b2ecd50baa5'
                }
            ]
        },
        'e2a97477-cbab-4d4f-9f9f-f5c57cc6500f': {
            guid: 'e2a97477-cbab-4d4f-9f9f-f5c57cc6500f',
            name: 'number_2',
            choiceReferences: [],
            dataType: 'Number',
            defaultValue: '',
            defaultValueIndex: '44c3a9ec-e8ee-43ce-9f4e-71048c744dfb',
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
        'bb8b3e41-169b-442e-83e3-240cd49b7032': {
            guid: 'bb8b3e41-169b-442e-83e3-240cd49b7032',
            name: 'text_2',
            choiceReferences: [],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: '7b60da07-b6e5-4fb4-a895-3328fbd7983f',
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
        '073edaa5-eb09-4bc8-9f20-43c320d56d18': {
            guid: '073edaa5-eb09-4bc8-9f20-43c320d56d18',
            name: 'dateTimeInSection',
            choiceReferences: [],
            dataType: 'DateTime',
            defaultValue: '$System.OriginDateTime',
            defaultValueDataType: 'reference',
            defaultValueIndex: '4297d5ea-aed3-421e-a33b-e988e84d10ac',
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
        '51dd4b43-d68c-4aee-a601-12c30e7c926f': {
            guid: '51dd4b43-d68c-4aee-a601-12c30e7c926f',
            name: 'ScreenWithSection_Section2_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '8712ca46-d9c0-49ba-9641-bd15e2d1dcbe',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '1181502b-7460-4f6a-b7ef-6e4851d39430',
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
                    childReference: 'bb8b3e41-169b-442e-83e3-240cd49b7032'
                },
                {
                    childReference: '073edaa5-eb09-4bc8-9f20-43c320d56d18'
                }
            ]
        },
        'babb725d-f89c-45e7-bf59-453c06cbfff1': {
            guid: 'babb725d-f89c-45e7-bf59-453c06cbfff1',
            name: 'email_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '35467ed7-75b9-4c62-b04a-6a0df25679a5',
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
                    rowIndex: '5e35bc6f-e544-486e-b90b-81e885e849c8',
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
        'c9474ff0-3abd-469e-8923-91825f843f9f': {
            guid: 'c9474ff0-3abd-469e-8923-91825f843f9f',
            name: 'accounts',
            choiceReferences: [
                {
                    choiceReference: '8828cb76-9deb-4765-bba0-b3291b1303e6'
                },
                {
                    choiceReference: '3660398c-f1e3-4895-89be-f3cb2ec4e840'
                }
            ],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: '4bdae41a-fbb6-487f-9507-275c854fbc3c',
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
                        rowIndex: '926b62ad-1eae-4dea-972c-40fa752c46e4',
                        leftHandSide: '1ac79856-9d88-4a1f-b51b-099537bd458c.value',
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
        '4bd9ced3-d8dc-454b-9c6a-07e747528517': {
            guid: '4bd9ced3-d8dc-454b-9c6a-07e747528517',
            name: 'ScreenWithSection_Section2_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '4b0617d9-3abe-42ab-8ed4-ab1e5944d884',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '329f0584-f250-4be0-a094-4060ca2ca6f3',
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
                    childReference: 'babb725d-f89c-45e7-bf59-453c06cbfff1'
                },
                {
                    childReference: 'c9474ff0-3abd-469e-8923-91825f843f9f'
                }
            ]
        },
        '1562fcaa-21e3-4ab7-9950-bd34c7c5c444': {
            guid: '1562fcaa-21e3-4ab7-9950-bd34c7c5c444',
            name: 'ScreenWithSection_Section2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'd4fae3cf-4fd2-443f-89d2-9c4f7e72deb4',
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
                    childReference: '51dd4b43-d68c-4aee-a601-12c30e7c926f'
                },
                {
                    childReference: '4bd9ced3-d8dc-454b-9c6a-07e747528517'
                }
            ]
        },
        'ded1ecdb-e998-4c3b-a729-344d44e9c3d4': {
            guid: 'ded1ecdb-e998-4c3b-a729-344d44e9c3d4',
            name: 'address_2',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '875f212c-ce7a-482e-900a-5a11b9e83a62',
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
        'a4523c0d-9291-4c0a-b5ba-1168e4d17d99': {
            guid: 'a4523c0d-9291-4c0a-b5ba-1168e4d17d99',
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
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'c9c2a575-1e1a-4bb4-a78d-0f8c2f56610f'
                },
                {
                    childReference: '291464ff-dda0-4384-a6b0-1cee49e14879'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'c9c2a575-1e1a-4bb4-a78d-0f8c2f56610f': {
            guid: 'c9c2a575-1e1a-4bb4-a78d-0f8c2f56610f',
            name: 'someText',
            choiceReferences: [],
            dataType: 'String',
            defaultValue: '',
            defaultValueIndex: '6fe68205-b480-4ba1-abfd-ce650b968aa8',
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
        'd7127657-00e8-4d96-b56d-3b7126ec9692': {
            guid: 'd7127657-00e8-4d96-b56d-3b7126ec9692',
            name: 'screenCompInSectionColumnWithSingleSObjectAutoOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '4371db38-52ba-4a94-b31b-75848b050e63',
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
        '12fb3b06-c2c3-46a8-99e6-0fd31f08d028': {
            guid: '12fb3b06-c2c3-46a8-99e6-0fd31f08d028',
            name: 'screenWithSectionAndLightningComp_Section1_Column1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '88b31e32-25ee-4d52-83f0-4b9c4b23af08',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '6e2691cf-2d89-4ee4-8c99-b95971c49da0',
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
                    childReference: 'd7127657-00e8-4d96-b56d-3b7126ec9692'
                }
            ]
        },
        'e8244d51-bc66-4700-831a-9bfeb05fc5a7': {
            guid: 'e8244d51-bc66-4700-831a-9bfeb05fc5a7',
            name: 'screenCompInSectionColumnWithSObjectCollAutoOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'd2f9a0fc-fe13-46d4-8916-ff2aafd35cda',
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
        '10a13e6e-f0be-4491-8148-7dc7bcfc3ded': {
            guid: '10a13e6e-f0be-4491-8148-7dc7bcfc3ded',
            name: 'screenWithSectionAndLightningComp_Section1_Column2',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '6bd7fb1e-1f4f-4420-8ad4-0641e859d182',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'Region',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '86488742-59ae-41c6-81c5-df64825d4c6b',
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
                    childReference: 'e8244d51-bc66-4700-831a-9bfeb05fc5a7'
                }
            ]
        },
        '291464ff-dda0-4384-a6b0-1cee49e14879': {
            guid: '291464ff-dda0-4384-a6b0-1cee49e14879',
            name: 'screenWithSectionAndLightningComp_Section1',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '05c643f6-c379-43eb-80e9-ed2b9ea5dac8',
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
                    childReference: '12fb3b06-c2c3-46a8-99e6-0fd31f08d028'
                },
                {
                    childReference: '10a13e6e-f0be-4491-8148-7dc7bcfc3ded'
                }
            ]
        },
        '2c880f0a-391e-4655-8b5c-9f39c0c36a92': {
            guid: '2c880f0a-391e-4655-8b5c-9f39c0c36a92',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '8b35de0b-9d89-4f4e-86d6-96ff4e5d9a5c': {
            guid: '8b35de0b-9d89-4f4e-86d6-96ff4e5d9a5c',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '9d9cf957-471a-49d1-bf9c-6d93f9edd2ab',
            isShowInputSelected: false,
            isValidateSelected: false
        },
        '3660398c-f1e3-4895-89be-f3cb2ec4e840': {
            guid: '3660398c-f1e3-4895-89be-f3cb2ec4e840',
            name: 'other',
            description: '',
            elementType: 'Choice',
            dataType: 'String',
            choiceText: 'Other',
            storedValue: 'other',
            storedValueDataType: 'String',
            storedValueIndex: 'f6fc43a4-837b-48db-801e-da5c8062dd75',
            isShowInputSelected: true,
            isValidateSelected: false,
            userInput: {
                isRequired: false,
                promptText: 'Please specify'
            }
        },
        '8828cb76-9deb-4765-bba0-b3291b1303e6': {
            guid: '8828cb76-9deb-4765-bba0-b3291b1303e6',
            name: 'recordChoiceSet',
            description: '',
            limit: '5',
            displayField: 'Name',
            valueField: 'Name',
            dataType: 'String',
            sortOrder: 'Asc',
            elementType: 'DynamicChoice',
            object: 'Account',
            objectIndex: '8da17fa9-310c-41d0-af09-f9bd81fc0c17',
            sortField: 'AccountSource',
            filterLogic: 'or',
            filters: [
                {
                    rowIndex: 'c0b8d69f-4607-479a-b09c-55b8be96503f',
                    leftHandSide: 'Account.BillingCity',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'a6604def-64ac-4b18-bd52-cb642444eb2d.BillingCity',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '33155916-197a-4b4e-b108-bbdf3aef4e41',
                    leftHandSide: 'Account.BillingCountry',
                    leftHandSideDataType: 'String',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.BillingCountry',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '1c1e6a2c-d292-49f3-ab11-1c6cf365e135',
                    leftHandSide: 'Account.Name',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'a6604def-64ac-4b18-bd52-cb642444eb2d.Name',
                    rightHandSideDataType: 'reference',
                    operator: 'Contains'
                }
            ],
            outputAssignments: [
                {
                    rowIndex: '039af026-5477-46fa-87ab-09bf0f1e57a3',
                    leftHandSide: 'Account.Id',
                    leftHandSideDataType: 'String',
                    rightHandSide: '9fa9376a-5212-49a1-980b-ddca1dd82388'
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
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
        '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
        'dc0f5b41-7ae2-4b45-9258-3a4cbacc745c',
        'aa2ec166-4d80-47f5-8492-ec14cbf5003e',
        'a4aa233d-13fb-431d-afb2-7f2388ca6010',
        'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
        'c85e0459-8b6f-4540-99e7-d388a35ee4ba',
        'dbfccfa4-49b4-4385-a998-4ac4e9d630aa',
        '7b6dd177-4174-48fd-9c2a-59274e1ec3dd',
        'aa454085-b38e-45f6-b63b-d15d8579357c',
        '6a8d379d-409e-419f-b6b0-e91ab1a73398',
        'c3c5d29f-b56c-48b8-a249-9765017a7d37',
        'b5a9adff-b0ce-403c-9016-dc59e7047f6a',
        '13eb88dc-26bf-40d3-b2b1-f9f61326d119',
        'a6604def-64ac-4b18-bd52-cb642444eb2d',
        '7e331ab0-6782-4244-93b3-5bbcdad069e4',
        'bf865980-57a7-4599-a65e-2e37eb0263a4',
        '1d676afa-a7f0-4eb0-96fb-baa6543ade08',
        '865e456d-2e1d-410f-8c62-8f686238b197',
        'a198d5b1-0303-44f8-9d32-59611aba0a07',
        '8ffc4a7e-4528-4782-8ee5-7b5d2ac6f27f',
        '78207ca6-8bba-401b-a2e8-1c279842b990',
        '026b8ee9-572a-40c0-9442-00e58400855d',
        '7ba5860c-9e90-4a76-a600-591f1c42fa54',
        'c046997e-c0ed-4c78-a861-05be31e4d0ac',
        '1fa12c04-abe3-44d7-87d2-132178cb5c70',
        'c54f0bd8-c848-49e5-8d98-26755e4209d4',
        '0f87ddc3-6c7c-495c-9724-eecb9e8052c4',
        'c133671f-83c0-486e-aafc-faed91142185',
        'e958aa23-0684-4b37-b545-265713075671',
        '6a668fab-9307-456a-946b-d99571178895',
        '41627c6c-feab-458a-b712-f3a70c81f494',
        '91cf9111-78af-4908-954c-40bc5db171b7',
        '20fab551-8b0c-43b7-878f-cb26c9379324',
        '4be9885e-987b-4fab-b204-58dd28d0829c',
        '3a479ed2-0003-46e5-95f4-7094b96e5a16',
        '09238073-9b8a-4280-9f23-e44be298f4b0',
        '91280889-13e2-4de0-8390-32d05b8918e5',
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
        'd6ff3600-dcdb-404b-8a8b-8a90226a575b',
        'c0582ee6-8e57-4803-a24a-55004897c2c5',
        '402e3689-0dfb-44a0-8fea-b43c63293cd6',
        'a4523c0d-9291-4c0a-b5ba-1168e4d17d99'
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
        isAutoLayoutCanvas: false,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null
    }
};
