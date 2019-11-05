// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
	"elements": {
		        "07fd2a44-4192-4709-888d-8ccc18cb4580": {
		          "guid": "07fd2a44-4192-4709-888d-8ccc18cb4580",
		          "description": "",
		          "locationX": 50,
		          "locationY": 50,
		          "isCanvasElement": true,
		          "connectorCount": 0,
		          "config": {
		            "isSelected": false,
		            "isHighlighted": false
		          },
		          "elementType": "START_ELEMENT",
		          "maxConnections": 1,
		          "triggerType": "None",
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
		        "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3": {
		          "guid": "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
		          "name": "accountID",
		          "description": "",
		          "elementType": "Variable",
		          "isCollection": false,
		          "isInput": false,
		          "isOutput": false,
		          "dataType": "String",
		          "subtype": null,
		          "subtypeIndex": "a4451815-988d-4f17-883d-64b6ad9fab7e",
		          "scale": 2,
		          "defaultValue": null,
		          "defaultValueDataType": null,
		          "defaultValueIndex": "fc408daa-3152-46bf-8733-c1083018292b"
		        },
		        "6d690706-908c-4d94-9513-1b219301b4c5": {
		          "guid": "6d690706-908c-4d94-9513-1b219301b4c5",
		          "name": "vAccountBillingAddress",
		          "description": "",
		          "elementType": "Variable",
		          "isCollection": false,
		          "isInput": false,
		          "isOutput": false,
		          "dataType": "String",
		          "subtype": null,
		          "subtypeIndex": "90246d76-2818-4059-b0fd-425e241f8708",
		          "scale": 2,
		          "defaultValue": null,
		          "defaultValueDataType": null,
		          "defaultValueIndex": "e682f03e-925a-4d84-adc3-f1c5ceea0201"
		        },
		        "297834ec-f5c8-4128-aa38-dc437f0c6a9b": {
		          "guid": "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
		          "name": "vMyTestAccount",
		          "description": "",
		          "elementType": "Variable",
		          "isCollection": false,
		          "isInput": false,
		          "isOutput": false,
		          "dataType": "SObject",
		          "subtype": "Account",
		          "subtypeIndex": "2e01b9c4-5144-4db2-9543-7899c5c34329",
		          "scale": 2,
		          "defaultValue": null,
		          "defaultValueDataType": null,
		          "defaultValueIndex": "fe30ada4-6781-4ffd-84d1-9efbadaa29ab"
		        },
		        "bf05168b-6bd9-483a-8ea8-5e4d73a1c717": {
		          "guid": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
		          "name": "vAccounts",
		          "description": "",
		          "elementType": "Variable",
		          "isCollection": true,
		          "isInput": false,
		          "isOutput": false,
		          "dataType": "SObject",
		          "subtype": "Account",
		          "subtypeIndex": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
		          "scale": 2,
		          "defaultValue": null,
		          "defaultValueDataType": null,
		          "defaultValueIndex": "4968239c-5e3d-45ee-9339-f575c917e223"
		        },
		        "ed85c895-feb5-45cb-b486-49cfd9da8e20": {
		          "guid": "ed85c895-feb5-45cb-b486-49cfd9da8e20",
		          "name": "getAccountWithFields",
		          "description": "Get account with fields and sort",
		          "label": "Get Account With Fields and filters",
		          "locationX": 228,
		          "locationY": 147,
		          "isCanvasElement": true,
		          "connectorCount": 0,
		          "config": {
		            "isSelected": false,
		            "isHighlighted": false
		          },
		          "object": "Account",
		          "objectIndex": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
		          "outputAssignments": [
		            {
		              "rowIndex": "04e1c283-fc0b-4928-a495-89d956368769",
		              "leftHandSide": "Account.Id",
		              "rightHandSide": "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3"
		            },
		            {
		              "rowIndex": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8",
		              "leftHandSide": "Account.BillingAddress",
		              "rightHandSide": "6d690706-908c-4d94-9513-1b219301b4c5"
		            }
		          ],
		          "assignNullValuesIfNoRecordsFound": true,
		          "filterType": "all",
		          "filters": [
		            {
		              "rowIndex": "53329036-32e6-4965-a1d2-b12cd0344f99",
		              "leftHandSide": "Account.Name",
		              "rightHandSide": "MyTestAccount",
		              "rightHandSideDataType": "String",
		              "operator": "EqualTo"
		            }
		          ],
		          "queriedFields": [],
		          "sortOrder": "Asc",
		          "sortField": "Id",
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
		          "outputReferenceIndex": "7f4ddba5-e41b-456b-b686-94b257cc9914",
		          "dataType": "Boolean",
		          "storeOutputAutomatically": false,
		          "getFirstRecordOnly": true,
		          "variableAndFieldMapping": "manual"
		        },
		        "41c6da8a-c6e0-418b-8b23-9906b4adab11": {
		          "guid": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
		          "name": "get_Account_with_sObject",
		          "description": "",
		          "label": "get Account with sObject",
		          "locationX": 397,
		          "locationY": 148,
		          "isCanvasElement": true,
		          "connectorCount": 0,
		          "config": {
		            "isSelected": false,
		            "isHighlighted": false
		          },
		          "object": "Account",
		          "objectIndex": "a35e28e0-3d3b-44b1-9638-9caba6ef3820",
		          "outputReference": "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
		          "assignNullValuesIfNoRecordsFound": true,
		          "filterType": "all",
		          "filters": [
		            {
		              "rowIndex": "2f00ca0d-743f-4639-a084-272bbc548f8b",
		              "leftHandSide": "Account.Name",
		              "rightHandSide": "myTestAccount",
		              "rightHandSideDataType": "String",
		              "operator": "EqualTo"
		            }
		          ],
		          "queriedFields": [
		            {
		              "field": "Id",
		              "rowIndex": "a18b3d06-504c-4e47-9f44-6663c42703cf"
		            },
		            {
		              "field": "BillingAddress",
		              "rowIndex": "5383bf9b-8314-42bd-a51e-cbee56ec3570"
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
		          "outputReferenceIndex": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1",
		          "dataType": "Boolean",
		          "storeOutputAutomatically": false,
		          "getFirstRecordOnly": true,
		          "variableAndFieldMapping": "manual"
		        },
		        "20336b8d-01e4-49eb-bb24-87deba5f6ef8": {
		          "guid": "20336b8d-01e4-49eb-bb24-87deba5f6ef8",
		          "name": "get_Accounts",
		          "description": "",
		          "label": "get Accounts",
		          "locationX": 558,
		          "locationY": 155,
		          "isCanvasElement": true,
		          "connectorCount": 0,
		          "config": {
		            "isSelected": false,
		            "isHighlighted": false
		          },
		          "object": "Account",
		          "objectIndex": "787fd564-24db-448c-ba59-ef88c8a5cbd9",
		          "outputReference": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
		          "assignNullValuesIfNoRecordsFound": true,
		          "filterType": "all",
		          "filters": [
		            {
		              "rowIndex": "c5fd40ed-f8bb-4cea-a00d-8f3697b5731c",
		              "leftHandSide": "Account.Name",
		              "rightHandSide": "myT",
		              "rightHandSideDataType": "String",
		              "operator": "StartsWith"
		            }
		          ],
		          "queriedFields": [
		            {
		              "field": "Id",
		              "rowIndex": "86f9f34d-e2e4-45e3-a574-78ddcd669ebf"
		            },
		            {
		              "field": "BillingAddress",
		              "rowIndex": "a6849bcb-05b6-4898-8cc1-12ff825524c5"
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
		          "outputReferenceIndex": "cc44cf67-84c7-4dc5-b851-44d57be8fa66",
		          "dataType": "Boolean",
		          "storeOutputAutomatically": false,
		          "getFirstRecordOnly": true,
		          "variableAndFieldMapping": "manual"
		        }
		      },
		      "connectors": [],
		      "canvasElements": [
		        "07fd2a44-4192-4709-888d-8ccc18cb4580",
		        "ed85c895-feb5-45cb-b486-49cfd9da8e20",
		        "41c6da8a-c6e0-418b-8b23-9906b4adab11",
		        "20336b8d-01e4-49eb-bb24-87deba5f6ef8"
		      ],
		      "properties": {
		        "canOnlySaveAsNewDefinition": false,
		        "description": "",
		        "elementType": "FLOW_PROPERTIES",
		        "hasUnsavedChanges": false,
		        "interviewLabel": "contactRequestFlowWithElements {!$Flow.CurrentDateTime}",
		        "isCreatedOutsideLfb": false,
		        "isLightningFlowBuilder": true,
		        "isTemplate": false,
		        "label": "contactRequestFlowWithElements",
		        "lastModifiedBy": null,
		        "lastModifiedDate": null,
		        "lastInlineResourceGuid": null,
		        "lastInlineResourcePosition": null,
		        "lastInlineResourceRowIndex": null,
		        "name": "",
		        "processType": "ContactRequestFlow",
		        "runInMode": null,
		        "versionNumber": null
		      }
		    };