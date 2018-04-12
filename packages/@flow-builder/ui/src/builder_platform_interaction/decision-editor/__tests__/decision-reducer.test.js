import {decisionReducer} from '../decision-reducer';
import {
    PropertyChangedEvent,
} from 'builder_platform_interaction-events';

describe('decision-reducer', () => {
    let originalState;

    beforeEach(() => {
        originalState = {
            outcomes: [
                { guid: '456' },
                { guid: '123' },
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
});