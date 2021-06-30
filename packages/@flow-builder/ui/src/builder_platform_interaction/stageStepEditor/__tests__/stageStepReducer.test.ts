// @ts-nocheck
import { stageStepReducer } from '../stageStepReducer';
import {
    CreateEntryConditionsEvent,
    DeleteAllConditionsEvent,
    DeleteConditionEvent,
    DeleteOrchestrationActionEvent,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateParameterItemEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction/events';
import { createCondition } from 'builder_platform_interaction/elementFactory';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import {
    hydrateWithErrors,
    replaceItem,
    deleteItem,
    updateProperties
} from 'builder_platform_interaction/dataMutationLib';
import { invokeModal } from 'builder_platform_interaction/sharedUtils';
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { removeAllUnsetParameters } from 'builder_platform_interaction/orchestratedStageAndStepReducerUtils';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { Validation } from 'builder_platform_interaction/validation';

const mockCondition = {
    a: 1
};

const mockReferencedGuid = 'referencedItemGuid';
let mockReferencingElement;

jest.mock('builder_platform_interaction/storeUtils', () => {
    return {
        getElementByGuid: jest.fn(() => {
            return mockReferencingElement;
        })
    };
});

jest.mock('builder_platform_interaction/usedByLib', () => {
    return {
        usedBy: jest.fn((guidArray) => {
            return guidArray[0] === mockReferencedGuid ? [{}] : [];
        })
    };
});

jest.mock('builder_platform_interaction/elementFactory', () => {
    const actual = jest.requireActual('builder_platform_interaction/elementFactory');

    return Object.assign({}, actual, {
        createCondition: jest.fn(() => {
            return mockCondition;
        })
    });
});

let mockHydrated;

jest.mock('builder_platform_interaction/dataMutationLib', () => {
    const actual = jest.requireActual('builder_platform_interaction/dataMutationLib');

    return {
        hydrateWithErrors: jest.fn((value) => {
            if (mockHydrated) {
                return mockHydrated;
            }
            return value;
        }),
        updateProperties: jest.fn((state, props) => {
            return actual.updateProperties(state, props);
        }),
        replaceItem: jest.fn((state, props, index) => {
            return actual.replaceItem(state, props, index);
        }),
        deleteItem: jest.fn((state, index) => {
            return actual.deleteItem(state, index);
        }),
        getValueFromHydratedItem: actual.getValueFromHydratedItem,
        set: jest.fn((object, path, value) => {
            return actual.set(object, path, value);
        })
    };
});

jest.mock('builder_platform_interaction/sharedUtils', () => {
    const sharedUtils = jest.requireActual('builder_platform_interaction_mocks/sharedUtils');
    const sharedcommands = jest.requireActual('builder_platform_interaction/sharedUtils/commands');
    return Object.assign({}, sharedUtils, { commands: sharedcommands, invokeModal: jest.fn() });
});

jest.mock('builder_platform_interaction/orchestratedStageAndStepReducerUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/orchestratedStageAndStepReducerUtils');
    return Object.assign({}, actual, {
        removeAllUnsetParameters: jest.fn((state) => state)
    });
});

jest.mock('builder_platform_interaction/validation', () => {
    const mockValidateAll = jest.fn();
    const mockValidateProperty = jest.fn(() => {
        return null;
    });

    const Validation = function () {
        return {
            validateAll: mockValidateAll,
            validateProperty: mockValidateProperty
        };
    };

    return {
        Validation
    };
});

