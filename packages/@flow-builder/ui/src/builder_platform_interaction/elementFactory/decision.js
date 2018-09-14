import { ELEMENT_TYPE, SUB_ELEMENT_TYPE, CONDITION_LOGIC, CONNECTOR_TYPE } from "builder_platform_interaction/flowMetadata";
import { baseCanvasElement, baseChildElement, baseCanvasElementsArrayToMap } from "./base/baseElement";
import { createListRowItem, rhsPropertyName, rhsDataTypePropertyName } from "./base/baseList";
import { baseCanvasElementMetadataObject, baseChildElementMetadataObject } from "./base/baseMetadata";
import { LABELS } from "./elementFactoryLabels";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { generateGuid } from "builder_platform_interaction/storeLib";
import { FLOW_DATA_TYPE } from "builder_platform_interaction/dataTypeLib";
import { createFEROVMetadataObject, createFEROV } from "./ferov";
import { createConnectorObjects } from "./connector";

const elementType = ELEMENT_TYPE.DECISION;
const lhsMetadataPropertyName = 'leftValueReference';

// For Opening Property editor or copying a decision
export function createDecisionWithOutcomes(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, outcomeReferences } = decision;
    let { outcomes } = decision;

    if (outcomes && outcomes.length > 0) { // decision with outcomes inside it.
        outcomes = outcomes.map(outcome => createOutcome(outcome));
    } else if (outcomeReferences && outcomeReferences.length > 0) { // decision with outcome references
        // Decouple outcome from store.
        outcomes = outcomeReferences.map(outcomeReference =>
            createOutcome(getElementByGuid(outcomeReference.outcomeReference))
        );
    } else { // new decision case
        const newOutcome = createOutcome();
        outcomes = [newOutcome];
    }
    // Add maxConnections and availableConnections for new/existing decision if needed.
    return Object.assign(newDecision, {
        outcomes,
        defaultConnectorLabel,
        elementType
    });
}

export function createDecisionWithOutcomeReferencesWhenClosingPropertyEditor(decision) {
    const newDecision = baseCanvasElement(decision);
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, outcomes } = decision;
    let outcomeReferences = [];
    let newOutcomes = [];
    for (let i = 0; i < outcomes.length; i++) {
        const outcome = outcomes[i];
        const newOutcome = createOutcome(outcome);
        outcomeReferences = updateOutcomeReferences(outcomeReferences, newOutcome);
        newOutcomes = [...newOutcomes, newOutcome];
    }
    const deletedOutcomes = getDeletedOutcomesUsingStore(decision, newOutcomes);
    Object.assign(newDecision, {
        defaultConnectorLabel,
        outcomeReferences,
        elementType
    });
    return {
        decision: newDecision,
        deletedOutcomes,
        outcomes: newOutcomes,
        elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES
    };
}

export function createDecisionWithOutcomeReferences(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    let outcomes = [], outcomeReferences = [], availableConnections = [];
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, rules = [] } = decision;
    // create connectors for decision which is default value. This can be refactor to update available connection as well.
    let connectors = createConnectorObjects(decision, newDecision.guid);
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const outcome = createOutcome(rule);
        const connector = createConnectorObjects(rule, outcome.guid, newDecision.guid);
        outcomes = [...outcomes, outcome];
        // updating outcomeReferences
        outcomeReferences = updateOutcomeReferences(outcomeReferences, outcome);
        availableConnections = addRegularConnectorToAvailableConnections(availableConnections, rule);
        // connector is an array. FIX it.
        connectors = [...connectors, ...connector];
    }
    availableConnections = addDefaultConnectorToAvailableConnections(availableConnections, decision);
    const connectorCount = connectors ? connectors.length : 0;
    const maxConnections = calculateMaxConnections(decision);
    Object.assign(newDecision, {
        outcomeReferences,
        defaultConnectorLabel,
        elementType,
        connectorCount,
        maxConnections,
        availableConnections
    });
    return baseCanvasElementsArrayToMap([newDecision, ...outcomes], connectors);
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

