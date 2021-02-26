// @ts-nocheck
import {
    DeleteOrchestrationActionEvent,
    OrchestrationActionValueChangedEvent,
    PropertyChangedEvent
} from 'builder_platform_interaction/events';
import { updateProperties } from 'builder_platform_interaction/dataMutationLib';
import { orchestratedStageReducer } from '../orchestratedStageReducer';
import { ORCHESTRATED_ACTION_CATEGORY } from 'builder_platform_interaction/events';
import { ACTION_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import { MERGE_WITH_PARAMETERS, REMOVE_UNSET_PARAMETERS } from 'builder_platform_interaction/calloutEditorLib';

const mockReferencedGuid = 'referencedItemGuid';

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
        getValueFromHydratedItem: actual.getValueFromHydratedItem
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
        it('updates the action', () => {
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

            orchestratedStageReducer(originalState, event);

            expect(updateProperties).toHaveBeenCalledWith(originalState, {
                exitAction: {
                    elementType: ELEMENT_TYPE.ACTION_CALL,
                    actionType: ACTION_TYPE.FLOW,
                    actionName: event.detail.value.actionName
                },
                exitActionName: event.detail.value.actionName,
                exitActionInputParameters: [],
                exitActionOutputParameters: []
            });
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
    });
});
