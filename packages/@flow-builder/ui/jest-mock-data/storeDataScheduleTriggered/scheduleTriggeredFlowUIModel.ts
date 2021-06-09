// @ts-nocheck
// To update scheduleTriggeredFlowUIModel from scheduleTriggeredFlow.json, run flowTranslator.test.js and follow instructions
export const scheduleTriggeredFlowUIModel = {
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
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'Scheduled',
            filterLogic: 'no_conditions',
            startDate: '2019-11-18',
            startTime: '05:45:00.000',
            frequency: 'Once',
            object: 'Account',
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
            haveSystemVariableFields: true,
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true,
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: []
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'postToChatter',
            description: '',
            label: 'postToChatter',
            locationX: 563,
            locationY: 174,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
                    name: 'text',
                    value: 'this is a post to chatter',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
                },
                {
                    rowIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
                    name: 'subjectNameOrId',
                    value: 'Automation Builder Simplification',
                    valueDataType: 'String',
                    subtype: '',
                    isCollection: false
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
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b': {
            guid: '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
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
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            childReferences: [
                {
                    childReference: '2e01b9c4-5144-4db2-9543-7899c5c34329'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '2e01b9c4-5144-4db2-9543-7899c5c34329'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '2e01b9c4-5144-4db2-9543-7899c5c34329': {
            guid: '2e01b9c4-5144-4db2-9543-7899c5c34329',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
                    leftHandSide: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8.CreatedById',
                    rightHandSide: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8.CreatedById',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717': {
            guid: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
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
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            childReferences: [
                {
                    childReference: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1'
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
        'cc0381a7-0c64-4935-bc0c-25ecc2e958f1': {
            guid: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            name: 'waitEvent1',
            label: 'waitEvent1',
            elementType: 'WAIT_EVENT',
            dataType: 'Boolean',
            conditions: [
                {
                    rowIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
                    leftHandSide: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            conditionLogic: 'and',
            eventType: 'FlowExecutionErrorEvent',
            eventTypeIndex: '4968239c-5e3d-45ee-9339-f575c917e223',
            inputParameters: [],
            outputParameters: {
                FlowExecutionErrorEvent: {
                    rowIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0',
                    name: 'FlowExecutionErrorEvent',
                    value: '',
                    valueDataType: 'reference',
                    subtype: '',
                    isCollection: false
                }
            }
        },
        '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be': {
            guid: '7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '53329036-32e6-4965-a1d2-b12cd0344f99',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '04e1c283-fc0b-4928-a495-89d956368769'
        },
        'a193d56e-2ee7-422d-a3ff-664fc82a0fd8': {
            guid: 'a193d56e-2ee7-422d-a3ff-664fc82a0fd8',
            name: 'accountVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '41c6da8a-c6e0-418b-8b23-9906b4adab11',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'a35e28e0-3d3b-44b1-9638-9caba6ef3820'
        },
        'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1': {
            guid: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
            name: 'accounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3f1c4d9a-ea88-4c6c-85ac-6aa009601964',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2f00ca0d-743f-4639-a084-272bbc548f8b'
        },
        'a18b3d06-504c-4e47-9f44-6663c42703cf': {
            guid: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            name: 'textCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '5383bf9b-8314-42bd-a51e-cbee56ec3570',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '20336b8d-01e4-49eb-bb24-87deba5f6ef8'
        },
        '787fd564-24db-448c-ba59-ef88c8a5cbd9': {
            guid: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
            name: 'textVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'cc44cf67-84c7-4dc5-b851-44d57be8fa66',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1'
        },
        'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c': {
            guid: 'c5fd40ed-f8bb-4cea-a00d-8f3697b5731c',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '86f9f34d-e2e4-45e3-a574-78ddcd669ebf',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'a6849bcb-05b6-4898-8cc1-12ff825524c5'
        },
        '3e57f4c5-fecd-4be0-83a2-3238cdda979c': {
            guid: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            name: 'apexTypeComplexCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '7ab29c0c-3dbf-4f99-a94c-311ef891973f',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '85d76151-9bec-4869-b691-791baf964b4f'
        },
        'bb597c66-db1e-4636-85b6-31f89b320bd4': {
            guid: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
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
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            object: 'Account',
            objectIndex: '700b8f1c-98eb-48ea-90f0-35e1a864a1a8',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '956ee0bf-ff21-44f4-9917-65676160e094',
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
            outputReferenceIndex: 'e653d56e-898d-4e69-87c3-07338d100647',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59': {
            guid: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            name: 'loopAccountAutomaticOutput',
            description: 'This is a test with automatic Output',
            label: 'loopAccountAutomaticOutput',
            locationX: 491,
            locationY: 435,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            collectionReference: 'e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1',
            collectionReferenceIndex: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
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
        'a8368340-a386-4406-9118-02389237ad54': {
            guid: 'a8368340-a386-4406-9118-02389237ad54',
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
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: '787fd564-24db-448c-ba59-ef88c8a5cbd9',
            assignNextValueToReferenceIndex: '2bf626b1-9430-49ca-ad02-a75241931b16',
            collectionReference: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            collectionReferenceIndex: '6e77e9cf-2492-44ca-a088-ee4b8159d478',
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
        'a733e74b-1a25-43dc-b43c-d126c849023d': {
            guid: 'a733e74b-1a25-43dc-b43c-d126c849023d',
            name: 'loopOnTextAutomaticOutput',
            description: '',
            label: 'loopOnTextAutomaticOutput',
            locationX: 648,
            locationY: 291,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
            collectionReference: 'a18b3d06-504c-4e47-9f44-6663c42703cf',
            collectionReferenceIndex: 'be979456-fe7c-4fa6-be9f-e388ea78dd33',
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
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07': {
            guid: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
            name: 'loopOnApexTypeCollectionAutoOutput',
            description: '',
            label: 'loopOnApexTypeCollectionAutoOutput',
            locationX: 487,
            locationY: 291,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
            collectionReference: '3e57f4c5-fecd-4be0-83a2-3238cdda979c',
            collectionReferenceIndex: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
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
        }
    },
    connectors: [
        {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '7f4ddba5-e41b-456b-b686-94b257cc9914',
            source: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            childSource: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1',
            target: 'bb597c66-db1e-4636-85b6-31f89b320bd4',
            label: 'waitEvent1',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        'a4451815-988d-4f17-883d-64b6ad9fab7e',
        '297834ec-f5c8-4128-aa38-dc437f0c6a9b',
        'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
        'bb597c66-db1e-4636-85b6-31f89b320bd4',
        '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
        'a8368340-a386-4406-9118-02389237ad54',
        'a733e74b-1a25-43dc-b43c-d126c849023d',
        'bebf0e8d-339f-4227-ab7e-84d7c15daf07'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000bsOzAAI',
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
        versionNumber: 1,
        apiVersion: 50,
        isAutoLayoutCanvas: false
    }
};
