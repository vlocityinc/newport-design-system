export const flowWithFormula = {
  "createdById": "005xx000001X7i5AAC",
  "createdDate": "2018-12-19T15:44:12.000+0000",
  "definitionId": "300xx000000boRJAAY",
  "fieldsToNull": [],
  "fullName": "FlowWithFormula",
  "id": "301xx000003GaqRAAS",
  "lastModifiedBy": {
    "fieldsToNull": [],
    "name": "User User"
  },
  "lastModifiedById": "005xx000001X7i5AAC",
  "lastModifiedDate": "2018-12-19T15:44:13.000+0000",
  "manageableState": "unmanaged",
  "masterLabel": "FlowWithFormula",
  "metadata": {
    "actionCalls": [],
    "apexPluginCalls": [],
    "assignments": [],
    "choices": [],
    "constants": [],
    "decisions": [],
    "dynamicChoiceSets": [],
    "formulas": [
      {
        "dataType": "String",
        "description": "a text formula",
        "expression": "IF({!accountVar.AnnualRevenue} < 1000000,\"Small\", \"Big\")",
        "name": "textFormula",
        "processMetadataValues": [],
        "scale": 0
      }
    ],
    "interviewLabel": "FlowWithFormula {!$Flow.CurrentDateTime}",
    "isTemplate": false,
    "label": "FlowWithFormula",
    "loops": [],
    "processMetadataValues": [
      {
        "name": "BuilderType",
        "value": {
          "stringValue": "LightningFlowBuilder"
        }
      },
      {
        "name": "OriginBuilderType",
        "value": {
          "stringValue": "LightningFlowBuilder"
        }
      }
    ],
    "processType": "Flow",
    "recordCreates": [],
    "recordDeletes": [],
    "recordLookups": [],
    "recordUpdates": [],
    "screens": [],
    "stages": [],
    "status": "InvalidDraft",
    "steps": [],
    "subflows": [],
    "textTemplates": [],
    "variables": [
      {
        "dataType": "SObject",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "accountVar",
        "objectType": "Account",
        "processMetadataValues": [],
        "scale": 0
      }
    ],
    "waits": []
  },
  "processType": "Flow",
  "status": "InvalidDraft",
  "versionNumber": 1
}