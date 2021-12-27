// @ts-nocheck
import { CONDITION_LOGIC, CONNECTOR_TYPE, ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';
import {
    getElementByGuid,
    isExecuteOnlyWhenChangeMatchesConditionsPossible
} from 'builder_platform_interaction/storeUtils';
import {
    baseCanvasElement,
    baseCanvasElementsArrayToMap,
    baseChildElement,
    createCondition,
    duplicateCanvasElementWithChildElements,
    getDeletedCanvasElementChildren,
    updateChildReferences
} from './base/baseElement';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from './base/baseMetadata';
import {
    addRegularConnectorToAvailableConnections,
    getConnectionProperties
} from './commonFactoryUtils/connectionPropertiesUtils';
import { createConnectorObjects } from './connector';
import { LABELS } from './elementFactoryLabels';

const elementType = ELEMENT_TYPE.DECISION;

// For Opening Property editor or copying a decision
/**
 * @param decision
 */
export function createDecisionWithOutcomes(decision = {}) {
    const newDecision = baseCanvasElement(decision);

    let { outcomes } = decision;
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, childReferences } = decision;

    if (childReferences && childReferences.length > 0) {
        // decision with outcome references
        // Decouple outcome from store.
        outcomes = childReferences.map((childReference) => {
            const outcome = createOutcome(getElementByGuid(childReference.childReference));
            // establish if outcome execution options should be shown
            outcome.showOutcomeExecutionOptions = isExecuteOnlyWhenChangeMatchesConditionsPossible();
            return outcome;
        });
    } else {
        // new decision case
        const newOutcome = createOutcome();
        newOutcome.showOutcomeExecutionOptions = isExecuteOnlyWhenChangeMatchesConditionsPossible();
        outcomes = [newOutcome];
    }

    // Add maxConnections for new/existing decision  if needed.
    return Object.assign(newDecision, {
        outcomes,
        defaultConnectorLabel,
        elementType
    });
}

/**
 * Function to create the duplicate Decision element
 *
 * @param {Object} decision - Decision element being copied
 * @param {string} newGuid - Guid for the new duplicated decision element
 * @param {string} newName - Name for the new duplicated decision element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @returns {Object} Returns an object containing the duplicated element and the duplicated childElements
 */
export function createDuplicateDecision(
    decision,
    newGuid,
    newName,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements
) {
    const defaultAvailableConnections = [
        {
            type: CONNECTOR_TYPE.DEFAULT
        }
    ];

    const { duplicatedElement, duplicatedChildElements, updatedChildReferences, availableConnections } =
        duplicateCanvasElementWithChildElements(
            decision,
            newGuid,
            newName,
            childElementGuidMap,
            childElementNameMap,
            cutOrCopiedChildElements,
            createOutcome,
            defaultAvailableConnections
        );

    const updatedDuplicatedElement = Object.assign(duplicatedElement, {
        childReferences: updatedChildReferences,
        availableConnections,
        defaultConnectorLabel: decision.defaultConnectorLabel || LABELS.emptyDefaultOutcomeLabel
    });
    return {
        duplicatedElement: updatedDuplicatedElement,
        duplicatedChildElements
    };
}

/**
 * Decision from the property editor on close goes to the store
 *
 * @param decision
 */
export function createDecisionWithOutcomeReferencesWhenUpdatingFromPropertyEditor(decision) {
    const newDecision = baseCanvasElement(decision);
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, outcomes } = decision;
    let childReferences = [];
    let newOutcomes = [];

    for (let i = 0; i < outcomes.length; i++) {
        const outcome = outcomes[i];
        const newOutcome = createOutcome(outcome);
        childReferences = updateChildReferences(childReferences, newOutcome);
        newOutcomes = [...newOutcomes, newOutcome];
    }

    const maxConnections = newOutcomes.length + 1;

    const deletedCanvasElementChildren = getDeletedCanvasElementChildren(decision, newOutcomes);
    const deletedOutcomeGuids = deletedCanvasElementChildren.map((outcome) => outcome.guid);

    let originalDecision = getElementByGuid(decision.guid);

    if (!originalDecision) {
        originalDecision = {
            availableConnections: [
                {
                    type: CONNECTOR_TYPE.DEFAULT
                }
            ],
            childReferences: []
        };
    }

    const { connectorCount, availableConnections } = getConnectionProperties(
        originalDecision,
        childReferences,
        deletedOutcomeGuids
    );

    const elementSubtype = decision.elementSubtype;
    Object.assign(newDecision, {
        defaultConnectorLabel,
        childReferences,
        elementType,
        maxConnections,
        connectorCount,
        availableConnections
    });

    return {
        canvasElement: newDecision,
        deletedChildElementGuids: deletedOutcomeGuids,
        childElements: newOutcomes,
        elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
        elementSubtype
    };
}

