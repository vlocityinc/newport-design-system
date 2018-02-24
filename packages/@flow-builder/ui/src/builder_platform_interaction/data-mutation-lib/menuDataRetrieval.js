import {COMBOBOX_ITEM_DISPLAY_TYPE} from "builder_platform_interaction-constant";

// TODO: deal with loading non-flow data for comboboxes

function getCategory(elementType, dataType, isCollection) {
    return (dataType === 'SObject' ? 'SObject ' : '') +
        (isCollection ? 'Collection ' : '') +
        elementType;
}

function getSubText(dataType, objectType, label) {
    let subText;
    if (dataType === 'SObject') {
        subText = objectType;
    } else if (label) {
        subText = label;
    } else {
        subText = dataType;
    }
    return subText;
}

function sortBackwardsByCategoryThenDevName(elemA, elemB) {
    return elemA.category === elemB.category ? elemA.text < elemB.text : elemA.category < elemB.category;
}

/**
 * Gets list of elements to display in combobox, in shape combobox expects
 *
 * @param {Object} elements  all elements in flow
 * @param {Array} guids      guids representing elements to display in combobox
 * @returns {Array}          array of alphabetized objects sorted by category, in shape combobox expects
 */
export function getElementsForMenuData(elements, guids) {
    return guids.map(guid => copyFields(elements[guid]))
        .sort(sortBackwardsByCategoryThenDevName)
        .reduce((acc, elem) => {
            if (!(acc[0] && acc[0].label === elem.category)) {
                const newCategory = {
                    // TODO: use proper labels
                    label: elem.category,
                    items: []
                };
                acc.unshift(newCategory);
            }
            delete elem.category;
            acc[0].items.unshift(elem);
            return acc;
        }, []);
}

/**
 * NOT FOR OUTSIDE USE
 * makes copy of element, with fields as needed by combobox
 *
 * @param {Object} element   element from flow
 * @returns {Object}         representation of flow element in shape combobox needs
 */
export function copyFields(element) {
    const newElement = {};

    newElement.guid = element.guid;
    newElement.text = element.name;
    newElement.value = element.name;
    newElement.type = COMBOBOX_ITEM_DISPLAY_TYPE.OPTION_CARD;
    // TODO: remove upper case-ing once we're using labels for categories
    newElement.category = getCategory(element.elementType, element.dataType, element.isCollection).toUpperCase();
    newElement.subText = getSubText(element.dataType, element.objectType, element.label);
    // TODO: fetch icon
    return newElement;
}
