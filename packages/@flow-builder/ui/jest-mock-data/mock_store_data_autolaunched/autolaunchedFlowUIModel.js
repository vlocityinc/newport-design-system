// To update autolaunchedFlowUIModel from autoLaunchedFlow, run flowTranslator.test.js and follow instructions
export const autolaunchedFlowUIModel = {
	      "elements": {
	          "07fd2a44-4192-4709-888d-8ccc18cb4580": {
	            "guid": "07fd2a44-4192-4709-888d-8ccc18cb4580",
	            "description": "",
	            "locationX": 50,
	            "locationY": 50,
	            "isCanvasElement": true,
	            "connectorCount": 1,
	            "config": {
	              "isSelected": false,
	              "isHighlighted": false
	            },
	            "elementType": "START_ELEMENT",
	            "maxConnections": 1,
	            "filterType": "all",
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
	                "waitEventReference": "fc408daa-3152-46bf-8733-c1083018292b"
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
	          "fc408daa-3152-46bf-8733-c1083018292b": {
	            "guid": "fc408daa-3152-46bf-8733-c1083018292b",
	            "name": "waitEvent1",
	            "label": "waitEvent1",
	            "elementType": "WAIT_EVENT",
	            "dataType": "Boolean",
	            "conditions": [
	              {
	                "rowIndex": "90246d76-2818-4059-b0fd-425e241f8708",
	                "leftHandSide": "2e01b9c4-5144-4db2-9543-7899c5c34329",
	                "rightHandSide": "text",
	                "rightHandSideDataType": "String",
	                "operator": "EqualTo"
	              }
	            ],
	            "conditionLogic": "and",
	            "eventType": "FlowExecutionErrorEvent",
	            "eventTypeIndex": "6d690706-908c-4d94-9513-1b219301b4c5",
	            "inputParameters": [],
	            "outputParameters": {
	              "FlowExecutionErrorEvent": {
	                "rowIndex": "e682f03e-925a-4d84-adc3-f1c5ceea0201",
	                "name": "FlowExecutionErrorEvent",
	                "value": "",
	                "valueDataType": "reference"
	              }
	            }
	          },
	          "2e01b9c4-5144-4db2-9543-7899c5c34329": {
	            "guid": "2e01b9c4-5144-4db2-9543-7899c5c34329",
	            "name": "stringVariable",
	            "description": "",
	            "elementType": "Variable",
	            "isCollection": false,
	            "isInput": false,
	            "isOutput": false,
	            "dataType": "String",
	            "subtype": null,
	            "subtypeIndex": "fe30ada4-6781-4ffd-84d1-9efbadaa29ab",
	            "scale": 0,
	            "defaultValue": null,
	            "defaultValueDataType": null,
	            "defaultValueIndex": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717"
	          },
	          "cc0381a7-0c64-4935-bc0c-25ecc2e958f1": {
	            "guid": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
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
	            "objectIndex": "4968239c-5e3d-45ee-9339-f575c917e223",
	            "filterType": "none",
	            "filters": [
	              {
	                "rowIndex": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
	                "leftHandSide": "",
	                "rightHandSide": "",
	                "rightHandSideDataType": "",
	                "operator": ""
	              }
	            ],
	            "queriedFields": [
	              {
	                "field": "Id",
	                "rowIndex": "7f4ddba5-e41b-456b-b686-94b257cc9914"
	              }
	            ],
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
	            "outputReferenceIndex": "ed85c895-feb5-45cb-b486-49cfd9da8e20",
	            "dataType": "SObject",
	            "isCollection": false,
	            "subtype": "Account",
	            "storeOutputAutomatically": true,
	            "getFirstRecordOnly": true
	          }
	        },
	        "connectors": [
	          {
	            "guid": "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
	            "source": "07fd2a44-4192-4709-888d-8ccc18cb4580",
	            "childSource": null,
	            "target": "a4451815-988d-4f17-883d-64b6ad9fab7e",
	            "label": null,
	            "type": "REGULAR",
	            "config": {
	              "isSelected": false
	            }
	          },
	          {
	            "guid": "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
	            "source": "a4451815-988d-4f17-883d-64b6ad9fab7e",
	            "childSource": "fc408daa-3152-46bf-8733-c1083018292b",
	            "target": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
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
	          "cc0381a7-0c64-4935-bc0c-25ecc2e958f1"
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
	          "status": "Draft",
	          "versionNumber": 1
	        }
	      };