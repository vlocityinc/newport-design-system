// To update flowWithAllElementsUIModel from flowWithAllElements, run flowTranslator.test.js and follow instructions
export const flowWithAllElementsUIModel = {
    elements: {
        'e3034ac1-888c-4595-bd9b-6903c99aa590': {
            guid: 'e3034ac1-888c-4595-bd9b-6903c99aa590',
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
            objectIndex: '3b8a948e-5bf7-4e8b-b340-3f79c7986cf6',
            filters: [
                {
                    rowIndex: 'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ]
        },
        '3b362fa9-ea82-47fe-85f4-25406e719a72': {
            guid: '3b362fa9-ea82-47fe-85f4-25406e719a72',
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
        '7d45ed5b-7cfd-40e1-8028-23a7e1026335': {
            guid: '7d45ed5b-7cfd-40e1-8028-23a7e1026335',
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
                    rowIndex: '494033a5-d654-4f68-9c22-7712eaa87073',
                    name: 'subjectNameOrId',
                    value: 'jsmith@salesforce.com',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '336b0818-ff06-47c3-9e85-3b6fe4a10c5b',
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
        '1a934031-6241-4115-9514-61184d4c5b75': {
            guid: '1a934031-6241-4115-9514-61184d4c5b75',
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
                    rowIndex: 'fda10f1b-f93e-46d5-99f0-e09f9c52c147',
                    name: 'subject',
                    value: 'team',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'dbfccfa4-49b4-4385-a998-4ac4e9d630aa',
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
        'c9ebe244-887a-4821-811c-f9f17a670037': {
            guid: 'c9ebe244-887a-4821-811c-f9f17a670037',
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
                    rowIndex: '7f3aa0ed-17d0-4a43-b89a-395d3d6e609d',
                    name: 'contextId',
                    value: '975adb96-3950-4767-8f2a-47e2958202f2',
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
        '42935e07-8378-4994-9dfe-34d987e80fac': {
            guid: '42935e07-8378-4994-9dfe-34d987e80fac',
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
        '89b82177-0c9a-4fa3-a540-55212f1ea9d9': {
            guid: '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
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
        '4ca8549b-0128-4a7d-91a6-e86a9a6b18ec': {
            guid: '4ca8549b-0128-4a7d-91a6-e86a9a6b18ec',
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
                    rowIndex: '5a93e09a-856a-4540-a62f-239f61d7de50',
                    name: 'SObjectRowId',
                    value: '5a7f1472-d64c-4b45-adde-b52b93262693.Id',
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
        'e46d1655-6558-4c7b-b828-b040906115b0': {
            guid: 'e46d1655-6558-4c7b-b828-b040906115b0',
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
                    rowIndex: '3980ef9a-c9c0-4635-a6af-13682830ba4b',
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
        '8232343e-c77f-4502-9234-793bc5470183': {
            guid: '8232343e-c77f-4502-9234-793bc5470183',
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
                    rowIndex: '2c2b6727-f892-4a27-802c-8414e7f162de',
                    name: 'generatedAccount',
                    value: '5a7f1472-d64c-4b45-adde-b52b93262693',
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
        'fde9b89d-7177-4303-889d-5293eaeb58aa': {
            guid: 'fde9b89d-7177-4303-889d-5293eaeb58aa',
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
        '1219bee3-aea6-4567-b155-e5ddb4a543bd': {
            guid: '1219bee3-aea6-4567-b155-e5ddb4a543bd',
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
        '35837efc-fe6e-4096-8de3-a00443b93527': {
            guid: '35837efc-fe6e-4096-8de3-a00443b93527',
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
        '130d845a-9aeb-42e7-acbc-cdea13693b85': {
            guid: '130d845a-9aeb-42e7-acbc-cdea13693b85',
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
        'ab66a6a8-98df-47cd-9948-1c2390f02139': {
            guid: 'ab66a6a8-98df-47cd-9948-1c2390f02139',
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
                    rowIndex: '30a1ebac-fff2-4a83-b844-7f0a8faf33b9',
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
        '611f9934-04ec-47a9-8a9f-ade6f3b66435': {
            guid: '611f9934-04ec-47a9-8a9f-ade6f3b66435',
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
        '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74': {
            guid: '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74',
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
        'ea5338a4-7109-4d3a-819a-d5e994a18d60': {
            guid: 'ea5338a4-7109-4d3a-819a-d5e994a18d60',
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
        '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37': {
            guid: '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37',
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
                    rowIndex: '4a3a792e-8129-48dd-bfa5-07916dc37180',
                    leftHandSide: '975adb96-3950-4767-8f2a-47e2958202f2',
                    rightHandSide: 'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        '69591af2-800b-499b-af80-25f60583d5f2': {
            guid: '69591af2-800b-499b-af80-25f60583d5f2',
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
                canSelect: true
            },
            assignmentItems: [
                {
                    rowIndex: 'af2f244a-5bc6-4c40-b630-3d597ba1cbdc',
                    leftHandSide: '2aacf35d-91f7-42cc-a668-f0b682615d6b.AccountNumber',
                    rightHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693.AccountNumber',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                },
                {
                    rowIndex: '56c614fb-7f1e-4bb7-9939-ccbaa690b419',
                    leftHandSide: '2aacf35d-91f7-42cc-a668-f0b682615d6b',
                    rightHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693',
                    rightHandSideDataType: 'reference',
                    operator: 'Assign'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'de99983e-4f45-4dbd-b0e1-c38008ec2c44': {
            guid: 'de99983e-4f45-4dbd-b0e1-c38008ec2c44',
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
                    outcomeReference: '596820f5-a4db-43e2-bd41-6880327aca98'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '596820f5-a4db-43e2-bd41-6880327aca98'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '596820f5-a4db-43e2-bd41-6880327aca98': {
            guid: '596820f5-a4db-43e2-bd41-6880327aca98',
            name: 'outcome1',
            label: 'outcome1',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '9b2a7f10-e00e-4965-9d61-c67108ad5c57',
                    leftHandSide: '975adb96-3950-4767-8f2a-47e2958202f2',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ]
        },
        'a6604def-64ac-4b18-bd52-cb642444eb2d': {
            guid: 'a6604def-64ac-4b18-bd52-cb642444eb2d',
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
                    outcomeReference: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72': {
            guid: 'b6f15ed8-1db2-4f19-8a84-ca9ca15cbf72',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'da79895d-9af9-45c9-b626-fe0fc43f4952',
                    leftHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693',
                    rightHandSide: '5a7f1472-d64c-4b45-adde-b52b93262693',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ]
        },
        '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6': {
            guid: '2f8795f3-2c27-42d9-ae84-0a53bbedd3a6',
            name: 'textFormula',
            description: 'a text formula',
            expression: 'IF({!5a7f1472-d64c-4b45-adde-b52b93262693.AnnualRevenue} < 1000000,"Small", "Big")',
            dataType: 'String',
            scale: 2,
            elementType: 'Formula'
        },
        '960c344c-31bb-41b5-ad56-63ba96f239d8': {
            guid: '960c344c-31bb-41b5-ad56-63ba96f239d8',
            name: 'accountSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '664aa30f-60f2-4b8a-96f0-ad8795bcba07',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fa417651-1251-4c86-8200-30dc2ed6849c'
        },
        '5a7f1472-d64c-4b45-adde-b52b93262693': {
            guid: '5a7f1472-d64c-4b45-adde-b52b93262693',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '7e331ab0-6782-4244-93b3-5bbcdad069e4',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ee652516-7b62-402f-88a2-1ab887b55072'
        },
        '0fa2da7a-22de-4045-ab83-711522e52bb6': {
            guid: '0fa2da7a-22de-4045-ab83-711522e52bb6',
            name: 'apexSampleCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: '98a764f1-b847-44c2-b27c-b1d15f4857ca',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '27851956-e853-43e1-8349-bc22d62aa5a4'
        },
        '452941fc-4972-44df-b34d-a821bb32e800': {
            guid: '452941fc-4972-44df-b34d-a821bb32e800',
            name: 'apexSampleVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'MyApexClass',
            subtypeIndex: 'ecbe8d3c-4fed-4cc0-a4f5-15a731f63c71',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd59e0052-78b7-4ec0-bf89-27757c00baed'
        },
        '474faea1-942d-4f0f-8c81-8429fc131dcf': {
            guid: '474faea1-942d-4f0f-8c81-8429fc131dcf',
            name: 'caseSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'e2363ac3-537d-4b28-afac-ae787b18687e',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'bf865980-57a7-4599-a65e-2e37eb0263a4'
        },
        '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c': {
            guid: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c',
            name: 'caseSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Case',
            subtypeIndex: 'e7f854a4-bb08-4fe7-9528-5f6686e56286',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '217c9285-27c0-4130-b6f2-a92ee3b10177'
        },
        '338c0e28-a7d7-44c0-907a-0fd6aef99d83': {
            guid: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
            name: 'contactSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Contact',
            subtypeIndex: '162ea6d1-7389-419d-b8c2-133462029981',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2aa5e67a-9cdb-45da-a597-a0d24c80188c'
        },
        '0e7a1251-a491-43d2-8828-b61652438009': {
            guid: '0e7a1251-a491-43d2-8828-b61652438009',
            name: 'campaignSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Campaign',
            subtypeIndex: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2a4b3b65-06a5-4679-bac9-98dc536c68d4'
        },
        '67b32c2b-a683-4ffe-a867-79300f3a25e0': {
            guid: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
            name: 'opportunitySObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '2bf0c2e0-c04d-43a6-84ce-49009b740a1b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '865e456d-2e1d-410f-8c62-8f686238b197'
        },
        '6f3f842a-e289-48ee-b18b-6820e87cee94': {
            guid: '6f3f842a-e289-48ee-b18b-6820e87cee94',
            name: 'opportunitySObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Opportunity',
            subtypeIndex: '030e4398-87bd-4390-a8fd-a348fcd3b323',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'f876df5e-ccc8-43a5-921f-4730c6c8052b'
        },
        'a198d5b1-0303-44f8-9d32-59611aba0a07': {
            guid: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
            name: 'currencyVariable',
            description: 'randomDescription',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Currency',
            subtype: null,
            subtypeIndex: 'f9efafa3-d83f-41a6-92e8-487eadb228c0',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c3ba5281-2d20-4596-99d0-94b9368c1d70'
        },
        'acbbb552-1389-4ec3-9807-d8c3aa378d70': {
            guid: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
            name: 'dateCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f'
        },
        '4899e1df-446e-4158-a942-9b376323c325': {
            guid: '4899e1df-446e-4158-a942-9b376323c325',
            name: 'dateVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Date',
            subtype: null,
            subtypeIndex: 'fd06f9e3-6e63-4d89-b441-ca4c0594deb5',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7f18c878-eb8d-49d8-8b87-8d8ddcdf4daa'
        },
        '5a6a3791-5930-4c22-9f5d-ed090b53f8e6': {
            guid: '5a6a3791-5930-4c22-9f5d-ed090b53f8e6',
            name: 'feedItemVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'FeedItem',
            subtypeIndex: 'b8a65817-59f3-4fa9-a0a8-73602ab6a45a',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '78207ca6-8bba-401b-a2e8-1c279842b990'
        },
        'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59': {
            guid: 'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59',
            name: 'numberVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Number',
            subtype: null,
            subtypeIndex: 'd3d400b8-db5e-4704-8b34-3dc777de7ab2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '026b8ee9-572a-40c0-9442-00e58400855d'
        },
        '57402670-a93f-4621-a8e4-6045f765731b': {
            guid: '57402670-a93f-4621-a8e4-6045f765731b',
            name: 'stringCollectionVariable1',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'e4b8d861-0407-4edd-8002-1b887499cd44',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '19362806-09c5-46a5-b274-bebe980379cf'
        },
        'aca838b1-ea76-436d-a081-732171fdbc11': {
            guid: 'aca838b1-ea76-436d-a081-732171fdbc11',
            name: 'stringCollectionVariable2',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7ba5860c-9e90-4a76-a600-591f1c42fa54'
        },
        '975adb96-3950-4767-8f2a-47e2958202f2': {
            guid: '975adb96-3950-4767-8f2a-47e2958202f2',
            name: 'stringVariable',
            description: 'random description',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'e2de9f05-aae8-4dc3-a061-e5d17e4562e1',
            scale: 0,
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: '1ab5b2e1-0763-4cb4-a106-f1dcf5920728'
        },
        'c5488001-ae8b-4364-984a-57778117437b': {
            guid: 'c5488001-ae8b-4364-984a-57778117437b',
            name: 'apexCarVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'Car',
            subtypeIndex: '5c56f33d-c558-409b-837d-a835f74010ae',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8994b409-64e9-438f-8532-1c5f0ed172af'
        },
        'f4b19fd9-74ef-4f38-aa3b-549f6d105a77': {
            guid: 'f4b19fd9-74ef-4f38-aa3b-549f6d105a77',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'efbed9ce-b23f-43d3-bbe8-f9ddc2234909',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c046997e-c0ed-4c78-a861-05be31e4d0ac'
        },
        '4e231f09-fd41-4fa3-8f1e-8515f6376c61': {
            guid: '4e231f09-fd41-4fa3-8f1e-8515f6376c61',
            name: 'vAccountIdFromCreate',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '523f076c-5b60-402f-8617-d93833186fbe',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'beff1133-9fcb-4002-a540-e0740e0f3633'
        },
        'b1d673a1-a2cd-4106-ae02-5d184d3aaa37': {
            guid: 'b1d673a1-a2cd-4106-ae02-5d184d3aaa37',
            name: 'apexComplexTypeCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '13071101-a221-4af9-a430-5d6a2e4c7f28',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '1fa12c04-abe3-44d7-87d2-132178cb5c70'
        },
        '0596012b-9bd5-4182-87ce-0e1f231967ef': {
            guid: '0596012b-9bd5-4182-87ce-0e1f231967ef',
            name: 'apexContainsOnlyASingleSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyASingleSObject',
            subtypeIndex: '9598b9ad-7b8d-4a74-bf1b-32020d902af1',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '02209f51-9747-443f-8b81-87d5ee84cfd7'
        },
        'b6131670-d12f-4df5-9560-2a476767e9e4': {
            guid: 'b6131670-d12f-4df5-9560-2a476767e9e4',
            name: 'apexContainsOnlyAnSObjectCollectionVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexContainsOnlyAnSObjectCollection',
            subtypeIndex: 'a0d930b7-520b-48e7-844e-df473e4214b7',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '247e0c32-5050-4a90-977f-f33c989ad9f9'
        },
        '8ee25bae-66aa-4c1d-bf28-938976a1d25b': {
            guid: '8ee25bae-66aa-4c1d-bf28-938976a1d25b',
            name: 'apexComplexTypeTwoVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestTwo216',
            subtypeIndex: '79c59df8-63ef-4817-8939-4951da8d22c9',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3a823f11-0023-4a28-bca2-2331299c86f7'
        },
        'c27e44ab-6e20-496f-80c0-623c207ab098': {
            guid: 'c27e44ab-6e20-496f-80c0-623c207ab098',
            name: 'stringConstant',
            description: 'random description',
            elementType: 'Constant',
            dataType: 'String',
            defaultValue: 'fooDefault',
            defaultValueDataType: 'String',
            defaultValueIndex: 'c133671f-83c0-486e-aafc-faed91142185'
        },
        '38e03c17-22d6-403f-91bf-6d9bd0caa696': {
            guid: '38e03c17-22d6-403f-91bf-6d9bd0caa696',
            name: 'textTemplate1',
            description: '',
            elementType: 'TextTemplate',
            text: '<p>Hello {!975adb96-3950-4767-8f2a-47e2958202f2}</p>',
            dataType: 'String'
        },
        '64576cb6-0939-475e-8e1b-76feee5be4be': {
            guid: '64576cb6-0939-475e-8e1b-76feee5be4be',
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
                    rowIndex: 'a91df44d-d786-4ab8-be03-9211069ed720',
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
        'b9810123-08cd-465b-ae9a-ca0c2afb3a9a': {
            guid: 'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
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
            objectIndex: '31ac8e99-5705-49f2-a2ef-bf2f6a4a22e0',
            inputAssignments: [
                {
                    rowIndex: '23ae0ea4-4d33-4dcc-a579-013e91fd4159',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my Account test',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: '46c2961d-5cf6-443b-95d4-91d406c02a37',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
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
            assignRecordIdToReference: '',
            assignRecordIdToReferenceIndex: 'b15d6409-4439-4dc2-8a3d-4956e56ba21a',
            dataType: 'String',
            storeOutputAutomatically: true
        },
        'e713f058-3d86-43ff-9da6-c8cd70863c95': {
            guid: 'e713f058-3d86-43ff-9da6-c8cd70863c95',
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
            objectIndex: 'df72b5ae-20df-4ebf-9c93-3f87b91d7791',
            inputAssignments: [
                {
                    rowIndex: '652434b1-40e0-404e-9e4d-e6864e4f8bdb',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'my test account',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'a339198f-0294-4416-a67a-2782d735acad',
                    leftHandSide: 'Account.BillingCountry',
                    rightHandSide: 'France',
                    rightHandSideDataType: 'String'
                }
            ],
            getFirstRecordOnly: true,
            inputReference: '',
            inputReferenceIndex: '17d626e2-e27c-4bf0-9670-5abc582a22fb',
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
            assignRecordIdToReference: '4e231f09-fd41-4fa3-8f1e-8515f6376c61',
            assignRecordIdToReferenceIndex: 'b0d41663-ba7b-4020-8f88-6c83151e3a83',
            dataType: 'Boolean',
            storeOutputAutomatically: false
        },
        '5bd09db6-7e3f-41e3-a0c7-dbef33840655': {
            guid: '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
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
            objectIndex: '0d21d5a2-6e85-4023-8e2b-846d05bfb367',
            getFirstRecordOnly: true,
            inputReference: '5a7f1472-d64c-4b45-adde-b52b93262693',
            inputReferenceIndex: '4be9885e-987b-4fab-b204-58dd28d0829c',
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
            assignRecordIdToReferenceIndex: 'e12fdd35-1aeb-4465-b52c-73a201e704a7',
            dataType: 'Boolean'
        },
        '55c07deb-dcd5-45e2-ad9a-c80b7bc17362': {
            guid: '55c07deb-dcd5-45e2-ad9a-c80b7bc17362',
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
            objectIndex: '096f6fc9-8bb1-4738-9365-5e8fd66eaa14',
            getFirstRecordOnly: true,
            inputReference: '960c344c-31bb-41b5-ad56-63ba96f239d8',
            inputReferenceIndex: 'f8d71fe5-b8d5-4def-b47b-dd4aef4b47dc',
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
            assignRecordIdToReferenceIndex: '09238073-9b8a-4280-9f23-e44be298f4b0',
            dataType: 'Boolean'
        },
        'df134372-8b3c-4bbd-875a-7513e76bec39': {
            guid: 'df134372-8b3c-4bbd-875a-7513e76bec39',
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
            objectIndex: 'ba867a87-724c-4775-963b-2fc43169444f',
            getFirstRecordOnly: true,
            inputReference: '0596012b-9bd5-4182-87ce-0e1f231967ef.account',
            inputReferenceIndex: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
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
            assignRecordIdToReferenceIndex: 'd5a45e74-78b4-41c3-844d-b0536f90c54b',
            dataType: 'Boolean'
        },
        'ffdc5988-95d5-483c-b1ba-6b2adb5e8df7': {
            guid: 'ffdc5988-95d5-483c-b1ba-6b2adb5e8df7',
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
            objectIndex: '363280ef-e5f4-414b-9988-1200b330e5cb',
            getFirstRecordOnly: true,
            inputReference: 'b6131670-d12f-4df5-9560-2a476767e9e4.accounts',
            inputReferenceIndex: '2e27b2ec-9bb9-493d-9151-d9022471680f',
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
            assignRecordIdToReferenceIndex: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe',
            dataType: 'Boolean'
        },
        '2aacf35d-91f7-42cc-a668-f0b682615d6b': {
            guid: '2aacf35d-91f7-42cc-a668-f0b682615d6b',
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
            objectIndex: '9abf51ab-a289-45b0-853c-040be0ed9eb7',
            filterType: 'none',
            filters: [
                {
                    rowIndex: '5a93c395-dd94-498e-9383-50caf96c6748',
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
            outputReferenceIndex: 'd99d05ca-bae7-459a-9551-10f32d89aeb9',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        'db83d1da-0f30-4796-8075-843918cf6c01': {
            guid: 'db83d1da-0f30-4796-8075-843918cf6c01',
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
            objectIndex: 'ec3a2e92-54b4-4cc1-aa0b-2026ce47d2ff',
            filterType: 'none',
            filters: [
                {
                    rowIndex: '016e92d2-b409-4a9d-89c0-50e637967cbc',
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
            outputReferenceIndex: '9aba628e-835b-448a-ac6b-a3764ac735b4',
            dataType: 'SObject',
            isCollection: true,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'automatic'
        },
        '0dfdcc2f-0bb7-4357-80ed-337890bd89e6': {
            guid: '0dfdcc2f-0bb7-4357-80ed-337890bd89e6',
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
            objectIndex: '0918a8eb-38a1-4294-b329-39aa5b0bbd13',
            outputReference: '5a7f1472-d64c-4b45-adde-b52b93262693',
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'none',
            filters: [
                {
                    rowIndex: '5bb2cc21-9ba8-4d14-90b5-f81c92e919a8',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '91f8d923-79e4-4a85-9621-3334fac4abe5'
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
            outputReferenceIndex: '91280889-13e2-4de0-8390-32d05b8918e5',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da': {
            guid: '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
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
            objectIndex: 'e17f4b88-f725-4ebb-8d7b-78e179ea4c8c',
            filterType: 'all',
            filters: [
                {
                    rowIndex: 'a5b1853e-6b7e-4568-9b24-37414be4b4d7',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'Paris',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                },
                {
                    rowIndex: '90845b6c-c12e-4689-adaf-19d8127d9f99',
                    leftHandSide: 'Account.BillingPostalCode',
                    rightHandSide: '75007',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '888dc04a-b0c7-49af-804a-8af6951151a0'
                },
                {
                    field: 'Name',
                    rowIndex: '13cd8d8c-6bf4-4f50-95bb-32adde864b80'
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
            outputReferenceIndex: '9b6b8f63-fff0-477e-92b7-3e315551288b',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manuallySelectFields'
        },
        '483bad31-107e-420d-8598-721d6db44c47': {
            guid: '483bad31-107e-420d-8598-721d6db44c47',
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
            inputReference: '5a7f1472-d64c-4b45-adde-b52b93262693',
            inputReferenceIndex: '8f54aa39-0bda-422e-a4ad-3e2ac0155234',
            object: '',
            objectIndex: 'a5dd0d8d-9a71-4f0f-9ad0-573d34041554',
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
        '1ce942af-1f5f-421c-b55b-07edf0fb0401': {
            guid: '1ce942af-1f5f-421c-b55b-07edf0fb0401',
            name: 'loopOnAccountAutoOutput',
            description: '',
            label: 'loopOnAccountAutoOutput',
            locationX: 234,
            locationY: 417,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'bf86df65-a565-4f4c-9a88-3785f2785230',
            collectionReference: '960c344c-31bb-41b5-ad56-63ba96f239d8',
            collectionReferenceIndex: 'b1594536-54c8-4f1d-96fc-ebfd501ca433',
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
        '1936abb6-dc8c-4180-a4dd-7172ba4841df': {
            guid: '1936abb6-dc8c-4180-a4dd-7172ba4841df',
            name: 'loopOnTextCollectionAutoOutput',
            description: '',
            label: 'loopOnTextCollectionAutoOutput',
            locationX: 358,
            locationY: 418.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '9dfb762b-b721-4ac5-b787-edcdd6f02574',
            collectionReference: '57402670-a93f-4621-a8e4-6045f765731b',
            collectionReferenceIndex: '1a024e7c-0ada-4ab4-8211-9e3b1a4e9836',
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
        'f4b58a0a-045d-49d4-b1c7-888e895a4484': {
            guid: 'f4b58a0a-045d-49d4-b1c7-888e895a4484',
            name: 'loopOnApexAutoOutput',
            description: '',
            label: 'loopOnApexAutoOutput',
            locationX: 472,
            locationY: 417.3125,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'b3226572-8133-4f57-a49e-b9863ea7da7b',
            collectionReference: 'b1d673a1-a2cd-4106-ae02-5d184d3aaa37',
            collectionReferenceIndex: 'c0582ee6-8e57-4803-a24a-55004897c2c5',
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
        'c11af199-2852-4caa-b90c-7c763d1480d4': {
            guid: 'c11af199-2852-4caa-b90c-7c763d1480d4',
            name: 'loopOnTextCollection',
            description: 'This is a test without automatic Output',
            label: 'loopOnTextCollection',
            locationX: 638,
            locationY: 435,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: '975adb96-3950-4767-8f2a-47e2958202f2',
            assignNextValueToReferenceIndex: '57776352-a679-4bdc-876b-77d987c29fc5',
            collectionReference: '57402670-a93f-4621-a8e4-6045f765731b',
            collectionReferenceIndex: 'fa63fff1-36e9-4574-9586-72f3ef2b334d',
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
        'd6b5b39e-c834-4449-9ade-38629b8676d9': {
            guid: 'd6b5b39e-c834-4449-9ade-38629b8676d9',
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
                    fieldReference: 'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814'
                },
                {
                    fieldReference: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c'
                },
                {
                    fieldReference: '34c2635d-312f-482e-8354-6074fccf7fa8'
                },
                {
                    fieldReference: '337b5789-e021-4e7b-ab5d-582c80803cca'
                },
                {
                    fieldReference: '402e3689-0dfb-44a0-8fea-b43c63293cd6'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814': {
            guid: 'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814',
            name: 'emailScreenFieldAutomaticOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '66372d1b-81f8-4269-b7f8-80f1723485ca',
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
                    rowIndex: '5e649f27-18a2-47ae-abad-c0f33d2e2a1b',
                    name: 'label',
                    value: 'emailScreenFieldAutomaticOutput',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '1f5acf67-1b31-46ba-b0a5-42c9c27510f7',
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
        'a084e300-bca6-4e92-b8c8-9b2490b3cc5c': {
            guid: 'a084e300-bca6-4e92-b8c8-9b2490b3cc5c',
            name: 'emailScreenField',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'ddd9900e-25a1-4ef5-825f-bde05b6231ae',
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
                    rowIndex: '1aeb52b7-9963-431b-a046-e41cfd1f5ef9',
                    name: 'label',
                    value: 'emailScreenField',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '5a519501-1819-4874-a19d-3f964a138b2b',
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
        '34c2635d-312f-482e-8354-6074fccf7fa8': {
            guid: '34c2635d-312f-482e-8354-6074fccf7fa8',
            name: 'lightningCompWithAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '12a6ba74-604b-4f52-b6ea-56a3eece9919',
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
        '337b5789-e021-4e7b-ab5d-582c80803cca': {
            guid: '337b5789-e021-4e7b-ab5d-582c80803cca',
            name: 'lightningCompWithNoAccountOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'fd6ee2ac-fe05-4c7b-9b70-bc611c531126',
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
        '402e3689-0dfb-44a0-8fea-b43c63293cd6': {
            guid: '402e3689-0dfb-44a0-8fea-b43c63293cd6',
            name: 'lightningCompWithAccountsOutput',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: 'cb2c1f94-a09d-4690-9c2b-1a2f37e16dbb',
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
        '23a963ec-f168-4151-804b-9541689dc879': {
            guid: '23a963ec-f168-4151-804b-9541689dc879',
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
                    fieldReference: '131babab-443d-4e7f-99dc-3b2ecd50baa5'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '131babab-443d-4e7f-99dc-3b2ecd50baa5': {
            guid: '131babab-443d-4e7f-99dc-3b2ecd50baa5',
            name: 'Address',
            choiceReferences: [],
            dataType: 'LightningComponentOutput',
            defaultValue: '',
            defaultValueIndex: '2329aa7a-2605-400b-b066-a773bd8633f6',
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
        'd08b12f4-ac7b-4cb4-a3ff-621131fc450f': {
            guid: 'd08b12f4-ac7b-4cb4-a3ff-621131fc450f',
            name: 'stage1',
            description: '',
            isActive: false,
            stageOrder: '12',
            label: 'stage1',
            elementType: 'Stage'
        },
        '83d39edd-dc5c-43e8-b58b-999c0c6efcbc': {
            guid: '83d39edd-dc5c-43e8-b58b-999c0c6efcbc',
            name: 'numberChoice',
            description: '',
            elementType: 'Choice',
            dataType: 'Number',
            choiceText: 'Choice 1',
            storedValue: null,
            storedValueDataType: null,
            storedValueIndex: '1ac79856-9d88-4a1f-b51b-099537bd458c',
            isShowInputSelected: false,
            isValidateSelected: false
        }
    },
    connectors: [],
    canvasElements: [
        'e3034ac1-888c-4595-bd9b-6903c99aa590',
        '3b362fa9-ea82-47fe-85f4-25406e719a72',
        '7d45ed5b-7cfd-40e1-8028-23a7e1026335',
        '1a934031-6241-4115-9514-61184d4c5b75',
        'c9ebe244-887a-4821-811c-f9f17a670037',
        '42935e07-8378-4994-9dfe-34d987e80fac',
        '89b82177-0c9a-4fa3-a540-55212f1ea9d9',
        '4ca8549b-0128-4a7d-91a6-e86a9a6b18ec',
        'e46d1655-6558-4c7b-b828-b040906115b0',
        '8232343e-c77f-4502-9234-793bc5470183',
        'fde9b89d-7177-4303-889d-5293eaeb58aa',
        '1219bee3-aea6-4567-b155-e5ddb4a543bd',
        '35837efc-fe6e-4096-8de3-a00443b93527',
        '130d845a-9aeb-42e7-acbc-cdea13693b85',
        'ab66a6a8-98df-47cd-9948-1c2390f02139',
        '611f9934-04ec-47a9-8a9f-ade6f3b66435',
        '9cdb5a2b-2fec-4a2f-81b7-ef78564aba74',
        'ea5338a4-7109-4d3a-819a-d5e994a18d60',
        '3c67ee2c-bda6-4062-a41a-c4a2ac77ee37',
        '69591af2-800b-499b-af80-25f60583d5f2',
        'de99983e-4f45-4dbd-b0e1-c38008ec2c44',
        'a6604def-64ac-4b18-bd52-cb642444eb2d',
        '64576cb6-0939-475e-8e1b-76feee5be4be',
        'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
        'e713f058-3d86-43ff-9da6-c8cd70863c95',
        '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
        '55c07deb-dcd5-45e2-ad9a-c80b7bc17362',
        'df134372-8b3c-4bbd-875a-7513e76bec39',
        'ffdc5988-95d5-483c-b1ba-6b2adb5e8df7',
        '2aacf35d-91f7-42cc-a668-f0b682615d6b',
        'db83d1da-0f30-4796-8075-843918cf6c01',
        '0dfdcc2f-0bb7-4357-80ed-337890bd89e6',
        '530b5897-614d-4b9d-9ee6-9d2ff19e26da',
        '483bad31-107e-420d-8598-721d6db44c47',
        '1ce942af-1f5f-421c-b55b-07edf0fb0401',
        '1936abb6-dc8c-4180-a4dd-7172ba4841df',
        'f4b58a0a-045d-49d4-b1c7-888e895a4484',
        'c11af199-2852-4caa-b90c-7c763d1480d4',
        'd6b5b39e-c834-4449-9ade-38629b8676d9',
        '23a963ec-f168-4151-804b-9541689dc879'
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
