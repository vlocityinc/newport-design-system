// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
    elements: {
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
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
            filterType: 'all',
            object: '',
            objectIndex: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            filters: [
                {
                    rowIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ]
        },
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2': {
            guid: 'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
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
                    outcomeReference: 'a8368340-a386-4406-9118-02389237ad54'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a8368340-a386-4406-9118-02389237ad54'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
                    leftHandSide: 'e62ce284-ccf2-46af-8446-c0a110a4bba0.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ]
        },
        '6e77e9cf-2492-44ca-a088-ee4b8159d478': {
            guid: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f'
        },
        '5c075fad-735a-4628-9e51-495d3292d153': {
            guid: '5c075fad-735a-4628-9e51-495d3292d153',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '40c11213-36c0-451e-a5aa-8790aee02559'
        },
        'e62ce284-ccf2-46af-8446-c0a110a4bba0': {
            guid: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c'
        },
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6': {
            guid: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b'
        },
        'be979456-fe7c-4fa6-be9f-e388ea78dd33': {
            guid: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
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
            objectIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            outputAssignments: [
                {
                    rowIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '6e77e9cf-2492-44ca-a088-ee4b8159d478'
                },
                {
                    rowIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: '5c075fad-735a-4628-9e51-495d3292d153'
                }
            ],
            assignNullValuesIfNoRecordsFound: true,
            filterType: 'all',
            filters: [
                {
                    rowIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
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
            outputReferenceIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        '6afc7b95-a112-4bd0-99e6-4114704080f2': {
            guid: '6afc7b95-a112-4bd0-99e6-4114704080f2',
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
            objectIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            outputReference: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            assignNullValuesIfNoRecordsFound: true,
            filterType: 'all',
            filters: [
                {
                    rowIndex: 'eb19f518-e185-488c-a5b2-9107036766f4',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myTestAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34'
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
            outputReferenceIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
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
            objectIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            outputReference: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
            assignNullValuesIfNoRecordsFound: true,
            filterType: 'all',
            filters: [
                {
                    rowIndex: '56095468-2459-481d-b084-04a05babcb22',
                    leftHandSide: 'Account.Name',
                    rightHandSide: 'myT',
                    rightHandSideDataType: 'String',
                    operator: 'StartsWith'
                }
            ],
            queriedFields: [
                {
                    field: 'Id',
                    rowIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9'
                },
                {
                    field: 'BillingAddress',
                    rowIndex: '48cb0159-3cde-48ad-9877-644e3cc4b5e9'
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
            outputReferenceIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'f35bd1d9-bafd-4fc9-b682-2d2557f8f796': {
            guid: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
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
                    fieldReference: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        '88a32528-0dfa-4237-b9dd-a14c1a6d6d10': {
            guid: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            name: 'Address',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
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
        '956ee0bf-ff21-44f4-9917-65676160e094',
        'e8161f40-c0f6-4ad8-87ca-942a76a014f2',
        'be979456-fe7c-4fa6-be9f-e388ea78dd33',
        '6afc7b95-a112-4bd0-99e6-4114704080f2',
        'ba8a8e41-3944-4099-9655-065f054e811f',
        'f35bd1d9-bafd-4fc9-b682-2d2557f8f796'
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
