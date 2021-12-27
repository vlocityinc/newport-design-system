// @ts-nocheck
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import {
    ASSIGNEE_RESOURCE_TYPE,
    ASSIGNEE_TYPE,
    getOtherItemsInOrchestratedStage
} from 'builder_platform_interaction/elementFactory';
import {
    ComboboxStateChangedEvent,
    CreateEntryConditionsEvent,
    DeleteAllConditionsEvent,
    DeleteOrchestrationActionEvent,
    ItemSelectedEvent,
    ORCHESTRATED_ACTION_CATEGORY,
    PropertyChangedEvent,
    RequiresAsyncProcessingChangedEvent,
    UpdateConditionEvent,
    UpdateEntryExitCriteriaEvent,
    UpdateParameterItemEvent,
    ValueChangedEvent
} from 'builder_platform_interaction/events';
import {
    ACTION_TYPE,
    ELEMENT_TYPE,
    EntryCriteria,
    ExitCriteria,
    ICONS
} from 'builder_platform_interaction/flowMetadata';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { updateAndValidateElementInPropertyEditor } from 'builder_platform_interaction/validation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
import StageStepEditor from '../stageStepEditor';
import { stageStepReducer } from '../stageStepReducer';

jest.mock('../stageStepReducer', () => {
    return {
        stageStepReducer: jest.fn((item) => {
            return item;
        })
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockRecordIdPromise = Promise.resolve('aUserRecordId');
const mockRecordDevNamePromise = Promise.resolve('aUserDevName');
const mockActionsPromise = Promise.resolve(invocableActionsForOrchestrator);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn(async (actionType) => {
            if (actionType === actual.SERVER_ACTION_TYPE.GET_RECORD_ID_BY_DEV_NAME) {
                return mockRecordIdPromise;
            } else if (actionType === actual.SERVER_ACTION_TYPE.GET_RECORD_DEV_NAME_BY_ID) {
                return mockRecordDevNamePromise;
            }
            return mockActionsPromise;
        })
    };
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return Object.assign('', actual, {
        getErrorsFromHydratedElement: jest.fn()
    });
});

jest.mock('builder_platform_interaction/validation', () => {
    const actual = jest.requireActual('builder_platform_interaction/validation');

    return Object.assign('', actual, {
        updateAndValidateElementInPropertyEditor: jest.fn((_, e) => e)
    });
});

const RELATED_RECORD_ID = 'mockRecordId';
const mockInputParameters = [
    { name: { value: 'ip1' }, value: { value: 'ip1Value' }, rowIndex: 'ip1Guid' },
    { name: { value: 'ActionInput__orchInstanceId' }, rowIndex: 'ActionInput__orchInstanceIdGuid' },
    { name: { value: 'ActionInput__stepInstanceId' }, rowIndex: 'ActionInput__stepInstanceIdGuid' },
    { name: { value: 'ActionInput__RecordId' }, rowIndex: 'ActionInput__RecordIdGuid', value: RELATED_RECORD_ID }
];
const mockActionDetails = {
    parameters: mockInputParameters
};

const mockActionsDetailsPromise = Promise.resolve(mockActionDetails);

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    const invocableActionLib = Object.assign({}, jest.requireActual('builder_platform_interaction/invocableActionLib'));
    invocableActionLib.fetchDetailsForInvocableAction = jest.fn(() => {
        return mockActionsDetailsPromise;
    });

    return invocableActionLib;
});
jest.mock('builder_platform_interaction/elementFactory', () => {
    const elementFactory = Object.assign({}, jest.requireActual('builder_platform_interaction/elementFactory'));

    elementFactory.getOtherItemsInOrchestratedStage = jest.fn(() => {
        return [
            {
                label: 'otherItem',
                name: 'otherItemName',
                guid: 'otherItemGuid'
            }
        ];
    });

    return elementFactory;
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-stepped-stage-item-editor', {
        is: StageStepEditor
    });
    el.node = node;
    el.processType = 'someProcessType';
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    LABEL_DESCRIPTION: 'builder_platform_interaction-label-description',
    ENTRY_CRITERIA_DROPDOWN: 'lightning-combobox.stepStart',
    ENTRY_CRITERIA_ITEM: 'builder_platform_interaction-combobox',
    EXIT_CRITERIA_DROPDOWN: 'lightning-combobox.stepCompletes',
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
    RELATED_RECORD_SELECTOR: 'builder_platform_interaction-ferov-resource-picker.recordPicker',
    ASSIGNEE_TYPE_SELECTOR: 'lightning-combobox.assigneeType',
    ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR: 'builder_platform_interaction-record-picker',
    USER_SELECTOR: '.assigneePicker lightning-input',
    USER_REFERENCE_SELECTOR: '.assigneePicker builder_platform_interaction-ferov-resource-picker',
    ACTOR_SELECTOR: 'builder_platform_interaction-ferov-resource-picker.actorPicker',
    ENTRY_ACTION: '.entry-action',
    EXIT_ACTION: '.exit-action',
    ASYNC_PROCESSING_BOX: '.externalCalloutsCheckbox'
};