describe('StageStep Reducer', () => {
    beforeEach(() => {
        mockReferencingElement = {
            guid: 'someElement',
            someField: `${mockReferencedGuid}.Outputs`
        };
    });

    let originalState, originalStateWithEntryCriteria, originalStateWithEntryExitActions;
    beforeEach(() => {
        originalState = {
            guid: 'itemGuid',
            entryConditions: null,
            inputParameters: [{}],
            ouputParameters: [{}]
        };

        originalStateWithEntryCriteria = {
            guid: 'itemGuid',
            entryConditions: ['foo'],
            inputParameters: [{}],
            ouputParameters: [{}]
        };

        originalStateWithEntryExitActions = {
            guid: 'itemGuid',

            inputParameters: [{}],
            ouputParameters: [{}],

            entryAction: {},
            entryActionName: 'someEntryActionName',
            entryActionType: 'someEntryActionType',
            entryActionInputParameters: [
                {
                    name: { value: 'ip1' },
                    value: { value: 'ip1Value' },
                    rowIndex: 'entryIp1Guid'
                },
                {
                    name: { value: 'ip2' },
                    value: { value: 'ip2Value' },
                    rowIndex: 'entryIp2Guid'
                },
                {
                    name: { value: 'ip3' },
                    value: null,
                    rowIndex: 'entryIp3Guid'
                }
            ],
            exitAction: {},
            exitActionName: 'someExitActionName',
            exitActionType: 'someExitActionType',
            exitActionInputParameters: [
                {
                    name: { value: 'ip1' },
                    value: { value: 'ip1Value' },
                    rowIndex: 'exitIp1Guid'
                },
                {
                    name: { value: 'ip2' },
                    value: { value: 'ip2Value' },
                    rowIndex: 'exitIp2Guid'
                },
                {
                    name: { value: 'ip3' },
                    value: null,
                    rowIndex: 'exitIp3Guid'
                }
            ]
        };
    });

    describe('UpdateConditionEvent', () => {
        beforeEach(() => {
            mockHydrated = {
                entryConditions: ['foo']
            };
        });

        afterEach(() => {
            mockHydrated = undefined;
        });

        it('replaces null entry criteria with the new criteria', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    guid: originalState.guid,
                    index: 0,
                    value: 'newValue'
                }
            };

            const newState = stageStepReducer(originalState, event);
            expect(createCondition).toHaveBeenCalledWith(event.detail.value);
            expect(hydrateWithErrors).toHaveBeenCalledWith(mockCondition);

            expect(newState.entryConditions[0]).toEqual(mockHydrated);
            expect(newState).not.toBe(originalStateWithEntryCriteria);

            mockHydrated = undefined;
        });

        it('replaces existing entry criteria with the new criteria', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0,
                    value: 'newValue'
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(createCondition).toHaveBeenCalledWith(event.detail.value);
            expect(hydrateWithErrors).toHaveBeenCalledWith(mockCondition);
            expect(replaceItem).toHaveBeenCalledWith(originalStateWithEntryCriteria.entryConditions, mockHydrated, 0);

            expect(newState.entryConditions[0]).toEqual(mockHydrated);
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: UpdateConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0,
                    value: 'newValue'
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('DeleteConditionEvent', () => {
        it('deleted existing entry criteria', () => {
            const event = {
                type: DeleteConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(deleteItem).toHaveBeenCalledWith(originalStateWithEntryCriteria.entryConditions, 0);

            expect(newState.entryConditions[0]).not.toBeDefined();
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: DeleteConditionEvent.EVENT_NAME,
                detail: {
                    parentGUID: originalState.guid,
                    index: 0
                }
            };

            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('OrchestrationActionValueChangedEvent', () => {
        it('updates the action', () => {
            const event = {
                type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionName: 'someAction',
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM
                    },
                    error: null,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            };

            stageStepReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                action: {
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                    actionName: event.detail.value.actionName
                },
                actionError: null,
                inputParameters: [],
                outputParameters: []
            });
        });

        it('updates the autolaunched step action', () => {
            const event = {
                type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionName: 'someAction',
                        actionType: ACTION_TYPE.ORCHESTRATOR_AUTOLAUNCHED_FLOW
                    },
                    error: null,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            };

            stageStepReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                action: {
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: ACTION_TYPE.ORCHESTRATOR_AUTOLAUNCHED_FLOW,
                    actionName: event.detail.value.actionName
                },
                actionError: null,
                inputParameters: [],
                outputParameters: []
            });
        });

        it('preserves the action type even if the action name is cleared', () => {
            const event = {
                type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionType: ACTION_TYPE.ORCHESTRATOR_AUTOLAUNCHED_FLOW
                    },
                    error: null,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            };

            stageStepReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                action: {
                    actionName: undefined,
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: ACTION_TYPE.ORCHESTRATOR_AUTOLAUNCHED_FLOW
                },
                actionError: null,
                inputParameters: [],
                outputParameters: []
            });
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionName: 'someAction'
                    },
                    error: null,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            };

            const newState = stageStepReducer(originalState, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });

        describe('referenced action.Outputs', () => {
            it('direct reference does not update the action', () => {
                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'originalAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    entryConditions: [],
                    inputParameters: [{}],
                    outputParameters: [{}]
                };

                const event = {
                    type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                    detail: {
                        value: {
                            actionName: 'anotherAction',
                            actionType: ACTION_TYPE.CREATE_WORK_ITEM
                        },
                        error: null,
                        actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(updateProperties).toHaveBeenCalledWith(stateWithReferencedAction, {
                    action: {
                        elementType: ELEMENT_TYPE.ACTION_CALL,
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                        actionName: stateWithReferencedAction.action.actionName.value
                    }
                });
            });

            it('reference in array does not update the action', () => {
                mockReferencingElement = {
                    guid: 'someElement',
                    someField: [{ a: 'foo' }, { a: `${mockReferencedGuid}.Outputs` }]
                };

                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'originalAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    entryConditions: [],
                    inputParameters: [{}],
                    outputParameters: [{}]
                };

                const event = {
                    type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                    detail: {
                        value: {
                            actionName: 'anotherAction',
                            actionType: ACTION_TYPE.CREATE_WORK_ITEM
                        },
                        error: null,
                        actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(updateProperties).toHaveBeenCalledWith(stateWithReferencedAction, {
                    action: {
                        elementType: ELEMENT_TYPE.ACTION_CALL,
                        actionType: ACTION_TYPE.CREATE_WORK_ITEM,
                        actionName: stateWithReferencedAction.action.actionName.value
                    }
                });
            });

            it('shows the warning modal', () => {
                const stateWithReferencedAction = {
                    guid: mockReferencedGuid,
                    action: {
                        actionName: { value: 'anotherAction' },
                        actionType: 'createWorkItem',
                        elementType: 'ActionCall'
                    },
                    actionName: { value: 'anotherAction' }
                };

                const event = {
                    type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                    detail: {
                        actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP,
                        value: {
                            actionName: 'someAction'
                        },
                        error: null
                    }
                };

                stageStepReducer(stateWithReferencedAction, event);

                expect(invokeModal).toHaveBeenCalled();
            });
        });
    });

    describe('PropertyChangedEvent', () => {
        it('updates the property', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'foo',
                    value: 'newValue',
                    error: null
                }
            };

            const newState = stageStepReducer(originalState, event);
            const hydratedValue = {
                value: event.detail.value,
                error: null
            };

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                [event.detail.propertyName]: hydratedValue
            });

            expect(newState.foo).toEqual(hydratedValue);
            expect(newState).not.toBe(originalStateWithEntryCriteria);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'foo',
                    value: 'newValue',
                    error: null
                }
            };

            const newState = stageStepReducer(originalState, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });

        it('calls validateProperty when property is null', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'foo',
                    value: 'newValue',
                    error: null
                }
            };

            stageStepReducer(originalState, event);

            expect(new Validation().validateProperty).toHaveBeenCalledWith(
                event.detail.propertyName,
                event.detail.value,
                null
            );
        });
    });

    describe('DeleteOrchestrationActionEvent', () => {
        it('deletes entry determination', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.ENTRY
                }
            };
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);
            expect(newState.entryAction).toBe(null);
            expect(newState.entryActionName).toBe(null);
            expect(newState.entryActionType).toBe(null);
            expect(newState.entryActionInputParameters).toStrictEqual([]);
        });

        it('deletes exit determination', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            };
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);
            expect(newState.exitAction).toBe(null);
            expect(newState.exitActionName).toBe(null);
            expect(newState.exitActionType).toBe(null);
            expect(newState.exitActionInputParameters).toStrictEqual([]);
        });

        it('has no effect', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            };
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);
            expect(newState).toBe(originalStateWithEntryExitActions);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            };
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('DeleteAllConditionsEvent', () => {
        it('should set all entry conditions to null', () => {
            const event = {
                type: DeleteAllConditionsEvent.EVENT_NAME
            };
            const newState = stageStepReducer(originalStateWithEntryCriteria, event);
            expect(newState.entryConditions).toBe(null);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: DeleteAllConditionsEvent.EVENT_NAME
            };
            const newState = stageStepReducer(originalStateWithEntryCriteria, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('CreateEntryConditionsEvent', () => {
        it('should reset entry conditions to an empty list', () => {
            const event = {
                type: CreateEntryConditionsEvent.EVENT_NAME
            };

            expect(originalState.entryConditions).toStrictEqual(null);
            const newState = stageStepReducer(originalState, event);
            expect(newState.entryConditions).toStrictEqual([]);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: CreateEntryConditionsEvent.EVENT_NAME
            };

            const newState = stageStepReducer(originalState, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('mergeParameters', () => {
        it('only updates step parameters', () => {
            // Arrange
            const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
                detail: {
                    parameters: [
                        { name: 'ip1', isInput: true },
                        { name: 'ip2', isInput: true }
                    ],
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.STEP
                }
            });

            originalState = updateProperties(originalStateWithEntryExitActions, { inputParameters: [] });
            // Act
            const newState = stageStepReducer(originalState, event);

            // Assert
            expect(originalState.inputParameters.length).toStrictEqual(0);
            expect(newState.inputParameters.length).toStrictEqual(2);
        });

        it('only updates entry parameters', () => {
            // Arrange
            const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
                detail: {
                    parameters: [
                        { name: 'ip1', isInput: true },
                        { name: 'ip2', isInput: true }
                    ],
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.ENTRY
                }
            });

            originalState = updateProperties(originalStateWithEntryExitActions, { entryActionInputParameters: [] });
            // Act
            const newState = stageStepReducer(originalState, event);

            // Assert
            expect(originalState.entryActionInputParameters.length).toStrictEqual(0);
            expect(newState.entryActionInputParameters.length).toStrictEqual(2);
        });

        it('only updates exit parameters', () => {
            // Arrange
            const event = new CustomEvent(MERGE_WITH_PARAMETERS, {
                detail: {
                    parameters: [
                        { name: 'ip1', isInput: true },
                        { name: 'ip2', isInput: true }
                    ],
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            });

            originalState = updateProperties(originalStateWithEntryExitActions, { exitActionInputParameters: [] });
            // Act
            const newState = stageStepReducer(originalState, event);

            // Assert
            expect(originalState.exitActionInputParameters.length).toStrictEqual(0);
            expect(newState.exitActionInputParameters.length).toStrictEqual(2);
        });
    });

    describe('updateParameterItem', () => {
        it('updates a parameter value in entry inputs', () => {
            // Arrange
            const newVal = '$GlobalConstant.EmptyString';
            const event = new CustomEvent(UpdateParameterItemEvent.EVENT_NAME, {
                detail: {
                    error: null,
                    isInput: true,
                    name: 'TestVar',
                    rowIndex: 'entryIp1Guid',
                    value: newVal,
                    valueDataType: 'String'
                }
            });

            // Act
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            // Assert
            expect(newState.entryActionInputParameters[0].value.value).toStrictEqual(newVal);
        });

        it('calls removeAllUnsetParameters', () => {
            const newVal = '$GlobalConstant.EmptyString';
            const event = new CustomEvent(UpdateParameterItemEvent.EVENT_NAME, {
                detail: {
                    error: null,
                    isInput: true,
                    name: 'TestVar',
                    rowIndex: 'entryIp1Guid',
                    value: newVal,
                    valueDataType: 'String'
                }
            });

            // Act
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('removeUnsetParameters', () => {
        it('removes from entry parameters', () => {
            // Arrange
            const event = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
                detail: {
                    rowIndex: 'entryIp3Guid'
                }
            });

            // Act
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            // Assert
            expect(originalStateWithEntryExitActions.entryActionInputParameters.length).toStrictEqual(3);
            expect(newState.entryActionInputParameters.length).toStrictEqual(2);
        });

        it('removes from exit parameters', () => {
            // Arrange
            const event = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
                detail: {
                    rowIndex: 'exitIp3Guid'
                }
            });

            // Act
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            // Assert
            expect(originalStateWithEntryExitActions.exitActionInputParameters.length).toStrictEqual(3);
            expect(newState.exitActionInputParameters.length).toStrictEqual(2);
        });

        it('calls removeAllUnsetParameters', () => {
            const event = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
                detail: {
                    rowIndex: 'exitIp3Guid'
                }
            });

            // Act
            const newState = stageStepReducer(originalStateWithEntryExitActions, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    it('VALIDATE_ALL calls validateAll', () => {
        const event = new CustomEvent(VALIDATE_ALL, {});
        stageStepReducer(originalStateWithEntryExitActions, event);

        const validation = new Validation();
        expect(validation.validateAll).toHaveBeenCalledWith(originalStateWithEntryExitActions, {});
    });
});
