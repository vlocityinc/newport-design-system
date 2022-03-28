// To update flowOnSlackUIModel from flowOnSlack.json, run flowTranslator.test.js and follow instructions
export const flowOnSlackUIModel = {
    elements: {
        '07fd2a44-4192-4709-888d-8ccc18cb4580': {
            guid: '07fd2a44-4192-4709-888d-8ccc18cb4580',
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
            triggerType: 'None',
            filterLogic: 'and',
            object: '',
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
            doesRequireRecordChangedToMeetCriteria: false,
            childReferences: [],
            availableConnections: [],
            shouldSupportScheduledPaths: false
        },
        'a4451815-988d-4f17-883d-64b6ad9fab7e': {
            guid: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            name: 'Screen1',
            description: '',
            label: 'Screen1',
            locationX: 176,
            locationY: 158,
            isCanvasElement: true,
            connectorCount: 0,
            config: {
                isSelected: false,
                isHighlighted: false,
                isSelectable: true,
                hasError: false
            },
            canHaveFaultConnector: false,
            allowHelp: false,
            pauseMessageType: 'standard',
            helpText: '',
            pausedText: '',
            showFooter: true,
            showHeader: true,
            nextOrFinishLabelType: 'standard',
            backLabelType: 'standard',
            pauseLabelType: 'standard',
            childReferences: [
                {
                    childReference: 'fc408daa-3152-46bf-8733-c1083018292b'
                }
            ],
            elementType: 'Screen',
            maxConnections: 1
        },
        'fc408daa-3152-46bf-8733-c1083018292b': {
            guid: 'fc408daa-3152-46bf-8733-c1083018292b',
            name: 'myDispText',
            choiceReferences: [],
            defaultValue: '',
            defaultValueIndex: '6d690706-908c-4d94-9513-1b219301b4c5',
            validationRule: {
                formulaExpression: null,
                errorMessage: null
            },
            fieldType: 'DisplayText',
            fieldText: '',
            hasHeading: false,
            helpText: '',
            inputParameters: [],
            isNewField: false,
            isRequired: false,
            outputParameters: [],
            scale: '0',
            type: {
                name: 'DisplayText',
                fieldType: 'DisplayText',
                label: 'FlowBuilderScreenEditor.fieldTypeLabelDisplayText',
                icon: 'standard:display_text',
                category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
                type: 'String'
            },
            elementType: 'SCREEN_FIELD',
            visibilityRule: {
                conditionLogic: 'no_conditions',
                conditions: []
            },
            fields: [],
            childReferences: []
        }
    },
    connectors: [
        {
            guid: '3f91c315-f597-4dc0-bd4e-1f27a8fa59e3',
            source: '07fd2a44-4192-4709-888d-8ccc18cb4580',
            childSource: null,
            target: 'a4451815-988d-4f17-883d-64b6ad9fab7e',
            label: null,
            type: 'REGULAR',
            config: {
                isSelected: false
            }
        }
    ],
    canvasElements: ['07fd2a44-4192-4709-888d-8ccc18cb4580', 'a4451815-988d-4f17-883d-64b6ad9fab7e'],
    properties: {
        canOnlySaveAsNewDefinition: false,
        definitionId: '300xx000000bnh3AAA',
        description: '',
        elementType: 'FLOW_PROPERTIES',
        hasUnsavedChanges: false,
        interviewLabel: 'FlowOnSlack {!$Flow.CurrentDateTime}',
        isCreatedOutsideLfb: false,
        isLightningFlowBuilder: true,
        isTemplate: false,
        label: 'FlowOnSlack',
        lastModifiedBy: 'User User',
        lastModifiedDate: '2022-03-22T17:44:19.000+0000',
        lastInlineResourceGuid: null,
        lastInlineResourcePosition: null,
        lastInlineResourceRowIndex: null,
        name: 'FlowOnSlack',
        processType: 'Flow',
        runInMode: null,
        status: 'Draft',
        versionNumber: 1,
        apiVersion: 55,
        isAutoLayoutCanvas: true,
        isOverridable: false,
        overriddenFlow: null,
        sourceTemplate: null,
        migratedFromWorkflowRuleName: null,
        environments: ['Slack']
    }
};
