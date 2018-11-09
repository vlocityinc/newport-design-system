export const flowLegalNameChange = {
  "createdById": "005T1000000Dm4KIAS",
  "createdDate": "2018-10-22T12:09:22.000+0000",
  "definitionId": "300T10000004FJAIA2",
  "fieldsToNull": [],
  "fullName": "bdufourd01__Legal_Name_Change",
  "id": "301T100000000joIAA",
  "lastModifiedById": "005T1000000Dm4KIAS",
  "lastModifiedDate": "2018-10-22T12:09:27.000+0000",
  "manageableState": "unmanaged",
  "masterLabel": "Legal Name Change",
  "metadata": {
    "actionCalls": [
      {
        "actionName": "chatterPost",
        "actionType": "chatterPost",
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Final_Screen"
        },
        "inputParameters": [
          {
            "name": "subjectNameOrId",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          },
          {
            "name": "text",
            "processMetadataValues": [],
            "value": {
              "elementReference": "FeedUpdate"
            }
          }
        ],
        "label": "Update Feed",
        "locationX": 882,
        "locationY": 414,
        "name": "Update_Feed",
        "outputParameters": [
          {
            "assignToReference": "vFeedItemID",
            "name": "feedItemId",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": []
      }
    ],
    "apexPluginCalls": [],
    "assignments": [
      {
        "assignmentItems": [
          {
            "assignToReference": "recordId",
            "operator": "Assign",
            "processMetadataValues": [],
            "value": {
              "elementReference": "vCaseAccountId"
            }
          }
        ],
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Initial_Info_Screen"
        },
        "label": "Assign recordId to AccountId",
        "locationX": 281,
        "locationY": 625,
        "name": "Assign_recordId_to_AccountId",
        "processMetadataValues": []
      },
      {
        "assignmentItems": [
          {
            "assignToReference": "recordId",
            "operator": "Assign",
            "processMetadataValues": [],
            "value": {
              "elementReference": "vCaseContactId"
            }
          }
        ],
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Initial_Info_Screen"
        },
        "label": "Assign recordId to Contactid",
        "locationX": 283,
        "locationY": 502,
        "name": "Assign_recordId_to_Contactid",
        "processMetadataValues": []
      }
    ],
    "choices": [],
    "constants": [],
    "decisions": [
      {
        "defaultConnector": {
          "processMetadataValues": [],
          "targetReference": "Unsupported_Object_Type_Message"
        },
        "defaultConnectorLabel": "Company",
        "label": "Check if Account is Person Account",
        "locationX": 298,
        "locationY": 73,
        "name": "Check_if_Account_is_Person_Account",
        "processMetadataValues": [],
        "rules": [
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "vIsPersonAccount",
                "operator": "EqualTo",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "true"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Initial_Info_Screen"
            },
            "label": "Account is Person Account",
            "name": "Account_is_Person_Account",
            "processMetadataValues": []
          }
        ]
      },
      {
        "defaultConnector": {
          "processMetadataValues": [],
          "targetReference": "Lookup_Person_Account_Information"
        },
        "defaultConnectorLabel": "Is Person Account",
        "label": "Check if Case Contact is Person Account",
        "locationX": 90,
        "locationY": 501,
        "name": "Check_if_Case_Contact_is_Person_Account",
        "processMetadataValues": [],
        "rules": [
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "vIsCaseContactPersonAccount",
                "operator": "NotEqualTo",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "true"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Assign_recordId_to_Contactid"
            },
            "label": "Is Contact",
            "name": "Is_Contact",
            "processMetadataValues": []
          }
        ]
      },
      {
        "defaultConnector": {
          "processMetadataValues": [],
          "targetReference": "Unsupported_Object_Type_Message"
        },
        "defaultConnectorLabel": "Unsupported Object",
        "label": "Check Object Type",
        "locationX": 86,
        "locationY": 190,
        "name": "Check_Object_Type",
        "processMetadataValues": [],
        "rules": [
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "recordId",
                "operator": "StartsWith",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "001"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Account_Lookup"
            },
            "label": "Account",
            "name": "Account",
            "processMetadataValues": []
          },
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "recordId",
                "operator": "StartsWith",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "003"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Contact_Lookup"
            },
            "label": "Contact",
            "name": "Contact",
            "processMetadataValues": []
          },
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "recordId",
                "operator": "StartsWith",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "500"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Case_Lookup"
            },
            "label": "Case",
            "name": "Case",
            "processMetadataValues": []
          }
        ]
      },
      {
        "defaultConnectorLabel": "[Default Outcome]",
        "label": "Customer Info Object Type Decision",
        "locationX": 891,
        "locationY": 194,
        "name": "Customer_Info_Object_Type_Decision",
        "processMetadataValues": [],
        "rules": [
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "recordId",
                "operator": "StartsWith",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "001"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Update_Person_Account"
            },
            "label": "AccountUpdate",
            "name": "AccountUpdate",
            "processMetadataValues": []
          },
          {
            "conditionLogic": "and",
            "conditions": [
              {
                "leftValueReference": "recordId",
                "operator": "StartsWith",
                "processMetadataValues": [],
                "rightValue": {
                  "stringValue": "003"
                }
              }
            ],
            "connector": {
              "processMetadataValues": [],
              "targetReference": "Update_Contact"
            },
            "label": "ContactUpdate",
            "name": "ContactUpdate",
            "processMetadataValues": []
          }
        ]
      }
    ],
    "description": "This Flow prompts for and changes the name of the Contact or Person Account, it also requires upload of documentation (pdf, jpg, png) and it updates the Feed for the record after the change. Can be launched from Contact, Person Account or Case records.",
    "dynamicChoiceSets": [
      {
        "dataType": "Picklist",
        "filters": [],
        "limit": 0,
        "name": "Salutation",
        "outputAssignments": [],
        "picklistField": "Salutation",
        "picklistObject": "Contact",
        "processMetadataValues": []
      }
    ],
    "formulas": [
      {
        "dataType": "String",
        "expression": "\"The name on this Contact or Person Account record was updated using a Flow. The original name was \" & {!vFormerSalutation} & \" \" & {!vFirstName} & \" \" & {!vFormerLastName} & \". The new name is \" & {!New_Salutation} & \" \" & {!New_First_Name} & \" \" & {!New_Last_Name}",
        "name": "FeedUpdate",
        "processMetadataValues": [],
        "scale": 0
      }
    ],
    "interviewLabel": "Legal Name Change {!$Flow.CurrentDateTime}",
    "isTemplate": false,
    "label": "Legal Name Change",
    "loops": [],
    "processMetadataValues": [],
    "processType": "Flow",
    "recordCreates": [],
    "recordDeletes": [],
    "recordLookups": [
      {
        "assignNullValuesIfNoRecordsFound": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Check_if_Account_is_Person_Account"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          }
        ],
        "label": "Account Lookup",
        "locationX": 297,
        "locationY": 183,
        "name": "Account_Lookup",
        "object": "Account",
        "outputAssignments": [
          {
            "assignToReference": "vFirstName",
            "field": "FirstName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vIsPersonAccount",
            "field": "IsPersonAccount",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerLastName",
            "field": "LastName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCity",
            "field": "PersonMailingCity",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCountry",
            "field": "PersonMailingCountry",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingPostal",
            "field": "PersonMailingPostalCode",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingState",
            "field": "PersonMailingState",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingStreet",
            "field": "PersonMailingStreet",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerSalutation",
            "field": "Salutation",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": [],
        "queriedFields": []
      },
      {
        "assignNullValuesIfNoRecordsFound": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Find_Contact_Info_for_Case"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          }
        ],
        "label": "Case Lookup",
        "locationX": 89,
        "locationY": 305,
        "name": "Case_Lookup",
        "object": "Case",
        "outputAssignments": [
          {
            "assignToReference": "vCaseAccountId",
            "field": "AccountId",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vCaseContactId",
            "field": "ContactId",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": [],
        "queriedFields": []
      },
      {
        "assignNullValuesIfNoRecordsFound": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Initial_Info_Screen"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          }
        ],
        "label": "Contact Lookup",
        "locationX": 294,
        "locationY": 299,
        "name": "Contact_Lookup",
        "object": "Contact",
        "outputAssignments": [
          {
            "assignToReference": "vFirstName",
            "field": "FirstName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerLastName",
            "field": "LastName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCity",
            "field": "MailingCity",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCountry",
            "field": "MailingCountry",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingPostal",
            "field": "MailingPostalCode",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingState",
            "field": "MailingState",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingStreet",
            "field": "MailingStreet",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerSalutation",
            "field": "Salutation",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": [],
        "queriedFields": []
      },
      {
        "assignNullValuesIfNoRecordsFound": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Check_if_Case_Contact_is_Person_Account"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "vCaseContactId"
            }
          }
        ],
        "label": "Find Contact Info for Case",
        "locationX": 90,
        "locationY": 403,
        "name": "Find_Contact_Info_for_Case",
        "object": "Contact",
        "outputAssignments": [
          {
            "assignToReference": "vFirstName",
            "field": "FirstName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vIsCaseContactPersonAccount",
            "field": "IsPersonAccount",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerLastName",
            "field": "LastName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCity",
            "field": "MailingCity",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCountry",
            "field": "MailingCountry",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingPostal",
            "field": "MailingPostalCode",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingState",
            "field": "MailingState",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingStreet",
            "field": "MailingStreet",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerSalutation",
            "field": "Salutation",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": [],
        "queriedFields": []
      },
      {
        "assignNullValuesIfNoRecordsFound": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Assign_recordId_to_AccountId"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "vCaseAccountId"
            }
          }
        ],
        "label": "Lookup Person Account Information",
        "locationX": 93,
        "locationY": 621,
        "name": "Lookup_Person_Account_Information",
        "object": "Account",
        "outputAssignments": [
          {
            "assignToReference": "vFirstName",
            "field": "FirstName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerLastName",
            "field": "LastName",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCity",
            "field": "PersonMailingCity",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingCountry",
            "field": "PersonMailingCountry",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingPostal",
            "field": "PersonMailingPostalCode",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingState",
            "field": "PersonMailingState",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vMailingStreet",
            "field": "PersonMailingStreet",
            "processMetadataValues": []
          },
          {
            "assignToReference": "vFormerSalutation",
            "field": "Salutation",
            "processMetadataValues": []
          }
        ],
        "processMetadataValues": [],
        "queriedFields": []
      }
    ],
    "recordUpdates": [
      {
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Update_Feed"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          }
        ],
        "inputAssignments": [
          {
            "field": "FirstName",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_First_Name"
            }
          },
          {
            "field": "LastName",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_Last_Name"
            }
          },
          {
            "field": "Salutation",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_Salutation"
            }
          }
        ],
        "label": "Update Contact",
        "locationX": 979,
        "locationY": 317,
        "name": "Update_Contact",
        "object": "Contact",
        "processMetadataValues": []
      },
      {
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Update_Feed"
        },
        "filters": [
          {
            "field": "Id",
            "operator": "EqualTo",
            "processMetadataValues": [],
            "value": {
              "elementReference": "recordId"
            }
          }
        ],
        "inputAssignments": [
          {
            "field": "FirstName",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_First_Name"
            }
          },
          {
            "field": "LastName",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_Last_Name"
            }
          },
          {
            "field": "Salutation",
            "processMetadataValues": [],
            "value": {
              "elementReference": "New_Salutation"
            }
          }
        ],
        "label": "Update Person Account",
        "locationX": 783,
        "locationY": 316,
        "name": "Update_Person_Account",
        "object": "Account",
        "processMetadataValues": []
      }
    ],
    "screens": [
      {
        "allowBack": true,
        "allowFinish": false,
        "allowPause": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Customer_Info_Object_Type_Decision"
        },
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">You have requested that the name on the account will be changed to the following:</FONT></DIV><DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">-</FONT></DIV><DIV ALIGN=\"LEFT\"><FONT FACE=\"Courier New\" STYLE=\"font-size:12px\" COLOR=\"#FF0000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>{!New_First_Name} {!New_Last_Name}</B></FONT></DIV><DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">-</FONT></DIV><DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">If this is not correct press Previous and make the changes.</FONT></DIV>",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "veacsd",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "Confirmation Screen",
        "locationX": 841,
        "locationY": 77,
        "name": "Confirmation_Screen",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": true,
        "allowFinish": false,
        "allowPause": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Confirmation_Screen"
        },
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "Please upload the following files one by one:\n- Copy or picture of Social Security Card with the new name\n- Copy or picture of utility bill showing the new name\nThe following file extensions are allowed: .JPG and .PNG",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "terdsx",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Empty00",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "extensionName": "forceContent:fileUpload",
            "fieldType": "ComponentInstance",
            "inputParameters": [
              {
                "name": "label",
                "processMetadataValues": [],
                "value": {
                  "stringValue": "Upload Files"
                }
              },
              {
                "name": "recordId",
                "processMetadataValues": [],
                "value": {
                  "elementReference": "recordId"
                }
              },
              {
                "name": "accept",
                "processMetadataValues": [],
                "value": {
                  "stringValue": ".jpg, .png, .pdf"
                }
              }
            ],
            "isRequired": true,
            "isVisible": false,
            "name": "DocUploader",
            "outputParameters": [
              {
                "assignToReference": "vRelatedRecordId",
                "name": "recordId",
                "processMetadataValues": []
              }
            ],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "Document Upload Screen",
        "locationX": 694,
        "locationY": 70,
        "name": "Document_Upload_Screen",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": false,
        "allowFinish": true,
        "allowPause": false,
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "Thank you for contacting us and letting us know your new name. This will take 24-48 hours to process. We will contact you if there are any questions.",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "gfwds",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "Final Screen",
        "locationX": 880,
        "locationY": 514,
        "name": "Final_Screen",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": true,
        "allowFinish": false,
        "allowPause": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "New_Name_Information_Input"
        },
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "Please provide the following information for verification.",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "vascd",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "stringValue": "123-45-6789"
            },
            "fieldText": "Social Security Number",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Social_Security_Number",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vMailingStreet"
            },
            "fieldText": "Street",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Street",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vMailingCity"
            },
            "fieldText": "City",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "City",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vMailingState"
            },
            "fieldText": "State",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "State",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vMailingPostal"
            },
            "fieldText": "Postal Code",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Postal_Code",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vMailingCountry"
            },
            "fieldText": "Country",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Country",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "fieldText": "Please provide the former name that this financial institution knows you under.",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "FormerNameText",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vFormerSalutation"
            },
            "fieldText": "Salutation",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Former_Salutation",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vFirstName"
            },
            "fieldText": "First Name",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Former_First_Name",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "defaultValue": {
              "elementReference": "vFormerLastName"
            },
            "fieldText": "Last Name",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "Former_Last_Name",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "General Info Verification",
        "locationX": 574,
        "locationY": 311,
        "name": "General_Info_Verification",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": true,
        "allowFinish": false,
        "allowPause": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "General_Info_Verification"
        },
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Before we get started {!vFirstName} I have to inform you that in order for us to finalize the process of changing the name on your accounts you will need to provide the following information either electronically or in person at a branch or office.</FONT></DIV><DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"></FONT></DIV><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Social Security Card showing new name.</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING=\"2\"><LI><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Eletrical or Gas Bill showing new name</FONT></LI></TEXTFORMAT>",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "InitialMessage",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "Initial Info Screen",
        "locationX": 508,
        "locationY": 183,
        "name": "Initial_Info_Screen",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": true,
        "allowFinish": false,
        "allowPause": false,
        "connector": {
          "processMetadataValues": [],
          "targetReference": "Document_Upload_Screen"
        },
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:12px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\">Please provide your <U>new</U> First Name, Middle Initial and Last Name. Please make sure to spell it out exactly as it is on your Social Security Card.</FONT></DIV>",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "vrfcs",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [
              "Salutation"
            ],
            "dataType": "String",
            "fieldText": "Salutation",
            "fieldType": "DropdownBox",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "New_Salutation",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "fieldText": "First Name",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": true,
            "isVisible": false,
            "name": "New_First_Name",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          },
          {
            "choiceReferences": [],
            "dataType": "String",
            "fieldText": "Last Name",
            "fieldType": "InputField",
            "inputParameters": [],
            "isRequired": true,
            "isVisible": false,
            "name": "New_Last_Name",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "New Name Information Input",
        "locationX": 704,
        "locationY": 178,
        "name": "New_Name_Information_Input",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      },
      {
        "allowBack": false,
        "allowFinish": true,
        "allowPause": false,
        "fields": [
          {
            "choiceReferences": [],
            "fieldText": "This is not a supported object type.",
            "fieldType": "DisplayText",
            "inputParameters": [],
            "isRequired": false,
            "isVisible": false,
            "name": "UnsupportedObjectTypeDisplay",
            "outputParameters": [],
            "processMetadataValues": [],
            "scale": 0
          }
        ],
        "label": "Unsupported Object Type Message",
        "locationX": 89,
        "locationY": 710,
        "name": "Unsupported_Object_Type_Message",
        "processMetadataValues": [],
        "rules": [],
        "showFooter": true,
        "showHeader": true
      }
    ],
    "stages": [],
    "startElementReference": "Check_Object_Type",
    "status": "Active",
    "steps": [],
    "subflows": [],
    "textTemplates": [],
    "variables": [
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": true,
        "isOutput": false,
        "name": "recordId",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vCaseAccountId",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vCaseContactId",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vFeedItemID",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vFirstName",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vFormerLastName",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vFormerSalutation",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vIsCaseContactPersonAccount",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vIsPersonAccount",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vMailingCity",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vMailingCountry",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vMailingPostal",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vMailingState",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vMailingStreet",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vRelatedRecordId",
        "processMetadataValues": [],
        "scale": 0
      },
      {
        "dataType": "String",
        "isCollection": false,
        "isInput": false,
        "isOutput": false,
        "name": "vUploadedFiles",
        "processMetadataValues": [],
        "scale": 0
      }
    ],
    "waits": []
  },
  "processType": "Flow",
  "status": "Active",
  "versionNumber": 1
};