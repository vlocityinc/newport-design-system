// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.ts and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: '9c51615d-c61a-46f7-b26a-7157f6908b21',
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
            value: 'f94a6136-8394-445d-a2f1-1ef06f109cb5',
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
            value: '1a279fff-8bfc-4714-bc0f-2d7a203c6b16',
            error: null
        }
    },
    numberVariable: {
        guid: '2e02687e-41a2-42eb-ba74-81c130218b86',
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
            value: 'c9f73d4d-7d65-41bd-b1b6-f6e8b47cef56',
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
            value: '52bc2460-8775-417b-a692-f72725a8f6b0',
            error: null
        }
    },
    dateVariable: {
        guid: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
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
            value: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
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
            value: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: 'd385d33b-7ce5-4c7a-a867-690dfb63ea97',
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
            value: '9189cb3c-2245-4cfb-aabe-c2e979f15c6d',
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
            value: '048203c3-6751-4189-b9ab-939f0ef6d7d3',
            error: null
        }
    },
    accountSObjectVariable: {
        guid: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
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
            value: 'ecf6b72e-f33e-48a4-a58c-bdcc87a80e40',
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
            value: '3147a31d-26a3-408c-b00b-a31983df0da5',
            error: null
        }
    },
    textTemplate1: {
        guid: '1875750b-574e-40d4-adff-7aa4f06fc0fe',
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
        guid: '8ca8f838-4af4-4ae6-89fd-abdcc075a85e',
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
        guid: '12e8090b-c0e9-4ff4-9df4-5cefcdbbf3c0',
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
            value: 'ed78dc90-dad8-4f67-b39a-59d06fa41665',
            error: null
        }
    },
    emailScreenField: {
        guid: '64576cb6-0939-475e-8e1b-76feee5be4be',
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
            value: '060e2e3d-c798-4c96-b7c8-4b694bbcb5d5',
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
                rowIndex: 'b9810123-08cd-465b-ae9a-ca0c2afb3a9a',
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
                rowIndex: '31ac8e99-5705-49f2-a2ef-bf2f6a4a22e0',
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
        guid: '8ee25bae-66aa-4c1d-bf28-938976a1d25b',
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
            value: '79c59df8-63ef-4817-8939-4951da8d22c9',
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
                rowIndex: 'c27e44ab-6e20-496f-80c0-623c207ab098',
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
                rowIndex: '38e03c17-22d6-403f-91bf-6d9bd0caa696',
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
        guid: '0e7a1251-a491-43d2-8828-b61652438009',
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
            value: '4a3e2a6c-d306-4c6b-98b5-c4bf1839644b',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: '2a4b3b65-06a5-4679-bac9-98dc536c68d4',
            error: null
        },
        filterLogic: {
            value: '(1 AND 2) OR 3',
            error: null
        },
        filters: [
            {
                rowIndex: '67b32c2b-a683-4ffe-a867-79300f3a25e0',
                leftHandSide: {
                    value: 'Account.BillingCity',
                    error: null
                },
                rightHandSide: {
                    value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929.BillingCity',
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
                rowIndex: '2bf0c2e0-c04d-43a6-84ce-49009b740a1b',
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
                rowIndex: '865e456d-2e1d-410f-8c62-8f686238b197',
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
        guid: '338c0e28-a7d7-44c0-907a-0fd6aef99d83',
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
            value: '60f7e7ac-6177-4f7c-843d-6ebb0b9bd929',
            error: null
        },
        inputReferenceIndex: {
            value: '162ea6d1-7389-419d-b8c2-133462029981',
            error: null
        },
        object: {
            value: '',
            error: null
        },
        objectIndex: {
            value: '2aa5e67a-9cdb-45da-a597-a0d24c80188c',
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
        guid: 'babb725d-f89c-45e7-bf59-453c06cbfff1',
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
            value: '35467ed7-75b9-4c62-b04a-6a0df25679a5',
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
