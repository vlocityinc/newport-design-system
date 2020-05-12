// @ts-nocheck
import { ELEMENT_TYPE } from 'builder_platform_interaction/flowMetadata';

/**
 * Function to get all the nested screen fields and push them into subElementsGuids
 *
 * @param {String} fieldReference - Guid of the screen field
 * @param {Object} elements - current state of elements in the store
 * @return {String[]} nestedScreenFieldGuids - Array containing guids of the nested screen fields
 */
function _getNestedScreenFieldsToDelete(fieldReference, elements) {
    const nestedScreenFieldGuids = [];
    const screenField = elements[fieldReference];
    if (screenField.fieldReferences) {
        for (let i = 0; i < screenField.fieldReferences.length; i++) {
            nestedScreenFieldGuids.push(screenField.fieldReferences[i].fieldReference);
            nestedScreenFieldGuids.push(
                ..._getNestedScreenFieldsToDelete(screenField.fieldReferences[i].fieldReference, elements)
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
        for (let i = 0; i < node.outcomeReferences.length; i++) {
            subElementsGuids.push(node.outcomeReferences[i].outcomeReference);
        }
    } else if (node.elementType === ELEMENT_TYPE.SCREEN) {
        for (let i = 0; i < node.fieldReferences.length; i++) {
            subElementsGuids.push(node.fieldReferences[i].fieldReference);
            subElementsGuids.push(..._getNestedScreenFieldsToDelete(node.fieldReferences[i].fieldReference, elements));
        }
    } else if (node.elementType === ELEMENT_TYPE.WAIT) {
        for (let i = 0; i < node.waitEventReferences.length; i++) {
            subElementsGuids.push(node.waitEventReferences[i].waitEventReference);
        }
    }

    return subElementsGuids;
}

export { getSubElementGuids };
