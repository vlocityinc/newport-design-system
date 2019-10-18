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
      "name": "caseLogACallAutomatic",
      "description": "",
      "label": "caseLogACallAutomatic",
      "locationX": 628,
      "locationY": 670.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "quickAction",
      "actionName": "Case.LogACall",
      "inputParameters": [
        {
          "rowIndex": "0ecd3000-0adc-4d34-bdc1-acd331740de0",
          "name": "contextId",
          "value": "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929",
          "valueDataType": "reference"
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
    "7f4ddba5-e41b-456b-b686-94b257cc9914": {
      "guid": "7f4ddba5-e41b-456b-b686-94b257cc9914",
      "name": "apexCall_anonymous_account",
      "description": "",
      "label": "apexCall anonymous account",
      "locationX": 298,
      "locationY": 141,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "apex",
      "actionName": "getAccounts",
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
      "elementType": "APEX_CALL",
      "dataType": "SObject",
      "storeOutputAutomatically": true,
      "isSystemGeneratedOutput": true,
      "subtype": "Account"
    },
    "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be": {
      "guid": "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
      "name": "addAccountExternalService",
      "description": "",
      "label": "addAccountExternalService",
      "locationX": 523,
      "locationY": 120,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "externalService",
      "actionName": "BankServiceNew.addAccount",
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
      "dataType": "ActionOutput",
      "storeOutputAutomatically": true
    },
    "53329036-32e6-4965-a1d2-b12cd0344f99": {
      "guid": "53329036-32e6-4965-a1d2-b12cd0344f99",
      "name": "emailAlertOnAccount",
      "description": "",
      "label": "emailAlertOnAccount",
      "locationX": 271,
      "locationY": 68.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "emailAlert",
      "actionName": "Account.my_email_alert",
      "inputParameters": [
        {
          "rowIndex": "a193d56e-2ee7-422d-a3ff-664fc82a0fd8",
          "name": "SObjectRowId",
          "value": "a6849bcb-05b6-4898-8cc1-12ff825524c5.Id",
          "valueDataType": "reference"
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
      "elementType": "EMAIL_ALERT",
      "dataType": "Boolean",
      "storeOutputAutomatically": false
    },
    "41c6da8a-c6e0-418b-8b23-9906b4adab11": {
      "guid": "41c6da8a-c6e0-418b-8b23-9906b4adab11",
      "name": "apexCall_anonymous_string",
      "description": "",
      "label": "apexCall anonymous string",
      "locationX": 553,
      "locationY": 258.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "apex",
      "actionName": "InvocableGetAccountName",
      "inputParameters": [
        {
          "rowIndex": "e12af1ed-86ee-4f2f-8de8-9dc3cc64dca1",
          "name": "accountIds",
          "value": "",
          "valueDataType": ""
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
      "elementType": "APEX_CALL",
      "dataType": "String",
      "storeOutputAutomatically": true,
      "isSystemGeneratedOutput": true,
      "subtype": null
    },
    "3f1c4d9a-ea88-4c6c-85ac-6aa009601964": {
      "guid": "3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
      "name": "apexCall_action_account_manual_output",
      "description": "",
      "label": "apexCall action account manual output",
      "locationX": 283,
      "locationY": 142.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "actionType": "apex",
      "actionName": "generateDraftAccount",
      "inputParameters": [],
      "outputParameters": [
        {
          "rowIndex": "2f00ca0d-743f-4639-a084-272bbc548f8b",
          "name": "generatedAccount",
          "value": "a6849bcb-05b6-4898-8cc1-12ff825524c5",
          "valueDataType": "reference"
        }
      ],
      "availableConnections": [
        {
          "type": "REGULAR"
        },
        {
          "type": "FAULT"
        }
      ],
      "maxConnections": 2,
      "elementType": "APEX_CALL",
      "dataType": "Boolean",
      "storeOutputAutomatically": false
    },
    "a18b3d06-504c-4e47-9f44-6663c42703cf": {
      "guid": "a18b3d06-504c-4e47-9f44-6663c42703cf",
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
          "rowIndex": "5383bf9b-8314-42bd-a51e-cbee56ec3570",
          "leftHandSide": "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929",
          "rightHandSide": "4b09a9f9-b658-4b5d-90c5-cbdb83b6484b",
          "rightHandSideDataType": "reference",
          "operator": "Assign"
        }
      ],
      "maxConnections": 1,
      "elementType": "Assignment"
    },
    "20336b8d-01e4-49eb-bb24-87deba5f6ef8": {
      "guid": "20336b8d-01e4-49eb-bb24-87deba5f6ef8",
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
          "outcomeReference": "787fd564-24db-448c-ba59-ef88c8a5cbd9"
        }
      ],
      "defaultConnectorLabel": "Default Outcome",
      "elementType": "Decision",
      "maxConnections": 2,
      "availableConnections": [
        {
          "type": "REGULAR",
          "childReference": "787fd564-24db-448c-ba59-ef88c8a5cbd9"
        },
        {
          "type": "DEFAULT"
        }
      ]
    },
    "787fd564-24db-448c-ba59-ef88c8a5cbd9": {
      "guid": "787fd564-24db-448c-ba59-ef88c8a5cbd9",
      "name": "outcome1",
      "label": "outcome1",
      "elementType": "OUTCOME",
      "dataType": "Boolean",
      "conditionLogic": "and",
      "conditions": [
        {
          "rowIndex": "cc44cf67-84c7-4dc5-b851-44d57be8fa66",
          "leftHandSide": "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929",
          "rightHandSide": "text",
          "rightHandSideDataType": "String",
          "operator": "EqualTo"
        }
      ]
    },
    "c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1": {
      "guid": "c8bc407d-a8ed-49c8-aaf6-2fac342a9fd1",
      "name": "accountSObjectCollectionVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "SObject",
      "subtype": "Account",
      "subtypeIndex": "c5fd40ed-f8bb-4cea-a00d-8f3697b5731c",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "86f9f34d-e2e4-45e3-a574-78ddcd669ebf"
    },
    "a6849bcb-05b6-4898-8cc1-12ff825524c5": {
      "guid": "a6849bcb-05b6-4898-8cc1-12ff825524c5",
      "name": "accountSObjectVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "SObject",
      "subtype": "Account",
      "subtypeIndex": "3e57f4c5-fecd-4be0-83a2-3238cdda979c",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "7ab29c0c-3dbf-4f99-a94c-311ef891973f"
    },
    "85d76151-9bec-4869-b691-791baf964b4f": {
      "guid": "85d76151-9bec-4869-b691-791baf964b4f",
      "name": "apexSampleCollectionVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "Apex",
      "subtype": "MyApexClass",
      "subtypeIndex": "bb597c66-db1e-4636-85b6-31f89b320bd4",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "700b8f1c-98eb-48ea-90f0-35e1a864a1a8"
    },
    "e653d56e-898d-4e69-87c3-07338d100647": {
      "guid": "e653d56e-898d-4e69-87c3-07338d100647",
      "name": "apexSampleVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Apex",
      "subtype": "MyApexClass",
      "subtypeIndex": "956ee0bf-ff21-44f4-9917-65676160e094",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "69030d84-1e7f-49c3-ad89-ddc4db69050a"
    },
    "dd4270aa-df83-4942-ac0f-37ce8072ccaa": {
      "guid": "dd4270aa-df83-4942-ac0f-37ce8072ccaa",
      "name": "caseSObjectCollectionVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "SObject",
      "subtype": "Case",
      "subtypeIndex": "e8161f40-c0f6-4ad8-87ca-942a76a014f2",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "a8368340-a386-4406-9118-02389237ad54"
    },
    "2bf626b1-9430-49ca-ad02-a75241931b16": {
      "guid": "2bf626b1-9430-49ca-ad02-a75241931b16",
      "name": "currencyVariable",
      "description": "randomDescription",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Currency",
      "subtype": null,
      "subtypeIndex": "6e77e9cf-2492-44ca-a088-ee4b8159d478",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "90da6513-4272-44d6-9f80-4cfc29acc5a3"
    },
    "d6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f": {
      "guid": "d6c3ef6f-7fc6-4cf7-a440-9ff753bb8c0f",
      "name": "dateCollectionVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "Date",
      "subtype": null,
      "subtypeIndex": "5c075fad-735a-4628-9e51-495d3292d153",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "d1fda889-4f3a-48cd-ba79-be4fbca04da2"
    },
    "40c11213-36c0-451e-a5aa-8790aee02559": {
      "guid": "40c11213-36c0-451e-a5aa-8790aee02559",
      "name": "dateVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Date",
      "subtype": null,
      "subtypeIndex": "e62ce284-ccf2-46af-8446-c0a110a4bba0",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "34ff5f58-8d99-470d-a755-a2aa0dc69f59"
    },
    "ade42d1f-d120-4ff9-9888-c202b289571c": {
      "guid": "ade42d1f-d120-4ff9-9888-c202b289571c",
      "name": "feedItemVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "SObject",
      "subtype": "FeedItem",
      "subtypeIndex": "6cb9b58e-4246-44c0-85a9-8f7d32172da6",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "a733e74b-1a25-43dc-b43c-d126c849023d"
    },
    "4b09a9f9-b658-4b5d-90c5-cbdb83b6484b": {
      "guid": "4b09a9f9-b658-4b5d-90c5-cbdb83b6484b",
      "name": "numberVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Number",
      "subtype": null,
      "subtypeIndex": "be979456-fe7c-4fa6-be9f-e388ea78dd33",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "bebf0e8d-339f-4227-ab7e-84d7c15daf07"
    },
    "b93ea139-c9df-49cb-a42e-52c5f496ab07": {
      "guid": "b93ea139-c9df-49cb-a42e-52c5f496ab07",
      "name": "stringCollectionVariable1",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "String",
      "subtype": null,
      "subtypeIndex": "8573e2d4-ccfb-4701-be66-e38b54ba7375",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "ebedaf4c-b899-4660-bf34-b2c569bda3c9"
    },
    "3f70f36b-030f-4b90-ba09-866642ba5d4b": {
      "guid": "3f70f36b-030f-4b90-ba09-866642ba5d4b",
      "name": "stringCollectionVariable2",
      "description": "",
      "elementType": "Variable",
      "isCollection": true,
      "isInput": false,
      "isOutput": false,
      "dataType": "String",
      "subtype": null,
      "subtypeIndex": "cf5e6188-117a-47c0-a493-7ed460484c87",
      "scale": 0,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "6afc7b95-a112-4bd0-99e6-4114704080f2"
    },
    "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929": {
      "guid": "60f7e7ac-6177-4f7c-843d-6ebb0b9bd929",
      "name": "stringVariable",
      "description": "random description",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "String",
      "subtype": null,
      "subtypeIndex": "ecf6b72e-f33e-48a4-a58c-bdcc87a80e40",
      "scale": 0,
      "defaultValue": "fooDefault",
      "defaultValueDataType": "String",
      "defaultValueIndex": "3147a31d-26a3-408c-b00b-a31983df0da5"
    },
    "eb19f518-e185-488c-a5b2-9107036766f4": {
      "guid": "eb19f518-e185-488c-a5b2-9107036766f4",
      "name": "apexCarVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Apex",
      "subtype": "Car",
      "subtypeIndex": "70926b3b-6a78-4e62-a62b-0c6d4c4ca910",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "34eaa6ff-765e-4c12-8635-b00f6c7f2c34"
    },
    "ba8a8e41-3944-4099-9655-065f054e811f": {
      "guid": "ba8a8e41-3944-4099-9655-065f054e811f",
      "name": "apexComplexTypeVariable",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "Apex",
      "subtype": "ApexComplexTypeTestOne216",
      "subtypeIndex": "4afdbe2b-6b5a-4da3-887d-5b755f53b64e",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "97a7048c-7323-4356-93c4-30995cf2c8c7"
    },
    "9b2579d0-01d3-45b0-b6b2-bb016b085511": {
      "guid": "9b2579d0-01d3-45b0-b6b2-bb016b085511",
      "name": "vAccountIdFromCreate",
      "description": "",
      "elementType": "Variable",
      "isCollection": false,
      "isInput": false,
      "isOutput": false,
      "dataType": "String",
      "subtype": null,
      "subtypeIndex": "56095468-2459-481d-b084-04a05babcb22",
      "scale": 2,
      "defaultValue": null,
      "defaultValueDataType": null,
      "defaultValueIndex": "88a32730-b8ce-4cdd-b44c-9ad6bd1992e9"
    },
    "48cb0159-3cde-48ad-9877-644e3cc4b5e9": {
      "guid": "48cb0159-3cde-48ad-9877-644e3cc4b5e9",
      "name": "stringConstant",
      "description": "random description",
      "elementType": "Constant",
      "dataType": "String",
      "defaultValue": "fooDefault",
      "defaultValueDataType": "String",
      "defaultValueIndex": "f35bd1d9-bafd-4fc9-b682-2d2557f8f796"
    },
    "88a32528-0dfa-4237-b9dd-a14c1a6d6d10": {
      "guid": "88a32528-0dfa-4237-b9dd-a14c1a6d6d10",
      "name": "textTemplate1",
      "description": "",
      "elementType": "TextTemplate",
      "text": "<p>Hello {!60f7e7ac-6177-4f7c-843d-6ebb0b9bd929}</p>",
      "dataType": "String"
    },
    "e5b4998c-a36e-407f-afb7-2301eda53b8d": {
      "guid": "e5b4998c-a36e-407f-afb7-2301eda53b8d",
      "name": "createAccountWithAutomaticOutput",
      "description": "",
      "label": "createAccountWithAutomaticOutput",
      "locationX": 302,
      "locationY": 512.3125,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "object": "Account",
      "objectIndex": "2635dcd9-5d1d-4d46-b683-eabd7059690c",
      "inputAssignments": [
        {
          "rowIndex": "3c8e62e5-94ba-4bf8-a9cb-6f4599e3020b",
          "leftHandSide": "Account.Name",
          "rightHandSide": "my Account test",
          "rightHandSideDataType": "String"
        },
        {
          "rowIndex": "e4d3dab7-2c92-4d49-9a88-dc16a54d8ea9",
          "leftHandSide": "Account.BillingCountry",
          "rightHandSide": "France",
          "rightHandSideDataType": "String"
        }
      ],
      "getFirstRecordOnly": true,
      "inputReference": "",
      "inputReferenceIndex": "7bbacaec-c6f9-4188-9af4-a32993e0abbd",
      "availableConnections": [
        {
          "type": "REGULAR"
        },
        {
          "type": "FAULT"
        }
      ],
      "maxConnections": 2,
      "elementType": "RecordCreate",
      "assignRecordIdToReference": "",
      "assignRecordIdToReferenceIndex": "54aae715-8881-4a52-b7a9-25c385d1488e",
      "dataType": "Boolean",
      "storeOutputAutomatically": true
    },
    "8d53a0e4-6541-42d0-9ea1-665b504fd150": {
      "guid": "8d53a0e4-6541-42d0-9ea1-665b504fd150",
      "name": "createAccountWithoutAdvancedOptions",
      "description": "",
      "label": "createAccountWithoutAdvancedOptions",
      "locationX": 469,
      "locationY": 513,
      "isCanvasElement": true,
      "connectorCount": 0,
      "config": {
        "isSelected": false,
        "isHighlighted": false
      },
      "object": "Account",
      "objectIndex": "9d11ba05-33c4-4893-87b8-9560be9557d2",
      "inputAssignments": [
        {
          "rowIndex": "458ac1c7-23e7-49cc-a518-5eaf4f218a49",
          "leftHandSide": "Account.Name",
          "rightHandSide": "my test account",
          "rightHandSideDataType": "String"
        },
        {
          "rowIndex": "5e2803c7-a184-465c-92e3-1d29634f2114",
          "leftHandSide": "Account.BillingCountry",
          "rightHandSide": "France",
          "rightHandSideDataType": "String"
        }
      ],
      "getFirstRecordOnly": true,
      "inputReference": "",
      "inputReferenceIndex": "f35b9254-9177-4813-84c0-92bc3dd1e922",
      "availableConnections": [
        {
          "type": "REGULAR"
        },
        {
          "type": "FAULT"
        }
      ],
      "maxConnections": 2,
      "elementType": "RecordCreate",
      "assignRecordIdToReference": "9b2579d0-01d3-45b0-b6b2-bb016b085511",
      "assignRecordIdToReferenceIndex": "ead8ca09-bffd-47ee-93c2-7ebeaf14def2",
      "dataType": "Boolean",
      "storeOutputAutomatically": false
    },
    "d050fa16-f494-4685-a87f-3c68666d1ba8": {
      "guid": "d050fa16-f494-4685-a87f-3c68666d1ba8",
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
      "objectIndex": "9ded932c-cb00-42a7-bbfc-dddb4c2903fd",
      "filterType": "none",
      "filters": [
        {
          "rowIndex": "76bbf8c2-9a5e-4a03-a84f-a518866d7963",
          "leftHandSide": "",
          "rightHandSide": "",
          "rightHandSideDataType": "",
          "operator": ""
        }
      ],
      "queriedFields": [
        {
          "field": "Id",
          "rowIndex": "f08f384a-8e8f-40d3-8009-f8e1fb16eac4"
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
      "outputReferenceIndex": "2d1ada73-88e9-4cf4-a814-dcba8d517104",
      "dataType": "SObject",
      "isCollection": false,
      "subtype": "Account",
      "storeOutputAutomatically": true,
      "getFirstRecordOnly": true
    },
    "756e3b06-1ee6-4f8e-82b2-ce141c9405db": {
      "guid": "756e3b06-1ee6-4f8e-82b2-ce141c9405db",
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
      "objectIndex": "f8b3b3b3-2a93-4a2c-8630-815b2797aaa7",
      "filterType": "none",
      "filters": [
        {
          "rowIndex": "c518ac20-1202-42a6-ac3d-cfc8b707f4c3",
          "leftHandSide": "",
          "rightHandSide": "",
          "rightHandSideDataType": "",
          "operator": ""
        }
      ],
      "queriedFields": [
        {
          "field": "Id",
          "rowIndex": "1283ede6-414b-45a2-851a-1b113f26bffd"
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
      "outputReferenceIndex": "fcf61595-af2e-4982-9607-5de1c2819fab",
      "dataType": "SObject",
      "isCollection": true,
      "subtype": "Account",
      "storeOutputAutomatically": true,
      "getFirstRecordOnly": false
    },
    "b8c16d53-6fcd-458c-b3e6-51f2658308bc": {
      "guid": "b8c16d53-6fcd-458c-b3e6-51f2658308bc",
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
      "objectIndex": "d7b1d0e5-68d7-4734-b1d1-01247631d93f",
      "outputReference": "a6849bcb-05b6-4898-8cc1-12ff825524c5",
      "assignNullValuesIfNoRecordsFound": false,
      "filterType": "none",
      "filters": [
        {
          "rowIndex": "476ffd9b-6322-4bfa-969e-0d63bce36f32",
          "leftHandSide": "",
          "rightHandSide": "",
          "rightHandSideDataType": "",
          "operator": ""
        }
      ],
      "queriedFields": [
        {
          "field": "Id",
          "rowIndex": "97e556fe-63c0-4426-9421-b3dc0d5a74aa"
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
      "outputReferenceIndex": "37c4575e-32f8-46d9-aeea-737953c256b2",
      "dataType": "Boolean",
      "storeOutputAutomatically": false,
      "getFirstRecordOnly": true
    },
    "8e3cf25f-1ce2-48c8-9634-b192b94ae230": {
      "guid": "8e3cf25f-1ce2-48c8-9634-b192b94ae230",
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
          "fieldReference": "e9417fd7-2e24-495f-a4af-6ca687957ef6"
        },
        {
          "fieldReference": "0883ba56-46a4-4420-8105-c9d17ad0183b"
        }
      ],
      "elementType": "Screen",
      "maxConnections": 1
    },
    "e9417fd7-2e24-495f-a4af-6ca687957ef6": {
      "guid": "e9417fd7-2e24-495f-a4af-6ca687957ef6",
      "name": "emailScreenFieldAutomaticOutput",
      "choiceReferences": [],
      "dataType": "LightningComponentOutput",
      "defaultValue": "",
      "defaultValueIndex": "e502e40a-7dfc-4e71-8a42-c491f86a560a",
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
          "rowIndex": "cea1a8e6-1cb0-4b2f-9549-2610c8b61f78",
          "name": "label",
          "value": "emailScreenFieldAutomaticOutput",
          "valueDataType": "String"
        },
        {
          "rowIndex": "1f6554e7-ca93-491c-979c-1e2b8fcc563f",
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
    "0883ba56-46a4-4420-8105-c9d17ad0183b": {
      "guid": "0883ba56-46a4-4420-8105-c9d17ad0183b",
      "name": "emailScreenField",
      "choiceReferences": [],
      "defaultValue": "",
      "defaultValueIndex": "f79b5397-57f9-426b-aa00-5ef1b8b8f75d",
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
          "rowIndex": "02504510-b361-4fb3-878e-81925a76160f",
          "name": "label",
          "value": "emailScreenField",
          "valueDataType": "String"
        },
        {
          "rowIndex": "8ca42594-136e-4ab4-b3d6-ff72c2c0dc2e",
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
    "4d5723fe-7d36-4044-8f59-1f6da02eacbe": {
      "guid": "4d5723fe-7d36-4044-8f59-1f6da02eacbe",
      "name": "stage1",
      "description": "",
      "isActive": false,
      "stageOrder": "12",
      "label": "stage1",
      "elementType": "Stage"
    },
    "41a189ff-01f4-4018-b75c-3f363b65cc42": {
      "guid": "41a189ff-01f4-4018-b75c-3f363b65cc42",
      "name": "numberChoice",
      "description": "",
      "elementType": "Choice",
      "dataType": "Number",
      "choiceText": "Choice 1",
      "storedValue": null,
      "storedValueDataType": null,
      "storedValueIndex": "796969f1-a892-4b16-836e-209180057a2b",
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
    "7f4ddba5-e41b-456b-b686-94b257cc9914",
    "7bc6bd8f-26da-45cb-81de-6b8dcc0ad7be",
    "53329036-32e6-4965-a1d2-b12cd0344f99",
    "41c6da8a-c6e0-418b-8b23-9906b4adab11",
    "3f1c4d9a-ea88-4c6c-85ac-6aa009601964",
    "a18b3d06-504c-4e47-9f44-6663c42703cf",
    "20336b8d-01e4-49eb-bb24-87deba5f6ef8",
    "e5b4998c-a36e-407f-afb7-2301eda53b8d",
    "8d53a0e4-6541-42d0-9ea1-665b504fd150",
    "d050fa16-f494-4685-a87f-3c68666d1ba8",
    "756e3b06-1ee6-4f8e-82b2-ce141c9405db",
    "b8c16d53-6fcd-458c-b3e6-51f2658308bc",
    "8e3cf25f-1ce2-48c8-9634-b192b94ae230"
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
};

