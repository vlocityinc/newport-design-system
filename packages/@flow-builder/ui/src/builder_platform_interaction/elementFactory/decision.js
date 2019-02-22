import { ELEMENT_TYPE, CONNECTOR_TYPE, CONDITION_LOGIC } from "builder_platform_interaction/flowMetadata";
import {
    baseCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    createCondition
} from "./base/baseElement";
import { getConnectionProperties } from "./commonFactoryUtils/decisionAndWaitConnectionPropertiesUtil";
import {baseCanvasElementMetadataObject, baseChildElementMetadataObject, createConditionMetadataObject } from "./base/baseMetadata";
import { LABELS } from "./elementFactoryLabels";
import { getElementByGuid } from "builder_platform_interaction/storeUtils";
import { createConnectorObjects } from "./connector";

const elementType = ELEMENT_TYPE.DECISION;

const childReferenceKeys = {
    childReferencesKey: 'outcomeReferences',
    childReferenceKey: 'outcomeReference'
};

// For Opening Property editor or copying a decision
export function createDecisionWithOutcomes(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    let { outcomes } = decision;
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, outcomeReferences } = decision;

    if (outcomeReferences && outcomeReferences.length > 0) { // decision with outcome references
        // Decouple outcome from store.
        outcomes = outcomeReferences.map(outcomeReference =>
            createOutcome(getElementByGuid(outcomeReference.outcomeReference))
        );
    } else { // new decision case
        const newOutcome = createOutcome();
        outcomes = [newOutcome];
    }
    // Add maxConnections for new/existing decision if needed.
    return Object.assign(newDecision, {
        outcomes,
        defaultConnectorLabel,
        elementType
    });
}

export function createDuplicateDecision(decision, newGuid, childElementGuidMap) {
    const defaultAvailableConnections = [{
       type: CONNECTOR_TYPE.DEFAULT
    }];

    const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } = duplicateCanvasElementWithChildElements(decision, newGuid, childElementGuidMap, createOutcome, childReferenceKeys.childReferencesKey, childReferenceKeys.childReferenceKey, defaultAvailableConnections);

    const updatedDuplicatedElement = Object.assign(duplicatedElement, {
        [childReferenceKeys.childReferencesKey]: updatedChildReferences,
        availableConnections,
        defaultConnectorLabel: decision.defaultConnectorLabel || LABELS.emptyDefaultOutcomeLabel
    });
    return { duplicatedElement: updatedDuplicatedElement, duplicatedChildElements };
}

export function createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision) {
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

    const maxConnections = newOutcomes.length + 1;
    const deletedOutcomes = getDeletedOutcomesUsingStore(decision, newOutcomes);
    const deletedOutcomeGuids = deletedOutcomes.map(outcome => outcome.guid);

    let originalDecision = getElementByGuid(decision.guid);

    if (!originalDecision) {
        originalDecision = {
            availableConnections: [{
                type: CONNECTOR_TYPE.DEFAULT
            }],
            outcomeReferences: []
        };
    }

    const { connectorCount, availableConnections } = getConnectionProperties(originalDecision, outcomeReferences, deletedOutcomeGuids, childReferenceKeys.childReferencesKey, childReferenceKeys.childReferenceKey);

    Object.assign(newDecision, {
        defaultConnectorLabel,
        outcomeReferences,
        elementType,
        maxConnections,
        connectorCount,
        availableConnections
    });

    return {
        canvasElement: newDecision,
        deletedChildElementGuids: deletedOutcomeGuids,
        childElements: newOutcomes,
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
    const childElement = baseChildElement(outcome, ELEMENT_TYPE.OUTCOME);
    const { conditionLogic = CONDITION_LOGIC.AND } = outcome;
    let { conditions = [] } = outcome;

    if (conditions.length > 0) {
        conditions = conditions.map(condition => createCondition(condition));
    } else {
        conditions = [createCondition()];
    }
    return Object.assign(childElement, {
        conditionLogic,
        conditions,
    });
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
            const outcome = getElementByGuid(outcomeReference);
            const metadataOutcome = baseChildElementMetadataObject(outcome, config);

            let { conditions = [] } = outcome;
            const { conditionLogic } = outcome;

            if (conditions.length > 0) {
                conditions = conditions.map(condition => createConditionMetadataObject(condition));
            }
            return Object.assign(metadataOutcome, {
                conditions,
                conditionLogic,
            });
        });
    }
    return Object.assign(newDecision, {
        rules: outcomes,
        defaultConnectorLabel
    });
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
        throw new Error('decision is not defined');
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