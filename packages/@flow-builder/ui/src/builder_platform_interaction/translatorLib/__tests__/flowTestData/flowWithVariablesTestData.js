export const flowWithVariables = {
    "createdById": "005xx000001Sv6AAAS",
    "createdDate": "2018-09-30T18:50:26.000+0000",
    "definitionId": "300xx00000002cIAAQ",
    "fieldsToNull": [],
    "fullName": "FlowWithVariables",
    "id": "301xx000000002HAAQ",
    "lastModifiedById": "005xx000001Sv6AAAS",
    "lastModifiedDate": "2018-09-30T18:50:27.000+0000",
    "manageableState": "unmanaged",
    "masterLabel": "FlowWithVariables",
    "metadata": {
        "actionCalls": [],
        "apexPluginCalls": [],
        "assignments": [],
        "choices": [],
        "constants": [],
        "decisions": [],
        "dynamicChoiceSets": [],
        "formulas": [],
        "interviewLabel": "FlowWithVariables {!$Flow.CurrentDateTime}",
        "isTemplate": false,
        "label": "FlowWithVariables",
        "loops": [],
        "processMetadataValues": [],
        "processType": "AutoLaunchedFlow",
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
        "variables": [{
                "dataType": "Boolean",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithBooleanValue",
                "scale": 0,
                "value": {
                    "booleanValue": true
                }
            },
            {
                "dataType": "String",
                "isCollection": true,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithCollection",
                "scale": 0
            },
            {
                "dataType": "Currency",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithCurrencyValue",
                "scale": 2,
                "value": {
                    "numberValue": 10
                }
            },
            {
                "dataType": "DateTime",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithDateTimeValue",
                "scale": 0,
                "value": {
                    "dateTimeValue": "2018-09-04T07:00:00.000+0000"
                }
            },
            {
                "dataType": "Date",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithDateValue",
                "scale": 0,
                "value": {
                    "dateValue": "2018-09-03T00:00:00.000+0000"
                }
            },
            {
                "dataType": "String",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithElementReference",
                "scale": 0,
                "value": {
                    "elementReference": "VariableWithTextValue"
                }
            },
            {
                "dataType": "Number",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithNumberValue",
                "scale": 2,
                "value": {
                    "numberValue": 10
                }
            },
            {
                "dataType": "SObject",
                "isCollection": true,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithRecordCollection",
                "objectType": "Account",
                "scale": 0
            },
            {
                "dataType": "SObject",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithRecordValue",
                "objectType": "Account",
                "scale": 0
            },
            {
                "dataType": "String",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithStringValue",
                "scale": 0,
                "value": {
                    "stringValue": "Hello {!VariableWithTextValue}"
                }
            },
            {
                "dataType": "String",
                "isCollection": false,
                "isInput": false,
                "isOutput": false,
                "name": "VariableWithTextValue",
                "scale": 0,
                "value": {
                    "stringValue": "abc"
                }
            }
        ],
        "waits": []
    },
    "processType": "AutoLaunchedFlow",
    "status": "InvalidDraft",
    "versionNumber": 1
};