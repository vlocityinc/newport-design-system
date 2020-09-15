/* eslint-disable */
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
            $A.test.assertFalse(
                cmp.find('isGovernorLimitsBox').get('v.checked'),
                'GovernorLimits should not be checked by default'
            );
            this.assertObjectEquals(
                cmp.getDebugInput(),
                {
                    inputs: [],
                    runAs: false,
                    debugAsUserId: null,
                    enableRollback: false,
                    governorLimits: false
                },
                "Default getDebugInput doesn't work correctly"
            );
            $A.test.assertFalse(cmp.get('v.hasInputs'), 'hasInputs is not set properly');
        }
    },

    testToggleCheckboxes: {
        test: function (cmp) {
            cmp.find('isDebugAsUserAllowedBox').set('v.checked', true);
            cmp.find('isEnableRollbackModeBox').set('v.checked', true);
            cmp.find('isGovernorLimitsBox').set('v.checked', true);
            this.assertObjectEquals(
                cmp.getDebugInput(),
                {
                    inputs: [],
                    runAs: true,
                    debugAsUserId: null,
                    enableRollback: true,
                    governorLimits: true
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
                    $A.test.assertTrue(inputs.length === 2, 'Output-only variable should not show up');
                    $A.test.assertEquals(inputs[1].get('v.value'), 'previous input value');
                    // inputs[0] is aura$expression by default, inputs.length = 2 means there is 1 input variable
                    $A.test.assertTrue(cmp.get('v.hasInputs'), 'hasInputs should return true');
                }
            );
        }
    }
});
