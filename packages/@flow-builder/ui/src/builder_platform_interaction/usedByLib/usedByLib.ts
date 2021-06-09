import { EXPRESSION_RE, ELEMENT_TYPE, FlowScreenFieldType } from 'builder_platform_interaction/flowMetadata';
import { Store, isPlainObject } from 'builder_platform_interaction/storeLib';
import { getConfigForElementType } from 'builder_platform_interaction/elementConfig';
import {
    addItem,
    getValueFromHydratedItem,
    dehydrate,
    unionOfArrays,
    omit
} from 'builder_platform_interaction/dataMutationLib';
import { format, splitStringBySeparator, hasOwnProperty } from 'builder_platform_interaction/commonUtils';
import { LABELS } from './usedByLibLabels';
import { invokeModal } from 'builder_platform_interaction/builderUtils';
import { isTemplateField, isReferenceField, shouldCallSwapFunction } from 'builder_platform_interaction/translatorLib';
import { isRegionContainerField, isRegionField } from 'builder_platform_interaction/screenEditorUtils';

// elements may be hydrated
let mapOfChildElements: UI.Elements | UI.HydratedElements = {};

interface ElementsAndFlowProperties {
    elements: UI.Elements | UI.HydratedElements;
    properties?: UI.Properties;
}

export interface UsedByElement {
    guid: UI.Guid;
    label?: string | null;
    name?: string;
    elementGuidsReferenced: UI.Guid[];
    iconName?: string;
    isCanvasElement: boolean;
}

/**
 * This functions return a list of elements which are referencing elements in the elementGuids array.
 *
 * @param elementGuids list of guids to be matched
 * @param elementsAndFlowProperties elements/flow properties where to search for elementGuids. Elements/flow properties in the store by default but a custom list of elements can be provided (may be hydrated)
 * @param options
 * @param options.replaceAnonymousElementByCanvasElement replace anonymous element (automatic fields) by parent canvas element in the returned list
 * @returns list of elements which contains elementGuids
 */
export function usedBy(
    elementGuids: UI.Guid[],
    elementsAndFlowProperties: ElementsAndFlowProperties = Store.getStore().getCurrentState(),
    { replaceAnonymousElementByCanvasElement = true } = {}
) {
    const { elements, properties: flowProps } = elementsAndFlowProperties;
    const updatedElementGuids = insertChildReferences(elementGuids, elements as UI.Elements) || [];

    let result = usedByElements(updatedElementGuids, elements, { replaceAnonymousElementByCanvasElement });
    if (flowProps) {
        result = [...result, ...usedByFlowProperties(updatedElementGuids, flowProps)];
    }
    return result;
}

/**
 * @param elementGuids
 * @param elements
 * @param root0
 * @param root0.replaceAnonymousElementByCanvasElement
 */
function usedByElements(
    elementGuids: UI.Guid[],
    elements: UI.Elements | UI.HydratedElements,
    { replaceAnonymousElementByCanvasElement = true } = {}
) {
    const elementsKeys = Object.keys(elements);
    const usedByElementsMap = elementsKeys.reduce<Map<UI.Guid, Set<UI.Guid>>>((acc, key) => {
        if (!elementGuids.includes(key)) {
            const element = elements[key];
            const elementGuidsReferenced = findReference(
                elementGuids,
                element,
                new Set(),
                getKeysToIgnoreByElementType(element.elementType)
            );
            if (elementGuidsReferenced.size > 0) {
                const usedByElementGuid = key;
                const set = acc.get(usedByElementGuid) || new Set<UI.Guid>();
                acc.set(
                    usedByElementGuid,
                    new Set<UI.Guid>([...set, ...elementGuidsReferenced])
                );
            }
        }
        return acc;
    }, new Map());
    if (replaceAnonymousElementByCanvasElement) {
        const anonymousElementGuids = getAnonymousElements(elements, [...usedByElementsMap.keys()]);
        const parentCanvasElementGuids = getParentCanvasElementGuids(elements, anonymousElementGuids);
        anonymousElementGuids.forEach((anonymousElementGuid) => {
            const usedByElementGuid = parentCanvasElementGuids.get(anonymousElementGuid) || anonymousElementGuid;
            const set = usedByElementsMap.get(usedByElementGuid) || new Set<UI.Guid>();
            const elementGuidsReferenced = usedByElementsMap.get(anonymousElementGuid)!;
            usedByElementsMap.delete(anonymousElementGuid);
            usedByElementsMap.set(
                usedByElementGuid,
                new Set<UI.Guid>([...set, ...elementGuidsReferenced])
            );
        });
    }
    const usedByElements: UsedByElement[] = [];
    for (const [elementGuid, elementGuidsReferenced] of usedByElementsMap.entries()) {
        const element = elements[elementGuid];
        const usedByElement = createUsedByElement({
            element,
            elementGuidsReferenced: [...elementGuidsReferenced]
        });
        usedByElements.push(usedByElement);
    }
    return usedByElements;
}

