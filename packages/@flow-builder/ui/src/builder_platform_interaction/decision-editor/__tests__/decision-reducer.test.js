import {decisionReducer} from '../decision-reducer';
import {
    PropertyChangedEvent,
    AddConditionEvent,
    DeleteConditionEvent,
    UpdateConditionEvent
} from 'builder_platform_interaction-events';
import {PROPERTY_EDITOR_ACTION} from 'builder_platform_interaction-actions';

describe('decision-reducer', () => {
    let originalState;

    beforeEach(() => {
        originalState = {
            outcomes: [
                {
                    guid: '456',
                    conditions: [{}]
                },
                {
                    guid: '123',
                    conditions: [{}]
                },
            ]
        };
    });

    describe('PropertyChangedEvent', () => {
        describe('without guid (decision)', () => {
            let decisionPropertyChangedEvent;
            beforeEach(() => {
                decisionPropertyChangedEvent = new PropertyChangedEvent('label', 'val', 'anError');
            });

            it('to return a new state object', () => {
                const newState = decisionReducer(originalState, decisionPropertyChangedEvent);

                expect(newState).not.toBe(originalState);
            });

            it('to update the specified property on only the decision', () => {
                const newState = decisionReducer(originalState, decisionPropertyChangedEvent);

                expect(newState.label.value).toEqual('val');
                expect(newState.label.error).toEqual('anError');
                expect(newState.outcomes[0].label).toBeUndefined();
                expect(newState.outcomes[1].label).toBeUndefined();
            });
        });
        describe('with guid (outcome)', () => {
            let outcomePropertyChangedEvent;

            beforeEach(() => {
                outcomePropertyChangedEvent =
                    new PropertyChangedEvent('label', 'val', 'anError', originalState.outcomes[1].guid);
            });

            it('to return a new state object', () => {
                const newState = decisionReducer(originalState, outcomePropertyChangedEvent);

                expect(newState).not.toBe(originalState);
            });

            it('to update the specified property on only the specified outcome', () => {
                const newState = decisionReducer(originalState, outcomePropertyChangedEvent);

                expect(newState.label).toBeUndefined();
                expect(newState.outcomes[0].label).toBeUndefined();
                expect(newState.outcomes[1].label.value).toEqual('val');
                expect(newState.outcomes[1].label.error).toEqual('anError');
            });
        });
    });

    describe('Add Outcome', () => {
        it('adds outcomes', () => {
            const mockGuid = 'ABC';

            const storeLib = require.requireActual('builder_platform_interaction-store-lib');
            storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);

            const addOutcomeAction = {type:PROPERTY_EDITOR_ACTION.ADD_DECISION_OUTCOME};

            let newState = decisionReducer(originalState, addOutcomeAction);

            expect(newState.outcomes).toHaveLength(3);
            expect(newState.outcomes[2].label.value).toEqual(mockGuid);

            newState = decisionReducer(newState, addOutcomeAction);

            expect(newState.outcomes).toHaveLength(4);
            expect(newState.outcomes[3].label.value).toEqual(mockGuid);
        });
    });

    describe('AddConditionEvent', () => {
        it('adds valid condition with rowIndex', () => {
            const mockGuid = 'ABC';

            const storeLib = require.requireActual('builder_platform_interaction-store-lib');
            storeLib.generateGuid = jest.fn().mockReturnValue(mockGuid);

            const outcome = originalState.outcomes[1];

            const addConditionEvent  =
                new AddConditionEvent(outcome.guid);
            const newState = decisionReducer(originalState, addConditionEvent);

            const newOutcome = newState.outcomes[1];

            expect(newOutcome.conditions).toHaveLength(2);
            expect(newOutcome.conditions[1].rowIndex).toEqual(mockGuid);
        });

        it('does not add condition to other outcomes', () => {
            const addConditionEvent  =
                new AddConditionEvent(originalState.outcomes[0].guid);
            const newState = decisionReducer(originalState, addConditionEvent);

            expect(newState.outcomes[1].conditions).toHaveLength(1);
        });
    });

    describe('DeleteConditionEvent', () => {
        it('deletes condition based on index', () => {
            const deleteConditionEvent  =
                new DeleteConditionEvent(originalState.outcomes[0].guid, 0);
            const newState = decisionReducer(originalState, deleteConditionEvent);

            const newOutcome = newState.outcomes[0];

            expect(newOutcome.conditions).toHaveLength(0);
        });

        it('does not delete condition from other outcomes', () => {
            const deleteConditionEvent  =
                new DeleteConditionEvent(originalState.outcomes[0].guid, 0);
            const newState = decisionReducer(originalState, deleteConditionEvent);

            expect(newState.outcomes[1].conditions).toHaveLength(1);
        });
    });

    describe('UpdateConditionEvent', () => {
        it('updates condition based on index', () => {
            const updateConditionEvent  =
                new UpdateConditionEvent(originalState.outcomes[0].guid, 0, 'name', 'val', 'err');
            const newState = decisionReducer(originalState, updateConditionEvent);

            const newOutcome = newState.outcomes[0];
            const modifiedCondition = newOutcome.conditions[0];

            expect(newOutcome.conditions).toHaveLength(1);
            expect(modifiedCondition[updateConditionEvent.propertyName]).toEqual({
                value: updateConditionEvent.value,
                error: updateConditionEvent.error
            });
        });

        it('does not delete condition from other outcomes', () => {
            const updateConditionEvent  =
                new UpdateConditionEvent(originalState.outcomes[0].guid, 0, 'name', 'val', 'err');
            const newState = decisionReducer(originalState, updateConditionEvent);

            const newOutcome = newState.outcomes[1];

            expect(newOutcome.conditions).toEqual(originalState.outcomes[1].conditions);
        });
    });
});
