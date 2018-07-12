import { TEMPLATE_FIELDS, REFERENCE_FIELDS, EXPRESSION_RE, ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { isPlainObject } from 'builder_platform_interaction-store-lib';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';
import { addItem} from 'builder_platform_interaction-data-mutation-lib';

/**
 * This function return list of elements which are referencing elements in the elementGuids array.
 * @param {String[]} elementGuids list of guids to be matched
 * @param {Object} elements list of elements in the store
 * @returns {Object[]} usedByElements list of elements which contains elementGuids
 */
export function usedBy(elementGuids = [], elements = {}) {
    const updatedElementGuids = insertChildReferences(elementGuids, elements);
    const usedByElements = Object.keys(elements).reduce((acc, key) => {
        if (!elementGuids.includes(key)) {
            const elementGuidsReferenced = findReference(updatedElementGuids, elements[key]);
            if (elementGuidsReferenced.size > 0) {
                const usedByElement = createUsedByElement({
                    element: elements[key],
                    elementGuidsReferenced: [...elementGuidsReferenced]
                });
                return [...acc, usedByElement];
            }
        }
        return acc;
    }, []);
    return usedByElements;
}

/**
 * This function add any child references(e.g outcomes, wait event, screen fields etc) in the elementGuids array
 * @param {String[]} elementGuids list of guids to be matched
 * @param {Object} elements list of elements in the store
 * @returns {Array} elementGuids updated elementGuids array
 */
function insertChildReferences(elementGuids, elements) {
    return elementGuids.reduce((acc, elementGuid) => {
        const element = elements[elementGuid];
        if (element.elementType === ELEMENT_TYPE.DECISION) {
            const outcomeReferences = element.outcomeReferences.map(({outcomeReference}) => {
                return outcomeReference;
            });
            acc = [...acc, ...outcomeReferences];
        } else if (element.elementType === ELEMENT_TYPE.WAIT) {
            // TODO: update once wait element is added: W-5139646
        } else if (element.elementType === ELEMENT_TYPE.SCREEN) {
            // TODO: update once screen element is normalized in the store: W-5139658
        }
        return addItem(acc, elementGuid);
    }, []);
}

/**
 * This function is called recursively to find if a list of elements are referenced in the object.
 * @param {String[]} elementGuids list of elementGuids to be matched
 * @param {Object} object object to be searched
 * @param {String[]} elementGuidsReferenced set of element guids which are being referenced in an element
 * @returns {Boolean} true if elementGuids is used in the object
 */
function findReference(elementGuids, object, elementGuidsReferenced = new Set()) {
    if (Array.isArray(object)) {
        const objectLength = object.length;
        for (let index = 0; index < objectLength; index += 1) {
            findReference(elementGuids, object[index], elementGuidsReferenced);
        }
    } else if (isPlainObject(object)) {
        const keys = Object.keys(object);
        const keysLength = keys.length;
        for (let index = 0; index < keysLength; index += 1) {
            const key = keys[index];
            const value = object[key];
            if (typeof (value) === 'string') {
                const newElementGuidsReferenced = matchElement(elementGuids, key, value);
                updateElementGuidsReferenced(elementGuidsReferenced, newElementGuidsReferenced);
            } else if (typeof (value) !== 'number') {
                findReference(elementGuids, value, elementGuidsReferenced);
            }
        }
    }
    return elementGuidsReferenced;
}

/**
 * This function checks if the elementGuid is present or not
 * @param {String[]} elementGuids list of elements to be matched
 * @param {String} key key of the object
 * @param {String} value value of the object
 * @returns {Boolean} true if elementGuids is matched
 */
function matchElement(elementGuids, key, value) {
    if (key && REFERENCE_FIELDS.has(key)) {
        return elementGuids.filter((elementGuid) => (elementGuid === value));
    } else if (key && TEMPLATE_FIELDS.has(key)) {
        const occurences = value.match(EXPRESSION_RE);
        if (occurences) {
            return occurences.map((occurence) => occurence.slice(2, occurence.length - 1)).filter((occurence) => elementGuids.includes(occurence));
        }
    }
    return [];
}

/**
 * This function updates elementGuidsReferenced set which is a list of unique elementGuids.
 * @param {Set} elementGuidsReferenced set of unique elementGuids
 * @param {String[]} newElementGuidsReferenced list of new elementGuids which are referenced
 * @return {Set} elementGuidsReferenced updated set of unique elementGuids
 */
function updateElementGuidsReferenced(elementGuidsReferenced, newElementGuidsReferenced) {
    const newElementGuidsReferenceLength = newElementGuidsReferenced.length;
    for (let index = 0; index < newElementGuidsReferenceLength; index++) {
        elementGuidsReferenced.add(newElementGuidsReferenced[index]);
    }
    return elementGuidsReferenced;
}

/**
 * Factory function to generate used by element.
 * @param {Object} element from the store
 * @param {Array} referencing list of element which element is referencing
 * @returns {Object} usedByElement return new object with selected properties
 */
function createUsedByElement({element, elementGuidsReferenced}) {
    const elementConfig = getConfigForElementType(element.elementType);
    const guid = element.guid;
    const label = element.label;
    const name = element.name;
    let iconName;
    if (elementConfig && elementConfig.nodeConfig && elementConfig.nodeConfig.iconName) {
        iconName = elementConfig.nodeConfig.iconName;
    }

    return {
        guid,
        label,
        name,
        elementGuidsReferenced,
        iconName
    };
}