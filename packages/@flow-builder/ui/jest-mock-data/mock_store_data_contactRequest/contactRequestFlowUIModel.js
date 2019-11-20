// To update contactRequestFlowUIModel from contactRequestFlow, run flowTranslator.test.js and follow instructions
export const contactRequestFlowUIModel = {
	"elements": {
		"07fd2a44-4192-4709-888d-8ccc18cb4580": {
			"guid": "07fd2a44-4192-4709-888d-8ccc18cb4580",
			"description": "",
			"locationX": 80,
			"locationY": 53,
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
			"name": "decision",
			"description": "",
			"label": "decision",
			"locationX": 227,
			"locationY": 360.6875,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
				"isSelected": false,
				"isHighlighted": false
			},
			"outcomeReferences": [
				{
					"outcomeReference": "a4451815-988d-4f17-883d-64b6ad9fab7e"
				}
			],
			"defaultConnectorLabel": "Default Outcome",
			"elementType": "Decision",
			"maxConnections": 2,
			"availableConnections": [
				{
					"type": "REGULAR",
					"childReference": "a4451815-988d-4f17-883d-64b6ad9fab7e"
				},
				{
					"type": "DEFAULT"
				}
			]
		},
		"a4451815-988d-4f17-883d-64b6ad9fab7e": {
			"guid": "a4451815-988d-4f17-883d-64b6ad9fab7e",
			"name": "outcome",
			"label": "outcome",
			"elementType": "OUTCOME",
			"dataType": "Boolean",
			"conditionLogic": "and",
			"conditions": [
				{
					"rowIndex": "fc408daa-3152-46bf-8733-c1083018292b",
					"leftHandSide": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717.CloneSourceId",
					"rightHandSide": "",
					"rightHandSideDataType": "",
					"operator": "EqualTo"
				}
			]
		},
		"6d690706-908c-4d94-9513-1b219301b4c5": {
			"guid": "6d690706-908c-4d94-9513-1b219301b4c5",
			"name": "accountID",
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
			"name": "vAccountBillingAddress",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "String",
			"subtype": null,
			"subtypeIndex": "2e01b9c4-5144-4db2-9543-7899c5c34329",
			"scale": 2,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "fe30ada4-6781-4ffd-84d1-9efbadaa29ab"
		},
		"bf05168b-6bd9-483a-8ea8-5e4d73a1c717": {
			"guid": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
			"name": "vMyTestAccount",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
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
			"name": "vAccounts",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "SObject",
			"subtype": "Account",
			"subtypeIndex": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
			"scale": 2,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "7f4ddba5-e41b-456b-b686-94b257cc9914"
		},
		"7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be": {
			"guid": "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
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
			"objectIndex": "53329036-32e6-4965-a1d2-b12cd0344f99",
			"outputAssignments": [
				{
					"rowIndex": "a35e28e0-3d3b-44b1-9638-9caba6ef3820",
					"leftHandSide": "Account.Id",
					"rightHandSide": "6d690706-908c-4d94-9513-1b219301b4c5"
				},
				{
					"rowIndex": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1",
					"leftHandSide": "Account.BillingAddress",
					"rightHandSide": "297834ec-f5c8-4128-aa38-dc437f0c6a9b"
				}
			],
			"assignNullValuesIfNoRecordsFound": true,
			"filterType": "all",
			"filters": [
				{
					"rowIndex": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
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
			"outputReferenceIndex": "04e1c283-fc0b-4928-a495-89d956368769",
			"dataType": "Boolean",
			"storeOutputAutomatically": false,
			"getFirstRecordOnly": true,
			"variableAndFieldMapping": "manual"
		},
		"3f1c4d9a-ea88-4c6c-85ac-6aa009601964": {
			"guid": "3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
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
			"objectIndex": "2f00ca0d-743f-4639-a084-272bbc548f8b",
			"outputReference": "bf05168b-6bd9-483a-8ea8-5e4d73a1c717",
			"assignNullValuesIfNoRecordsFound": true,
			"filterType": "all",
			"filters": [
				{
					"rowIndex": "20336b8d-01e4-49eb-bb24-87deba5f6ef8",
					"leftHandSide": "Account.Name",
					"rightHandSide": "myTestAccount",
					"rightHandSideDataType": "String",
					"operator": "EqualTo"
				}
			],
			"queriedFields": [
				{
					"field": "Id",
					"rowIndex": "787fd564-24db-448c-ba59-ef88c8a5cbd9"
				},
				{
					"field": "BillingAddress",
					"rowIndex": "cc44cf67-84c7-4dc5-b851-44d57be8fa66"
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
			"outputReferenceIndex": "a18b3d06-504c-4e47-9f44-6663c42703cf",
			"dataType": "Boolean",
			"storeOutputAutomatically": false,
			"getFirstRecordOnly": true,
			"variableAndFieldMapping": "manual"
		},
		"c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1": {
			"guid": "c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1",
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
			"objectIndex": "c5fd40ed-f8bb-4cea-a00d-8f3697b5731c",
			"outputReference": "ed85c895-feb5-45cb-b486-49cfd9da8e20",
			"assignNullValuesIfNoRecordsFound": true,
			"filterType": "all",
			"filters": [
				{
					"rowIndex": "3e57f4c5-fecd-4be0-83a2-3238cdda979c",
					"leftHandSide": "Account.Name",
					"rightHandSide": "myT",
					"rightHandSideDataType": "String",
					"operator": "StartsWith"
				}
			],
			"queriedFields": [
				{
					"field": "Id",
					"rowIndex": "7ab29c0c-3dbf-4f99-a94c-311ef891973f"
				},
				{
					"field": "BillingAddress",
					"rowIndex": "85d76151-9bec-4869-b691-791baf964b4f"
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
			"outputReferenceIndex": "86f9f34d-e2e4-45e3-a574-78ddcd669ebf",
			"dataType": "Boolean",
			"storeOutputAutomatically": false,
			"getFirstRecordOnly": true,
			"variableAndFieldMapping": "manual"
		},
		"bb597c66-db1e-4636-85b6-31f89b320bd4": {
			"guid": "bb597c66-db1e-4636-85b6-31f89b320bd4",
			"name": "screenWithAddress",
			"description": "",
			"label": "screenWithAddress",
			"locationX": 741,
			"locationY": 154.6875,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
				"isSelected": false,
				"isHighlighted": false
			},
			"allowBack": true,
			"allowFinish": true,
			"allowPause": true,
			"helpText": "",
			"pausedText": "",
			"showFooter": true,
			"showHeader": true,
			"fieldReferences": [
				{
					"fieldReference": "700b8f1c-98eb-48ea-90f0-35e1a864a1a8"
				}
			],
			"elementType": "Screen",
			"maxConnections": 1
		},
		"700b8f1c-98eb-48ea-90f0-35e1a864a1a8": {
			"guid": "700b8f1c-98eb-48ea-90f0-35e1a864a1a8",
			"name": "Address",
			"choiceReferences": [],
			"defaultValue": "",
			"defaultValueIndex": "e653d56e-898d-4e69-87c3-07338d100647",
			"validationRule": {
				"formulaExpression": null,
				"errorMessage": null
			},
			"extensionName": "flowruntime:address",
			"fieldType": "ComponentInstance",
			"fieldText": "",
			"helpText": "",
			"inputParameters": [],
			"isNewField": false,
			"isRequired": true,
			"outputParameters": [],
			"scale": "0",
			"type": {
				"name": "flowruntime:address",
				"fieldType": "ComponentInstance",
				"label": "flowruntime:address",
				"icon": "standard:lightning_component",
				"source": "local"
			},
			"elementType": "SCREEN_FIELD",
			"visibilityRule": {
				"conditionLogic": "no_conditions",
				"conditions": []
			},
			"storeOutputAutomatically": false
		}
	},
	"connectors": [],
	"canvasElements": [
		"07fd2a44-4192-4709-888d-8ccc18cb4580",
		"3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
		"7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
		"3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
		"c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1",
		"bb597c66-db1e-4636-85b6-31f89b320bd4"
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
		"lastModifiedBy": "Admin User",
		"lastModifiedDate": "2019-11-18T10:06:51.000+0000",
		"lastInlineResourceGuid": null,
		"lastInlineResourcePosition": null,
		"lastInlineResourceRowIndex": null,
		"name": "contactRequest",
		"processType": "ContactRequestFlow",
		"runInMode": null,
		"versionNumber": 1
	}
};