export const flowWithApexAction = {
        "createdById": "005xx000001X7i5AAC",
        "createdDate": "2018-12-19T13:46:19.000+0000",
        "definitionId": "300xx000000bnwfAAA",
        "fieldsToNull": [],
        "fullName": "flowWithApexAction",
        "id": "301xx000003GaglAAC",
        "lastModifiedBy": {
          "fieldsToNull": [],
          "name": "User User"
        },
        "lastModifiedById": "005xx000001X7i5AAC",
        "lastModifiedDate": "2018-12-19T13:46:21.000+0000",
        "manageableState": "unmanaged",
        "masterLabel": "flowWithApexAction",
        "metadata": {
          "actionCalls": [
            {
              "actionName": "AllTypesApexAction",
              "actionType": "apex",
              "inputParameters": [
                {
                  "name": "accountParam",
                  "processMetadataValues": [],
                  "value": {
                    "elementReference": "accountSObjectVariable"
                  }
                },
                {
                  "name": "idParam",
                  "processMetadataValues": [],
                  "value": {
                    "elementReference": "stringVariable"
                  }
                },
                {
                  "name": "numberParam",
                  "processMetadataValues": [],
                  "value": {
                    "elementReference": "numberVariable"
                  }
                },
                {
                  "name": "stringParam",
                  "processMetadataValues": [],
                  "value": {
                    "elementReference": "stringVariable"
                  }
                }
              ],
              "label": "allTypesApexAction",
              "locationX": 372,
              "locationY": 287,
              "name": "allTypesApexAction",
              "outputParameters": [
                {
                  "assignToReference": "numberVariable",
                  "name": "outputNumberParam",
                  "processMetadataValues": []
                },
                {
                  "assignToReference": "stringVariable",
                  "name": "outputStringParam",
                  "processMetadataValues": []
                }
              ],
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
          "interviewLabel": "flowWithApexAction {!$Flow.CurrentDateTime}",
          "isTemplate": false,
          "label": "flowWithApexAction",
          "loops": [],
          "processMetadataValues": [
            {
              "name": "BuilderType",
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
          "startElementReference": "allTypesApexAction",
          "status": "Draft",
          "steps": [],
          "subflows": [],
          "textTemplates": [],
          "variables": [
            {
              "dataType": "SObject",
              "isCollection": true,
              "isInput": false,
              "isOutput": false,
              "name": "accountSObjectCollectionVariable",
              "objectType": "Account",
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "dataType": "SObject",
              "isCollection": false,
              "isInput": false,
              "isOutput": false,
              "name": "accountSObjectVariable",
              "objectType": "Account",
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "dataType": "Date",
              "isCollection": false,
              "isInput": false,
              "isOutput": false,
              "name": "dateVariable",
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "dataType": "Number",
              "isCollection": false,
              "isInput": false,
              "isOutput": false,
              "name": "numberVariable",
              "processMetadataValues": [],
              "scale": 2
            },
            {
              "dataType": "String",
              "isCollection": true,
              "isInput": false,
              "isOutput": false,
              "name": "stringCollectionVariable",
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "dataType": "String",
              "isCollection": false,
              "isInput": false,
              "isOutput": false,
              "name": "stringVariable",
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "waits": []
        },
        "processType": "Flow",
        "status": "Draft",
        "versionNumber": 2
      }