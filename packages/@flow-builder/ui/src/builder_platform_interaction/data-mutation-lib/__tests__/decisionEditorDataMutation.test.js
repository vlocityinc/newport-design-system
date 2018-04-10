import {
    mutateDecision,
    deMutateDecision
} from '../decisionEditorDataMutation';

import {ELEMENT_TYPE} from 'builder_platform_interaction-element-config';

describe('mutateDecision function', () => {
    const state = {
        elements: {
            OUTCOME_1: {
                a:21,
                conditions: []
            },
            OUTCOME_2: {
                a:22,
                conditions: []
            },
        }
    };

    it('should mutate decision with deep copied outcomes', () => {
        const decision = {
            outcomeReferences: [{outcomeReference: 'OUTCOME_1'}, {outcomeReference: 'OUTCOME_2'}]
        };

        mutateDecision(decision, state);

        expect(decision.outcomes).toHaveLength(2);

        expect(decision.outcomes[0]).toEqual(state.elements.OUTCOME_1);
        expect(decision.outcomes[0]).not.toBe(state.elements.OUTCOME_1);

        expect(decision.outcomes[1]).toEqual(state.elements.OUTCOME_2);
        expect(decision.outcomes[1]).not.toBe(state.elements.OUTCOME_2);
    });

    it('should mutate decision with no outcomes', () => {
        const decision = {};

        mutateDecision(decision, state);

        expect(decision.outcomes).toHaveLength(1);
    });
});

describe('deMutateDecision function', () => {
    const state = {
        elements: {
            OUTCOME_1: {guid: 'OUTCOME_1', conditions: []},
            OUTCOME_2: {guid: 'OUTCOME_2', conditions: []},
            DECISION_3: {
                guid: 'DECISION_3',
                outcomeReferences: [{outcomeReference: 'OUTCOME_1'}, {outcomeReference: 'OUTCOME_2'}]
            },
        }
    };

    it('should demutate decision with outcomes', () => {
        const decision = {
            guid: 'DECISION_3',
            outcomes: [state.elements.OUTCOME_1, state.elements.OUTCOME_2]
        };
        const decisionWithOutcomes = deMutateDecision(decision, state);

        expect(decisionWithOutcomes.elementType).toEqual(ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES);

        expect(decisionWithOutcomes.decision).toEqual(state.elements.DECISION_3);

        expect(decisionWithOutcomes.outcomes).toHaveLength(2);
        expect(decisionWithOutcomes.outcomes).toContain(state.elements.OUTCOME_1);
        expect(decisionWithOutcomes.outcomes).toContain(state.elements.OUTCOME_2);

        expect(decisionWithOutcomes.deletedOutcomes).toHaveLength(0);

        expect(decision.outcomeReferences).toHaveLength(2);
        expect(decision.outcomeReferences).toContainEqual(state.elements.DECISION_3.outcomeReferences[0]);
        expect(decision.outcomeReferences).toContainEqual(state.elements.DECISION_3.outcomeReferences[1]);
    });

    it('should return all deleted outcomes as deleted', () => {
        const decision = {
            guid: 'DECISION_3',
            outcomes: [state.elements.OUTCOME_1]
        };
        const decisionWithOutcomes = deMutateDecision(decision, state);

        expect(decisionWithOutcomes.outcomes).toHaveLength(1);
        expect(decisionWithOutcomes.outcomes).toContain(state.elements.OUTCOME_1);

        expect(decisionWithOutcomes.deletedOutcomes).toHaveLength(1);
        expect(decisionWithOutcomes.deletedOutcomes).toContain(state.elements.OUTCOME_2);

        expect(decision.outcomeReferences).toHaveLength(1);
        expect(decision.outcomeReferences).toContainEqual(state.elements.DECISION_3.outcomeReferences[0]);
    });
});
