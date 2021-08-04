// @ts-nocheck
import { createElement } from 'lwc';
import StageStepEditor, { ENTRY_CRITERIA, EXIT_CRITERIA } from '../stageStepEditor';
import { stageStepReducer } from '../stageStepReducer';
import {
    ComboboxStateChangedEvent,
    CreateEntryConditionsEvent,
    DeleteAllConditionsEvent,
    DeleteOrchestrationActionEvent,
    ItemSelectedEvent,
    PropertyChangedEvent,
    UpdateConditionEvent,
    UpdateParameterItemEvent,
    ValueChangedEvent,
    OrchestrationAssigneeChangedEvent
} from 'builder_platform_interaction/events';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
import { Store } from 'builder_platform_interaction/storeLib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { getOtherItemsInOrchestratedStage } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ACTION_TYPE, ELEMENT_TYPE, ICONS } from 'builder_platform_interaction/flowMetadata';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { setDocumentBodyChildren, ticks } from 'builder_platform_interaction/builderTestUtils';
import { LABELS } from '../stageStepEditorLabels';
import {
    getErrorsFromHydratedElement,
    mergeErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

jest.mock('../stageStepReducer', () => {
    return {
        stageStepReducer: jest.fn((item) => {
            return item;
        })
    };
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockActionsPromise = Promise.resolve(invocableActionsForOrchestrator);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn(() => {
            return mockActionsPromise;
        })
    };
});

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return Object.assign('', actual, {
        getErrorsFromHydratedElement: jest.fn(),
        mergeErrorsFromHydratedElement: jest.fn((e) => e)
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
    CRITERIA_DROPDOWNS: 'lightning-combobox',
    ENTRY_CRITERIA_ITEM: 'builder_platform_interaction-combobox',
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector',
    PARAMETER_LIST: 'builder_platform_interaction-parameter-list',
    RELATED_RECORD_SELECTOR: 'builder_platform_interaction-ferov-resource-picker.recordPicker',
    ACTOR_SELECTOR: 'builder_platform_interaction-ferov-resource-picker.actorPicker'
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
        assignees: [
            {
                assignee: { value: 'orchestrator@salesforce.com' },
                assigneeType: 'User'
            }
        ],
        inputParameters: mockInputParameters
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
        assignees: [
            {
                assignee: { value: 'orchestrator@salesforce.com' },
                assigneeType: 'User'
            }
        ]
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
                assigneeType: 'User'
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

        exitAction: {
            actionName: {
                value: 'someExitActionName'
            },
            actionType: {
                value: 'someExitActionType'
            }
        },
        exitActionInputParameters: mockInputParameters
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
        describe('mergeErrorsFromHydratedElement', () => {
            it('is called for new node', () => {
                expect(mergeErrorsFromHydratedElement).toHaveBeenCalledWith(nodeParams, undefined);
            });
        });

        it('sets selectedEntryCriteria by default', () => {
            const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.CRITERIA_DROPDOWNS);
            expect(entryCriteriaDropdown.value).toEqual(ENTRY_CRITERIA.ON_STAGE_START);
        });

        it('sets selectedEntryCriteria to on_determination_complete when there is entry action in metadata', () => {
            editor = createComponentUnderTest(nodeParamsWithDeterminations);
            const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.CRITERIA_DROPDOWNS);
            expect(entryCriteriaDropdown.value).toEqual(ENTRY_CRITERIA.ON_DETERMINATION_COMPLETE);
            expect(entryCriteriaDropdown.fieldLevelHelp).toEqual(LABELS.criteriaActionHelpText);
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
                    entryAction: {
                        actionName: {
                            value: null
                        },
                        actionType: {
                            value: null
                        }
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
                    entryAction: {
                        actionName: {
                            value: null
                        },
                        actionType: {
                            value: null
                        }
                    },
                    entryActionName: {
                        value: null
                    },
                    entryConditions: [{ leftHandSide: { value: 'otherItemGuid.Status' } }]
                }
            });

            const entryConditionsItem = editor.shadowRoot.querySelector(selectors.ENTRY_CRITERIA_ITEM);

            expect(entryConditionsItem.value).toEqual(entryConditionsItem.menuData[0]);
        });

        it('sets selectedExitCriteria by default', () => {
            const dropdowns = editor.shadowRoot.querySelectorAll(selectors.CRITERIA_DROPDOWNS);
            expect(dropdowns[1].value).toEqual(EXIT_CRITERIA.ON_STEP_COMPLETE);
        });

        it('sets selectedExitCriteria to on_determination_complete when there is entry action in metadata', () => {
            editor = createComponentUnderTest(nodeParamsWithDeterminations);
            const dropdowns = editor.shadowRoot.querySelectorAll(selectors.CRITERIA_DROPDOWNS);
            expect(dropdowns[1].value).toEqual(EXIT_CRITERIA.ON_DETERMINATION_COMPLETE);
        });

        it('should not show exit criteria for autolaunched step', () => {
            editor = createComponentUnderTest(autolaunchedNodeParams);
            const dropdowns = editor.shadowRoot.querySelector(selectors.CRITERIA_DROPDOWNS);
            expect(typeof dropdowns).toBe('object');
        });

        describe('validation', () => {
            it('is not called if isNew', () => {
                editor = createComponentUnderTest({
                    ...autolaunchedNodeParams,
                    isNew: true
                });

                // This is brittle, but there's not a better way without
                // converting VALIDATE_ALL to an actual event class
                expect(stageStepReducer).toHaveBeenCalledTimes(9);
            });
            it('is called if !isNew', () => {
                const node = {
                    ...autolaunchedNodeParams,
                    isNew: false
                };
                editor = createComponentUnderTest(node);

                expect(stageStepReducer.mock.calls[7][0]).toEqual(node);
                expect(stageStepReducer.mock.calls[7][1]).toEqual(new CustomEvent(VALIDATE_ALL));
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
            expect(actionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(6, 16));
        });
        describe('autolaunched step', () => {
            beforeEach(() => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
            });
            it('list set from available actions for autolaunched step', () => {
                const actionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
                expect(actionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(3, 6));
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
                const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.CRITERIA_DROPDOWNS);

                const event = new CustomEvent('change', {
                    detail: {
                        value: ENTRY_CRITERIA.ON_STAGE_START
                    }
                });

                entryCriteriaDropdown.dispatchEvent(event);

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
                const entryCriteriaDropdown = editor.shadowRoot.querySelector(selectors.CRITERIA_DROPDOWNS);

                const event = new CustomEvent('change', {
                    detail: {
                        value: ENTRY_CRITERIA.ON_STEP_COMPLETE
                    }
                });

                entryCriteriaDropdown.dispatchEvent(event);

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
                const dropdowns = editor.shadowRoot.querySelectorAll(selectors.CRITERIA_DROPDOWNS);
                const exitCriteriaDropdown = dropdowns[1];
                const event = new CustomEvent('change', {
                    detail: {
                        value: EXIT_CRITERIA.ON_STEP_COMPLETE
                    }
                });
                exitCriteriaDropdown.dispatchEvent(event);

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
                expect(stageStepReducer.mock.calls[8][1].detail).toEqual({ actionCategory: 2, parameters: [] });
            });
        });

        it('handleEntryCriteriaItemChanged updates entry criteria', () => {
            // Start when another step completes
            const element = {
                ...nodeParamsWithDeterminations,
                ...{
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

        describe('assignee selection', () => {
            it('sets combobox config correctly', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                expect(actorSelector).toBeDefined();
                expect(actorSelector.propertyEditorElementType).toBe('STAGE_STEP');
                expect(actorSelector.elementParam).toEqual({ collection: false, dataType: 'String' });
                expect(actorSelector.comboboxConfig).toEqual({
                    allowSObjectFields: true,
                    disabled: false,
                    enableFieldDrilldown: true,
                    errorMessage: undefined,
                    fieldLevelHelp: 'FlowBuilderStageStepEditor.actorSelectorTooltip',
                    label: 'FlowBuilderStageStepEditor.actorSelectorLabel',
                    literalsAllowed: true,
                    placeholder: 'FlowBuilderStageStepEditor.actorSelectorPlaceholder',
                    required: true,
                    type: 'String',
                    variant: 'standard'
                });
                expect(actorSelector.rules).toEqual([]);
                expect(actorSelector.errorMessage).toBe(undefined);
                expect(actorSelector.value).toBe(nodeParams.assignees[0].assignee.value);
            });

            it('node should be updated on combobox state changed', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                const comboboxEvent = new ComboboxStateChangedEvent(null, '{!$User.username}', 'Some error', false);
                actorSelector.dispatchEvent(comboboxEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`
                // Note that the action category says this is a change on the STEP - this is what we really test.
                expect(stageStepReducer.mock.calls[5][1].detail).toEqual({
                    actionCategory: 0 /* step*/,
                    parameters: []
                });
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new OrchestrationAssigneeChangedEvent());
            });

            it('node should be updated on item selected with item', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                const itemSelectedEvent = new ItemSelectedEvent({
                    value: 'some value',
                    error: 'itemError',
                    displayText: '{!$User.username}'
                });
                actorSelector.dispatchEvent(itemSelectedEvent);

                // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
                // Until then use the more brittle `.mocks`
                expect(stageStepReducer.mock.calls[5][1].detail).toEqual({
                    actionCategory: 0 /* step*/,
                    parameters: []
                });
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new OrchestrationAssigneeChangedEvent());
            });

            it('sets the actorErrorMessage', () => {
                const actorSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                const itemSelectedEvent = new ItemSelectedEvent({
                    value: 'some value',
                    error: 'itemError',
                    displayText: '{!$User.username}'
                });
                actorSelector.dispatchEvent(itemSelectedEvent);

                expect(actorSelector.errorMessage).toEqual(itemSelectedEvent.detail.error);
            });

            it('should not be visible for autolaunched step', () => {
                editor = createComponentUnderTest(autolaunchedNodeParams);
                const recordSelector = editor.shadowRoot.querySelector(selectors.ACTOR_SELECTOR);
                expect(recordSelector).toBeNull();
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
                expect(stageStepReducer.mock.calls[5][1].detail).toEqual({ actionCategory: 0, parameters: [] });
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
                expect(stageStepReducer.mock.calls[5][1].detail).toEqual({ actionCategory: 0, parameters: [] });
                expect(stageStepReducer).toHaveBeenCalledWith(nodeParams, new PropertyChangedEvent());
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
