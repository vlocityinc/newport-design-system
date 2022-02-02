// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.ts and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: '97ff27bc-bc3f-49cd-b600-abec79e81e50',
        name: {
            value: 'stringVariable',
            error: null
        },
        description: {
            value: 'random description',
            error: null
        },
        elementType: 'Variable',
        isCollection: false,
        isInput: false,
        isOutput: false,
        dataType: {
            value: 'String',
            error: null
        },
        subtype: {
            value: null,
            error: null
        },
        subtypeIndex: {
            value: 'bf98c1eb-cd97-49dd-b11d-7b6aca391ca6',
            error: null
        },
        scale: 0,
        defaultValue: {
            value: 'fooDefault',
            error: null
        },
        defaultValueDataType: {
            value: 'String',
            error: null
        },
        defaultValueIndex: {
            value: 'ac66cdf6-9167-4628-8faa-079f39e2e32b',
            error: null
        }
    },
    numberVariable: {
        guid: 'f317c423-f755-4d64-bd4a-e218107b57db',
        name: {
            value: 'numberVariable',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'Variable',
        isCollection: false,
        isInput: false,
        isOutput: false,
        dataType: {
            value: 'Number',
            error: null
        },
        subtype: {
            value: null,
            error: null
        },
        subtypeIndex: {
            value: '794b3296-5246-473a-b618-584b8956809c',
            error: null
        },
        scale: 2,
        defaultValue: {
            value: null,
            error: null
        },
        defaultValueDataType: {
            value: null,
            error: null
        },
        defaultValueIndex: {
            value: '1669c1f5-9872-461f-a826-b4fa64d902dd',
            error: null
        }
    },
    dateVariable: {
        guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
        name: {
            value: 'dateVariable',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'Variable',
        isCollection: false,
        isInput: false,
        isOutput: false,
        dataType: {
            value: 'Date',
            error: null
        },
        subtype: {
            value: null,
            error: null
        },
        subtypeIndex: {
            value: '201c3554-f05a-4fff-8482-1495f16e2f8b',
            error: null
        },
        scale: 0,
        defaultValue: {
            value: null,
            error: null
        },
        defaultValueDataType: {
            value: null,
            error: null
        },
        defaultValueIndex: {
            value: 'cf176378-9ab0-436f-a161-079057c789f4',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
        name: {
            value: 'stringCollectionVariable1',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'Variable',
        isCollection: true,
        isInput: false,
        isOutput: false,
        dataType: {
            value: 'String',
            error: null
        },
        subtype: {
            value: null,
            error: null
        },
        subtypeIndex: {
            value: 'ed78dc90-dad8-4f67-b39a-59d06fa41665',
            error: null
        },
        scale: 0,
        defaultValue: {
            value: null,
            error: null
        },
        defaultValueDataType: {
            value: null,
            error: null
        },
        defaultValueIndex: {
            value: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
            error: null
        }
    },
    accountSObjectVariable: {
        guid: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
        name: {
            value: 'accountSObjectVariable',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'Variable',
        isCollection: false,
        isInput: false,
        isOutput: false,
        dataType: {
            value: 'SObject',
            error: null
        },
        subtype: {
            value: 'Account',
            error: null
        },
        subtypeIndex: {
            value: 'f35bd1d9-bafd-4fc9-b682-2d2557f8f796',
            error: null
        },
        scale: 0,
        defaultValue: {
            value: null,
            error: null
        },
        defaultValueDataType: {
            value: null,
            error: null
        },
        defaultValueIndex: {
            value: '88a32528-0dfa-4237-b9dd-a14c1a6d6d10',
            error: null
        }
    },
    textTemplate1: {
        guid: '5041d41a-0822-4ddc-9685-8a09b840bb0d',
        name: {
            value: 'textTemplate1',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'TextTemplate',
        text: {
            value: '<p>Hello {!stringVariable}</p>',
            error: null
        },
        dataType: {
            value: 'String',
            error: null
        },
        isViewedAsPlainText: false
    },
    textTemplate2: {
        guid: 'de8efb2a-4b75-4a44-a3c9-3a78018a2207',
        name: {
            value: 'textTemplate2',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'TextTemplate',
        text: {
            value: 'This text template is in plain text mode.',
            error: null
        },
        dataType: {
            value: 'String',
            error: null
        },
        isViewedAsPlainText: true
    },
    stringConstant: {
        guid: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
        name: {
            value: 'stringConstant',
            error: null
        },
        description: {
            value: 'random description',
            error: null
        },
        elementType: 'Constant',
        dataType: {
            value: 'String',
            error: null
        },
        defaultValue: {
            value: 'fooDefault',
            error: null
        },
        defaultValueDataType: {
            value: 'String',
            error: null
        },
        defaultValueIndex: {
            value: '2ca03260-0885-4ffb-bb88-cf862f5d2cb4',
            error: null
        }
    },
    emailScreenField: {
        guid: '363280ef-e5f4-414b-9988-1200b330e5cb',
        name: {
            value: 'emailScreenField',
            error: null
        },
        choiceReferences: [],
        defaultValue: {
            value: '',
            error: null
        },
        defaultValueIndex: {
            value: 'fd01968e-736a-4bbf-9324-f6e7f915b6fe',
            error: null
        },
        validationRule: {
            formulaExpression: {
                value: null,
                error: null
            },
            errorMessage: {
                value: null,
                error: null
            }
        },
        extensionName: {
            value: 'flowruntime:email',
            error: null
        },
        fieldType: {
            value: 'ComponentInstance',
            error: null
        },
        fieldText: {
            value: '',
            error: null
        },
        helpText: {
            value: '',
            error: null
        },
        inputParameters: [
            {
                rowIndex: '9abf51ab-a289-45b0-853c-040be0ed9eb7',
                name: {
                    value: 'label',
                    error: null
                },
                value: {
                    value: 'emailScreenField',
                    error: null
                },
                valueDataType: {
                    value: 'String',
                    error: null
                },
                subtype: {
                    value: '',
                    error: null
                },
                isCollection: false
            },
            {
                rowIndex: '5a93c395-dd94-498e-9383-50caf96c6748',
                name: {
                    value: 'placeholder',
                    error: null
                },
                value: {
                    value: 'your email',
                    error: null
                },
                valueDataType: {
                    value: 'String',
                    error: null
                },
                subtype: {
                    value: '',
                    error: null
                },
                isCollection: false
            }
        ],
        isNewField: false,
        isRequired: true,
        outputParameters: [],
        scale: {
            value: '0',
            error: null
        },
        type: {
            name: {
                value: 'flowruntime:email',
                error: null
            },
            fieldType: {
                value: 'ComponentInstance',
                error: null
            },
            label: {
                value: 'flowruntime:email',
                error: null
            },
            icon: {
                value: 'standard:lightning_component',
                error: null
            },
            source: {
                value: 'local',
                error: null
            }
        },
        elementType: 'SCREEN_FIELD',
        visibilityRule: {
            conditions: [],
            conditionLogic: {
                value: 'no_conditions',
                error: null
            }
        },
        fields: [],
        inputsOnNextNavToAssocScrn: 'UseStoredValues',
        dynamicTypeMappings: [],
        storeOutputAutomatically: false
    },
    emailScreenFieldAutomaticOutput: {
        guid: 'df134372-8b3c-4bbd-875a-7513e76bec39',
        name: {
            value: 'emailScreenFieldAutomaticOutput',
            error: null
        },
        choiceReferences: [],
        dataType: {
            value: 'LightningComponentOutput',
            error: null
        },
        defaultValue: {
            value: '',
            error: null
        },
        defaultValueIndex: {
            value: 'fd3f7f93-d285-4327-ad6d-2b080ee334b2',
            error: null
        },
        validationRule: {
            formulaExpression: {
                value: null,
                error: null
            },
            errorMessage: {
                value: null,
                error: null
            }
        },
        extensionName: {
            value: 'flowruntime:email',
            error: null
        },
        fieldType: {
            value: 'ComponentInstance',
            error: null
        },
        fieldText: {
            value: '',
            error: null
        },
        helpText: {
            value: '',
            error: null
        },
        inputParameters: [
            {
                rowIndex: 'd5a45e74-78b4-41c3-844d-b0536f90c54b',
                name: {
                    value: 'label',
                    error: null
                },
                value: {
                    value: 'emailScreenFieldAutomaticOutput',
                    error: null
                },
                valueDataType: {
                    value: 'String',
                    error: null
                },
                subtype: {
                    value: '',
                    error: null
                },
                isCollection: false
            },
            {
                rowIndex: '2e27b2ec-9bb9-493d-9151-d9022471680f',
                name: {
                    value: 'placeholder',
                    error: null
                },
                value: {
                    value: 'your email address',
                    error: null
                },
                valueDataType: {
                    value: 'String',
                    error: null
                },
                subtype: {
                    value: '',
                    error: null
                },
                isCollection: false
            }
        ],
        isNewField: false,
        isRequired: true,
        outputParameters: [],
        scale: {
            value: '0',
            error: null
        },
        type: {
            name: {
                value: 'flowruntime:email',
                error: null
            },
            fieldType: {
                value: 'ComponentInstance',
                error: null
            },
            label: {
                value: 'flowruntime:email',
                error: null
            },
            icon: {
                value: 'standard:lightning_component',
                error: null
            },
            source: {
                value: 'local',
                error: null
            }
        },
        elementType: 'SCREEN_FIELD',
        visibilityRule: {
            conditions: [],
            conditionLogic: {
                value: 'no_conditions',
                error: null
            }
        },
        fields: [],
        inputsOnNextNavToAssocScrn: 'UseStoredValues',
        dynamicTypeMappings: [],
        storeOutputAutomatically: true
    },
    deleteAccountWithFilters: {
        guid: '026b8ee9-572a-40c0-9442-00e58400855d',
        name: {
            value: 'deleteAccountWithFilters',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        label: {
            value: 'deleteAccountWithFilters',
            error: null
        },
        locationX: 1213,
        locationY: 832,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: true,
        inputReference: {
            value: '',
            error: null
        },
        inputReferenceIndex: {
            value: '57402670-a93f-4621-a8e4-6045f765731b',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: 'e4b8d861-0407-4edd-8002-1b887499cd44',
            error: null
        },
        filterLogic: {
            value: '(1 AND 2) OR 3',
            error: null
        },
        filters: [
            {
                rowIndex: '19362806-09c5-46a5-b274-bebe980379cf',
                leftHandSide: {
                    value: 'Account.BillingCity',
                    error: null
                },
                leftHandSideDataType: {
                    value: 'String',
                    error: null
                },
                rightHandSide: {
                    value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9.BillingCity',
                    error: null
                },
                rightHandSideDataType: {
                    value: 'reference',
                    error: null
                },
                operator: {
                    value: 'EqualTo',
                    error: null
                }
            },
            {
                rowIndex: 'aca838b1-ea76-436d-a081-732171fdbc11',
                leftHandSide: {
                    value: 'Account.BillingCountry',
                    error: null
                },
                leftHandSideDataType: {
                    value: 'String',
                    error: null
                },
                rightHandSide: {
                    value: 'USA',
                    error: null
                },
                rightHandSideDataType: {
                    value: 'String',
                    error: null
                },
                operator: {
                    value: 'EqualTo',
                    error: null
                }
            },
            {
                rowIndex: 'bd1b7ef3-fc33-485d-a9d2-8f6187bf842b',
                leftHandSide: {
                    value: 'Account.Name',
                    error: null
                },
                leftHandSideDataType: {
                    value: 'String',
                    error: null
                },
                rightHandSide: {
                    value: 'SalesForce',
                    error: null
                },
                rightHandSideDataType: {
                    value: 'String',
                    error: null
                },
                operator: {
                    value: 'EqualTo',
                    error: null
                }
            }
        ],
        maxConnections: 2,
        availableConnections: [
            {
                type: 'REGULAR'
            },
            {
                type: 'FAULT'
            }
        ],
        elementType: 'RecordDelete',
        dataType: {
            value: 'Boolean',
            error: null
        },
        useSobject: false
    },
    deleteAccount: {
        guid: '78207ca6-8bba-401b-a2e8-1c279842b990',
        name: {
            value: 'deleteAccount',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        label: {
            value: 'deleteAccount',
            error: null
        },
        locationX: 955,
        locationY: 469,
        isCanvasElement: true,
        connectorCount: 0,
        config: {
            isSelected: false,
            isHighlighted: false,
            isSelectable: true,
            hasError: false
        },
        canHaveFaultConnector: true,
        inputReference: {
            value: '48cb0159-3cde-48ad-9877-644e3cc4b5e9',
            error: null
        },
        inputReferenceIndex: {
            value: 'e2c8ac9f-000d-47e0-9f60-c9f564fa6e59',
            error: null
        },
        object: {
            value: '',
            error: null
        },
        objectIndex: {
            value: 'd3d400b8-db5e-4704-8b34-3dc777de7ab2',
            error: null
        },
        filterLogic: {
            value: 'and',
            error: null
        },
        filters: [],
        maxConnections: 2,
        availableConnections: [
            {
                type: 'REGULAR'
            },
            {
                type: 'FAULT'
            }
        ],
        elementType: 'RecordDelete',
        dataType: {
            value: 'Boolean',
            error: null
        },
        useSobject: true
    },
    other: {
        guid: 'c0b8d69f-4607-479a-b09c-55b8be96503f',
        name: {
            value: 'other',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        elementType: 'Choice',
        dataType: {
            value: 'String',
            error: null
        },
        choiceText: {
            value: 'Other',
            error: null
        },
        storedValue: {
            value: 'other',
            error: null
        },
        storedValueDataType: {
            value: 'String',
            error: null
        },
        storedValueIndex: {
            value: '33155916-197a-4b4e-b108-bbdf3aef4e41',
            error: null
        },
        isShowInputSelected: true,
        isValidateSelected: false,
        userInput: {
            isRequired: false,
            promptText: {
                value: 'Please specify',
                error: null
            }
        }
    },
    ScreenWithSection: {
        guid: '23a963ec-f168-4151-804b-9541689dc879',
        name: {
            value: 'ScreenWithSection',
            error: null
        },
        description: {
            value: '',
            error: null
        },
        label: {
            value: 'ScreenWithSection',
            error: null
        },
        locationX: 161,
        locationY: 637,
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
        pauseMessageType: {
            value: 'standard',
            error: null
        },
        helpText: {
            value: '',
            error: null
        },
        pausedText: {
            value: '',
            error: null
        },
        showFooter: true,
        showHeader: true,
        nextOrFinishLabel: {
            value: null,
            error: null
        },
        nextOrFinishLabelType: {
            value: 'standard',
            error: null
        },
        backLabel: {
            value: null,
            error: null
        },
        backLabelType: {
            value: 'standard',
            error: null
        },
        pauseLabel: {
            value: null,
            error: null
        },
        pauseLabelType: {
            value: 'standard',
            error: null
        },
        fields: [
            {
                guid: '131babab-443d-4e7f-99dc-3b2ecd50baa5',
                name: {
                    value: 'ScreenWithSection_Section1',
                    error: null
                },
                choiceReferences: [],
                defaultValue: {
                    value: '',
                    error: null
                },
                defaultValueIndex: {
                    value: '2329aa7a-2605-400b-b066-a773bd8633f6',
                    error: null
                },
                validationRule: {
                    formulaExpression: {
                        value: null,
                        error: null
                    },
                    errorMessage: {
                        value: null,
                        error: null
                    }
                },
                fieldType: 'RegionContainer',
                fieldText: {
                    value: '',
                    error: null
                },
                hasHeading: false,
                helpText: {
                    value: '',
                    error: null
                },
                inputParameters: [],
                isNewField: false,
                isRequired: false,
                outputParameters: [],
                scale: {
                    value: '0',
                    error: null
                },
                type: {
                    name: 'Section',
                    fieldType: 'RegionContainer',
                    label: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
                    icon: 'standard:section',
                    category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
                    description: 'FlowBuilderScreenEditor.fieldTypeDescriptionSection'
                },
                elementType: 'SCREEN_FIELD',
                visibilityRule: {
                    conditions: [],
                    conditionLogic: {
                        value: 'no_conditions',
                        error: null
                    }
                },
                fields: [
                    {
                        guid: 'd08b12f4-ac7b-4cb4-a3ff-621131fc450f',
                        name: {
                            value: 'ScreenWithSection_Section1_Column1',
                            error: null
                        },
                        choiceReferences: [],
                        defaultValue: {
                            value: '',
                            error: null
                        },
                        defaultValueIndex: {
                            value: '83d39edd-dc5c-43e8-b58b-999c0c6efcbc',
                            error: null
                        },
                        validationRule: {
                            formulaExpression: {
                                value: null,
                                error: null
                            },
                            errorMessage: {
                                value: null,
                                error: null
                            }
                        },
                        fieldType: 'Region',
                        fieldText: {
                            value: '',
                            error: null
                        },
                        helpText: {
                            value: '',
                            error: null
                        },
                        inputParameters: [
                            {
                                rowIndex: '497e601c-a901-4061-86c7-0852b1c9dd33',
                                name: {
                                    value: 'width',
                                    error: null
                                },
                                value: {
                                    value: '12',
                                    error: null
                                },
                                valueDataType: 'String',
                                subtype: {
                                    value: '',
                                    error: null
                                },
                                isCollection: false
                            }
                        ],
                        isNewField: false,
                        isRequired: false,
                        outputParameters: [],
                        scale: {
                            value: '0',
                            error: null
                        },
                        type: {
                            name: 'Column',
                            fieldType: 'Region'
                        },
                        elementType: 'SCREEN_FIELD',
                        visibilityRule: {
                            conditions: [],
                            conditionLogic: {
                                value: 'no_conditions',
                                error: null
                            }
                        },
                        fields: [
                            {
                                guid: 'b1ccd7d0-6210-4c95-a3c8-1e01ef242a3f',
                                name: {
                                    value: 'slider_1',
                                    error: null
                                },
                                choiceReferences: [],
                                dataType: 'LightningComponentOutput',
                                defaultValue: {
                                    value: '',
                                    error: null
                                },
                                defaultValueIndex: {
                                    value: '8eff1e35-f996-490c-b2f1-f981186f4092',
                                    error: null
                                },
                                validationRule: {
                                    formulaExpression: {
                                        value: null,
                                        error: null
                                    },
                                    errorMessage: {
                                        value: null,
                                        error: null
                                    }
                                },
                                extensionName: {
                                    value: 'flowruntime:slider',
                                    error: null
                                },
                                fieldType: 'ComponentInstance',
                                fieldText: {
                                    value: '',
                                    error: null
                                },
                                helpText: {
                                    value: '',
                                    error: null
                                },
                                inputParameters: [
                                    {
                                        rowIndex: '44c3a9ec-e8ee-43ce-9f4e-71048c744dfb',
                                        name: {
                                            value: 'label',
                                            error: null
                                        },
                                        value: {
                                            value: 'slider_1',
                                            error: null
                                        },
                                        valueDataType: 'String',
                                        subtype: {
                                            value: '',
                                            error: null
                                        },
                                        isCollection: false
                                    }
                                ],
                                isNewField: false,
                                isRequired: true,
                                outputParameters: [],
                                scale: {
                                    value: '0',
                                    error: null
                                },
                                type: {
                                    name: 'flowruntime:slider',
                                    fieldType: 'ComponentInstance',
                                    label: 'flowruntime:slider',
                                    icon: 'standard:lightning_component',
                                    source: 'local'
                                },
                                elementType: 'SCREEN_FIELD',
                                visibilityRule: {
                                    conditions: [],
                                    conditionLogic: {
                                        value: 'no_conditions',
                                        error: null
                                    }
                                },
                                fields: [],
                                inputsOnNextNavToAssocScrn: 'UseStoredValues',
                                dynamicTypeMappings: [],
                                storeOutputAutomatically: true
                            }
                        ]
                    }
                ]
            },
            {
                guid: '1562fcaa-21e3-4ab7-9950-bd34c7c5c444',
                name: {
                    value: 'number_2',
                    error: null
                },
                choiceReferences: [],
                dataType: 'Number',
                defaultValue: {
                    value: '',
                    error: null
                },
                defaultValueIndex: {
                    value: 'd4fae3cf-4fd2-443f-89d2-9c4f7e72deb4',
                    error: null
                },
                validationRule: {
                    formulaExpression: {
                        value: null,
                        error: null
                    },
                    errorMessage: {
                        value: null,
                        error: null
                    }
                },
                fieldType: 'InputField',
                fieldText: {
                    value: 'number_2',
                    error: null
                },
                helpText: {
                    value: '',
                    error: null
                },
                inputParameters: [],
                isNewField: false,
                isRequired: false,
                outputParameters: [],
                scale: {
                    value: '0',
                    error: null
                },
                type: {
                    name: 'Number',
                    fieldType: 'InputField',
                    dataType: 'Number',
                    label: 'FlowBuilderScreenEditor.fieldTypeLabelNumber',
                    icon: 'standard:number_input',
                    category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                    type: 'Number'
                },
                elementType: 'SCREEN_FIELD',
                visibilityRule: {
                    conditions: [],
                    conditionLogic: {
                        value: 'no_conditions',
                        error: null
                    }
                },
                fields: []
            },
            {
                guid: '51dd4b43-d68c-4aee-a601-12c30e7c926f',
                name: {
                    value: 'ScreenWithSection_Section2',
                    error: null
                },
                choiceReferences: [],
                defaultValue: {
                    value: '',
                    error: null
                },
                defaultValueIndex: {
                    value: '8712ca46-d9c0-49ba-9641-bd15e2d1dcbe',
                    error: null
                },
                validationRule: {
                    formulaExpression: {
                        value: null,
                        error: null
                    },
                    errorMessage: {
                        value: null,
                        error: null
                    }
                },
                fieldType: 'RegionContainer',
                fieldText: {
                    value: '',
                    error: null
                },
                hasHeading: false,
                helpText: {
                    value: '',
                    error: null
                },
                inputParameters: [],
                isNewField: false,
                isRequired: false,
                outputParameters: [],
                scale: {
                    value: '0',
                    error: null
                },
                type: {
                    name: 'Section',
                    fieldType: 'RegionContainer',
                    label: 'FlowBuilderScreenEditor.fieldTypeLabelSection',
                    icon: 'standard:section',
                    category: 'FlowBuilderScreenEditor.fieldCategoryDisplay',
                    description: 'FlowBuilderScreenEditor.fieldTypeDescriptionSection'
                },
                elementType: 'SCREEN_FIELD',
                visibilityRule: {
                    conditions: [],
                    conditionLogic: {
                        value: 'no_conditions',
                        error: null
                    }
                },
                fields: [
                    {
                        guid: '5bea7404-f581-4e0a-8ff3-701b3bfa7e5c',
                        name: {
                            value: 'ScreenWithSection_Section2_Column1',
                            error: null
                        },
                        choiceReferences: [],
                        defaultValue: {
                            value: '',
                            error: null
                        },
                        defaultValueIndex: {
                            value: '1181502b-7460-4f6a-b7ef-6e4851d39430',
                            error: null
                        },
                        validationRule: {
                            formulaExpression: {
                                value: null,
                                error: null
                            },
                            errorMessage: {
                                value: null,
                                error: null
                            }
                        },
                        fieldType: 'Region',
                        fieldText: {
                            value: '',
                            error: null
                        },
                        helpText: {
                            value: '',
                            error: null
                        },
                        inputParameters: [
                            {
                                rowIndex: '7b60da07-b6e5-4fb4-a895-3328fbd7983f',
                                name: {
                                    value: 'width',
                                    error: null
                                },
                                value: {
                                    value: '6',
                                    error: null
                                },
                                valueDataType: 'String',
                                subtype: {
                                    value: '',
                                    error: null
                                },
                                isCollection: false
                            }
                        ],
                        isNewField: false,
                        isRequired: false,
                        outputParameters: [],
                        scale: {
                            value: '0',
                            error: null
                        },
                        type: {
                            name: 'Column',
                            fieldType: 'Region'
                        },
                        elementType: 'SCREEN_FIELD',
                        visibilityRule: {
                            conditions: [],
                            conditionLogic: {
                                value: 'no_conditions',
                                error: null
                            }
                        },
                        fields: [
                            {
                                guid: '073edaa5-eb09-4bc8-9f20-43c320d56d18',
                                name: {
                                    value: 'text_2',
                                    error: null
                                },
                                choiceReferences: [],
                                dataType: 'String',
                                defaultValue: {
                                    value: '',
                                    error: null
                                },
                                defaultValueIndex: {
                                    value: '4297d5ea-aed3-421e-a33b-e988e84d10ac',
                                    error: null
                                },
                                validationRule: {
                                    formulaExpression: {
                                        value: null,
                                        error: null
                                    },
                                    errorMessage: {
                                        value: null,
                                        error: null
                                    }
                                },
                                fieldType: 'InputField',
                                fieldText: {
                                    value: 'text_2',
                                    error: null
                                },
                                helpText: {
                                    value: '',
                                    error: null
                                },
                                inputParameters: [],
                                isNewField: false,
                                isRequired: false,
                                outputParameters: [],
                                scale: {
                                    value: '0',
                                    error: null
                                },
                                type: {
                                    name: 'TextBox',
                                    fieldType: 'InputField',
                                    dataType: 'String',
                                    label: 'FlowBuilderScreenEditor.fieldTypeLabelTextField',
                                    icon: 'standard:textbox',
                                    category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                                    type: 'String'
                                },
                                elementType: 'SCREEN_FIELD',
                                visibilityRule: {
                                    conditions: [],
                                    conditionLogic: {
                                        value: 'no_conditions',
                                        error: null
                                    }
                                },
                                fields: []
                            },
                            {
                                guid: '4bd9ced3-d8dc-454b-9c6a-07e747528517',
                                name: {
                                    value: 'dateTimeInSection',
                                    error: null
                                },
                                choiceReferences: [],
                                dataType: 'DateTime',
                                defaultValue: {
                                    value: '$System.OriginDateTime',
                                    error: null
                                },
                                defaultValueDataType: 'reference',
                                defaultValueIndex: {
                                    value: '4b0617d9-3abe-42ab-8ed4-ab1e5944d884',
                                    error: null
                                },
                                validationRule: {
                                    formulaExpression: {
                                        value: null,
                                        error: null
                                    },
                                    errorMessage: {
                                        value: null,
                                        error: null
                                    }
                                },
                                fieldType: 'InputField',
                                fieldText: {
                                    value: 'dateTimeInSection',
                                    error: null
                                },
                                helpText: {
                                    value: '',
                                    error: null
                                },
                                inputParameters: [],
                                isNewField: false,
                                isRequired: false,
                                outputParameters: [],
                                scale: {
                                    value: '0',
                                    error: null
                                },
                                type: {
                                    name: 'DateTime',
                                    fieldType: 'InputField',
                                    dataType: 'DateTime',
                                    label: 'FlowBuilderScreenEditor.fieldTypeLabelDateTime',
                                    icon: 'standard:date_time',
                                    category: 'FlowBuilderScreenEditor.fieldCategoryInput',
                                    type: 'DateTime'
                                },
                                elementType: 'SCREEN_FIELD',
                                visibilityRule: {
                                    conditions: [],
                                    conditionLogic: {
                                        value: 'no_conditions',
                                        error: null
                                    }
                                },
                                fields: []
                            }
                        ]
                    },
                    {
                        guid: '852e1dd4-eb4e-48a7-8319-977137281a8d',
                        name: {
                            value: 'ScreenWithSection_Section2_Column2',
                            error: null
                        },
                        choiceReferences: [],
                        defaultValue: {
                            value: '',
                            error: null
                        },
                        defaultValueIndex: {
                            value: '329f0584-f250-4be0-a094-4060ca2ca6f3',
                            error: null
                        },
                        validationRule: {
                            formulaExpression: {
                                value: null,
                                error: null
                            },
                            errorMessage: {
                                value: null,
                                error: null
                            }
                        },
                        fieldType: 'Region',
                        fieldText: {
                            value: '',
                            error: null
                        },
                        helpText: {
                            value: '',
                            error: null
                        },
                        inputParameters: [
                            {
                                rowIndex: '35467ed7-75b9-4c62-b04a-6a0df25679a5',
                                name: {
                                    value: 'width',
                                    error: null
                                },
                                value: {
                                    value: '6',
                                    error: null
                                },
                                valueDataType: 'String',
                                subtype: {
                                    value: '',
                                    error: null
                                },
                                isCollection: false
                            }
                        ],
                        isNewField: false,
                        isRequired: false,
                        outputParameters: [],
                        scale: {
                            value: '0',
                            error: null
                        },
                        type: {
                            name: 'Column',
                            fieldType: 'Region'
                        },
                        elementType: 'SCREEN_FIELD',
                        visibilityRule: {
                            conditions: [],
                            conditionLogic: {
                                value: 'no_conditions',
                                error: null
                            }
                        },
                        fields: [
                            {
                                guid: '452ba7ae-00a1-46ea-a315-a63aa41d1b32',
                                name: {
                                    value: 'email_2',
                                    error: null
                                },
                                choiceReferences: [],
                                dataType: 'LightningComponentOutput',
                                defaultValue: {
                                    value: '',
                                    error: null
                                },
                                defaultValueIndex: {
                                    value: '5e35bc6f-e544-486e-b90b-81e885e849c8',
                                    error: null
                                },
                                validationRule: {
                                    formulaExpression: {
                                        value: null,
                                        error: null
                                    },
                                    errorMessage: {
                                        value: null,
                                        error: null
                                    }
                                },
                                extensionName: {
                                    value: 'flowruntime:email',
                                    error: null
                                },
                                fieldType: 'ComponentInstance',
                                fieldText: {
                                    value: '',
                                    error: null
                                },
                                helpText: {
                                    value: '',
                                    error: null
                                },
                                inputParameters: [
                                    {
                                        rowIndex: '4bdae41a-fbb6-487f-9507-275c854fbc3c',
                                        name: {
                                            value: 'label',
                                            error: null
                                        },
                                        value: {
                                            value: 'email_2',
                                            error: null
                                        },
                                        valueDataType: 'String',
                                        subtype: {
                                            value: '',
                                            error: null
                                        },
                                        isCollection: false
                                    }
                                ],
                                isNewField: false,
                                isRequired: true,
                                outputParameters: [],
                                scale: {
                                    value: '0',
                                    error: null
                                },
                                type: {
                                    name: 'flowruntime:email',
                                    fieldType: 'ComponentInstance',
                                    label: 'flowruntime:email',
                                    icon: 'standard:lightning_component',
                                    source: 'local'
                                },
                                elementType: 'SCREEN_FIELD',
                                visibilityRule: {
                                    conditions: [],
                                    conditionLogic: {
                                        value: 'no_conditions',
                                        error: null
                                    }
                                },
                                fields: [],
                                inputsOnNextNavToAssocScrn: 'UseStoredValues',
                                dynamicTypeMappings: [],
                                storeOutputAutomatically: true
                            },
                            {
                                guid: '926b62ad-1eae-4dea-972c-40fa752c46e4',
                                name: {
                                    value: 'accounts',
                                    error: null
                                },
                                choiceReferences: [
                                    {
                                        choiceReference: {
                                            value: '2f787ad6-32ec-4d66-a34e-a2131ffbee92',
                                            error: null
                                        },
                                        rowIndex: '875f212c-ce7a-482e-900a-5a11b9e83a62'
                                    },
                                    {
                                        choiceReference: {
                                            value: 'c0b8d69f-4607-479a-b09c-55b8be96503f',
                                            error: null
                                        },
                                        rowIndex: 'a4523c0d-9291-4c0a-b5ba-1168e4d17d99'
                                    },
                                    {
                                        choiceReference: {
                                            value: '1c1e6a2c-d292-49f3-ab11-1c6cf365e135',
                                            error: null
                                        },
                                        rowIndex: 'c9c2a575-1e1a-4bb4-a78d-0f8c2f56610f'
                                    }
                                ],
                                dataType: 'String',
                                defaultValue: {
                                    value: '',
                                    error: null
                                },
                                defaultValueIndex: {
                                    value: 'ded1ecdb-e998-4c3b-a729-344d44e9c3d4',
                                    error: null
                                },
                                validationRule: {
                                    formulaExpression: {
                                        value: null,
                                        error: null
                                    },
                                    errorMessage: {
                                        value: null,
                                        error: null
                                    }
                                },
                                fieldType: 'DropdownBox',
                                fieldText: {
                                    value: 'Accounts',
                                    error: null
                                },
                                helpText: {
                                    value: '',
                                    error: null
                                },
                                inputParameters: [],
                                isNewField: false,
                                isRequired: true,
                                outputParameters: [],
                                scale: {
                                    value: '0',
                                    error: null
                                },
                                type: {
                                    name: 'DropdownBox',
                                    fieldType: 'DropdownBox',
                                    dataType: 'String',
                                    label: 'FlowBuilderScreenEditor.fieldTypeLabelPicklist',
                                    icon: 'standard:picklist_type',
                                    category: 'FlowBuilderScreenEditor.fieldCategoryInput'
                                },
                                elementType: 'SCREEN_FIELD',
                                visibilityRule: {
                                    conditions: [
                                        {
                                            rowIndex: '6fe68205-b480-4ba1-abfd-ce650b968aa8',
                                            leftHandSide: {
                                                value: 'b1ccd7d0-6210-4c95-a3c8-1e01ef242a3f.value',
                                                error: null
                                            },
                                            rightHandSide: {
                                                value: '50',
                                                error: null
                                            },
                                            rightHandSideDataType: {
                                                value: 'Number',
                                                error: null
                                            },
                                            operator: {
                                                value: 'GreaterThanOrEqualTo',
                                                error: null
                                            }
                                        }
                                    ],
                                    conditionLogic: {
                                        value: 'and',
                                        error: null
                                    }
                                },
                                fields: [],
                                singleOrMultiSelect: 'SingleSelect'
                            }
                        ]
                    }
                ]
            },
            {
                guid: '291464ff-dda0-4384-a6b0-1cee49e14879',
                name: {
                    value: 'address_2',
                    error: null
                },
                choiceReferences: [],
                dataType: 'LightningComponentOutput',
                defaultValue: {
                    value: '',
                    error: null
                },
                defaultValueIndex: {
                    value: '05c643f6-c379-43eb-80e9-ed2b9ea5dac8',
                    error: null
                },
                validationRule: {
                    formulaExpression: {
                        value: null,
                        error: null
                    },
                    errorMessage: {
                        value: null,
                        error: null
                    }
                },
                extensionName: {
                    value: 'flowruntime:address',
                    error: null
                },
                fieldType: 'ComponentInstance',
                fieldText: {
                    value: '',
                    error: null
                },
                helpText: {
                    value: '',
                    error: null
                },
                inputParameters: [],
                isNewField: false,
                isRequired: true,
                outputParameters: [],
                scale: {
                    value: '0',
                    error: null
                },
                type: {
                    name: 'flowruntime:address',
                    fieldType: 'ComponentInstance',
                    label: 'flowruntime:address',
                    icon: 'standard:lightning_component',
                    source: 'local'
                },
                elementType: 'SCREEN_FIELD',
                visibilityRule: {
                    conditions: [],
                    conditionLogic: {
                        value: 'no_conditions',
                        error: null
                    }
                },
                fields: [],
                inputsOnNextNavToAssocScrn: 'UseStoredValues',
                dynamicTypeMappings: [],
                storeOutputAutomatically: true
            }
        ],
        maxConnections: 1,
        elementType: 'Screen'
    }
};
