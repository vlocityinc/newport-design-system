// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.ts and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: '58d4a602-1abb-46e4-8c10-54c225dd56af',
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
            value: '940c4a6d-ab72-4477-8d60-f9f696d2bfd7',
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
            value: 'aa0ba870-d79b-48cb-a7ec-bc9441a7b635',
            error: null
        }
    },
    numberVariable: {
        guid: '8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e',
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
            value: '4d5723fe-7d36-4044-8f59-1f6da02eacbe',
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
            value: '41a189ff-01f4-4018-b75c-3f363b65cc42',
            error: null
        }
    },
    dateVariable: {
        guid: '1f6554e7-ca93-491c-979c-1e2b8fcc563f',
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
            value: '0883ba56-46a4-4420-8105-c9d17ad0183b',
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
            value: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: '013c0515-5f96-493f-bf5b-3d261350a4e6',
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
        guid: '1a279fff-8bfc-4714-bc0f-2d7a203c6b16',
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
        guid: '4197d875-e006-4afc-844f-753d75b8c4d1',
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
        guid: '9c51615d-c61a-46f7-b26a-7157f6908b21',
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
            value: 'f94a6136-8394-445d-a2f1-1ef06f109cb5',
            error: null
        }
    },
    emailScreenField: {
        guid: 'ac2ad112-16a7-4f97-bb41-7d5a0a41679f',
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
            value: '4899e1df-446e-4158-a942-9b376323c325',
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
                rowIndex: '7f18c878-eb8d-49d8-8b87-8d8ddcdf4daa',
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
                rowIndex: 'b8a65817-59f3-4fa9-a0a8-73602ab6a45a',
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
        guid: 'f876df5e-ccc8-43a5-921f-4730c6c8052b',
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
            value: 'a198d5b1-0303-44f8-9d32-59611aba0a07',
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
                rowIndex: 'c3ba5281-2d20-4596-99d0-94b9368c1d70',
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
                rowIndex: '142d47b8-8c11-4740-a8dc-60d7747a08bb',
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
        guid: 'fde9b89d-7177-4303-889d-5293eaeb58aa',
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
            value: '1219bee3-aea6-4567-b155-e5ddb4a543bd',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: '35837efc-fe6e-4096-8de3-a00443b93527',
            error: null
        },
        filterLogic: {
            value: '(1 AND 2) OR 3',
            error: null
        },
        filters: [
            {
                rowIndex: '130d845a-9aeb-42e7-acbc-cdea13693b85',
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
                rowIndex: 'ab66a6a8-98df-47cd-9948-1c2390f02139',
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
                rowIndex: '3ce6eb05-97e4-467f-b821-11dfa2cdccf0',
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
        guid: '3980ef9a-c9c0-4635-a6af-13682830ba4b',
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
            value: '8232343e-c77f-4502-9234-793bc5470183',
            error: null
        },
        object: {
            value: '',
            error: null
        },
        objectIndex: {
            value: '2c2b6727-f892-4a27-802c-8414e7f162de',
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
        guid: 'cb5ce4eb-b9b6-43d1-b2ea-f74e7b6db814',
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
            value: '66372d1b-81f8-4269-b7f8-80f1723485ca',
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