/**
 * @param decision
 */
export function createDecisionWithOutcomeReferences(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    let outcomes = [],
        childReferences = [],
        availableConnections = [];
    const { defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel, rules = [] } = decision;
    // create connectors for decision which is default value. This can be refactor to update available connection as well.
    let connectors = createConnectorObjects(decision, newDecision.guid);
    for (let i = 0; i < rules.length; i++) {
        const rule = rules[i];
        const outcome = createOutcome(rule);
        const connector = createConnectorObjects(rule, outcome.guid, newDecision.guid);
        outcomes = [...outcomes, outcome];
        // updating outcomeReferences
        childReferences = updateChildReferences(childReferences, outcome);
        availableConnections = addRegularConnectorToAvailableConnections(availableConnections, rule);
        // connector is an array. FIX it.
        connectors = [...connectors, ...connector];
    }
    availableConnections = addDefaultConnectorToAvailableConnections(availableConnections, decision);
    const connectorCount = connectors ? connectors.length : 0;
    const maxConnections = calculateMaxConnections(decision);
    Object.assign(newDecision, {
        childReferences,
        defaultConnectorLabel,
        elementType,
        connectorCount,
        maxConnections,
        availableConnections
    });
    return baseCanvasElementsArrayToMap([newDecision, ...outcomes], connectors);
}

/**
 * @param outcome
 */
export function createOutcome(outcome = {}) {
    const childElement = baseChildElement(outcome, ELEMENT_TYPE.OUTCOME);
    const { conditionLogic = CONDITION_LOGIC.AND, doesRequireRecordChangedToMeetCriteria = false } = outcome;
    let { conditions = [] } = outcome;

    if (conditions.length > 0) {
        conditions = conditions.map((condition) => createCondition(condition));
    } else {
        conditions = [createCondition()];
    }
    return Object.assign(childElement, {
        conditionLogic,
        conditions,
        doesRequireRecordChangedToMeetCriteria
    });
}

/**
 * @param decision
 * @param config
 */
export function createDecisionMetadataObject(decision, config = {}) {
    if (!decision) {
        throw new Error('Decision is not defined');
    }
    const newDecision = baseCanvasElementMetadataObject(decision, config);
    const { childReferences, defaultConnectorLabel = LABELS.emptyDefaultOutcomeLabel } = decision;
    let outcomes;
    if (childReferences && childReferences.length > 0) {
        outcomes = childReferences.map(({ childReference }) => {
            const outcome = getElementByGuid(childReference);
            const metadataOutcome = baseChildElementMetadataObject(outcome, config);

            let { conditions = [] } = outcome;
            const { conditionLogic } = outcome;
            const { doesRequireRecordChangedToMeetCriteria = false } = outcome;

            if (conditions.length > 0) {
                conditions = conditions.map((condition) => createConditionMetadataObject(condition));
            }

            return Object.assign(metadataOutcome, {
                conditions,
                conditionLogic,
                doesRequireRecordChangedToMeetCriteria
            });
        });
    }
    return Object.assign(newDecision, {
        rules: outcomes,
        defaultConnectorLabel
    });
}

/**
 * @param decision
 */
function calculateMaxConnections(decision) {
    if (!decision) {
        throw new Error('Max connection cannot be calculated because decision object is not defined');
    }
    let length = 1;
    if (decision.outcomes) {
        length = decision.outcomes.length + 1;
    } else if (decision.rules) {
        length = decision.rules.length + 1;
    } else if (decision.childReferences) {
        length = decision.childReferences.length + 1;
    }
    return length;
}

/**
 * @param availableConnections
 * @param decision
 */
function addDefaultConnectorToAvailableConnections(availableConnections = [], decision) {
    if (!availableConnections || !decision) {
        throw new Error('Either availableConnections or decision is not defined');
    }
    const { defaultConnector } = decision;
    if (!defaultConnector) {
        return [
            ...availableConnections,
            {
                type: CONNECTOR_TYPE.DEFAULT
            }
        ];
    }
    return availableConnections;
}