/**
 * @param elementGuids
 * @param flowProps
 */
function usedByFlowProperties(elementGuids: UI.Guid[], flowProps: UI.Properties) {
    const elementGuidsReferencedByFlowProps = findReference(elementGuids, flowProps);
    const usedByElements: UsedByElement[] = [];
    if (elementGuidsReferencedByFlowProps.size > 0) {
        const label = LABELS.interviewLabelLabel;
        const elementType = ELEMENT_TYPE.FLOW_PROPERTIES;
        const flowPropsElement = {
            elementType,
            guid: elementType,
            label,
            name: label
        };
        const usedByElement = createUsedByElement({
            element: flowPropsElement,
            elementGuidsReferenced: [...elementGuidsReferencedByFlowProps]
        });
        usedByElements.push(usedByElement);
    }
    return usedByElements;
}

/**
 * Returns guids that are guids of anonymous elements (elements without dev name (automatic fields) or with generated dev names (column in a screen section))
 *
 * @param elements
 * @param elementGuids
 */
function getAnonymousElements(elements: UI.Elements | UI.HydratedElements, elementGuids: UI.Guid[]): UI.Guid[] {
    return elementGuids.filter((elementGuid) => {
        const element = elements[elementGuid];
        return (
            element &&
            (isRegionField(element) ||
                (element.elementType === ELEMENT_TYPE.SCREEN_FIELD &&
                    hasOwnProperty(element, 'fieldType') &&
                    element.fieldType === FlowScreenFieldType.ObjectProvided))
        );
    });
}

/**
 * Helper method to invoke the alert modal
 *
 * @param usedByElements - List of elements which are referencing elements in the elementGuidsToBeDeleted array.
 * @param elementGuidsToBeDeleted - Contains GUIDs of all the elements to be deleted
 * @param elementType - Type of the element being deleted
 * @param storeElements - Current state of elements in the store
 */
export function invokeUsedByAlertModal(
    usedByElements: UsedByElement[],
    elementGuidsToBeDeleted: UI.Guid[],
    elementType?: UI.ElementType,
    storeElements: UI.Elements = {}
) {
    const elementGuidsToBeDeletedLength = elementGuidsToBeDeleted && elementGuidsToBeDeleted.length;
    let headerTitle = LABELS.deleteAlertMultiDeleteHeaderTitle;
    let bodyTextOne = LABELS.deleteAlertMultiDeleteBodyTextLabel;
    const listSectionHeader = LABELS.deleteAlertListSectionHeader;
    const listSectionItems = usedByElements;
    const buttonVariant = 'Brand';
    const buttonLabel = LABELS.deleteAlertOkayButtonLabel;

    if (elementGuidsToBeDeletedLength === 1) {
        // When only a single element is being deleted and either the element or it's children are being referenced in the flow
        if (!elementType) {
            const elementToBeDeleted = storeElements[elementGuidsToBeDeleted[0]];
            elementType = elementToBeDeleted && elementToBeDeleted.elementType;
        }
        const elementConfig = getConfigForElementType(elementType);
        if (elementConfig && elementConfig.labels && elementConfig.labels.singular) {
            const label = elementConfig.labels.singular.toLowerCase();
            headerTitle = format(LABELS.deleteAlertSingleDeleteHeaderTitle, label);
            bodyTextOne = format(LABELS.deleteAlertsingleDeleteBodyTextLabel, label);
        }
    }

    if (elementType === ELEMENT_TYPE.CHOICE) {
        headerTitle = LABELS.choiceDisplayTypeWarningHeader;
        bodyTextOne = LABELS.choiceDisplayTypeWarningBody;
    }

    // Invoking the alert modal
    invokeModal({
        headerData: {
            headerTitle
        },
        bodyData: {
            bodyTextOne,
            listSectionHeader,
            listSectionItems
        },
        footerData: {
            buttonOne: {
                buttonVariant,
                buttonLabel
            }
        }
    });
}

