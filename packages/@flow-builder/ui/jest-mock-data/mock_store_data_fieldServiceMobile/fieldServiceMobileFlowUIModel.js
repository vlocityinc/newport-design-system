// To update fieldServiceMobileFlowUIModel from fieldServiceMobileFlow, run flowTranslator.test.js and follow instructions
export const fieldServiceMobileFlowUIModel = {
    elements: {
        '8573e2d4-ccfb-4701-be66-e38b54ba7375': {
            guid: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            description: '',
            locationX: 50,
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
            filterType: 'all',
            object: '',
            objectIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            filters: [
                {
                    rowIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ]
        },
        'cf5e6188-117a-47c0-a493-7ed460484c87': {
            guid: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 503,
            locationY: 71,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '6afc7b95-a112-4bd0-99e6-4114704080f2'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '6afc7b95-a112-4bd0-99e6-4114704080f2'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '6afc7b95-a112-4bd0-99e6-4114704080f2': {
            guid: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    leftHandSide: '56095468-2459-481d-b084-04a05babcb22.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ]
        },
        'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40': {
            guid: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '3147a31d-26a3-408c-b00b-a31983df0da5',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'eb19f518-e185-488c-a5b2-9107036766f4'
        },
        '70926b3b-6a78-4e62-a62b-0c6d4c4ca910': {
            guid: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ba8a8e41-3944-4099-9655-065f054e811f'
        },
        '4afdbe2b-6b5a-4da3-887d-5b755f53b64e': {
            guid: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511'
        },
        '56095468-2459-481d-b084-04a05babcb22': {
            guid: '56095468-2459-481d-b084-04a05babcb22',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9'
        },
        'e502e40a-7dfc-4e71-8a42-c491f86a560a': {
            guid: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
            name: 'get_Account_with_sObject',
            description: '',
            label: 'get_Account_with_sObject',
            locationX: 339,
            locationY: 333,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '3d47c47d-df60-4f92-85c8-71982afd9938',
            outputReference: '56095468-2459-481d-b084-04a05babcb22',
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'all',
            filters: [
                {
                    rowIndex: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '0883ba56-46a4-4420-8105-c9d17ad0183b'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d'
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
            outputReferenceIndex: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '42afe63b-0744-4dec-a7e6-20c67691dd81': {
            guid: '42afe63b-0744-4dec-a7e6-20c67691dd81',
            name: 'get_Accounts',
            description: '',
            label: 'get_Accounts',
            locationX: 543,
            locationY: 344,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '02504510-b361-4fb3-878e-81925a76160f',
            outputReference: '56095468-2459-481d-b084-04a05babcb22',
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'all',
            filters: [
                {
                    rowIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '41a189ff-01f4-4018-b75c-3f363b65cc42'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '796969f1-a892-4b16-836e-209180057a2b'
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
            outputReferenceIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'd050fa16-f494-4685-a87f-3c68666d1ba8': {
            guid: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            name: 'getAccountWithFields',
            description: 'Get account with fields and sort',
            label: 'Get Account With Fields and filters',
            locationX: 161,
            locationY: 332,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            outputAssignments: [
                {
                    rowIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
                },
                {
                    rowIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
                    leftHandSide: 'Account.Id',
                    rightHandSide: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'all',
            filters: [
                {
                    rowIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
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
            outputReferenceIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'fcf61595-af2e-4982-9607-5de1c2819fab': {
            guid: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            name: 'myLoopOnAccount',
            description: '',
            label: 'myLoopOnAccount',
            locationX: 665,
            locationY: 80,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            assignNextValueToReference: '56095468-2459-481d-b084-04a05babcb22',
            assignNextValueToReferenceIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            collectionReference: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            collectionReferenceIndex: '1283ede6-414b-45a2-851a-1b113f26bffd',
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
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc': {
            guid: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            name: 'screenWithFileUpload',
            description: '',
            label: 'screenWithFileUpload',
            locationX: 722,
            locationY: 338,
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
                    fieldReference: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'd7b1d0e5-68d7-4734-b1d1-01247631d93f': {
            guid: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            name: 'FileUpload',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            extensionName: 'forceContent:fileUpload',
            fieldType: 'ComponentInstance',
            fieldText: '',
            helpText: '',
            inputParameters: [
                {
                    rowIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
                    name: 'label',
                    value: '56095468-2459-481d-b084-04a05babcb22.AccountSource',
                    valueDataType: 'reference'
                },
                {
                    rowIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
                    name: 'recordId',
                    value: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
                    valueDataType: 'reference'
                }
            ],
            isNewField: false,
            isRequired: true,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'forceContent:fileUpload',
                fieldType: 'ComponentInstance',
                label: 'forceContent:fileUpload',
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
        '8573e2d4-ccfb-4701-be66-e38b54ba7375',
        'cf5e6188-117a-47c0-a493-7ed460484c87',
        'e502e40a-7dfc-4e71-8a42-c491f86a560a',
        '42afe63b-0744-4dec-a7e6-20c67691dd81',
        'd050fa16-f494-4685-a87f-3c68666d1ba8',
        'fcf61595-af2e-4982-9607-5de1c2819fab',
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000boQDAAY',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'fieldServiceMobileFlowWithElements {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'fieldServiceMobileFlowWithElements',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2020-03-02T12:16:49.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'fieldServiceMobileFlowWithElements',
        processType: 'FieldServiceMobile',
        runInMode: null,
        status: 'InvalidDraft',
        versionNumber: 1
    }
};
