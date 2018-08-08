import { ELEMENT_TYPE, SUB_ELEMENT_TYPE, CONDITION_LOGIC } from 'builder_platform_interaction-flow-metadata';
import { baseCanvasElement, baseChildElement, baseElementsWithConnectors } from './base/base-element';
import { createListRowItem } from './base/base-list';
import { baseCanvasMetadataObject } from './base/base-metadata';
import { mutateFEROV, deMutateFEROV } from 'builder_platform_interaction-data-mutation-lib';
import { LABELS } from './element-factory-labels';
import { getElementByGuid } from 'builder_platform_interaction-store-utils';
import { generateGuid } from 'builder_platform_interaction-store-lib';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction-data-type-lib';

const elementType = ELEMENT_TYPE.DECISION;

export function createDecisionWithOutcomes(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, outcomeReferences } = decision;
    let { outcomes } = decision;

    if (outcomes && outcomes.length > 0) {
        outcomes = outcomes.map(outcome => createOutcome(outcome));
    } else if (outcomeReferences && outcomeReferences.length > 0) {
        outcomes = outcomeReferences.map(outcomeReference =>
            createOutcome(getElementByGuid(outcomeReference.outcomeReference))
        );
    } else {
        const newOutcome = createOutcome();
        outcomes = [newOutcome];
    }

    return Object.assign(newDecision, {
        outcomes,
        defaultConnectorLabel,
        elementType
    });
}

export function createDecisionWithOutcomeReferences(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel } = decision;
    let { outcomes = [], outcomeReferences = [] } = decision;
    const connectors = [];

    if (outcomes && outcomes.length > 0) {
        outcomeReferences = outcomes.map(outcome => {
            return { outcomeReference: outcome.guid };
        });
    }

    if (outcomeReferences && outcomeReferences.length > 0) {
        outcomes = outcomeReferences.map(outcomeReference =>
            createOutcome(getElementByGuid(outcomeReference.outcomeReference))
        );
    }

    // TODO Update decision available connections and connector count
    Object.assign(newDecision, {
        outcomeReferences,
        defaultConnectorLabel,
        elementType
    });

    // TODO Create connector objects

    return baseElementsWithConnectors([newDecision, ...outcomes], connectors);
}

export function createOutcome(outcome = {}) {
    const newOutcome = baseChildElement(outcome);
    const { conditionLogic = CONDITION_LOGIC.AND, dataType = FLOW_DATA_TYPE.BOOLEAN.value } = outcome;

    let { conditions } = outcome;
    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createCondition(condition));
    } else {
        const newCondition = createCondition();
        conditions = [newCondition];
    }

    return Object.assign(newOutcome, {
        conditions,
        conditionLogic,
        dataType,
        elementType: ELEMENT_TYPE.OUTCOME
    });
}

export function createCondition(condition = {}) {
    let newCondition = {};

    if (condition.hasOwnProperty('leftValueReference')) {
        newCondition = mutateFEROV(condition, 'rightValue', {
            valueProperty: 'rightHandSide',
            dataTypeProperty: 'rightHandSideDataType',
        });
        newCondition.leftHandSide = condition.leftValueReference;
        newCondition.operator = condition.operator;
        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }
    newCondition.rowIndex = generateGuid(SUB_ELEMENT_TYPE.CONDITION);

    return newCondition;
}

export function createDecisionMetadataObject(decision = {}) {
    const newDecision = baseCanvasMetadataObject(decision);
    let { outcomes } = decision;
    if (outcomes && outcomes.length > 0) {
        outcomes = outcomes.map(outcome => createOutcomeMetadataObject(outcome));
    } else {
        const newOutcome = createOutcomeMetadataObject();
        outcomes = [newOutcome];
    }
    return Object.assign(newDecision, {
        outcomes
    });
}

export function createOutcomeMetadataObject(outcome = {}) {
    const newOutcome = baseCanvasMetadataObject(outcome);
    let { conditions } = outcome;
    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createConditionMetadataObject(condition));
    } else {
        const newCondition = createConditionMetadataObject();
        conditions = [newCondition];
    }
    return Object.assign(newOutcome, {
        conditions
    });
}

export function createConditionMetadataObject(condition = {}) {
    const newCondition = deMutateFEROV(condition, 'rightValue', {
        valueProperty: 'rightHandSide',
        dataTypeProperty: 'rightHandSideDataType',
    });
    newCondition.assignToReference = condition.leftHandSide;
    newCondition.operator = condition.operator;

    return newCondition;
}