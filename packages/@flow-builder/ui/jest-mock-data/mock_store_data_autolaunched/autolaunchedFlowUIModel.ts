// @ts-nocheck
// To update autolaunchedFlowUIModel from autoLaunchedFlow, run flowTranslator.test.js and follow instructions
export const autolaunchedFlowUIModel = {
    elements: {
        '8573e2d4-ccfb-4701-be66-e38b54ba7375': {
            guid: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
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
            filterLogic: 'no_conditions',
            startDate: '2019-11-18',
            startTime: '05:45:00.000',
            frequency: 'Once',
            object: 'Account',
            objectIndex: 'ebedaf4c-b899-4660-bf34-b2c569bda3c9',
            filters: [],
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true
        },
        'cf5e6188-117a-47c0-a493-7ed460484c87': {
            guid: 'cf5e6188-117a-47c0-a493-7ed460484c87',
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
                    rowIndex: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
                    name: 'text',
                    value: 'this is a post to chatter',
                    valueDataType: 'String'
                },
                {
                    rowIndex: '3147a31d-26a3-408c-b00b-a31983df0da5',
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
        'eb19f518-e185-488c-a5b2-9107036766f4': {
            guid: 'eb19f518-e185-488c-a5b2-9107036766f4',
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
                    outcomeReference: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
                }
            ],
            defaultConnectorLabel: 'Default Outcome',
            elementType: 'Decision',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910'
                },
                {
                    type: 'DEFAULT'
                }
            ]
        },
        '70926b3b-6a78-4e62-a62b-0c6d4c4ca910': {
            guid: '70926b3b-6a78-4e62-a62b-0c6d4c4ca910',
            name: 'outcome',
            label: 'outcome',
            elementType: 'OUTCOME',
            dataType: 'Boolean',
            conditionLogic: 'and',
            conditions: [
                {
                    rowIndex: '34eaa6ff-765e-4c12-8635-b00f6c7f2c34',
                    leftHandSide: 'e5b4998c-a36e-407f-afb7-2301eda53b8d.CreatedById',
                    rightHandSide: 'e5b4998c-a36e-407f-afb7-2301eda53b8d.CreatedById',
                    rightHandSideDataType: 'reference',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'ba8a8e41-3944-4099-9655-065f054e811f': {
            guid: 'ba8a8e41-3944-4099-9655-065f054e811f',
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
                    waitEventReference: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e'
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
        '4afdbe2b-6b5a-4da3-887d-5b755f53b64e': {
            guid: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            name: 'waitEvent1',
            label: 'waitEvent1',
            elementType: 'WAIT_EVENT',
            dataType: 'Boolean',
            conditions: [
                {
                    rowIndex: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
                    leftHandSide: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
                    rightHandSide: 'text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            conditionLogic: 'and',
            eventType: 'FlowExecutionErrorEvent',
            eventTypeIndex: '97a7048c-7323-4356-93c4-30995cf2c8c7',
            inputParameters: [],
            outputParameters: {
                FlowExecutionErrorEvent: {
                    rowIndex: '56095468-2459-481d-b084-04a05babcb22',
                    name: 'FlowExecutionErrorEvent',
                    value: '',
                    valueDataType: 'reference'
                }
            }
        },
        '48cb0159-3cde-48ad-9877-644e3cc4b5e9': {
            guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            name: 'stringVariable',
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
            name: 'accountVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '7bbacaec-c6f9-4188-9af4-a32993e0abbd',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2635dcd9-5d1d-4d46-b683-eabd7059690c'
        },
        '54aae715-8881-4a52-b7a9-25c385d1488e': {
            guid: '54aae715-8881-4a52-b7a9-25c385d1488e',
            name: 'accounts',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9'
        },
        '8d53a0e4-6541-42d0-9ea1-665b504fd150': {
            guid: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            name: 'textCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'f35b9254-9177-4813-84c0-92bc3dd1e922',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '9d11ba05-33c4-4893-87b8-9560be9557d2'
        },
        'ead8ca09-bffd-47ee-93c2-7ebeaf14def2': {
            guid: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            name: 'textVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '5e2803c7-a184-465c-92e3-1d29634f2114'
        },
        'd050fa16-f494-4685-a87f-3c68666d1ba8': {
            guid: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
            name: 'apexComplexTypeVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '2d1ada73-88e9-4cf4-a814-dcba8d517104'
        },
        '76bbf8c2-9a5e-4a03-a84f-a518866d7963': {
            guid: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            name: 'apexTypeComplexCollection',
            description: '',
            elementType: 'Variable',
            isCollection: true,
            isInput: false,
            isOutput: false,
            dataType: 'Apex',
            subtype: 'ApexComplexTypeTestOne216',
            subtypeIndex: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '756e3b06-1ee6-4f8e-82b2-ce141c9405db'
        },
        'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7': {
            guid: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
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
            objectIndex: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            filterLogic: 'no_conditions',
            filters: [
                {
                    rowIndex: '1283ede6-414b-45a2-851a-1b113f26bffd',
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
            outputReferenceIndex: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
            dataType: 'SObject',
            isCollection: false,
            subtype: 'Account',
            storeOutputAutomatically: true,
            getFirstRecordOnly: true,
            variableAndFieldMapping: 'automatic'
        },
        '0883ba56-46a4-4420-8105-c9d17ad0183b': {
            guid: '0883ba56-46a4-4420-8105-c9d17ad0183b',
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
            assignNextValueToReferenceIndex: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            collectionReference: '54aae715-8881-4a52-b7a9-25c385d1488e',
            collectionReferenceIndex: '42afe63b-0744-4dec-a7e6-20c67691dd81',
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
        '476ffd9b-6322-4bfa-969e-0d63bce36f32': {
            guid: '476ffd9b-6322-4bfa-969e-0d63bce36f32',
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
            assignNextValueToReference: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
            assignNextValueToReferenceIndex: '97e556fe-63c0-4426-9421-b3dc0d5a74aa',
            collectionReference: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            collectionReferenceIndex: '8e3cf25f-1ce2-48c8-9634-b192b94ae230',
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
        '02504510-b361-4fb3-878e-81925a76160f': {
            guid: '02504510-b361-4fb3-878e-81925a76160f',
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
            assignNextValueToReferenceIndex: '26b1d461-e66e-41c7-bb0e-5c86b04280db',
            collectionReference: '8d53a0e4-6541-42d0-9ea1-665b504fd150',
            collectionReferenceIndex: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
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
        '4d5723fe-7d36-4044-8f59-1f6da02eacbe': {
            guid: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
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
            assignNextValueToReferenceIndex: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            collectionReference: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
            collectionReferenceIndex: '796969f1-a892-4b16-836e-209180057a2b',
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
            guid: '3f70f36b-030f-4b90-ba09-866642ba5d4b',
            source: '8573e2d4-ccfb-4701-be66-e38b54ba7375',
            childSource: null,
            target: 'ba8a8e41-3944-4099-9655-065f054e811f',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        },
        {
            guid: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            source: 'ba8a8e41-3944-4099-9655-065f054e811f',
            childSource: '4afdbe2b-6b5a-4da3-887d-5b755f53b64e',
            target: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
            label: 'waitEvent1',
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: [
        '8573e2d4-ccfb-4701-be66-e38b54ba7375',
        'cf5e6188-117a-47c0-a493-7ed460484c87',
        'eb19f518-e185-488c-a5b2-9107036766f4',
        'ba8a8e41-3944-4099-9655-065f054e811f',
        'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
        '0883ba56-46a4-4420-8105-c9d17ad0183b',
        '476ffd9b-6322-4bfa-969e-0d63bce36f32',
        '02504510-b361-4fb3-878e-81925a76160f',
        '4d5723fe-7d36-4044-8f59-1f6da02eacbe'
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
