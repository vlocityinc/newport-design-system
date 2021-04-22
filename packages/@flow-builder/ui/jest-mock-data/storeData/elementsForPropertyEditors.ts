// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.ts and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
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
            value: '5abbcb4e-faba-4750-91f2-46c9509713ea',
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
            value: 'a709dfe7-af21-4c63-a373-38ee99bcbf73',
            error: null
        }
    },
    numberVariable: {
        guid: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
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
            value: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
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
            value: '048203c3-6751-4189-b9ab-939f0ef6d7d3',
            error: null
        }
    },
    dateVariable: {
        guid: '2e02687e-41a2-42eb-ba74-81c130218b86',
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
            value: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
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
            value: '52bc2460-8775-417b-a692-f72725a8f6b0',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: '20719b7b-1961-4eda-a3f3-b42d939e604a',
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
            value: '0f5d3e82-2fcc-4efa-8ff0-ccb452206df7',
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
            value: 'fff17adf-4565-4360-91b9-64f7fd54a9d7',
            error: null
        }
    },
    accountSObjectVariable: {
        guid: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
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
            value: '56095468-2459-481d-b084-04a05babcb22',
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
            value: '88a32730-b8ce-4cdd-b44c-9ad6bd1992e9',
            error: null
        }
    },
    textTemplate1: {
        guid: '1b13e911-67d9-409a-abee-fc6663dd4108',
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
        guid: 'b689132a-b516-47d0-9e51-03ea751c7cc9',
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
        guid: '554e2ae3-5e7f-4efc-9cdb-c6bc62fc7e14',
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
            value: 'e7dfb0f5-be90-4dcd-9841-da7bd989dee5',
            error: null
        }
    },
    emailScreenField: {
        guid: '5bd09db6-7e3f-41e3-a0c7-dbef33840655',
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
            value: '4be9885e-987b-4fab-b204-58dd28d0829c',
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
                rowIndex: 'e12fdd35-1aeb-4465-b52c-73a201e704a7',
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
                rowIndex: 'f8d71fe5-b8d5-4def-b47b-dd4aef4b47dc',
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
        guid: 'e713f058-3d86-43ff-9da6-c8cd70863c95',
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
            value: '17d626e2-e27c-4bf0-9670-5abc582a22fb',
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
                rowIndex: 'b0d41663-ba7b-4020-8f88-6c83151e3a83',
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
                rowIndex: 'a339198f-0294-4416-a67a-2782d735acad',
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
        guid: '4899e1df-446e-4158-a942-9b376323c325',
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
        inputReference: {
            value: '',
            error: null
        },
        inputReferenceIndex: {
            value: 'fd06f9e3-6e63-4d89-b441-ca4c0594deb5',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: '7f18c878-eb8d-49d8-8b87-8d8ddcdf4daa',
            error: null
        },
        filterLogic: {
            value: '(1 AND 2) OR 3',
            error: null
        },
        filters: [
            {
                rowIndex: '5a6a3791-5930-4c22-9f5d-ed090b53f8e6',
                leftHandSide: {
                    value: 'Account.BillingCity',
                    error: null
                },
                rightHandSide: {
                    value: '9b2579d0-01d3-45b0-b6b2-bb016b085511.BillingCity',
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
                rowIndex: 'b8a65817-59f3-4fa9-a0a8-73602ab6a45a',
                leftHandSide: {
                    value: 'Account.BillingCountry',
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
                rowIndex: '78207ca6-8bba-401b-a2e8-1c279842b990',
                leftHandSide: {
                    value: 'Account.Name',
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
        guid: 'acbbb552-1389-4ec3-9807-d8c3aa378d70',
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
        inputReference: {
            value: '9b2579d0-01d3-45b0-b6b2-bb016b085511',
            error: null
        },
        inputReferenceIndex: {
            value: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
            error: null
        },
        object: {
            value: '',
            error: null
        },
        objectIndex: {
            value: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
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
        guid: '88b31e32-25ee-4d52-83f0-4b9c4b23af08',
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
            value: '232488b7-0f88-4cfc-88c4-0d5f4b2a4373',
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
