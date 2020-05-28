// @ts-nocheck
// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
    elements: {
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
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
            filterLogic: 'no_conditions',
            object: '',
            objectIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            filters: []
        },
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6': {
            guid: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
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
            outcomeReferences: [
                {
                    outcomeReference: 'a733e74b-1a25-43dc-b43c-d126c849023d'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a733e74b-1a25-43dc-b43c-d126c849023d'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
                    leftHandSide: 'cf5e6188-117a-47c0-a493-7ed460484c87.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ]
        },
        'be979456-fe7c-4fa6-be9f-e388ea78dd33': {
            guid: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
        },
        '8573e2d4-ccfb-4701-be66-e38b54ba7375': {
            guid: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b'
        },
        'cf5e6188-117a-47c0-a493-7ed460484c87': {
            guid: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929'
        },
        'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40': {
            guid: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3147a31d-26a3-408c-b00b-a31983df0da5',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'eb19f518-e185-488c-a5b2-9107036766f4'
        },
        '70926b3b-6a78-4e62-a62b-0c6d4c4ca910': {
            guid: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
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
            objectIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            outputAssignments: [
                {
                    rowIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                    leftHandSide: 'Account.Id',
                    rightHandSide: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
                },
                {
                    rowIndex: '56095468-2459-481d-b084-04a05babcb22',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
                }
            ],
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
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
            outputReferenceIndex: 'ba8a8e41-3944-4099-9655-065f054e811f',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd': {
            guid: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
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
            objectIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            outputReference: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab'
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
            outputReferenceIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'c518ac20-1202-42a6-ac3d-cfc8b707f4c3': {
            guid: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
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
            objectIndex: '1283ede6-414b-45a2-851a-1b113f26bffd',
            outputReference: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa'
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
            outputReferenceIndex: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        '458ac1c7-23e7-49cc-a518-5eaf4f218a49': {
            guid: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
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
            fieldReferences: [
                {
                    fieldReference: '5e2803c7-a184-465c-92e3-1d29634f2114'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '5e2803c7-a184-465c-92e3-1d29634f2114': {
            guid: '5e2803c7-a184-465c-92e3-1d29634f2114',
            name: 'Address',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
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
            fieldReferences: []
        }
    },
    connectors: [],
    canvasElements: [
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
        '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
        'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
        '458ac1c7-23e7-49cc-a518-5eaf4f218a49'
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
