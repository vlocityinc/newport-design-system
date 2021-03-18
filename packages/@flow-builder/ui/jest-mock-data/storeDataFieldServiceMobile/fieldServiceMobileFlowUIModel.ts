// @ts-nocheck
// To update fieldServiceMobileFlowUIModel from fieldServiceMobileFlow, run flowTranslator.test.js and follow instructions
export const fieldServiceMobileFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            description: '',
            locationX: 50,
            locationY: 50,
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
                isSelectable: true,
                hasError: false
            },
            childReferences: [
                {
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'fc408daa-3152-46bf-8733-c1083018292b',
                    leftHandSide: 'ed85c895-feb5-45cb-b486-49cfd9da8e20.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        '6d690706-908c-4d94-9513-1b219301b4c5': {
            guid: '6d690706-908c-4d94-9513-1b219301b4c5',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '90246d76-2818-4059-b0fd-425e241f8708',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201'
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab'
        },
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717': {
            guid: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4968239c-5e3d-45ee-9339-f575c917e223'
        },
        'ed85c895-feb5-45cb-b486-49cfd9da8e20': {
            guid: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7f4ddba5-e41b-456b-b686-94b257cc9914'
        },
        '40c11213-36c0-451e-a5aa-8790aee02559': {
            guid: '40c11213-36c0-451e-a5aa-8790aee02559',
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
                isSelectable: true,
                hasError: false
            },
            elementSubtype: null,
            object: '',
            objectIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            getFirstRecordOnly: true,
            inputReference: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            inputReferenceIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
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
            assignRecordIdToReferenceIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            dataType: 'Boolean'
        },
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6': {
            guid: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            outputReference: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
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
            outputReferenceIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9': {
            guid: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            outputReference: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '3147a31d-26a3-408c-b00b-a31983df0da5'
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
            outputReferenceIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
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
                isSelectable: true,
                hasError: false
            },
            object: 'Account',
            objectIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            outputAssignments: [
                {
                    rowIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                },
                {
                    rowIndex: '956ee0bf-ff21-44f4-9917-65676160e094',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '6d690706-908c-4d94-9513-1b219301b4c5'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
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
            outputReferenceIndex: '85d76151-9bec-4869-b691-791baf964b4f',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '69030d84-1e7f-49c3-ad89-ddc4db69050a': {
            guid: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
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
                isSelectable: true,
                hasError: false
            },
            assignNextValueToReference: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            assignNextValueToReferenceIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
            collectionReference: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            collectionReferenceIndex: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
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
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
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
                    childReference: '2bf626b1-9430-49ca-ad02-a75241931b16'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '2bf626b1-9430-49ca-ad02-a75241931b16': {
            guid: '2bf626b1-9430-49ca-ad02-a75241931b16',
            name: 'FileUpload',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
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
                    rowIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
                    name: 'label',
                    value: 'ed85c895-feb5-45cb-b486-49cfd9da8e20.AccountSource',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
                    name: 'recordId',
                    value: '6d690706-908c-4d94-9513-1b219301b4c5',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
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
            inputsOnNextNavToAssocScrn: 'UseStoredValues',
            storeOutputAutomatically: false,
            childReferences: []
        }
    },
    connectors: [],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
        '40c11213-36c0-451e-a5aa-8790aee02559',
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
        '69030d84-1e7f-49c3-ad89-ddc4db69050a',
        'a8368340-a386-4406-9118-02389237ad54'
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
