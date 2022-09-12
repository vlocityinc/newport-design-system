// @ts-nocheck
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { getErrorsFromHydratedElement } from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteOrchestrationActionEvent,
    ORCHESTRATED_ACTION_CATEGORY,
    PropertyChangedEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE, StageExitCriteria } from 'builder_platform_interaction/flowMetadata';
import { getFlowIdsForNames } from 'builder_platform_interaction/inlineOpenFlowUtils';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import OrchestratedStageEditor from 'builder_platform_interaction/orchestratedStageEditor';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { updateAndValidateElementInPropertyEditor } from 'builder_platform_interaction/validation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
import { flowIds } from 'serverData/GetFlowIds/flowIds.json';
import { orchestratedStageReducer } from '../orchestratedStageReducer';

jest.mock('../orchestratedStageReducer', () => {
    return {
        orchestratedStageReducer: jest.fn((item) => {
            return item;
        })
    };
});

jest.mock('builder_platform_interaction/invocableActionLib', () => {
    return {
        fetchDetailsForInvocableAction: jest.fn(() => {
            return mockActionsDetailsPromise;
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

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

jest.mock('builder_platform_interaction/inlineOpenFlowUtils', () => {
    return {
        openFlow: jest.fn(),
        getFlowIdsForNames: jest.fn(() => {
            return mockFlowIdsPromise;
        })
    };
});

const mockActionsPromise = Promise.resolve(invocableActionsForOrchestrator);

const mockFlowIdsPromise = Promise.resolve(flowIds);
const mockEvaluationFlows = invocableActionsForOrchestrator.slice(0, 1);

jest.mock('builder_platform_interaction/serverDataLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/serverDataLib');
    return {
        SERVER_ACTION_TYPE: actual.SERVER_ACTION_TYPE,
        fetchOnce: jest.fn(() => {
            return mockActionsPromise;
        })
    };
});

const mockInputParameters = [{ name: { value: 'ip1' }, value: { value: 'ip1Value' }, rowIndex: 'ip1Guid' }];

const mockActionsDetailsPromise = Promise.resolve({
    parameters: mockInputParameters
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const elementFactory = Object.assign({}, jest.requireActual('builder_platform_interaction/elementFactory'));

    elementFactory.getOtherItemsInOrchestratedStage = jest.fn(() => {
        return [
            {
                label: 'otherItem',
                name: 'otherItemName',
                guid: 'otherItemName'
            }
        ];
    });

    return elementFactory;
});

const createComponentUnderTest = (node) => {
    const el = createElement('builder_platform_interaction-stepped-stage-item-editor', {
        is: OrchestratedStageEditor
    });
    el.node = node;
    el.processType = 'someProcessType';
    setDocumentBodyChildren(el);
    return el;
};

const selectors = {
    ACTION_AND_PARAMETERS: 'builder_platform_interaction-action-and-parameters',
    OPEN_FLOW_SELECTOR: '.open-flow'
};

describe('OrchestratedStageEditor', () => {
    const nodeParams = {
        guid: 'someGuid',
        name: 'someName',
        label: 'someLabel',
        description: 'someDescription',
        exitAction: {
            actionName: {
                value: 'someActionName'
            },
            actionType: {
                value: 'someActionType'
            }
        },
        exitActionInputParameters: mockInputParameters,
        exitCriteria: {
            value: StageExitCriteria.ON_STEP_COMPLETE
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
                expect(updateAndValidateElementInPropertyEditor.mock.calls[0][3]).toStrictEqual(['stageSteps']);
            });

            it('is called for existing node', async () => {
                await ticks(1);

                const newNode = {
                    guid: 'someOtherGuid',
                    name: 'someOtherName',
                    label: 'someLabel',
                    description: 'someDescription',
                    exitAction: {
                        actionName: {
                            value: 'someActionName'
                        },
                        actionType: {
                            value: 'someActionType'
                        }
                    },
                    exitActionInputParameters: mockInputParameters,
                    exitCriteria: {
                        value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                    }
                };
                editor.node = newNode;

                expect(updateAndValidateElementInPropertyEditor.mock.calls[1][0]).toStrictEqual(nodeParams);
                expect(updateAndValidateElementInPropertyEditor.mock.calls[1][1]).toStrictEqual(newNode);
                expect(updateAndValidateElementInPropertyEditor.mock.calls[1][3]).toStrictEqual(['stageSteps']);
            });
        });

        it('sets selectedExitCriteria to on_determination_complete if specified', () => {
            editor = createComponentUnderTest({
                ...nodeParams,
                exitCriteria: {
                    value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                }
            });
            const exitCriteriaDropdown = editor.shadowRoot.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );
            expect(exitCriteriaDropdown.value).toEqual(StageExitCriteria.ON_DETERMINATION_COMPLETE);
        });

        it('Label Description Component', () => {
            const labelDescription = editor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION
            );
            expect(labelDescription).toBeDefined();
            expect(labelDescription.label).toBe(nodeParams.label);
            expect(labelDescription.devName).toBe(nodeParams.name);
            expect(labelDescription.description).toBe(nodeParams.description);
        });
    });

    describe('input parameters', () => {
        it('are retrieved via fetchDetailsForInvocableAction', () => {
            expect(fetchDetailsForInvocableAction).toHaveBeenCalledWith({
                elementType: ELEMENT_TYPE.ACTION_CALL,
                actionType: nodeParams.exitAction.actionType.value,
                actionName: nodeParams.exitAction.actionName.value,
                inputParameters: [],
                outputParameters: []
            });

            expect(orchestratedStageReducer).toHaveBeenCalledWith(
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
                editor = createComponentUnderTest({
                    ...nodeParams,
                    exitCriteria: {
                        value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                    },
                    exitAction: {
                        actionName: {
                            value: mockEvaluationFlows[0]
                        },
                        actionType: {
                            value: ACTION_TYPE.EVALUATION_FLOW
                        }
                    },
                    exitActionInputParameters: mockInputParameters
                });

                await ticks();

                const actionAndParameters = editor.shadowRoot.querySelector(selectors.ACTION_AND_PARAMETERS);

                expect(actionAndParameters.actionParameterListConfig.inputs).toHaveLength(1);
                expect(actionAndParameters.actionParameterListConfig.inputs[0]).toEqual(mockInputParameters[0]);
            });
        });
    });

    describe('actions', () => {
        it('fetched on connectedCallback', () => {
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: editor.processType
            });
            expect(getFlowIdsForNames).toHaveBeenCalledWith(
                invocableActionsForOrchestrator.map((action) => action.name)
            );
        });
    });

    describe('event handlers', () => {
        it('handles the property changed event and updates', async () => {
            const event = new PropertyChangedEvent('description', 'new desc', null);
            const labelDescription = editor.shadowRoot.querySelector(
                INTERACTION_COMPONENTS_SELECTORS.LABEL_DESCRIPTION
            );
            labelDescription.dispatchEvent(event);

            expect(orchestratedStageReducer.mock.calls[0][0]).toEqual(nodeParams);
        });

        describe('handleStageCompletesChanged', () => {
            it('deletes any exit determination action if changing to ON_STEP_COMPLETE', () => {
                const exitCriteriaDropdown = editor.shadowRoot.querySelector(
                    LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
                );
                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_step_complete'
                    }
                });
                exitCriteriaDropdown.dispatchEvent(event);

                expect(orchestratedStageReducer).toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteOrchestrationActionEvent(nodeParams.guid, ORCHESTRATED_ACTION_CATEGORY.EXIT)
                );
            });

            it('does not deletes entry criteria item if changing to ON_DETERMINATION_COMPLETE', () => {
                editor = createComponentUnderTest({
                    guid: 'someGuid',
                    name: 'someName',
                    label: 'someLabel',
                    description: 'someDescription',
                    exitAction: {
                        actionName: {
                            value: ''
                        }
                    },
                    exitActionInputParameters: mockInputParameters,
                    exitCriteria: {
                        value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                    }
                });
                const exitCriteriaDropdown = editor.shadowRoot.querySelector(
                    LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
                );

                const event = new CustomEvent('change', {
                    detail: {
                        value: 'on_determination_complete'
                    }
                });

                exitCriteriaDropdown.dispatchEvent(event);

                expect(orchestratedStageReducer).not.toHaveBeenCalledWith(
                    nodeParams,
                    new DeleteOrchestrationActionEvent(nodeParams.guid, ORCHESTRATED_ACTION_CATEGORY.EXIT)
                );
            });
        });
    });

    describe('handleParameterPropertyChangedEvent', () => {
        beforeEach(async () => {
            editor = createComponentUnderTest({
                ...nodeParams,
                exitCriteria: {
                    value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                },
                exitAction: {
                    actionName: {
                        value: mockEvaluationFlows[0]
                    },
                    actionType: {
                        value: ACTION_TYPE.EVALUATION_FLOW
                    }
                },
                exitActionInputParameters: mockInputParameters
            });

            await ticks();
        });
        it('updates input parameter on change', () => {
            const updateEvent = new UpdateParameterItemEvent(
                true,
                mockInputParameters[0].rowIndex,
                'someName',
                'someNewValue'
            );

            const actionAndParameters = editor.shadowRoot.querySelector(selectors.ACTION_AND_PARAMETERS);
            actionAndParameters.dispatchEvent(updateEvent);

            // Bug with toHaveBeenCalledWith and custom object - https://github.com/facebook/jest/issues/11078
            // Until then use the more brittle `.mocks`
            const lastCall = orchestratedStageReducer.mock.calls.length - 1;
            expect(orchestratedStageReducer.mock.calls[lastCall][1].detail).toEqual({
                rowIndex: updateEvent.detail.rowIndex
            });
        });

        it('does not update input parameter if value is the same', () => {
            const updateEvent = new UpdateParameterItemEvent(
                true,
                mockInputParameters[0].rowIndex,
                'someName',
                mockInputParameters[0].value.value
            );

            const actionAndParameters = editor.shadowRoot.querySelector(selectors.ACTION_AND_PARAMETERS);
            actionAndParameters.dispatchEvent(updateEvent);

            expect(orchestratedStageReducer).not.toHaveBeenCalledWith(nodeParams, updateEvent);
        });
    });

    describe('validation', () => {
        it('calls reducer with validate all event', () => {
            const node = editor.node;
            getErrorsFromHydratedElement.mockReturnValueOnce([]);
            editor.validate();
            expect(orchestratedStageReducer.mock.calls[0][0]).toEqual(node);
            expect(orchestratedStageReducer.mock.calls[0][1]).toEqual(new CustomEvent(VALIDATE_ALL));
        });

        it('gets the errors after validating', () => {
            getErrorsFromHydratedElement.mockReturnValueOnce([editor.node]);
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

    describe('evaluation flow', () => {
        beforeEach(() => {
            editor = createComponentUnderTest({
                ...nodeParams,
                exitCriteria: {
                    value: StageExitCriteria.ON_DETERMINATION_COMPLETE
                }
            });
        });
        it('list set from available actions for evaluation flow', () => {
            const actionAndParameters = editor.shadowRoot.querySelector(selectors.ACTION_AND_PARAMETERS);
            expect(actionAndParameters.availableActions).toEqual(mockEvaluationFlows);
        });
    });
});
