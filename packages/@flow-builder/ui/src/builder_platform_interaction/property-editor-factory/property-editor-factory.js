import { ELEMENT_TYPE } from 'builder_platform_interaction-flow-metadata';
import { Store } from 'builder_platform_interaction-store-lib';
import { swapUidsForDevNames, swapDevNamesToGuids } from 'builder_platform_interaction-translator-lib';
import { createAssignment, createDecisionWithOutcomes, createVariable, FACTORY_CONFIG } from 'builder_platform_interaction-element-factory';

/**
 * Element factory to create new objects for each element type for the property editors
 *
 * @param {Object} element        Element to be used as the base for copying information
 * @param {Object} config         Config for element creation
 * @return {Object} newElement    New element object with all relevant data
 */
export const propertyEditorFactory = (element, config = {}) => {
    let newElement = {};

    if (element.elementType === ELEMENT_TYPE.ASSIGNMENT) {
        newElement = createAssignment(element);
    } else if (element.elementType === ELEMENT_TYPE.DECISION) {
        newElement = createDecisionWithOutcomes(element);
    } else if (element.elementType === ELEMENT_TYPE.VARIABLE) {
        newElement = createVariable(element);
    }

    if (config[FACTORY_CONFIG.SWAP_GUID_TO_DEV_NAME]) {
        const elements = Store.getStore().getCurrentState().elements;
        swapUidsForDevNames(elements, { [newElement.guid]: newElement }, {enableGuidToDevnameSwappingForReferenceFields: false});
    } else if (config[FACTORY_CONFIG.SWAP_DEV_NAME_TO_GUID]) {
        const elements = Store.getStore().getCurrentState().elements;
        swapDevNamesToGuids(elements, { [newElement.guid]: newElement });
    }

    // TODO Add other element types

    return newElement;
};