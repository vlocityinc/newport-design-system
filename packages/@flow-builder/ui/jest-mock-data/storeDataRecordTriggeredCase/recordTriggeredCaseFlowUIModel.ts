// To update recordTriggeredCaseFlowUIModel from recordTriggeredCaseFlow, run flowTranslator.test.js and follow instructions
export const recordTriggeredCaseFlowUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            name: '$Record',
            description: '',
            locationX: 50,
            locationY: 0,
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
            triggerType: 'RecordAfterSave',
            filterLogic: 'no_conditions',
            recordTriggerType: 'Create',
            object: 'Case',
            objectIndex: '4c1d2c56-9528-42a8-9de2-9bdf12e87a1b',
            filters: [
                {
                    rowIndex: '703162a5-d48f-40b6-b52e-ec4e1944ba34',
                    leftHandSide: '',
                    leftHandSideDataType: 'String',
                    rightHandSide: '',
                    rightHandSideDataType: '',
                    operator: ''
                }
            ],
            haveSystemVariableFields: true,
            dataType: 'SObject',
            subtype: 'Case',
            isCollection: false,
            isAssignable: true,
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: [],
            shouldSupportScheduledPaths: true,
            defaultConnectorLabel: 'FlowBuilderConnectorLabels.immediateConnectorLabel'
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'update_related_owner_user',
            description: '',
            label: 'update related owner user',
            locationX: 176,
            locationY: 335,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: true,
            inputReference: '$Record.Owner:User',
            inputReferenceIndex: 'fc408daa-3152-46bf-8733-c1083018292b',
            maxConnections: 2,
            availableConnections: [
                {
                    type: 'REGULAR'
                },
                {
                    type: 'FAULT'
                }
            ],
            elementType: 'RecordUpdate',
            inputAssignments: [
                {
                    rowIndex: '90246d76-2818-4059-b0fd-425e241f8708',
                    leftHandSide: '.City',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'paris',
                    rightHandSideDataType: 'String'
                },
                {
                    rowIndex: 'e682f03e-925a-4d84-adc3-f1c5ceea0201',
                    leftHandSide: '.Country',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'france',
                    rightHandSideDataType: 'String'
                }
            ],
            filters: [
                {
                    rowIndex: '2e01b9c4-5144-4db2-9543-7899c5c34329',
                    leftHandSide: '.BadgeText',
                    leftHandSideDataType: 'String',
                    rightHandSide: 'my badge text',
                    rightHandSideDataType: 'String',
                    operator: 'EqualTo'
                }
            ],
            filterLogic: 'and',
            object: '',
            objectIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
            dataType: 'Boolean',
            wayToFindRecords: 'relatedRecordLookup'
        }
    },
    connectors: [
        {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            label: 'FlowBuilderConnectorLabels.immediateConnectorLabel',
            type: 'IMMEDIATE',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: ['07fd2a44-4192-4709-888d-8ccc18cb4580', 'a4451815-988d-4f17-883d-64b6ad9fab7e'],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300RM0000004dtrYAA',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'related update of case owner user {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'related update of case owner user',
        lastModifiedBy: 'franck thomas',
        lastModifiedDate: '2022-08-08T11:30:04.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'related_update_of_case_owner_user',
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'Draft',
        versionNumber: 1,
        apiVersion: 57,
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Default'],
        timeZoneSidKey: null
    }
};
