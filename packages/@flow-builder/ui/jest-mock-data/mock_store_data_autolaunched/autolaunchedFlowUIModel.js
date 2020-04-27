// To update autolaunchedFlowUIModel from autoLaunchedFlow, run flowTranslator.test.js and follow instructions
export const autolaunchedFlowUIModel = {
    elements: {
        'e62ce284-ccf2-46af-8446-c0a110a4bba0': {
            guid: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
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
                isSelectable: true
            },
            elementType: 'START_ELEMENT',
            maxConnections: 1,
            triggerType: 'Scheduled',
            filterType: 'none',
            startDate: '2019-11-18',
            startTime: '05:45:00.000',
            frequency: 'Once',
            object: 'Account',
            objectIndex: '34ff5f58-8d99-470d-a755-a2aa0dc69f59',
            filters: [],
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true
        },
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6': {
            guid: '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
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
                isSelectable: true
            },
            actionType: 'chatterPost',
            actionName: 'chatterPost',
            dataTypeMappings: [],
            inputParameters: [
                {
                    rowIndex: '4b09a9f9-b658-4b5d-90c5-cbdb83b6484b',
                    name: 'text',
                    value: 'this is a post to chatter',
                    valueDataType: 'String'
                },
                {
                    rowIndex: 'bebf0e8d-339f-4227-ab7e-84d7c15daf07',
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
        'b93ea139-c9df-49cb-a42e-52c5f496ab07': {
            guid: 'b93ea139-c9df-49cb-a42e-52c5f496ab07',
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
                isSelectable: true
            },
            outcomeReferences: [
                {
                    outcomeReference: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '8573e2d4-ccfb-4701-be66-e38b54ba7375'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '8573e2d4-ccfb-4701-be66-e38b54ba7375': {
            guid: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
                    leftHandSide: 'ba8a8e41-3944-4099-9655-065f054e811f.CreatedById',
                    rightHandSide: 'ba8a8e41-3944-4099-9655-065f054e811f.CreatedById',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ]
        },
        '3f70f36b-030f-4b90-ba09-866642ba5d4b': {
            guid: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
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
                isSelectable: true
            },
            waitEventReferences: [
                {
                    waitEventReference: 'cf5e6188-117a-47c0-a493-7ed460484c87'
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
        'cf5e6188-117a-47c0-a493-7ed460484c87': {
            guid: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            name: 'waitEvent1',
            label: 'waitEvent1',
            elementType: 'WAIT_EVENT',
            dataType: 'Boolean',
            conditions: [
                {
                    rowIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    leftHandSide: 'eb19f518-e185-488c-a5b2-9107036766f4',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            conditionLogic: 'and',
            eventType: 'FlowExecutionErrorEvent',
            eventTypeIndex: '6afc7b95-a112-4bd0-99e6-4114704080f2',
            inputParameters: [],
            outputParameters: {
                FlowExecutionErrorEvent: {
                    rowIndex: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
                    name: 'FlowExecutionErrorEvent',
                    value: '',
                    valueDataType: 'reference'
                }
            }
        },
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            scale: 0,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34'
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
            name: 'accountVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7'
        },
        '9b2579d0-01d3-45b0-b6b2-bb016b085511': {
            guid: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            name: 'accounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '56095468-2459-481d-b084-04a05babcb22',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9'
        },
        '48cb0159-3cde-48ad-9877-644e3cc4b5e9': {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            name: 'textCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10'
        },
        'e5b4998c-a36e-407f-afb7-2301eda53b8d': {
            guid: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            name: 'textVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c'
        },
        '54aae715-8881-4a52-b7a9-25c385d1488e': {
            guid: '54aae715-8881-4a52-b7a9-25c385d1488e',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9'
        },
        '8d53a0e4-6541-42d0-9ea1-665b504fd150': {
            guid: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            name: 'apexTypeComplexCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9d11ba05-33c4-4893-87b8-9560be9557d2'
        },
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2': {
            guid: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
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
                isSelectable: true
            },
            object: 'Account',
            objectIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            filterType: 'none',
            filters: [
                {
                    rowIndex: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
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
            outputReferenceIndex: '5e2803c7-a184-465c-92e3-1d29634f2114',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd': {
            guid: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
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
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
            collectionReference: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            collectionReferenceIndex: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
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
        'f08f384a-8e8f-40d3-8009-f8e1fb16eac4': {
            guid: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
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
                isSelectable: true
            },
            assignNextValueToReference: 'e5b4998c-a36e-407f-afb7-2301eda53b8d',
            assignNextValueToReferenceIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
            collectionReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            collectionReferenceIndex: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
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
        'fcf61595-af2e-4982-9607-5de1c2819fab': {
            guid: 'fcf61595-af2e-4982-9607-5de1c2819fab',
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
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            collectionReference: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
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
            storeOutputAutomatically: true,
            dataType: 'String',
            subtype: null
        },
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc': {
            guid: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
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
                isSelectable: true
            },
            assignNextValueToReference: null,
            assignNextValueToReferenceIndex: 'd7b1d0e5-68d7-4734-b1d1-01247631d93f',
            collectionReference: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            collectionReferenceIndex: '37c4575e-32f8-46d9-aeea-737953c256b2',
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
            guid: 'ade42d1f-d120-4ff9-9888-c202b289571c',
            source: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            childSource: null,
            target: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '3147a31d-26a3-408c-b00b-a31983df0da5',
            source: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            childSource: 'cf5e6188-117a-47c0-a493-7ed460484c87',
            target: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            label: 'waitEvent1',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        'e62ce284-ccf2-46af-8446-c0a110a4bba0',
        '6cb9b58e-4246-44c0-85a9-8f7d32172da6',
        'b93ea139-c9df-49cb-a42e-52c5f496ab07',
        '3f70f36b-030f-4b90-ba09-866642ba5d4b',
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
        '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
        'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
        'fcf61595-af2e-4982-9607-5de1c2819fab',
        'b8c16d53-6fcd-458c-b3e6-51f2658308bc'
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
        versionNumber: 1
    }
};
