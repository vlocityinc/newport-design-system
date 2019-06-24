export const mockFlowExtensionListParams = {
  "flowruntime:email": [
    {
      apiName: "disabled",
      dataType: "boolean",
      description: "Prevents the user from modifying or copying the value.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Disabled",
      maxOccurs: 1
    },
    {
      apiName: "label",
      dataType: "string",
      description: "The label that appears above the email field.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Label",
      maxOccurs: 1
    },
    {
      apiName: "placeholder",
      dataType: "string",
      description:
        "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Placeholder Text",
      maxOccurs: 1
    },
    {
      apiName: "readonly",
      dataType: "boolean",
      description:
        "Prevents the user from modifying the value, but not from copying it.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Read Only",
      maxOccurs: 1
    },
    {
      apiName: "required",
      dataType: "boolean",
      description: "Requires the user to enter a value.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Required",
      maxOccurs: 1
    },
    {
      apiName: "value",
      dataType: "string",
      description:
        "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Value",
      maxOccurs: 1
    }
  ],
  "flowruntime:slider": [
    {
      apiName: "label",
      dataType: "string",
      description: "The label that appears above the slider.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Label",
      maxOccurs: 1
    },
    {
      apiName: "max",
      dataType: "int",
      description:
        "The maximum value of the slider range. The default maximum is 100.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Range Maximum",
      maxOccurs: 1
    },
    {
      apiName: "min",
      dataType: "int",
      description:
        "The minimum value of the slider range. The default minimum is 0.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Range Minimum",
      maxOccurs: 1
    },
    {
      apiName: "size",
      dataType: "string",
      description:
        "Controls the size of the slider. Enter one of these values: x-small, small, medium, large.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Slider Size",
      maxOccurs: 1
    },
    {
      apiName: "step",
      dataType: "int",
      description:
        "Divides the slider into a set of steps. Example step sizes include 0.1, 5, and 10. The default value is 1.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Step Size",
      maxOccurs: 1
    },
    {
      apiName: "value",
      dataType: "int",
      description:
        "The number represented by the slider position. To pre-set the value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
      fieldsToNull: [],
      hasDefaultValue: false,
      isInput: true,
      isOutput: true,
      isRequired: false,
      label: "Value",
      maxOccurs: 1
    }
  ]
};

// see screenEditorExtensionUtils.createDescription
export const mockFlowRuntimeEmailFlowExtensionDescription = {
  name: "flowruntime:email",
  inputParameters: [
    {
      apiName: "disabled",
      dataType: "boolean",
      description: "Prevents the user from modifying or copying the value.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Disabled",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "label",
      dataType: "string",
      description: "The label that appears above the email field.",
      hasDefaultValue: true,
      isRequired: true,
      label: "Label",
      maxOccurs: 1,
      defaultValue: "Email"
    },
    {
      apiName: "placeholder",
      dataType: "string",
      description:
        "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Placeholder Text",
      maxOccurs: 1,
      defaultValue: "you@example.com"
    },
    {
      apiName: "readonly",
      dataType: "boolean",
      description:
        "Prevents the user from modifying the value, but not from copying it.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Read Only",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "required",
      dataType: "boolean",
      description: "Requires the user to enter a value.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Required",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "value",
      dataType: "string",
      description:
        "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Value",
      maxOccurs: 1
    }
  ],
  outputParameters: [
    {
      apiName: "disabled",
      dataType: "boolean",
      description: "Prevents the user from modifying or copying the value.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Disabled",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "label",
      dataType: "string",
      description: "The label that appears above the email field.",
      hasDefaultValue: true,
      isRequired: true,
      label: "Label",
      maxOccurs: 1,
      defaultValue: "Email"
    },
    {
      apiName: "placeholder",
      dataType: "string",
      description:
        "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Placeholder Text",
      maxOccurs: 1,
      defaultValue: "you@example.com"
    },
    {
      apiName: "readonly",
      dataType: "boolean",
      description:
        "Prevents the user from modifying the value, but not from copying it.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Read Only",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "required",
      dataType: "boolean",
      description: "Requires the user to enter a value.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Required",
      maxOccurs: 1,
      defaultValue: "$GlobalConstant.False"
    },
    {
      apiName: "value",
      dataType: "string",
      description:
        "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
      hasDefaultValue: true,
      isRequired: false,
      label: "Value",
      maxOccurs: 1
    }
  ]
};
