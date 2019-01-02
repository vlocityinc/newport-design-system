// Used by invocableActionEditorIntegration.test.js for W-5715080
export const flowWithApexActionSubmitForApproval = {
  "createdById": "005xx000001X7i5AAC",
  "createdDate": "2018-12-21T10:30:25.000+0000",
  "definitionId": "300xx000000boSvAAI",
  "fieldsToNull": [],
  "fullName": "submitForApprovalBug",
  "id": "301xx000003Gas3AAC",
  "lastModifiedBy": {
    "fieldsToNull": [],
    "name": "User User"
  },
  "lastModifiedById": "005xx000001X7i5AAC",
  "lastModifiedDate": "2018-12-21T10:30:26.000+0000",
  "manageableState": "unmanaged",
  "masterLabel": "submitForApprovalBug",
  "metadata": {
    "actionCalls": [
      {
        "actionName": "submit",
        "actionType": "submit",
        "inputParameters": [
          {
            "name": "nextApproverIds",
            "processMetadataValues": [],
            "value": {
              "elementReference": "textColVar"
            }
          },
          {
            "name": "objectId",
            "processMetadataValues": [],
            "value": {
              "stringValue": ""
            }
          }
        ],
        "label": "submitForApproval",
        "locationX": 381,
        "locationY": 305,
        "name": "submitForApproval",
        "outputParameters": [],
        "processMetadataValues": []
      }
    ],
    "apexPluginCalls": [],
    "assignments": [],
    "choices": [],
    "constants": [],
    "decisions": [],
    "dynamicChoiceSets": [],
    "formulas": [],
    "interviewLabel": "submitForApprovalBug {!$Flow.CurrentDateTime}",
    "isTemplate": false,
    "label": "submitForApprovalBug",
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
        "dataType": "String",
        "isCollection": true,
        "isInput": false,
        "isOutput": false,
        "name": "textColVar",
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