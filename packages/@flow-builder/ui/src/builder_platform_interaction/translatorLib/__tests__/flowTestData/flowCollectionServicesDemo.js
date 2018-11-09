export const flowCollectionServicesDemo = {
    "createdById": "005xx00000000tnAAA",
    "createdDate": "2018-10-12T15:08:48.000+0000",
    "definitionId": "300xx00000000RhAAI",
    "fieldsToNull": [],
    "fullName": "CollectionOperators_Demo",
    "id": "301xx00000000nGAAQ",
    "lastModifiedById": "005xx00000000tnAAA",
    "lastModifiedDate": "2018-10-12T15:12:55.000+0000",
    "manageableState": "unmanaged",
    "masterLabel": "Collection Services Demonstration",
    "metadata": {
      "actionCalls": [],
      "apexPluginCalls": [],
      "assignments": [
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "AddAtStart",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Add_What_Text"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Add to Start",
          "locationX": 630,
          "locationY": 466,
          "name": "Add_to_Start",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterS"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterN"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterO"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterW"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterI"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterN"
              }
            },
            {
              "assignToReference": "LettersArray",
              "operator": "Add",
              "processMetadataValues": [],
              "value": {
                "elementReference": "LetterG"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Build Word",
          "locationX": 225,
          "locationY": 59,
          "name": "Build_Word",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemovePosition",
              "processMetadataValues": [],
              "value": {
                "numberValue": 1
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Pop Element",
          "locationX": 601,
          "locationY": 260,
          "name": "Pop_Element",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemoveAfterFirst",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Remove_after_which_item"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Remove After First",
          "locationX": 621,
          "locationY": 577,
          "name": "Remove_After_First_assignment",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemoveAll",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Remove_all_instances_of_which_item"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Remove All",
          "locationX": 528,
          "locationY": 683,
          "name": "Remove_All_assignment",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemoveBeforeFirst",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Remove_everything_in_front_of_which_item"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Remove Before First",
          "locationX": 504,
          "locationY": 781,
          "name": "Remove_Before_First_assignment",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemoveFirst",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Remove_the_first_instance_of_which_item"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Remove First",
          "locationX": 413,
          "locationY": 886,
          "name": "Remove_First_assignment",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "RemovePosition",
              "processMetadataValues": [],
              "value": {
                "elementReference": "Position_Number"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Display"
          },
          "label": "Remove Position",
          "locationX": 750,
          "locationY": 393,
          "name": "Remove_Position",
          "processMetadataValues": []
        },
        {
          "assignmentItems": [
            {
              "assignToReference": "LettersArray",
              "operator": "Assign",
              "processMetadataValues": [],
              "value": {
                "elementReference": "emptyCollection"
              }
            }
          ],
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Build_Word"
          },
          "label": "Set to Empty",
          "locationX": 162,
          "locationY": 277,
          "name": "Set_to_Empty",
          "processMetadataValues": []
        }
      ],
      "choices": [
        {
          "choiceText": "Choice1",
          "dataType": "String",
          "name": "Choice1",
          "processMetadataValues": [],
          "userInput": {
            "isRequired": false,
            "processMetadataValues": []
          }
        }
      ],
      "constants": [],
      "decisions": [
        {
          "defaultConnectorLabel": "[Default Outcome]",
          "label": "BranchController",
          "locationX": 349,
          "locationY": 269,
          "name": "BranchController",
          "processMetadataValues": [],
          "rules": [
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "pop element"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Pop_Element"
              },
              "label": "Pop Element",
              "name": "Pop_Element_outcome",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "remove position"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Get_Position"
              },
              "label": "Remove Position",
              "name": "Remove_Position_outcome",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "add at start"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Get_Position_0"
              },
              "label": "Add to Start",
              "name": "Add_to_Start_outcome",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "remove after first"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Remove_After_First"
              },
              "label": "Remove After First",
              "name": "Remove_After_First_outcome",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "reset"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Set_to_Empty"
              },
              "label": "Reset",
              "name": "Reset",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "remove all"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Remove_All_screen"
              },
              "label": "Remove All",
              "name": "Remove_All",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "remove before first"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Remove_Before_First"
              },
              "label": "Remove Before First",
              "name": "Remove_Before_First_outcome",
              "processMetadataValues": []
            },
            {
              "conditionLogic": "and",
              "conditions": [
                {
                  "leftValueReference": "navTarget",
                  "operator": "EqualTo",
                  "processMetadataValues": [],
                  "rightValue": {
                    "stringValue": "remove first"
                  }
                }
              ],
              "connector": {
                "processMetadataValues": [],
                "targetReference": "Remove_First"
              },
              "label": "Remove First",
              "name": "Remove_First_outcome",
              "processMetadataValues": []
            }
          ]
        }
      ],
      "description": "PM demo org flow - Extracted on Oct 3rd, 2018",
      "dynamicChoiceSets": [],
      "formulas": [],
      "interviewLabel": "CollectionOperators Demo {!$Flow.CurrentDateTime}",
      "isTemplate": false,
      "label": "Collection Services Demonstration",
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
            "targetReference": "Build_Word"
          },
          "filters": [
            {
              "field": "CreatedDate",
              "operator": "GreaterThan",
              "processMetadataValues": [],
              "value": {
                "dateTimeValue": "2018-05-01T07:00:00.000+0000"
              }
            }
          ],
          "label": "Get Repair Procedures",
          "locationX": 690,
          "locationY": 55,
          "name": "Get_Repair_Procedures",
          "object": "RepairProcedure__c",
          "outputAssignments": [],
          "outputReference": "curRepairProcedures",
          "processMetadataValues": [],
          "queriedFields": [
            "Id",
            "Category__c",
            "Frequency__c",
            "Contact__c",
            "RepairProcedureType__c"
          ]
        }
      ],
      "recordUpdates": [],
      "screens": [
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": false,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "BranchController"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "{!LettersArray}",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "DisplayText",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "extensionName": "c:buttonNavFSC",
              "fieldType": "ComponentInstance",
              "inputParameters": [
                {
                  "name": "pathNameButtonTwo",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "remove position"
                  }
                },
                {
                  "name": "labelButtonThree",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Add at Start"
                  }
                },
                {
                  "name": "pathNameButtonThree",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "add at start"
                  }
                },
                {
                  "name": "labelButtonFour",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Remove Everything After"
                  }
                },
                {
                  "name": "pathNameButtonFour",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "remove after first"
                  }
                },
                {
                  "name": "labelButtonTwo",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Remove at Position"
                  }
                },
                {
                  "name": "labelButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Pop First Element"
                  }
                },
                {
                  "name": "pathNameButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "pop element"
                  }
                }
              ],
              "isRequired": true,
              "isVisible": false,
              "name": "ButtonNav1",
              "outputParameters": [
                {
                  "assignToReference": "navTarget",
                  "name": "selectedPathName",
                  "processMetadataValues": []
                }
              ],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "extensionName": "c:MultiShim",
              "fieldType": "ComponentInstance",
              "inputParameters": [
                {
                  "name": "lineCount",
                  "processMetadataValues": [],
                  "value": {
                    "numberValue": 1
                  }
                }
              ],
              "isRequired": true,
              "isVisible": false,
              "name": "shim1",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "extensionName": "c:buttonNavFSC",
              "fieldType": "ComponentInstance",
              "inputParameters": [
                {
                  "name": "labelButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Remove All Matches"
                  }
                },
                {
                  "name": "pathNameButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "remove all"
                  }
                },
                {
                  "name": "labelButtonTwo",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Remove Before"
                  }
                },
                {
                  "name": "pathNameButtonTwo",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "remove before first"
                  }
                },
                {
                  "name": "labelButtonThree",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Remove First"
                  }
                },
                {
                  "name": "pathNameButtonThree",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "remove first"
                  }
                }
              ],
              "isRequired": true,
              "isVisible": false,
              "name": "SecondSet",
              "outputParameters": [
                {
                  "assignToReference": "navTarget",
                  "name": "selectedPathName",
                  "processMetadataValues": []
                }
              ],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "extensionName": "c:buttonNavFSC",
              "fieldType": "ComponentInstance",
              "inputParameters": [
                {
                  "name": "labelButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "Reset"
                  }
                },
                {
                  "name": "pathNameButtonOne",
                  "processMetadataValues": [],
                  "value": {
                    "stringValue": "reset"
                  }
                }
              ],
              "isRequired": true,
              "isVisible": false,
              "name": "ResetButton",
              "outputParameters": [
                {
                  "assignToReference": "navTarget",
                  "name": "selectedPathName",
                  "processMetadataValues": []
                }
              ],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Display",
          "locationX": 1173,
          "locationY": 398,
          "name": "Display",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": false,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Remove_Position"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will remove one item from your set of items. At what position should we do this?</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "Number",
              "fieldText": "Position Number (starts from 1)",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Position_Number",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 2
            }
          ],
          "label": "Get Position",
          "locationX": 565,
          "locationY": 343,
          "name": "Get_Position",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Add_to_Start"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will add one item to the start of your list. What would you like to add?</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition_0",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "String",
              "fieldText": "Add What Text?",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Add_What_Text",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Get Position",
          "locationX": 494,
          "locationY": 463,
          "name": "Get_Position_0",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Remove_After_First_assignment"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will remove everything after the first instance of this item:</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition_0_0",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "String",
              "fieldText": "Remove after which item?",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Remove_after_which_item",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Remove After First",
          "locationX": 479,
          "locationY": 571,
          "name": "Remove_After_First",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Remove_All_assignment"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will remove </B><B><U>each instance</U></B><B> of the specified item:</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition_0_0_0",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "String",
              "fieldText": "Remove all instances of which item?",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Remove_all_instances_of_which_item",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Remove All",
          "locationX": 372,
          "locationY": 686,
          "name": "Remove_All_screen",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Remove_Before_First_assignment"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will remove </B><B><U>everything before</U></B><B> the specified item:</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition_0_0_0_0",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "String",
              "fieldText": "Remove everything in front of which item?",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Remove_everything_in_front_of_which_item",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Remove Before First",
          "locationX": 313,
          "locationY": 782,
          "name": "Remove_Before_First",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        },
        {
          "allowBack": true,
          "allowFinish": true,
          "allowPause": true,
          "connector": {
            "processMetadataValues": [],
            "targetReference": "Remove_First_assignment"
          },
          "fields": [
            {
              "choiceReferences": [],
              "fieldText": "<DIV ALIGN=\"LEFT\"><FONT FACE=\"Arial\" STYLE=\"font-size:16px\" COLOR=\"#000000\" LETTERSPACING=\"0\" KERNING=\"0\"><B>We will remove </B><B><U>the first instance of</U></B><B> the specified item:</B></FONT></DIV>",
              "fieldType": "DisplayText",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "WhatsthePosition_0_0_0_0_0",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            },
            {
              "choiceReferences": [],
              "dataType": "String",
              "fieldText": "Remove the first instance of which item?",
              "fieldType": "InputField",
              "inputParameters": [],
              "isRequired": false,
              "isVisible": false,
              "name": "Remove_the_first_instance_of_which_item",
              "outputParameters": [],
              "processMetadataValues": [],
              "scale": 0
            }
          ],
          "label": "Remove First",
          "locationX": 218,
          "locationY": 886,
          "name": "Remove_First",
          "processMetadataValues": [],
          "rules": [],
          "showFooter": true,
          "showHeader": true
        }
      ],
      "stages": [],
      "startElementReference": "Build_Word",
      "status": "Draft",
      "steps": [],
      "subflows": [],
      "textTemplates": [],
      "variables": [
        {
          "dataType": "SObject",
          "isCollection": true,
          "isInput": true,
          "isOutput": true,
          "name": "curRepairProcedures",
          "objectType": "RepairProcedure__c",
          "processMetadataValues": [],
          "scale": 0
        },
        {
          "dataType": "String",
          "isCollection": true,
          "isInput": false,
          "isOutput": false,
          "name": "emptyCollection",
          "processMetadataValues": [],
          "scale": 0
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterG",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "G"
          }
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterI",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "I"
          }
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterN",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "N"
          }
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterO",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "O"
          }
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterS",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "S"
          }
        },
        {
          "dataType": "String",
          "isCollection": true,
          "isInput": true,
          "isOutput": true,
          "name": "LettersArray",
          "processMetadataValues": [],
          "scale": 0
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "LetterW",
          "processMetadataValues": [],
          "scale": 0,
          "value": {
            "stringValue": "W"
          }
        },
        {
          "dataType": "String",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "navTarget",
          "processMetadataValues": [],
          "scale": 0
        },
        {
          "dataType": "Number",
          "isCollection": false,
          "isInput": true,
          "isOutput": true,
          "name": "requestedPosition",
          "processMetadataValues": [],
          "scale": 2
        }
      ],
      "waits": []
    },
    "processType": "Flow",
    "status": "Draft",
    "versionNumber": 4
  };