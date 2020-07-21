// @ts-nocheck
// To update fieldServiceMobileFlowUIModel from fieldServiceMobileFlow, run flowTranslator.test.js and follow instructions
export const fieldServiceMobileFlowUIModel = {
    elements: {
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
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
            filterLogic: 'and',
            object: '',
            objectIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            filters: [
                {
                    rowIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
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
            childReferences: [
                {
                    childReference: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '4afdbe2b-6b5a-4da3-887d-5b755f53b64e': {
            guid: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
                    leftHandSide: '54aae715-8881-4a52-b7a9-25c385d1488e.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '9b2579d0-01d3-45b0-b6b2-bb016b085511': {
            guid: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '56095468-2459-481d-b084-04a05babcb22',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9'
        },
        '48cb0159-3cde-48ad-9877-644e3cc4b5e9': {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10'
        },
        'e5b4998c-a36e-407f-afb7-2301eda53b8d': {
            guid: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c'
        },
        '54aae715-8881-4a52-b7a9-25c385d1488e': {
            guid: '54aae715-8881-4a52-b7a9-25c385d1488e',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9'
        },
        '41a189ff-01f4-4018-b75c-3f363b65cc42': {
            guid: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            name: 'create_account_from_variable',
            description: '',
            label: 'create account from variable',
            locationX: 154,
            locationY: 185,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true
            },
            elementSubtype: null,
            object: '',
            objectIndex: 'b3a76739-4414-41d2-984e-e44bca6402c6',
            getFirstRecordOnly: true,
            inputReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
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
            assignRecordIdToReferenceIndex: '6160bbc3-c247-458e-b1b8-abc60b4d3d39',
            dataType: 'Boolean'
        },
        '38f77648-3c7e-4431-8403-239492238623': {
            guid: '38f77648-3c7e-4431-8403-239492238623',
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
            objectIndex: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
            outputReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '52bc2460-8775-417b-a692-f72725a8f6b0'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '013c0515-5f96-493f-bf5b-3d261350a4e6'
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
            outputReferenceIndex: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '201c3554-f05a-4fff-8482-1495f16e2f8b': {
            guid: '201c3554-f05a-4fff-8482-1495f16e2f8b',
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
            objectIndex: 'cf176378-9ab0-436f-a161-079057c789f4',
            outputReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'e41bbbb0-08ee-40bf-ab4a-810a34f151a1',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '58d4a602-1abb-46e4-8c10-54c225dd56af'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7'
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
            outputReferenceIndex: '27cfbe21-2aa1-4503-aa13-3677c687153d',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '37c4575e-32f8-46d9-aeea-737953c256b2': {
            guid: '37c4575e-32f8-46d9-aeea-737953c256b2',
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
            objectIndex: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
            outputAssignments: [
                {
                    rowIndex: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9'
                },
                {
                    rowIndex: '3d47c47d-df60-4f92-85c8-71982afd9938',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '9b2579d0-01d3-45b0-b6b2-bb016b085511'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'e9417fd7-2e24-495f-a4af-6ca687957ef6',
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
            outputReferenceIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78': {
            guid: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
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
            assignNextValueToReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
            assignNextValueToReferenceIndex: 'b2eef3a8-57d5-42b7-ad31-c9923cd8a782',
            collectionReference: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            collectionReferenceIndex: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
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
        '0883ba56-46a4-4420-8105-c9d17ad0183b': {
            guid: '0883ba56-46a4-4420-8105-c9d17ad0183b',
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
            childReferences: [
                {
                    childReference: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'f79b5397-57f9-426b-aa00-5ef1b8b8f75d': {
            guid: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            name: 'FileUpload',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '42afe63b-0744-4dec-a7e6-20c67691dd81',
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
                    rowIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
                    name: 'label',
                    value: '54aae715-8881-4a52-b7a9-25c385d1488e.AccountSource',
                    valueDataType: 'reference'
                },
                {
                    rowIndex: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
                    name: 'recordId',
                    value: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
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
            childReferences: []
        }
    },
    connectors: [],
    canvasElements: [
        'eb19f518-e185-488c-a5b2-9107036766f4',
        'ba8a8e41-3944-4099-9655-065f054e811f',
        '41a189ff-01f4-4018-b75c-3f363b65cc42',
        '38f77648-3c7e-4431-8403-239492238623',
        '201c3554-f05a-4fff-8482-1495f16e2f8b',
        '37c4575e-32f8-46d9-aeea-737953c256b2',
        'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
        '0883ba56-46a4-4420-8105-c9d17ad0183b'
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
        versionNumber: 1,
        isAutoLayoutCanvas: false
    }
};
