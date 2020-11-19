// @ts-nocheck
// Used by invocableActionEditorIntegration.test.js for W-5715080
export const flowWithApexActionSubmitForApproval = {
    createdById: '005xx000001X7i5AAC',
    createdDate: '2018-12-21T10:30:25.000+0000',
    definitionId: '300xx000000boSvAAI',
    fieldsToNull: [],
    fullName: 'submitForApprovalBug',
    id: '301xx000003Gas3AAC',
    lastModifiedBy: {
        fieldsToNull: [],
        name: 'User User'
    },
    lastModifiedById: '005xx000001X7i5AAC',
    lastModifiedDate: '2018-12-21T10:30:26.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'submitForApprovalBug',
    metadata: {
        start: {
            locationX: 49,
            locationY: 60,
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        actionCalls: [
            {
                name: 'submitForApproval',
                description: '',
                label: 'submitForApproval',
                locationX: 381,
                locationY: 305,
                actionType: 'submit',
                actionName: 'submit',
                inputParameters: [
                    {
                        name: 'nextApproverIds',
                        value: {
                            elementReference: 'textColVar'
                        }
                    },
                    {
                        name: 'objectId',
                        value: {
                            stringValue: ''
                        }
                    }
                ],
                outputParameters: [],
                storeOutputAutomatically: true
            }
        ],
        variables: [
            {
                name: 'textColVar',
                description: '',
                dataType: 'String',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
            }
        ],
        description: '',
        interviewLabel: 'submitForApprovalBug {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'submitForApprovalBug',
        processMetadataValues: [
            {
                name: 'BuilderType',
                value: {
                    stringValue: 'LightningFlowBuilder'
                }
            },
            {
                name: 'OriginBuilderType',
                value: {
                    stringValue: 'LightningFlowBuilder'
                }
            },
            {
                name: 'CanvasMode',
                value: {
                    stringValue: 'FREE_FORM_CANVAS'
                }
            }
        ],
        processType: 'Flow',
        runInMode: null,
        status: 'InvalidDraft'
    },
    processType: 'Flow',
    status: 'InvalidDraft',
    versionNumber: 1
};
