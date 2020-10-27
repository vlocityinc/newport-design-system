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
            doesRequireRecordChangedToMeetCriteria: false,
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
        }
    },
    connectors: [],
    canvasElements: ['07fd2a44-4192-4709-888d-8ccc18cb4580'],
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
