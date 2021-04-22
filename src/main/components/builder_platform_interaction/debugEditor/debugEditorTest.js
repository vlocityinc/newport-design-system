/* eslint-disable */

/**
 * This is unit testing class using the Javascript testing framework
 * Chapter 6 for aura testing: https://mohan-chinnappan-n.github.io/books/lx/docs/aura_oss.pdf
 *
 * How to run the (in web browser- you may be prompted to login)
 * - Test suite: localhost:6109/builder_platform_interaction/debugEditor.cmp?aura.mode=jstest
 * - Single test: localhost:6109/builder_platform_interaction/debugEditor.cmp?aura.mode=jstest&test=testName
 */
({
    mocks: [
        {
            type: 'ACTION',
            descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
            stubs: [
                {
                    method: { name: 'getFlowInputOutputVariables' },
                    answers: [
                        {
                            value: [
                                {
                                    variables: []
                                }
                            ]
                        }
                    ]
                },
                {
                    method: { name: 'debugRunAsValidation' },
                    answers: [
                        {
                            value: {
                                showIsDebugAsUserAllowed: true,
                                showIsDebugAsUserAllowedInNonPrd: true
                            }
                        }
                    ]
                }
            ]
        }
    ],

    browsers: ['GOOGLECHROME', 'FIREFOX', 'SAFARI'],

    assertObjectEquals: function (obj1, obj2, assertionMessage) {
        return $A.test.assertEquals(JSON.stringify(obj1), JSON.stringify(obj2), assertionMessage);
    },

    /** Test Cases **/
    testDefaultOptions: {
        test: function (cmp) {
            $A.test.assertFalse(
                cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
                'DebugAsUser should not be checked by default'
            );
            $A.test.assertFalse(
                cmp.find('isEnableRollbackModeBox').get('v.checked'),
                'EnableRollbackMode should not be checked by default'
            );
            $A.test.assertTrue(cmp.find('isDebugWaitsBox').get('v.checked'), 'DebugWaits should be checked by default');
            this.assertObjectEquals(
                cmp.getDebugInput(),
                {
                    inputs: [],
                    runAs: false,
                    debugAsUserId: null,
                    enableRollback: false,
                    debugWaits: true,
                    ignoreEntryCriteria: false,
                    dmlType: '',
                    scheduledPathSelection: ''
                },
                "Default getDebugInput doesn't work correctly"
            );
            $A.test.assertFalse(cmp.get('v.hasInputs'), 'hasInputs is not set properly');
            $A.test.assertUndefinedOrNull(
                cmp.find('isIgnoreEntryCriteriaCB'),
                'Should not show ignore entry criteria checkbox'
            );
            $A.test.assertUndefinedOrNull(
                cmp.find('scheduledPathComboBox'),
                'Scheduled Path ComboBox should not exist'
            );
        }
    },

    testDebugAsUserHiddenInScheduledFlow: {
        attributes: {
            processType: 'AutoLaunchedFlow',
            triggerType: 'Scheduled'
        },
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'debugRunAsValidation' },
                        answers: [
                            {
                                value: {
                                    showIsDebugAsUserAllowed: true,
                                    showIsDebugAsUserAllowedInNonPrd: true
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertUndefinedOrNull(cmp.find('isDebugAsUserAllowedBox'), 'Should not show checkbox');
                }
            );
        }
    },

    testToggleCheckboxes: {
        test: function (cmp) {
            cmp.find('isDebugAsUserAllowedBox').set('v.checked', true);
            cmp.find('isEnableRollbackModeBox').set('v.checked', true);
            cmp.find('isDebugWaitsBox').set('v.checked', false);
            this.assertObjectEquals(
                cmp.getDebugInput(),
                {
                    inputs: [],
                    runAs: true,
                    debugAsUserId: null,
                    enableRollback: true,
                    debugWaits: false,
                    ignoreEntryCriteria: false,
                    dmlType: '',
                    scheduledPathSelection: ''
                },
                "getDebugInput doesn't reflect value changes of checkboxes correctly"
            );
        }
    },

    testDebugAsUserHelp: {
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertEquals(
                        $A.get('$Label.FlowDebug.ShowDebugAsUserHelp'),
                        cmp.get('v.runAsHelptext'),
                        'Cancel button was not created correctly'
                    );
                }
            );
        }
    },

    testDebugAsUserDisabledHelp: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'debugRunAsValidation' },
                        answers: [
                            {
                                value: {
                                    showIsDebugAsUserAllowed: false,
                                    showIsDebugAsUserAllowedInNonPrd: true
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertEquals(
                        $A.get('$Label.FlowDebug.ShowDebugAsUserDisabledHelp'),
                        cmp.get('v.runAsHelptext'),
                        'Helptext for debugRunAs is not created correctly'
                    );
                }
            );
        }
    },

    testDebugAsUserDisabledHelpInPrdOrg: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'debugRunAsValidation' },
                        answers: [
                            {
                                value: {
                                    showIsDebugAsUserAllowed: false,
                                    showIsDebugAsUserAllowedInNonPrd: false
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertEquals(
                        $A.get('$Label.FlowDebug.ShowDebugAsUserDisabledHelpInPrdOrg'),
                        cmp.get('v.runAsHelptext'),
                        'Helptext for debugRunAs is not created correctly'
                    );
                }
            );
        }
    },

    testInputVariables: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test1-Text'
                                            },
                                            {
                                                dataType: 'Number',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test2-Number'
                                            },
                                            {
                                                dataType: 'Currency',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test3-Currency'
                                            },
                                            {
                                                dataType: 'Boolean',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test4-Boolean'
                                            },
                                            {
                                                dataType: 'Date',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test5-Date'
                                            },
                                            {
                                                dataType: 'DateTime',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test6-DateTime'
                                            },
                                            {
                                                dataType: 'Picklist',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test7-Picklist'
                                            },
                                            {
                                                dataType: 'Multipicklist',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test8-Multipicklist'
                                            },
                                            {
                                                dataType: 'SObject',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'test9-SObject',
                                                objectType: 'Account'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 10, "Input variables don't show up");
                    // inputs[0] is aura$expression by default, so inputs.length = 10 means 9 input variables created correctly
                    $A.test.assertTrue(cmp.get('v.hasInputs'), 'hasInputs should return true');
                    $A.test.assertNotNull(cmp.find('inputValuesInfo'), 'Text for input variables does not show up.');
                    $A.test.assertUndefined(cmp.find('inputValuesNone'), 'Text for no input variables show up.');
                }
            );
        }
    },

    testOutputOnlyVariable: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: false,
                                                isInput: false,
                                                isOutput: true,
                                                name: 'output-only'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 1, 'Output-only variable should not show up');
                    // inputs[0] is aura$expression by default, inputs.length = 1 means no output-only variable cmp created
                    $A.test.assertFalse(cmp.get('v.hasInputs'), 'hasInputs should return false for only output vars');
                    $A.test.assertUndefined(cmp.find('inputValuesInfo'), 'Text for input variables showes up.');
                    $A.test.assertNotNull(cmp.find('inputValuesNone'), 'Text for no input variables does not show up.');
                }
            );
        }
    },

    testDollarRecordInputVariable: {
        attributes: {
            processType: 'AutoLaunchedFlow',
            triggerType: 'RecordAfterSave',
            isCreateOrUpdate: false
        },
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getDollarRecordInputVariable' },
                        answers: [
                            {
                                value: {
                                    variables: [
                                        {
                                            dataType: 'SObject',
                                            isCollection: false,
                                            isInput: true,
                                            isOutput: false,
                                            name: '$Record',
                                            objectType: 'Account'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 2, 'Should only have one input variable for $Record');
                    // inputs[0] is aura$expression by default, inputs.length = 2 means only one input value
                    $A.test.assertTrue(cmp.get('v.hasInputs'), 'hasInputs should return true DML triggers');

                    //The DML trigger specific debug text should appear
                    $A.test.assertUndefined(
                        cmp.find('inputValuesInfo'),
                        'Text for non $Record input variables shows up.'
                    );
                    $A.test.assertNotNull(
                        cmp.find('inputValuesRecordTrigger'),
                        'Text for $Record variables does not show up.'
                    );

                    //Create / Update radio should not show up
                    $A.test.assertUndefined(cmp.find('debugCreateOrUpdate'), 'Create or Update radio shows up');
                }
            );
        }
    },

    testApexVariable: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'Apex',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'Apex-defined var',
                                                objectType: 'test_Greeting'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 1, 'Apex-defined variable should not show up');
                    // inputs[0] is aura$expression by default, inputs.length = 1 means no apex-defined variable cmp created
                    $A.test.assertFalse(cmp.get('v.hasInputs'), 'hasInputs should return false for apex input vars');
                    $A.test.assertUndefined(cmp.find('inputValuesInfo'), 'Text for input variables showes up.');
                    $A.test.assertNotNull(cmp.find('inputValuesNone'), 'Text for no input variables does not show up.');
                }
            );
        }
    },

    testCollectionVariable: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: true,
                                                isInput: true,
                                                isOutput: true,
                                                name: 'collection_var'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 1, 'collection variable should not show up');
                    // inputs[0] is aura$expression by default, inputs.length = 1 means no collection variable cmp created
                    $A.test.assertFalse(
                        cmp.get('v.hasInputs'),
                        'hasInputs should return false for collection input vars'
                    );
                    $A.test.assertUndefined(cmp.find('inputValuesInfo'), 'Text for input variables showes up.');
                    $A.test.assertNotNull(cmp.find('inputValuesNone'), 'Text for no input variables does not show up.');
                }
            );
        }
    },

    testVariableChange: {
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'testVar'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var testString = 'Test inputs';
                    var testVar = cmp.find('flowInput').get('v.body')[1];
                    $A.test.assertUndefinedOrNull(testVar.set('v.value'), 'Input value should be empty initially');
                    testVar.set('v.value', testString);
                    this.assertObjectEquals(
                        cmp.getDebugInput()['inputs'],
                        [
                            {
                                name: 'testVar',
                                type: 'String',
                                value: testString
                            }
                        ],
                        "Input Variables' value change are not recorded correctly in debugInputObject when click run."
                    );
                }
            );
        }
    },

    testPrepopulateVariable: {
        attributes: {
            rerun: true
        },
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'previousInput',
                                                value: 'previous input value' //the controller doesn't actually return this. This is the mocked previousInputs var
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 2, 'One input variable only');
                    $A.test.assertEquals(inputs[1].get('v.value'), 'previous input value');
                    // inputs[0] is aura$expression by default, inputs.length = 2 means there is 1 input variable
                    $A.test.assertTrue(cmp.get('v.hasInputs'), 'hasInputs should return true');
                }
            );
        }
    },

    /**
     * Test that the debug again modal renders successfully when there is a collection variable
     * Added another input variable for control testing
     */
    testDebugAgainCollectionVariable: {
        attributes: {
            rerun: true
        },
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getFlowInputOutputVariables' },
                        answers: [
                            {
                                value: [
                                    {
                                        variables: [
                                            {
                                                dataType: 'String',
                                                isCollection: true,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'previousInput'
                                            },
                                            {
                                                dataType: 'SObject',
                                                isCollection: false,
                                                isInput: true,
                                                isOutput: false,
                                                name: 'some_account',
                                                objectType: 'Account'
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    var inputs = cmp.find('flowInput').get('v.body');
                    $A.test.assertTrue(inputs.length === 2, 'Collection variable should not show up');
                    // inputs[0] is aura$expression by default, inputs.length = 1 means there are no input variables
                    $A.test.assertTrue(cmp.get('v.hasInputs'), 'hasInputs should return true');
                }
            );
        }
    },

    /**
     * Test that the checkbox configuration is correct for DML triggers:
     * Debug as user enabled
     * Run flow in rollback mode checked and disabled
     * Pause elements does not appear
     * Skip entry criteria checked and disabled for now
     */
    testDMLTriggerCheckboxes: {
        attributes: {
            processType: 'AutoLaunchedFlow',
            triggerType: 'RecordAfterSave',
            isCreateOrUpdate: false,
            ignoreEntryCriteria: true
        },
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertFalse(
                        cmp.find('isDebugAsUserAllowedBox').get('v.checked'),
                        'DebugAsUser should not be checked by default'
                    );
                    $A.test.assertTrue(
                        cmp.find('isIgnoreEntryCriteriaCB').get('v.checked'),
                        'IgnoreEntryCriteria should be checked'
                    );
                    $A.test.assertFalse(
                        cmp.find('isIgnoreEntryCriteriaCB').get('v.disabled'),
                        'IgnoreEntryCriteria should be disabled'
                    );
                    $A.test.assertTrue(
                        cmp.find('isEnableRollbackModeBox').get('v.checked'),
                        'EnableRollback should be checked'
                    );
                    $A.test.assertTrue(
                        cmp.find('isEnableRollbackModeBox').get('v.disabled'),
                        'EnableRollback should be disabled'
                    );
                    $A.test.assertUndefinedOrNull(
                        cmp.find('isDebugWaitsBox'),
                        'Should not show the debug waits checkbox'
                    );
                }
            );
        }
    },

    testCreateOrUpdateRadio: {
        attributes: {
            processType: 'AutoLaunchedFlow',
            triggerType: 'RecordAfterSave',
            isCreateOrUpdate: true,
            dollarRecordName: 'Account'
        },
        mocks: [
            {
                type: 'ACTION',
                descriptor: 'serviceComponent://ui.interaction.builder.components.controllers.FlowBuilderController',
                stubs: [
                    {
                        method: { name: 'getDollarRecordInputVariable' },
                        answers: [
                            {
                                value: {
                                    variables: [
                                        {
                                            dataType: 'SObject',
                                            isCollection: false,
                                            isInput: true,
                                            isOutput: false,
                                            name: '$Record',
                                            objectType: 'Account'
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                ]
            }
        ],
        test: function (cmp) {
            $A.test.addWaitFor(
                false,
                function () {
                    return $A.test.isActionPending('doInit');
                },
                function (cmp) {
                    $A.test.assertNotNull(cmp.find('debugCreateOrUpdate'), 'Create or Update Radio does not show up');
                }
            );
        }
    },

    testScheduledPathSelection: {
        attributes: {
            scheduledPathsList: [
                {
                    label: 'Sample Scheduled Path',
                    value: 'Sample_Scheduled_Path'
                }
            ],
            showScheduledPathComboBox: true
        },
        test: function (cmp) {
            $A.test.assertNotNull(cmp.find('scheduledPathComboBox'), 'Scheduled Path ComboBox does not exist');
            // Default value of scheduledPathSelection should be 'Run Immediately'
            $A.test.assertEquals(
                $A.get('$Label.FlowBuilderStartEditor.immediateTimeTriggerLabel'),
                cmp.getDebugInput().scheduledPathSelection,
                "scheduledPathSelection default value should be 'Run Immediately'"
            );
            // scheduledPathSelection should change after setting ComboBox value to 'Sample_Scheduled_Path'
            cmp.find('scheduledPathComboBox').set('v.value', 'Sample_Scheduled_Path');
            $A.test.assertEquals(
                'Sample_Scheduled_Path',
                cmp.getDebugInput().scheduledPathSelection,
                'scheduledPathSelection value is incorrect'
            );
        }
    }
});
