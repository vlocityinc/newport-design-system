import { deepCopy } from "builder_platform_interaction/storeLib";
import { getConfigForElementType } from "builder_platform_interaction/elementConfig";

import {
    hydrateWithErrors
} from "builder_platform_interaction/dataMutationLib";
import { FACTORY_CONFIG } from "builder_platform_interaction/elementFactory";
import { propertyEditorFactory } from "builder_platform_interaction/propertyEditorFactory";

/**
 * Get element data for property editor for a given guid
 * @param {Object} state of the app containing all elements
 * @param {String} guid of the element to be retrieved
 * @return {Object} element in the shape required by the property editor
 */
export const elementPropertyEditorSelector = (state, guid) => {
    let selectedElement = deepCopy(state.elements[guid]);
    if (selectedElement) {
        const elementType = getConfigForElementType(selectedElement.elementType);
        const blacklistedProperties = elementType.nonHydratableProperties;
        selectedElement = hydrateWithErrors(
            propertyEditorFactory(selectedElement, { [FACTORY_CONFIG.SWAP_GUID_TO_DEV_NAME]: true }),
            blacklistedProperties
        );
    }

    return selectedElement;
};
