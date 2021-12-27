// @ts-nocheck
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import {
    DeleteOrchestrationActionEvent,
    DeleteParameterItemEvent,
    ORCHESTRATED_ACTION_CATEGORY,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent,
    UpdateEntryExitCriteriaEvent,
    UpdateParameterItemEvent
} from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE, StageExitCriteria } from 'builder_platform_interaction/flowMetadata';
import { removeAllUnsetParameters } from 'builder_platform_interaction/orchestratedStageAndStepReducerUtils';
import { Validation } from 'builder_platform_interaction/validation';
import { VALIDATE_ALL } from 'builder_platform_interaction/validationRules';
import { orchestratedStageReducer } from '../orchestratedStageReducer';

const mockReferencedGuid = 'referencedItemGuid';

let mockHydrated;

jest.mock('builder_platform_interaction/orchestratedStageAndStepReducerUtils', () => {
    const actual = jest.requireActual('builder_platform_interaction/orchestratedStageAndStepReducerUtils');
    return Object.assign({}, actual, {
        removeAllUnsetParameters: jest.fn((state) => state)
    });
});

jest.mock('builder_platform_interaction/validation', () => {
    const mockValidateAll = jest.fn((e) => e);
    const mockValidateProperty = jest.fn(() => {
        return null;
    });

    const Validation = function () {
        return {
            validateAll: mockValidateAll,
            validateProperty: mockValidateProperty,
            finalizedRules: {
                someRules: true
            }
        };
    };

    return {
        Validation
    };
});

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

