// To be removed with W-8208977
// see flowExtension.createdescription
export const mockFlowRuntimeEmailFlowExtensionDescription = {
    name: 'flowruntime:email',
    inputParameters: [
        {
            apiName: 'disabled',
            dataType: 'boolean',
            description: 'Prevents the user from modifying or copying the value.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Disabled',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'label',
            dataType: 'string',
            description: 'The label that appears above the email field.',
            hasDefaultValue: true,
            isRequired: true,
            label: 'Label',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'placeholder',
            dataType: 'string',
            description:
                "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
            hasDefaultValue: true,
            isRequired: false,
            label: 'Placeholder Text',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: 'you@example.com'
        },
        {
            apiName: 'readonly',
            dataType: 'boolean',
            description: 'Prevents the user from modifying the value, but not from copying it.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Read Only',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'required',
            dataType: 'boolean',
            description: 'Requires the user to enter a value.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Required',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'value',
            dataType: 'string',
            description:
                "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
            hasDefaultValue: true,
            isRequired: false,
            label: 'Value',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    outputParameters: [
        {
            apiName: 'disabled',
            dataType: 'boolean',
            description: 'Prevents the user from modifying or copying the value.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Disabled',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'label',
            dataType: 'string',
            description: 'The label that appears above the email field.',
            hasDefaultValue: true,
            isRequired: true,
            label: 'Label',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: 'Email'
        },
        {
            apiName: 'placeholder',
            dataType: 'string',
            description:
                "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
            hasDefaultValue: true,
            isRequired: false,
            label: 'Placeholder Text',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: 'you@example.com'
        },
        {
            apiName: 'readonly',
            dataType: 'boolean',
            description: 'Prevents the user from modifying the value, but not from copying it.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Read Only',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'required',
            dataType: 'boolean',
            description: 'Requires the user to enter a value.',
            hasDefaultValue: true,
            isRequired: false,
            label: 'Required',
            isInput: true,
            isOutput: true,
            maxOccurs: 1,
            defaultValue: '$GlobalConstant.False'
        },
        {
            apiName: 'value',
            dataType: 'string',
            description:
                "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
            hasDefaultValue: true,
            isRequired: false,
            label: 'Value',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    configurationEditor: null
};

export const mockLightningCompWithAccountOutputFlowExtensionDescription = {
    name: 'c:HelloWorld',
    inputParameters: [
        {
            apiName: 'account',
            dataType: 'sobject',
            subtype: 'Account',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Account',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'greeting',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Greeting',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'subject',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Subject',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    outputParameters: [
        {
            apiName: 'account',
            dataType: 'sobject',
            subtype: 'Account',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Account',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'greeting',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Greeting',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'subject',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Subject',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    configurationEditor: null
};

export const mockLightningCompWithoutSObjectOutputFlowExtensionDescription = {
    name: 'c:noSobjectOutputComp',
    inputParameters: [
        {
            apiName: 'greeting',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Greeting',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'subject',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Subject',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    outputParameters: [
        {
            apiName: 'greeting',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Greeting',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'subject',
            dataType: 'string',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Subject',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        }
    ]
};

// This is NOT the lookup component
export const mockLightningCompWithGenericTypesFlowExtensionDescription = {
    name: 'c:lookup',
    inputParameters: [
        {
            apiName: 'helpText',
            dataType: 'string',
            description: 'The help text for pattern',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Help text for pattern',
            isInput: true,
            isOutput: false,
            maxOccurs: 1
        },
        {
            apiName: 'objectApiName',
            dataType: 'string',
            availableValues: 'T',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Object API Name',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'userPrompt',
            dataType: 'string',
            description: 'The prompt',
            hasDefaultValue: false,
            isRequired: false,
            label: 'User Prompt',
            isInput: true,
            isOutput: false,
            maxOccurs: 1
        }
    ],
    outputParameters: [
        {
            apiName: 'objectApiName',
            dataType: 'string',
            availableValues: '{T}',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Object API Name',
            isInput: true,
            isOutput: true,
            maxOccurs: 1
        },
        {
            apiName: 'selectedRecord',
            dataType: 'sobject',
            subtype: '{T}',
            description: 'The SObject the user has selected',
            hasDefaultValue: false,
            isRequired: false,
            label: 'The selected Record',
            isInput: false,
            isOutput: true,
            maxOccurs: 1
        }
    ],
    genericTypes: [
        {
            description: 'Select the api name of the SObject this component is going to be looking for',
            fieldsToNull: [],
            label: 'Object API Name',
            name: 'T',
            superType: 'SOBJECT'
        }
    ]
};

export const mockLightningCompWithSObjectCollectionOutputFlowExtensionDescription = {
    name: 'c:sobjectCollectionOutputComp',
    inputParameters: [
        {
            apiName: 'accounts',
            dataType: 'sobject',
            subtype: 'Account',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Accounts',
            isInput: true,
            isOutput: true,
            maxOccurs: 2000
        }
    ],
    outputParameters: [
        {
            apiName: 'accounts',
            dataType: 'sobject',
            subtype: 'Account',
            hasDefaultValue: false,
            isRequired: false,
            label: 'Accounts',
            isInput: true,
            isOutput: true,
            maxOccurs: 2000
        }
    ],
    configurationEditor: null
};
