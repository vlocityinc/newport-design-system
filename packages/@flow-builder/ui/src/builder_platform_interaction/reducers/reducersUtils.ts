// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * Function to get all the nested screen fields and push them into subElementsGuids
 *
 * @param childReference - Guid of the child element
 * @param elements - current state of elements in the store
 * @returns nestedChildFieldGuids - Array containing guids of the nested child fields
 */
function _getNestedChildGuids(childReference: UI.Guid, elements): UI.Guid[] {
    const nestedChildGuids: UI.Guid[] = [];
    const element: Element = elements[childReference];
    if (element?.childReferences) {
        for (let i = 0; i < element.childReferences.length; i++) {
            nestedChildGuids.push(element.childReferences[i].childReference);
            nestedChildGuids.push(..._getNestedChildGuids(element.childReferences[i].childReference, elements));
        }
    }

    return nestedChildGuids;
}

/**
 * Returns an array of subelements guids for a given element.  If the element has
 * childReferences, then those are used.
 *
 * For screens, all children are return4ed recursively
 *
 * @param node element to check for subelements
 * @param elements - current state of elements in the store
 * @returns  Array of subelement guids for the given element. Can be an empty array
 */
function getSubElementGuids(node, elements): UI.Guid[] {
    const subElementsGuids = [];

    if (node.elementType === ELEMENT_TYPE.SCREEN) {
        for (let i = 0; i < node.childReferences.length; i++) {
            subElementsGuids.push(node.childReferences[i].childReference);
            subElementsGuids.push(..._getNestedChildGuids(node.childReferences[i].childReference, elements));
        }
    } else if (node.childReferences) {
        subElementsGuids.push(...node.childReferences.map((ref) => ref.childReference));
    }

    return subElementsGuids;
}

export { getSubElementGuids };