// TODO: Refactor for commonalities with wait
// https://gus.my.salesforce.com/a07B0000005YnL5IAK (W-5395893)
export function createCondition(condition = {}) {
    let newCondition = {};

    if (condition.hasOwnProperty(lhsMetadataPropertyName)) {
        newCondition = createFEROV(condition.rightValue, rhsPropertyName, rhsDataTypePropertyName);
        newCondition.leftHandSide = condition.leftValueReference;
        newCondition.operator = condition.operator;
        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }
    newCondition.rowIndex = generateGuid(SUB_ELEMENT_TYPE.CONDITION);

    return newCondition;
}

export function createDecisionMetadataObject(decision, config = {}) {
    if (!decision) {
        throw new Error('Decision is not defined');
    }
    const newDecision = baseCanvasElementMetadataObject(decision, config);
    const { outcomeReferences, defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel } = decision;
    let outcomes;
    if (outcomeReferences && outcomeReferences.length > 0) {
        outcomes = outcomeReferences.map(({outcomeReference}) => {
            return createOutcomeMetadataObject(getElementByGuid(outcomeReference), config);
        });
    }
    return Object.assign(newDecision, {
        rules: outcomes,
        defaultConnectorLabel
    });
}

export function createOutcomeMetadataObject(outcome, config = {}) {
    if (!outcome) {
        throw new Error('Outcome is not defined');
    }

    const newOutcome = baseChildElementMetadataObject(outcome, config);
    let { conditions } = outcome;
    const { conditionLogic } = outcome;
    if (conditions && conditions.length > 0) {
        conditions = conditions.map(condition => createConditionMetadataObject(condition));
    }
    return Object.assign(newOutcome, {
        conditions,
        conditionLogic
    });
}

export function createConditionMetadataObject(condition) {
    if (!condition) {
        throw new Error('Condition is not defined');
    }
    const { leftHandSide, operator } = condition;
    const rightValue = createFEROVMetadataObject(condition, rhsPropertyName, rhsDataTypePropertyName);
    const newCondition = Object.assign({}, {
        leftValueReference: leftHandSide,
        rightValue,
        operator
    });
    return newCondition;
}

function calculateMaxConnections(decision) {
    if (!decision) {
        throw new Error('Max connection cannot be calculated because decision object is not defined');
    }
    let length = 1;
    if (decision.outcomes) {
        length = decision.outcomes.length + 1;
    } else if (decision.rules) {
        length = decision.rules.length + 1;
    } else if (decision.outcomeReferences) {
        length = decision.outcomeReferences.length + 1;
    }
    return length;
}

function addRegularConnectorToAvailableConnections(availableConnections = [], outcomeOrRule) {
    if (!availableConnections || !outcomeOrRule || !outcomeOrRule.name) {
        throw new Error('Either availableConnections, outcome or rule is not defined');
    }
    const { name, connector } = outcomeOrRule;

    if (!connector) {
        const childReference = name;
        return [...availableConnections, {
            type: CONNECTOR_TYPE.REGULAR,
            childReference
        }];
    }
    return availableConnections;
}

function addDefaultConnectorToAvailableConnections(availableConnections = [], decision) {
    if (!availableConnections || !decision) {
        throw new Error('Either availableConnections or decision is not defined');
    }
    const { defaultConnector } = decision;
    if (!defaultConnector) {
        return [...availableConnections, {
            type: CONNECTOR_TYPE.DEFAULT
        }];
    }
    return availableConnections;
}

function updateOutcomeReferences(outcomeReferences = [], outcome) {
    if (!outcome || !outcome.guid) {
        throw new Error('Either outcome or outcome.guid is not defined');
    }
    return [...outcomeReferences, {
        outcomeReference: outcome.guid
    }];
}

function getDeletedOutcomesUsingStore(originalDecision, newOutcomes = []) {
    if (!originalDecision) {
        throw new Error('Either decision or newOutcome is not defined');
    }
    const { guid } = originalDecision;
    const decisionFromStore = getElementByGuid(guid);
    let outcomeReferencesFromStore;
    if (decisionFromStore) {
        outcomeReferencesFromStore = decisionFromStore.outcomeReferences.map((outcomeReference) => outcomeReference.outcomeReference);
    }
    if (outcomeReferencesFromStore) {
        const newOutcomeGuids = newOutcomes.map((newOutcome) => newOutcome.guid);
        return outcomeReferencesFromStore.filter((outcomeReferenceGuid) => {
            return !newOutcomeGuids.includes(outcomeReferenceGuid);
        }).map((outcomeReference) => getElementByGuid(outcomeReference));
    }
    return [];
}