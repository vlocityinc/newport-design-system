export const USING_SOBJECT = {
  createdById: "005xx000001X7OjAAK",
  createdDate: "2019-01-04T15:47:10.000+0000",
  definitionId: "300xx000000bngXAAQ",
  fieldsToNull: [],
  fullName: "Flow_Wth_Delete_Records_Using_SObject",
  id: "301xx000003GZxbAAG",
  lastModifiedBy: {
    fieldsToNull: [],
    name: "User One"
  },
  lastModifiedById: "005xx000001X7OjAAK",
  lastModifiedDate: "2019-01-04T15:47:11.000+0000",
  manageableState: "unmanaged",
  masterLabel: "Flow With Delete Records Using SObject",
  metadata: {
    actionCalls: [],
    apexPluginCalls: [],
    assignments: [],
    choices: [],
    constants: [],
    decisions: [],
    dynamicChoiceSets: [],
    formulas: [],
    interviewLabel: "Flow With Delete Records Using SObject {!$Flow.CurrentDateTime}",
    isTemplate: false,
    label: "Flow With Delete Records Using SObject",
    loops: [],
    processMetadataValues: [
      {
        name: "BuilderType",
        value: {
          stringValue: "LightningFlowBuilder"
        }
      },
      {
        name: "OriginBuilderType",
        value: {
          stringValue: "LightningFlowBuilder"
        }
      }
    ],
    processType: "AutoLaunchedFlow",
    recordCreates: [],
    recordDeletes: [
      {
        description: "this is the delete records description",
        filters: [],
        inputReference: "vAccount",
        label: "delete acccount using sobject",
        locationX: 305,
        locationY: 60,
        name: "delete_acccount_using_sobject",
        processMetadataValues: []
      }
    ],
    recordLookups: [],
    recordUpdates: [],
    screens: [],
    stages: [],
    startElementReference: "delete_acccount_using_sobject",
    status: "Draft",
    steps: [],
    subflows: [],
    textTemplates: [],
    variables: [{
        dataType: "SObject",
        description: "a record variable of account type",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "vAccount",
        objectType: "Account",
        processMetadataValues: [],
        scale: 0
      }, {
         dataType: "SObject",
         description: "a record variable of case type",
         isCollection: false,
         isInput: false,
         isOutput: false,
         name: "vCase",
         objectType: "Case",
         processMetadataValues: [],
         scale: 0
      }
    ],
    waits: []
  },
  processType: "AutoLaunchedFlow",
  status: "Draft",
  versionNumber: 1
};

export const USING_FIELDS = {
createdById: "005RM000001c3WeYAI",
createdDate: "2019-01-09T14:19:45.000+0000",
definitionId: "300RM0000004OETYA2",
fieldsToNull: [],
fullName: "Flow_With_Delete_Records_Using_Fields",
id: "301RM0000004MGZYA2",
lastModifiedBy: {fieldsToNull: Array(0), name: "Admin User"},
lastModifiedById: "005RM000001c3WeYAI",
lastModifiedDate: "2019-01-09T14:19:52.000+0000",
manageableState: "unmanaged",
masterLabel: "Flow With Delete Records Using Fields",
metadata: {
  actionCalls: [],
  apexPluginCalls: [],
  assignments: [],
  choices: [],
  constants: [],
  decisions: [],
  dynamicChoiceSets: [],
  formulas: [],
  interviewLabel: "Flow With Delete Records Using Fields {!$Flow.CurrentDateTime}",
  isTemplate: false,
  label: "Flow With Delete Records Using Fields",
  loops: [],
  processMetadataValues: [
    {
      name: "BuilderType",
      value: {
        stringValue: "LightningFlowBuilder"
      }
    },
    {
      name: "OriginBuilderType",
      value: {
        stringValue: "LightningFlowBuilder"
      }
    }
  ],
  processType: "AutoLaunchedFlow",
  recordCreates: [],
  recordDeletes: [
    {
      filters: [
        {
          field: "BillingCity",
          operator: "EqualTo",
          processMetadataValues: [],
          value: {
            stringValue: "Paris"
          }
        },
        {
          field: "BillingCountry",
          operator: "EqualTo",
          processMetadataValues: [],
          value: {
            stringValue: "France"
          }
        }
      ],
      label: "delete acccount using fields",
      locationX: 350,
      locationY: 139,
      name: "delete_acccount_using_fields",
      object: "Account",
      processMetadataValues: []
    }
  ],
  recordLookups: [],
  recordUpdates: [],
  screens: [],
  stages: [],
  startElementReference: "delete_acccount_using_fields",
  status: "Draft",
  steps: [],
  subflows: [],
  textTemplates: [],
  variables: [],
  waits: []
},
processType: "AutoLaunchedFlow",
status: "Draft",
versionNumber: 1
};