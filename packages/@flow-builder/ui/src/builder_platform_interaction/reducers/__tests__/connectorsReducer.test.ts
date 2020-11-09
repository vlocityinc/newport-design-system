// @ts-nocheck
import reducer from '../connectorsReducer';
import {
    ADD_CONNECTOR,
    SELECT_ON_CANVAS,
    TOGGLE_ON_CANVAS,
    DESELECT_ON_CANVAS,
    MARQUEE_SELECT_ON_CANVAS,
    DO_DUPLICATE,
    DELETE_ELEMENT,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    MODIFY_START_WITH_TIME_TRIGGERS,
    DECORATE_CANVAS,
    CLEAR_CANVAS_DECORATION
} from 'builder_platform_interaction/actions';
import { CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import immediateConnectorLabel from '@salesforce/label/FlowBuilderConnectorLabels.immediateConnectorLabel';

const connectorsState = [
    {
        guid: 'c1',
        label: 'l1',
        childSource: 'childGuid1'
    },
    {
        guid: 'c2',
        label: 'l2'
    }
];

const newConnectorStateAfterAddingConnector = [
    {
        guid: 'c1',
        label: 'l1',
        childSource: 'childGuid1'
    },
    {
        guid: 'c2',
        label: 'l2'
    },
    {
        guid: 'c3',
        label: 'l3'
    }
];

const newConnectorStateAfterConnectorDeletion = [
    {
        guid: 'c1',
        label: 'l1',
        childSource: 'childGuid1'
    }
];

const getConnectorWithConfigProp = (guid, isSelected) => {
    return {
        guid,
        config: {
            isSelected
        }
    };
};

describe('connectors-reducer', () => {
    describe('ADD_CONNECTOR', () => {
        it('with adding a connector', () => {
            const payload = {
                guid: 'c3',
                label: 'l3'
            };

            expect(
                reducer(connectorsState, {
                    type: ADD_CONNECTOR,
                    payload
                })
            ).toEqual(newConnectorStateAfterAddingConnector);
        });
    });

    describe('Select Connectors on Canvas', () => {
        it('With state set to undefined & action type is SELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {
                type: SELECT_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        describe('Connector being clicked upon', () => {
            it('When the connector is deselected, the connector gets selected.', () => {
                const connectorState = [getConnectorWithConfigProp('selectedGUID', false)];
                const newConnectorState = reducer(connectorState, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                const updatedConnectors = [getConnectorWithConfigProp('selectedGUID', true)];
                expect(newConnectorState).toEqual(updatedConnectors);
            });

            it('When the connector is selected, the connector stays selected.', () => {
                const connectorState = [getConnectorWithConfigProp('selectedGUID', true)];
                const newConnectorState = reducer(connectorState, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                const updatedConnectors = [getConnectorWithConfigProp('selectedGUID', true)];
                expect(newConnectorState).toEqual(updatedConnectors);
            });
        });

        describe('Other connectors that are not being clicked upon', () => {
            it('When the connector is selected, The connector gets deselected.', () => {
                const connectorState = [
                    getConnectorWithConfigProp('selectedGUID', true),
                    getConnectorWithConfigProp('guid2', true)
                ];
                const updatedConnectors = [
                    getConnectorWithConfigProp('selectedGUID', true),
                    getConnectorWithConfigProp('guid2', false)
                ];
                const newConnectorState = reducer(connectorState, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newConnectorState).toEqual(updatedConnectors);
            });

            it('When the connector is deselected, the connector stays deselected.', () => {
                const connectorState = [
                    getConnectorWithConfigProp('selectedGUID', true),
                    getConnectorWithConfigProp('guid2', false)
                ];
                const updatedConnectors = [
                    getConnectorWithConfigProp('selectedGUID', true),
                    getConnectorWithConfigProp('guid2', false)
                ];
                const newConnectorState = reducer(connectorState, {
                    type: SELECT_ON_CANVAS,
                    payload: { guid: 'selectedGUID' }
                });
                expect(newConnectorState).toEqual(updatedConnectors);
            });
        });
    });

    describe('Toggle Connectors on Canvas', () => {
        it('With state set to undefined & action type is TOGGLE_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {
                type: TOGGLE_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When the connector is deselected, the connector gets selected.', () => {
            const connectorState = [getConnectorWithConfigProp('toggledGUID', false)];
            const updatedConnectors = [getConnectorWithConfigProp('toggledGUID', true)];
            const newConnectorState = reducer(connectorState, {
                type: TOGGLE_ON_CANVAS,
                payload: { guid: 'toggledGUID' }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When the connector is selected, the connector gets deselected.', () => {
            const connectorState = [getConnectorWithConfigProp('toggledGUID', true)];
            const updatedConnectors = [getConnectorWithConfigProp('toggledGUID', false)];
            const newConnectorState = reducer(connectorState, {
                type: TOGGLE_ON_CANVAS,
                payload: { guid: 'toggledGUID' }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });
    });

    describe('Deselect Connectors on Canvas', () => {
        it('With state set to undefined & action type is DESELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {
                type: DESELECT_ON_CANVAS,
                payload: { guid: 'guid1' }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('Clicking on the canvas with multiple connectors', () => {
            const connectorState = [
                getConnectorWithConfigProp('guid1', false),
                getConnectorWithConfigProp('guid2', true)
            ];
            const updatedConnectors = [
                getConnectorWithConfigProp('guid1', false),
                getConnectorWithConfigProp('guid2', false)
            ];
            const newConnectorState = reducer(connectorState, {
                type: DESELECT_ON_CANVAS
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });
    });

    describe('Marquee Select Connectors on Canvas', () => {
        it('With state set to undefined & action type is DESELECT_ON_CANVAS should return the copy of original state', () => {
            const updatedConnectors = [];
            const newConnectorState = reducer(undefined, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    connectorGuidsToSelect: [],
                    connectorGuidsToDeselect: []
                }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When list of connectors to be selected and none to be deselected, should select the connectors in the guidsToSelect list', () => {
            const guidsToSelect = ['guid1', 'guid2'];
            const guidsToDeselect = [];
            const connectorState = [
                getConnectorWithConfigProp('guid1', false),
                getConnectorWithConfigProp('guid2', false),
                getConnectorWithConfigProp('guid3', false),
                getConnectorWithConfigProp('guid4', false)
            ];
            const updatedConnectors = [
                getConnectorWithConfigProp('guid1', true),
                getConnectorWithConfigProp('guid2', true),
                getConnectorWithConfigProp('guid3', false),
                getConnectorWithConfigProp('guid4', false)
            ];
            const newConnectorState = reducer(connectorState, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    connectorGuidsToSelect: guidsToSelect,
                    connectorGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When list of connectors to be deselected and none to be selected, should deslect the connectors in the guidsToDeselect list', () => {
            const guidsToSelect = [];
            const guidsToDeselect = ['guid1', 'guid2'];
            const connectorState = [
                getConnectorWithConfigProp('guid1', true),
                getConnectorWithConfigProp('guid2', true),
                getConnectorWithConfigProp('guid3', false),
                getConnectorWithConfigProp('guid4', false)
            ];
            const updatedConnectors = [
                getConnectorWithConfigProp('guid1', false),
                getConnectorWithConfigProp('guid2', false),
                getConnectorWithConfigProp('guid3', false),
                getConnectorWithConfigProp('guid4', false)
            ];
            const newConnectorState = reducer(connectorState, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    connectorGuidsToSelect: guidsToSelect,
                    connectorGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });

        it('When list of connectors to be selected and deselected, should select the connectors in guidsToSelect list and deselect the connectors in guidsToDeselect list', () => {
            const guidsToSelect = ['guid1', 'guid2'];
            const guidsToDeselect = ['guid3', 'guid4'];
            const connectorState = [
                getConnectorWithConfigProp('guid1', false),
                getConnectorWithConfigProp('guid2', false),
                getConnectorWithConfigProp('guid3', true),
                getConnectorWithConfigProp('guid4', true)
            ];
            const updatedConnectors = [
                getConnectorWithConfigProp('guid1', true),
                getConnectorWithConfigProp('guid2', true),
                getConnectorWithConfigProp('guid3', false),
                getConnectorWithConfigProp('guid4', false)
            ];
            const newConnectorState = reducer(connectorState, {
                type: MARQUEE_SELECT_ON_CANVAS,
                payload: {
                    connectorGuidsToSelect: guidsToSelect,
                    connectorGuidsToDeselect: guidsToDeselect
                }
            });
            expect(newConnectorState).toEqual(updatedConnectors);
        });
    });

    describe('DELETE_ELEMENT', () => {
        it('with deleting one associated connector', () => {
            const payload = {
                connectorsToDelete: [
                    {
                        guid: 'c2'
                    }
                ]
            };

            expect(
                reducer(connectorsState, {
                    type: DELETE_ELEMENT,
                    payload
                })
            ).toEqual(newConnectorStateAfterConnectorDeletion);
        });
    });

    describe('DO_DUPLICATE', () => {
        it('duplicates a connector', () => {
            const elementGuid = '123';
            const childElementGuid = '456';
            const duplicateElementGuid = '789';
            const duplicateChildElementGuid = '012';
            const targetElementGuid = '777';
            const duplicateTargetElementGuid = '42';

            const canvasElementGuidMap = {
                [elementGuid]: duplicateElementGuid,
                [targetElementGuid]: duplicateTargetElementGuid
            };
            const childElementGuidMap = {
                [childElementGuid]: duplicateChildElementGuid
            };
            const connectors = [
                {
                    label: 'foo',
                    source: elementGuid,
                    childSource: childElementGuid,
                    target: targetElementGuid,
                    type: CONNECTOR_TYPE.REGULAR,
                    config: {
                        isSelected: true
                    }
                }
            ];

            const payload = {
                canvasElementGuidMap,
                childElementGuidMap,
                connectorsToDuplicate: connectors
            };

            const newConnectorsState = reducer(connectors, {
                type: DO_DUPLICATE,
                payload
            });

            const expectedOriginalConnector = connectors[0];
            expectedOriginalConnector.config.isSelected = false;
            const expectedDuplicateConnector = {
                label: 'foo',
                source: duplicateElementGuid,
                childSource: duplicateChildElementGuid,
                target: duplicateTargetElementGuid,
                type: CONNECTOR_TYPE.REGULAR,
                config: {
                    isSelected: true
                }
            };
            expect(newConnectorsState).toContainEqual(expect.objectContaining(expectedOriginalConnector));
            expect(newConnectorsState).toContainEqual(expect.objectContaining(expectedDuplicateConnector));
        });
    });

    describe('MODIFY_DECISION_WITH_OUTCOMES', () => {
        it('with no deleted connectors does nothing', () => {
            const payloadWithNoDeletedComponents = {
                canvasElement: {},
                childElements: [{}],
                deletedChildElementGuids: []
            };

            expect(
                reducer(connectorsState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: payloadWithNoDeletedComponents
                })
            ).toEqual(connectorsState);
        });

        describe('with modified outcome label', () => {
            it('with no connections does nothing', () => {
                const payloadWithModifiedOutcomeButNoConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'outcomeWithNoConnection'
                        }
                    ],
                    deletedChildElementGuids: []
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: payloadWithModifiedOutcomeButNoConnection
                    })
                ).toEqual(connectorsState);
            });

            it('with connection associated with outcome updates the connection label', () => {
                const newLabel = 'new label!';

                const payloadWithModifiedOutcomeWithConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'childGuid1',
                            label: newLabel
                        }
                    ],
                    deletedChildElementGuids: []
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
                    deletedChildElementGuids: []
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: payloadWithDeletedOutcomeButNoConnection
                    })
                ).toEqual(connectorsState);
            });

            it('with connections deletes the connection', () => {
                const payloadWithDeletedOutcomeWithConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: ['childGuid1']
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_DECISION_WITH_OUTCOMES,
                        payload: payloadWithDeletedOutcomeWithConnection
                    })
                ).toEqual([connectorsState[1]]);
            });
        });
    });

    describe('MODIFY_WAIT_WITH_WAIT_EVENTS', () => {
        describe('with modified wait event label', () => {
            it('with no connections does nothing', () => {
                const payloadWithModifiedWaitEventButNoConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'waitEventWithNoConnection'
                        }
                    ],
                    deletedChildElementGuids: []
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                        payload: payloadWithModifiedWaitEventButNoConnection
                    })
                ).toEqual(connectorsState);
            });

            it('with connection associatd with wait event updates the connection label', () => {
                const newLabel = 'new label!';

                const payloadWithModifiedWaitEventButNoConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'childGuid1',
                            label: newLabel
                        }
                    ],
                    deletedChildElementGuids: []
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
                    deletedChildElementGuids: []
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                        payload: payloadWithDeletedWaitEventButNoConnection
                    })
                ).toEqual(connectorsState);
            });

            it('with connections deletes the connection', () => {
                const payloadWithDeletedWaitEventWithConnection = {
                    canvasElement: {},
                    childElements: [{}],
                    deletedChildElementGuids: ['childGuid1']
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                        payload: payloadWithDeletedWaitEventWithConnection
                    })
                ).toEqual([connectorsState[1]]);
            });
        });
    });

    describe('MODIFY_START_WITH_TIME_TRIGGERS', () => {
        describe('with modified time trigger label', () => {
            it('with no connections does nothing', () => {
                const payloadWithModifiedTimeTriggerButNoConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'timeTriggerWithNoConnection'
                        }
                    ],
                    deletedChildElementGuids: []
                };

                expect(
                    reducer(connectorsState, {
                        type: MODIFY_START_WITH_TIME_TRIGGERS,
                        payload: payloadWithModifiedTimeTriggerButNoConnection
                    })
                ).toEqual(connectorsState);
            });

            it('with connection associated with time trigger updates the connection label', () => {
                const newLabel = 'new label!';

                const payloadWithModifiedTimeTriggerWithConnection = {
                    canvasElement: {},
                    childElements: [
                        {
                            guid: 'childGuid1',
                            label: newLabel
                        }
                    ],
                    deletedChildElementGuids: []
                };

                const updatedConnectors = reducer(connectorsState, {
                    type: MODIFY_START_WITH_TIME_TRIGGERS,
                    payload: payloadWithModifiedTimeTriggerWithConnection
                });

                expect(updatedConnectors[0].label).toEqual(newLabel);
            });

            it('should convert Immediate connector to Regular and remove the label when shouldSupportTimeTriggers is false', () => {
                const originalConnectorState = [
                    {
                        type: CONNECTOR_TYPE.IMMEDIATE,
                        label: 'Immediate',
                        childSource: undefined
                    }
                ];

                const payload = {
                    canvasElement: {},
                    shouldSupportTimeTriggers: false,
                    startElementGuid: 'startGuid'
                };

                const updatedConnectors = reducer(originalConnectorState, {
                    type: MODIFY_START_WITH_TIME_TRIGGERS,
                    payload
                });

                expect(updatedConnectors[0].type).toEqual(CONNECTOR_TYPE.REGULAR);
                expect(updatedConnectors[0].label).toBeNull();
            });

            it('should convert Regular connector to Immediate and add the label when shouldSupportTimeTriggers is true', () => {
                const originalConnectorState = [
                    {
                        type: CONNECTOR_TYPE.REGULAR,
                        label: null,
                        childSource: undefined,
                        source: 'startGuid'
                    }
                ];

                const payload = {
                    canvasElement: {},
                    shouldSupportTimeTriggers: true,
                    startElementGuid: 'startGuid'
                };

                const updatedConnectors = reducer(originalConnectorState, {
                    type: MODIFY_START_WITH_TIME_TRIGGERS,
                    payload
                });

                expect(updatedConnectors[0].type).toEqual(CONNECTOR_TYPE.IMMEDIATE);
                expect(updatedConnectors[0].label).toEqual(immediateConnectorLabel);
            });

            it('should not convert Regular connector to Immediate when childSource is defined and shouldSupportTimeTriggers is true', () => {
                const originalConnectorState = [
                    {
                        type: CONNECTOR_TYPE.REGULAR,
                        label: null,
                        childSource: 'childGuid',
                        source: 'startGuid'
                    }
                ];

                const payload = {
                    canvasElement: {},
                    shouldSupportTimeTriggers: true,
                    startElementGuid: 'startGuid'
                };

                const updatedConnectors = reducer(originalConnectorState, {
                    type: MODIFY_START_WITH_TIME_TRIGGERS,
                    payload
                });

                expect(updatedConnectors[0].type).toEqual(CONNECTOR_TYPE.REGULAR);
            });
        });
    });

    describe('Decorate Canvas', () => {
        it('should highlight connectors if a connector match is found', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isSelected: true }
                },
                {
                    guid: 'c2',
                    source: 's2',
                    config: { isSelected: true }
                },
                {
                    guid: 'c3',
                    source: 's3',
                    config: { isHighlighted: true }
                }
            ];

            const expectedNewConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isHighlighted: true, isSelected: false }
                },
                {
                    guid: 'c2',
                    source: 's2',
                    config: { isSelected: false }
                },
                {
                    guid: 'c3',
                    source: 's3',
                    config: { isHighlighted: false }
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: DECORATE_CANVAS,
                    payload: {
                        connectorsToHighlight: [{ source: 's1', type: CONNECTOR_TYPE.REGULAR }]
                    }
                })
            ).toEqual(expectedNewConnectorsState);
        });

        it('should highlight connectors if a child connector match is found', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    childSource: 'cs1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: {}
                }
            ];

            const expectedNewConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    childSource: 'cs1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: { isHighlighted: true }
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: DECORATE_CANVAS,
                    payload: {
                        connectorsToHighlight: [{ source: 's1', childSource: 'cs1', type: CONNECTOR_TYPE.REGULAR }]
                    }
                })
            ).toEqual(expectedNewConnectorsState);
        });

        it('should not highlight connectors if no connector match on source is found', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: {}
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: DECORATE_CANVAS,
                    payload: {
                        connectorsToHighlight: [{ source: 's2', type: CONNECTOR_TYPE.REGULAR }]
                    }
                })
            ).toEqual(initialConnectorsState);
        });

        it('should not highlight connectors if no connector match on type is found', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: {}
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: DECORATE_CANVAS,
                    payload: {
                        connectorsToHighlight: [{ source: 's1', type: CONNECTOR_TYPE.FAULT }]
                    }
                })
            ).toEqual(initialConnectorsState);
        });

        it('should not highlight connectors if no connector match on child source is found', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    childSource: 'cs1',
                    type: CONNECTOR_TYPE.REGULAR,
                    config: {}
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: DECORATE_CANVAS,
                    payload: {
                        connectorsToHighlight: [{ source: 's1', childSource: 'cs2', type: CONNECTOR_TYPE.REGULAR }]
                    }
                })
            ).toEqual(initialConnectorsState);
        });
    });

    describe('Clear Canvas Decorate', () => {
        it('should de-highlight connectors', () => {
            const initialConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    config: { isHighlighted: true }
                },
                {
                    guid: 'c2',
                    source: 's2',
                    config: { isHighlighted: true }
                },
                {
                    guid: 'c3',
                    source: 's3',
                    config: {}
                }
            ];

            const expectedNewConnectorsState = [
                {
                    guid: 'c1',
                    source: 's1',
                    config: { isHighlighted: false }
                },
                {
                    guid: 'c2',
                    source: 's2',
                    config: { isHighlighted: false }
                },
                {
                    guid: 'c3',
                    source: 's3',
                    config: {}
                }
            ];

            expect(
                reducer(initialConnectorsState, {
                    type: CLEAR_CANVAS_DECORATION
                })
            ).toEqual(expectedNewConnectorsState);
        });
    });
});