describe('StageStepEditor', () => {
    const nodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryConditions: [],
        relatedRecordItem: {
            name: { value: 'ActionInput__RecordId' },
            rowIndex: 'ActionInput__RecordIdGuid',
            value: { value: RELATED_RECORD_ID }
        },
        entryAction: {
            actionName: {
                name: null,
                value: null
            },
            actionType: {
                name: null,
                value: null
            }
        },
        entryCriteria: {
            value: EntryCriteria.ON_STAGE_START
        },
        action: {
            actionName: {
                value: 'someActionName'
            },
            actionType: {
                value: ACTION_TYPE.STEP_INTERACTIVE
            }
        },
        exitAction: {
            actionName: {
                name: null,
                value: null
            },
            actionType: {
                name: null,
                value: null
            }
        },
        exitCriteria: {
            value: ExitCriteria.ON_STEP_COMPLETE
        },
        assignees: [
            {
                assignee: { value: 'orchestrator@salesforce.com' },
                assigneeType: 'User',
                isReference: false
            }
        ],
        inputParameters: mockInputParameters,
        config: {
            hasError: false
        }
    };

    const autolaunchedNodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryConditions: [],
        relatedRecordItem: {
            name: { value: 'ActionInput__RecordId' },
            rowIndex: 'ActionInput__RecordIdGuid',
            value: { value: RELATED_RECORD_ID }
        },
        entryAction: {
            actionName: {
                value: null
            },
            actionType: {
                value: null
            }
        },
        entryCriteria: {
            value: EntryCriteria.ON_STAGE_START
        },
        action: {
            actionName: {
                value: 'autolaunchedFlow'
            },
            actionType: {
                value: ACTION_TYPE.STEP_BACKGROUND
            }
        },
        exitAction: {
            actionName: {
                value: null
            },
            actionType: {
                value: null
            }
        },
        exitCriteria: {
            value: ExitCriteria.ON_STEP_COMPLETE
        },
        assignees: []
    };

    const nodeParamsWithDeterminations = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        entryConditions: [],
        relatedRecordItem: {
            name: { value: 'ActionInput__RecordId' },
            rowIndex: 'ActionInput__RecordIdGuid',
            value: { value: RELATED_RECORD_ID }
        },
        action: {
            actionName: {
                value: 'someActionName'
            },
            actionType: {
                value: ACTION_TYPE.STEP_INTERACTIVE
            }
        },
        assignees: [
            {
                assignee: { value: 'orchestrator@salesforce.com' },
                assigneeType: 'User',
                isReference: false
            }
        ],
        inputParameters: mockInputParameters,
        entryAction: {
            actionName: {
                value: 'someEntryActionName'
            },
            actionType: {
                value: 'someEntryActionType'
            }
        },
        entryActionInputParameters: mockInputParameters,
        entryCriteria: {
            value: EntryCriteria.ON_DETERMINATION_COMPLETE
        },

        exitAction: {
            actionName: {
                value: 'someExitActionName'
            },
            actionType: {
                value: 'someExitActionType'
            }
        },
        exitActionInputParameters: mockInputParameters,
        exitCriteria: {
            value: ExitCriteria.ON_DETERMINATION_COMPLETE
        }
    };

    let editor;

    beforeAll(() => {
        Store.setMockState({
            properties: {},
            elements: {}
        });
    });

    beforeEach(() => {
        editor = createComponentUnderTest(nodeParams);
    });

    describe('node', () => {
        describe('updateAndValidateElementInPropertyEditor', () => {
            it('is called for new node', () => {
                expect(updateAndValidateElementInPropertyEditor.mock.calls[0][0]).toStrictEqual(undefined);
                expect(updateAndValidateElementInPropertyEditor.mock.calls[0][1]).toStrictEqual(nodeParams);
            });
        });

        it('Label Description Component', () => {
            const labelDescription = editor.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION);
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label).toBe(nodeParams.label);
            expect(labelDescription.devName).toBe(nodeParams.name);
            expect(labelDescription.description).toBe(nodeParams.description);
        });

        it('has correct custom icon for each step type', () => {
            expect(editor.editorParams.panelConfig.customIcon).toBe(ICONS.interactiveStep);

            editor = createComponentUnderTest(autolaunchedNodeParams);
            expect(editor.editorParams.panelConfig.customIcon).toBe(ICONS.backgroundStep);
        });

        it('initializes the entry criteria item combobox menu data', () => {
            // Start when another step completes
            editor = createComponentUnderTest({
                ...nodeParamsWithDeterminations,
                ...{
                    entryCriteria: {
                        value: EntryCriteria.ON_STEP_COMPLETE
                    },
                    entryConditions: [{ leftHandSide: { value: 'nonexistentItem.Status' } }]
                }
            });

            const entryConditionsItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryConditionsItem.menuData[0].type).toEqual('option-card');
            expect(entryConditionsItem.menuData[0].dataType).toEqual(FLOW_DATA_TYPE.STRING.value);
            expect(entryConditionsItem.menuData[0].text).toEqual(getOtherItemsInOrchestratedStage()[0].label);
            expect(entryConditionsItem.menuData[0].displayText).toEqual(getOtherItemsInOrchestratedStage()[0].label);
            expect(entryConditionsItem.menuData[0].value).toEqual(
                `${getOtherItemsInOrchestratedStage()[0].guid}.Status`
            );

            expect(entryConditionsItem.value).toEqual('');
        });

        it('sets entry criteria item selected', () => {
            // Start when another step completes
            editor = createComponentUnderTest({
                ...nodeParamsWithDeterminations,
                ...{
                    entryCriteria: {
                        value: EntryCriteria.ON_STEP_COMPLETE
                    },
                    entryConditions: [{ leftHandSide: { value: 'otherItemGuid.Status' } }]
                }
            });

            const entryConditionsItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryConditionsItem.value).toEqual(entryConditionsItem.menuData[0]);
        });

        it('should not show exit criteria for autolaunched step', () => {
            editor = createComponentUnderTest(autolaunchedNodeParams);
            const dropdown = editor.shadowRoot.querySelector(selectors.EXIT_CRITERIA_DROPDOWN);
            expect(typeof dropdown).toBe('object');
        });

        describe('assignees', () => {
            describe('retrieves recordIds for user literals and passes them to record picker', () => {
                it('for a user', async () => {
                    expect.assertions(3);

                    expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_RECORD_ID_BY_DEV_NAME, {
                        devName: {
                            value: nodeParams.assignees[0].assignee.value
                        },
                        entity: ASSIGNEE_TYPE.User
                    });

                    await ticks(1);

                    const values = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    ).values;
                    expect(values.length).toEqual(1);
                    expect(values[0].id).toEqual(await mockRecordIdPromise);
                });
                it('for a group', async () => {
                    expect.assertions(3);

                    const stepWithGroupAssignee = {
                        ...nodeParams,
                        assignees: [
                            {
                                assignee: { value: 'someGroup' },
                                assigneeType: ASSIGNEE_TYPE.Group,
                                isReference: false
                            }
                        ]
                    };
                    editor = createComponentUnderTest(stepWithGroupAssignee);

                    expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_RECORD_ID_BY_DEV_NAME, {
                        devName: {
                            value: stepWithGroupAssignee.assignees[0].assignee.value
                        },
                        entity: ASSIGNEE_TYPE.Group
                    });

                    await ticks(1);

                    const values = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    ).values;
                    expect(values.length).toEqual(1);
                    expect(values[0].id).toEqual(await mockRecordIdPromise);
                });
            });
        });
    });

    describe('input parameters', () => {
        it('are empty if no action is present', () => {
            const nodeWithNoAction = {
                ...nodeParams,
                ...{
                    action: {
                        actionName: {
                            name: undefined,
                            value: undefined
                        },
                        actionType: {
                            name: undefined,
                            value: undefined
                        }
                    }
                }
            };

            editor = createComponentUnderTest(nodeWithNoAction);

            expect(stageStepReducer).toHaveBeenCalledWith(
                nodeWithNoAction,
                new CustomEvent(MERGE_WITH_PARAMETERS, {
                    detail: {
                        parameters: []
                    }
                })
            );
        });
        it('are empty if either action name or type is missing', () => {
            const nodeWithNoActions = [
                {
                    ...nodeParams,
                    ...{
                        action: {
                            actionName: {
                                value: 'ScreenFlow'
                            },
                            actionType: {
                                value: undefined
                            }
                        }
                    }
                },
                {
                    ...nodeParams,
                    ...{
                        action: {
                            actionName: {
                                value: undefined
                            },
                            actionType: {
                                value: ACTION_TYPE.STEP_INTERACTIVE
                            }
                        }
                    }
                }
            ];

            editor = createComponentUnderTest(nodeWithNoActions[0]);
            expect(stageStepReducer).toHaveBeenCalledWith(
                nodeWithNoActions[0],
                new CustomEvent(MERGE_WITH_PARAMETERS, { detail: { parameters: [] } })
            );

            editor = createComponentUnderTest(nodeWithNoActions[1]);
            expect(stageStepReducer).toHaveBeenCalledWith(
                nodeWithNoActions[1],
                new CustomEvent(MERGE_WITH_PARAMETERS, { detail: { parameters: [] } })
            );
        });
        it('are retrieved via fetchDetailsForInvocableAction', () => {
            expect(fetchDetailsForInvocableAction).toHaveBeenCalledWith({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: nodeParams.action.actionType.value,
                actionName: nodeParams.action.actionName.value,
                inputParameters: [],
                outputParameters: []
            });

            expect(stageStepReducer).toHaveBeenCalledWith(
                nodeParams,
                new CustomEvent(MERGE_WITH_PARAMETERS, {
                    detail: {
                        parameters: mockInputParameters
                    }
                })
            );
        });

        describe('list config', () => {
            it('filters out app process internal input variables', async () => {
                editor = createComponentUnderTest(nodeParamsWithDeterminations);

                // Wait for async param loading
                await ticks(1);

                const parameterList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);
                expect(parameterList.inputs).toHaveLength(1);
                expect(parameterList.inputs[0]).toEqual(nodeParams.inputParameters[0]);
            });
        });
    });

    describe('actions', () => {
        it('fetched on connectedCallback', () => {
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
                flowProcessType: editor.processType
            });
        });

        it('list set from available actions', () => {
            const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
            expect(actionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(4, 14));
        });
        describe('autolaunched step', () => {
            beforeEach(() => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
            });
            it('list set from available actions for autolaunched step', () => {
                const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
                expect(actionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(1, 4));
            });
        });

        describe('evaluation flow', () => {
            beforeEach(() => {
                editor = createComponentUnderTest(nodeParamsWithDeterminations);
            });
            it('list set from available actions for evaluation flow', () => {
                const entryActionSelector = editor.shadowRoot.querySelector(selectors.ENTRY_ACTION);
                expect(entryActionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(0, 1));

                const exitActionSelector = editor.shadowRoot.querySelector(selectors.EXIT_ACTION);
                expect(exitActionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(0, 1));
            });
        });
    });

    describe('event handlers', () => {
        it('handles the property changed event and updates', async () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            const labelDescription = editor.shadowRoot.querySelector(selectors.LABEL_DESCRIPTION);
            labelDescription.dispatchEvent(event);

            expect(stageStepReducer.mock.calls[0][0]).toEqual(nodeParams);
        });

        describe('handleStepStartChanged', () => {
            it('deletes entry criteria item if changing to ON_STAGE_START', () => {
                const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_DROPDOWN);

                const event = new CustomEvent('change', {
                    detail: {
                        value: EntryCriteria.ON_STAGE_START
                    }
                });

                entryCriteriaDropdown.dispatchEvent(event);

                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new UpdateEntryExitCriteriaEvent(ORCHESTRATED_ACTION_CATEGORY.ENTRY, EntryCriteria.ON_STAGE_START)
                );
                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteAllConditionsEvent(nodeParams.guid)
                );
                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteOrchestrationActionEvent(nodeParams.guid, ORCHESTRATED_ACTION_CATEGORY.ENTRY)
                );
            });

            it('instantiates entryConditions list, and deletes a potential entry action if changing to ON_STEP_COMPLETE', () => {
                const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_DROPDOWN);

                const event = new CustomEvent('change', {
                    detail: {
                        value: EntryCriteria.ON_STEP_COMPLETE
                    }
                });

                entryCriteriaDropdown.dispatchEvent(event);

                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new UpdateEntryExitCriteriaEvent(ORCHESTRATED_ACTION_CATEGORY.ENTRY, EntryCriteria.ON_STEP_COMPLETE)
                );
                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteOrchestrationActionEvent(nodeParams.guid, ORCHESTRATED_ACTION_CATEGORY.ENTRY)
                );
                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new CreateEntryConditionsEvent(nodeParams.guid)
                );
            });
        });

        describe('handleStepCompletesChanged updates Exit Determination Action', () => {
            it('deletes any exit determination action if changing to ON_STEP_COMPLETE', () => {
                const exitCriteriaDropdown = editor.shadowRoot.querySelector(selectors.EXIT_CRITERIA_DROPDOWN);
                const event = new CustomEvent('change', {
                    detail: {
                        value: ExitCriteria.ON_STEP_COMPLETE
                    }
                });
                exitCriteriaDropdown.dispatchEvent(event);

                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new UpdateEntryExitCriteriaEvent(ORCHESTRATED_ACTION_CATEGORY.EXIT, ExitCriteria.ON_STEP_COMPLETE)
                );

                expect(stageStepReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteOrchestrationActionEvent(nodeParams.guid, ORCHESTRATED_ACTION_CATEGORY.EXIT)
                );
            });
        });

        describe('actionSelected updates Action', () => {
            it('sets action type in event detail', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);

                const actionCombobox = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);

                const comboboxEvent = new ValueChangedEvent({ actionName: 'stepBackground' });
                actionCombobox.dispatchEvent(comboboxEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`
                expect(stageStepReducer.mock.calls[7][1].detail).toEqual({ actionCategory: 2, parameters: [] });
            });
        });

        describe('requiresAsyncProcessing', () => {
            it('should be false if not specified', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);

                expect(editor.node.requiresAsyncProcessing).toBeFalsy();

                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                expect(asyncProcessingCheckbox.checked).toBeFalsy();
            });

            it('should be true if specified and true', () => {
                const paramsWithAsyncProcessing = {
                    ...autolaunchedNodeParams,
                    requiresAsyncProcessing: true
                };
                editor = createComponentUnderTest(paramsWithAsyncProcessing);

                expect(editor.node.requiresAsyncProcessing).toBe(true);

                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                expect(asyncProcessingCheckbox.checked).toBe(true);
            });

            it('is clicked', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                const checkboxEvent = new CustomEvent('change', {
                    detail: {
                        value: true
                    }
                });

                asyncProcessingCheckbox.dispatchEvent(checkboxEvent);
                expect(stageStepReducer).toHaveBeenCalledWith(
                    autolaunchedNodeParams,
                    new RequiresAsyncProcessingChangedEvent(true)
                );

                checkboxEvent.detail.value = false;
                asyncProcessingCheckbox.dispatchEvent(checkboxEvent);
                expect(stageStepReducer).toHaveBeenCalledWith(
                    autolaunchedNodeParams,
                    new RequiresAsyncProcessingChangedEvent(false)
                );
            });

            it('is reset when a new action is selected', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
                const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
                const selectorEvent = new ValueChangedEvent({ actionName: 'stepBackground' });
                actionSelector.dispatchEvent(selectorEvent);

                expect(stageStepReducer).toHaveBeenCalledWith(
                    autolaunchedNodeParams,
                    new RequiresAsyncProcessingChangedEvent(false)
                );
            });

            it('should not exist for interactive steps', () => {
                editor = createComponentUnderTest(nodeParams);

                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                expect(asyncProcessingCheckbox).toBeNull();
            });

            it('should not exist without an action', () => {
                const nodeWithoutAction = {
                    ...autolaunchedNodeParams
                };
                nodeWithoutAction.action.actionName.value = undefined;
                editor = createComponentUnderTest(nodeWithoutAction);

                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                expect(asyncProcessingCheckbox).toBeNull();
            });

            it('should not exist without a valid action', () => {
                const nodeWithActionErrorMessage = {
                    ...autolaunchedNodeParams
                };
                nodeWithActionErrorMessage.action.actionName.error = 'error';
                editor = createComponentUnderTest(nodeWithActionErrorMessage);

                const asyncProcessingCheckbox = editor.shadowRoot.querySelector(selectors.ASYNC_PROCESSING_BOX);
                expect(asyncProcessingCheckbox).toBeNull();
            });
        });

        it('handleEntryCriteriaItemChanged updates entry criteria', () => {
            // Start when another step completes
            const element = {
                ...nodeParamsWithDeterminations,
                ...{
                    entryCriteria: {
                        value: EntryCriteria.ON_STEP_COMPLETE
                    },
                    entryConditions: [{ leftHandSide: { value: 'nonexistentItem.Status' } }]
                }
            };
            editor = createComponentUnderTest(element);

            const devName = 'someOtherItem';

            const itemCombobox = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            const comboboxEvent = new ComboboxStateChangedEvent({ value: devName });
            itemCombobox.dispatchEvent(comboboxEvent);

            const event = new UpdateConditionEvent(element.guid, 0, {
                leftValueReference: devName,
                operator: 'EqualTo',
                rightValue: {
                    stringValue: 'Completed'
                }
            });

            expect(stageStepReducer).toHaveBeenCalledWith(element, event);
        });

        describe('handleParameterPropertyChangedEvent', () => {
            it('updates input parameter on change', () => {
                const paramList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);

                const updateEvent = new UpdateParameterItemEvent(
                    true,
                    mockInputParameters[0].rowIndex,
                    'someName',
                    'someNewValue'
                );
                paramList.dispatchEvent(updateEvent);

                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, updateEvent);
            });

            it('does not update input parameter if value is the same', () => {
                const paramList = editor.shadowRoot.querySelector(selectors.PARAMETER_LIST);

                const updateEvent = new UpdateParameterItemEvent(
                    true,
                    mockInputParameters[0].rowIndex,
                    'someName',
                    mockInputParameters[0].value.value
                );
                paramList.dispatchEvent(updateEvent);

                expect(stageStepReducer).not.toHaveBeenCalledWith(nodeParams, updateEvent);
            });
        });

        describe('assignee', () => {
            it('should not be visible for autolaunched step', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
                const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                expect(assigneeType).toBeNull();
            });

            describe('type selection', () => {
                it('user updates reducer', () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_TYPE.User
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.User,
                        isReference: false
                    });
                });
                it('user literal displays user record picker', async () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_TYPE.User
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    await ticks(1);

                    const recordPicker = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    );

                    expect(recordPicker.attributes.entities).toHaveLength(1);
                    expect(recordPicker.attributes.entities[0].name).toEqual(ASSIGNEE_TYPE.User);
                    expect(recordPicker.attributes.entities[0].label).toEqual('Users');
                });

                it('user reference displays user reference combobox', async () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_RESOURCE_TYPE.UserResource
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.User,
                        isReference: true
                    });
                });
                it('group updates reducer', () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_TYPE.Group
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.Group,
                        isReference: false
                    });
                });

                it('group literal displays group record picker', async () => {
                    const stepWithGroupAssignee = {
                        ...nodeParams,
                        assignees: [
                            {
                                assignee: { value: 'someGroup' },
                                assigneeType: ASSIGNEE_TYPE.Group,
                                isReference: false
                            }
                        ]
                    };
                    editor = createComponentUnderTest(stepWithGroupAssignee);

                    await ticks(1);

                    const recordPicker = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    );

                    expect(recordPicker.attributes.entities).toHaveLength(1);
                    expect(recordPicker.attributes.entities[0].name).toEqual('Group');
                    expect(recordPicker.attributes.entities[0].label).toEqual('Group');
                });

                it('group reference displays user reference combobox', async () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_RESOURCE_TYPE.GroupResource
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.Group,
                        isReference: true
                    });
                });
                it('queue updates reducer', () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_TYPE.Queue
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.Queue,
                        isReference: false
                    });
                });

                it('queue literal displays queue record picker', async () => {
                    const stepWithQueueAssignee = {
                        ...nodeParams,
                        assignees: [
                            {
                                assignee: { value: 'someQueue' },
                                assigneeType: ASSIGNEE_TYPE.Queue,
                                isReference: false
                            }
                        ]
                    };
                    editor = createComponentUnderTest(stepWithQueueAssignee);

                    await ticks(1);

                    const recordPicker = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    );

                    expect(recordPicker.attributes.entities).toHaveLength(1);
                    expect(recordPicker.attributes.entities[0].name).toEqual(ASSIGNEE_TYPE.Group);
                    expect(recordPicker.attributes.entities[0].label).toEqual('Queue');
                });
                it('queue reference displays user reference combobox', async () => {
                    const assigneeType = editor.shadowRoot.querySelector(selectors.ASSIGNEE_TYPE_SELECTOR);
                    const changeEvent = new CustomEvent('change', {
                        detail: {
                            value: ASSIGNEE_RESOURCE_TYPE.QueueResource
                        }
                    });
                    assigneeType.dispatchEvent(changeEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: null,
                        type: ASSIGNEE_TYPE.Queue,
                        isReference: true
                    });
                });
            });

            describe('literal', () => {
                it('resolves recordId to devName and sets assignee', async () => {
                    const id = 'someId';
                    const userRecordPicker = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    );
                    await userRecordPicker.recordSelectedCallback(id);

                    ticks(10);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: { stringValue: await mockRecordDevNamePromise },
                        error: '',
                        type: ASSIGNEE_TYPE.User,
                        isReference: false
                    });
                });

                it('with empty value clears assignee', () => {
                    const userRecordPicker = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    );
                    userRecordPicker.recordSelectedCallback(null);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                        value: null,
                        error: '',
                        type: ASSIGNEE_TYPE.User,
                        isReference: false
                    });
                });

                it('passes error to record picker', async () => {
                    const error = 'some error msg';
                    const stepWithGroupAssignee = {
                        ...nodeParams,
                        assignees: [
                            {
                                assignee: { value: 'someGroup', error },
                                assigneeType: ASSIGNEE_TYPE.Group,
                                isReference: false
                            }
                        ]
                    };
                    editor = createComponentUnderTest(stepWithGroupAssignee);

                    await ticks(1);

                    const passedError = editor.shadowRoot.querySelector(
                        selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR
                    ).error;

                    expect(passedError).toEqual(error);
                });
            });

            describe('reference', () => {
                beforeEach(async () => {
                    editor.node = {
                        ...editor.node,
                        assignees: [
                            {
                                assignee: nodeParams.assignees[0].assignee,
                                assigneeType: ASSIGNEE_TYPE.User,
                                isReference: true
                            }
                        ]
                    };

                    ticks(1);
                });

                it('sets combobox config correctly', () => {
                    const userReferenceCombobox = editor.shadowRoot.querySelector(selectors.USER_REFERENCE_SELECTOR);

                    expect(userReferenceCombobox).toBeDefined();
                    expect(userReferenceCombobox.propertyEditorElementType).toBe('STAGE_STEP');
                    expect(userReferenceCombobox.elementParam).toEqual({ collection: false, dataType: 'String' });
                    expect(userReferenceCombobox.comboboxConfig).toEqual({
                        allowSObjectFields: true,
                        disabled: false,
                        enableFieldDrilldown: true,
                        errorMessage: undefined,
                        fieldLevelHelp: 'FlowBuilderStageStepEditor.actorSelectorUserReferenceTooltip',
                        label: 'FlowBuilderStageStepEditor.actorSelectorUserReferenceLabel',
                        literalsAllowed: false,
                        placeholder: 'FlowBuilderStageStepEditor.actorSelectorUserReferencePlaceholder',
                        required: true,
                        type: 'String',
                        variant: 'standard'
                    });
                    expect(userReferenceCombobox.rules).toEqual([]);
                    expect(userReferenceCombobox.errorMessage).toBe('');
                    expect(userReferenceCombobox.value).toBe(nodeParams.assignees[0].assignee.value);
                });

                it('node should be updated on combobox state changed', () => {
                    const userReferenceCombobox = editor.shadowRoot.querySelector(selectors.USER_REFERENCE_SELECTOR);

                    const comboboxEvent = new ComboboxStateChangedEvent(null, '{!$User.username}', 'Some error', false);
                    userReferenceCombobox.dispatchEvent(comboboxEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    // Note that the action category says this is a change on the STEP - this is what we really test.
                    expect(stageStepReducer.mock.calls[9][1].detail).toEqual({
                        value: {
                            stringValue: comboboxEvent.detail.displayText
                        },
                        type: 'User',
                        error: comboboxEvent.detail.error,
                        isReference: true
                    });
                });

                it('node should be updated on item selected with item', () => {
                    const userReferenceCombobox = editor.shadowRoot.querySelector(selectors.USER_REFERENCE_SELECTOR);

                    const itemSelectedEvent = new ItemSelectedEvent({
                        value: 'some value',
                        error: 'itemError',
                        displayText: '{!$User.username}'
                    });
                    userReferenceCombobox.dispatchEvent(itemSelectedEvent);

                    // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                    // Until then use the more brittle `.mocks`
                    expect(stageStepReducer.mock.calls[9][1].detail).toEqual({
                        value: {
                            stringValue: itemSelectedEvent.detail.item.value
                        },
                        type: 'User',
                        error: itemSelectedEvent.detail.item.error,
                        isReference: true
                    });
                });
            });
        });

        describe('related record selection', () => {
            it('sets combobox config correctly', () => {
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                expect(recordSelector).toBeDefined();
                expect(recordSelector.propertyEditorElementType).toBe('STAGE_STEP');
                expect(recordSelector.elementParam).toEqual({ collection: false, dataType: 'String' });
                expect(recordSelector.comboboxConfig).toEqual({
                    allowSObjectFields: true,
                    disabled: false,
                    enableFieldDrilldown: true,
                    errorMessage: undefined,
                    fieldLevelHelp: 'FlowBuilderStageStepEditor.recordSelectorTooltip',
                    label: 'FlowBuilderStageStepEditor.recordSelectorLabel',
                    literalsAllowed: true,
                    placeholder: 'FlowBuilderStageStepEditor.recordSelectorPlaceholder',
                    required: true,
                    type: 'String',
                    variant: 'standard'
                });
                expect(recordSelector.rules).toEqual([]);
                expect(recordSelector.errorMessage).toBe('');
                expect(recordSelector.value).toBe(RELATED_RECORD_ID);
            });

            it('node should be updated on combobox state changed', () => {
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                const comboboxEvent = new ComboboxStateChangedEvent(null, '{!$Record}', 'Some error', false);
                recordSelector.dispatchEvent(comboboxEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`

                // inputParameters should not be updated here
                expect(
                    stageStepReducer.mock.calls
                        .map((call) => call[1].detail)
                        .filter((item) => {
                            return (
                                item.isInput === true &&
                                item.rowIndex === mockInputParameters[3].rowIndex &&
                                item.name === mockInputParameters[3].name.value &&
                                item.value === '{!$Record}' &&
                                item.valueDataType === 'String' &&
                                item.error === 'Some error'
                            );
                        }).length > 0
                ).toBeFalsy();

                expect(stageStepReducer.mock.calls[4][1].detail).toEqual({ actionCategory: 0, parameters: [] });
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new PropertyChangedEvent());
            });

            it('node should be updated on item selected with item', () => {
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                const itemSelectedEvent = new ItemSelectedEvent({
                    value: 'some value',
                    error: 'itemError',
                    displayText: '{!$record}'
                });
                recordSelector.dispatchEvent(itemSelectedEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`

                // inputParameters should not be updated here
                expect(
                    stageStepReducer.mock.calls
                        .map((call) => call[1].detail)
                        .filter((item) => {
                            return (
                                item.isInput === true &&
                                item.rowIndex === mockInputParameters[3].rowIndex &&
                                item.name === mockInputParameters[3].name.value &&
                                item.value === 'some value' &&
                                item.valueDataType === 'String' &&
                                item.error === 'itemError'
                            );
                        }).length > 0
                ).toBeFalsy();

                expect(stageStepReducer.mock.calls[4][1].detail).toEqual({ actionCategory: 0, parameters: [] });
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new PropertyChangedEvent());
            });

            it('causes the related record input parameter to be updated when selection is empty', () => {
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                const itemSelectedEvent = new ItemSelectedEvent({
                    value: '',
                    error: 'A value is required'
                });
                recordSelector.dispatchEvent(itemSelectedEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`

                // inputParameters should be updated here
                expect(stageStepReducer.mock.calls[6][1].detail).toEqual({
                    isInput: true,
                    rowIndex: mockInputParameters[3].rowIndex,
                    name: mockInputParameters[3].name.value,
                    value: null,
                    valueDataType: 'String',
                    error: 'A value is required'
                });
            });

            it('causes the related record input parameter to be updated when the old value in the input parameter is null', () => {
                const editor = createComponentUnderTest({
                    ...nodeParams,
                    inputParameters: [
                        ...mockInputParameters.slice(0, mockInputParameters.length - 1),
                        { name: { value: 'ActionInput__RecordId' }, rowIndex: 'ActionInput__RecordIdGuid', value: null }
                    ]
                });
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                const comboboxEvent = new ComboboxStateChangedEvent(null, '{!$Record}', 'Some error', false);
                recordSelector.dispatchEvent(comboboxEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`

                // inputParameters should be updated here
                expect(stageStepReducer.mock.calls[8][1].detail).toEqual({
                    isInput: true,
                    rowIndex: mockInputParameters[3].rowIndex,
                    name: mockInputParameters[3].name.value,
                    value: '{!$Record}',
                    valueDataType: 'String',
                    error: 'Some error'
                });
            });

            it('should not be visible for autolaunched step', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
                const recordSelector = editor.shadowRoot.querySelector(selectors.RELATED_RECORD_SELECTOR);
                expect(recordSelector).toBeNull();
            });
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const node = editor.node;
            getErrorsFromHydratedElement.mockReturnValueOnce([]);
            editor.validate();
            expect(stageStepReducer.mock.calls[0][0]).toEqual(node);
            expect(stageStepReducer.mock.calls[0][1]).toEqual(new CustomEvent(VALIDATE_ALL));
        });

        it('gets the errors after validating', () => {
            getErrorsFromHydratedElement.mockReturnValueOnce(editor.node);
            editor.validate();
            expect(getErrorsFromHydratedElement).toHaveBeenCalledWith(editor.node);
        });

        it('assignee literal updates error', async () => {
            editor.node = {
                ...editor.node,
                assignees: [
                    {
                        assignee: {
                            value: 'someUser',
                            error: 'someError'
                        },
                        assigneeType: ASSIGNEE_TYPE.User,
                        isReference: false
                    }
                ]
            };

            await ticks(1);

            editor.validate();

            await ticks(1);

            const userRecordPicker = editor.shadowRoot.querySelector(selectors.ASSIGNEE_LITERAL_RECORD_PICKER_SELECTOR);

            expect(userRecordPicker.error).toEqual(editor.node.assignees[0].assignee.error);
        });

        describe('assignee reference picker', () => {
            it('updates error if present', async () => {
                editor.node = {
                    ...editor.node,
                    assignees: [
                        {
                            assignee: {
                                value: 'someUser',
                                error: 'someError'
                            },
                            assigneeType: ASSIGNEE_TYPE.User,
                            isReference: true
                        }
                    ]
                };

                await ticks(1);

                editor.validate();

                await ticks(1);

                const userRecordPicker = editor.shadowRoot.querySelector(selectors.USER_REFERENCE_SELECTOR);

                expect(userRecordPicker.errorMessage).toEqual(editor.node.assignees[0].assignee.error);
            });

            it('does not update error if not present', async () => {
                const error = 'someError';
                editor.node = {
                    ...editor.node,
                    assignees: [
                        {
                            assignee: {
                                value: 'someUser',
                                error
                            },
                            assigneeType: ASSIGNEE_TYPE.User,
                            isReference: true
                        }
                    ]
                };

                await ticks(1);

                editor.validate();

                await ticks(1);

                editor.node = {
                    ...editor.node,
                    assignees: [
                        {
                            assignee: {
                                value: 'someUser',
                                error: null
                            },
                            assigneeType: ASSIGNEE_TYPE.User,
                            isReference: true
                        }
                    ]
                };

                await ticks(1);

                const userRecordPicker = editor.shadowRoot.querySelector(selectors.USER_REFERENCE_SELECTOR);

                expect(userRecordPicker.errorMessage).toEqual(error);
            });
        });
    });

    describe('ui', () => {
        it('should focus the label description when the editor is designated with tab focus', () => {
            const label = editor.shadowRoot.querySelector('builder_platform_interaction-label-description');
            label.focus = jest.fn();

            editor.focus();
            expect(label.focus).toHaveBeenCalled();
        });
    });
});
