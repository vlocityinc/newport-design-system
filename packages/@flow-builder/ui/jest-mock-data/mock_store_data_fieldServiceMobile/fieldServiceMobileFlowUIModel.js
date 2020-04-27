// To update fieldServiceMobileFlowUIModel from fieldServiceMobileFlow, run flowTranslator.test.js and follow instructions
export const fieldServiceMobileFlowUIModel = {
    elements: {
        '90da6513-4272-44d6-9f80-4cfc29acc5a3': {
            guid: '90da6513-4272-44d6-9f80-4cfc29acc5a3',
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
            objectIndex: 'd6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f',
            filters: [
                {
                    rowIndex: '5c075fad-735a-4628-9e51-495d3292d153',
                    leftHandSide: '',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ]
        },
        'd1fda889-4f3a-48cd-ba79-be4fbca04da2': {
            guid: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
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
                    outcomeReference: '40c11213-36c0-451e-a5aa-8790aee02559'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '40c11213-36c0-451e-a5aa-8790aee02559'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '40c11213-36c0-451e-a5aa-8790aee02559': {
            guid: '40c11213-36c0-451e-a5aa-8790aee02559',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
                    leftHandSide: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9.CloneSourceId',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: 'EqualTo'
                }
            ]
        },
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            name: 'accountID',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6'
        },
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'vAccountBillingAddress',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33'
        },
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07': {
            guid: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            name: 'vAccounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
        },
        'ebedaf4c-b899-4660-bf34-b2c569bda3c9': {
            guid: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            name: 'vMyTestAccount',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cf5e6188-117a-47c0-a493-7ed460484c87'
        },
        '6afc7b95-a112-4bd0-99e6-4114704080f2': {
            guid: '6afc7b95-a112-4bd0-99e6-4114704080f2',
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
            objectIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            outputReference: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            assignNullValuesIfNoRecordsFound: false,
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
            objectIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            outputReference: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            assignNullValuesIfNoRecordsFound: false,
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
            objectIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            outputAssignments: [
                {
                    rowIndex: '54aae715-8881-4a52-b7a9-25c385d1488e',
                    leftHandSide: 'Account.BillingAddress',
                    rightHandSide: 'a733e74b-1a25-43dc-b43c-d126c849023d'
                },
                {
                    rowIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
                    leftHandSide: 'Account.Id',
                    rightHandSide: '34ff5f58-8d99-470d-a755-a2aa0dc69f59'
                }
            ],
            assignNullValuesIfNoRecordsFound: false,
            filterType: 'all',
            filters: [
                {
                    rowIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c',
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
            outputReferenceIndex: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            dataType: 'Boolean',
            storeOutputAutomatically: false,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'manual'
        },
        'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9': {
            guid: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
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
            assignNextValueToReference: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            assignNextValueToReferenceIndex: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            collectionReference: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            collectionReferenceIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
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
        '9d11ba05-33c4-4893-87b8-9560be9557d2': {
            guid: '9d11ba05-33c4-4893-87b8-9560be9557d2',
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
                    fieldReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2': {
            guid: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            name: 'FileUpload',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
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
                    rowIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
                    name: 'label',
                    value: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9.AccountSource',
                    valueDataType: 'reference'
                },
                {
                    rowIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
                    name: 'recordId',
                    value: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
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
        '90da6513-4272-44d6-9f80-4cfc29acc5a3',
        'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
        '6afc7b95-a112-4bd0-99e6-4114704080f2',
        'ba8a8e41-3944-4099-9655-065f054e811f',
        'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
        'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9',
        '9d11ba05-33c4-4893-87b8-9560be9557d2'
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
