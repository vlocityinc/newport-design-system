import reducer from '../connectors-reducer';
import { ADD_CONNECTOR, DELETE_CANVAS_ELEMENT, MODIFY_DECISION_WITH_OUTCOMES } from 'builder_platform_interaction-actions';

const connectorsState = [{
    guid: 'c1',
    label: 'l1',
    childSource: 'o1'
}, {
    guid: 'c2',
    label: 'l2'
}];

const newConnectorStateAfterAddingConnector = [{
    guid: 'c1',
    label: 'l1',
    childSource: 'o1'
}, {
    guid: 'c2',
    label: 'l2'
}, {
    guid: 'c3',
    label: 'l3'
}];

const newConnectorStateAfterConnectorDeletion = [{
    guid: 'c1',
    label: 'l1',
    childSource: 'o1'
}];

describe('connectors-reducer', () => {
    describe('ADD_CONNECTOR', () => {
        it('with adding a connector', () => {
            const payload = {
                guid: 'c3',
                label: 'l3'
            };

            expect(reducer(connectorsState, {
                type: ADD_CONNECTOR,
                payload
            })).toEqual(newConnectorStateAfterAddingConnector);
        });
    });

    describe('DELETE_CANVAS_ELEMENT', () => {
        it('with deleting one associated connector', () => {
            const payload = {
                connectorsToDelete: [{
                    guid: 'c2'
                }]
            };

            expect(reducer(connectorsState, {
                type: DELETE_CANVAS_ELEMENT,
                payload
            })).toEqual(newConnectorStateAfterConnectorDeletion);
        });
    });

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
                        guid: 'o1'
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