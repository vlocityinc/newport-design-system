// @ts-nocheck
// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
    elements: {
        'ade42d1f-d120-4ff9-9888-c202b289571c': {
            guid: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            description: '',
            locationX: 80,
            locationY: 53,
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
            objectIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
            filters: [
                {
                    rowIndex: 'a733e74b-1a25-43dc-b43c-d126c849023d',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ]
        },
        '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b': {
            guid: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 227,
            locationY: 360.6875,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            childReferences: [
                {
                    childReference: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'be979456-fe7c-4fa6-be9f-e388ea78dd33': {
            guid: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
                    leftHandSide: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'b93ea139-c9df-49cb-a42e-52c5f496ab07': {
            guid: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9'
        },
        '3f70f36b-030f-4b90-ba09-866642ba5d4b': {
            guid: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2'
        },
        '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929': {
            guid: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3147a31d-26a3-408c-b00b-a31983df0da5'
        },
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34'
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
            name: 'getAccountWithFields',
            description: 'Get account with fields and sort',
            label: 'Get Account With Fields and filters',
            locationX: 228,
            locationY: 147,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            outputAssignments: [
                {
                    rowIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
                    leftHandSide: 'Account.Id',
                    rightHandSide: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
                },
                {
                    rowIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '3f70f36b-030f-4b90-ba09-866642ba5d4b'
                }
            ],
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '56095468-2459-481d-b084-04a05babcb22',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'MyTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [],
            sortOrder: 'Asc',
            sortField: 'Id',
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
            outputReferenceIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '76bbf8c2-9a5e-4a03-a84f-a518866d7963': {
            guid: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            name: 'get_Account_with_sObject',
            description: '',
            label: 'get Account with sObject',
            locationX: 397,
            locationY: 148,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            outputReference: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '1283ede6-414b-45a2-851a-1b113f26bffd'
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
            outputReferenceIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc': {
            guid: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            name: 'get_Accounts',
            description: '',
            label: 'get Accounts',
            locationX: 558,
            locationY: 155,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            outputReference: 'eb19f518-e185-488c-a5b2-9107036766f4',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '8e3cf25f-1ce2-48c8-9634-b192b94ae230'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6'
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
            outputReferenceIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'd050fa16-f494-4685-a87f-3c68666d1ba8': {
            guid: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            name: 'screenWithAddress',
            description: '',
            label: 'screenWithAddress',
            locationX: 741,
            locationY: 154.6875,
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
                    childReference: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd': {
            guid: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            name: 'Address',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
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
            storeOutputAutomatically: false,
            childReferences: []
        }
    },
    connectors: [],
    canvasElements: [
        'ade42d1f-d120-4ff9-9888-c202b289571c',
        '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
        'ba8a8e41-3944-4099-9655-065f054e811f',
        '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
        'd050fa16-f494-4685-a87f-3c68666d1ba8'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300RM0000000ApfYAE',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'contactRequestFlowWithElements {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'contactRequestFlowWithElements',
        lastModifiedBy: 'Admin User',
        lastModifiedDate: '2019-11-18T10:06:51.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'contactRequest',
        processType: 'ContactRequestFlow',
        runInMode: null,
        versionNumber: 1
    }
};
