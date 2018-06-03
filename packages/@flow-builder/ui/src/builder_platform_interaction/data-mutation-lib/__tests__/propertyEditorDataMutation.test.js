import { mutateEditorElement, removeEditorElementMutation } from '../propertyEditorDataMutation';
import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';

import {
    mutateAssignment,
    deMutateAssignment,
} from '../assignmentEditorDataMutation';

import {
    mutateDecision,
    deMutateDecision,
} from '../decisionEditorDataMutation';

import {
    mutateVariable,
    deMutateVariable,
} from '../variableEditorDataMutation';

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

jest.mock('../variableEditorDataMutation', () => {
    return {
        mutateVariable: jest.fn().mockImplementation(() => {
            return { name: 'mutated' };
        }),
        deMutateVariable: jest.fn().mockImplementation(() => {
            return { name:'demutated' };
        }),
    };
});

describe('mutateEditorElement function', () => {
    it('should mutate assignment element', () => {
        const element = {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: 'beforeMutation'
        };

        const result = mutateEditorElement(element);


        expect(mutateAssignment).toHaveBeenCalledWith(element);
        expect(mutateAssignment).toHaveBeenCalledTimes(1);

        expect(result).toBe(element);

        expect(element.name).toEqual('mutated');
    });

    it('should mutate decision element', () => {
        const element = {
            elementType: ELEMENT_TYPE.DECISION,
            name: 'beforeMutation',
            outcomeReferences: [1, 2]
        };

        const result = mutateEditorElement(element);

        expect(mutateDecision).toHaveBeenCalledWith(element, undefined);
        expect(mutateDecision).toHaveBeenCalledTimes(1);

        expect(result).toBe(element);

        expect(element.name).toEqual('mutated');
        expect(element.outcomes).toEqual(mockDecisionOutcomesAfterMutation);
    });

    it('should mutate variable element immutably', () => {
        const element = {
            elementType: ELEMENT_TYPE.VARIABLE,
            name: 'beforeMutation',
        };
        const result = mutateEditorElement(element);

        expect(mutateVariable).toHaveBeenCalledTimes(1);
        expect(mutateVariable).toHaveBeenCalledWith(element);

        expect(result).not.toBe(element);

        expect(result.name).toEqual('mutated');
    });
});

describe('deMutateEditorElement function', () => {
    it('should demutate assignment element in place', () => {
        const element = {
            elementType: ELEMENT_TYPE.ASSIGNMENT,
            name: 'beforeDemutation'
        };

        const result = removeEditorElementMutation(element);

        expect(deMutateAssignment).toHaveBeenCalledWith(element);
        expect(deMutateAssignment).toHaveBeenCalledTimes(1);

        expect(result).toBe(element);

        expect(element.name).toEqual('demutated');
    });

    it('should demutate decision element in place', () => {
        const element = {
            elementType: ELEMENT_TYPE.DECISION,
            name: 'beforeDemutation',
            outcomes: [{a:1}, {b:2}]
        };

        const result = removeEditorElementMutation(element);

        expect(deMutateDecision).toHaveBeenCalledWith(element, undefined);
        expect(deMutateDecision).toHaveBeenCalledTimes(1);

        expect(result).toEqual({
            elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
            decision: element,
            outcomes: [],
            deletedOutcomes: mockDeletedOutcomesAfterDeMutation
        });

        expect(element.name).toEqual('demutated');
        expect(element.outcomeReferences).toEqual(mockDecisionOutcomeReferencesAfterDeMutation);
    });

    it('should deMutate variable element immutably', () => {
        const element = {
            elementType: ELEMENT_TYPE.VARIABLE,
            name: 'beforeMutation',
        };

        const result = removeEditorElementMutation(element);

        expect(deMutateVariable).toHaveBeenCalledTimes(1);
        expect(deMutateVariable).toHaveBeenCalledWith(element);

        expect(result).not.toBe(element);

        expect(result.name).toEqual('demutated');
    });
});