/**
 * For a given element, find all elements which reference it, whether in the store or in a parent element's internal
 * state (i.e., outcomes in a decision, wait events in a wait). Note that the parent element will not be included in the
 * result
 *
 * @param guid - guid of the element being checked for usage
 * @param parentGuid - guid of the parent element.  It will not be included in the returned array
 * @param internalElements - array of child elements which will be checked for usage
 * @returns Array of elements which use the specified guid.  This array will never include the parent element
 */
export function usedByStoreAndElementState(
    guid: UI.Guid,
    parentGuid: UI.Guid,
    internalElements: UI.HydratedElement[]
): UsedByElement[] {
    let listOfGuidsToSkipWhenCheckingUsedByGlobally = [parentGuid];
    mapOfChildElements = internalElements.reduce<UI.HydratedElements>((acc, element) => {
        listOfGuidsToSkipWhenCheckingUsedByGlobally = addItem(
            listOfGuidsToSkipWhenCheckingUsedByGlobally,
            element.guid
        );
        acc[element.guid] = element;
        return acc;
    }, {});

    const locallyUsedElements = usedBy([guid, ...getChildElementGuids(mapOfChildElements[guid])], {
        elements: mapOfChildElements
    });
    const globallyUsedElements = usedBy([guid, ...getChildElementGuids(mapOfChildElements[guid])], {
        elements: omit(Store.getStore().getCurrentState().elements, listOfGuidsToSkipWhenCheckingUsedByGlobally),
        properties: Store.getStore().getCurrentState().properties
    });
    return unionOfArrays(locallyUsedElements, globallyUsedElements);
}

/**
 * This function is used by the usedBy function to determine which properties of particular elementType
 * should be skipped when searching for references across the elements currently stored in the data model.
 *
 * @param elementType The type of the element in which we are searching for references
 * @returns the keys (property names) to be skipped for the given elementType
 */
function getKeysToIgnoreByElementType(elementType?: string): string[] {
    const keysToIgnore: string[] = [];
    if (elementType === ELEMENT_TYPE.SCREEN_FIELD) {
        keysToIgnore.push('fields');
    }
    return keysToIgnore;
}

/**
 * @param element
 */
function isHydratedElementWithFields(
    element: UI.HydratedElement
): element is UI.HydratedElement & { fields: { guid: UI.Guid }[] } {
    // screen or screen field
    return hasOwnProperty(element, 'fields') && Array.isArray(element.fields);
}

/**
 * This function gets all the nested children element guids
 * (e.g if a section/column is deleted, will also get its children's guids)
 *
 * @param element
 * @returns list of children element guids
 */
function getChildElementGuids(element: UI.HydratedElement): UI.Guid[] {
    let childElementGuids: UI.Guid[] = [];
    if (element && isHydratedElementWithFields(element)) {
        element.fields.forEach((field) => {
            if (field && field.guid) {
                childElementGuids.push(field.guid);
            }
            childElementGuids = [...childElementGuids, ...getChildElementGuids(field)];
        });
    }
    return childElementGuids;
}

/**
 * This function add any child references(e.g outcomes, wait event, screen fields etc) in the elementGuids array
 *
 * @param elementGuids list of guids to be matched
 * @param elements list of elements in the store
 * @returns elementGuids updated elementGuids array
 */
function insertChildReferences(elementGuids: UI.Guid[], elements: UI.Elements): UI.Guid[] {
    return elementGuids.reduce<UI.Guid[]>(
        (acc, elementGuid) => {
            const element = elements[elementGuid];
            if (!element) {
                return acc;
            }

            if (
                isScreenElementWithChild(element) ||
                isRegionContainerFieldWithChildReferences(element) ||
                isRegionFieldWithChildReferences(element)
            ) {
                element.childReferences.forEach((child) => {
                    acc = [...acc, ...insertChildReferences([child.childReference], elements)];
                });
            }

            if (isCanvasElementWithChildReferences(element)) {
                const childReferences = element.childReferences.map(({ childReference }) => {
                    return childReference;
                });
                acc = [...acc, ...childReferences];
            }
            return acc;
        },
        [...elementGuids]
    );
}

