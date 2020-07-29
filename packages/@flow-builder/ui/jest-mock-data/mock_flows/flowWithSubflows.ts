// @ts-nocheck
export const flowWithSubflows = {
    createdById: '005xx000001X7dFAAS',
    createdDate: '2018-12-27T10:01:02.000+0000',
    definitionId: '300xx000000bnlNAAQ',
    fieldsToNull: [],
    fullName: 'Flow_with_all_types_variables',
    id: '301xx000003GZb1AAG',
    lastModifiedBy: {
        fieldsToNull: [],
        name: 'Admin User'
    },
    lastModifiedById: '005xx000001X7dFAAS',
    lastModifiedDate: '2018-12-27T10:01:09.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'Flow with all types variables',
    metadata: {
        start: {
            locationX: 35,
            locationY: 46,
            connector: {
                targetReference: 'Flow_With_All_Types_Variables'
            },
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        variables: [
            {
                name: 'accountSObjectCollectionVariable',
                description: '',
                objectType: 'Account',
                dataType: 'SObject',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'accountSObjectVariable',
                description: '',
                objectType: 'Account',
                dataType: 'SObject',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'booleanVariable',
                description: '',
                dataType: 'Boolean',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'caseSObjectVariable',
                description: '',
                objectType: 'Case',
                dataType: 'SObject',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'currencyCollectionVariable',
                description: '',
                dataType: 'Currency',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 2
            },
            {
                name: 'currencyVariable',
                description: '',
                dataType: 'Currency',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 2
            },
            {
                name: 'dateTimeVariable',
                description: '',
                dataType: 'DateTime',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'dateVariable',
                description: '',
                dataType: 'Date',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'numberCollectionVariable',
                description: '',
                dataType: 'Number',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 2
            },
            {
                name: 'numberVariable',
                description: '',
                dataType: 'Number',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 2
            },
            {
                name: 'stringCollectionVariable',
                description: '',
                dataType: 'String',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'stringVariable',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            }
        ],
        subflows: [
            {
                name: 'Flow_With_All_Types_Variables',
                description: '',
                label: 'Flow With All Types Variables',
                locationX: 250,
                locationY: 88,
                flowName: 'FlowWithAllTypesVariables',
                inputAssignments: [
                    {
                        name: 'inputOutputAccountColVar',
                        value: {
                            elementReference: 'accountSObjectCollectionVariable'
                        }
                    },
                    {
                        name: 'inputOutputAccountVar',
                        value: {
                            elementReference: 'accountSObjectVariable'
                        }
                    },
                    {
                        name: 'inputOutputBoolVar',
                        value: {
                            elementReference: 'booleanVariable'
                        }
                    },
                    {
                        name: 'inputOutputCurrencyVar',
                        value: {
                            elementReference: 'currencyVariable'
                        }
                    },
                    {
                        name: 'inputOutputDateTimeVar',
                        value: {
                            elementReference: 'dateTimeVariable'
                        }
                    },
                    {
                        name: 'inputOutputDateVar',
                        value: {
                            elementReference: 'dateVariable'
                        }
                    },
                    {
                        name: 'inputOutputNumberVar',
                        value: {
                            elementReference: 'numberVariable'
                        }
                    },
                    {
                        name: 'inputOutputNumberVar',
                        value: {
                            elementReference: 'numberVariable'
                        }
                    },
                    {
                        name: 'inputNotAvailableParam',
                        value: {
                            elementReference: 'stringVariable'
                        }
                    },
                    {
                        name: 'inputOutputStringVar',
                        value: {
                            elementReference: 'stringVariable'
                        }
                    }
                ],
                outputAssignments: [
                    {
                        name: 'inputOutputAccountColVar',
                        assignToReference: 'accountSObjectCollectionVariable'
                    },
                    {
                        name: 'inputOutputAccountVar',
                        assignToReference: 'accountSObjectVariable'
                    },
                    {
                        name: 'inputOutputBoolVar',
                        assignToReference: 'booleanVariable'
                    },
                    {
                        name: 'inputOutputCurrencyVar',
                        assignToReference: 'currencyVariable'
                    },
                    {
                        name: 'inputOutputDateTimeVar',
                        assignToReference: 'dateVariable'
                    },
                    {
                        name: 'inputOutputDateVar',
                        assignToReference: 'dateVariable'
                    },
                    {
                        name: 'inputOutputNumberVar',
                        assignToReference: 'numberVariable'
                    },
                    {
                        name: 'inputOutputNumberVar',
                        assignToReference: 'numberVariable'
                    },
                    {
                        name: 'outputNotAvailableParam',
                        assignToReference: 'stringVariable'
                    },
                    {
                        name: 'inputOutputStringColVar',
                        assignToReference: 'stringCollectionVariable'
                    },
                    {
                        name: 'inputOutputStringVar',
                        assignToReference: 'stringVariable'
                    },
                    {
                        name: 'latestOutputStringColVar',
                        assignToReference: 'stringCollectionVariable'
                    },
                    {
                        name: 'latestOutputStringVar',
                        assignToReference: 'stringVariable'
                    }
                ],
                storeOutputAutomatically: false
            }
        ],
        description: '',
        interviewLabel: 'Flow with all types variables {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'Flow with all types variables',
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
        status: 'Draft'
    },
    processType: 'Flow',
    status: 'Draft',
    versionNumber: 1
};
