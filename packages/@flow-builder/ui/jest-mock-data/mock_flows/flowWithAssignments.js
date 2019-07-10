export const flowWithAssignments = {
  createdById: "005xx000001Sv6AAAS",
  createdDate: "2018-09-30T19:17:42.000+0000",
  definitionId: "300xx00000002cNAAQ",
  fieldsToNull: [],
  fullName: "FlowWithAssignment",
  id: "301xx000000002MAAQ",
  lastModifiedById: "005xx000001Sv6AAAS",
  lastModifiedDate: "2018-09-30T19:17:42.000+0000",
  manageableState: "unmanaged",
  masterLabel: "FlowWithAssignment",
  metadata: {
    actionCalls: [],
    apexPluginCalls: [],
    assignments: [
      {
        assignmentItems: [
          {
            assignToReference: "VariableWithText",
            operator: "Assign",
            value: {
              stringValue: "Hello"
            }
          },
          {
            assignToReference: "VariableWithNumber",
            operator: "Add",
            value: {
              numberValue: 10
            }
          },
          {
            assignToReference: "VariableWithRecordValue",
            operator: "Assign",
            value: {
              elementReference: "VariableWithRecordValue"
            }
          },
          {
            assignToReference: "VariableWithNumber",
            operator: "Subtract",
            value: {
              numberValue: 2
            }
          }
        ],
        label: "AssignmentWithMultipleAssignmentItems",
        locationX: 262,
        locationY: 216,
        name: "AssignmentWithMultipleAssignmentItems"
      }
    ],
    choices: [],
    constants: [],
    decisions: [],
    dynamicChoiceSets: [],
    formulas: [],
    interviewLabel: "FlowWithAssignment {!$Flow.CurrentDateTime}",
    isTemplate: false,
    label: "FlowWithAssignment",
    loops: [],
    processMetadataValues: [],
    processType: "AutoLaunchedFlow",
    recordCreates: [],
    recordDeletes: [],
    recordLookups: [],
    recordUpdates: [],
    runInSystemMode: false,
    screens: [],
    stages: [],
    start: {
      locationX: 1000,
      locationY: 2000
    },
    status: "InvalidDraft",
    steps: [],
    subflows: [],
    textTemplates: [],
    variables: [
      {
        dataType: "Date",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "VariableWithDate",
        processMetadataValues: [],
        scale: 0
      },
      {
        dataType: "Number",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "VariableWithNumber",
        processMetadataValues: [],
        scale: 2,
        value: {
          numberValue: 10
        }
      },
      {
        dataType: "SObject",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "VariableWithRecordValue",
        objectType: "Account",
        processMetadataValues: [],
        scale: 0
      },
      {
        dataType: "String",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "VariableWithText",
        processMetadataValues: [],
        scale: 0,
        value: {
          stringValue: "Hello World!!"
        }
      }
    ],
    waits: []
  },
  processType: "AutoLaunchedFlow",
  status: "InvalidDraft",
  versionNumber: 1
};