/**
 * @param element
 */
function isCanvasElementWithChildReferences(
    element: UI.Element
): element is UI.Element & { childReferences: UI.ChildReference[] } {
    const elementType = element.elementType;
    return (
        (elementType === ELEMENT_TYPE.DECISION ||
            elementType === ELEMENT_TYPE.WAIT ||
            elementType === ELEMENT_TYPE.SCREEN) &&
        isElementWithChildReferences(element)
    );
}

/**
 * @param element
 */
function isRegionContainerFieldWithChildReferences(
    element: UI.Element
): element is UI.Element & { childReferences: UI.ChildReference[] } {
    return isRegionContainerField(element) && isElementWithChildReferences(element);
}

/**
 * @param element
 */
function isRegionFieldWithChildReferences(
    element: UI.Element
): element is UI.Element & { childReferences: UI.ChildReference[] } {
    return isRegionField(element) && isElementWithChildReferences(element);
}

/**
 * @param element
 */
function isScreenElementWithChild(
    element: UI.Element
): element is UI.Element & { childReferences: UI.ChildReference[] } {
    const elementType = element.elementType;
    return elementType === ELEMENT_TYPE.SCREEN && isElementWithChildReferences(element);
}

/**
 * @param elements
 * @param elementsGuids
 */
function getParentCanvasElementGuids(
    elements: UI.Elements | UI.HydratedElements,
    elementsGuids: UI.Guid[]
): Map<UI.Guid, UI.Guid> {
    if (elementsGuids.length === 0) {
        return new Map();
    }
    const elementsGuidsSet = new Set(elementsGuids);
    return Object.keys(elements).reduce<Map<UI.Guid, UI.Guid>>((childToParentMap, elementGuid) => {
        const element = elements[elementGuid];
        if (isCanvasElementWithChildReferences(element as UI.Element)) {
            getChildrenElementsGuidsRecursively(
                elements as UI.Elements,
                elementGuid,
                elementsGuidsSet
            ).forEach((childGuid) => childToParentMap.set(childGuid, elementGuid));
        }
        return childToParentMap;
    }, new Map());
}

/**
 * @param element
 */
function isElementWithChildReferences(
    element: UI.Element
): element is UI.Element & { childReferences: UI.ChildReference[] } {
    return hasOwnProperty(element, 'childReferences') && Array.isArray(element.childReferences);
}

/**
 * @param elements
 * @param elementGuid
 * @param childrenCandidates
 */
function getChildrenElementsGuidsRecursively(
    elements: UI.Elements,
    elementGuid: UI.Guid,
    childrenCandidates?: Set<UI.Guid>
): UI.Guid[] {
    const element = elements[elementGuid];
    if (!isElementWithChildReferences(element)) {
        return [];
    }
    return element.childReferences.reduce<UI.Guid[]>((acc, { childReference }) => {
        if (childrenCandidates && childrenCandidates.has(childReference)) {
            return [
                ...acc,
                childReference,
                ...getChildrenElementsGuidsRecursively(elements, childReference, childrenCandidates)
            ];
        }
        return [...acc, ...getChildrenElementsGuidsRecursively(elements, childReference, childrenCandidates)];
    }, []);
}

/**
 * This function is called recursively to find if a list of elements are referenced in the object.
 *
 * @param elementGuids list of elementGuids to be matched
 * @param object object to be searched (hydrated or not)
 * @param elementGuidsReferenced set of element guids which are being referenced in an element
 * @param keysToIgnore set of properties that should be skipped when searching for references across the object
 * @returns list of elementGuids referenced in the object
 */
