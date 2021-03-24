// To be only used by flowTranslator.test.ts DO NOT USE elsewhere
export const flowWithAssignments = {
    createdById: '005xx000001Sv6AAAS',
    createdDate: '2018-09-30T19:17:42.000+0000',
    definitionId: '300xx00000002cNAAQ',
    fieldsToNull: [],
    fullName: 'FlowWithAssignment',
    id: '301xx000000002MAAQ',
    lastModifiedById: '005xx000001Sv6AAAS',
    lastModifiedDate: '2018-09-30T19:17:42.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'FlowWithAssignment',
    metadata: {
        start: {
            locationX: 1000,
            locationY: 2000,
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        assignments: [
            {
                name: 'AssignmentWithMultipleAssignmentItems',
                description: '',
                label: 'AssignmentWithMultipleAssignmentItems',
                locationX: 256,
                locationY: 209,
                assignmentItems: [
                    {
                        assignToReference: 'VariableWithText',
                        operator: 'Assign',
                        value: {
                            stringValue: 'Hello'
                        }
                    },
                    {
                        assignToReference: 'VariableWithNumber',
                        operator: 'Add',
                        value: {
                            numberValue: '10'
                        }
                    },
                    {
                        assignToReference: 'VariableWithRecordValue',
                        operator: 'Assign',
                        value: {
                            elementReference: 'VariableWithRecordValue'
                        }
                    },
                    {
                        assignToReference: 'VariableWithNumber',
                        operator: 'Subtract',
                        value: {
                            numberValue: '2'
                        }
                    }
                ]
            }
        ],
        variables: [
            {
                name: 'VariableWithDate',
                description: '',
                dataType: 'Date',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'VariableWithNumber',
                description: '',
                dataType: 'Number',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 2,
                value: {
                    numberValue: '10'
                }
            },
            {
                name: 'VariableWithRecordValue',
                description: '',
                objectType: 'Account',
                dataType: 'SObject',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'VariableWithText',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    stringValue: 'Hello World!!'
                }
            }
        ],
        description: '',
        interviewLabel: 'FlowWithAssignment {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'FlowWithAssignment',
        processMetadataValues: [
            {
                name: 'BuilderType',
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
        processType: 'AutoLaunchedFlow',
        runInMode: null,
        status: 'InvalidDraft',
        apiVersion: 49
    },
    processType: 'AutoLaunchedFlow',
    status: 'InvalidDraft',
    versionNumber: 1
};
