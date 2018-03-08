import { deepCopy } from 'builder_platform_interaction-store-lib';
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
    const mutatedElement = mutateEditorElement(deepCopy(state.elements[guid]));
    const hydratedElement = hydrateWithErrors(mutatedElement);

    return hydratedElement;
};
