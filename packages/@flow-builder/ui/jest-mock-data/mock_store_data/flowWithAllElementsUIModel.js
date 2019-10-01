// To update flowWithAllElementsUIModel from flowWithAllElements, run flowTranslator.test.js and follow instructions
export const flowWithAllElementsUIModel = {
		"elements": {
		  "07fd2a44-4192-4709-888d-8ccc18cb4580": {
			"guid": "07fd2a44-4192-4709-888d-8ccc18cb4580",
			"description": "",
			"locationX": 66,
			"locationY": 50,
			"isCanvasElement": true,
			"connectorCount": 0,
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
		  "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3": {
			"guid": "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
			"name": "actionCall1",
			"description": "",
			"label": "actionCall1",
			"locationX": 296,
			"locationY": 652,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"actionType": "quickAction",
			"actionName": "LogACall",
			"inputParameters": [],
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
			"dataType": "Boolean",
			"storeOutputAutomatically": false
		  },
		  "a4451815-988d-4f17-883d-64b6ad9fab7e": {
			"guid": "a4451815-988d-4f17-883d-64b6ad9fab7e",
			"name": "actionCallAutomaticOutput",
			"description": "",
			"label": "actionCallAutomaticOutput",
			"locationX": 123,
			"locationY": 649,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"actionType": "chatterPost",
			"actionName": "chatterPost",
			"inputParameters": [
			  {
				"rowIndex": "6d690706-908c-4d94-9513-1b219301b4c5",
				"name": "subjectNameOrId",
				"value": "jsmith@salesforce.com",
				"valueDataType": "String"
			  },
			  {
				"rowIndex": "e682f03e-925a-4d84-adc3-f1c5ceea0201",
				"name": "text",
				"value": "This is my message",
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
			"name": "localAction",
			"description": "this is a sample local action",
			"label": "localAction",
			"locationX": 463,
			"locationY": 661,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"actionType": "component",
			"actionName": "c:localActionSample",
			"inputParameters": [
			  {
				"rowIndex": "fe30ada4-6781-4ffd-84d1-9efbadaa29ab",
				"name": "subject",
				"value": "team",
				"valueDataType": "String"
			  },
			  {
				"rowIndex": "cc0381a7-0c64-4935-bc0c-25ecc2e958f1",
				"name": "greeting",
				"value": "hello",
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
			"dataType": "Boolean",
			"storeOutputAutomatically": false
		  },
		  "4968239c-5e3d-45ee-9339-f575c917e223": {
			"guid": "4968239c-5e3d-45ee-9339-f575c917e223",
			"name": "assignment1",
			"description": "",
			"label": "assignment1Label",
			"locationX": 165,
			"locationY": 177,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"assignmentItems": [
			  {
				"rowIndex": "ed85c895-feb5-45cb-b486-49cfd9da8e20",
				"leftHandSide": "34ff5f58-8d99-470d-a755-a2aa0dc69f59",
				"rightHandSide": "a8368340-a386-4406-9118-02389237ad54",
				"rightHandSideDataType": "reference",
				"operator": "Assign"
			  }
			],
			"maxConnections": 1,
			"elementType": "Assignment"
		  },
		  "0ecd3000-0adc-4d34-bdc1-acd331740de0": {
			"guid": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
			"name": "decision1",
			"description": "",
			"label": "decision1",
			"locationX": 109,
			"locationY": 801,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"outcomeReferences": [
			  {
				"outcomeReference": "7f4ddba5-e41b-456b-b686-94b257cc9914"
			  }
			],
			"defaultConnectorLabel": "Default Outcome",
			"elementType": "Decision",
			"maxConnections": 2,
			"availableConnections": [
			  {
				"type": "REGULAR",
				"childReference": "7f4ddba5-e41b-456b-b686-94b257cc9914"
			  },
			  {
				"type": "DEFAULT"
			  }
			]
		  },
		  "7f4ddba5-e41b-456b-b686-94b257cc9914": {
			"guid": "7f4ddba5-e41b-456b-b686-94b257cc9914",
			"name": "outcome1",
			"label": "outcome1",
			"elementType": "OUTCOME",
			"dataType": "Boolean",
			"conditionLogic": "and",
			"conditions": [
			  {
				"rowIndex": "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
				"leftHandSide": "34ff5f58-8d99-470d-a755-a2aa0dc69f59",
				"rightHandSide": "text",
				"rightHandSideDataType": "String",
				"operator": "EqualTo"
			  }
			]
		  },
		  "53329036-32e6-4965-a1d2-b12cd0344f99": {
			"guid": "53329036-32e6-4965-a1d2-b12cd0344f99",
			"name": "accountSObjectCollectionVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "SObject",
			"subtype": "Account",
			"subtypeIndex": "04e1c283-fc0b-4928-a495-89d956368769",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8"
		  },
		  "41c6da8a-c6e0-418b-8b23-9906b4adab11": {
			"guid": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
			"name": "accountSObjectVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "SObject",
			"subtype": "Account",
			"subtypeIndex": "a35e28e0-3d3b-44b1-9638-9caba6ef3820",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1"
		  },
		  "3f1c4d9a-ea88-4c6c-85ac-6aa009601964": {
			"guid": "3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
			"name": "apexSampleCollectionVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "Apex",
			"subtype": "MyApexClass",
			"subtypeIndex": "2f00ca0d-743f-4639-a084-272bbc548f8b",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "a18b3d06-504c-4e47-9f44-6663c42703cf"
		  },
		  "5383bf9b-8314-42bd-a51e-cbee56ec3570": {
			"guid": "5383bf9b-8314-42bd-a51e-cbee56ec3570",
			"name": "apexSampleVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "Apex",
			"subtype": "MyApexClass",
			"subtypeIndex": "20336b8d-01e4-49eb-bb24-87deba5f6ef8",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "787fd564-24db-448c-ba59-ef88c8a5cbd9"
		  },
		  "cc44cf67-84c7-4dc5-b851-44d57be8fa66": {
			"guid": "cc44cf67-84c7-4dc5-b851-44d57be8fa66",
			"name": "caseSObjectCollectionVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "SObject",
			"subtype": "Case",
			"subtypeIndex": "c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "c5fd40ed-f8bb-4cea-a00d-8f3697b5731c"
		  },
		  "86f9f34d-e2e4-45e3-a574-78ddcd669ebf": {
			"guid": "86f9f34d-e2e4-45e3-a574-78ddcd669ebf",
			"name": "currencyVariable",
			"description": "randomDescription",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "Currency",
			"subtype": null,
			"subtypeIndex": "a6849bcb-05b6-4898-8cc1-12ff825524c5",
			"scale": 2,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "3e57f4c5-fecd-4be0-83a2-3238cdda979c"
		  },
		  "7ab29c0c-3dbf-4f99-a94c-311ef891973f": {
			"guid": "7ab29c0c-3dbf-4f99-a94c-311ef891973f",
			"name": "dateCollectionVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "Date",
			"subtype": null,
			"subtypeIndex": "85d76151-9bec-4869-b691-791baf964b4f",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "bb597c66-db1e-4636-85b6-31f89b320bd4"
		  },
		  "700b8f1c-98eb-48ea-90f0-35e1a864a1a8": {
			"guid": "700b8f1c-98eb-48ea-90f0-35e1a864a1a8",
			"name": "dateVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "Date",
			"subtype": null,
			"subtypeIndex": "e653d56e-898d-4e69-87c3-07338d100647",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "956ee0bf-ff21-44f4-9917-65676160e094"
		  },
		  "69030d84-1e7f-49c3-ad89-ddc4db69050a": {
			"guid": "69030d84-1e7f-49c3-ad89-ddc4db69050a",
			"name": "feedItemVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "SObject",
			"subtype": "FeedItem",
			"subtypeIndex": "dd4270aa-df83-4942-ac0f-37ce8072ccaa",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "e8161f40-c0f6-4ad8-87ca-942a76a014f2"
		  },
		  "a8368340-a386-4406-9118-02389237ad54": {
			"guid": "a8368340-a386-4406-9118-02389237ad54",
			"name": "numberVariable",
			"description": "",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "Number",
			"subtype": null,
			"subtypeIndex": "2bf626b1-9430-49ca-ad02-a75241931b16",
			"scale": 2,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "6e77e9cf-2492-44ca-a088-ee4b8159d478"
		  },
		  "90da6513-4272-44d6-9f80-4cfc29acc5a3": {
			"guid": "90da6513-4272-44d6-9f80-4cfc29acc5a3",
			"name": "stringCollectionVariable1",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "String",
			"subtype": null,
			"subtypeIndex": "d6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "5c075fad-735a-4628-9e51-495d3292d153"
		  },
		  "d1fda889-4f3a-48cd-ba79-be4fbca04da2": {
			"guid": "d1fda889-4f3a-48cd-ba79-be4fbca04da2",
			"name": "stringCollectionVariable2",
			"description": "",
			"elementType": "Variable",
			"isCollection": true,
			"isInput": false,
			"isOutput": false,
			"dataType": "String",
			"subtype": null,
			"subtypeIndex": "40c11213-36c0-451e-a5aa-8790aee02559",
			"scale": 0,
			"defaultValue": null,
			"defaultValueDataType": null,
			"defaultValueIndex": "e62ce284-ccf2-46af-8446-c0a110a4bba0"
		  },
		  "34ff5f58-8d99-470d-a755-a2aa0dc69f59": {
			"guid": "34ff5f58-8d99-470d-a755-a2aa0dc69f59",
			"name": "stringVariable",
			"description": "random description",
			"elementType": "Variable",
			"isCollection": false,
			"isInput": false,
			"isOutput": false,
			"dataType": "String",
			"subtype": null,
			"subtypeIndex": "ade42d1f-d120-4ff9-9888-c202b289571c",
			"scale": 0,
			"defaultValue": "fooDefault",
			"defaultValueDataType": "String",
			"defaultValueIndex": "6cb9b58e-4246-44c0-85a9-8f7d32172da6"
		  },
		  "a733e74b-1a25-43dc-b43c-d126c849023d": {
			"guid": "a733e74b-1a25-43dc-b43c-d126c849023d",
			"name": "stringConstant",
			"description": "random description",
			"elementType": "Constant",
			"dataType": "String",
			"defaultValue": "fooDefault",
			"defaultValueDataType": "String",
			"defaultValueIndex": "4b09a9f9-b658-4b5d-90c5-cbdb83b6484b"
		  },
		  "be979456-fe7c-4fa6-be9f-e388ea78dd33": {
			"guid": "be979456-fe7c-4fa6-be9f-e388ea78dd33",
			"name": "textTemplate1",
			"description": "",
			"elementType": "TextTemplate",
			"text": "<p>Hello {!34ff5f58-8d99-470d-a755-a2aa0dc69f59}</p>",
			"dataType": "String"
		  },
		  "bebf0e8d-339f-4227-ab7e-84d7c15daf07": {
			"guid": "bebf0e8d-339f-4227-ab7e-84d7c15daf07",
			"name": "lookupRecordAutomaticOutput",
			"description": "",
			"label": "lookupRecordAutomaticOutput",
			"locationX": 362,
			"locationY": 326,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"object": "Account",
			"objectIndex": "b93ea139-c9df-49cb-a42e-52c5f496ab07",
			"filterType": "none",
			"filters": [
			  {
				"rowIndex": "ebedaf4c-b899-4660-bf34-b2c569bda3c9",
				"leftHandSide": "",
				"rightHandSide": "",
				"rightHandSideDataType": "",
				"operator": ""
			  }
			],
			"queriedFields": [
			  {
				"field": "Id",
				"rowIndex": "3f70f36b-030f-4b90-ba09-866642ba5d4b"
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
			"outputReferenceIndex": "8573e2d4-ccfb-4701-be66-e38b54ba7375",
			"dataType": "SObject",
			"isCollection": false,
			"subtype": "Account",
			"storeOutputAutomatically": true,
			"getFirstRecordOnly": true
		  },
		  "cf5e6188-117a-47c0-a493-7ed460484c87": {
			"guid": "cf5e6188-117a-47c0-a493-7ed460484c87",
			"name": "lookupRecordCollectionAutomaticOutput",
			"description": "",
			"label": "lookupRecordCollectionAutomaticOutput",
			"locationX": 577,
			"locationY": 334,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"object": "Account",
			"objectIndex": "6afc7b95-a112-4bd0-99e6-4114704080f2",
			"filterType": "none",
			"filters": [
			  {
				"rowIndex": "ecf6b72e-f33e-48a4-a58c-bdcc87a80e40",
				"leftHandSide": "",
				"rightHandSide": "",
				"rightHandSideDataType": "",
				"operator": ""
			  }
			],
			"queriedFields": [
			  {
				"field": "Id",
				"rowIndex": "3147a31d-26a3-408c-b00b-a31983df0da5"
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
			"outputReferenceIndex": "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929",
			"dataType": "SObject",
			"isCollection": true,
			"subtype": "Account",
			"storeOutputAutomatically": true,
			"getFirstRecordOnly": false
		  },
		  "eb19f518-e185-488c-a5b2-9107036766f4": {
			"guid": "eb19f518-e185-488c-a5b2-9107036766f4",
			"name": "lookupRecordOutputReference",
			"description": "",
			"label": "lookupRecordOutputReference",
			"locationX": 158,
			"locationY": 321,
			"isCanvasElement": true,
			"connectorCount": 0,
			"config": {
			  "isSelected": false,
			  "isHighlighted": false
			},
			"object": "Account",
			"objectIndex": "70926b3b-6a78-4e62-a62b-0c6d4c4ca910",
			"outputReference": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
			"assignNullValuesIfNoRecordsFound": false,
			"filterType": "none",
			"filters": [
			  {
				"rowIndex": "ba8a8e41-3944-4099-9655-065f054e811f",
				"leftHandSide": "",
				"rightHandSide": "",
				"rightHandSideDataType": "",
				"operator": ""
			  }
			],
			"queriedFields": [
			  {
				"field": "Id",
				"rowIndex": "4afdbe2b-6b5a-4da3-887d-5b755f53b64e"
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
			"outputReferenceIndex": "34eaa6ff-765e-4c12-8635-b00f6c7f2c34",
			"dataType": "Boolean",
			"storeOutputAutomatically": false,
			"getFirstRecordOnly": false
		  },
		  "97a7048c-7323-4356-93c4-30995cf2c8c7": {
			"guid": "97a7048c-7323-4356-93c4-30995cf2c8c7",
			"name": "screen1",
			"description": "",
			"label": "screen1",
			"locationX": 127,
			"locationY": 505,
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
				"fieldReference": "9b2579d0-01d3-45b0-b6b2-bb016b085511"
			  },
			  {
				"fieldReference": "e5b4998c-a36e-407f-afb7-2301eda53b8d"
			  }
			],
			"elementType": "Screen",
			"maxConnections": 1
		  },
		  "9b2579d0-01d3-45b0-b6b2-bb016b085511": {
			"guid": "9b2579d0-01d3-45b0-b6b2-bb016b085511",
			"name": "emailScreenFieldAutomaticOutput",
			"choiceReferences": [],
			"dataType": "LightningComponentOutput",
			"defaultValue": "",
			"defaultValueIndex": "56095468-2459-481d-b084-04a05babcb22",
			"validationRule": {
			  "formulaExpression": null,
			  "errorMessage": null
			},
			"extensionName": "flowruntime:email",
			"fieldType": "ComponentInstance",
			"fieldText": "",
			"helpText": "",
			"inputParameters": [
			  {
				"rowIndex": "48cb0159-3cde-48ad-9877-644e3cc4b5e9",
				"name": "label",
				"value": "emailScreenFieldAutomaticOutput",
				"valueDataType": "String"
			  },
			  {
				"rowIndex": "88a32528-0dfa-4237-b9dd-a14c1a6d6d10",
				"name": "placeholder",
				"value": "your email address",
				"valueDataType": "String"
			  }
			],
			"isNewField": false,
			"isRequired": true,
			"outputParameters": [],
			"scale": "0",
			"type": {
			  "name": "flowruntime:email",
			  "fieldType": "ComponentInstance",
			  "label": "flowruntime:email",
			  "icon": "standard:lightning_component",
			  "source": "local"
			},
			"elementType": "SCREEN_FIELD",
			"visibilityRule": {
			  "conditionLogic": "no_conditions",
			  "conditions": []
			},
			"storeOutputAutomatically": true
		  },
		  "e5b4998c-a36e-407f-afb7-2301eda53b8d": {
			"guid": "e5b4998c-a36e-407f-afb7-2301eda53b8d",
			"name": "emailScreenField",
			"choiceReferences": [],
			"defaultValue": "",
			"defaultValueIndex": "7bbacaec-c6f9-4188-9af4-a32993e0abbd",
			"validationRule": {
			  "formulaExpression": null,
			  "errorMessage": null
			},
			"extensionName": "flowruntime:email",
			"fieldType": "ComponentInstance",
			"fieldText": "",
			"helpText": "",
			"inputParameters": [
			  {
				"rowIndex": "54aae715-8881-4a52-b7a9-25c385d1488e",
				"name": "label",
				"value": "emailScreenField",
				"valueDataType": "String"
			  },
			  {
				"rowIndex": "e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9",
				"name": "placeholder",
				"value": "your email",
				"valueDataType": "String"
			  }
			],
			"isNewField": false,
			"isRequired": true,
			"outputParameters": [],
			"scale": "0",
			"type": {
			  "name": "flowruntime:email",
			  "fieldType": "ComponentInstance",
			  "label": "flowruntime:email",
			  "icon": "standard:lightning_component",
			  "source": "local"
			},
			"elementType": "SCREEN_FIELD",
			"visibilityRule": {
			  "conditionLogic": "no_conditions",
			  "conditions": []
			},
			"storeOutputAutomatically": false
		  },
		  "8d53a0e4-6541-42d0-9ea1-665b504fd150": {
			"guid": "8d53a0e4-6541-42d0-9ea1-665b504fd150",
			"name": "stage1",
			"description": "",
			"isActive": false,
			"stageOrder": "12",
			"label": "stage1",
			"elementType": "Stage"
		  },
		  "f35b9254-9177-4813-84c0-92bc3dd1e922": {
			"guid": "f35b9254-9177-4813-84c0-92bc3dd1e922",
			"name": "numberChoice",
			"description": "",
			"elementType": "Choice",
			"dataType": "Number",
			"choiceText": "Choice 1",
			"storedValue": null,
			"storedValueDataType": null,
			"storedValueIndex": "9d11ba05-33c4-4893-87b8-9560be9557d2",
			"isShowInputSelected": false,
			"isValidateSelected": false
		  }
		},
		"connectors": [],
		"canvasElements": [
		  "07fd2a44-4192-4709-888d-8ccc18cb4580",
		  "3f91c315-f597-4dc0-bd4e-1f27a8fa59e3",
		  "a4451815-988d-4f17-883d-64b6ad9fab7e",
		  "297834ec-f5c8-4128-aa38-dc437f0c6a9b",
		  "4968239c-5e3d-45ee-9339-f575c917e223",
		  "0ecd3000-0adc-4d34-bdc1-acd331740de0",
		  "bebf0e8d-339f-4227-ab7e-84d7c15daf07",
		  "cf5e6188-117a-47c0-a493-7ed460484c87",
		  "eb19f518-e185-488c-a5b2-9107036766f4",
		  "97a7048c-7323-4356-93c4-30995cf2c8c7"
		],
		"properties": {
		  "canOnlySaveAsNewDefinition": false,
		  "description": "",
		  "elementType": "FLOW_PROPERTIES",
		  "hasUnsavedChanges": false,
		  "interviewLabel": "mockFlow {!$Flow.CurrentDateTime}",
		  "isCreatedOutsideLfb": false,
		  "isLightningFlowBuilder": true,
		  "isTemplate": false,
		  "label": "flowWithAllElements",
		  "lastModifiedBy": "User User",
		  "lastModifiedDate": "2019-09-27T09:08:08.000+0000",
		  "lastInlineResourceGuid": null,
		  "lastInlineResourcePosition": null,
		  "lastInlineResourceRowIndex": null,
		  "name": "flowWithAllElements",
		  "processType": "Flow",
		  "runInMode": null,
		  "status": "InvalidDraft",
		  "versionNumber": 1
		}
	  }