import { ELEMENT_TYPE, SUB_ELEMENT_TYPE, createFlowElement } from 'builder_platform_interaction-element-config';
import { deepCopy, generateGuid } from 'builder_platform_interaction-store-lib';
import { mutateFEROV, deMutateFEROV } from './ferovEditorDataMutation';

const mutateOutcome = (outcome) => {
    const conditions = outcome.conditions;
    for (const condition of conditions) {
        condition.rowIndex = generateGuid(SUB_ELEMENT_TYPE.CONDITION);

        if (condition.hasOwnProperty('leftValueReference')) {
            condition.leftHandSide = condition.leftValueReference;
            delete condition.leftValueReference;
        }
        if (condition.hasOwnProperty('rightValue')) {
            mutateFEROV(condition, condition.rightValue);
            delete condition.rightValue;
        }
    }

    return outcome;
};

/**
 * Add property editor mutation for decision
 *
 * @param {Object} decision Decision element to mutate
 * @param {Object} state State of the whole project
 */
export const mutateDecision = (decision, state) => {
    decision.outcomes = [];

    const outcomeReferences = decision.outcomeReferences || [];
    for (const outcomeReference of outcomeReferences) {
        const outcome = deepCopy(state.elements[outcomeReference.outcomeReference]);
        decision.outcomes.push(mutateOutcome(outcome));
    }

    // Create at least one empty outcome if none exist
    if (decision.outcomes.length === 0) {
        const outcome = createFlowElement(ELEMENT_TYPE.OUTCOME, false);
        decision.outcomes.push(mutateOutcome(outcome));
    }

    delete decision.outcomeReferences;
};

/**
 * Remove property editor mutation for decision
 *
 * 1. Update decision outcomeReferences
 * 2. capture new/modified outcomes
 * 3. capture deleted outcomes
 *
 * @param {Object} decision Decision element to de-mutate
 * @param {Object} state State of the whole project
 * @returns {{decision: Object, outcomes: Array, deletedOutcomes: Array}} Contains the decision and its outcomes as
 * well as deleted outcomes
 */
export const deMutateDecision = (decision, state) => {
    const decisionWithModifiedAndDeletedOutcomes = {
        elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
        decision,
        outcomes: [],
        deletedOutcomes: []
    };

    // This will be null if a new decision is being saved for the first time
    const originalDecision = state.elements[decision.guid];

    let originalOutcomeReferences = [];
    if (originalDecision) {
        originalOutcomeReferences = originalDecision.outcomeReferences;
    }

    const currentOutcomes = decision.outcomes || [];

    // Capture all current outcome guids for ease of determining which outcomes have been deleted
    const currentOutcomeGuids = [];

    // Update decision outcomeReferences
    decision.outcomeReferences = [];
    currentOutcomes.forEach((outcome) => {
        const conditions = outcome.conditions;
        for (const condition of conditions) {
            delete condition.rowIndex;

            if (condition.hasOwnProperty('leftHandSide')) {
                condition.leftValueReference = condition.leftHandSide;
                delete condition.leftHandSide;
            }
            if (condition.hasOwnProperty('rightHandSide')) {
                condition.rightValue = {};
                deMutateFEROV(condition, condition.rightValue);
            }
        }

        decision.outcomeReferences.push({
            outcomeReference: outcome.guid
        });
        currentOutcomeGuids.push(outcome.guid);
    });

    // Note which outcomes have been modified
    decisionWithModifiedAndDeletedOutcomes.outcomes.push(...currentOutcomes);

    // Note which outcomes have been deleted
    decisionWithModifiedAndDeletedOutcomes.deletedOutcomes = originalOutcomeReferences.map((outcomeReference) => {
        return state.elements[outcomeReference.outcomeReference];
    }).filter((outcome) => {
        return !currentOutcomeGuids.includes(outcome.guid);
    });

    delete decision.outcomes;

    return decisionWithModifiedAndDeletedOutcomes;
};
