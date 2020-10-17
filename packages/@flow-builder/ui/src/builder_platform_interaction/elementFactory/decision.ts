// @ts-nocheck
import { ELEMENT_TYPE, CONNECTOR_TYPE, CONDITION_LOGIC } from 'builder_platform_interaction/flowMetadata';
import {
    baseCanvasElement,
    createPastedCanvasElement,
    duplicateCanvasElementWithChildElements,
    baseChildElement,
    baseCanvasElementsArrayToMap,
    createCondition
} from './base/baseElement';
import { getConnectionProperties } from './commonFactoryUtils/decisionAndWaitConnectionPropertiesUtil';
import {
    getElementByGuid,
    isExecuteOnlyWhenChangeMatchesConditionsPossible,
    shouldUseAutoLayoutCanvas
} from 'builder_platform_interaction/storeUtils';
import {
    baseCanvasElementMetadataObject,
    baseChildElementMetadataObject,
    createConditionMetadataObject
} from './base/baseMetadata';
import { LABELS } from './elementFactoryLabels';
import { createConnectorObjects } from './connector';

const elementType = ELEMENT_TYPE.DECISION;

// For Opening Property editor or copying a decision
export function createDecisionWithOutcomes(decision = {}) {
    const newDecision = baseCanvasElement(decision);
    const { prev, next } = decision;
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
        next,
        prev,
        outcomes,
        defaultConnectorLabel,
        elementType
    });
}

/**
 * Function to create the pasted Decision element
 *
 * @param {Object} dataForPasting - Data required to create the pasted element
 */
export function createPastedDecision({
    canvasElementToPaste,
    newGuid,
    newName,
    canvasElementGuidMap,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
}) {
    const { duplicatedElement, duplicatedChildElements } = createDuplicateDecision(
        canvasElementToPaste,
        newGuid,
        newName,
        childElementGuidMap,
        childElementNameMap,
        cutOrCopiedChildElements
    );

    const pastedCanvasElement = createPastedCanvasElement(
        duplicatedElement,
        canvasElementGuidMap,
        topCutOrCopiedGuid,
        bottomCutOrCopiedGuid,
        prev,
        next,
        parent,
        childIndex
    );

    return {
        pastedCanvasElement,
        pastedChildElements: duplicatedChildElements
    };
}

/**
 * Function to create the duplicate Decision element
 *
 * @param {Object} decision - Decision element being copied
 * @param {String} newGuid - Guid for the new duplicated decision element
 * @param {String} newName - Name for the new duplicated decision element
 * @param {Object} childElementGuidMap - Map of child element guids to newly generated guids that will be used for
 * the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to newly generated unique names that will be used for
 * the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements. Undefined in the case of duplication on Free Form Canvas
 * @return {Object} Returns an object containing the duplicated element and the duplicated childElements
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

    const {
        duplicatedElement,
        duplicatedChildElements,
        updatedChildReferences,
        availableConnections
    } = duplicateCanvasElementWithChildElements(
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
        childReferences = updateOutcomeReferences(childReferences, newOutcome);
        newOutcomes = [...newOutcomes, newOutcome];
    }

    const maxConnections = newOutcomes.length + 1;
    const {
        newChildren,
        deletedOutcomes,
        deletedBranchHeadGuids,
        shouldAddEndElement,
        newEndElementIdx
    } = getUpdatedChildrenAndDeletedOutcomesUsingStore(decision, newOutcomes);
    const deletedOutcomeGuids = deletedOutcomes.map((outcome) => outcome.guid);

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

    if (shouldUseAutoLayoutCanvas()) {
        Object.assign(newDecision, {
            children: newChildren
        });
    }

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
        deletedBranchHeadGuids,
        elementType: ELEMENT_TYPE.DECISION_WITH_MODIFIED_AND_DELETED_OUTCOMES,
        elementSubtype,
        shouldAddEndElement,
        newEndElementIdx
    };
}

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
        childReferences = updateOutcomeReferences(childReferences, outcome);
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

/*
TODO: Refactor Decision and Wait functions here to use common code path from connectorUtils
W-8166314
https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000089yE7IAI/view
 */
