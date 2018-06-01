import reducer from '../connectors-reducer';
import { MODIFY_DECISION_WITH_OUTCOMES } from 'builder_platform_interaction-actions';

const connectorsState = [{
    guid: 'c1',
    label: 'l1'
}, {
    guid: 'c2',
    label: 'l2'
}];

describe('connectors-reducer', () => {
    describe('MODIFY_DECISION_WITH_OUTCOMES', () => {
        it('with no deleted connectors does nothing', () => {
            const payloadWithNoDeletedComponents = {
                decision: {},
                outcomes: [{}],
                deletedOutcomes: [],
            };

            expect(reducer(connectorsState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: payloadWithNoDeletedComponents
            })).toEqual(connectorsState);
        });

        describe('with deleted outcome', () => {
            it('with no connections does nothing', () => {
                const payloadWithDeletedOutcomeButNoConnection = {
                    decision: {},
                    outcomes: [{}],
                    deletedOutcomes: [{}],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithDeletedOutcomeButNoConnection
                })).toEqual(connectorsState);
            });

            it('with connections deletes the connection', () => {
                const payloadWithDeletedOutcomeWithConnection = {
                    decision: {},
                    outcomes: [{}],
                    deletedOutcomes: [{
                        connectorReferences: [connectorsState[0].guid]
                    }],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithDeletedOutcomeWithConnection
                })).toEqual([connectorsState[1]]);
            });
        });
    });
});