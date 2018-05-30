import { deepCopy } from 'builder_platform_interaction-store-lib';
import { getConfigForElementType } from 'builder_platform_interaction-element-config';

import {
    mutateEditorElement,
    hydrateWithErrors
} from 'builder_platform_interaction-data-mutation-lib';

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
            mutateEditorElement(selectedElement, state),
            blacklistedProperties
        );
    }

    return selectedElement;
};