function addRegularConnectorToAvailableConnections(availableConnections = [], outcomeOrRule) {
    if (!availableConnections || !outcomeOrRule || !outcomeOrRule.name) {
        throw new Error('Either availableConnections, outcome or rule is not defined');
    }
    const { name, connector } = outcomeOrRule;

    if (!connector) {
        const childReference = name;
        return [
            ...availableConnections,
            {
                type: CONNECTOR_TYPE.REGULAR,
                childReference
            }
        ];
    }
    return availableConnections;
}

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

/*
TODO: Refactor Decision and Wait functions here to use common code path from base element
W-8166314
https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000089yE7IAI/view
 */
function updateOutcomeReferences(childReferences = [], outcome) {
    if (!outcome || !outcome.guid) {
        throw new Error('Either outcome or outcome.guid is not defined');
    }
    return [
        ...childReferences,
        {
            childReference: outcome.guid
        }
    ];
}

/*
TODO: Refactor Decision and Wait functions here to use common code path from base element
W-8166314
https://gus.lightning.force.com/lightning/r/ADM_Work__c/a07B00000089yE7IAI/view
 */
function getUpdatedChildrenAndDeletedOutcomesUsingStore(originalDecision, newOutcomes = []) {
    if (!originalDecision) {
        throw new Error('decision is not defined');
    }
    const { guid, children } = originalDecision;
    const decisionFromStore = getElementByGuid(guid);
    let outcomeReferencesFromStore;
    if (decisionFromStore) {
        outcomeReferencesFromStore = decisionFromStore.childReferences.map(
            (childReference) => childReference.childReference
        );
    }

    const newOutcomeGuids = newOutcomes.map((newOutcome) => newOutcome.guid);

    // Initializing the new children array
    const newChildren = new Array(newOutcomeGuids.length + 1).fill(null);
    let deletedOutcomes = [];
    const deletedBranchHeadGuids = [];

    let shouldAddEndElement = false;
    let newEndElementIdx;
    if (outcomeReferencesFromStore) {
        deletedOutcomes = outcomeReferencesFromStore
            .filter((outcomeReferenceGuid) => {
                return !newOutcomeGuids.includes(outcomeReferenceGuid);
            })
            .map((childReference) => getElementByGuid(childReference));

        const netNewOutcomeIndexes = [];
        if (shouldUseAutoLayoutCanvas()) {
            // For outcomes that previously existed, finding the associated children
            // and putting them at the right indexes in newChildren
            for (let i = 0; i < newOutcomeGuids.length; i++) {
                const foundAtIndex = outcomeReferencesFromStore.indexOf(newOutcomeGuids[i]);
                if (foundAtIndex !== -1) {
                    newChildren[i] = children[foundAtIndex];
                } else {
                    netNewOutcomeIndexes.push(i);
                }
            }

            // Adding the default branch's associated child to the last index of newChildren
            newChildren[newChildren.length - 1] = children[children.length - 1];
            // Check if all existing branches are terminal or not
            let areAllExistingBranchesTerminal = true;
            for (let i = 0; i < newChildren.length; i++) {
                if (!netNewOutcomeIndexes.includes(i)) {
                    const child = getElementByGuid(newChildren[i]);
                    if (child && !child.isTerminal) {
                        areAllExistingBranchesTerminal = false;
                    }
                }
            }

            // If all exsiting branches are terminal, then add an end element as needed
            if (areAllExistingBranchesTerminal && netNewOutcomeIndexes.length > 0) {
                shouldAddEndElement = true;
                if (netNewOutcomeIndexes.length === 1) {
                    // If only one outcome is added, an end element needs to be added
                    // to children at the correct index
                    newEndElementIdx = netNewOutcomeIndexes[0];
                }
                // If multiple outcomes are added, an end element needs to be added as
                // decision's next, this case is handled in flcElementsReducer
            }

            // Getting the child associated with the deleted outcome
            for (let i = 0; i < outcomeReferencesFromStore.length; i++) {
                if (!newOutcomeGuids.includes(outcomeReferencesFromStore[i]) && children[i]) {
                    deletedBranchHeadGuids.push(children[i]);
                }
            }
        }
    }
    return { newChildren, deletedOutcomes, deletedBranchHeadGuids, shouldAddEndElement, newEndElementIdx };
}
