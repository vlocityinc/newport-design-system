import { generateGuid } from 'builder_platform_interaction/storeLib';
import { getElementByGuid } from 'builder_platform_interaction/storeUtils';
import { ELEMENT_TYPE, CONNECTOR_TYPE } from 'builder_platform_interaction/flowMetadata';
import { FLOW_DATA_TYPE } from 'builder_platform_interaction/dataTypeLib';
import { createFEROV } from '../ferov';
import { createListRowItem, RHS_DATA_TYPE_PROPERTY, RHS_PROPERTY } from './baseList';
import { Store } from 'builder_platform_interaction/storeLib';
import {
    FLOW_AUTOMATIC_OUTPUT_HANDLING,
    getProcessTypeAutomaticOutPutHandlingSupport
} from 'builder_platform_interaction/processTypeLib';
import { copyAlcExtraProps } from 'builder_platform_interaction/alcCanvasUtils';

export const DUPLICATE_ELEMENT_XY_OFFSET = 75;

// Used to mark an element as incomplete. An element is incomplete when it cannot fully be created because the factory needs information from an element that has
// not yet been created. translatorLib.translateFlowToUIModel uses this information to create the ui model in 2 passes
export const INCOMPLETE_ELEMENT = Symbol('incomplete');

/**
 * TODO: This function is overloaded to support both the construction of resources (variables, constants, etc..)
 * and as a "super" for methods like baseCanvasElement.  This should be cleaned up by combing the baseXXX
 * methods with the interfaces to make classes with constructors
 *
 * @param resource
 * @param resource.description
 */
export function baseResource(resource: { description?: string } = {}): UI.Element {
    const newResource = baseElement(resource);
    const { description = '' } = resource;
    return Object.assign(newResource, {
        description
    });
}

/**
 * @param availableConnection
 * @param availableConnection.type
 */
export function createAvailableConnection(availableConnection: { type?: string } = {}) {
    const { type } = availableConnection;
    return { type };
}

/**
 * @param config
 */
function createCanvasElementConfig(
    config = { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false }
): UI.CanvasElementConfig {
    const { isSelected, isHighlighted, isSelectable, hasError } = config;
    return { isSelected, isHighlighted, isSelectable, hasError };
}

/**
 * @param canvasElement
 */
export function baseCanvasElementWithFault(canvasElement: Metadata.Element | UI.BaseCanvasElement = {}): UI.Element {
    return baseCanvasElement(canvasElement, true);
}

/**
 * @param canvasElement
 * @param canHaveFaultConnectorBool
 */
export function baseCanvasElement(
    canvasElement: Metadata.Element | UI.BaseCanvasElement = {},
    canHaveFaultConnectorBool = false
): UI.Element {
    const newCanvasElement = baseResource(canvasElement);
    const { label = '', locationX = 0, locationY = 0, connectorCount = 0, elementSubtype, canHaveFaultConnector } = <
        UI.BaseCanvasElement
    >canvasElement;
    let { config } = <UI.BaseCanvasElement>canvasElement;
    config = createCanvasElementConfig(config);
    canHaveFaultConnectorBool = canHaveFaultConnector ?? canHaveFaultConnectorBool;

    // TODO: Need to remove, currently used to support alc copy/paste
    copyAlcExtraProps(canvasElement as UI.Element, newCanvasElement);

    return Object.assign(newCanvasElement, {
        label,
        locationX,
        locationY,
        isCanvasElement: true,
        connectorCount,
        config,
        elementSubtype,
        canHaveFaultConnector: canHaveFaultConnectorBool,
        isNew: canvasElement.isNew
    });
}

/**
 * Base function to create the Pasted Canvas Element
 *
 * @param {Object} duplicatedElement - Element object in it's duplicated state
 * @param {Object} canvasElementGuidMap - Map containing element guids -> pasted element guids
 * @param {string} topCutOrCopiedGuid - Guid of the top most cut or copied element
 * @param {string} bottomCutOrCopiedGuid - Guid of the bottom most cut or copied element
 * @param {string} prev - Guid of the element below which the cut/copied block will be pasted. This can be null when pasting at the top of a branch
 * @param {string} next - Guid of the element above which the cut/copied block will be pasted. This can be null when pasting at the bottom of a branch
 * @param {string} parent - Guid of the parent element. This has a value only when pasting at the top of a branch
 * @param {number} childIndex - Index of the branch. This has a value only when pasting at the top of a branch
 * @returns pastedCanvasElement
 */
