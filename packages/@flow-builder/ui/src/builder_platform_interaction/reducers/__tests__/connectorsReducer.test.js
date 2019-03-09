import reducer from "../connectorsReducer";
import {
    ADD_CONNECTOR,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    DELETE_ELEMENT,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_WAIT_WITH_WAIT_EVENTS
} from "builder_platform_interaction/actions";

const connectorsState = [{
    guid: 'c1',
    label: 'l1',
    childSource: 'childGuid1'
}, {
    guid: 'c2',
    label: 'l2'
}];

const newConnectorStateAfterAddingConnector = [{
    guid: 'c1',
    label: 'l1',
    childSource: 'childGuid1'
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
    childSource: 'childGuid1'
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

    function getElementWithConfigProp(guid, isSelected) {
        const element = {
            guid,
            config: {
                isSelected
            }
        };
        return element;
    }

    describe('Select Connectors on Canvas', () => {
        it('With state set to undefined & action type is SELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {type: SELECT_ON_CANVAS, payload: {guid: 'guid1' }});
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        describe('Connector being clicked upon', () => {
            it('When the connector is deselected, the connector gets selected.', () => {
                const connectorState = [getElementWithConfigProp('selectedGUID', false)];
                const newConnectorState = reducer(connectorState, {type: SELECT_ON_CANVAS, payload: {guid: 'selectedGUID' }});
                const updatedConnectors = [getElementWithConfigProp('selectedGUID', true)];
                expect(newConnectorState).toEqual(updatedConnectors);
            });

            it('When the connector is selected, the connector stays selected.', () => {
                const connectorState = [getElementWithConfigProp('selectedGUID', true)];
                const newConnectorState = reducer(connectorState, {type: SELECT_ON_CANVAS, payload: {guid: 'selectedGUID' }});
                const updatedConnectors = [getElementWithConfigProp('selectedGUID', true)];
                expect(newConnectorState).toEqual(updatedConnectors);
            });
        });

        describe('Other connectors that are not being clicked upon', () => {
            it('When the connector is selected, The connector gets deselected.', () => {
                const connectorState = [
                    getElementWithConfigProp('selectedGUID', true),
                    getElementWithConfigProp('guid2', true)
                ];
                const updatedConnectors = [
                    getElementWithConfigProp('selectedGUID', true),
                    getElementWithConfigProp('guid2', false)
                ];
                const newConnectorState = reducer(connectorState, {type: SELECT_ON_CANVAS, payload: {guid: 'selectedGUID' }});
                expect(newConnectorState).toEqual(updatedConnectors);
            });

            it('When the connector is deselected, the connector stays deselected.', () => {
                const connectorState = [
                    getElementWithConfigProp('selectedGUID', true),
                    getElementWithConfigProp('guid2', false)
                ];
                const updatedConnectors = [
                    getElementWithConfigProp('selectedGUID', true),
                    getElementWithConfigProp('guid2', false)
                ];
                const newConnectorState = reducer(connectorState, {type: SELECT_ON_CANVAS, payload: {guid: 'selectedGUID' }});
                expect(newConnectorState).toEqual(updatedConnectors);
            });
        });
    });

    describe('Toggle Connectors on Canvas', () => {
        it('With state set to undefined & action type is TOGGLE_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {type: TOGGLE_ON_CANVAS, payload: {guid: 'guid1' }});
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When the connector is deselected, the connector gets selected.', () => {
            const connectorState = [getElementWithConfigProp('toggledGUID', false)];
            const updatedConnectors = [getElementWithConfigProp('toggledGUID', true)];
            const newConnectorState = reducer(connectorState, {type: TOGGLE_ON_CANVAS, payload: {guid: 'toggledGUID' }});
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When the connector is selected, the connector gets deselected.', () => {
            const connectorState = [getElementWithConfigProp('toggledGUID', true)];
            const updatedConnectors = [getElementWithConfigProp('toggledGUID', false)];
            const newConnectorState = reducer(connectorState, {type: TOGGLE_ON_CANVAS, payload: {guid: 'toggledGUID' }});
            expect(newConnectorState).toEqual(updatedConnectors);
        });
    });

    describe('Deselect Connectors on Canvas', () => {
        it('With state set to undefined & action type is DESELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {type: DESELECT_ON_CANVAS, payload: {guid: 'guid1' }});
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('Clicking on the canvas with multiple connectors', () => {
            const connectorState = [
                getElementWithConfigProp('guid1', false),
                getElementWithConfigProp('guid2', true)
            ];
            const updatedConnectors = [
                getElementWithConfigProp('guid1', false),
                getElementWithConfigProp('guid2', false)
        ];
            const newConnectorState = reducer(connectorState, {type: DESELECT_ON_CANVAS});
            expect(newConnectorState).toEqual(updatedConnectors);
        });
    });

    describe('DELETE_ELEMENT', () => {
        it('with deleting one associated connector', () => {
            const payload = {
                connectorsToDelete: [{
                    guid: 'c2'
                }]
            };

            expect(reducer(connectorsState, {
                type: DELETE_ELEMENT,
                payload
            })).toEqual(newConnectorStateAfterConnectorDeletion);
        });
    });

    describe('MODIFY_DECISION_WITH_OUTCOMES', () => {
        it('with no deleted connectors does nothing', () => {
            const payloadWithNoDeletedComponents = {
                canvasElement: {},
                childElements: [{}],
                deletedChildElementGuids: [],
            };

            expect(reducer(connectorsState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: payloadWithNoDeletedComponents
            })).toEqual(connectorsState);
        });

        describe('with modified outcome label', () => {
            it('with no connections does nothing', () => {
                const payloadWithModifiedOutcomeButNoConnection = {
                    canvasElement: {},
                    childElements: [{
                        guid: 'outcomeWithNoConnection'
                    }],
                    deletedChildElementGuids: [],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithModifiedOutcomeButNoConnection
                })).toEqual(connectorsState);
            });

            it('with connection associatd with outcome updates the connection label', () => {
                const newLabel = 'new label!';

                const payloadWithModifiedOutcomeWithConnection = {
                    canvasElement: {},
                    childElements: [{
                        guid: 'childGuid1',
                        label: newLabel
                    }],
                    deletedChildElementGuids: [],
                };

                const updatedConnectors = reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithModifiedOutcomeWithConnection
                });

                expect(updatedConnectors[0].label).toEqual(newLabel);
            });
        });

        describe('with deleted outcome', () => {
            it('with no connections does nothing', () => {
                const payloadWithDeletedOutcomeButNoConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: [],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithDeletedOutcomeButNoConnection
                })).toEqual(connectorsState);
            });

            it('with connections deletes the connection', () => {
                const payloadWithDeletedOutcomeWithConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: ['childGuid1'],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithDeletedOutcomeWithConnection
                })).toEqual([connectorsState[1]]);
            });
        });
    });

    describe('MODIFY_WAIT_WITH_WAIT_EVENTS', () => {
        describe('with modified wait event label', () => {
            it('with no connections does nothing', () => {
                const payloadWithModifiedWaitEventButNoConnection = {
                    canvasElement: {},
                    childElements: [{
                        guid: 'waitEventWithNoConnection'
                    }],
                    deletedChildElementGuids: [],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: payloadWithModifiedWaitEventButNoConnection
                })).toEqual(connectorsState);
            });

            it('with connection associatd with wait event updates the connection label', () => {
                const newLabel = 'new label!';

                const payloadWithModifiedWaitEventButNoConnection = {
                    canvasElement: {},
                    childElements: [{
                        guid: 'childGuid1',
                        label: newLabel
                    }],
                    deletedChildElementGuids: [],
                };

                const updatedConnectors = reducer(connectorsState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: payloadWithModifiedWaitEventButNoConnection
                });

                expect(updatedConnectors[0].label).toEqual(newLabel);
            });
        });

        describe('with deleted wait event', () => {
            it('with no connections does nothing', () => {
                const payloadWithDeletedWaitEventButNoConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: [],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: payloadWithDeletedWaitEventButNoConnection
                })).toEqual(connectorsState);
            });

            it('with connections deletes the connection', () => {
                const payloadWithDeletedWaitEventWithConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: ['childGuid1'],
                };

                expect(reducer(connectorsState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: payloadWithDeletedWaitEventWithConnection
                })).toEqual([connectorsState[1]]);
            });
        });
    });
});