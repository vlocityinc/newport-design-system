// @ts-nocheck
// to update elementsForPropertyEditors from flowWithAllElementsUIModel, run propertyEditorFactory.test.js and follow instructions
export const elementsForPropertyEditors = {
    stringVariable: {
        guid: '756e3b06-1ee6-4f8e-82b2-ce141c9405db',
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
            value: 'f8b3b3b3-2a93-4a2c-8630-815b2797aaa7',
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
            value: 'fcf61595-af2e-4982-9607-5de1c2819fab',
            error: null
        }
    },
    numberVariable: {
        guid: '9d11ba05-33c4-4893-87b8-9560be9557d2',
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
            value: 'ead8ca09-bffd-47ee-93c2-7ebeaf14def2',
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
            value: '458ac1c7-23e7-49cc-a518-5eaf4f218a49',
            error: null
        }
    },
    dateVariable: {
        guid: '2635dcd9-5d1d-4d46-b683-eabd7059690c',
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
            value: '54aae715-8881-4a52-b7a9-25c385d1488e',
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
            value: '3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b',
            error: null
        }
    },
    stringCollectionVariable1: {
        guid: '5e2803c7-a184-465c-92e3-1d29634f2114',
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
            value: 'd050fa16-f494-4685-a87f-3c68666d1ba8',
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
            value: '9ded932c-cb00-42a7-bbfc-dddb4c2903fd',
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
    }
};