describe('OrchestratedStageReducer', () => {
    let originalState, originalStateWithExitAction;
    beforeEach(() => {
        originalState = {
            guid: 'itemGuid',
            exitActionInputParameters: []
        };

        originalStateWithExitAction = {
            guid: 'itemGuid',
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

    describe('actionChanged', () => {
        it('updates the exit evaluation flow action', () => {
            const event = {
                type: OrchestrationActionValueChangedEvent.EVENT_NAME,
                detail: {
                    value: {
                        actionName: 'someAction',
                        actionType: ACTION_TYPE.EVALUATION_FLOW
                    },
                    error: null,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            };

            orchestratedStageReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                exitAction: {
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: event.detail.value.actionType,
                    actionName: event.detail.value.actionName
                },
                exitActionError: event.detail.error,
                exitActionInputParameters: [],
                exitActionOutputParameters: []
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

            const newState = orchestratedStageReducer(originalState, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('deleteDeterminationAction', () => {
        it('deletes exit determination', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            };
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);
            expect(newState.exitAction).toBe(null);
            expect(newState.exitActionName).toBe(null);
            expect(newState.exitActionType).toBe(null);
            expect(newState.exitActionInputParameters).toStrictEqual([]);
        });
        it('calls removeAllUnsetParameters', () => {
            const event = {
                type: DeleteOrchestrationActionEvent.EVENT_NAME,
                detail: {
                    guid: mockReferencedGuid,
                    actionCategory: ORCHESTRATED_ACTION_CATEGORY.EXIT
                }
            };
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('orchestratedStagePropertyChanged', () => {
        it('updates the property', () => {
            const event = {
                type: PropertyChangedEvent.EVENT_NAME,
                detail: {
                    propertyName: 'foo',
                    value: 'newValue',
                    error: null
                }
            };

            const newState = orchestratedStageReducer(originalState, event);
            const hydratedValue = {
                value: event.detail.value,
                error: null
            };

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                [event.detail.propertyName]: hydratedValue
            });

            expect(newState.foo).toEqual(hydratedValue);
            expect(newState).not.toBe(originalStateWithExitAction);
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

            const newState = orchestratedStageReducer(originalState, event);

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

            orchestratedStageReducer(originalState, event);

            expect(new Validation().validateProperty).toHaveBeenCalledWith(
                event.detail.propertyName,
                event.detail.value,
                null
            );
        });
    });

    describe('mergeParameters', () => {
        it('only updates  exit parameters', () => {
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

            // Act
            const newState = orchestratedStageReducer(originalState, event);

            // Assert
            expect(originalState.exitActionInputParameters.length).toStrictEqual(0);
            expect(newState.exitActionInputParameters.length).toStrictEqual(2);
        });
    });

    describe('removeUnsetParametersWithProxy', () => {
        it('removes from exit parameters', () => {
            // Arrange
            const event = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
                detail: {
                    rowIndex: 'exitIp3Guid'
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            // Assert
            expect(originalStateWithExitAction.exitActionInputParameters.length).toStrictEqual(3);
            expect(newState.exitActionInputParameters.length).toStrictEqual(2);
        });
        it('calls removeAllUnsetParameters', () => {
            const event = new CustomEvent(REMOVE_UNSET_PARAMETERS, {
                detail: {
                    rowIndex: 'exitIp3Guid'
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('VALIDATE_ALL', () => {
        it('VALIDATE_ALL calls validateAll', () => {
            const event = new CustomEvent(VALIDATE_ALL, {});
            orchestratedStageReducer(originalStateWithExitAction, event);

            const validation = new Validation();
            expect(validation.validateAll).toHaveBeenCalledWith(
                originalStateWithExitAction,
                new Validation().finalizedRules
            );
        });

        it('merge exitActionError to the actionName of exitAction', () => {
            const state = {
                exitAction: {
                    actionName: {
                        value: 'a',
                        error: null
                    }
                },
                exitActionError: {
                    value: 'someError',
                    erorr: null
                }
            };
            const event = new CustomEvent(VALIDATE_ALL, {});
            const newState = orchestratedStageReducer(state, event);

            expect(newState.exitAction.actionName.error).toEqual('someError');
        });
    });

    describe('updateParameterItem', () => {
        it('updates a parameter value in exit action inputs', () => {
            // Arrange
            const newVal = '$GlobalConstant.EmptyString';
            const event = new CustomEvent(UpdateParameterItemEvent.EVENT_NAME, {
                detail: {
                    error: null,
                    isInput: true,
                    name: 'TestVar',
                    rowIndex: originalStateWithExitAction.exitActionInputParameters[0].rowIndex,
                    value: newVal,
                    valueDataType: 'String'
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            // Assert
            expect(newState.exitActionInputParameters[0].value.value).toStrictEqual(newVal);
        });

        it('calls removeAllUnsetParameters', () => {
            // Arrange
            const newVal = '$GlobalConstant.EmptyString';
            const event = new CustomEvent(UpdateParameterItemEvent.EVENT_NAME, {
                detail: {
                    error: null,
                    isInput: true,
                    name: 'TestVar',
                    rowIndex: originalStateWithExitAction.exitActionInputParameters[0].rowIndex,
                    value: newVal,
                    valueDataType: 'String'
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('deleteParameterItem', () => {
        it('deletes a parameter value in exit action inputs', () => {
            // Arrange
            const deletedParam = originalStateWithExitAction.exitActionInputParameters[0];
            const event = new CustomEvent(DeleteParameterItemEvent.EVENT_NAME, {
                detail: {
                    isInput: true,
                    name: deletedParam.name.value,
                    rowIndex: deletedParam.rowIndex
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            // Assert
            expect(newState.exitActionInputParameters).toHaveLength(
                originalStateWithExitAction.exitActionInputParameters.length - 1
            );
            expect(newState.exitActionInputParameters[0]).toBe(
                originalStateWithExitAction.exitActionInputParameters[1]
            );
        });

        it('calls removeAllUnsetParameters', () => {
            // Arrange
            const deletedParam = originalStateWithExitAction.exitActionInputParameters[0];
            const event = new CustomEvent(DeleteParameterItemEvent.EVENT_NAME, {
                detail: {
                    isInput: true,
                    name: deletedParam.name.value,
                    rowIndex: deletedParam.rowIndex
                }
            });

            // Act
            const newState = orchestratedStageReducer(originalStateWithExitAction, event);

            expect(removeAllUnsetParameters).toHaveBeenCalledWith(newState);
        });
    });

    describe('updateExitCriteria', () => {
        it('should change exitCriteria to same value', () => {
            const firstState = {
                ...originalState,
                exitCriteria: {
                    value: StageExitCriteria.ON_STEP_COMPLETE
                }
            };
            expect(firstState.exitCriteria.value).toStrictEqual(StageExitCriteria.ON_STEP_COMPLETE);

            const event = new UpdateEntryExitCriteriaEvent(
                ORCHESTRATED_ACTION_CATEGORY.EXIT,
                StageExitCriteria.ON_DETERMINATION_COMPLETE
            );
            const newState = orchestratedStageReducer(firstState, event);
            expect(newState.exitCriteria.value).toStrictEqual(StageExitCriteria.ON_DETERMINATION_COMPLETE);
        });
    });
});
