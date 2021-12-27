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
import { ELEMENT_TYPE, StageExitCriteria } from 'builder_platform_interaction/flowMetadata';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import OrchestratedStageEditor from 'builder_platform_interaction/orchestratedStageEditor';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import { Store } from 'builder_platform_interaction/storeLib';
import { updateAndValidateElementInPropertyEditor } from 'builder_platform_interaction/validation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { createElement } from 'lwc';
import { invocableActionsForOrchestrator } from 'serverData/GetAllInvocableActionsForType/invocableActionsForOrchestrator.json';
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
    ACTION_SELECTOR: 'builder_platform_interaction-action-selector'
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
            it('filters out app process internal input variables', () => {
                const parameterList = editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.PARAMETER_LIST);
                expect(parameterList.inputs).toHaveLength(1);
                expect(parameterList.inputs[0]).toEqual(nodeParams.exitActionInputParameters[0]);
            });
        });
    });

    describe('actions', () => {
        it('fetched on connectedCallback', () => {
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_INVOCABLE_ACTIONS, {
                flowProcessType: editor.processType
            });
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
        it('updates input parameter on change', () => {
            const paramList = editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.PARAMETER_LIST);

            const updateEvent = new UpdateParameterItemEvent(
                true,
                mockInputParameters[0].rowIndex,
                'someName',
                'someNewValue'
            );
            paramList.dispatchEvent(updateEvent);

            expect(orchestratedStageReducer).toHaveBeenCalledWith(nodeParams, updateEvent);
        });

        it('does not update input parameter if value is the same', () => {
            const paramList = editor.shadowRoot.querySelector(INTERACTION_COMPONENTS_SELECTORS.PARAMETER_LIST);

            const updateEvent = new UpdateParameterItemEvent(
                true,
                mockInputParameters[0].rowIndex,
                'someName',
                mockInputParameters[0].value.value
            );
            paramList.dispatchEvent(updateEvent);

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
            const exitActionSelector = editor.shadowRoot.querySelector(selectors.ACTION_SELECTOR);
            expect(exitActionSelector.invocableActions).toEqual(invocableActionsForOrchestrator.slice(0, 1));
        });
    });
});
