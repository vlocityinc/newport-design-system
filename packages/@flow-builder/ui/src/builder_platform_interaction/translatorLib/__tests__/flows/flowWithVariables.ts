// To be only used by flowTranslator.test.ts DO NOT USE elsewhere
export const flowWithVariables = {
    createdById: '005xx000001Sv6AAAS',
    createdDate: '2018-09-30T18:50:26.000+0000',
    definitionId: '300xx00000002cIAAQ',
    fieldsToNull: [],
    fullName: 'FlowWithVariables',
    id: '301xx000000002HAAQ',
    lastModifiedById: '005xx000001Sv6AAAS',
    lastModifiedDate: '2018-09-30T18:50:27.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'FlowWithVariables',
    metadata: {
        start: {
            locationX: 1000,
            locationY: 2000,
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        variables: [
            {
                name: 'VariableWithBooleanValue',
                description: '',
                dataType: 'Boolean',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    booleanValue: true
                }
            },
            {
                name: 'VariableWithCollection',
                description: '',
                dataType: 'String',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'VariableWithCurrencyValue',
                description: '',
                dataType: 'Currency',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 2,
                value: {
                    numberValue: '10'
                }
            },
            {
                name: 'VariableWithDateTimeValue',
                description: '',
                dataType: 'DateTime',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    dateTimeValue: '2018-09-04T07:00:00.000+0000'
                }
            },
            {
                name: 'VariableWithDateValue',
                description: '',
                dataType: 'Date',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    dateValue: '2018-09-03T00:00:00.000+0000'
                }
            },
            {
                name: 'VariableWithElementReference',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    elementReference: 'VariableWithTextValue'
                }
            },
            {
                name: 'VariableWithNumberValue',
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
                name: 'VariableWithRecordCollection',
                description: '',
                objectType: 'Account',
                dataType: 'SObject',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
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
                name: 'VariableWithStringValue',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    stringValue: 'Hello {!VariableWithTextValue}'
                }
            },
            {
                name: 'VariableWithTextValue',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0,
                value: {
                    stringValue: 'abc'
                }
            }
        ],
        description: '',
        interviewLabel: 'FlowWithVariables {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'FlowWithVariables',
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
        apiVersion: 50
    },
    processType: 'AutoLaunchedFlow',
    status: 'InvalidDraft',
    versionNumber: 1
};