export function createPastedCanvasElement(
    duplicatedElement,
    canvasElementGuidMap,
    topCutOrCopiedGuid,
    bottomCutOrCopiedGuid,
    prev,
    next,
    parent,
    childIndex
): UI.CanvasElement {
    const pastedCanvasElement = Object.assign(duplicatedElement, {
        config: { isSelected: false, isHighlighted: false, isSelectable: true, hasError: false },
        incomingGoTo: [],
        prev: canvasElementGuidMap[duplicatedElement.prev] || null,
        next: canvasElementGuidMap[duplicatedElement.next] || null
    });

    // If the parent hasn't been cut or copied, and the pasted element is same as topCutOrCopiedElement, then update the prev, parent and childIndex properties.
    if (pastedCanvasElement.guid === canvasElementGuidMap[topCutOrCopiedGuid]) {
        pastedCanvasElement.prev = prev;

        // If parent and childIndex are defined then update those properties or delete them
        if (parent) {
            pastedCanvasElement.parent = parent;
            pastedCanvasElement.childIndex = childIndex;
        } else {
            delete pastedCanvasElement.parent;
            delete pastedCanvasElement.childIndex;
        }
    } else if (canvasElementGuidMap[pastedCanvasElement.parent]) {
        // If the parent element has also been cut or copied, then update the parent guid
        pastedCanvasElement.parent = canvasElementGuidMap[pastedCanvasElement.parent];
    }

    // If the pasted canvas element is same as the bottomCutOrCopiedElement, then updating the next
    if (pastedCanvasElement.guid === canvasElementGuidMap[bottomCutOrCopiedGuid]) {
        pastedCanvasElement.next = next;
    }

    // Resetting the children array to include children guids that are being pasted or null for those that aren't
    if (pastedCanvasElement.children) {
        pastedCanvasElement.children = pastedCanvasElement.children.map((childGuid) => {
            return canvasElementGuidMap[childGuid] || null;
        });
    }

    // Updating the pasted element's fault property if it exists
    if (pastedCanvasElement.fault) {
        // If the fault element has been cut or copied, then update the fault reference
        // to the newly pasted element, else delete it
        if (canvasElementGuidMap[pastedCanvasElement.fault]) {
            pastedCanvasElement.fault = canvasElementGuidMap[pastedCanvasElement.fault];
        } else {
            delete pastedCanvasElement.fault;
        }
    }

    // Deleting the isTerminal property from the pastedCanvasElement. We reset it if needed in the reducer
    delete pastedCanvasElement.isTerminal;

    return pastedCanvasElement;
}

/**
 * Base function to duplicate canvas elements
 *
 * @param {Object} canvasElement - canvas element to be duplicated
 * @param {string} newGuid - new guid for the duplicate element
 * @param {string} newName - new name for the duplicate element
 * @returns {Object} duplicated element with a new unique name and guid
 */
export function duplicateCanvasElement(canvasElement, newGuid, newName): { duplicatedElement: UI.CanvasElement } {
    const { locationX, locationY, maxConnections, elementType } = canvasElement;
    const duplicatedElement: UI.CanvasElement = Object.assign({}, canvasElement, {
        guid: newGuid,
        name: newName,
        locationX: locationX + DUPLICATE_ELEMENT_XY_OFFSET,
        locationY: locationY + DUPLICATE_ELEMENT_XY_OFFSET,
        config: { isSelected: true, isHighlighted: false, hasError: false },
        connectorCount: 0,
        maxConnections,
        elementType
    });

    return { duplicatedElement };
}

/**
 * Helper function to create duplicated child elements
 *
 * @param {Object} childReference - Object containing the guid of the child element (eg: {childReference: 'outcome1'})
 * @param {Object} childElementGuidMap - Map of child element guids to new guids for the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to new names for the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements
 * @param {Function} createChildElement - Function to create the duplicate child element
 * @returns {Object} Returns the duplicated child element with the updated guid and name
 * @private
 */
