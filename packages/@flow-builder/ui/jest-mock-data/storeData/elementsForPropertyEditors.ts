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
        guid: 'df134372-8b3c-4bbd-875a-7513e76bec39',
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
                rowIndex: '2e27b2ec-9bb9-493d-9151-d9022471680f',
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
        guid: '0d21d5a2-6e85-4023-8e2b-846d05bfb367',
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
            value: 'e12fdd35-1aeb-4465-b52c-73a201e704a7',
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
                rowIndex: 'f8d71fe5-b8d5-4def-b47b-dd4aef4b47dc',
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
                rowIndex: '09238073-9b8a-4280-9f23-e44be298f4b0',
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
        guid: '86488742-59ae-41c6-81c5-df64825d4c6b',
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
            value: 'e8244d51-bc66-4700-831a-9bfeb05fc5a7',
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
    }
};
