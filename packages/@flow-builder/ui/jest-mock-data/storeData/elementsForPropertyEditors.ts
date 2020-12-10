// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.js and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: 'f79b5397-57f9-426b-aa00-5ef1b8b8f75d',
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
            value: '42afe63b-0744-4dec-a7e6-20c67691dd81',
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
            value: '02504510-b361-4fb3-878e-81925a76160f',
            error: null
        }
    },
    numberVariable: {
        guid: 'c518ac20-1202-42a6-ac3d-cfc8b707f4c3',
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
            value: '1283ede6-414b-45a2-851a-1b113f26bffd',
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
            value: 'b8c16d53-6fcd-458c-b3e6-51f2658308bc',
            error: null
        }
    },
    dateVariable: {
        guid: '2d1ada73-88e9-4cf4-a814-dcba8d517104',
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
            value: '76bbf8c2-9a5e-4a03-a84f-a518866d7963',
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
            value: 'f08f384a-8e8f-40d3-8009-f8e1fb16eac4',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: 'e502e40a-7dfc-4e71-8a42-c491f86a560a',
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
            value: '3d47c47d-df60-4f92-85c8-71982afd9938',
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
            value: 'cea1a8e6-1cb0-4b2f-9549-2610c8b61f78',
            error: null
        }
    },
    accountSObjectVariable: {
        guid: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
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
            value: '40c11213-36c0-451e-a5aa-8790aee02559',
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
            value: 'e62ce284-ccf2-46af-8446-c0a110a4bba0',
            error: null
        }
    },
    textTemplate1: {
        guid: '65909adb-0efe-4743-b4a7-ca6e93d71c92',
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
        guid: 'd66cf236-ca0a-4351-952d-b12df4abdaf8',
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
        guid: '6160bbc3-c247-458e-b1b8-abc60b4d3d39',
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
            value: '38f77648-3c7e-4431-8403-239492238623',
            error: null
        }
    },
    emailScreenField: {
        guid: '474faea1-942d-4f0f-8c81-8429fc131dcf',
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
            value: 'e2363ac3-537d-4b28-afac-ae787b18687e',
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
                rowIndex: '5d604d8f-ebcb-485c-ab0a-1f99d9229f4c',
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
                }
            },
            {
                rowIndex: '217c9285-27c0-4130-b6f2-a92ee3b10177',
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
                }
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
        guid: '0fa2da7a-22de-4045-ab83-711522e52bb6',
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
            value: '98a764f1-b847-44c2-b27c-b1d15f4857ca',
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
                rowIndex: '452941fc-4972-44df-b34d-a821bb32e800',
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
                }
            },
            {
                rowIndex: 'd59e0052-78b7-4ec0-bf89-27757c00baed',
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
                }
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
        guid: 'ceda6ea2-c50f-49b7-9945-9d7ed8544f4b',
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
            value: '494033a5-d654-4f68-9c22-7712eaa87073',
            error: null
        },
        object: {
            value: 'Account',
            error: null
        },
        objectIndex: {
            value: 'c85e0459-8b6f-4540-99e7-d388a35ee4ba',
            error: null
        },
        filterLogic: {
            value: '(1 AND 2) OR 3',
            error: null
        },
        filters: [
            {
                rowIndex: '336b0818-ff06-47c3-9e85-3b6fe4a10c5b',
                leftHandSide: {
                    value: 'Account.BillingCity',
                    error: null
                },
                rightHandSide: {
                    value: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2.BillingCity',
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
                rowIndex: '1a934031-6241-4115-9514-61184d4c5b75',
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
                rowIndex: '48d95e2c-7c52-4423-b36a-86c4790064a5',
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
        guid: 'c62fed4b-ced5-4d6f-8a8f-5f5f5c525309',
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
            value: 'd1fda889-4f3a-48cd-ba79-be4fbca04da2',
            error: null
        },
        inputReferenceIndex: {
            value: '3b362fa9-ea82-47fe-85f4-25406e719a72',
            error: null
        },
        object: {
            value: '',
            error: null
        },
        objectIndex: {
            value: '7d45ed5b-7cfd-40e1-8028-23a7e1026335',
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
    }
};