function _createDuplicateChildElement(
    childReference,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements,
    createChildElement
) {
    // Using the cutOrCopiedChildElements to get the original child element in case the element has been deleted
    // and not available in the store
    const originalChildElement = cutOrCopiedChildElements
        ? cutOrCopiedChildElements[childReference.childReference]
        : getElementByGuid(childReference.childReference);
    const duplicatedChildElements = createChildElement(originalChildElement, cutOrCopiedChildElements);

    // In case of screens, duplicatedChildElements is an array otherwise a single element object
    if (Array.isArray(duplicatedChildElements)) {
        let duplicatedChildElement;

        // Iterating over the duplicatedChildElements and updating the guid, name and any childReferences.
        // Also finding the parent duplicated element
        const duplicatedNestedChildElements = duplicatedChildElements.reduce((acc, el) => {
            // Updating the name and guid for the duplicatedChildElement
            el = Object.assign(el, {
                guid: childElementGuidMap[el.guid],
                name: childElementNameMap[el.name]
            });

            // Updating the childReferences array to have the guids of the duplicated nested child elements
            const updatedChildReferences =
                el.childReferences &&
                el.childReferences.map((origChildReferenceObj) => {
                    return {
                        childReference: childElementGuidMap[origChildReferenceObj.childReference]
                    };
                });

            // Adding the childReferences property only if updatedChildReferences exists
            if (updatedChildReferences) {
                el = Object.assign(el, {
                    childReferences: updatedChildReferences
                });
            }

            // Finding the duplicatedChildElement (duplicated originalChildElement)
            if (!duplicatedChildElement && el.guid === childElementGuidMap[originalChildElement.guid]) {
                duplicatedChildElement = el;
            } else {
                acc[el.guid] = el;
            }

            return acc;
        }, {});

        return {
            duplicatedChildElement,
            duplicatedNestedChildElements
        };
    }
    // Updating the duplicatedChildElement's guid and name
    return {
        duplicatedChildElement: Object.assign(duplicatedChildElements, {
            guid: childElementGuidMap[originalChildElement.guid],
            name: childElementNameMap[originalChildElement.name]
        }),
        duplicatedNestedChildElements: {}
    };
}

/**
 * Base function to create duplicate canvas elements that contain child elements (such as : Decision, Screen and Wait)
 *
 * @param {Object} canvasElement - Canvas element that needs to be duplicated
 * @param {string} newGuid - Guid for the duplicated canvas element
 * @param {string} newName - Name for the duplicated canvas element
 * @param {Object} childElementGuidMap - Map of child element guids to new guids for the duplicated child elements
 * @param {Object} childElementNameMap - Map of child element names to new names for the duplicated child elements
 * @param {Object} cutOrCopiedChildElements - Local copy of the cut ot copied canvas elements
 * @param {Function} createChildElement - Function to create the duplicate child element
 * @param {Object[]} defaultAvailableConnections - Default Available Connections associated with a canvas element
 * @returns {Object} Returns the object containing the duplicated canvas element, duplicated child elements, updated child
 * references and available connections
 */
export function duplicateCanvasElementWithChildElements(
    canvasElement,
    newGuid,
    newName,
    childElementGuidMap,
    childElementNameMap,
    cutOrCopiedChildElements,
    createChildElement,
    defaultAvailableConnections = []
) {
    const { duplicatedElement } = duplicateCanvasElement(canvasElement, newGuid, newName);
    const childReferences = canvasElement.childReferences;

    const additionalAvailableConnections: any[] = [];
    let duplicatedChildElements = {};

    // Iterating over existing child references to create duplicate child elements and updating available connections.
    // Also using the duplicated guids to create the updated childReferences for the duplicated element
    const updatedChildReferences = childReferences.map((childReference) => {
        const { duplicatedChildElement, duplicatedNestedChildElements } = _createDuplicateChildElement(
            childReference,
            childElementGuidMap,
            childElementNameMap,
            cutOrCopiedChildElements,
            createChildElement
        );

        duplicatedChildElements[duplicatedChildElement.guid] = duplicatedChildElement;
        duplicatedChildElements = { ...duplicatedChildElements, ...duplicatedNestedChildElements };

        additionalAvailableConnections.push({
            type: CONNECTOR_TYPE.REGULAR,
            childReference: duplicatedChildElement.guid
        });

        return {
            childReference: duplicatedChildElement.guid
        };
    });

    const availableConnections = [...defaultAvailableConnections, ...additionalAvailableConnections];
    return {
        duplicatedElement,
        duplicatedChildElements,
        updatedChildReferences,
        availableConnections
    };
}

/**
 * Create a new condition for property editor use
 *
 * @param {Condition} condition - condition in store shape
 * @returns {module:baseList.ListRowItem} the new condition
 */
export function createCondition(condition: any = {}) {
    let newCondition = {};
    if (condition.hasOwnProperty('leftValueReference')) {
        const ferov = createFEROV(condition.rightValue, RHS_PROPERTY, RHS_DATA_TYPE_PROPERTY);
        newCondition = Object.assign({}, ferov, {
            leftHandSide: condition.leftValueReference,
            operator: condition.operator
        });

        newCondition = createListRowItem(newCondition);
    } else {
        newCondition = createListRowItem(condition);
    }

    return newCondition;
}

/**
 * @typedef {Object} ChildElement
 * @property {string} label - element label
 * @property {string} name - element devName
 * @property {string} guid - element guid
 * @property {module:dataTypeLib.FLOW_DATA_TYPE.BOOLEAN} dataType - All child elements are dataType BOOLEAN
 * @property {module:flowMetadata.CONDITION_LOGIC} conditionLogic - element condition logic
 * @property {module:flowMetadata.ELEMENT_TYPE} elementType - Child elements must be ELEMENT_TYPE OUTCOME or WAIT_EVENT
 * @property {module:baseList.ListRowItem[]} conditions - array of conditions
 */

