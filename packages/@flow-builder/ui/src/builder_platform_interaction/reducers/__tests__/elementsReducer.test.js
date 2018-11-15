import elementReducer from "../elementsReducer";
import {
    UPDATE_FLOW,
    DELETE_ELEMENT,
    ADD_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT,
    ADD_CONNECTOR,
    ADD_RESOURCE,
    UPDATE_RESOURCE,
    DELETE_RESOURCE,
    UPDATE_VARIABLE_CONSTANT,
    MODIFY_DECISION_WITH_OUTCOMES,
    MODIFY_WAIT_WITH_WAIT_EVENTS,
    MODIFY_SCREEN_WITH_FIELDS
} from "builder_platform_interaction/actions";
import { CONNECTOR_TYPE, ELEMENT_TYPE } from "builder_platform_interaction/flowMetadata";

const newElements = {
    guid2: {
        org: 'salesforce'
    }
};

const oldElements = {
    guid1: {  name: 'ass1',
        label: 'assignment 1',
        description: 'desc 1',
        guid: 'guid1' }
};

describe('elements-reducer', () => {
    it('with state set to undefined & action type set to empty should return an empty object', () => {
        expect(elementReducer(undefined, {})).toEqual({});
    });

    it('with state set to defined & action type set to empty should return an current element state', () => {
        const newElementState = elementReducer(oldElements, {});
        expect(newElementState).toEqual(oldElements);
    });

    it('with state set to defined & action type set to UPDATE_FLOW should return the new element state with the new elements', () => {
        const newElementState = elementReducer(oldElements, {type: UPDATE_FLOW, payload: {elements: newElements }});
        expect(newElementState).toEqual(newElements);
    });

    it('with state set to defined & action type set to DELETE_RESOURCE should return the new element state with the excluded properties', () => {
        const omitProps = 'description';
        const oldProperties = {
            name: 'ass1',
            label: 'assignment 1',
            description: 'desc 1',
            guid: 'guid_1'
        };
        const newElementState = elementReducer(oldProperties, {type: DELETE_RESOURCE, payload: {selectedElementGUIDs: [omitProps] }});
        expect(newElementState).not.toHaveProperty('description');
        expect(newElementState).toHaveProperty('name');
        expect(newElementState).toHaveProperty('label');
    });

    it('with state set to undefined & action type set to DELETE_VARIABLE should return an empty object', () => {
        const propToOmit = 'description';
        const newElementState = elementReducer(undefined, {type: DELETE_RESOURCE, payload: {selectedElementGUIDs: [propToOmit] }});
        expect(newElementState).toEqual({});
    });

    it('with state set to defined & action type set to ADD_VARIABLE should return the new element state with the added property', () => {
        const newElementState = elementReducer(oldElements, {type: ADD_RESOURCE, payload: {guid: 'guid2', name: 'ass-3' }});
        expect(newElementState).toHaveProperty('guid2');
    });

    it('with state set to undefined & action type set to ADD_VARIABLE should return the new element state with the added property', () => {
        const newElementState = elementReducer(undefined, {type: ADD_RESOURCE, payload: {guid: 'guid2', name: 'ass-3' }});
        expect(newElementState).toHaveProperty('guid2');
    });

    it('with state set to defined & action type set to UPDATE_VARIABLE_CONSTANT should return the new element state with the updated property', () => {
        const updatedElements = {
            guid1: {
                name: 'ass-3',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid1'
            }
        };
        const newElementState = elementReducer(oldElements, {type: UPDATE_RESOURCE, payload: {guid: 'guid1', name: 'ass-3' }});
        expect(newElementState).toEqual(updatedElements);
    });

    it('with state set to defined & action type set to UPDATE_VARIABLE_CONSTANT should return the new element state with the new element', () => {
        const updatedElements = {
            guid1: {
                name: 'other ass',
                label: 'assignment 2',
                guid: 'guid1'
            }
        };
        const newElementState = elementReducer(oldElements, {type: UPDATE_VARIABLE_CONSTANT, payload: updatedElements.guid1});
        expect(newElementState).toEqual(updatedElements);
    });


    it('with state set to defined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
        const newElementState = elementReducer(oldElements, {type: ADD_CANVAS_ELEMENT, payload: {guid: 'guid2', name: 'ass-3' }});
        expect(newElementState).toHaveProperty('guid2');
        expect(newElementState.guid2).toHaveProperty('name');
        expect(newElementState.guid2.name).toEqual('ass-3');
    });

    it('with state set to undefined & action type is ADD_CANVAS_ELEMENT should add the new element', () => {
        const newElementState = elementReducer(undefined, {type: ADD_CANVAS_ELEMENT, payload: {guid: 'guid2', name: 'ass-3' }});
        expect(newElementState).toHaveProperty('guid2');
        expect(newElementState.guid2).toHaveProperty('name');
        expect(newElementState.guid2.name).toEqual('ass-3');
    });

    it('with state set to defined & action type is UPDATE_CANVAS_ELEMENT should update the existing element', () => {
        const newElementState = elementReducer(oldElements, {type: UPDATE_CANVAS_ELEMENT, payload: {guid: 'guid1', name: 'ass-3' }});
        expect(newElementState).toHaveProperty('guid1');
        expect(newElementState.guid1).toHaveProperty('name');
        expect(newElementState.guid1.name).toEqual('ass-3');
    });

    it('with state set to undefined & action type is UPDATE_CANVAS_ELEMENT should update the elements', () => {
        const updatedElements = {
            guid1: {  name: 'ass-3',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid1' }
        };
        const newElementState = elementReducer(oldElements, {type: UPDATE_CANVAS_ELEMENT, payload: {guid: 'guid1', name: 'ass-3' }});
        expect(newElementState).toEqual(updatedElements);
    });

    it('with state set to defined & action type is DELETE_ELEMENT should delete the property from the element object ', () => {
        const omitProps = ['guid_1'];
        const connector = {
            source: 'guid_2',
            type: 'DEFAULT',
        };
        const oldProperties = {
            'guid_1' : {
                name: 'ass1',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid_1'
            },
            'guid_2' : {
                name: 'des2',
                label: 'decision 2',
                description: 'desc 2',
                guid: 'guid_2',
                connectorCount: 1,
                availableConnections: []
            }
        };
        const newProperties = {
            'guid_2' : {
                name: 'des2',
                label: 'decision 2',
                description: 'desc 2',
                guid: 'guid_2',
                connectorCount: 0,
                availableConnections: [{
                    childReference: undefined,
                    type: 'DEFAULT'
                }]
            }
        };

        const newElementState = elementReducer(oldProperties, {type: DELETE_ELEMENT,
            payload : { selectedElementGUIDs: omitProps, connectorsToDelete:  [connector]}});
        expect(newElementState).toEqual(newProperties);
    });

    it('with state set to defined & action type is ADD_CONNECTOR should increment connectorCount and remove the connector from availableConnections', () => {
        const connector = {
            source: 'guid_1',
            type: 'REGULAR',
            childSource: 'outcome_1'
        };
        const oldProperties = {
            'guid_1' : {
                name: 'des1',
                label: 'decision 1',
                description: 'desc 1',
                guid: 'guid_1',
                outcomeReferences: ['outcome_1'],
                connectorCount: 0,
                availableConnections: [{
                    type: 'REGULAR',
                    childReference: 'outcome_1'
                }]
            }
        };
        const newProperties = {
            'guid_1' : {
                name: 'des1',
                label: 'decision 1',
                description: 'desc 1',
                guid: 'guid_1',
                outcomeReferences: ['outcome_1'],
                connectorCount: 1,
                availableConnections: []
            }
        };

        const newElementState = elementReducer(oldProperties, {type: ADD_CONNECTOR,
            payload : connector});
        expect(newElementState).toEqual(newProperties);
    });

    describe('MODIFY_DECISION_WITH_OUTCOMES', () => {
        let decision;
        let outcome;
        let originalState;

        beforeEach(() => {
            decision = {
                guid: 'decision1',
                label: 'origLabel',
                connectorCount: 2,
                maxConnections: 3,
                outcomeReferences: [{outcomeReference: 'outcome1'}],
                availableConnections: [
                    {
                        childReference: 'a',
                        type: 'DEFAULT'
                    },
                    {
                        childReference: 'b',
                        type: 'DEFAULT'
                    },
                ]
            };

            outcome = {
                guid: 'outcome1',
                label: 'outcomeLabel'
            };

            originalState = {
                [decision.guid]: decision,
                [outcome.guid]: outcome
            };
        });

        it('updates the decision element', () => {
            const updatedDecision = {
                guid: decision.guid,
                label: 'newLabel'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: {
                    decision: updatedDecision,
                    outcomes: [],
                    deletedOutcomes: [],

                }
            });

            const newDecision = newState[decision.guid];

            expect(newDecision).not.toBe(decision);

            expect(newDecision.guid).toEqual(updatedDecision.guid);
            expect(newDecision.label).toEqual(updatedDecision.label);
        });

        it('adds a new decision element', () => {
            const newDecision = {
                guid: 'newDecisionGuid',
                label: 'newLabel'
            };

            const newOutcome = {
                guid: 'outcome2',
                label: 'outcome2Label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: {
                    decision: newDecision,
                    outcomes: [newOutcome],
                    deletedOutcomes: [],
                }
            });

            const addedDecision = newState[newDecision.guid];

            expect(addedDecision.guid).toEqual(newDecision.guid);
            expect(addedDecision.label).toEqual(newDecision.label);

            const expectedAvailableConnections = [
                {type: CONNECTOR_TYPE.REGULAR, childReference: newOutcome.guid},
                {type: CONNECTOR_TYPE.DEFAULT}];
            expect(addedDecision.availableConnections).toHaveLength(2);
            expect(addedDecision.availableConnections).toContainEqual(expectedAvailableConnections[0]);
            expect(addedDecision.availableConnections).toContainEqual(expectedAvailableConnections[1]);
            expect(addedDecision.connectorCount).toEqual(0);
            expect(addedDecision.maxConnections).toEqual(2);
        });

        it('shallow copies existing availableConnections to a new array', () => {
            const updatedDecision = {
                guid: 'decision1',
                label: 'newLabel',
                outcomeReferences: [
                    {outcomeReference: 'outcome1'},
                    {outcomeReference: 'outcome2'},
                ],
            };

            const newOutcome = {
                guid: 'outcome2',
                label: 'outcome2Label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: {
                    decision: updatedDecision,
                    outcomes: [newOutcome],
                    deletedOutcomes: [],
                }
            });

            const decisionAfterUpdate = newState[updatedDecision.guid];

            expect(decisionAfterUpdate.availableConnections).toHaveLength(3);
            expect(decisionAfterUpdate.availableConnections).not.toBe(decision.availableConnections);
        });

        it('updates outcomes', () => {
            const updatedOutcome = {
                guid: outcome.guid,
                label: 'new outcome label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: {
                    decision,
                    outcomes: [updatedOutcome],
                    deletedOutcomes: [],

                }
            });

            const newOutcome = newState[outcome.guid];

            expect(newOutcome).not.toBe(outcome);

            expect(newOutcome.guid).toEqual(updatedOutcome.guid);
            expect(newOutcome.label).toEqual(updatedOutcome.label);
        });

        it('adds outcomes', () => {
            const outcome2 = {
                guid: 'newO',
                label: 'new outcome label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_DECISION_WITH_OUTCOMES,
                payload: {
                    decision,
                    outcomes: [outcome, outcome2],
                    deletedOutcomes: [],

                }
            });

            const newOutcome = newState[outcome2.guid];
            const newDecision = newState[decision.guid];

            expect(newOutcome).toEqual(outcome2);
            expect(newDecision.maxConnections).toEqual(3);
            expect(newDecision.availableConnections).toEqual([
                decision.availableConnections[0],
                decision.availableConnections[1],
                {type: CONNECTOR_TYPE.REGULAR, childReference: newOutcome.guid},
            ]);
        });

        describe('deleted outcomes', () => {
            it('are deleted', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        decision,
                        outcomes: [],
                        deletedOutcomes: [outcome],

                    }
                });

                expect(newState[outcome.guid]).toBeUndefined();
            });

            it('updates decision maxConnections', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        decision,
                        outcomes: [{}],
                        deletedOutcomes: [outcome],
                    }
                });

                expect(newState[decision.guid].maxConnections).toBe(2);
            });

            it('without connector does not change connectorCount', () => {
                decision.availableConnections = [{childReference: outcome.guid}];

                const newState = elementReducer(originalState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        decision,
                        outcomes: [],
                        deletedOutcomes: [outcome],

                    }
                });

                expect(newState[decision.guid].connectorCount).toBe(decision.connectorCount);
            });

            it('with connector decrements connectorCount', () => {
                decision.availableConnections = [];

                const newState = elementReducer(originalState, {
                    type: MODIFY_DECISION_WITH_OUTCOMES,
                    payload: {
                        decision,
                        outcomes: [],
                        deletedOutcomes: [outcome],

                    }
                });

                expect(newState[decision.guid].connectorCount).toBe(decision.connectorCount - 1);
            });
        });
    });

    describe('MODIFY_WAIT_WITH_EVENTS', () => {
        let wait;
        let event1, event2;
        let originalState;

        beforeEach(() => {
            wait = {
                guid: 'waitGuid',
                label: 'test wait element',
                connectorCount: 3,
                waitEventReferences: [{waitEventReference: 'waitEventReference1'}, {waitEventReference: 'waitEventReference2'}],
                availableConnections: [
                    {
                        childReference: 'a',
                        type: 'DEFAULT'
                    },
                    {
                        childReference: 'b',
                        type: 'DEFAULT'
                    },
                ]
            };

            event1 = {
                guid: 'waitEventReference1',
                label: 'event1 label'
            };

            event2 = {
                    guid: 'waitEventReference2',
                    label: 'event2 label'
                };

            originalState = {
                [wait.guid]: wait,
                [event1.guid]: event1,
                [event2.guid]: event2
            };
        });

        it('shallow copies existing availableConnections to a new array', () => {
            const updatedWait = {
                guid: 'waitGuid',
                label: 'newLabel',
                waitEventReferences: [
                    {waitEventReference: 'waitEventReference1'},
                    {waitEventReference: 'waitEventReference2'},
                ],
            };

            const newWaitEvent = {
                guid: 'waitEvent3',
                label: 'waitEvent3Label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                payload: {
                    wait: updatedWait,
                    waitEvents: [newWaitEvent],
                    deletedWaitEvents: [],
                }
            });

            const waitAfterUpdate = newState[updatedWait.guid];

            expect(waitAfterUpdate.availableConnections).toHaveLength(3);
            expect(waitAfterUpdate.availableConnections).not.toBe(wait.availableConnections);
        });

        describe('deleted event', () => {
            beforeEach(() => {
                // event1 will be deleted; the new wait node passed as argument to the reducer will looks this:
                wait = {
                    guid: 'waitGuid',
                    label: 'test wait element',
                    connectorCount: 3,
                    waitEventReferences: [{waitEventReference: 'waitEventReference2'}]
                };
            });
            it('is deleted', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: {
                        wait,
                        waitEvents: [],
                        deletedWaitEvents: [event1],
                    }
                });

                expect(newState[event1.guid]).toBeUndefined();
            });

            it('updates wait maxConnections', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: {
                        wait,
                        waitEvents: [event2],
                        deletedWaitEvents: [event1],
                    }
                });

                expect(newState[wait.guid].maxConnections).toBe(3);
            });

            it('without connector does not change connectorCount', () => {
                wait.availableConnections = [{childReference: event1.guid}];

                const newState = elementReducer(originalState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: {
                        wait,
                        waitEvents: [event2],
                        deletedWaitEvents: [event1],
                    }
                });

                expect(newState[wait.guid].connectorCount).toBe(wait.connectorCount);
            });

            it('with connector decrements connectorCount', () => {
                wait.availableConnections = [];

                const newState = elementReducer(originalState, {
                    type: MODIFY_WAIT_WITH_WAIT_EVENTS,
                    payload: {
                        wait,
                        waitEvents: [event2],
                        deletedWaitEvents: [event1],
                    }
                });

                expect(newState[wait.guid].connectorCount).toBe(wait.connectorCount - 1);
            });
        });
    });

    describe('delete wait', () => {
        let wait;
        let event1, event2;
        let originalState;

        beforeEach(() => {
            wait = {
                elementType: ELEMENT_TYPE.WAIT,
                guid: 'waitGuid',
                label: 'test wait element',
                waitEventReferences: [{waitEventReference: 'waitEventReference1'}, {waitEventReference: 'waitEventReference2'}],
            };

            event1 = {
                guid: 'waitEventReference1',
                label: 'event1 label'
            };

            event2 = {
                    guid: 'waitEventReference2',
                    label: 'event2 label'
                };

            originalState = {
                [wait.guid]: wait,
                [event1.guid]: event1,
                [event2.guid]: event2
            };
        });

        it('deletes the wait from the given state', () => {
            const newState = elementReducer(originalState, {
                type: DELETE_ELEMENT,
                payload: { selectedElementGUIDs: [wait.guid], connectorsToDelete: []},
            });
            expect(newState).not.toHaveProperty(wait.guid);
        });

        it('deletes any wait events in the wait element', () => {
            const newState = elementReducer(originalState, {
                type: DELETE_ELEMENT,
                payload: { selectedElementGUIDs: [wait.guid], connectorsToDelete: []},
            });
            expect(newState).not.toHaveProperty(event1.guid);
            expect(newState).not.toHaveProperty(event2.guid);
        });
    });

    describe('MODIFY_SCREEN_WITH_FIELDS', () => {
        let screen;
        let field;
        let originalState;

        beforeEach(() => {
            screen = {
                guid: 'screen1',
                label: 'origLabel',
                connectorCount: 1,
                maxConnections: 1,
                fieldReferences: [{fieldReference: 'field1'}]
            };

            field = {
                guid: 'field1',
                label: 'fieldLabel1'
            };

            originalState = {
                [screen.guid]: screen,
                [field.guid]: field
            };
        });

        it('updates the screen element', () => {
            const updatedScreen = {
                guid: screen.guid,
                label: 'newLabel'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload: {
                    screen: updatedScreen,
                    fields: [],
                    deletedFields: [],

                }
            });

            const newScreen = newState[screen.guid];

            expect(newScreen).not.toBe(screen);
            expect(newScreen.guid).toEqual(updatedScreen.guid);
            expect(newScreen.label).toEqual(updatedScreen.label);
        });

        it('adds a new screen element', () => {
            const newScreen = {
                guid: 'newScreenGuid',
                label: 'newLabel',
                connectorCount: 0,
                maxConnections: 1
            };
            const newField = {
                guid: 'field2',
                label: 'field2Label'
            };
            const newState = elementReducer(originalState, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload: {
                    screen: newScreen,
                    fields: [newField],
                    deletedFields: [],
                }
            });
            const addedScreen = newState[newScreen.guid];

            expect(addedScreen.guid).toEqual(newScreen.guid);
            expect(addedScreen.label).toEqual(newScreen.label);
            expect(addedScreen.connectorCount).toEqual(0);
            expect(addedScreen.maxConnections).toEqual(1);
        });

        it('updates screen fields', () => {
            const updatedField = {
                guid: field.guid,
                label: 'new field label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload: {
                    screen,
                    fields: [updatedField],
                    deletedFields: [],

                }
            });

            const newField = newState[field.guid];

            expect(newField).not.toBe(field);

            expect(newField.guid).toEqual(updatedField.guid);
            expect(newField.label).toEqual(updatedField.label);
        });

        it('adds screen fields', () => {
            const field2 = {
                guid: 'newO',
                label: 'new field label'
            };

            const newState = elementReducer(originalState, {
                type: MODIFY_SCREEN_WITH_FIELDS,
                payload: {
                    screen,
                    fields: [field, field2],
                    deletedFields: [],

                }
            });

            const newField = newState[field2.guid];
            const newScreen = newState[screen.guid];

            expect(newField).toEqual(field2);
            expect(newScreen.maxConnections).toEqual(1);
        });

        describe('deleted screen fields', () => {
            it('are deleted', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_SCREEN_WITH_FIELDS,
                    payload: {
                        screen,
                        fields: [],
                        deletedFields: [field],

                    }
                });

                expect(newState[field.guid]).toBeUndefined();
            });

            it('updates screen maxConnections', () => {
                const newState = elementReducer(originalState, {
                    type: MODIFY_SCREEN_WITH_FIELDS,
                    payload: {
                        screen,
                        fields: [{}],
                        deletedFields: [field],
                    }
                });

                expect(newState[screen.guid].maxConnections).toBe(1);
            });

            it('without connector does not change connectorCount', () => {
                screen.availableConnections = [{childReference: field.guid}];

                const newState = elementReducer(originalState, {
                    type: MODIFY_SCREEN_WITH_FIELDS,
                    payload: {
                        screen,
                        fields: [],
                        deletedFields: [field],

                    }
                });

                expect(newState[screen.guid].connectorCount).toBe(screen.connectorCount);
            });
        });
    });
});