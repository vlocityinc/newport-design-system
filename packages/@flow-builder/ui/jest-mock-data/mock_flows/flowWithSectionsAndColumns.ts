export const flowWithSectionsAndColumns = {
    apiVersion: 50,
    canOnlySaveAsNewDefinition: false,
    createdById: '005xx000001X8unAAC',
    createdDate: '2020-08-02T18:14:53.000+0000',
    definitionId: '300RM0000000FIxYAM',
    description: '',
    elementType: 'FLOW_PROPERTIES',
    hasUnsavedChanges: true,
    interviewLabel: 'flow1 {!$Flow.CurrentDateTime}',
    isAutoLayoutCanvas: false,
    isCreatedOutsideLfb: false,
    isLightningFlowBuilder: true,
    isTemplate: false,
    label: 'myScreenSectionsAndColumns',
    lastInlineResourceGuid: null,
    lastInlineResourcePosition: null,
    lastInlineResourceRowIndex: null,
    lastModifiedBy: 'Admin User',
    lastModifiedDate: '2020-08-04T21:23:19.000+0000',
    metadata: {
        start: {
            locationX: 50,
            locationY: 50,
            connector: {
                targetReference: 'Screen1'
            },
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        screens: [
            {
                name: 'Screen1',
                description: '',
                label: 'Screen1',
                locationX: 230,
                locationY: 271,
                connector: {
                    targetReference: 'Screen2'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'RegionContainer',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Screen1_Section1',
                        outputParameters: [],
                        scale: 0,
                        fields: [
                            {
                                choiceReferences: [],
                                fieldText: '',
                                fieldType: 'Region',
                                helpText: '',
                                inputParameters: [
                                    {
                                        name: 'width',
                                        value: {
                                            stringValue: '12'
                                        }
                                    }
                                ],
                                isRequired: false,
                                name: 'Screen1_Section1_Column1',
                                outputParameters: [],
                                scale: 0,
                                fields: [
                                    {
                                        choiceReferences: [],
                                        fieldText: '',
                                        fieldType: 'ComponentInstance',
                                        helpText: '',
                                        inputParameters: [
                                            {
                                                name: 'label',
                                                value: {
                                                    stringValue: 'slider_1'
                                                }
                                            }
                                        ],
                                        isRequired: true,
                                        name: 'slider_1',
                                        outputParameters: [],
                                        scale: 0,
                                        fields: [],
                                        storeOutputAutomatically: true,
                                        extensionName: 'flowruntime:slider'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [],
                        isRequired: true,
                        name: 'address_1',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        storeOutputAutomatically: true,
                        extensionName: 'flowruntime:address'
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Screen2',
                description: '',
                label: 'Screen2',
                locationX: 384,
                locationY: 247,
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        dataType: 'Number',
                        fieldText: '',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'number_2',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'RegionContainer',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Screen2_Section1',
                        outputParameters: [],
                        scale: 0,
                        fields: [
                            {
                                choiceReferences: [],
                                fieldText: '',
                                fieldType: 'Region',
                                helpText: '',
                                inputParameters: [
                                    {
                                        name: 'width',
                                        value: {
                                            stringValue: '6'
                                        }
                                    }
                                ],
                                isRequired: false,
                                name: 'Screen2_Section1_Column1',
                                outputParameters: [],
                                scale: 0,
                                fields: [
                                    {
                                        choiceReferences: [],
                                        dataType: 'String',
                                        fieldText: '',
                                        fieldType: 'InputField',
                                        helpText: '',
                                        inputParameters: [],
                                        isRequired: false,
                                        name: 'text_2',
                                        outputParameters: [],
                                        scale: 0,
                                        fields: []
                                    }
                                ]
                            },
                            {
                                choiceReferences: [],
                                fieldText: '',
                                fieldType: 'Region',
                                helpText: '',
                                inputParameters: [
                                    {
                                        name: 'width',
                                        value: {
                                            stringValue: '6'
                                        }
                                    }
                                ],
                                isRequired: false,
                                name: 'Screen2_Section1_Column2',
                                outputParameters: [],
                                scale: 0,
                                fields: [
                                    {
                                        choiceReferences: [],
                                        fieldText: '',
                                        fieldType: 'ComponentInstance',
                                        helpText: '',
                                        inputParameters: [
                                            {
                                                name: 'label',
                                                value: {
                                                    stringValue: 'email_2'
                                                }
                                            }
                                        ],
                                        isRequired: true,
                                        name: 'email_2',
                                        outputParameters: [],
                                        scale: 0,
                                        fields: [],
                                        storeOutputAutomatically: true,
                                        extensionName: 'flowruntime:email'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [],
                        isRequired: true,
                        name: 'address_2',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        storeOutputAutomatically: true,
                        extensionName: 'flowruntime:address'
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            }
        ],
        description: '',
        interviewLabel: 'my {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'myScreenSectionsAndColumns',
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
        status: 'Draft',
        apiVersion: 50
    },
    name: 'myScreenSectionsAndColumns',
    processType: 'Flow',
    runInMode: null,
    status: 'Draft',
    triggerType: undefined,
    versionNumber: 1
};
