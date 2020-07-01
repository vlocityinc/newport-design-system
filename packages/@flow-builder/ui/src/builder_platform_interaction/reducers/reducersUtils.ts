// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * Function to get all the nested screen fields and push them into subElementsGuids
 *
 * @param {String} childReference - Guid of the screen field
 * @param {Object} elements - current state of elements in the store
 * @return {String[]} nestedScreenFieldGuids - Array containing guids of the nested screen fields
 */
function _getNestedScreenFieldsToDelete(childReference, elements) {
    const nestedScreenFieldGuids = [];
    const screenField = elements[childReference];
    if (screenField.childReferences) {
        for (let i = 0; i < screenField.childReferences.length; i++) {
            nestedScreenFieldGuids.push(screenField.childReferences[i].childReference);
            nestedScreenFieldGuids.push(
                ..._getNestedScreenFieldsToDelete(screenField.childReferences[i].childReference, elements)
            );
        }
    }

    return nestedScreenFieldGuids;
}

/**
 * Returns an array of subelements guids for a given element.  For example, for a decision, return an array of all
 * outcome guids
 *
 * @param {Object} node element to check for subelements
 * @param {Object} elements - current state of elements in the store
 * @return {String[]} Array of subelement guids for the given element. Can be an empty array
 */
function getSubElementGuids(node, elements) {
    const subElementsGuids = [];

    if (node.elementType === ELEMENT_TYPE.DECISION) {
        for (let i = 0; i < node.childReferences.length; i++) {
            subElementsGuids.push(node.childReferences[i].childReference);
        }
    } else if (node.elementType === ELEMENT_TYPE.SCREEN) {
        for (let i = 0; i < node.childReferences.length; i++) {
            subElementsGuids.push(node.childReferences[i].childReference);
            subElementsGuids.push(..._getNestedScreenFieldsToDelete(node.childReferences[i].childReference, elements));
        }
    } else if (node.elementType === ELEMENT_TYPE.WAIT) {
        for (let i = 0; i < node.childReferences.length; i++) {
            subElementsGuids.push(node.childReferences[i].childReference);
        }
    }

    return subElementsGuids;
}

export { getSubElementGuids };
