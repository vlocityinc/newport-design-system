// see screenEditorExtensionUtils.createDescription
export const mockFlowRuntimeEmailFlowExtensionDescription = {
        "name": "flowruntime:email",
        "inputParameters": [
          {
            "apiName": "disabled",
            "dataType": "boolean",
            "description": "Prevents the user from modifying or copying the value.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Disabled",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "label",
            "dataType": "string",
            "description": "The label that appears above the email field.",
            "hasDefaultValue": true,
            "isRequired": true,
            "label": "Label",
            "maxOccurs": 1,
            "defaultValue": "Email"
          },
          {
            "apiName": "placeholder",
            "dataType": "string",
            "description": "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Placeholder Text",
            "maxOccurs": 1,
            "defaultValue": "you@example.com"
          },
          {
            "apiName": "readonly",
            "dataType": "boolean",
            "description": "Prevents the user from modifying the value, but not from copying it.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Read Only",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "required",
            "dataType": "boolean",
            "description": "Requires the user to enter a value.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Required",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "value",
            "dataType": "string",
            "description": "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Value",
            "maxOccurs": 1
          }
        ],
        "outputParameters": [
          {
            "apiName": "disabled",
            "dataType": "boolean",
            "description": "Prevents the user from modifying or copying the value.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Disabled",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "label",
            "dataType": "string",
            "description": "The label that appears above the email field.",
            "hasDefaultValue": true,
            "isRequired": true,
            "label": "Label",
            "maxOccurs": 1,
            "defaultValue": "Email"
          },
          {
            "apiName": "placeholder",
            "dataType": "string",
            "description": "Text that appears in the field when it's empty. Use placeholder text to give users a hint about what to enter in the field.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Placeholder Text",
            "maxOccurs": 1,
            "defaultValue": "you@example.com"
          },
          {
            "apiName": "readonly",
            "dataType": "boolean",
            "description": "Prevents the user from modifying the value, but not from copying it.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Read Only",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "required",
            "dataType": "boolean",
            "description": "Requires the user to enter a value.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Required",
            "maxOccurs": 1,
            "defaultValue": "$GlobalConstant.False"
          },
          {
            "apiName": "value",
            "dataType": "string",
            "description": "To provide a default value, set this attribute's value. To use the user-entered value elsewhere in your flow, store this attribute's output value in a variable.",
            "hasDefaultValue": true,
            "isRequired": false,
            "label": "Value",
            "maxOccurs": 1
          }
        ]
      };