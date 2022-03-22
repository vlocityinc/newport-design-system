// To be only used by flowTranslator.test.ts DO NOT USE elsewhere
export const flowCollectionServicesDemo = {
    createdById: '005xx00000000tnAAA',
    createdDate: '2018-10-12T15:08:48.000+0000',
    definitionId: '300xx00000000RhAAI',
    fieldsToNull: [],
    fullName: 'CollectionOperators_Demo',
    id: '301xx00000000nGAAQ',
    lastModifiedById: '005xx00000000tnAAA',
    lastModifiedDate: '2018-10-12T15:12:55.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'Collection Services Demonstration',
    metadata: {
        start: {
            locationX: 1000,
            locationY: 2000,
            connector: {
                targetReference: 'Build_Word'
            },
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        assignments: [
            {
                name: 'Add_to_Start',
                description: '',
                label: 'Add to Start',
                locationX: 630,
                locationY: 466,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'AddAtStart',
                        value: {
                            elementReference: 'Add_What_Text'
                        }
                    }
                ]
            },
            {
                name: 'Build_Word',
                description: '',
                label: 'Build Word',
                locationX: 223,
                locationY: 77,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterS'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterN'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterO'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterW'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterI'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterN'
                        }
                    },
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Add',
                        value: {
                            elementReference: 'LetterG'
                        }
                    }
                ]
            },
            {
                name: 'Pop_Element',
                description: '',
                label: 'Pop Element',
                locationX: 601,
                locationY: 260,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemovePosition',
                        value: {
                            numberValue: '1'
                        }
                    }
                ]
            },
            {
                name: 'Remove_After_First_assignment',
                description: '',
                label: 'Remove After First',
                locationX: 621,
                locationY: 577,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemoveAfterFirst',
                        value: {
                            elementReference: 'Remove_after_which_item'
                        }
                    }
                ]
            },
            {
                name: 'Remove_All_assignment',
                description: '',
                label: 'Remove All',
                locationX: 528,
                locationY: 683,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemoveAll',
                        value: {
                            elementReference: 'Remove_all_instances_of_which_item'
                        }
                    }
                ]
            },
            {
                name: 'Remove_Before_First_assignment',
                description: '',
                label: 'Remove Before First',
                locationX: 504,
                locationY: 781,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemoveBeforeFirst',
                        value: {
                            elementReference: 'Remove_everything_in_front_of_which_item'
                        }
                    }
                ]
            },
            {
                name: 'Remove_First_assignment',
                description: '',
                label: 'Remove First',
                locationX: 413,
                locationY: 886,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemoveFirst',
                        value: {
                            elementReference: 'Remove_the_first_instance_of_which_item'
                        }
                    }
                ]
            },
            {
                name: 'Remove_Position',
                description: '',
                label: 'Remove Position',
                locationX: 750,
                locationY: 393,
                connector: {
                    targetReference: 'Display'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'RemovePosition',
                        value: {
                            elementReference: 'Position_Number'
                        }
                    }
                ]
            },
            {
                name: 'Set_to_Empty',
                description: '',
                label: 'Set to Empty',
                locationX: 162,
                locationY: 277,
                connector: {
                    targetReference: 'Build_Word'
                },
                assignmentItems: [
                    {
                        assignToReference: 'LettersArray',
                        operator: 'Assign',
                        value: {
                            elementReference: 'emptyCollection'
                        }
                    }
                ]
            }
        ],
        decisions: [
            {
                name: 'BranchController',
                description: '',
                label: 'BranchController',
                locationX: 349,
                locationY: 269,
                rules: [
                    {
                        name: 'Pop_Element_outcome',
                        label: 'Pop Element',
                        connector: {
                            targetReference: 'Pop_Element'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'pop element'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Remove_Position_outcome',
                        label: 'Remove Position',
                        connector: {
                            targetReference: 'Get_Position'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'remove position'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Add_to_Start_outcome',
                        label: 'Add to Start',
                        connector: {
                            targetReference: 'Get_Position_0'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'add at start'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Remove_After_First_outcome',
                        label: 'Remove After First',
                        connector: {
                            targetReference: 'Remove_After_First'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'remove after first'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Reset',
                        label: 'Reset',
                        connector: {
                            targetReference: 'Set_to_Empty'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'reset'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Remove_All',
                        label: 'Remove All',
                        connector: {
                            targetReference: 'Remove_All_screen'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'remove all'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Remove_Before_First_outcome',
                        label: 'Remove Before First',
                        connector: {
                            targetReference: 'Remove_Before_First'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'remove before first'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Remove_First_outcome',
                        label: 'Remove First',
                        connector: {
                            targetReference: 'Remove_First'
                        },
                        conditions: [
                            {
                                leftValueReference: 'navTarget',
                                rightValue: {
                                    stringValue: 'remove first'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    }
                ],
                defaultConnectorLabel: '[Default Outcome]'
            }
        ],
        variables: [
            {
                name: 'curRepairProcedures',
                description: '',
                objectType: 'RepairProcedure__c',
                dataType: 'SObject',
                isCollection: true,
                isInput: true,
                isOutput: true,
                scale: 0
            },
            {
                name: 'emptyCollection',
                description: '',
                dataType: 'String',
                isCollection: true,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'LetterG',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'G'
                }
            },
            {
                name: 'LetterI',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'I'
                }
            },
            {
                name: 'LetterN',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'N'
                }
            },
            {
                name: 'LetterO',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'O'
                }
            },
            {
                name: 'LetterS',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'S'
                }
            },
            {
                name: 'LettersArray',
                description: '',
                dataType: 'String',
                isCollection: true,
                isInput: true,
                isOutput: true,
                scale: 0
            },
            {
                name: 'LetterW',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0,
                value: {
                    stringValue: 'W'
                }
            },
            {
                name: 'navTarget',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 0
            },
            {
                name: 'requestedPosition',
                description: '',
                dataType: 'Number',
                isCollection: false,
                isInput: true,
                isOutput: true,
                scale: 2
            }
        ],
        recordLookups: [
            {
                name: 'Get_Repair_Procedures',
                description: '',
                label: 'Get Repair Procedures',
                locationX: 690,
                locationY: 55,
                connector: {
                    targetReference: 'Build_Word'
                },
                object: 'RepairProcedure__c',
                outputReference: 'curRepairProcedures',
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'CreatedDate',
                        operator: 'GreaterThan',
                        value: {
                            dateTimeValue: '2018-05-01T07:00:00.000+0000'
                        }
                    }
                ],
                queriedFields: ['Id', 'Category__c', 'Frequency__c', 'Contact__c', 'RepairProcedureType__c']
            }
        ],
        screens: [
            {
                name: 'Display',
                description: '',
                label: 'Display',
                locationX: 1173,
                locationY: 398,
                connector: {
                    targetReference: 'BranchController'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText: '{!LettersArray}',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'DisplayText',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [
                            {
                                name: 'pathNameButtonTwo',
                                value: {
                                    stringValue: 'remove position'
                                }
                            },
                            {
                                name: 'labelButtonThree',
                                value: {
                                    stringValue: 'Add at Start'
                                }
                            },
                            {
                                name: 'pathNameButtonThree',
                                value: {
                                    stringValue: 'add at start'
                                }
                            },
                            {
                                name: 'labelButtonFour',
                                value: {
                                    stringValue: 'Remove Everything After'
                                }
                            },
                            {
                                name: 'pathNameButtonFour',
                                value: {
                                    stringValue: 'remove after first'
                                }
                            },
                            {
                                name: 'labelButtonTwo',
                                value: {
                                    stringValue: 'Remove at Position'
                                }
                            },
                            {
                                name: 'labelButtonOne',
                                value: {
                                    stringValue: 'Pop First Element'
                                }
                            },
                            {
                                name: 'pathNameButtonOne',
                                value: {
                                    stringValue: 'pop element'
                                }
                            }
                        ],
                        isRequired: true,
                        name: 'ButtonNav1',
                        outputParameters: [
                            {
                                name: 'selectedPathName',
                                assignToReference: 'navTarget'
                            }
                        ],
                        scale: 0,
                        fields: [],
                        inputsOnNextNavToAssocScrn: 'UseStoredValues',
                        storeOutputAutomatically: false,
                        extensionName: 'c:buttonNavFSC'
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [
                            {
                                name: 'lineCount',
                                value: {
                                    numberValue: '1'
                                }
                            }
                        ],
                        isRequired: true,
                        name: 'shim1',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        inputsOnNextNavToAssocScrn: 'UseStoredValues',
                        storeOutputAutomatically: false,
                        extensionName: 'c:MultiShim'
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [
                            {
                                name: 'labelButtonOne',
                                value: {
                                    stringValue: 'Remove All Matches'
                                }
                            },
                            {
                                name: 'pathNameButtonOne',
                                value: {
                                    stringValue: 'remove all'
                                }
                            },
                            {
                                name: 'labelButtonTwo',
                                value: {
                                    stringValue: 'Remove Before'
                                }
                            },
                            {
                                name: 'pathNameButtonTwo',
                                value: {
                                    stringValue: 'remove before first'
                                }
                            },
                            {
                                name: 'labelButtonThree',
                                value: {
                                    stringValue: 'Remove First'
                                }
                            },
                            {
                                name: 'pathNameButtonThree',
                                value: {
                                    stringValue: 'remove first'
                                }
                            }
                        ],
                        isRequired: true,
                        name: 'SecondSet',
                        outputParameters: [
                            {
                                name: 'selectedPathName',
                                assignToReference: 'navTarget'
                            }
                        ],
                        scale: 0,
                        fields: [],
                        inputsOnNextNavToAssocScrn: 'UseStoredValues',
                        storeOutputAutomatically: false,
                        extensionName: 'c:buttonNavFSC'
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'ComponentInstance',
                        helpText: '',
                        inputParameters: [
                            {
                                name: 'labelButtonOne',
                                value: {
                                    stringValue: 'Reset'
                                }
                            },
                            {
                                name: 'pathNameButtonOne',
                                value: {
                                    stringValue: 'reset'
                                }
                            }
                        ],
                        isRequired: true,
                        name: 'ResetButton',
                        outputParameters: [
                            {
                                name: 'selectedPathName',
                                assignToReference: 'navTarget'
                            }
                        ],
                        scale: 0,
                        fields: [],
                        inputsOnNextNavToAssocScrn: 'UseStoredValues',
                        storeOutputAutomatically: false,
                        extensionName: 'c:buttonNavFSC'
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: false,
                helpText: '',
                showFooter: false,
                showHeader: true
            },
            {
                name: 'Get_Position',
                description: '',
                label: 'Get Position',
                locationX: 565,
                locationY: 343,
                connector: {
                    targetReference: 'Remove_Position'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will remove one item from your set of items. At what position should we do this?</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'Number',
                        fieldText: 'Position Number (starts from 1)',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Position_Number',
                        outputParameters: [],
                        scale: 2,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Get_Position_0',
                description: '',
                label: 'Get Position',
                locationX: 494,
                locationY: 463,
                connector: {
                    targetReference: 'Add_to_Start'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will add one item to the start of your list. What would you like to add?</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition_0',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Add What Text?',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Add_What_Text',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Remove_After_First',
                description: '',
                label: 'Remove After First',
                locationX: 479,
                locationY: 571,
                connector: {
                    targetReference: 'Remove_After_First_assignment'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will remove everything after the first instance of this item:</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition_0_0',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Remove after which item?',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Remove_after_which_item',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Remove_All_screen',
                description: '',
                label: 'Remove All',
                locationX: 372,
                locationY: 686,
                connector: {
                    targetReference: 'Remove_All_assignment'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will remove </B><B><U>each instance</U></B><B> of the specified item:</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition_0_0_0',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Remove all instances of which item?',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Remove_all_instances_of_which_item',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Remove_Before_First',
                description: '',
                label: 'Remove Before First',
                locationX: 313,
                locationY: 782,
                connector: {
                    targetReference: 'Remove_Before_First_assignment'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will remove </B><B><U>everything before</U></B><B> the specified item:</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition_0_0_0_0',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Remove everything in front of which item?',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Remove_everything_in_front_of_which_item',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Remove_First',
                description: '',
                label: 'Remove First',
                locationX: 218,
                locationY: 886,
                connector: {
                    targetReference: 'Remove_First_assignment'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:16px" COLOR="#000000" LETTERSPACING="0" KERNING="0"><B>We will remove </B><B><U>the first instance of</U></B><B> the specified item:</B></FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'WhatsthePosition_0_0_0_0_0',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Remove the first instance of which item?',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Remove_the_first_instance_of_which_item',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: true,
                allowPause: true,
                helpText: '',
                showFooter: true,
                showHeader: true
            }
        ],
        choices: [
            {
                name: 'Choice1',
                description: '',
                dataType: 'String',
                choiceText: 'Choice1',
                userInput: {
                    isRequired: false,
                    promptText: null
                }
            }
        ],
        description: 'PM demo org flow - Extracted on Oct 3rd, 2018',
        interviewLabel: 'CollectionOperators Demo {!$Flow.CurrentDateTime}',
        isOverridable: false,
        isTemplate: false,
        label: 'Collection Services Demonstration',
        processMetadataValues: [
            {
                name: 'BuilderType',
                value: {
                    stringValue: 'LightningFlowBuilder'
                }
            },
            {
                name: 'CanvasMode',
                value: {
                    stringValue: 'FREE_FORM_CANVAS'
                }
            }
        ],
        processType: 'Flow',
        runInMode: null,
        status: 'Draft',
        apiVersion: 50,
        environments: ['Default']
    },
    processType: 'Flow',
    status: 'Draft',
    versionNumber: 4
};
