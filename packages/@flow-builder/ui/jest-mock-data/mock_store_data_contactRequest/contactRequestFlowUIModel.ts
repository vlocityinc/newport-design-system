// @ts-nocheck
// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
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
            doesRequireRecordChangedToMeetCriteria: false
        },
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3': {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
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
                    leftHandSide: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717.CloneSourceId',
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
            scale: 2,
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
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab'
        },
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717': {
            guid: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4968239c-5e3d-45ee-9339-f575c917e223'
        },
        'ed85c895-feb5-45cb-b486-49cfd9da8e20': {
            guid: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '7f4ddba5-e41b-456b-b686-94b257cc9914'
        },
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be': {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
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
            objectIndex: '53329036-32e6-4965-a1d2-b12cd0344f99',
            outputAssignments: [
                {
                    rowIndex: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '6d690706-908c-4d94-9513-1b219301b4c5'
                },
                {
                    rowIndex: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                }
            ],
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
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
            outputReferenceIndex: '04e1c283-fc0b-4928-a495-89d956368769',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
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
            objectIndex: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            outputReference: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: 'a8368340-a386-4406-9118-02389237ad54',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '2bf626b1-9430-49ca-ad02-a75241931b16'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478'
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
            outputReferenceIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '90da6513-4272-44d6-9f80-4cfc29acc5a3': {
            guid: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
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
            objectIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
            outputReference: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            assignNullValuesIfNoRecordsFound: true,
            filterLogic: 'and',
            filters: [
                {
                    rowIndex: '40c11213-36c0-451e-a5aa-8790aee02559',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59'
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
            outputReferenceIndex: '5c075fad-735a-4628-9e51-495d3292d153',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: false,
            variableAndFieldMapping: 'manual'
        },
        'bb597c66-db1e-4636-85b6-31f89b320bd4': {
            guid: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
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
                    childReference: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '700b8f1c-98eb-48ea-90f0-35e1a864a1a8': {
            guid: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            name: 'Address',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
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
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
        '956ee0bf-ff21-44f4-9917-65676160e094',
        '90da6513-4272-44d6-9f80-4cfc29acc5a3',
        'bb597c66-db1e-4636-85b6-31f89b320bd4'
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
        versionNumber: 1,
        apiVersion: 50,
        isAutoLayoutCanvas: false
    }
};
