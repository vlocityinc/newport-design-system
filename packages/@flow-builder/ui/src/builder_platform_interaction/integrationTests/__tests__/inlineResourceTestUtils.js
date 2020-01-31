import { NewResourceEvent } from 'builder_platform_interaction/events';
import { addElement } from 'builder_platform_interaction/actions';
import { Store } from 'builder_platform_interaction/storeLib';

let nextInlineResource;

const newResourceEventListener = () => {
    Store.getStore().dispatch(addElement(nextInlineResource));
    nextInlineResource = undefined;
};

export const addNewResourceEventListener = () => {
    document.addEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);
};

export const removeNewResourceEventListener = () => {
    document.removeEventListener(NewResourceEvent.EVENT_NAME, newResourceEventListener);
};

/**
 * Set the resource node to add to the store when "New Resource" is selected in the combobox
 */
export const setNextInlineResource = resourceNode => {
    nextInlineResource = resourceNode;
};
