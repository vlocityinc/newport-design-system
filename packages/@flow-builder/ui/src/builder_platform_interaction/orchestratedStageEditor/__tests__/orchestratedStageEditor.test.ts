// @ts-nocheck
import { mockActions } from 'mock/calloutData';
import { createElement } from 'lwc';
import OrchestratedStageEditor from 'builder_platform_interaction/orchestratedStageEditor';
import {
    INTERACTION_COMPONENTS_SELECTORS,
    LIGHTNING_COMPONENTS_SELECTORS,
    setDocumentBodyChildren,
    ticks
} from 'builder_platform_interaction/builderTestUtils';
import { Store } from 'builder_platform_interaction/storeLib';
import { fetchDetailsForInvocableAction } from 'builder_platform_interaction/invocableActionLib';
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MERGE_WITH_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { orchestratedStageReducer } from '../orchestratedStageReducer';
import { fetchOnce, SERVER_ACTION_TYPE } from 'builder_platform_interaction/serverDataLib';
import {
    DeleteOrchestrationActionEvent,
    UpdateNodeEvent,
    PropertyChangedEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    getErrorsFromHydratedElement,
    mergeErrorsFromHydratedElement
} from 'builder_platform_interaction/dataMutationLib';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';

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
        getErrorsFromHydratedElement: jest.fn(),
        mergeErrorsFromHydratedElement: jest.fn((e) => e)
    });
});

jest.mock('builder_platform_interaction/storeLib', () => require('builder_platform_interaction_mocks/storeLib'));

const mockActionsPromise = Promise.resolve(mockActions);

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
                    exitActionInputParameters: mockInputParameters
                };
                editor.node = newNode;

                expect(mergeErrorsFromHydratedElement).toHaveBeenCalledWith(newNode, nodeParams);
            });
        });

        describe('hasError state changes', () => {
            it('sets hasError from undefined to true, then from true to false', async () => {
                await ticks(1);

                expect.assertions(2);
                const eventCallback = jest.fn();
                editor.addEventListener(UpdateNodeEvent.EVENT_NAME, eventCallback);

                let newNode = {
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
                    config: {
                        hasError: true
                    }
                };

                editor.node = newNode;
                expect(eventCallback.mock.calls[0][0].detail.node).toEqual(newNode);

                newNode = {
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
                    config: {
                        hasError: false
                    }
                };
                editor.node = newNode;
                expect(eventCallback.mock.calls[1][0].detail.node).toEqual(newNode);
            });
        });

        it('sets selectedExitCriteria by default', () => {
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
                exitActionInputParameters: mockInputParameters
            });
            const exitCriteriaDropdown = editor.shadowRoot.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );
            expect(exitCriteriaDropdown.value).toEqual('on_step_complete');
        });

        it('sets selectedEntryCriteria to on_determination_complete when there is entry action in metadata', () => {
            const exitCriteriaDropdown = editor.shadowRoot.querySelector(
                LIGHTNING_COMPONENTS_SELECTORS.LIGHTNING_COMBOBOX
            );
            expect(exitCriteriaDropdown.value).toEqual('on_determination_complete');
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

        describe('validation', () => {
            it('is not called if isNew', () => {
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
                    isNew: true
                };
                editor.node = newNode;

                // This is brittle, but there's not a better way without
                // converting VALIDATE_ALL to an actual event class
                expect(orchestratedStageReducer).toHaveBeenCalledTimes(3);
            });
            it('is called if !isNew', () => {
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
                    exitActionInputParameters: mockInputParameters
                };
                editor.node = newNode;
                expect(orchestratedStageReducer.mock.calls[3][0]).toEqual(newNode);
                expect(orchestratedStageReducer.mock.calls[3][1]).toEqual(new CustomEvent(VALIDATE_ALL));
            });
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
            expect(fetchOnce).toHaveBeenCalledWith(SERVER_ACTION_TYPE.GET_SUBFLOWS, {
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
                    exitActionInputParameters: mockInputParameters
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
});