/**
 * Factory class for creating a new child element
 *
 * @param childElement
 * @param {module:flowMetadata.ELEMENT_TYPE} elementType one of the values defined in ELEMENT_TYPE
 * @returns {ChildElement}
 */
export function baseChildElement(childElement: any = {}, elementType): UI.ChildElement {
    if (
        elementType !== ELEMENT_TYPE.OUTCOME &&
        elementType !== ELEMENT_TYPE.WAIT_EVENT &&
        elementType !== ELEMENT_TYPE.STAGE_STEP &&
        elementType !== ELEMENT_TYPE.SCHEDULED_PATH
    ) {
        throw new Error(
            'baseChildElement should only be used for outcomes, wait events, scheduled paths and stage steps'
        );
    } else if (
        childElement.dataType &&
        childElement.dataType !== FLOW_DATA_TYPE.BOOLEAN.value &&
        childElement.dataType !== FLOW_DATA_TYPE.STAGE_STEP.value
    ) {
        throw new Error(`dataType ${childElement.dataType} is invalid for baseChildElement`);
    }
    const newChildElement: UI.ChildElement = baseElement(childElement) as UI.ChildElement;
    const { label = '' } = childElement;
    return Object.assign(newChildElement, {
        label,
        elementType,
        dataType: FLOW_DATA_TYPE.BOOLEAN.value
    });
}

/**
 * @param elementList
 * @param connectors
 */
export function baseCanvasElementsArrayToMap(elementList: UI.Element[] = [], connectors: UI.Connector[] = []) {
    const elements = baseElementsArrayToMap(elementList);
    return Object.assign(elements, {
        connectors
    });
}

/**
 * @param elementList
 */
export function baseElementsArrayToMap(elementList: UI.Element[] = []) {
    const elements = elementList.reduce((acc, element) => {
        return Object.assign(acc, { [element.guid]: element });
    }, {});
    return {
        elements
    };
}

/**
 * @param element
 * @param element.guid
 * @param element.name
 * @param element.description
 */
export function baseElement(element: { guid?: UI.Guid; name?: string; description?: string } = {}): UI.Element {
    const { guid = generateGuid(), name = '' } = element;
    return {
        guid,
        name
    };
}

export const automaticOutputHandlingSupport = (): boolean => {
    const processType = Store.getStore().getCurrentState().properties.processType;
    const processTypeAutomaticOutPutHandlingSupport = getProcessTypeAutomaticOutPutHandlingSupport(processType);
    return processTypeAutomaticOutPutHandlingSupport !== FLOW_AUTOMATIC_OUTPUT_HANDLING.UNSUPPORTED;
};

/**
 * @param childReferences
 * @param canvasElementChild
 */
export function updateChildReferences(
    childReferences: UI.ChildReference[] = [],
    canvasElementChild: UI.Element
): UI.ChildReference[] {
    if (!canvasElementChild || !canvasElementChild.guid) {
        throw new Error('Either canvasElementChild or canvasElementChild.guid not defined');
    }
    return [
        ...childReferences,
        {
            childReference: canvasElementChild.guid
        }
    ];
}

/**
 * Computes the deleted canvas element children
 *
 * @param originalCanvasElement - The original canvas element
 * @param canvasElementChildren - The updated canvas element's children
 * @returns The deleted canvas element children
 */
export function getDeletedCanvasElementChildren(
    originalCanvasElement: UI.Element,
    canvasElementChildren: UI.Element[] = []
): UI.ChildElement[] {
    const { guid } = originalCanvasElement;
    const canvasElementFromStore: (UI.Element & { childReferences }) | undefined = getElementByGuid(guid);
    let deletedCanvasElementChildren = [];
    let canvasElementChildReferencesFromStore;

    if (canvasElementFromStore && canvasElementFromStore.childReferences) {
        canvasElementChildReferencesFromStore = canvasElementFromStore.childReferences.map(
            (childReference) => childReference.childReference
        );
    }
    const newCanvasElementChildGuids = canvasElementChildren.map((canvasElementChild) => canvasElementChild.guid);

    if (canvasElementChildReferencesFromStore) {
        deletedCanvasElementChildren = canvasElementChildReferencesFromStore
            .filter((canvasElementChildReferenceGuid) => {
                return !newCanvasElementChildGuids.includes(canvasElementChildReferenceGuid);
            })
            .map((childReference) => getElementByGuid(childReference));
    }

    return deletedCanvasElementChildren;
}
