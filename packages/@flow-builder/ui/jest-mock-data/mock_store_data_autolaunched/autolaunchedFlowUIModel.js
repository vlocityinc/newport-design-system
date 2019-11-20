// To update autolaunchedFlowUIModel from autoLaunchedFlow, run flowTranslator.test.js and follow instructions
export const autolaunchedFlowUIModel = {
  "elements": {
    "07fd2a44-4192-4709-888d-8ccc18cb4580": {
      "guid": "07fd2a44-4192-4709-888d-8ccc18cb4580",
      "description": "",
      "label": "undefined, undefined, FlowBuilderStartEditor.triggerFrequencyOnce",
      "locationX": 59,
      "locationY": 42,
      "isCanvasElement": true,
      "connectorCount": 1,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "elementType": "START_ELEMENT",
      "maxConnections": 1,
      "triggerType": "Scheduled",
      "filterType": "all",
      "startDate": "2019-11-18",
      "startTime": "05:45:00.000",
      "frequency": "Once",
      "object": "",
      "objectIndex": "4c1d2c56-9528-42a8-9de2-9bdf12e87a1b",
      "filters": [
        {
          "rowIndex": "703162a5-d48f-40b6-b52e-ec4e1944ba34",
          "leftHandSide": "",
          "rightHandSide": "",
          "rightHandSideDataType": "",
          "operator": ""
        }
      ]
    },
    "a4451815-988d-4f17-883d-64b6ad9fab7e": {
      "guid": "a4451815-988d-4f17-883d-64b6ad9fab7e",
      "name": "postToChatter",
      "description": "",
      "label": "postToChatter",
      "locationX": 558,
      "locationY": 206.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "chatterPost",
      "actionName": "chatterPost",
      "dataTypeMappings": [],
      "inputParameters": [
        {
          "rowIndex": "6d690706-908c-4d94-9513-1b219301b4c5",
          "name": "text",
          "value": "this is a post to chatter",
          "valueDataType": "String"
        },
        {
          "rowIndex": "e682f03e-925a-4d84-adc3-f1c5ceea0201",
          "name": "subjectNameOrId",
          "value": "Automation Builder Simplification",
          "valueDataType": "String"
        }
      ],
      "outputParameters": [],
      "availableConnections": [
        {
          "type": "REGULAR"
        },
        {
          "type": "FAULT"
        }
      ],
      "maxConnections": 2,
      "elementType": "ActionCall",
      "dataType": "ActionOutput",
      "storeOutputAutomatically": true
    },
    "297834ec-f5c8-4128-aa38-dc437f0c6a9b": {
      "guid": "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
      "name": "decision",
      "description": "",
      "label": "decision",
      "locationX": 552,
      "locationY": 41.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "outcomeReferences": [
        {
          "outcomeReference": "2e01b9c4-5144-4db2-9543-7899c5c34329"
        }
      ],
      "defaultConnectorLabel": "Default Outcome",
      "elementType": "Decision",
      "maxConnections": 2,
      "availableConnections": [
        {
          "type": "REGULAR",
          "childReference": "2e01b9c4-5144-4db2-9543-7899c5c34329"
        },
        {
          "type": "DEFAULT"
        }
      ]
    },
    "2e01b9c4-5144-4db2-9543-7899c5c34329": {
      "guid": "2e01b9c4-5144-4db2-9543-7899c5c34329",
      "name": "outcome",
      "label": "outcome",
      "elementType": "OUTCOME",
      "dataType": "Boolean",
      "conditionLogic": "and",
      "conditions": [
        {
          "rowIndex": "fe30ada4-6781-4ffd-84d1-9efbadaa29ab",
          "leftHandSide": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8.CreatedById",
          "rightHandSide": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8.CreatedById",
          "rightHandSideDataType": "reference",
          "operator": "EqualTo"
        }
      ]
    },
    "bf05168b-6bd9-483a-8ea8-5e4d73a1c717": {
      "guid": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
      "name": "wait1",
      "description": "",
      "label": "wait1",
      "locationX": 311,
      "locationY": 284,
      "isCanvasElement": true,
      "connectorCount": 1,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "waitEventReferences": [
        {
          "waitEventReference": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1"
        }
      ],
      "defaultConnectorLabel": "Default Path",
      "elementType": "Wait",
      "maxConnections": 3,
      "availableConnections": [
        {
          "type": "DEFAULT"
        },
        {
          "type": "FAULT"
        }
      ]
    },
    "cc0381a7-0c64-4935-bc0c-25ecc2e958f1": {
      "guid": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
      "name": "waitEvent1",
      "label": "waitEvent1",
      "elementType": "WAIT_EVENT",
      "dataType": "Boolean",
      "conditions": [
        {
          "rowIndex": "ed85c895-feb5-45cb-b486-49cfd9da8e20",
          "leftHandSide": "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
          "rightHandSide": "text",
          "rightHandSideDataType": "String",
          "operator": "EqualTo"
        }
      ],
      "conditionLogic": "and",
      "eventType": "FlowExecutionErrorEvent",
      "eventTypeIndex": "4968239c-5e3d-45ee-9339-f575c917e223",
      "inputParameters": [],
      "outputParameters": {
        "FlowExecutionErrorEvent": {
          "rowIndex": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
          "name": "FlowExecutionErrorEvent",
          "value": "",
          "valueDataType": "reference"
        }
      }
    },
    "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be": {
      "guid": "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
      "name": "stringVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "String",
      "subtype": null,
      "subtypeIndex": "53329036-32e6-4965-a1d2-b12cd0344f99",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "04e1c283-fc0b-4928-a495-89d956368769"
    },
    "a193d56e-2ee7-422d-a3ff-664fc82a0fd8": {
      "guid": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8",
      "name": "accountVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "SObject",
      "subtype": "Account",
      "subtypeIndex": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "a35e28e0-3d3b-44b1-9638-9caba6ef3820"
    },
    "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1": {
      "guid": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1",
      "name": "lookupRecord",
      "description": "",
      "label": "lookupRecord",
      "locationX": 303,
      "locationY": 457,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "object": "Account",
      "objectIndex": "3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
      "filterType": "none",
      "filters": [
        {
          "rowIndex": "a18b3d06-504c-4e47-9f44-6663c42703cf",
          "leftHandSide": "",
          "rightHandSide": "",
          "rightHandSideDataType": "",
          "operator": ""
        }
      ],
      "queriedFields": null,
      "sortOrder": "NotSorted",
      "sortField": "",
      "maxConnections": 2,
      "availableConnections": [
        {
          "type": "REGULAR"
        },
        {
          "type": "FAULT"
        }
      ],
      "elementType": "RecordQuery",
      "outputReferenceIndex": "2f00ca0d-743f-4639-a084-272bbc548f8b",
      "dataType": "SObject",
      "isCollection": false,
      "subtype": "Account",
      "storeOutputAutomatically": true,
      "getFirstRecordOnly": true,
      "variableAndFieldMapping": "automatic"
    }
  },
  "connectors": [
    {
      "guid": "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
      "source": "07fd2a44-4192-4709-888d-8ccc18cb4580",
      "childSource": null,
      "target": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
      "label": null,
      "type": "REGULAR",
      "config": {
        "isSelected": false
      }
    },
    {
      "guid": "7f4ddba5-e41b-456b-b686-94b257cc9914",
      "source": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
      "childSource": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
      "target": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1",
      "label": "waitEvent1",
      "type": "REGULAR",
      "config": {
        "isSelected": false
      }
    }
  ],
  "canvasElements": [
    "07fd2a44-4192-4709-888d-8ccc18cb4580",
    "a4451815-988d-4f17-883d-64b6ad9fab7e",
    "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
    "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
    "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1"
  ],
  "properties": {
    "canOnlySaveAsNewDefinition": false,
    "description": "",
    "elementType": "FLOW_PROPERTIES",
    "hasUnsavedChanges": false,
    "interviewLabel": "flow {!$Flow.CurrentDateTime}",
    "isCreatedOutsideLfb": false,
    "isLightningFlowBuilder": true,
    "isTemplate": false,
    "label": "autolaunchedFlow",
    "lastModifiedBy": "User User",
    "lastModifiedDate": "2019-09-06T13:36:33.000+0000",
    "lastInlineResourceGuid": null,
    "lastInlineResourcePosition": null,
    "lastInlineResourceRowIndex": null,
    "name": "autolaunchedFlow",
    "processType": "AutoLaunchedFlow",
    "runInMode": null,
    "status": "Draft",
    "versionNumber": 1
  }
};
