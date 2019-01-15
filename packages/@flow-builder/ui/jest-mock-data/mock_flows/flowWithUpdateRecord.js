export const USING_SOBJECT = {
  createdById: "005xx000001X7OjAAK",
  createdDate: "2019-01-04T15:47:10.000+0000",
  definitionId: "300xx000000bngXAAQ",
  fieldsToNull: [],
  fullName: "Flow_Wth_Update_Records_Using_SObject",
  id: "301xx000003GZxbAAG",
  lastModifiedBy: {
    fieldsToNull: [],
    name: "User One"
  },
  lastModifiedById: "005xx000001X7OjAAK",
  lastModifiedDate: "2019-01-04T15:47:11.000+0000",
  manageableState: "unmanaged",
  masterLabel: "Flow With Update Records Using SObject",
  metadata: {
    actionCalls: [],
    apexPluginCalls: [],
    assignments: [],
    choices: [],
    constants: [],
    decisions: [],
    dynamicChoiceSets: [],
    formulas: [],
    interviewLabel: "Flow With Update Records Using SObject {!$Flow.CurrentDateTime}",
    isTemplate: false,
    label: "Flow With Update Records Using SObject",
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
    recordDeletes: [],
    recordLookups: [],
    recordUpdates: [{
        filters: [],
        inputAssignments: [],
        inputReference: "contractToUpdateVar",
        label: "update Contract using sobject",
        locationX: 245,
        locationY: 99,
        name: "update_contract_using_sobject",
        processMetadataValues: [],
        scale: 0
      }],
    screens: [],
    stages: [],
    startElementReference: "update_contract_uvContractToUpdateVarsing_sobject",
    status: "Draft",
    steps: [],
    subflows: [],
    textTemplates: [],
    variables: [{
        dataType: "SObject",
        isCollection: false,
        isInput: false,
        isOutput: false,
        name: "contractToUpdateVar",
        objectType: "Contract",
        processMetadataValues: [],
        scale: 0
      }, {
          dataType: "SObject",
          isCollection: false,
          isInput: false,
          isOutput: false,
          name: "contactToUpdateVar",
          objectType: "Contact",
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
fullName: "Flow_With_Update_Records_Using_Fields",
id: "301RM0000004MGZYA2",
lastModifiedBy: {fieldsToNull: Array(0), name: "Admin User"},
lastModifiedById: "005RM000001c3WeYAI",
lastModifiedDate: "2019-01-09T14:19:52.000+0000",
manageableState: "unmanaged",
masterLabel: "Flow With Update Records Using Fields",
metadata: {
  actionCalls: [],
  apexPluginCalls: [],
  assignments: [],
  choices: [],
  constants: [],
  decisions: [],
  dynamicChoiceSets: [],
  formulas: [],
  interviewLabel: "Flow With Update Records Using Fields {!$Flow.CurrentDateTime}",
  isTemplate: false,
  label: "Flow With Update Records Using Fields",
  description: "My Flow update Contracts",
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
  recordDeletes: [],
  recordLookups: [],
  recordUpdates: [{
      description: "This Element update each contract with a Billing city equals to Saan Francisco.",
      filters: [{
          field: "BillingCity",
          operator: "EqualTo",
          processMetadataValues: [],
          value: {stringValue: "San Francisco"},
      }, {
          field: "BillingCountry",
          operator: "EqualTo",
          processMetadataValues: [],
          value: {stringValue: "US"},
      }],
      inputAssignments: [{
          field: "Name",
          processMetadataValues: [],
          value: {elementReference: "newNameVar"},
      }],
      label: "update contract using fields",
      locationX: 270,
      locationY: 50,
      name: "update_contract_using_fields",
      object: "Contract",
      processMetadataValues: []
  }],
  screens: [],
  stages: [],
  startElementReference: "update_contract_using_fields",
  status: "Draft",
  steps: [],
  subflows: [],
  textTemplates: [],
  variables: [{
      dataType: "String",
      description: "A new name for the contract.",
      isCollection: false,
      isInput: false,
      isOutput: false,
      name: "newNameVar",
      processMetadataValues: [],
      scale: 0
  }],
  waits: []
},
processType: "AutoLaunchedFlow",
status: "Draft",
versionNumber: 1
};