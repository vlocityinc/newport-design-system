import elementReducer from '../elements-reducer';
import {
    UPDATE_FLOW,
    ADD_CANVAS_ELEMENT,
    UPDATE_CANVAS_ELEMENT,
    DELETE_CANVAS_ELEMENT,
    ADD_RESOURCE,
    UPDATE_RESOURCE,
    DELETE_RESOURCE,
    MODIFY_DECISION_WITH_OUTCOMES
} from 'builder_platform_interaction-actions';

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
        const newElementState = elementReducer(oldProperties, {type: DELETE_RESOURCE, payload: {guid: omitProps }});
        expect(newElementState).not.toHaveProperty('description');
        expect(newElementState).toHaveProperty('name');
        expect(newElementState).toHaveProperty('label');
    });

    it('with state set to undefined & action type set to DELETE_VARIABLE should return an empty object', () => {
        const propToOmit = 'description';
        const newElementState = elementReducer(undefined, {type: DELETE_RESOURCE, payload: {guid: propToOmit }});
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

    it('with state set to defined & action type set to UPDATE_VARIABLE should return the new element state with the updated property', () => {
        const updatedElements = {
            guid1: {  name: 'ass-3',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid1' }
        };
        const newElementState = elementReducer(oldElements, {type: UPDATE_RESOURCE, payload: {guid: 'guid1', name: 'ass-3' }});
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

    it('with state set to defined & action type is DELETE_CANVAS_ELEMENT should delete the property from the element object ', () => {
        const omitProps = ['guid_1'];
        const oldProperties = {
            'guid_1' : {
                name: 'ass1',
                label: 'assignment 1',
                description: 'desc 1',
                guid: 'guid_1'
            }
        };
        const newElementState = elementReducer(oldProperties, {type: DELETE_CANVAS_ELEMENT,
            payload : { selectedCanvasElementGUIDs: omitProps, canvasElementsToUpdate:  []}});
        expect(newElementState).toEqual({});
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
                maxConnections: 3
            };

            outcome = {
                guid: 'outcome2',
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
                outcome.connectorReferences = ['someConnectorGuid'];

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
});