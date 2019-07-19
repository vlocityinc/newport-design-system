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

// see flowExtension.createdescription
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
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
      isInput: true,
      isOutput: true,
      maxOccurs: 1
    }
  ]
};

// as returned by getFlowExtensionParams([''flowruntime:address'])
export const mockRuntimeAddressFlowExtensionListParams = {
    "flowruntime:address": [
    {
        apiName:'city',
        dataType:'string',
        description:"To give City a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'City Value',
        maxOccurs:'1',
    },
    {
        apiName:'inputCountryOptions',
        dataType:'string',
        description:"The active countries configured in state and country picklists. To override the options, set this attribute to a comma-delimited set of countries.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'Country Options',
        maxOccurs:'1',
    },
    {
        apiName:'country',
        dataType:'string',
        description:"To gi1ve Country a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'Country Value',
        maxOccurs:'1',
    },
    {
        apiName:'addressLabel',
        dataType:'string',
        defaultValue:'Address',
        description:"Label for the heading that appears above the group of address fields.",
        hasDefaultValue:true,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'Label',
        maxOccurs:'1',
    },
    {
        apiName:'postalCode',
        dataType:'string',
        description:"To give Postal Code a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'Postal Code Value',
        maxOccurs:'1'
    },
    {
        apiName:'inputProvinceOptions',
        dataType:'string',
        description:"The active states configured in state and country picklists. To override the options, set this attribute to a comma-delimited set of states.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'State/Province Options',
        maxOccurs:'1'
    },
    {
        apiName:'province',
        dataType:'string',
        description:"To give State a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'State/Province Value',
        maxOccurs:'1'
    },
    {
        apiName:'street',
        dataType:'string',
        description:"To give Street a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
        hasDefaultValue:false,
        isInput:true,
        isOutput:true,
        isRequired:false,
        label:'Street Value',
        maxOccurs:'1'
    }
  ]
};

// as returned by getFlowExtensions()
export const mockFlowExtensions = [
    {
      description:'Address Component',
      label:'Address',
      qualifiedApiName:'flowruntime:address',
      source:'Standard',
    },
    {
      description:'Dependent Picklists',
      label:'Dependent Picklists',
      qualifiedApiName:'flowruntime:dependentPicklists',
      source:'Standard',
    },
    {
      description:'Email Component',
      label:'Email',
      qualifiedApiName:'flowruntime:email',
      source:'Standard',
    },
    {
      description:'Display Image',
      label:'Display Image',
      qualifiedApiName:'flowruntime:image',
      source:'Standard',
    },
    {
      description:'Lookup Component',
      label:'Lookup',
      qualifiedApiName:'flowruntime:lookup',
      source:'Standard',
    },
    {
      description:'Name Component',
      label:'Name',
      qualifiedApiName:'flowruntime:name',
      source:'Standard',
    },
    {
      description:'Phone',
      label:'Phone',
      qualifiedApiName:'flowruntime:phone',
      source:'Standard',
    },
    {
      description:'Slider Component',
      label:'Slider',
      qualifiedApiName:'flowruntime:slider',
      source:'Standard',
    },
    {
      description:'Toggle',
      label:'Toggle',
      qualifiedApiName:'flowruntime:toggle',
      source:'Standard',
    },
    {
      description:'URL Component',
      label:'URL',
      qualifiedApiName:'flowruntime:url',
      source:'Standard',
    },
    {
      description:'Upload and attach files to records.',
      label:'File Upload',
      qualifiedApiName:'forceContent:fileUpload',
      source:'Standard'
    }
];
