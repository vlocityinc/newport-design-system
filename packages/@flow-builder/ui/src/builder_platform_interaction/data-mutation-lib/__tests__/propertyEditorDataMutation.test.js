import {
    mutateEditorElement,
    removeEditorElementMutation,
} from '../propertyEditorDataMutation';
import { ELEMENT_TYPE } from 'builder_platform_interaction-element-config';

import {
    mutateAssignment,
    deMutateAssignment,
} from '../assignmentEditorDataMutation';

import {
    mutateDecision,
    deMutateDecision,
} from '../decisionEditorDataMutation';

jest.mock('../assignmentEditorDataMutation', () => {
    return {
        mutateAssignment: jest.fn(assignment => {
            assignment.name = 'mutated';
        }),
        deMutateAssignment: jest.fn(assignment => {
            assignment.name = 'demutated';
        })
    };
});

const mockDecisionOutcomesAfterMutation = [{a:1}, {b:2}];
const mockDecisionOutcomeReferencesAfterDeMutation = [1, 2];
const mockDeletedOutcomesAfterDeMutation = [{x:1}];
const mockDecisionElementTypeAfterDeMutation = ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES;

jest.mock('../decisionEditorDataMutation', () => {
    return {
        mutateDecision: jest.fn(decision => {
            decision.name = 'mutated';
            decision.outcomes = mockDecisionOutcomesAfterMutation;
            delete decision.outcomeReferences;
        }),
        deMutateDecision: jest.fn(decision => {
            decision.name = 'demutated';
            decision.outcomeReferences = mockDecisionOutcomeReferencesAfterDeMutation;
            delete decision.outcomes;

            return {
                elementType: mockDecisionElementTypeAfterDeMutation,
                decision,
                outcomes: [],
                deletedOutcomes: mockDeletedOutcomesAfterDeMutation
            };
        })
    };
});

describe('mutateEditorElement function', () => {
    it('should mutate assignment element', () => {
        const element = {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: 'beforeMutation'
        };

        const result = mutateEditorElement(element);


        expect(mutateAssignment.mock.calls[0][0]).toEqual(element);
        expect(mutateAssignment.mock.calls).toHaveLength(1);

        expect(result).toEqual(element);

        expect(element.name).toEqual('mutated');
    });

    it('should mutate decision element', () => {
        const element = {
            elementType: ELEMENT_TYPE.DECISION,
            name: 'beforeMutation',
            outcomeReferences: [1, 2]
        };

        const result = mutateEditorElement(element);

        expect(mutateDecision.mock.calls[0][0]).toEqual(element);
        expect(mutateDecision.mock.calls).toHaveLength(1);

        expect(result).toEqual(element);

        expect(element.name).toEqual('mutated');
        expect(element.outcomes).toEqual(mockDecisionOutcomesAfterMutation);
    });
});

describe('deMutateEditorElement function', () => {
    it('should demutate assignment element', () => {
        const element = {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: 'beforeDemutation'
        };

        const result = removeEditorElementMutation(element);

        expect(deMutateAssignment.mock.calls[0][0]).toEqual(element);
        expect(deMutateAssignment.mock.calls).toHaveLength(1);

        expect(result).toEqual(element);

        expect(element.name).toEqual('demutated');
    });

    it('should demutate decision element', () => {
        const element = {
            elementType: ELEMENT_TYPE.DECISION,
            name: 'beforeDemutation',
            outcomes: [{a:1}, {b:2}]
        };

        const result = removeEditorElementMutation(element);

        expect(deMutateDecision.mock.calls[0][0]).toEqual(element);
        expect(deMutateDecision.mock.calls).toHaveLength(1);

        expect(result).toEqual({
            elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
            decision: element,
            outcomes: [],
            deletedOutcomes: mockDeletedOutcomesAfterDeMutation
        });

        expect(element.name).toEqual('demutated');
        expect(element.outcomeReferences).toEqual(mockDecisionOutcomeReferencesAfterDeMutation);
    });
});
