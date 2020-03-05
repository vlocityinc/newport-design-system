// To update autolaunchedFlowUIModel from autoLaunchedFlow, run flowTranslator.test.js and follow instructions
export const autolaunchedFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            name: '$Record',
            description: '',
            label: 'undefined, undefined, FlowBuilderStartEditor.triggerFrequencyOnce',
            locationX: 59,
            locationY: 42,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'Scheduled',
            filterType: 'none',
            startDate: '2019-11-18',
            startTime: '05:45:00.000',
            frequency: 'Once',
            object: 'Account',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [],
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true
        },
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3': {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            name: 'postToChatter',
            description: '',
            label: 'postToChatter',
            locationX: 558,
            locationY: 206.3125,
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
                    rowIndex: 'fc408daa-3152-46bf-8733-c1083018292b',
                    name: 'text',
                    value: 'this is a post to chatter',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '90246d76-2818-4059-b0fd-425e241f8708',
                    name: 'subjectNameOrId',
                    value: 'Automation Builder Simplification',
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
        'e682f03e-925a-4d84-adc3-f1c5ceea0201': {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 552,
            locationY: 42,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
                    leftHandSide: '04e1c283-fc0b-4928-a495-89d956368769.CreatedById',
                    rightHandSide: '04e1c283-fc0b-4928-a495-89d956368769.CreatedById',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ]
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            name: 'wait1',
            description: '',
            label: 'wait1',
            locationX: 311,
            locationY: 284,
            isCanvasElement: true,
            connectorCount: 1,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            waitEventReferences: [
                {
                    waitEventReference: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717'
                }
            ],
            defaultConnectorLabel: 'Default Path',
            elementType: 'Wait',
            maxConnections: 3,
            availableConnections: [
                {
                    type: 'DEFAULT'
                },
                {
                    type: 'FAULT'
                }
            ]
        },
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717': {
            guid: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            name: 'waitEvent1',
            label: 'waitEvent1',
            elementType: 'WAIT_EVENT',
            dataType: 'Boolean',
            conditions: [
                {
                    rowIndex: '4968239c-5e3d-45ee-9339-f575c917e223',
                    leftHandSide: '7f4ddba5-e41b-456b-b686-94b257cc9914',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            conditionLogic: 'and',
            eventType: 'FlowExecutionErrorEvent',
            eventTypeIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            inputParameters: [],
            outputParameters: {
                FlowExecutionErrorEvent: {
                    rowIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
                    name: 'FlowExecutionErrorEvent',
                    value: '',
                    valueDataType: 'reference'
                }
            }
        },
        '7f4ddba5-e41b-456b-b686-94b257cc9914': {
            guid: '7f4ddba5-e41b-456b-b686-94b257cc9914',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '53329036-32e6-4965-a1d2-b12cd0344f99'
        },
        '04e1c283-fc0b-4928-a495-89d956368769': {
            guid: '04e1c283-fc0b-4928-a495-89d956368769',
            name: 'accountVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11'
        },
        'a35e28e0-3d3b-44b1-9638-9caba6ef3820': {
            guid: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
            name: 'accounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964'
        },
        '2f00ca0d-743f-4639-a084-272bbc548f8b': {
            guid: '2f00ca0d-743f-4639-a084-272bbc548f8b',
            name: 'textCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5383bf9b-8314-42bd-a51e-cbee56ec3570'
        },
        '20336b8d-01e4-49eb-bb24-87deba5f6ef8': {
            guid: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
            name: 'textVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66'
        },
        'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1': {
            guid: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf'
        },
        'a6849bcb-05b6-4898-8cc1-12ff825524c5': {
            guid: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            name: 'lookupRecord',
            description: '',
            label: 'lookupRecord',
            locationX: 303,
            locationY: 457,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            object: 'Account',
            objectIndex: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            filterType: 'none',
            filters: [
                {
                    rowIndex: '85d76151-9bec-4869-b691-791baf964b4f',
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
            outputReferenceIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        'bb597c66-db1e-4636-85b6-31f89b320bd4': {
            guid: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
            name: 'loopAccountAutomaticOutput',
            description: 'This is a test with automatic Output',
            label: 'loopAccountAutomaticOutput',
            locationX: 1107,
            locationY: 405,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            collectionReference: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820',
            collectionReferenceIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
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
            storeOutputAutomatically: true
        },
        '956ee0bf-ff21-44f4-9917-65676160e094': {
            guid: '956ee0bf-ff21-44f4-9917-65676160e094',
            name: 'loopOnTextCollection',
            description: 'This is a test without automatic Output',
            label: 'loopOnTextCollection',
            locationX: 1249,
            locationY: 403,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                canSelect: true
            },
            assignNextValueToReference: '20336b8d-01e4-49eb-bb24-87deba5f6ef8',
            assignNextValueToReferenceIndex: '69030d84-1e7f-49c3-ad89-ddc4db69050a',
            collectionReference: '2f00ca0d-743f-4639-a084-272bbc548f8b',
            collectionReferenceIndex: 'dd4270aa-df83-4942-ac0f-37ce8072ccaa',
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
        }
    },
    connectors: [
        {
            guid: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
            source: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            childSource: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            target: 'a6849bcb-05b6-4898-8cc1-12ff825524c5',
            label: 'waitEvent1',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
        'e682f03e-925a-4d84-adc3-f1c5ceea0201',
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
        'a6849bcb-05b6-4898-8cc1-12ff825524c5',
        'bb597c66-db1e-4636-85b6-31f89b320bd4',
        '956ee0bf-ff21-44f4-9917-65676160e094'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'flow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'autolaunchedFlow',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2019-09-06T13:36:33.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'autolaunchedFlow',
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'Draft',
        versionNumber: 1
    }
};