function findReference(
    elementGuids: UI.Guid[],
    object: Object,
    elementGuidsReferenced: Set<UI.Guid> = new Set(),
    keysToIgnore: string[] = []
): Set<UI.Guid> {
    if (Array.isArray(object)) {
        const objectLength = object && object.length;
        for (let index = 0; index < objectLength; index += 1) {
            findReference(elementGuids, object[index], elementGuidsReferenced, keysToIgnore);
        }
    } else if (isPlainObject(object)) {
        const keys = Object.keys(object);
        const keysLength = keys && keys.length;
        for (let index = 0; index < keysLength; index += 1) {
            const key = keys[index];
            if (!keysToIgnore.includes(key)) {
                const value = getValueFromHydratedItem(object[key]);
                if (shouldCallSwapFunction(object, key, value)) {
                    matchElement(elementGuids, object, key, value).forEach((elementGuid) =>
                        elementGuidsReferenced.add(elementGuid)
                    );
                } else if (typeof value !== 'number') {
                    findReference(elementGuids, value, elementGuidsReferenced, keysToIgnore);
                }
            }
        }
    }
    return elementGuidsReferenced;
}

/**
 * This function returns the devName of the given element
 *
 * @param element Element object (hydrated or not)
 * @returns the devName of the element
 */
function getElementDevName(element: UI.Element | UI.HydratedElement) {
    let devName = '';
    if (element && element.name) {
        devName = getValueFromHydratedItem(element.name);
    }
    return devName;
}

/**
 * This function returns the guid associated with any passed devName. Merge Fields, for example, contain devNames instead of the guid.
 * This is useful in finding any referenced sibling elements in an ongoing property editor session.
 *
 * @param guidOrDevName - Guid or Devname of the referenced element
 * @returns the guid or converts the devname to it's matching guid and returns that
 */
function updateDevNameToGuid(guidOrDevName: UI.Guid | string = ''): UI.Guid {
    let childElementGuid = guidOrDevName;
    if (mapOfChildElements && Object.values(mapOfChildElements).length > 0) {
        const childElements = Object.values(mapOfChildElements);
        const childElementsLength = childElements.length;
        for (let index = 0; index < childElementsLength; index++) {
            if (getElementDevName(childElements[index]) === childElementGuid) {
                childElementGuid = childElements[index].guid;
            }
        }
    }

    return childElementGuid;
}

/**
 * This function checks if some element guids are present in an object
 *
 * @param elementGuids list of elements to be matched
 * @param object the object
 * @param key key of the object
 * @param value value of the object
 * @returns the guids that are present in the object, an empty array if none
 */
function matchElement(elementGuids: UI.Guid[], object: Object, key: string, value: any): UI.Guid[] {
    if (key) {
        if (isTemplateField(object, key)) {
            // For eg: value = 'Hello world, {!var_1.name}'
            // After match, occurrences = ['{!var_1.name}']
            // After slice and split, occurences = ['var_1']
            const occurences = (value as string).match(EXPRESSION_RE);
            if (occurences) {
                return occurences
                    .map((occurence) =>
                        updateDevNameToGuid(splitStringBySeparator(occurence.slice(2, occurence.length - 1))[0])
                    )
                    .filter((guid) => elementGuids.includes(guid));
            }
        } else if (isReferenceField(object, key)) {
            const guid = splitStringBySeparator(value)[0];
            return elementGuids && elementGuids.filter((elementGuid) => guid === elementGuid);
        }
    }
    return [];
}

/**
 * Factory function to generate used by element.
 *
 * @param element.element
 * @param element from the store
 * @param elementGuidsReferenced list of element which element is referencing
 * @param element.elementGuidsReferenced
 * @returns new object with selected properties
 */
export function createUsedByElement({
    element,
    elementGuidsReferenced
}: {
    element: UI.Element | UI.HydratedElement;
    elementGuidsReferenced: UI.Guid[];
}): UsedByElement {
    const elementConfig = getConfigForElementType(element.elementType);
    const guid = element.guid;
    const label = element.label;
    const name = element.name;
    const isCanvasElement = (elementConfig && elementConfig.canvasElement) || false;
    let iconName: string | undefined;
    if (elementConfig && elementConfig.nodeConfig && elementConfig.nodeConfig.iconName) {
        iconName = elementConfig.nodeConfig.iconName;
    }

    return dehydrate({
        guid,
        label,
        name,
        elementGuidsReferenced,
        iconName,
        isCanvasElement
    });
}
