// @ts-nocheck
// To update recordTriggeredFlowUIModel from recordTriggeredFlow, run flowTranslator.test.js and follow instructions
export const recordTriggeredFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            name: '$Record',
            description: '',
            locationX: 170,
            locationY: 53,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementType: 'START_ELEMENT',
            maxConnections: 3,
            triggerType: 'RecordAfterSave',
            filterLogic: 'and',
            recordTriggerType: 'Update',
            object: 'Account',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
                    leftHandSide: 'Account.BillingCity',
                    rightHandSide: 'San Francisco',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            dataType: 'SObject',
            subtype: 'Account',
            isCollection: false,
            isAssignable: true,
            doesRequireRecordChangedToMeetCriteria: true,
            childReferences: [
                {
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                },
                {
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                }
            ],
            availableConnections: [
                {
                    type: 'REGULAR',
                    childReference: 'a4451815-988d-4f17-883d-64b6ad9fab7e'
                },
                {
                    type: 'REGULAR',
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                },
                {
                    type: 'IMMEDIATE'
                }
            ]
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'myTimeTrigger2DaysBefore',
            label: 'myTimeTrigger2DaysBefore',
            elementType: 'TimeTrigger',
            dataType: 'Boolean',
            timeSource: 'CreatedDate',
            offsetUnit: 'DaysBefore',
            offsetNumber: '2'
        },
        'fc408daa-3152-46bf-8733-c1083018292b': {
            guid: 'fc408daa-3152-46bf-8733-c1083018292b',
            name: 'myTimeTriggerHoursAfter',
            label: 'myTimeTriggerHoursAfter',
            elementType: 'TimeTrigger',
            dataType: 'Boolean',
            timeSource: 'LastModifiedDate',
            offsetUnit: 'HoursAfter',
            offsetNumber: '4'
        },
        '6d690706-908c-4d94-9513-1b219301b4c5': {
            guid: '6d690706-908c-4d94-9513-1b219301b4c5',
            name: 'assign',
            description: '',
            label: 'assign',
            locationX: 623,
            locationY: 403,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: null,
            assignmentItems: [
                {
                    rowIndex: '90246d76-2818-4059-b0fd-425e241f8708',
                    leftHandSide: '$Record.Description',
                    rightHandSide: '$Record__Prior.AnnualRevenue',
                    rightHandSideDataType: 'reference',
                    operator: 'Add'
                }
            ],
            maxConnections: 1,
            elementType: 'Assignment'
        },
        'e682f03e-925a-4d84-adc3-f1c5ceea0201': {
            guid: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
            name: 'decision',
            description: '',
            label: 'decision',
            locationX: 815,
            locationY: 408,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            elementSubtype: null,
            childReferences: [
                {
                    childReference: '297834ec-f5c8-4128-aa38-dc437f0c6a9b'
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
                    leftHandSide: '$Record__Prior.Name',
                    rightHandSide: 'theAccount',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            doesRequireRecordChangedToMeetCriteria: false
        },
        'fe30ada4-6781-4ffd-84d1-9efbadaa29ab': {
            guid: 'fe30ada4-6781-4ffd-84d1-9efbadaa29ab',
            name: 'accountSObjectVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'SObject',
            subtype: 'Account',
            subtypeIndex: 'bf05168b-6bd9-483a-8ea8-5e4d73a1c717',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: 'cc0381a7-0c64-4935-bc0c-25ecc2e958f1'
        },
        '4968239c-5e3d-45ee-9339-f575c917e223': {
            guid: '4968239c-5e3d-45ee-9339-f575c917e223',
            name: 'stringVariable',
            description: '',
            elementType: 'Variable',
            isCollection: false,
            isInput: false,
            isOutput: false,
            dataType: 'String',
            subtype: null,
            subtypeIndex: 'ed85c895-feb5-45cb-b486-49cfd9da8e20',
            scale: 2,
            defaultValue: null,
            defaultValueDataType: null,
            defaultValueIndex: '0ecd3000-0adc-4d34-bdc1-acd331740de0'
        }
    },
    connectors: [],
    canvasElements: [
        '07fd2a44-4192-4709-888d-8ccc18cb4580',
        '6d690706-908c-4d94-9513-1b219301b4c5',
        'e682f03e-925a-4d84-adc3-f1c5ceea0201'
    ],
    properties: {
        canOnlySaveAsNewDefinition: false,
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'RecordTriggeredFlow {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'RecordTriggeredFlow',
        lastModifiedBy: null,
        lastModifiedDate: null,
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'RecordTriggeredFlow',
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'InvalidDraft',
        versionNumber: 1,
        apiVersion: 51,
        isAutoLayoutCanvas: false
    }
};
