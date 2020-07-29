// @ts-nocheck
export const flowLegalNameChange = {
    createdById: '005T1000000Dm4KIAS',
    createdDate: '2018-10-22T12:09:22.000+0000',
    definitionId: '300T10000004FJAIA2',
    fieldsToNull: [],
    fullName: 'bdufourd01__Legal_Name_Change',
    id: '301T100000000joIAA',
    lastModifiedById: '005T1000000Dm4KIAS',
    lastModifiedDate: '2018-10-22T12:09:27.000+0000',
    manageableState: 'unmanaged',
    masterLabel: 'Legal Name Change',
    metadata: {
        start: {
            locationX: 1000,
            locationY: 2000,
            connector: {
                targetReference: 'Check_Object_Type'
            },
            doesRequireRecordChangedToMeetCriteria: false,
            filters: []
        },
        actionCalls: [
            {
                name: 'Update_Feed',
                description: '',
                label: 'Update Feed',
                locationX: 882,
                locationY: 414,
                connector: {
                    targetReference: 'Final_Screen'
                },
                actionType: 'chatterPost',
                actionName: 'chatterPost',
                inputParameters: [
                    {
                        name: 'subjectNameOrId',
                        value: {
                            elementReference: 'recordId'
                        }
                    },
                    {
                        name: 'text',
                        value: {
                            elementReference: 'FeedUpdate'
                        }
                    }
                ],
                outputParameters: [
                    {
                        name: 'feedItemId',
                        assignToReference: 'vFeedItemID'
                    }
                ],
                storeOutputAutomatically: false
            }
        ],
        assignments: [
            {
                name: 'Assign_recordId_to_AccountId',
                description: '',
                label: 'Assign recordId to AccountId',
                locationX: 281,
                locationY: 625,
                connector: {
                    targetReference: 'Initial_Info_Screen'
                },
                assignmentItems: [
                    {
                        assignToReference: 'recordId',
                        operator: 'Assign',
                        value: {
                            elementReference: 'vCaseAccountId'
                        }
                    }
                ]
            },
            {
                name: 'Assign_recordId_to_Contactid',
                description: '',
                label: 'Assign recordId to Contactid',
                locationX: 283,
                locationY: 502,
                connector: {
                    targetReference: 'Initial_Info_Screen'
                },
                assignmentItems: [
                    {
                        assignToReference: 'recordId',
                        operator: 'Assign',
                        value: {
                            elementReference: 'vCaseContactId'
                        }
                    }
                ]
            }
        ],
        decisions: [
            {
                name: 'Check_if_Account_is_Person_Account',
                description: '',
                label: 'Check if Account is Person Account',
                locationX: 298,
                locationY: 73,
                defaultConnector: {
                    targetReference: 'Unsupported_Object_Type_Message'
                },
                defaultConnectorLabel: 'Company',
                rules: [
                    {
                        name: 'Account_is_Person_Account',
                        label: 'Account is Person Account',
                        connector: {
                            targetReference: 'Initial_Info_Screen'
                        },
                        conditions: [
                            {
                                leftValueReference: 'vIsPersonAccount',
                                rightValue: {
                                    stringValue: 'true'
                                },
                                operator: 'EqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    }
                ]
            },
            {
                name: 'Check_if_Case_Contact_is_Person_Account',
                description: '',
                label: 'Check if Case Contact is Person Account',
                locationX: 90,
                locationY: 501,
                defaultConnector: {
                    targetReference: 'Lookup_Person_Account_Information'
                },
                defaultConnectorLabel: 'Is Person Account',
                rules: [
                    {
                        name: 'Is_Contact',
                        label: 'Is Contact',
                        connector: {
                            targetReference: 'Assign_recordId_to_Contactid'
                        },
                        conditions: [
                            {
                                leftValueReference: 'vIsCaseContactPersonAccount',
                                rightValue: {
                                    stringValue: 'true'
                                },
                                operator: 'NotEqualTo'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    }
                ]
            },
            {
                name: 'Check_Object_Type',
                description: '',
                label: 'Check Object Type',
                locationX: 88,
                locationY: 182,
                defaultConnector: {
                    targetReference: 'Unsupported_Object_Type_Message'
                },
                defaultConnectorLabel: 'Unsupported Object',
                rules: [
                    {
                        name: 'Account',
                        label: 'Account',
                        connector: {
                            targetReference: 'Account_Lookup'
                        },
                        conditions: [
                            {
                                leftValueReference: 'recordId',
                                rightValue: {
                                    stringValue: '001'
                                },
                                operator: 'StartsWith'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Contact',
                        label: 'Contact',
                        connector: {
                            targetReference: 'Contact_Lookup'
                        },
                        conditions: [
                            {
                                leftValueReference: 'recordId',
                                rightValue: {
                                    stringValue: '003'
                                },
                                operator: 'StartsWith'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'Case',
                        label: 'Case',
                        connector: {
                            targetReference: 'Case_Lookup'
                        },
                        conditions: [
                            {
                                leftValueReference: 'recordId',
                                rightValue: {
                                    stringValue: '500'
                                },
                                operator: 'StartsWith'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    }
                ]
            },
            {
                name: 'Customer_Info_Object_Type_Decision',
                description: '',
                label: 'Customer Info Object Type Decision',
                locationX: 891,
                locationY: 194,
                rules: [
                    {
                        name: 'AccountUpdate',
                        label: 'AccountUpdate',
                        connector: {
                            targetReference: 'Update_Person_Account'
                        },
                        conditions: [
                            {
                                leftValueReference: 'recordId',
                                rightValue: {
                                    stringValue: '001'
                                },
                                operator: 'StartsWith'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    },
                    {
                        name: 'ContactUpdate',
                        label: 'ContactUpdate',
                        connector: {
                            targetReference: 'Update_Contact'
                        },
                        conditions: [
                            {
                                leftValueReference: 'recordId',
                                rightValue: {
                                    stringValue: '003'
                                },
                                operator: 'StartsWith'
                            }
                        ],
                        conditionLogic: 'and',
                        doesRequireRecordChangedToMeetCriteria: false
                    }
                ],
                defaultConnectorLabel: '[Default Outcome]'
            }
        ],
        formulas: [
            {
                name: 'FeedUpdate',
                description: '',
                expression:
                    '"The name on this Contact or Person Account record was updated using a Flow. The original name was " & {!vFormerSalutation} & " " & {!vFirstName} & " " & {!vFormerLastName} & ". The new name is " & {!New_Salutation} & " " & {!New_First_Name} & " " & {!New_Last_Name}',
                dataType: 'String',
                scale: 0
            }
        ],
        variables: [
            {
                name: 'recordId',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: true,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vCaseAccountId',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vCaseContactId',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vFeedItemID',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vFirstName',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vFormerLastName',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vFormerSalutation',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vIsCaseContactPersonAccount',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vIsPersonAccount',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vMailingCity',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vMailingCountry',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vMailingPostal',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vMailingState',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vMailingStreet',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vRelatedRecordId',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            },
            {
                name: 'vUploadedFiles',
                description: '',
                dataType: 'String',
                isCollection: false,
                isInput: false,
                isOutput: false,
                scale: 0
            }
        ],
        recordLookups: [
            {
                name: 'Account_Lookup',
                description: '',
                label: 'Account Lookup',
                locationX: 297,
                locationY: 183,
                connector: {
                    targetReference: 'Check_if_Account_is_Person_Account'
                },
                object: 'Account',
                outputAssignments: [
                    {
                        field: 'FirstName',
                        assignToReference: 'vFirstName'
                    },
                    {
                        field: 'IsPersonAccount',
                        assignToReference: 'vIsPersonAccount'
                    },
                    {
                        field: 'LastName',
                        assignToReference: 'vFormerLastName'
                    },
                    {
                        field: 'PersonMailingCity',
                        assignToReference: 'vMailingCity'
                    },
                    {
                        field: 'PersonMailingCountry',
                        assignToReference: 'vMailingCountry'
                    },
                    {
                        field: 'PersonMailingPostalCode',
                        assignToReference: 'vMailingPostal'
                    },
                    {
                        field: 'PersonMailingState',
                        assignToReference: 'vMailingState'
                    },
                    {
                        field: 'PersonMailingStreet',
                        assignToReference: 'vMailingStreet'
                    },
                    {
                        field: 'Salutation',
                        assignToReference: 'vFormerSalutation'
                    }
                ],
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'recordId'
                        }
                    }
                ],
                queriedFields: []
            },
            {
                name: 'Case_Lookup',
                description: '',
                label: 'Case Lookup',
                locationX: 89,
                locationY: 305,
                connector: {
                    targetReference: 'Find_Contact_Info_for_Case'
                },
                object: 'Case',
                outputAssignments: [
                    {
                        field: 'AccountId',
                        assignToReference: 'vCaseAccountId'
                    },
                    {
                        field: 'ContactId',
                        assignToReference: 'vCaseContactId'
                    }
                ],
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'recordId'
                        }
                    }
                ],
                queriedFields: []
            },
            {
                name: 'Contact_Lookup',
                description: '',
                label: 'Contact Lookup',
                locationX: 294,
                locationY: 299,
                connector: {
                    targetReference: 'Initial_Info_Screen'
                },
                object: 'Contact',
                outputAssignments: [
                    {
                        field: 'FirstName',
                        assignToReference: 'vFirstName'
                    },
                    {
                        field: 'LastName',
                        assignToReference: 'vFormerLastName'
                    },
                    {
                        field: 'MailingCity',
                        assignToReference: 'vMailingCity'
                    },
                    {
                        field: 'MailingCountry',
                        assignToReference: 'vMailingCountry'
                    },
                    {
                        field: 'MailingPostalCode',
                        assignToReference: 'vMailingPostal'
                    },
                    {
                        field: 'MailingState',
                        assignToReference: 'vMailingState'
                    },
                    {
                        field: 'MailingStreet',
                        assignToReference: 'vMailingStreet'
                    },
                    {
                        field: 'Salutation',
                        assignToReference: 'vFormerSalutation'
                    }
                ],
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'recordId'
                        }
                    }
                ],
                queriedFields: []
            },
            {
                name: 'Find_Contact_Info_for_Case',
                description: '',
                label: 'Find Contact Info for Case',
                locationX: 90,
                locationY: 403,
                connector: {
                    targetReference: 'Check_if_Case_Contact_is_Person_Account'
                },
                object: 'Contact',
                outputAssignments: [
                    {
                        field: 'FirstName',
                        assignToReference: 'vFirstName'
                    },
                    {
                        field: 'IsPersonAccount',
                        assignToReference: 'vIsCaseContactPersonAccount'
                    },
                    {
                        field: 'LastName',
                        assignToReference: 'vFormerLastName'
                    },
                    {
                        field: 'MailingCity',
                        assignToReference: 'vMailingCity'
                    },
                    {
                        field: 'MailingCountry',
                        assignToReference: 'vMailingCountry'
                    },
                    {
                        field: 'MailingPostalCode',
                        assignToReference: 'vMailingPostal'
                    },
                    {
                        field: 'MailingState',
                        assignToReference: 'vMailingState'
                    },
                    {
                        field: 'MailingStreet',
                        assignToReference: 'vMailingStreet'
                    },
                    {
                        field: 'Salutation',
                        assignToReference: 'vFormerSalutation'
                    }
                ],
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'vCaseContactId'
                        }
                    }
                ],
                queriedFields: []
            },
            {
                name: 'Lookup_Person_Account_Information',
                description: '',
                label: 'Lookup Person Account Information',
                locationX: 93,
                locationY: 621,
                connector: {
                    targetReference: 'Assign_recordId_to_AccountId'
                },
                object: 'Account',
                outputAssignments: [
                    {
                        field: 'FirstName',
                        assignToReference: 'vFirstName'
                    },
                    {
                        field: 'LastName',
                        assignToReference: 'vFormerLastName'
                    },
                    {
                        field: 'PersonMailingCity',
                        assignToReference: 'vMailingCity'
                    },
                    {
                        field: 'PersonMailingCountry',
                        assignToReference: 'vMailingCountry'
                    },
                    {
                        field: 'PersonMailingPostalCode',
                        assignToReference: 'vMailingPostal'
                    },
                    {
                        field: 'PersonMailingState',
                        assignToReference: 'vMailingState'
                    },
                    {
                        field: 'PersonMailingStreet',
                        assignToReference: 'vMailingStreet'
                    },
                    {
                        field: 'Salutation',
                        assignToReference: 'vFormerSalutation'
                    }
                ],
                assignNullValuesIfNoRecordsFound: false,
                filterLogic: 'and',
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'vCaseAccountId'
                        }
                    }
                ],
                queriedFields: []
            }
        ],
        recordUpdates: [
            {
                name: 'Update_Contact',
                description: '',
                label: 'Update Contact',
                locationX: 979,
                locationY: 317,
                connector: {
                    targetReference: 'Update_Feed'
                },
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'recordId'
                        }
                    }
                ],
                filterLogic: 'and',
                object: 'Contact',
                inputAssignments: [
                    {
                        field: 'FirstName',
                        value: {
                            elementReference: 'New_First_Name'
                        }
                    },
                    {
                        field: 'LastName',
                        value: {
                            elementReference: 'New_Last_Name'
                        }
                    },
                    {
                        field: 'Salutation',
                        value: {
                            elementReference: 'New_Salutation'
                        }
                    }
                ]
            },
            {
                name: 'Update_Person_Account',
                description: '',
                label: 'Update Person Account',
                locationX: 783,
                locationY: 316,
                connector: {
                    targetReference: 'Update_Feed'
                },
                filters: [
                    {
                        field: 'Id',
                        operator: 'EqualTo',
                        value: {
                            elementReference: 'recordId'
                        }
                    }
                ],
                filterLogic: 'and',
                object: 'Account',
                inputAssignments: [
                    {
                        field: 'FirstName',
                        value: {
                            elementReference: 'New_First_Name'
                        }
                    },
                    {
                        field: 'LastName',
                        value: {
                            elementReference: 'New_Last_Name'
                        }
                    },
                    {
                        field: 'Salutation',
                        value: {
                            elementReference: 'New_Salutation'
                        }
                    }
                ]
            }
        ],
        screens: [
            {
                name: 'Confirmation_Screen',
                description: '',
                label: 'Confirmation Screen',
                locationX: 841,
                locationY: 77,
                connector: {
                    targetReference: 'Customer_Info_Object_Type_Decision'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">You have requested that the name on the account will be changed to the following:</FONT></DIV><DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">-</FONT></DIV><DIV ALIGN="LEFT"><FONT FACE="Courier New" STYLE="font-size:12px" COLOR="#FF0000" LETTERSPACING="0" KERNING="0"><B>{!New_First_Name} {!New_Last_Name}</B></FONT></DIV><DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">-</FONT></DIV><DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">If this is not correct press Previous and make the changes.</FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'veacsd',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: false,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Document_Upload_Screen',
                description: '',
                label: 'Document Upload Screen',
                locationX: 694,
                locationY: 70,
                connector: {
                    targetReference: 'Confirmation_Screen'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            'Please upload the following files one by one:\n- Copy or picture of Social Security Card with the new name\n- Copy or picture of utility bill showing the new name\nThe following file extensions are allowed: .JPG and .PNG',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'terdsx',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        fieldText: '',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Empty00',
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
                                name: 'label',
                                value: {
                                    stringValue: 'Upload Files'
                                }
                            },
                            {
                                name: 'recordId',
                                value: {
                                    elementReference: 'recordId'
                                }
                            },
                            {
                                name: 'accept',
                                value: {
                                    stringValue: '.jpg, .png, .pdf'
                                }
                            }
                        ],
                        isRequired: true,
                        name: 'DocUploader',
                        outputParameters: [
                            {
                                name: 'recordId',
                                assignToReference: 'vRelatedRecordId'
                            }
                        ],
                        scale: 0,
                        fields: [],
                        extensionName: 'forceContent:fileUpload'
                    }
                ],
                allowBack: true,
                allowFinish: false,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Final_Screen',
                description: '',
                label: 'Final Screen',
                locationX: 880,
                locationY: 514,
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            'Thank you for contacting us and letting us know your new name. This will take 24-48 hours to process. We will contact you if there are any questions.',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'gfwds',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: false,
                allowFinish: true,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'General_Info_Verification',
                description: '',
                label: 'General Info Verification',
                locationX: 574,
                locationY: 311,
                connector: {
                    targetReference: 'New_Name_Information_Input'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText: 'Please provide the following information for verification.',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'vascd',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Social Security Number',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Social_Security_Number',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            stringValue: '123-45-6789'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Street',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Street',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vMailingStreet'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'City',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'City',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vMailingCity'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'State',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'State',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vMailingState'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Postal Code',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Postal_Code',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vMailingPostal'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Country',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Country',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vMailingCountry'
                        }
                    },
                    {
                        choiceReferences: [],
                        fieldText: 'Please provide the former name that this financial institution knows you under.',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'FormerNameText',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Salutation',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Former_Salutation',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vFormerSalutation'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'First Name',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Former_First_Name',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vFirstName'
                        }
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Last Name',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'Former_Last_Name',
                        outputParameters: [],
                        scale: 0,
                        fields: [],
                        defaultValue: {
                            elementReference: 'vFormerLastName'
                        }
                    }
                ],
                allowBack: true,
                allowFinish: false,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Initial_Info_Screen',
                description: '',
                label: 'Initial Info Screen',
                locationX: 508,
                locationY: 183,
                connector: {
                    targetReference: 'General_Info_Verification'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Before we get started {!vFirstName} I have to inform you that in order for us to finalize the process of changing the name on your accounts you will need to provide the following information either electronically or in person at a branch or office.</FONT></DIV><DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0"></FONT></DIV><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Social Security Card showing new name.</FONT></LI></TEXTFORMAT><TEXTFORMAT LEADING="2"><LI><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Eletrical or Gas Bill showing new name</FONT></LI></TEXTFORMAT>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'InitialMessage',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: false,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'New_Name_Information_Input',
                description: '',
                label: 'New Name Information Input',
                locationX: 704,
                locationY: 178,
                connector: {
                    targetReference: 'Document_Upload_Screen'
                },
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText:
                            '<DIV ALIGN="LEFT"><FONT FACE="Arial" STYLE="font-size:12px" COLOR="#000000" LETTERSPACING="0" KERNING="0">Please provide your <U>new</U> First Name, Middle Initial and Last Name. Please make sure to spell it out exactly as it is on your Social Security Card.</FONT></DIV>',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'vrfcs',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: ['Salutation'],
                        dataType: 'String',
                        fieldText: 'Salutation',
                        fieldType: 'DropdownBox',
                        helpText: '',
                        inputParameters: [],
                        isRequired: true,
                        name: 'New_Salutation',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'First Name',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: true,
                        name: 'New_First_Name',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    },
                    {
                        choiceReferences: [],
                        dataType: 'String',
                        fieldText: 'Last Name',
                        fieldType: 'InputField',
                        helpText: '',
                        inputParameters: [],
                        isRequired: true,
                        name: 'New_Last_Name',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: true,
                allowFinish: false,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            },
            {
                name: 'Unsupported_Object_Type_Message',
                description: '',
                label: 'Unsupported Object Type Message',
                locationX: 89,
                locationY: 710,
                pausedText: '',
                fields: [
                    {
                        choiceReferences: [],
                        fieldText: 'This is not a supported object type.',
                        fieldType: 'DisplayText',
                        helpText: '',
                        inputParameters: [],
                        isRequired: false,
                        name: 'UnsupportedObjectTypeDisplay',
                        outputParameters: [],
                        scale: 0,
                        fields: []
                    }
                ],
                allowBack: false,
                allowFinish: true,
                allowPause: false,
                helpText: '',
                showFooter: true,
                showHeader: true
            }
        ],
        dynamicChoiceSets: [
            {
                name: 'Salutation',
                description: '',
                limit: '5',
                valueField: null,
                dataType: 'Picklist',
                picklistField: 'Salutation',
                picklistObject: 'Contact'
            }
        ],
        description:
            'This Flow prompts for and changes the name of the Contact or Person Account, it also requires upload of documentation (pdf, jpg, png) and it updates the Feed for the record after the change. Can be launched from Contact, Person Account or Case records.',
        interviewLabel: 'Legal Name Change {!$Flow.CurrentDateTime}',
        isTemplate: false,
        label: 'Legal Name Change',
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
        status: 'Active',
        apiVersion: 49
    },
    processType: 'Flow',
    status: 'Active',
    versionNumber: 1
};
